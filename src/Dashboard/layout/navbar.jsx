import '../styles/NavbarStyles.css';

export default function Navbar() {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    return (
        <header className="db-topbar">
            <div className="db-topbar__left">
                <button className="db-topbar__hamburger" aria-label="Open menu" id="db-menu-btn" type="button">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <nav className="db-topbar__crumb" aria-label="Breadcrumb">
                    <span>Meridian</span>
                    <span className="db-topbar__crumb-sep" aria-hidden="true">/</span>
                    <span className="db-topbar__crumb-current" aria-current="page">Dashboard</span>
                </nav>
            </div>
            <div className="db-topbar__center">
                <div className="db-topbar__search">
                    <svg className="db-topbar__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input type="search" className="db-topbar__search-input" placeholder="Search tasks, projects..." aria-label="Search" />
                    <kbd className="db-topbar__search-kbd" aria-label="Keyboard shortcut: Command K">⌘K</kbd>
                </div>
            </div>
            <div className="db-topbar__right">
                <span className="db-topbar__date" aria-label={`Today is ${dateStr}`}>{dateStr}</span>
                <button className="db-topbar__btn" aria-label="Notifications — 4 unread" type="button">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="db-topbar__notif-dot" aria-hidden="true" />
                </button>
                <button className="db-topbar__btn" aria-label="Help" type="button">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                </button>
            </div>
        </header>
    );
}