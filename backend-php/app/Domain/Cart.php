<?php

namespace App\Domain;

/**
 * Cart entity: holds items and supports add/remove/setQty.
 * Quantity cannot go below 0.
 */
final class Cart
{
    /** @var array<string, CartItem> */
    private array $items = [];

    public function __construct(
        public readonly string $id,
    ) {
    }

    /** @return CartItem[] */
    public function getItems(): array
    {
        return array_values(array_filter(
            $this->items,
            fn (CartItem $item) => $item->quantity > 0
        ));
    }

    public function getItem(string $sku): ?CartItem
    {
        return $this->items[$sku] ?? null;
    }

    public function getQuantity(string $sku): int
    {
        return $this->items[$sku]->quantity ?? 0;
    }

    public function addItem(string $sku, int $quantityDelta): void
    {
        if ($quantityDelta <= 0) {
            return;
        }
        if (isset($this->items[$sku])) {
            $this->items[$sku]->quantity += $quantityDelta;
        } else {
            $this->items[$sku] = new CartItem($sku, $quantityDelta);
        }
    }

    public function removeItem(string $sku, int $quantityDelta): void
    {
        if ($quantityDelta <= 0 || !isset($this->items[$sku])) {
            return;
        }
        $this->items[$sku]->quantity = max(0, $this->items[$sku]->quantity - $quantityDelta);
        if ($this->items[$sku]->quantity === 0) {
            unset($this->items[$sku]);
        }
    }

    public function setQuantity(string $sku, int $quantity): void
    {
        if ($quantity < 0) {
            $quantity = 0;
        }
        if ($quantity === 0) {
            unset($this->items[$sku]);
            return;
        }
        if (isset($this->items[$sku])) {
            $this->items[$sku]->quantity = $quantity;
        } else {
            $this->items[$sku] = new CartItem($sku, $quantity);
        }
    }

    /** Apply quantity delta (add or remove). Quantity cannot go below 0. */
    public function updateQuantity(string $sku, int $quantityDelta): void
    {
        $current = $this->getQuantity($sku);
        $newQty = max(0, $current + $quantityDelta);
        $this->setQuantity($sku, $newQty);
    }
}
