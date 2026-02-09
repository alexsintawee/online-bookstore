<?php

namespace App\Domain\Discounts;

use App\Domain\Cart;
use App\Domain\Product;

/**
 * Bulk price override: if cart has minQty or more of sku, each item is priced at bulkUnitPriceCents.
 */
final class BulkPriceRule implements DiscountRule
{
    public function __construct(
        private readonly string $sku,
        private readonly int $minQty,
        private readonly int $bulkUnitPriceCents,
    ) {
    }

    public function id(): string
    {
        return 'bulk-price-' . $this->sku;
    }

    public function applies(Cart $cart): bool
    {
        return $cart->getQuantity($this->sku) >= $this->minQty;
    }

    public function calculate(Cart $cart, array $products): ?DiscountResult
    {
        $qty = $cart->getQuantity($this->sku);
        if ($qty < $this->minQty) {
            return null;
        }

        $product = $products[$this->sku] ?? null;
        if (!$product instanceof Product) {
            return null;
        }

        $unitPriceBefore = $product->getPriceCents();
        $subtotalBefore = $unitPriceBefore * $qty;
        $subtotalAfter = $this->bulkUnitPriceCents * $qty;
        $amountCents = $subtotalAfter - $subtotalBefore; // negative = discount

        return new class(
            $this->id(),
            sprintf(
                'Bulk price applied to %s (%d+ @ $%s)',
                $product->name,
                $this->minQty,
                number_format($this->bulkUnitPriceCents / 100, 2)
            ),
            $amountCents,
            [
                'sku' => $this->sku,
                'qty' => $qty,
                'unitPriceBefore' => $unitPriceBefore / 100,
                'unitPriceAfter' => $this->bulkUnitPriceCents / 100,
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
