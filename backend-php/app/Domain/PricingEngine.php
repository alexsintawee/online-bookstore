<?php

namespace App\Domain;

use App\Domain\Discounts\DiscountRule;
use App\Domain\Discounts\DiscountResult;

class PricingEngine
{
    /** @param DiscountRule[] $rules */
    public function __construct(
        private readonly array $rules,
    ) {
    }

    /**
     * @param Cart $cart
     * @param array<string, Product> $products
     * @return array{items: array, discounts: array, totals: array}
     */
    public function calculate(Cart $cart, array $products): array
    {
        $items = [];
        $subtotalCents = 0;

        foreach ($cart->getItems() as $cartItem) {
            $product = $products[$cartItem->sku] ?? null;
            if (!$product instanceof Product) {
                continue;
            }

            $unitPriceCents = $product->getPriceCents();
            $lineSubtotalCents = $unitPriceCents * $cartItem->quantity;
            $subtotalCents += $lineSubtotalCents;

            $prefix = config('core.api.image_url_prefix', '/api/images');
            $imageUrl = $product->image
                ? (str_starts_with($product->image, '/') || str_starts_with($product->image, 'http'))
                    ? $product->image
                    : $prefix . '/' . $product->image
                : $prefix . '/' . $product->sku . '.svg';

            $items[] = [
                'sku' => $cartItem->sku,
                'name' => $product->name,
                'unitPrice' => $this->roundDollars($unitPriceCents / 100),
                'quantity' => $cartItem->quantity,
                'lineSubtotal' => $this->roundDollars($lineSubtotalCents / 100),
                'imageUrl' => $imageUrl,
            ];
        }

        $discounts = [];
        $discountTotalCents = 0;

        foreach ($this->rules as $rule) {
            if (!$rule->applies($cart)) {
                continue;
            }
            $result = $rule->calculate($cart, $products);
            if ($result instanceof DiscountResult && $result->amountCents() !== 0) {
                $discounts[] = [
                    'ruleId' => $result->ruleId(),
                    'description' => $result->description(),
                    'amount' => $this->roundDollars($result->amountCents() / 100),
                    'meta' => $result->meta(),
                ];
                $discountTotalCents += $result->amountCents();
            }
        }

        $totalCents = $subtotalCents + $discountTotalCents;

        return [
            'items' => $items,
            'discounts' => $discounts,
            'totals' => [
                'subtotal' => $this->roundDollars($subtotalCents / 100),
                'discountTotal' => $this->roundDollars($discountTotalCents / 100),
                'total' => $this->roundDollars($totalCents / 100),
            ],
        ];
    }

    private function roundDollars(float $value): float
    {
        return round($value * 100) / 100;
    }
}
