import { useEffect, useRef, useState } from "react";
import '../styles/Featurescomponent.css';
const FEATURES = [
    {
        id: "task-management",
        number: "01",
        title: "Task Management",
        description:
            "Structure work into focused sprints using a flexible Kanban board. Drag, prioritize, and ship — with full control over every detail.",
        tags: ["Kanban", "Sprints", "Priorities"],
        visual: <TaskVisual />,
    },
    {
        id: "team-collaboration",
        number: "02",
        title: "Team Collaboration",
        description:
            "Invite teammates, assign ownership, and comment in context. Everyone stays aligned without the noise of another chat thread.",
        tags: ["Mentions", "Roles", "Real-time"],
        visual: <CollabVisual />,
    },
    {
        id: "progress-tracking",
        number: "03",
        title: "Progress Tracking",
        description:
            "Surface bottlenecks before they become blockers. Live dashboards give your team a shared view of velocity, completion, and risk.",
        tags: ["Analytics", "Velocity", "Reports"],
        visual: <TrackingVisual />,
    },
];
function TaskVisual() {
    const cols = [
        { label: "Backlog", accent: "#94a3b8", count: 3 },
        { label: "In Progress", accent: "#38bdf8", count: 2 },
        { label: "Done", accent: "#4ade80", count: 4 },
    ];
    return (
        <div className="feat-visual feat-visual--task" aria-hidden="true">
            {cols.map(({ label, accent, count }) => (
                <div key={label} className="feat-col">
                    <div className="feat-col__header">
                        <span className="feat-col__dot" style={{ background: accent }} />
                        <span className="feat-col__label">{label}</span>
                        <span className="feat-col__badge">{count}</span>
                    </div>
                    {Array.from({ length: count > 2 ? 2 : count }).map((_, i) => (
                        <div key={i} className="feat-card">
                            <span className="feat-card__bar" style={{ background: accent }} />
                            <div className="feat-card__lines">
                                <span className="feat-card__line feat-card__line--long" />
                                <span className="feat-card__line feat-card__line--short" />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

function CollabVisual() {
    const members = [
        { initials: "AK", color: "#4CAF88" },
        { initials: "SL", color: "#38bdf8" },
        { initials: "MR", color: "#f59e0b" },
        { initials: "JW", color: "#a78bfa" },
    ];
    return (
        <div className="feat-visual feat-visual--collab" aria-hidden="true">
            <div className="feat-collab__avatars">
                {members.map(({ initials, color }) => (
                    <span
                        key={initials}
                        className="feat-collab__avatar"
                        style={{ background: color }}
                    >
                        {initials}
                    </span>
                ))}
                <span className="feat-collab__avatar feat-collab__avatar--more">+5</span>
            </div>
            <div className="feat-collab__thread">
                {[
                    { side: "left", color: "#4CAF88", wide: true },
                    { side: "right", color: "#38bdf8", wide: false },
                    { side: "left", color: "#4CAF88", wide: false },
                ].map(({ side, color, wide }, i) => (
                    <div key={i} className={`feat-bubble feat-bubble--${side}`}>
                        <span
                            className="feat-bubble__dot"
                            style={{ background: color }}
                        />
                        <span
                            className={`feat-bubble__line${wide ? " feat-bubble__line--wide" : ""}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function TrackingVisual() {
    const bars = [40, 65, 55, 80, 70, 90, 75];
    const points = bars;
    const max = Math.max(...points);
    const w = 220;
    const h = 80;
    const pts = points
        .map((v, i) => `${(i / (points.length - 1)) * w},${h - (v / max) * h}`)
        .join(" ");

    return (
        <div className="feat-visual feat-visual--tracking" aria-hidden="true">
            <div className="feat-bars">
                {bars.map((v, i) => (
                    <div key={i} className="feat-bar-wrap">
                        <div
                            className="feat-bar"
                            style={{ height: `${v}%`, animationDelay: `${i * 80}ms` }}
                        />
                    </div>
                ))}
            </div>
            <svg
                className="feat-sparkline"
                viewBox={`0 0 ${w} ${h}`}
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="spark-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#4CAF88" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
                    </linearGradient>
                </defs>
                <polyline
                    points={pts}
                    fill="none"
                    stroke="url(#spark-grad)"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
                {points.map((v, i) => (
                    <circle
                        key={i}
                        cx={(i / (points.length - 1)) * w}
                        cy={h - (v / max) * h}
                        r="3"
                        fill="#4CAF88"
                    />
                ))}
            </svg>
            <div className="feat-stat-row">
                {[
                    { label: "Velocity", value: "+24%" },
                    { label: "On track", value: "91%" },
                ].map(({ label, value }) => (
                    <div key={label} className="feat-stat">
                        <span className="feat-stat__value">{value}</span>
                        <span className="feat-stat__label">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FeatureCard({ feature, index }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const isEven = index % 2 === 1;

    return (
        <article
            ref={ref}
            className={`feat-card-row${isEven ? " feat-card-row--flip" : ""}${visible ? " feat-card-row--visible" : ""}`}
            style={{ "--delay": `${index * 80}ms` }}
            aria-labelledby={`feat-title-${feature.id}`}
        >
            <div className="feat-card-copy">
                <span className="feat-number" aria-hidden="true">{feature.number}</span>
                <h3 id={`feat-title-${feature.id}`} className="feat-title">
                    {feature.title}
                </h3>
                <p className="feat-desc">{feature.description}</p>
                <ul className="feat-tags" aria-label="Feature highlights" role="list">
                    {feature.tags.map((tag) => (
                        <li key={tag} className="feat-tag">{tag}</li>
                    ))}
                </ul>
            </div>
            <div className="feat-card-media" aria-hidden="true">
                <div className="feat-card-media__inner">
                    {feature.visual}
                </div>
            </div>
        </article>
    );
}

export default function Features() {
    return (
        <>
            <section className="features" aria-labelledby="features-headline">
                <div className="features__inner">
                    <header className="features__header">
                        <span className="features__kicker">
                            <span className="features__kicker-dot" aria-hidden="true" />
                            What's inside
                        </span>
                        <h2 id="features-headline" className="features__headline">
                            Built for teams that<br />
                            <em>actually ship</em>
                        </h2>
                        <p className="features__sub">
                            Every feature in FlowBoard is designed to reduce friction
                            and keep your team focused on what matters.
                        </p>
                    </header>
                    <div role="list">
                        {FEATURES.map((feature, i) => (
                            <FeatureCard key={feature.id} feature={feature} index={i} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}