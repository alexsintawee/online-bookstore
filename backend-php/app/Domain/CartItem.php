<?php

namespace App\Domain;

/**
 * Cart line item: SKU and quantity.
 */
final class CartItem
{
    public function __construct(
        public readonly string $sku,
        public int $quantity,
    ) {
        if ($quantity < 0) {
            throw new \InvalidArgumentException('Quantity cannot be negative');
        }
    }

    public function clone(): self
    {
        return new self($this->sku, $this->quantity);
    }
}
