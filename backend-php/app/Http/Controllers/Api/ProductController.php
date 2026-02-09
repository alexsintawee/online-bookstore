<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductService $productService,
    ) {
    }

    /** GET /api/products */
    public function index(): JsonResponse
    {
        try {
            $products = $this->productService->getAllProducts();
            return response()->json($products);
        } catch (\Throwable $e) {
            Log::error('Products index failed', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => config('core.api.error_failed_load_products', 'Failed to load products')], 500);
        }
    }

    /** GET /api/products/{sku} */
    public function show(string $sku): JsonResponse
    {
        try {
            $map = $this->productService->getProductMap();
            $product = $map[$sku] ?? null;
            if ($product === null) {
                return response()->json(['error' => config('core.api.error_product_not_found', 'Product not found')], 404);
            }
            $prefix = config('core.api.image_url_prefix', '/api/images');
            $imageUrl = $product->image
                ? (str_starts_with($product->image, '/') || str_starts_with($product->image, 'http'))
                    ? $product->image
                    : $prefix . '/' . $product->image
                : $prefix . '/' . $product->sku . '.svg';
            return response()->json([
                'sku' => $product->sku,
                'name' => $product->name,
                'price' => round($product->getPrice()->toDollars(), 2),
                'imageUrl' => $imageUrl,
            ]);
        } catch (\Throwable $e) {
            Log::error('Product show failed', ['sku' => $sku, 'message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => config('core.api.error_failed_load_product', 'Failed to load product')], 500);
        }
    }
}
