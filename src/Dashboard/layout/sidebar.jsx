import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV = [
    {
        section: null,
        items: [
            {
                id: "dashboard",
                label: "Dashboard",
                to: "/dashboard",
                icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
                        <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                ),
            },
            {
                id: "inbox",
                label: "Inbox",
                to: "/inbox",
                badge: 4,
                icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                    </svg>
                ),
            },
        ],
    },
    {
        section: "Work",
        items: [
            {
                id: "projects",
                label: "Projects",
                to: "/projects",
                icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                ),
                children: [
                    { id: "p-q4", label: "Q4 Sprint", to: "/projects/q4", dot: "#4CAF88" },
                    { id: "p-app", label: "App Redesign", to: "/projects/app", dot: "#38bdf8" },
                    { id: "p-infra", label: "Infra Migration", to: "/projects/infra", dot: "#f59e0b" },
                ],
            },
            {
                id: "tasks",
                label: "My Tasks",
                to: "/tasks",
                icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="9 11 12 14 22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                ),
            },
            {
                id: "boards",
                label: "Boards",
                to: "/boards",
                icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="5" height="18" rx="1.5" />
                        <rect x="10" y="3" width="5" height="12" rx="1.5" />
                        <rect x="17" y="3" width="5" height="15" rx="1.5" />
                    </svg>
                ),
            },
            {
                id: "timeline",
                label: "Timeline",
                to: "/timeline",
                icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" />
                        <line x1="3" y1="18" x2="18" y2="18" />
                        <circle cx="18" cy="6" r="2.5" fill="currentColor" stroke="none" />
                    </svg>
                ),
            },
            {
                id: "docs",
                label: "Docs",
                to: "/docs",
                icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
                    </svg>
                ),
            },
        ],
    },
    {
        section: "Insights",
        items: [
            {
                id: "analytics",
                label: "Analytics",
                to: "/analytics",
                icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                ),
            },
            {
                id: "reports",
                label: "Reports",
                to: "/reports",
                icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="13" y2="17" />
                    </svg>
                ),
            },
        ],
    },
    {
        section: "Workspace",
        items: [
            {
                id: "settings",
                label: "Settings",
                to: "/settings",
                icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                ),
            },
        ],
    },
];

const WORKSPACE_OPTIONS = [
    { id: "meridian", name: "Meridian", plan: "Pro", initial: "M", color: "#4CAF88" },
    { id: "personal", name: "Personal", plan: "Starter", initial: "P", color: "#38bdf8" },
];

const RECENT_TASKS = [
    { id: "rt1", label: "Design token audit", project: "App Redesign", dot: "#38bdf8", done: false },
    { id: "rt2", label: "Write migration runbook", project: "Infra Migration", dot: "#f59e0b", done: false },
    { id: "rt3", label: "Update CI pipeline", project: "Q4 Sprint", dot: "#4CAF88", done: true },
];

const USER = {
    name: "Zakaria Rouane",
    email: "zakaria@meridian.io",
    initials: "ZR",
};

const USER_MENU_ITEMS = [
    { label: "Profile", to: "/profile" },
    { label: "Preferences", to: "/settings" },
    { label: "Keyboard shortcuts", to: "/shortcuts" },
];

function useClickOutside(ref, onClose) {
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onClose();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [ref, onClose]);
}

function useNavExpand(itemTo, hasChildren) {
    const { pathname } = useLocation();
    const isParentActive = hasChildren && pathname.startsWith(itemTo + "/");
    const [open, setOpen] = useState(isParentActive);
    const toggle = useCallback(() => setOpen((prev) => !prev), []);
    return [open, toggle];
}

