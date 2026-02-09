<?php

namespace App\Domain;

/**
 * Value object representing monetary amount in integer cents.
 * All pricing calculations use cents internally; convert to dollars only for display/JSON.
 */
final class Money
{
    public function __construct(
        private readonly int $cents
    ) {
    }

    public function getCents(): int
    {
        return $this->cents;
    }

    /** Convert to dollars for display (2 decimal places). */
    public function toDollars(): float
    {
        return round($this->cents) / 100;
    }

    public function add(Money $other): Money
    {
        return new self($this->cents + $other->cents);
    }

    public function subtract(Money $other): Money
    {
        return new self($this->cents - $other->cents);
    }

    public function multiply(float $factor): Money
    {
        return new self((int) round($this->cents * $factor));
    }

    public static function fromCents(int|float $cents): self
    {
        return new self((int) round($cents));
    }

    public static function fromDollars(float $dollars): self
    {
        return new self((int) round($dollars * 100));
    }

    public static function zero(): self
    {
        return new self(0);
    }

    public function equals(Money $other): bool
    {
        return $this->cents === $other->cents;
    }
}
