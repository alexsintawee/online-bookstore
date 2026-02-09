<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    private const QUANTITY_DELTA_MIN = -1000;

    private const QUANTITY_DELTA_MAX = 1000;

    private const SKU_MAX_LENGTH = 128;

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
            Log::error('Cart create failed', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
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
        $sku = trim($sku);
        if ($sku === '' || strlen($sku) > self::SKU_MAX_LENGTH) {
            return response()->json(
                ['error' => 'Invalid sku (max ' . self::SKU_MAX_LENGTH . ' characters)'],
                400
            );
        }
        $quantityDelta = (int) $quantityDelta;
        if ($quantityDelta < self::QUANTITY_DELTA_MIN || $quantityDelta > self::QUANTITY_DELTA_MAX) {
            return response()->json(
                ['error' => 'quantityDelta must be between ' . self::QUANTITY_DELTA_MIN . ' and ' . self::QUANTITY_DELTA_MAX],
                400
            );
        }
        $summary = $this->cartService->updateCartItems($cartId, $sku, $quantityDelta);
        if ($summary === null) {
            return response()->json(['error' => config('core.api.error_cart_not_found', 'Cart not found')], 404);
        }
        return response()->json($summary);
    }
}
