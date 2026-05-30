<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::middleware('supabase.auth')->group(function () {
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::put('/tickets/{id}', [TicketController::class, 'update']);
    Route::delete('/tickets/{id}', [TicketController::class, 'destroy']);
});

Route::middleware('supabase.auth')->group(function () {
    Route::get('/tickets/{ticketId}/comments', [CommentController::class, 'index']);
    Route::post('/tickets/{ticketId}/comments', [CommentController::class, 'store']);
    Route::patch('/tickets/{id}/assign', [TicketController::class, 'assign']);
});

Route::middleware('supabase.auth')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users/it-staff', [UserController::class, 'createItStaff']);
    Route::patch('/users/{id}/role', [UserController::class, 'updateRole']);
    Route::get('/users/it-staff', [UserController::class, 'itStaff']);
});