from flask import Blueprint, jsonify
from ...infrastructure.repositories.sqlite_lesson_repository import SQLiteLessonRepository
from ...application.use_cases.get_lessons_by_course import GetLessonsByCourse
from ..middleware.auth_middleware import require_api_key

lesson_bp = Blueprint('lesson', __name__)

# Initialize dependencies
lesson_repository = SQLiteLessonRepository()
get_lessons_by_course = GetLessonsByCourse(lesson_repository)


@lesson_bp.route('/lessons', methods=['GET'])
@require_api_key
def get_all_lessons():
    """Get all lessons"""
    from ...infrastructure.repositories.sqlite_lesson_repository import SQLiteLessonRepository
    from ...application.dto.lesson_dto import LessonDTO
    lesson_repo = SQLiteLessonRepository()
    lessons = lesson_repo.get_all()
    return jsonify(LessonDTO.from_entities(lessons))


@lesson_bp.route('/lessons/<int:lesson_id>', methods=['GET'])
@require_api_key
def get_lesson(lesson_id):
    """Get a specific lesson by ID"""
    from ...infrastructure.repositories.sqlite_lesson_repository import SQLiteLessonRepository
    from ...application.dto.lesson_dto import LessonDTO
    lesson_repo = SQLiteLessonRepository()
    lesson = lesson_repo.get_by_id(lesson_id)
    if lesson is None:
        return jsonify({
            'error': {
                'code': 'LESSON_NOT_FOUND',
                'message': 'The requested lesson does not exist'
            }
        }), 404

    return jsonify(lesson.to_dict())


@lesson_bp.route('/lessons/<int:course_id>', methods=['GET'])
@require_api_key
def get_lessons_by_course_id(course_id):
    """Get all lessons for a specific course (alternative endpoint)"""
    try:
        # First check if course exists
        from ...infrastructure.repositories.sqlite_course_repository import SQLiteCourseRepository
        course_repo = SQLiteCourseRepository()
        course = course_repo.get_by_id(course_id)
        
        if course is None:
            return jsonify({
                'error': {
                    'code': 'COURSE_NOT_FOUND',
                    'message': 'The requested course does not exist'
                }
            }), 404
        
        # Use the existing use case to get lessons by course
        lessons = get_lessons_by_course.execute(course_id)
        
        # Return lessons array (empty if no lessons found)
        return jsonify(lessons)
        
    except Exception as e:
        # Handle any unexpected errors
        return jsonify({
            'error': {
                'code': 'INTERNAL_SERVER_ERROR',
                'message': 'An error occurred while retrieving lessons'
            }
        }), 500


@lesson_bp.route('/courses/<int:course_id>/lessons', methods=['GET'])
@require_api_key
def get_lessons_by_course_route(course_id):
    """Get all lessons for a specific course"""
    try:
        # First check if course exists
        from ...infrastructure.repositories.sqlite_course_repository import SQLiteCourseRepository
        course_repo = SQLiteCourseRepository()
        course = course_repo.get_by_id(course_id)
        
        if course is None:
            return jsonify({
                'error': {
                    'code': 'COURSE_NOT_FOUND',
                    'message': 'The requested course does not exist'
                }
            }), 404
        
        # Use the existing use case to get lessons by course
        lessons = get_lessons_by_course.execute(course_id)
        
        # Return lessons array (empty if no lessons found)
        return jsonify(lessons)
        
    except Exception as e:
        # Handle any unexpected errors
        return jsonify({
            'error': {
                'code': 'INTERNAL_SERVER_ERROR',
                'message': 'An error occurred while retrieving lessons'
            }
        }), 500
