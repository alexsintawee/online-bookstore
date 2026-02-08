/**
 * Value object representing monetary amount in integer cents.
 * All pricing calculations use cents internally; convert to dollars only for display/JSON.
 */
export class Money {
  constructor(private readonly cents: number) {
    if (!Number.isInteger(cents)) {
      throw new Error('Money must be stored as integer cents');
    }
  }

  getCents(): number {
    return this.cents;
  }

  /** Convert to dollars for display (2 decimal places). */
  toDollars(): number {
    return Math.round(this.cents) / 100;
  }

  add(other: Money): Money {
    return new Money(this.cents + other.cents);
  }

  subtract(other: Money): Money {
    return new Money(this.cents - other.cents);
  }

  multiply(factor: number): Money {
    return new Money(Math.round(this.cents * factor));
  }

  static fromCents(cents: number): Money {
    return new Money(Math.round(cents));
  }

  static fromDollars(dollars: number): Money {
    return new Money(Math.round(dollars * 100));
  }

  static zero(): Money {
    return new Money(0);
  }

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }
}
