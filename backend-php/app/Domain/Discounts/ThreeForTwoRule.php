<?php

namespace App\Domain\Discounts;

use App\Domain\Cart;
use App\Domain\Product;

/**
 * Multi-buy-free deal: for every groupSize of sku, freeCount items are free.
 * Example: groupSize 3, freeCount 1 = "Buy 3 get 1 free".
 */
final class ThreeForTwoRule implements DiscountRule
{
    public function __construct(
        private readonly string $sku,
        private readonly int $groupSize = 3,
        private readonly int $freeCount = 1,
    ) {
    }

    public function id(): string
    {
        return 'multi-buy-free-' . $this->sku;
    }

    public function applies(Cart $cart): bool
    {
        return $cart->getQuantity($this->sku) >= $this->groupSize;
    }

    public function calculate(Cart $cart, array $products): ?DiscountResult
    {
        $qty = $cart->getQuantity($this->sku);
        if ($qty < $this->groupSize) {
            return null;
        }

        $product = $products[$this->sku] ?? null;
        if (!$product instanceof Product) {
            return null;
        }

        $unitPriceCents = $product->getPriceCents();
        $groups = (int) floor($qty / $this->groupSize);
        $freeItems = $groups * $this->freeCount;
        $amountCents = -( $freeItems * $unitPriceCents ); // negative = discount

        return new class(
            $this->id(),
            sprintf(
                'Buy %d get %d free: %d free on %s',
                $this->groupSize,
                $this->freeCount,
                $freeItems,
                $product->name
            ),
            $amountCents,
            [
                'sku' => $this->sku,
                'qty' => $qty,
                'groupSize' => $this->groupSize,
                'freeCount' => $this->freeCount,
                'freeItems' => $freeItems,
                'unitPrice' => $unitPriceCents / 100,
            ]
        ) implements DiscountResult {
            public function __construct(
                private readonly string $ruleId,
                private readonly string $description,
                private readonly int $amountCents,
                private readonly array $meta,
            ) {
            }
            public function ruleId(): string { return $this->ruleId; }
            public function description(): string { return $this->description; }
            public function amountCents(): int { return $this->amountCents; }
            public function meta(): ?array { return $this->meta; }
        };
    }
}
