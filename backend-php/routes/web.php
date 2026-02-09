<?php

use App\Http\Controllers\ImageController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => config('core.api.message_root', config('app.name', 'Online Bookstore API'))]);
});

Route::get('/images/{filename}', [ImageController::class, 'show'])->where('filename', '[^/]+');
