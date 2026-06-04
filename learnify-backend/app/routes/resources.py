from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.extensions import db
from app.models.resource import Resource
from app.models.subject import Subject
from app.models.file_type import FileType
from app.utils.response_utils import success_response, error_response

bp = Blueprint("resources", __name__)


# ── Helper — Get current user role from JWT ───────────────
def get_current_role():
    claims = get_jwt()
    return claims.get("role")


# ── GET /api/resources ────────────────────────────────────
# Returns all published resources
# Any logged in user can access this
@bp.route("", methods=["GET"])
@jwt_required()
def get_resources():
    # Get optional filter params from URL
    # Example: /api/resources?subject_id=1&file_type_id=2
    subject_id   = request.args.get("subject_id",   type=int)
    file_type_id = request.args.get("file_type_id", type=int)
    search       = request.args.get("search",       type=str)

    # Start with base query — only published resources
    query = Resource.query.filter_by(status="published")

    # Apply filters if provided
    if subject_id:
        query = query.filter_by(subject_id=subject_id)
    if file_type_id:
        query = query.filter_by(file_type_id=file_type_id)
    if search:
        query = query.filter(Resource.title.ilike(f"%{search}%"))

    # Order by newest first
    resources = query.order_by(Resource.uploaded_at.desc()).all()

    # Build response with extra details (subject name, file type name)
    result = []
    for r in resources:
        data = r.to_dict()
        # Add subject name
        subject   = Subject.query.get(r.subject_id)
        file_type = FileType.query.get(r.file_type_id)
        data["subject_name"]   = subject.name   if subject   else None
        data["file_type_name"] = file_type.name if file_type else None
        result.append(data)

    return success_response(data=result)


# ── GET /api/resources/<id> ───────────────────────────────
# Returns a single resource by ID
@bp.route("/<int:resource_id>", methods=["GET"])
@jwt_required()
def get_resource(resource_id):
    resource = Resource.query.get(resource_id)

    if not resource:
        return error_response("NOT_FOUND", "Resource not found", status=404)

    # Increment view count every time someone opens a resource
    resource.view_count += 1
    db.session.commit()

    data          = resource.to_dict()
    subject       = Subject.query.get(resource.subject_id)
    file_type     = FileType.query.get(resource.file_type_id)
    data["subject_name"]   = subject.name   if subject   else None
    data["file_type_name"] = file_type.name if file_type else None

    return success_response(data=data)


# ── POST /api/resources ───────────────────────────────────
# Upload a new resource
# Only mentors can upload
@bp.route("", methods=["POST"])
@jwt_required()
def create_resource():
    # Check role — only mentors allowed
    role = get_current_role()
    if role not in ["mentor", "admin"]:
        return error_response("FORBIDDEN", "Only mentors can upload resources", status=403)

    data = request.get_json()

    # Validate required fields
    required = ["title", "subject_id", "file_type_id", "file_url"]
    for field in required:
        if not data.get(field):
            return error_response("MISSING_FIELD", f"{field} is required", field, 400)

    # Get current user ID from JWT
    user_id = int(get_jwt_identity())

    # Create new resource
    resource = Resource(
        uploader_id  = user_id,
        subject_id   = data["subject_id"],
        file_type_id = data["file_type_id"],
        title        = data["title"],
        file_url     = data["file_url"],
        file_size_mb = data.get("file_size_mb", 0),
        duration_sec = data.get("duration_sec"),
        # Mentors upload as published directly
        status       = "published",
    )

    db.session.add(resource)
    db.session.commit()

    return success_response(
        data=resource.to_dict(),
        message="Resource uploaded successfully",
        status=201,
    )


# ── DELETE /api/resources/<id> ────────────────────────────
# Delete a resource
# Mentors can only delete their own resources
# Admins can delete any resource
@bp.route("/<int:resource_id>", methods=["DELETE"])
@jwt_required()
def delete_resource(resource_id):
    user_id = int(get_jwt_identity())
    role    = get_current_role()

    resource = Resource.query.get(resource_id)

    if not resource:
        return error_response("NOT_FOUND", "Resource not found", status=404)

    # Mentors can only delete their own resources
    if role == "mentor" and resource.uploader_id != user_id:
        return error_response("FORBIDDEN", "You can only delete your own resources", status=403)

    db.session.delete(resource)
    db.session.commit()

    return success_response(message="Resource deleted successfully")


# ── POST /api/resources/<id>/download ────────────────────
# Track when someone downloads a resource
# Increments download count
@bp.route("/<int:resource_id>/download", methods=["POST"])
@jwt_required()
def track_download(resource_id):
    resource = Resource.query.get(resource_id)

    if not resource:
        return error_response("NOT_FOUND", "Resource not found", status=404)

    # Increment download count
    resource.download_count += 1
    db.session.commit()

    return success_response(
        data={"file_url": resource.file_url},
        message="Download tracked"
    )