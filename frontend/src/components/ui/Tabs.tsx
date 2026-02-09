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
  const tabListId = 'tabs-' + tabs.map((t) => t.id).join('-').replace(/\s+/g, '-');
  const getTabId = (tabId: string) => `${tabListId}-tab-${tabId}`;
  const getPanelId = (tabId: string) => `${tabListId}-panel-${tabId}`;

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList} role="tablist" id={tabListId} aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={getTabId(tab.id)}
            type="button"
            role="tab"
            aria-selected={tab.id === activeId}
            aria-controls={getPanelId(tab.id)}
            className={[styles.tab, tab.id === activeId && styles.tabActive]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onSelect(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        id={getPanelId(activeTab.id)}
        className={styles.panel}
        role="tabpanel"
        aria-labelledby={getTabId(activeTab.id)}
      >
        {activeTab.content}
      </div>
    </div>
  );
}
