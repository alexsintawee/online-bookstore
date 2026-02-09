<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(
        private readonly CartService $cartService,
    ) {
    }

    /** POST /api/cart */
    public function store(): JsonResponse
    {
        try {
            $result = $this->cartService->createCart();
            return response()->json($result, 201);
        } catch (\Throwable $e) {
            return response()->json(['error' => config('core.api.error_failed_create_cart', 'Failed to create cart')], 500);
        }
    }

    /** GET /api/cart/{cartId} */
    public function show(string $cartId): JsonResponse
    {
        $summary = $this->cartService->getCartSummary($cartId);
        if ($summary === null) {
            return response()->json(['error' => config('core.api.error_cart_not_found', 'Cart not found')], 404);
        }
        return response()->json($summary);
    }

    /** POST /api/cart/{cartId}/items */
    public function updateItems(Request $request, string $cartId): JsonResponse
    {
        $sku = $request->input('sku');
        $quantityDelta = $request->input('quantityDelta');
        if (!is_string($sku) || !is_numeric($quantityDelta)) {
            return response()->json(
                ['error' => config('core.api.error_invalid_cart_items_body', 'Body must include sku (string) and quantityDelta (number)')],
                400
            );
        }
        $quantityDelta = (int) $quantityDelta;
        $summary = $this->cartService->updateCartItems($cartId, $sku, $quantityDelta);
        if ($summary === null) {
            return response()->json(['error' => config('core.api.error_cart_not_found', 'Cart not found')], 404);
        }
        return response()->json($summary);
    }
}
