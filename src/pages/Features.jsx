import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/Features.css';
const CATEGORIES = [
    { id: "all", label: "All features" },
    { id: "planning", label: "Planning" },
    { id: "collab", label: "Collaboration" },
    { id: "automation", label: "Automation" },
    { id: "analytics", label: "Analytics" },
    { id: "security", label: "Security" },
];

const FEATURES = [
    // ── Planning ──
    {
        id: "kanban",
        category: "planning",
        badge: "Core",
        badgeColor: "#4CAF88",
        title: "Kanban Board",
        description: "Drag cards across custom stages. Add swimlanes, WIP limits, and card aging to keep work visible and flow healthy.",
        tags: ["Drag & drop", "WIP limits", "Swimlanes"],
        visual: <KanbanVisual />,
    },
    {
        id: "timeline",
        category: "planning",
        badge: "Pro+",
        badgeColor: "#38bdf8",
        title: "Timeline & Gantt",
        description: "Map work across time. Dependencies, milestones, and critical path — all in one scrollable view your stakeholders will actually read.",
        tags: ["Dependencies", "Milestones", "Critical path"],
        visual: <TimelineVisual />,
    },
    {
        id: "sprints",
        category: "planning",
        badge: "Pro+",
        badgeColor: "#38bdf8",
        title: "Sprint Planning",
        description: "Build sprints from your backlog in minutes. Capacity planning, velocity targets, and automatic rollover keep your cadence intact.",
        tags: ["Velocity", "Capacity", "Backlog"],
        visual: <SprintVisual />,
    },
    // ── Collaboration ──
    {
        id: "threads",
        category: "collab",
        badge: "Core",
        badgeColor: "#4CAF88",
        title: "Threaded Comments",
        description: "Keep conversations in context. Comment on any task, reply in threads, mention teammates, and resolve discussions without losing track.",
        tags: ["@mentions", "Reactions", "Resolve"],
        visual: <ThreadsVisual />,
    },
    {
        id: "presence",
        category: "collab",
        badge: "Pro+",
        badgeColor: "#38bdf8",
        title: "Live Presence",
        description: "See exactly who's viewing or editing a task in real time. No more overwritten changes or duplicate effort between teammates.",
        tags: ["Real-time", "Cursors", "Edit locking"],
        visual: <PresenceVisual />,
    },
    {
        id: "docs",
        category: "collab",
        badge: "Pro+",
        badgeColor: "#38bdf8",
        title: "Docs & Wikis",
        description: "Write specs, runbooks, and meeting notes that live alongside your work. Link any doc to tasks, projects, or team spaces.",
        tags: ["Rich text", "Link to tasks", "Version history"],
        visual: <DocsVisual />,
    },
    // ── Automation ──
    {
        id: "rules",
        category: "automation",
        badge: "Pro+",
        badgeColor: "#38bdf8",
        title: "Automation Rules",
        description: "Build if-then automations without code. Auto-assign, move cards, send notifications, and trigger webhooks based on any field change.",
        tags: ["No-code", "Triggers", "Webhooks"],
        visual: <AutomationVisual />,
    },
    {
        id: "ai",
        category: "automation",
        badge: "Add-on",
        badgeColor: "#a78bfa",
        title: "FlowBoard AI",
        description: "Summarise threads, auto-generate tasks from meeting notes, surface blockers before they happen, and write status updates in one click.",
        tags: ["Summaries", "Task gen", "Blocker detection"],
        visual: <AIVisual />,
    },
    // ── Analytics ──
    {
        id: "dashboards",
        category: "analytics",
        badge: "Pro+",
        badgeColor: "#38bdf8",
        title: "Custom Dashboards",
        description: "Drag widgets onto a canvas — velocity charts, burndowns, cycle times, and custom metrics — then share with stakeholders via link.",
        tags: ["Widgets", "Share link", "Auto-refresh"],
        visual: <DashboardVisual />,
    },
    {
        id: "reports",
        category: "analytics",
        badge: "Business+",
        badgeColor: "#f59e0b",
        title: "Advanced Reports",
        description: "Drill into sprint retrospectives, cross-project comparisons, and team workload distribution. Export to CSV or PDF in one click.",
        tags: ["Export", "Cross-project", "Workload"],
        visual: <ReportsVisual />,
    },
    // ── Security ──
    {
        id: "sso",
        category: "security",
        badge: "Business+",
        badgeColor: "#f59e0b",
        title: "SSO & SCIM",
        description: "Connect FlowBoard to Okta, Azure AD, or any SAML/OIDC provider. Provision and deprovision users automatically via SCIM.",
        tags: ["SAML", "OIDC", "SCIM"],
        visual: <SSOVisual />,
    },
    {
        id: "audit",
        category: "security",
        badge: "Business+",
        badgeColor: "#f59e0b",
        title: "Audit Logs",
        description: "A tamper-proof record of every action in your workspace. Filter by user, resource, or event type and export for compliance.",
        tags: ["Tamper-proof", "Export", "Compliance"],
        visual: <AuditVisual />,
    },
];

