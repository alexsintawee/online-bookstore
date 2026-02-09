<?php

namespace App\Domain;

/**
 * Product entity. Price is stored in cents internally.
 */
final class Product
{
    public function __construct(
        public readonly string $sku,
        public readonly string $name,
        private readonly int $priceCents,
        public readonly ?string $image = null,
    ) {
    }

    public function getPrice(): Money
    {
        return Money::fromCents($this->priceCents);
    }

    public function getPriceCents(): int
    {
        return $this->priceCents;
    }
}
