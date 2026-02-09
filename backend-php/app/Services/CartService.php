<?php

namespace App\Services;

use App\Domain\PricingEngine;
use App\Repositories\CartRepository;
use App\Repositories\ProductRepository;

class CartService
{
    public function __construct(
        private readonly CartRepository $cartRepo,
        private readonly ProductRepository $productRepo,
        private readonly PricingEngine $pricingEngine,
    ) {
    }

    /** @return array{cartId: string} */
    public function createCart(): array
    {
        $cart = $this->cartRepo->create();
        return ['cartId' => $cart->id];
    }

    /** @return array{items: array, discounts: array, totals: array}|null */
    public function getCartSummary(string $cartId): ?array
    {
        $cart = $this->cartRepo->getById($cartId);
        if ($cart === null) {
            return null;
        }
        $products = $this->productRepo->getMap();
        return $this->pricingEngine->calculate($cart, $products);
    }

    /** @return array{items: array, discounts: array, totals: array}|null */
    public function updateCartItems(string $cartId, string $sku, int $quantityDelta): ?array
    {
        $cart = $this->cartRepo->getById($cartId);
        if ($cart === null) {
            return null;
        }
        $cart->updateQuantity($sku, $quantityDelta);
        $this->cartRepo->save($cart);
        return $this->getCartSummary($cartId);
    }
}
