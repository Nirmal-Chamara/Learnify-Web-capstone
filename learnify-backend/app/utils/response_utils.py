from flask import jsonify


def success_response(data=None, message="Success", status=200):
    # Every successful response follows this structure
    return jsonify({
        "success": True,
        "message": message,
        "data":    data,
    }), status


def error_response(code, message, field=None, status=400):
    # Every error response follows this structure
    error = {
        "code":    code,
        "message": message,
    }
    if field:
        error["field"] = field

    return jsonify({
        "success": False,
        "error":   error,
    }), status