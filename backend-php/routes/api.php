<?php

use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\ImageController;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{sku}', [ProductController::class, 'show']);
Route::post('/cart', [CartController::class, 'store']);
Route::get('/cart/{cartId}', [CartController::class, 'show']);
Route::post('/cart/{cartId}/items', [CartController::class, 'updateItems']);
Route::get('/promotions', [PromotionController::class, 'index']);
Route::get('/images/{filename}', [ImageController::class, 'show'])->where('filename', '[^/]+');
