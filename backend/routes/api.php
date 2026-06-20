<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\QuizController;
/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/getCourses', [CourseController::class,'showCourses']);
Route::get('/plans', [PlanController::class, 'index']);
Route::get('/courses/{course}/lessons' ,[LessonController::class, 'showLessons']);
Route::get('/courses/{id}', [CourseController::class, 'showCourse']);
/*
|--------------------------------------------------------------------------
| Protected Routes (User)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')->group(function () {
    
  Route::post('/lessons/{id}/watched', [ProgressController::class, 'markWatched']);
    Route::post('/lessons/{id}/time', [ProgressController::class, 'saveTime']);
    // user info
    Route::get('/me', [AuthController::class, 'currentUserInfo']);

    // subscription
    Route::get('/me/subscription', [AuthController::class, 'subscription']);
     
    // start plan
    Route::post('/plans/start', [PlanController::class, 'startPlan']);
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:api'])->prefix('admin')->group(function () {
  Route::post('/addquiz', [quizController::class, 'addQuiz']);
    Route::post('/addquestion', [quizController::class, 'addQuestion']);
    Route::post('/addchoise', [quizController::class, 'addChoises']);
    // Courses CRUD
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
 
    // Lessons CRUD
    
    Route::put('/lessons/{id}', [LessonController::class, 'update']);
    Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
    Route::post('/addLesson', [LessonController::class, 'addLesson']);
 
});

