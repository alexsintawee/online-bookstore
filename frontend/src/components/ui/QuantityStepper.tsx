import { useState, useEffect, useRef } from 'react';
import { getQuantityGroupAriaLabel, getDecreaseQuantityAriaLabel, getIncreaseQuantityAriaLabel } from '../../core/config';
import styles from './QuantityStepper.module.css';

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (newValue: number) => void;
  disabled?: boolean;
  /** Optional id for the input (e.g. for label htmlFor). */
  id?: string;
}

export function QuantityStepper({
  value,
  min = 0,
  max,
  onChange,
  disabled = false,
  id,
}: QuantityStepperProps) {
  const [inputValue, setInputValue] = useState(String(value));
  const isFocused = useRef(false);

  useEffect(() => {
    if (!isFocused.current) setInputValue(String(value));
  }, [value]);

  const commit = (raw: string) => {
    const n = parseInt(raw.trim(), 10);
    if (Number.isNaN(n) || n < min) {
      onChange(min);
      setInputValue(String(min));
    } else if (max != null && n > max) {
      onChange(max);
      setInputValue(String(max));
    } else {
      onChange(n);
      setInputValue(String(n));
    }
    isFocused.current = false;
  };

  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (max == null || value < max) onChange(value + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === '' || /^\d+$/.test(v)) setInputValue(v);
  };

  const handleBlur = () => {
    if (inputValue.trim() === '') {
      onChange(min);
      setInputValue(String(min));
    } else {
      commit(inputValue);
    }
    isFocused.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleFocus = () => {
    isFocused.current = true;
  };

  return (
    <div className={styles.stepper} role="group" aria-label={getQuantityGroupAriaLabel()}>
      <button
        type="button"
        className={styles.btn}
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label={getDecreaseQuantityAriaLabel()}
        title={getDecreaseQuantityAriaLabel()}
      >
        <span className={styles.icon} aria-hidden>−</span>
      </button>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        className={styles.input}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        min={min}
        max={max}
        aria-label={getQuantityGroupAriaLabel()}
        aria-valuemin={min}
        aria-valuemax={max ?? undefined}
        aria-valuenow={value}
      />
      <button
        type="button"
        className={styles.btn}
        onClick={handleIncrement}
        disabled={disabled || (max != null && value >= max)}
        aria-label={getIncreaseQuantityAriaLabel()}
        title={getIncreaseQuantityAriaLabel()}
      >
        <span className={styles.icon} aria-hidden>+</span>
      </button>
    </div>
  );
}
