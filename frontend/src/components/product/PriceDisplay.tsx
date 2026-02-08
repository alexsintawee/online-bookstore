import { formatMoney } from '../../core/format/Money';
import styles from './PriceDisplay.module.css';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: 'default' | 'large';
}

export function PriceDisplay({
  price,
  originalPrice,
  size = 'default',
}: PriceDisplayProps) {
  const hasDiscount = originalPrice != null && originalPrice > price;

  return (
    <div className={[styles.wrap, size === 'large' && styles.large].filter(Boolean).join(' ')}>
      {hasDiscount && (
        <span className={styles.original}>{formatMoney(originalPrice)}</span>
      )}
      <span className={hasDiscount ? styles.discounted : styles.price}>
        {formatMoney(price)}
      </span>
    </div>
  );
}
