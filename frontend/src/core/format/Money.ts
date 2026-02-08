/**
 * Format money for display using config (locale, currency, fraction digits).
 * Backend sends dollars; this module is for consistent display formatting only.
 */
import {
  getMoneyLocale,
  getMoneyCurrency,
  getMoneyMinFractionDigits,
  getMoneyMaxFractionDigits,
} from '../config';

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat(getMoneyLocale(), {
    style: 'currency',
    currency: getMoneyCurrency(),
    minimumFractionDigits: getMoneyMinFractionDigits(),
    maximumFractionDigits: getMoneyMaxFractionDigits(),
  }).format(amount);
}