const STATS = [
    { value: "40+", label: "Features shipped in 2024" },
    { value: "3.2M", label: "Tasks completed monthly" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "< 4h", label: "Support response time" },
];
function KanbanVisual() {
    const cols = [
        { label: "To Do", accent: "#94a3b8", cards: 3 },
        { label: "Doing", accent: "#38bdf8", cards: 2 },
        { label: "Done", accent: "#4CAF88", cards: 4 },
    ];
    return (
        <div className="fv-visual fv-kanban" aria-hidden="true">
            {cols.map(({ label, accent, cards }) => (
                <div key={label} className="fv-kanban__col">
                    <div className="fv-kanban__header">
                        <span className="fv-kanban__dot" style={{ background: accent }} />
                        <span className="fv-kanban__label">{label}</span>
                        <span className="fv-kanban__count">{cards}</span>
                    </div>
                    {Array.from({ length: Math.min(cards, 2) }).map((_, i) => (
                        <div key={i} className="fv-kanban__card">
                            <span className="fv-kanban__bar" style={{ background: accent }} />
                            <div className="fv-kanban__lines">
                                <span className="fv-kanban__line fv-kanban__line--long" />
                                <span className="fv-kanban__line fv-kanban__line--short" />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

function TimelineVisual() {
    const rows = [
        { label: "Design", accent: "#a78bfa", start: 0, width: 45 },
        { label: "Build", accent: "#38bdf8", start: 30, width: 55 },
        { label: "QA", accent: "#f59e0b", start: 60, width: 30 },
        { label: "Launch", accent: "#4CAF88", start: 75, width: 25 },
    ];
    return (
        <div className="fv-visual fv-timeline" aria-hidden="true">
            <div className="fv-timeline__months">
                {["Jan", "Feb", "Mar", "Apr"].map(m => (
                    <span key={m} className="fv-timeline__month">{m}</span>
                ))}
            </div>
            {rows.map(({ label, accent, start, width }) => (
                <div key={label} className="fv-timeline__row">
                    <span className="fv-timeline__row-label">{label}</span>
                    <div className="fv-timeline__track">
                        <div
                            className="fv-timeline__bar"
                            style={{ left: `${start}%`, width: `${width}%`, background: accent }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function SprintVisual() {
    const items = [
        { label: "Auth redesign", pts: 5, done: true },
        { label: "API rate limits", pts: 3, done: true },
        { label: "Mobile nav", pts: 8, done: false },
        { label: "Onboarding flow", pts: 5, done: false },
    ];
    return (
        <div className="fv-visual fv-sprint" aria-hidden="true">
            <div className="fv-sprint__header">
                <span className="fv-sprint__title">Sprint 12 · 13 pts remaining</span>
                <div className="fv-sprint__bar-wrap">
                    <div className="fv-sprint__bar-fill" style={{ width: "46%" }} />
                </div>
            </div>
            {items.map(({ label, pts, done }) => (
                <div key={label} className={`fv-sprint__item${done ? " fv-sprint__item--done" : ""}`}>
                    <span className="fv-sprint__check" style={done ? { background: "#4CAF88", borderColor: "#4CAF88" } : {}}>
                        {done && "✓"}
                    </span>
                    <span className="fv-sprint__label">{label}</span>
                    <span className="fv-sprint__pts">{pts}pt</span>
                </div>
            ))}
        </div>
    );
}

function ThreadsVisual() {
    const msgs = [
        { initials: "MO", color: "#4CAF88", text: "Can we push this to Friday?", indent: false },
        { initials: "JP", color: "#38bdf8", text: "Friday works. Assigning to you.", indent: true },
        { initials: "LR", color: "#f59e0b", text: "I'll review once it's merged.", indent: true },
    ];
    return (
        <div className="fv-visual fv-threads" aria-hidden="true">
            {msgs.map(({ initials, color, text, indent }, i) => (
                <div key={i} className={`fv-thread__msg${indent ? " fv-thread__msg--indent" : ""}`}>
                    <span className="fv-thread__avatar" style={{ background: color }}>{initials}</span>
                    <div className="fv-thread__bubble">
                        <span className="fv-thread__text">{text}</span>
                    </div>
                </div>
            ))}
            <div className="fv-thread__input">
                <span className="fv-thread__input-ph">Reply…</span>
                <span className="fv-thread__cursor" />
            </div>
        </div>
    );
}

function PresenceVisual() {
    const users = [
        { initials: "MO", color: "#4CAF88", label: "Viewing", x: 28, y: 30 },
        { initials: "JP", color: "#38bdf8", label: "Editing", x: 62, y: 55 },
        { initials: "LR", color: "#f59e0b", label: "Viewing", x: 45, y: 75 },
    ];
    return (
        <div className="fv-visual fv-presence" aria-hidden="true">
            <div className="fv-presence__avatars">
                {users.map(({ initials, color }) => (
                    <span key={initials} className="fv-presence__avatar" style={{ background: color }}>{initials}</span>
                ))}
                <span className="fv-presence__live">● Live</span>
            </div>
            <div className="fv-presence__canvas">
                {users.map(({ initials, color, label, x, y }) => (
                    <div key={initials} className="fv-presence__cursor" style={{ left: `${x}%`, top: `${y}%` }}>
                        <span className="fv-presence__cursor-arrow" style={{ color }} aria-hidden="true">▲</span>
                        <span className="fv-presence__cursor-tag" style={{ background: color }}>{initials} · {label}</span>
                    </div>
                ))}
                <div className="fv-presence__doc-lines">
                    {[80, 65, 70, 50, 60].map((w, i) => (
                        <span key={i} className="fv-presence__doc-line" style={{ width: `${w}%` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function DocsVisual() {
    return (
        <div className="fv-visual fv-docs" aria-hidden="true">
            <div className="fv-docs__topbar">
                <span className="fv-docs__title">📄 API Integration Spec</span>
                <span className="fv-docs__tag">Linked to 3 tasks</span>
            </div>
            <div className="fv-docs__body">
                <div className="fv-docs__h1" />
                {[85, 70, 90, 60].map((w, i) => (
                    <div key={i} className="fv-docs__line" style={{ width: `${w}%` }} />
                ))}
                <div className="fv-docs__block">
                    {[75, 80, 65].map((w, i) => (
                        <div key={i} className="fv-docs__code-line" style={{ width: `${w}%` }} />
                    ))}
                </div>
                {[70, 55].map((w, i) => (
                    <div key={i} className="fv-docs__line" style={{ width: `${w}%` }} />
                ))}
            </div>
        </div>
    );
}

function AutomationVisual() {
    const steps = [
        { label: "When", value: "Card moved to Done", color: "#4CAF88" },
        { label: "Then", value: "Assign to QA lead", color: "#38bdf8" },
        { label: "And", value: "Post to #releases", color: "#a78bfa" },
    ];
    return (
        <div className="fv-visual fv-automation" aria-hidden="true">
            {steps.map(({ label, value, color }, i) => (
                <div key={i} className="fv-auto__step">
                    <span className="fv-auto__badge" style={{ background: `${color}18`, color, borderColor: `${color}30` }}>{label}</span>
                    <span className="fv-auto__value">{value}</span>
                    {i < steps.length - 1 && <span className="fv-auto__arrow" aria-hidden="true">↓</span>}
                </div>
            ))}
        </div>
    );
}

function AIVisual() {
    return (
        <div className="fv-visual fv-ai" aria-hidden="true">
            <div className="fv-ai__prompt">
                <span className="fv-ai__spark">✦</span>
                <span className="fv-ai__prompt-text">Summarise this thread</span>
            </div>
            <div className="fv-ai__response">
                <div className="fv-ai__response-header">
                    <span className="fv-ai__badge">FlowBoard AI</span>
                </div>
                {[90, 75, 85, 60, 70].map((w, i) => (
                    <div key={i} className="fv-ai__line" style={{ width: `${w}%`, animationDelay: `${i * 0.12}s` }} />
                ))}
                <div className="fv-ai__tasks">
                    {["Create ticket #204", "Assign to JP", "Due Friday"].map((t, i) => (
                        <div key={i} className="fv-ai__task">
                            <span className="fv-ai__task-dot" />
                            <span className="fv-ai__task-text">{t}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function DashboardVisual() {
    const bars = [55, 70, 45, 80, 65, 90, 75];
    return (
        <div className="fv-visual fv-dashboard" aria-hidden="true">
            <div className="fv-dash__row">
                {[
                    { label: "Velocity", value: "↑34%", color: "#4CAF88" },
                    { label: "Cycle time", value: "2.4d", color: "#38bdf8" },
                ].map(({ label, value, color }) => (
                    <div key={label} className="fv-dash__stat">
                        <span className="fv-dash__stat-val" style={{ color }}>{value}</span>
                        <span className="fv-dash__stat-label">{label}</span>
                    </div>
                ))}
            </div>
            <div className="fv-dash__bars">
                {bars.map((h, i) => (
                    <div key={i} className="fv-dash__bar-wrap">
                        <div
                            className="fv-dash__bar"
                            style={{
                                height: `${h}%`,
                                background: `linear-gradient(to top, #003934, #4CAF88)`,
                                animationDelay: `${i * 70}ms`,
                            }}
                        />
                    </div>
                ))}
            </div>
            <svg className="fv-dash__spark" viewBox="0 0 200 60" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="fg-spark" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#4CAF88" stopOpacity=".7" />
                        <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                </defs>
                <polyline
                    points="0,50 28,35 56,42 84,18 112,28 140,10 168,20 200,5"
                    fill="none" stroke="url(#fg-spark)" strokeWidth="2.5"
                    strokeLinejoin="round" strokeLinecap="round"
                />
            </svg>
        </div>
    );
}

function ReportsVisual() {
    const segments = [
        { pct: 38, color: "#4CAF88" },
        { pct: 27, color: "#38bdf8" },
        { pct: 22, color: "#f59e0b" },
        { pct: 13, color: "#a78bfa" },
    ];
    let cumulative = 0;
    const r = 28, cx = 36, cy = 36, circ = 2 * Math.PI * r;
    return (
        <div className="fv-visual fv-reports" aria-hidden="true">
            <svg className="fv-reports__donut" viewBox="0 0 72 72">
                {segments.map(({ pct, color }, i) => {
                    const dash = (pct / 100) * circ;
                    const offset = -(cumulative / 100) * circ;
                    cumulative += pct;
                    return (
                        <circle
                            key={i} cx={cx} cy={cy} r={r}
                            fill="none" stroke={color} strokeWidth="9"
                            strokeDasharray={`${dash} ${circ - dash}`}
                            strokeDashoffset={offset}
                            transform={`rotate(-90 ${cx} ${cy})`}
                            strokeLinecap="butt"
                        />
                    );
                })}
                <text x="36" y="40" textAnchor="middle" fontSize="9" fill="#003934" fontFamily="serif">91%</text>
            </svg>
            <div className="fv-reports__legend">
                {["Design", "Backend", "QA", "DevOps"].map((label, i) => (
                    <div key={label} className="fv-reports__legend-row">
                        <span className="fv-reports__legend-dot" style={{ background: segments[i].color }} />
                        <span className="fv-reports__legend-label">{label}</span>
                        <span className="fv-reports__legend-pct">{segments[i].pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SSOVisual() {
    const providers = [
        { label: "Okta", color: "#007DC1", abbr: "Ok" },
        { label: "Azure AD", color: "#0078D4", abbr: "Az" },
        { label: "Google", color: "#EA4335", abbr: "G" },
    ];
    return (
        <div className="fv-visual fv-sso" aria-hidden="true">
            <div className="fv-sso__providers">
                {providers.map(({ label, color, abbr }) => (
                    <div key={label} className="fv-sso__provider">
                        <span className="fv-sso__provider-icon" style={{ background: `${color}15`, color, borderColor: `${color}25` }}>{abbr}</span>
                        <span className="fv-sso__provider-label">{label}</span>
                        <span className="fv-sso__provider-check">✓</span>
                    </div>
                ))}
            </div>
            <div className="fv-sso__flow">
                <span className="fv-sso__node fv-sso__node--idp">IdP</span>
                <span className="fv-sso__arrow-line" />
                <span className="fv-sso__node fv-sso__node--saml">SAML</span>
                <span className="fv-sso__arrow-line" />
                <span className="fv-sso__node fv-sso__node--fb">FlowBoard</span>
            </div>
        </div>
    );
}

function AuditVisual() {
    const events = [
        { user: "MO", action: "Exported project data", time: "2m ago", color: "#4CAF88" },
        { user: "JP", action: "Changed member role", time: "18m ago", color: "#38bdf8" },
        { user: "LR", action: "Deleted task #2041", time: "1h ago", color: "#f59e0b" },
        { user: "TV", action: "Invited new@org.com", time: "3h ago", color: "#a78bfa" },
    ];
    return (
        <div className="fv-visual fv-audit" aria-hidden="true">
            <div className="fv-audit__header">
                <span className="fv-audit__title">Audit log</span>
                <span className="fv-audit__badge">Tamper-proof</span>
            </div>
            {events.map(({ user, action, time, color }) => (
                <div key={action} className="fv-audit__row">
                    <span className="fv-audit__avatar" style={{ background: color }}>{user}</span>
                    <span className="fv-audit__action">{action}</span>
                    <span className="fv-audit__time">{time}</span>
                </div>
            ))}
        </div>
    );
}
function useInView(threshold = 0.12) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, visible];
}
function SectionLabel({ children, light }) {
    return (
        <span className={`fv-label${light ? " fv-label--light" : ""}`}>
            <span className="fv-label__dot" aria-hidden="true" />
            {children}
        </span>
    );
}

function FeatureCard({ feature, index, visible }) {
    const isEven = index % 2 === 1;
    return (
        <article
            className={`fv-card${isEven ? " fv-card--flip" : ""}${visible ? " fv-card--visible" : ""}`}
            style={{ "--delay": `${index * 0.07}s` }}
            aria-labelledby={`fv-feat-${feature.id}`}
        >
            <div className="fv-card__copy">
                <div className="fv-card__meta">
                    <span
                        className="fv-card__badge"
                        style={{ color: feature.badgeColor, background: `${feature.badgeColor}15`, borderColor: `${feature.badgeColor}28` }}
                    >
                        {feature.badge}
                    </span>
                    <span className="fv-card__category">{
                        CATEGORIES.find(c => c.id === feature.category)?.label
                    }</span>
                </div>

                <h3 id={`fv-feat-${feature.id}`} className="fv-card__title">
                    {feature.title}
                </h3>

                <p className="fv-card__desc">{feature.description}</p>

                <ul className="fv-card__tags" role="list" aria-label="Feature highlights">
                    {feature.tags.map(tag => (
                        <li key={tag} className="fv-card__tag">{tag}</li>
                    ))}
                </ul>
            </div>

            <div className="fv-card__media" aria-hidden="true">
                <div className="fv-card__media-inner">
                    {feature.visual}
                </div>
            </div>
        </article>
    );
}

function StatBar({ visible }) {
    return (
        <div className="fv-stats" role="list" aria-label="FlowBoard by the numbers">
            {STATS.map(({ value, label }, i) => (
                <div
                    key={label}
                    className={`fv-stat${visible ? " fv-stat--visible" : ""}`}
                    style={{ "--delay": `${i * 0.09}s` }}
                    role="listitem"
                >
                    <span className="fv-stat__value">{value}</span>
                    <span className="fv-stat__label">{label}</span>
                </div>
            ))}
        </div>
    );
}

export default function Features() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [statsRef, statsVisible] = useInView(0.2);
    const cardsRef = useRef(null);

    const filtered = activeCategory === "all"
        ? FEATURES
        : FEATURES.filter(f => f.category === activeCategory);

    const handleFilter = (id) => {
        setActiveCategory(id);
        cardsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            
            <main className="fv" aria-label="FlowBoard features">
                <div className="fv-hero">
                    <div className="fv-hero__inner">
                        <SectionLabel light>Features</SectionLabel>
                        <h1 className="fv-hero__headline">
                            Everything your team needs<br />
                            <em>in one place</em>
                        </h1>
                        <p className="fv-hero__sub">
                            From a two-person startup to a thousand-person org —
                            FlowBoard scales with the way you actually work.
                        </p>
                        <nav className="fv-hero__cta" aria-label="Get started">
                            <Link to="/register" className="fv-hero__btn fv-hero__btn--primary">
                                Start for free
                                <span className="fv-hero__arrow" aria-hidden="true">→</span>
                            </Link>
                            <Link to="/pricing" className="fv-hero__btn fv-hero__btn--ghost">
                                See pricing
                            </Link>
                        </nav>
                    </div>
                </div>
                <div ref={statsRef}>
                    <StatBar visible={statsVisible} />
                </div>
                <div className="fv-filter-wrap" role="navigation" aria-label="Filter features by category">
                    <div className="fv-filter">
                        {CATEGORIES.map(({ id, label }) => (
                            <button
                                key={id}
                                className={`fv-filter__btn${activeCategory === id ? " fv-filter__btn--active" : ""}`}
                                onClick={() => handleFilter(id)}
                                aria-pressed={activeCategory === id}
                                type="button"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="fv-cards-section" ref={cardsRef}>
                    <div className="fv-cards-section__inner">
                        {filtered.map((feature, i) => (
                            <FeatureCard
                                key={feature.id}
                                feature={feature}
                                index={i}
                                visible={true}
                            />
                        ))}
                    </div>
                </div>
                <div className="fv-closing">
                    <div className="fv-closing__inner">
                        <SectionLabel light>Ready to explore?</SectionLabel>
                        <h2 className="fv-closing__headline">
                            See every feature<br />
                            <em>live in your workspace</em>
                        </h2>
                        <p className="fv-closing__sub">
                            Start a free trial and explore the full feature set with
                            your own projects and team — no dummy data required.
                        </p>
                        <nav className="fv-closing__actions" aria-label="Trial actions">
                            <Link to="/register" className="fv-closing__btn fv-closing__btn--primary">
                                Start free trial
                                <span className="fv-closing__btn-arrow" aria-hidden="true">→</span>
                            </Link>
                            <Link to="/pricing" className="fv-closing__btn fv-closing__btn--ghost">
                                Compare plans
                            </Link>
                        </nav>
                    </div>
                </div>
            </main>
        </>
    );
}