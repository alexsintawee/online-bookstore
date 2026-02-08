import { getAppName, getCopyrightText, getFooterColumns } from '../../core/config';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();
  const appName = getAppName();
  const copyrightText = getCopyrightText();
  const footerColumns = getFooterColumns();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          {footerColumns.map((col) => (
            <div key={col.title} className={styles.column}>
              <h3 className={styles.columnTitle}>{col.title}</h3>
              <ul className={styles.links}>
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.copyright}>
          © {year} {appName}. {copyrightText}
        </div>
      </div>
    </footer>
  );
}
