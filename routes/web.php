<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ListController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('lists',ListController::class);
    Route::resource('tasks',TaskController::class);
    Route::resource('upcoming',TaskController::class);
    Route::get('/dashboard',[DashboardController::class,'index'])->name('dashboard');
    Route::delete('/files/{file}', [FileController::class, 'destroy'])->name('files.destroy');
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