function ChevronIcon({ size = 12, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
            <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CheckIcon({ size = 11 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 11 9" fill="none" aria-hidden="true">
            <path d="M1 4.5L4 7.5L10 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function WorkspaceSwitcher({ collapsed }) {
    const [open, setOpen] = useState(false);
    const [activeId, setActiveId] = useState(WORKSPACE_OPTIONS[0].id);
    const ref = useRef(null);
    const active = useMemo(() => WORKSPACE_OPTIONS.find((w) => w.id === activeId), [activeId]);
    const close = useCallback(() => setOpen(false), []);
    useClickOutside(ref, close);
    const handleSelect = useCallback((id) => {
        setActiveId(id);
        setOpen(false);
    }, []);

    return (
        <div className="sb-ws" ref={ref}>
            <button type="button" className={`sb-ws__trigger ${open ? "sb-ws__trigger--open" : ""} ${collapsed ? "sb-ws__trigger--collapsed" : ""}`} onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open} aria-label={`Workspace: ${active.name}. Click to switch.`}>
                <span className="sb-ws__avatar" style={{ background: active.color }} aria-hidden="true">{active.initial}</span>
                {!collapsed && (
                    <>
                        <span className="sb-ws__info">
                            <span className="sb-ws__name">{active.name}</span>
                            <span className="sb-ws__plan">{active.plan}</span>
                        </span>
                        <span className={`sb-ws__chevron ${open ? "sb-ws__chevron--open" : ""}`} aria-hidden="true"><ChevronIcon /></span>
                    </>
                )}
            </button>
            {open && (
                <div className="sb-ws__dropdown" role="listbox" aria-label="Select workspace">
                    <p className="sb-ws__dropdown-header">Workspaces</p>
                    {WORKSPACE_OPTIONS.map((ws) => (
                        <button key={ws.id} type="button" role="option" aria-selected={ws.id === activeId} className={`sb-ws__option ${ws.id === activeId ? "sb-ws__option--active" : ""}`} onClick={() => handleSelect(ws.id)}>
                            <span className="sb-ws__opt-avatar" style={{ background: ws.color }} aria-hidden="true">{ws.initial}</span>
                            <span className="sb-ws__opt-info">
                                <span className="sb-ws__opt-name">{ws.name}</span>
                                <span className="sb-ws__opt-plan">{ws.plan}</span>
                            </span>
                            {ws.id === activeId && (
                                <span className="sb-ws__opt-check" aria-label="Currently selected"><CheckIcon /></span>
                            )}
                        </button>
                    ))}
                    <div className="sb-ws__sep" role="separator" />
                    <Link to="/register" className="sb-ws__new" onClick={close}>
                        <span className="sb-ws__new-icon" aria-hidden="true">+</span>New workspace
                    </Link>
                </div>
            )}
        </div>
    );
}

function NavItem({ item, collapsed }) {
    const { pathname } = useLocation();
    const hasChildren = Boolean(item.children?.length);
    const isActive = pathname === item.to || pathname.startsWith(item.to + "/");
    const [open, toggleOpen] = useNavExpand(item.to, hasChildren);

    return (
        <li className="sb-nav__item">
            <div className="sb-nav__row">
                <Link to={`/dashboard/${item.to}`} title={collapsed ? item.label : undefined} aria-current={pathname === item.to ? "page" : undefined} className={`sb-nav__link ${isActive ? "sb-nav__link--active" : ""}`}>
                    <span className="sb-nav__icon">{item.icon}</span>
                    {!collapsed && (
                        <>
                            <span className="sb-nav__label">{item.label}</span>
                            {item.badge != null && <span className="sb-nav__badge" aria-label={`${item.badge} unread notifications`}>{item.badge}</span>}
                        </>
                    )}
                    {/* {isActive && !collapsed && <span className="sb-nav__active-pip" aria-hidden="true" />} */}
                </Link>
                {hasChildren && !collapsed && (
                    <button type="button" className={`sb-nav__expand ${open ? "sb-nav__expand--open" : ""}`} onClick={toggleOpen} aria-expanded={open} aria-label={`${open ? "Collapse" : "Expand"} ${item.label} sub-items`}>
                        <ChevronIcon size={11} />
                    </button>
                )}
            </div>
            {hasChildren && !collapsed && open && (
                <ul className="sb-nav__children" role="list" aria-label={`${item.label} sub-navigation`}>
                    {item.children.map((child) => (
                        <li key={child.id} className="sb-nav__child">
                            <Link to={child.to} aria-current={pathname === child.to ? "page" : undefined} className={`sb-nav__child-link ${pathname === child.to ? "sb-nav__child-link--active" : ""}`}>
                                <span className="sb-nav__child-dot" style={{ background: child.dot }} aria-hidden="true" />
                                {child.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
}

function RecentTasks({ collapsed }) {
    if (collapsed) return null;
    return (
        <section className="sb-recent" aria-label="Recent tasks">
            <header className="sb-recent__header">
                <span className="sb-recent__title">Recent</span>
                <Link to="/tasks" className="sb-recent__view-all">All tasks</Link>
            </header>
            <ul className="sb-recent__list" role="list">
                {RECENT_TASKS.map((task) => (
                    <li key={task.id} className={`sb-recent__item ${task.done ? "sb-recent__item--done" : ""}`}>
                        <span className="sb-recent__dot" style={{ background: task.dot }} aria-hidden="true" />
                        <span className="sb-recent__label">{task.label}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function UserMenu({ collapsed }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const close = useCallback(() => setOpen(false), []);
    useClickOutside(ref, close);
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") close(); };
        if (open) document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, close]);

    return (
        <div className="sb-user" ref={ref}>
            <button type="button" className={`sb-user__trigger ${collapsed ? "sb-user__trigger--collapsed" : ""}`} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" aria-label={`User menu for ${USER.name}`}>
                <span className="sb-user__avatar" aria-hidden="true">{USER.initials}</span>
                {!collapsed && (
                    <>
                        <span className="sb-user__info">
                            <span className="sb-user__name">{USER.name}</span>
                            <span className="sb-user__email">{USER.email}</span>
                        </span>
                        <span className="sb-user__ellipsis" aria-hidden="true">⋯</span>
                    </>
                )}
            </button>
            {open && (
                <div className="sb-user__menu" role="menu" aria-label="User options">
                    <div className="sb-user__menu-profile">
                        <span className="sb-user__menu-avatar" aria-hidden="true">{USER.initials}</span>
                        <div className="sb-user__menu-identity">
                            <span className="sb-user__menu-name">{USER.name}</span>
                            <span className="sb-user__menu-email">{USER.email}</span>
                        </div>
                    </div>
                    <div className="sb-user__menu-sep" role="separator" />
                    {USER_MENU_ITEMS.map(({ label, to }) => (
                        <Link key={to} to={to} role="menuitem" className="sb-user__menu-item" onClick={close}>{label}</Link>
                    ))}
                    <div className="sb-user__menu-sep" role="separator" />
                    <Link to="/login" role="menuitem" className="sb-user__menu-item sb-user__menu-item--signout" onClick={close}>Sign out</Link>
                </div>
            )}
        </div>
    );
}

function CollapseToggle({ collapsed, onToggle }) {
    return (
        <button type="button" className="sb-toggle" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <svg className={`sb-toggle__icon ${collapsed ? "sb-toggle__icon--flipped" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
            </svg>
        </button>
    );
}

function SearchTrigger({ collapsed }) {
    return (
        <button type="button" className="sb-search__btn" aria-label="Search (⌘K)">
            <span className="sb-search__icon" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </span>
            {!collapsed && (
                <>
                    <span className="sb-search__placeholder">Search…</span>
                    <kbd className="sb-search__kbd" aria-label="Keyboard shortcut: Command K">⌘K</kbd>
                </>
            )}
        </button>
    );
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
    const sidebarClass = `sb ${collapsed ? "sb--collapsed" : ""} ${mobileOpen ? "sb--mobile-open" : ""}`;
    return (
        <>
            {mobileOpen && <div className="sb-overlay" onClick={onMobileClose} aria-hidden="true" />}
            <aside className={sidebarClass} aria-label="Main navigation">
                <div className="sb-head">
                    <WorkspaceSwitcher collapsed={collapsed} />
                    {!mobileOpen && <CollapseToggle collapsed={collapsed} onToggle={onToggle} />}
                </div>
                {/* <div className="sb-search">
                    <SearchTrigger collapsed={collapsed} />
                </div> */}
                <nav className="sb-nav" aria-label="Site navigation">
                    {NAV.map((group, i) => (
                        <div key={group.section ?? `group-${i}`} className="sb-nav__section">
                            {group.section && <span className="sb-nav__section-label" aria-hidden={collapsed ? "true" : undefined}>{group.section}</span>}
                            <ul className="sb-nav__list" role="list">
                                {group.items.map((item) => <NavItem key={item.id} item={item} collapsed={collapsed} />)}
                            </ul>
                        </div>
                    ))}
                </nav>
                <RecentTasks collapsed={collapsed} />
                <UserMenu collapsed={collapsed} />
            </aside>
        </>
    );
}

export default Sidebar;