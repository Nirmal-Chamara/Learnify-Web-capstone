"""
analytics_service.py
────────────────────
Central analytics logic for the Learnify dashboard.
Computes:
  • study_streak_days   – consecutive calendar days the student studied
  • focus_score         – 0-100 rating based on session completion rate this week
  • semester_goal_pct   – stored on student_profiles, reflects overall goal progress
  • total_study_hours   – lifetime completed study minutes → hours
"""
from datetime import date, datetime, timedelta
from sqlalchemy import text
from app.extensions import db


# ── Student Profile Helper ──────────────────────────────────────────────────
def ensure_student_profile(user_id: int) -> None:
    """
    Ensure the user has a record in student_profiles if they are a student.
    """
    try:
        row = db.session.execute(
            text("SELECT id FROM student_profiles WHERE user_id = :uid"),
            {"uid": user_id}
        ).fetchone()
        if not row:
            # Check if user exists and is a student
            user_row = db.session.execute(
                text("SELECT role FROM users WHERE id = :uid"),
                {"uid": user_id}
            ).fetchone()
            if user_row and user_row[0] == "student":
                db.session.execute(
                    text(
                        "INSERT INTO student_profiles (user_id, available_hours_per_week, study_streak_days, total_points, semester_goal_pct) "
                        "VALUES (:uid, 0, 0, 0, 0.0)"
                    ),
                    {"uid": user_id}
                )
                db.session.commit()
    except Exception:
        db.session.rollback()


# ── Study Streak ────────────────────────────────────────────────────────────
def compute_study_streak(user_id: int) -> int:
    """
    Count the number of consecutive calendar days (ending today or yesterday)
    on which the student completed at least one study session.
    Returns an integer >= 0.
    """
    ensure_student_profile(user_id)
    try:
        rows = db.session.execute(
            text(
                "SELECT DISTINCT DATE(start_time) AS study_date "
                "FROM study_sessions "
                "WHERE student_id = :uid AND completed = 1 "
                "ORDER BY study_date DESC "
                "LIMIT 365"
            ),
            {"uid": user_id},
        ).fetchall()

        if not rows:
            db.session.execute(
                text("UPDATE student_profiles SET study_streak_days = 0 WHERE user_id = :uid"),
                {"uid": user_id}
            )
            db.session.commit()
            return 0

        # Normalize to Python date
        clean_dates = []
        for row in rows:
            d = row[0]
            val = None
            if isinstance(d, datetime):
                val = d.date()
            elif isinstance(d, date):
                val = d
            elif isinstance(d, str):
                try:
                    val = datetime.strptime(d.split()[0], "%Y-%m-%d").date()
                except ValueError:
                    pass
            if val and val not in clean_dates:
                clean_dates.append(val)

        clean_dates.sort(reverse=True)

        if not clean_dates:
            db.session.execute(
                text("UPDATE student_profiles SET study_streak_days = 0 WHERE user_id = :uid"),
                {"uid": user_id}
            )
            db.session.commit()
            return 0

        today = date.today()
        
        # If the latest study session is older than yesterday, the streak is broken
        if clean_dates[0] < today - timedelta(days=1):
            db.session.execute(
                text("UPDATE student_profiles SET study_streak_days = 0 WHERE user_id = :uid"),
                {"uid": user_id}
            )
            db.session.commit()
            return 0

        streak = 0
        expected = clean_dates[0]

        for d in clean_dates:
            if d == expected:
                streak += 1
                expected -= timedelta(days=1)
            elif d < expected:
                # Gap found — streak ends
                break

        # Save computed streak back to profile
        db.session.execute(
            text(
                "UPDATE student_profiles "
                "SET study_streak_days = :streak "
                "WHERE user_id = :uid"
            ),
            {"streak": streak, "uid": user_id}
        )
        db.session.commit()

        return streak
    except Exception:
        db.session.rollback()
        return 0


# ── Focus Score ─────────────────────────────────────────────────────────────
def compute_focus_score(user_id: int) -> int:
    """
    Weekly focus score (0–100).
    Formula: (completed_sessions / total_sessions) * 100 for the last 7 days.
    If no sessions exist this week, fall back to the last 30 days.
    Returns an integer 0-100.
    """
    ensure_student_profile(user_id)
    try:
        week_ago = datetime.now() - timedelta(days=7)
        row = db.session.execute(
            text(
                "SELECT "
                "  COUNT(*) AS total, "
                "  SUM(completed) AS done "
                "FROM study_sessions "
                "WHERE student_id = :uid AND start_time >= :since"
            ),
            {"uid": user_id, "since": week_ago},
        ).fetchone()

        total = int(row[0]) if row and row[0] else 0
        done  = int(row[1]) if row and row[1] else 0

        if total == 0:
            # Fall back to 30-day window
            month_ago = datetime.now() - timedelta(days=30)
            row = db.session.execute(
                text(
                    "SELECT COUNT(*) AS total, SUM(completed) AS done "
                    "FROM study_sessions "
                    "WHERE student_id = :uid AND start_time >= :since"
                ),
                {"uid": user_id, "since": month_ago},
            ).fetchone()
            total = int(row[0]) if row and row[0] else 0
            done  = int(row[1]) if row and row[1] else 0

        if total == 0:
            return 0

        return round((done / total) * 100)
    except Exception:
        return 0


# ── Semester Goal % ─────────────────────────────────────────────────────────
def get_semester_goal_pct(user_id: int) -> float:
    """
    Returns the semester_goal_pct stored on the student's profile.
    Falls back to computing it from task completion rate if the stored
    value is 0 (i.e. not yet set by the user).
    """
    ensure_student_profile(user_id)
    try:
        row = db.session.execute(
            text(
                "SELECT semester_goal_pct FROM student_profiles "
                "WHERE user_id = :uid"
            ),
            {"uid": user_id},
        ).fetchone()

        stored_pct = float(row[0]) if row and row[0] is not None else 0.0

        if stored_pct > 0:
            return round(stored_pct, 1)

        # Derive from task completion
        row2 = db.session.execute(
            text(
                "SELECT "
                "  COUNT(*) AS total, "
                "  SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS done "
                "FROM tasks "
                "WHERE student_id = :uid"
            ),
            {"uid": user_id},
        ).fetchone()

        total = int(row2[0]) if row2 and row2[0] else 0
        done  = int(row2[1]) if row2 and row2[1] else 0

        if total == 0:
            return 0.0

        return round((done / total) * 100, 1)
    except Exception:
        return 0.0


# ── Total Study Hours ────────────────────────────────────────────────────────
def compute_total_study_hours(user_id: int) -> float:
    """
    Sum of duration_min for all completed study sessions → hours (rounded to 1 dp).
    """
    ensure_student_profile(user_id)
    try:
        row = db.session.execute(
            text(
                "SELECT COALESCE(SUM(duration_min), 0) "
                "FROM study_sessions "
                "WHERE student_id = :uid AND completed = 1"
            ),
            {"uid": user_id},
        ).fetchone()
        total_min = float(row[0]) if row and row[0] else 0.0
        return round(total_min / 60, 1)
    except Exception:
        return 0.0


# ── Full Analytics Bundle ────────────────────────────────────────────────────
def get_analytics_bundle(user_id: int) -> dict:
    """
    Returns all analytics values in a single dict so the dashboard
    route only needs one call.
    """
    return {
        "study_streak_days":  compute_study_streak(user_id),
        "focus_score":        compute_focus_score(user_id),
        "semester_goal_pct":  get_semester_goal_pct(user_id),
        "total_study_hours":  compute_total_study_hours(user_id),
    }
