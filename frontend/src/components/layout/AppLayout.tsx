import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
