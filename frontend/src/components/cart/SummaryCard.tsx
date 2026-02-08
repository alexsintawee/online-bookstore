import type { CartSummary } from '../../types';
import { formatMoney } from '../../core/format/Money';
import {
  getOrderSummaryTitle,
  getSubtotalLabel,
  getDiscountsLabel,
  getTotalLabel,
  getCheckoutBtnLabel,
} from '../../core/config';
import styles from './SummaryCard.module.css';

interface SummaryCardProps {
  summary: CartSummary;
  orderSummaryTitle?: string;
  checkoutLabel?: string;
  onCheckout?: () => void;
}

export function SummaryCard({
  summary,
  orderSummaryTitle = getOrderSummaryTitle(),
  checkoutLabel = getCheckoutBtnLabel(),
  onCheckout,
}: SummaryCardProps) {
  const { totals, discounts } = summary;
  const subtotalLabel = getSubtotalLabel();
  const discountsLabel = getDiscountsLabel();
  const totalLabel = getTotalLabel();

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{orderSummaryTitle}</h2>
      <div className={styles.row}>
        <span>{subtotalLabel}</span>
        <span>{formatMoney(totals.subtotal)}</span>
      </div>
      {discounts.length > 0 && (
        <div className={styles.discounts}>
          <span className={styles.discountLabel}>{discountsLabel}</span>
          <ul className={styles.discountList}>
            {discounts.map((d) => (
              <li key={d.ruleId} className={styles.discountItem}>
                <span className={styles.discountDesc}>{d.description}</span>
                <span className={styles.discountAmount}>
                  {formatMoney(d.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.rowTotal}>
        <span>{totalLabel}</span>
        <span className={styles.totalValue}>{formatMoney(totals.total)}</span>
      </div>
      {onCheckout && (
        <button
          type="button"
          className={styles.checkoutBtn}
          onClick={onCheckout}
        >
          {checkoutLabel}
        </button>
      )}
    </div>
  );
}
