import unittest
from datetime import date, datetime, timedelta
from app import create_app
from app.extensions import db
from app.services.analytics_service import (
    compute_study_streak,
    compute_focus_score,
    get_semester_goal_pct,
    compute_total_study_hours,
    get_analytics_bundle,
    ensure_student_profile
)
from sqlalchemy import text


class AnalyticsServiceTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app("development")
        self.app_context = self.app.app_context()
        self.app_context.push()

        # Clean up any existing test users to prevent unique constraint violations
        db.session.execute(text("DELETE FROM users WHERE email LIKE 'test_%'"))
        db.session.commit()

        # Create a test student user
        db.session.execute(
            text(
                "INSERT INTO users (name, email, password_hash, role, status) "
                "VALUES ('Test Student', 'test_student@learnify.com', 'dummy_hash', 'student', 'active')"
            )
        )
        db.session.commit()

        # Get test student's user ID
        row = db.session.execute(
            text("SELECT id FROM users WHERE email = 'test_student@learnify.com'")
        ).fetchone()
        self.user_id = row[0]

        # Ensure student profile is created
        ensure_student_profile(self.user_id)

        # Get student profile ID
        profile_row = db.session.execute(
            text("SELECT id FROM student_profiles WHERE user_id = :uid"),
            {"uid": self.user_id}
        ).fetchone()
        self.profile_id = profile_row[0]

        # Ensure there is at least one subject in DB
        subject_row = db.session.execute(text("SELECT id FROM subjects LIMIT 1")).fetchone()
        if subject_row:
            self.subject_id = subject_row[0]
        else:
            db.session.execute(
                text("INSERT INTO subjects (name, color_hex) VALUES ('Test Subject', '#FFFFFF')")
            )
            db.session.commit()
            subject_row = db.session.execute(text("SELECT id FROM subjects LIMIT 1")).fetchone()
            self.subject_id = subject_row[0]

        # Enroll test student in subject
        db.session.execute(
            text(
                "INSERT IGNORE INTO student_subjects (student_id, subject_id) "
                "VALUES (:spid, :subid)"
            ),
            {"spid": self.profile_id, "subid": self.subject_id}
        )
        db.session.commit()

    def tearDown(self):
        # Delete test database records
        db.session.execute(text("DELETE FROM study_sessions WHERE student_id = :uid"), {"uid": self.user_id})
        db.session.execute(text("DELETE FROM tasks WHERE student_id = :uid"), {"uid": self.user_id})
        db.session.execute(text("DELETE FROM student_subjects WHERE student_id = :spid"), {"spid": self.profile_id})
        db.session.execute(text("DELETE FROM student_profiles WHERE user_id = :uid"), {"uid": self.user_id})
        db.session.execute(text("DELETE FROM users WHERE id = :uid"), {"uid": self.user_id})
        db.session.commit()
        self.app_context.pop()

    def test_study_streak_empty(self):
        # No study sessions logged
        self.assertEqual(compute_study_streak(self.user_id), 0)

    def test_study_streak_today_only(self):
        # 1 completed study session today
        today = datetime.now()
        db.session.execute(
            text(
                "INSERT INTO study_sessions (student_id, subject_id, start_time, end_time, duration_min, session_type, completed) "
                "VALUES (:uid, :subid, :start, :end, 60, 'study', 1)"
            ),
            {"uid": self.user_id, "subid": self.subject_id, "start": today, "end": today + timedelta(hours=1)}
        )
        db.session.commit()
        self.assertEqual(compute_study_streak(self.user_id), 1)

    def test_study_streak_consecutive(self):
        # Completed sessions today and yesterday
        today = datetime.now()
        yesterday = today - timedelta(days=1)
        
        # Today's session
        db.session.execute(
            text(
                "INSERT INTO study_sessions (student_id, subject_id, start_time, end_time, duration_min, session_type, completed) "
                "VALUES (:uid, :subid, :start, :end, 60, 'study', 1)"
            ),
            {"uid": self.user_id, "subid": self.subject_id, "start": today, "end": today + timedelta(hours=1)}
        )
        # Yesterday's session
        db.session.execute(
            text(
                "INSERT INTO study_sessions (student_id, subject_id, start_time, end_time, duration_min, session_type, completed) "
                "VALUES (:uid, :subid, :start, :end, 60, 'study', 1)"
            ),
            {"uid": self.user_id, "subid": self.subject_id, "start": yesterday, "end": yesterday + timedelta(hours=1)}
        )
        db.session.commit()
        self.assertEqual(compute_study_streak(self.user_id), 2)

    def test_study_streak_yesterday_only(self):
        # Completed session yesterday, but none today
        yesterday = datetime.now() - timedelta(days=1)
        db.session.execute(
            text(
                "INSERT INTO study_sessions (student_id, subject_id, start_time, end_time, duration_min, session_type, completed) "
                "VALUES (:uid, :subid, :start, :end, 60, 'study', 1)"
            ),
            {"uid": self.user_id, "subid": self.subject_id, "start": yesterday, "end": yesterday + timedelta(hours=1)}
        )
        db.session.commit()
        self.assertEqual(compute_study_streak(self.user_id), 1)

    def test_study_streak_broken(self):
        # Completed session 2 days ago, none yesterday or today
        two_days_ago = datetime.now() - timedelta(days=2)
        db.session.execute(
            text(
                "INSERT INTO study_sessions (student_id, subject_id, start_time, end_time, duration_min, session_type, completed) "
                "VALUES (:uid, :subid, :start, :end, 60, 'study', 1)"
            ),
            {"uid": self.user_id, "subid": self.subject_id, "start": two_days_ago, "end": two_days_ago + timedelta(hours=1)}
        )
        db.session.commit()
        self.assertEqual(compute_study_streak(self.user_id), 0)

    def test_focus_score_calculations(self):
        # 4 sessions total, 3 completed in the last 7 days -> 75% focus score
        now = datetime.now()
        
        # 3 completed sessions
        for i in range(3):
            db.session.execute(
                text(
                    "INSERT INTO study_sessions (student_id, subject_id, start_time, end_time, duration_min, session_type, completed) "
                    "VALUES (:uid, :subid, :start, :end, 60, 'study', 1)"
                ),
                {"uid": self.user_id, "subid": self.subject_id, "start": now - timedelta(hours=i*2), "end": now - timedelta(hours=i*2 - 1)}
            )
            
        # 1 uncompleted session
        db.session.execute(
            text(
                "INSERT INTO study_sessions (student_id, subject_id, start_time, end_time, duration_min, session_type, completed) "
                "VALUES (:uid, :subid, :start, :end, 60, 'study', 0)"
            ),
            {"uid": self.user_id, "subid": self.subject_id, "start": now - timedelta(hours=10), "end": now - timedelta(hours=9)}
        )
        db.session.commit()
        
        self.assertEqual(compute_focus_score(self.user_id), 75)

    def test_semester_goal_pct_stored(self):
        # Set a goal percent directly on profile
        db.session.execute(
            text("UPDATE student_profiles SET semester_goal_pct = 82.5 WHERE user_id = :uid"),
            {"uid": self.user_id}
        )
        db.session.commit()
        self.assertEqual(get_semester_goal_pct(self.user_id), 82.5)

    def test_semester_goal_pct_derived(self):
        # Ensure goal in profile is 0
        db.session.execute(
            text("UPDATE student_profiles SET semester_goal_pct = 0.0 WHERE user_id = :uid"),
            {"uid": self.user_id}
        )
        
        # Add 5 tasks, 2 completed -> 40% goal completion
        for i in range(2):
            db.session.execute(
                text(
                    "INSERT INTO tasks (student_id, subject_id, title, due_date, status, completion_pct) "
                    "VALUES (:uid, :subid, :title, :due, 'done', 100)"
                ),
                {"uid": self.user_id, "subid": self.subject_id, "title": f"Done Task {i}", "due": date.today()}
            )
        for i in range(3):
            db.session.execute(
                text(
                    "INSERT INTO tasks (student_id, subject_id, title, due_date, status, completion_pct) "
                    "VALUES (:uid, :subid, :title, :due, 'todo', 0)"
                ),
                {"uid": self.user_id, "subid": self.subject_id, "title": f"Todo Task {i}", "due": date.today()}
            )
        db.session.commit()
        
        self.assertEqual(get_semester_goal_pct(self.user_id), 40.0)


if __name__ == "__main__":
    unittest.main()
