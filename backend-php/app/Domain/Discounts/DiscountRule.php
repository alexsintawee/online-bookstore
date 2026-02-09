<?php

namespace App\Domain\Discounts;

use App\Domain\Cart;
use App\Domain\Product;

interface DiscountResult
{
    public function ruleId(): string;
    public function description(): string;
    public function amountCents(): int;
    /** @return array<string, mixed>|null */
    public function meta(): ?array;
}

/**
 * Extensible discount rule. New rules are added by creating new classes
 * that implement this interface and registering them with the PricingEngine.
 */
interface DiscountRule
{
    public function id(): string;

    /** Whether this rule applies to the given cart. */
    public function applies(Cart $cart): bool;

    /** Calculate discount amount (negative = discount) and metadata. */
    public function calculate(Cart $cart, array $products): ?DiscountResult;
}
