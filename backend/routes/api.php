<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CommentsController;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Users
Route::post('/recovery', [AuthController::class, 'recoveryPassword']);
Route::post('/register', [AuthController::class, 'createUser']);
Route::post('/login', [AuthController::class, 'loginUser']);

// Comments
Route::delete('/comments/{id}', [CommentsController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/comments', [CommentsController::class, 'store'])->middleware('auth:sanctum');
Route::get('/comments', [CommentsController::class, 'index'])->middleware('auth:sanctum');

// Posts
Route::delete('/posts/{id}', [PostsController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/posts', [PostsController::class, 'store'])->middleware('auth:sanctum');
Route::put('/posts', [PostsController::class, 'update'])->middleware('auth:sanctum');
Route::get('/posts', [PostsController::class, 'index'])->middleware('auth:sanctum');