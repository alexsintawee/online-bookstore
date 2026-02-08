import { ReactNode } from 'react';
import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function Tabs({ tabs, activeId, onSelect }: TabsProps) {
  const activeTab = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeId}
            className={[styles.tab, tab.id === activeId && styles.tabActive]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onSelect(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.panel} role="tabpanel">
        {activeTab.content}
      </div>
    </div>
  );
}
