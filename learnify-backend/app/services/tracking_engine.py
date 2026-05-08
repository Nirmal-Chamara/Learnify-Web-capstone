from datetime import datetime
from app.models.work_session import WorkSession
from app.models.task import Task


def compute_session_status(session: WorkSession) -> str:
    now = datetime.utcnow()

    if session.scheduled_start > now:
        return "PENDING"

    task = Task.query.get(session.task_id)

    if task.progress_percent == 100 or task.is_submitted:
        return "COMPLETED"

    if session.actual_start and not session.actual_end:
        return "IN_PROGRESS"

    if session.scheduled_end < now:
        if not session.actual_start:
            return "MISSED"
        time_ratio = session.time_spent_minutes / max(session.duration_minutes, 1)
        if task.progress_percent >= 80 and time_ratio >= 0.7:
            return "COMPLETED"
        elif task.progress_percent > 0 or time_ratio >= 0.3:
            return "PARTIALLY_WORKED"
        else:
            return "MISSED"

    return "PENDING"
