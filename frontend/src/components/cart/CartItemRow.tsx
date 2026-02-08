import { useState } from 'react';
import type { CartLineItem } from '../../types';
import { getImageSrc } from '../../core/api/ApiClient';
import { formatMoney } from '../../core/format/Money';
import { getCartItemNoImageText, getSkuLabel, getRemoveItemLabel, getRemoveItemAriaLabel } from '../../core/config';
import { QuantityStepper } from '../ui/QuantityStepper';
import { PriceDisplay } from '../product/PriceDisplay';
import styles from './CartItemRow.module.css';

interface CartItemRowProps {
  item: CartLineItem;
  /** Prefer cart API imageUrl; fallback from products API when cart omits it */
  imageUrl?: string;
  onQuantityChange: (sku: string, quantityDelta: number) => void;
  onRemove?: (sku: string) => void;
}

export function CartItemRow({
  item,
  imageUrl: imageUrlProp,
  onQuantityChange,
  onRemove,
}: CartItemRowProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = imageUrlProp ?? item.imageUrl ?? `/api/images/${item.sku}.svg`;

  const handleStepperChange = (newValue: number) => {
    const delta = newValue - item.quantity;
    onQuantityChange(item.sku, delta);
  };

  return (
    <div className={styles.row}>
      <div className={styles.thumb}>
        {imageError ? (
          <div className={styles.thumbPlaceholder} aria-hidden>
            <span className={styles.thumbPlaceholderText}>{getCartItemNoImageText()}</span>
          </div>
        ) : (
          <img
            src={getImageSrc(imageUrl)}
            alt=""
            className={styles.thumbImg}
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className={styles.details}>
        <h3 className={styles.title}>{item.name}</h3>
        <p className={styles.sku}>{getSkuLabel()}: {item.sku}</p>
        <PriceDisplay price={item.unitPrice} />
      </div>
      <div className={styles.quantity}>
        <QuantityStepper
          value={item.quantity}
          min={0}
          onChange={handleStepperChange}
        />
      </div>
      <div className={styles.subtotal}>
        {formatMoney(item.lineSubtotal)}
      </div>
      {onRemove && (
        <button
          type="button"
          className={styles.remove}
          onClick={() => onRemove(item.sku)}
          aria-label={getRemoveItemAriaLabel(item.name)}
        >
          {getRemoveItemLabel()}
        </button>
      )}
    </div>
  );
}
