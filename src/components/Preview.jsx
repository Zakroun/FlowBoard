import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/Preview.css';
const BOARD_COLUMNS = [
    {
        id: "todo",
        label: "To Do",
        accent: "#94a3b8",
        cards: [
            { title: "Competitive analysis", tag: "Research", assignee: "#a78bfa" },
            { title: "Landing page copy", tag: "Content", assignee: "#f59e0b" },
        ],
    },
    {
        id: "in-progress",
        label: "In Progress",
        accent: "#38bdf8",
        cards: [
            { title: "Auth flow redesign", tag: "Design", assignee: "#4CAF88" },
            { title: "Billing integration", tag: "Backend", assignee: "#38bdf8" },
            { title: "Onboarding checklist", tag: "Product", assignee: "#f59e0b" },
        ],
    },
    {
        id: "review",
        label: "Review",
        accent: "#f59e0b",
        cards: [
            { title: "Mobile nav polish", tag: "Frontend", assignee: "#a78bfa" },
        ],
    },
    {
        id: "done",
        label: "Done",
        accent: "#4CAF88",
        cards: [
            { title: "CI/CD pipeline", tag: "DevOps", assignee: "#38bdf8" },
            { title: "Design tokens", tag: "Design", assignee: "#4CAF88" },
        ],
    },
];

const BULLET_POINTS = [
    { label: "Drag-and-drop Kanban", detail: "Move cards fluidly across any stage" },
    { label: "Custom workflows", detail: "Build columns that match how you work" },
    { label: "Live team presence", detail: "See who's working on what, in real time" },
    { label: "One-click reporting", detail: "Export velocity & burndown in seconds" },
];
function BoardCard({ title, tag, assignee, delay }) {
    return (
        <div className="pvw-card" style={{ animationDelay: delay }}>
            <div className="pvw-card__top">
                <span className="pvw-card__tag">{tag}</span>
                <span className="pvw-card__avatar" style={{ background: assignee }} />
            </div>
            <p className="pvw-card__title">{title}</p>
            <div className="pvw-card__meta">
                <span className="pvw-card__dot" />
                <span className="pvw-card__dot" />
                <span className="pvw-card__dot pvw-card__dot--faint" />
            </div>
        </div>
    );
}

function BoardColumn({ col, colIndex }) {
    return (
        <div className="pvw-col">
            <div className="pvw-col__header">
                <span className="pvw-col__dot" style={{ background: col.accent }} />
                <span className="pvw-col__label">{col.label}</span>
                <span className="pvw-col__count">{col.cards.length}</span>
            </div>
            <div className="pvw-col__cards">
                {col.cards.map((card, i) => (
                    <BoardCard
                        key={card.title}
                        {...card}
                        delay={`${colIndex * 80 + i * 60}ms`}
                    />
                ))}
            </div>
            <button className="pvw-col__add" tabIndex={-1} aria-hidden="true">
                <span>+</span> Add card
            </button>
        </div>
    );
}

function BoardPreview() {
    return (
        <div className="pvw-board-wrap" aria-label="FlowBoard Kanban preview" role="img">
            <div className="pvw-chrome" aria-hidden="true">
                <div className="pvw-chrome__dots">
                    <span className="pvw-chrome__dot" style={{ background: "#ef4444" }} />
                    <span className="pvw-chrome__dot" style={{ background: "#facc15" }} />
                    <span className="pvw-chrome__dot" style={{ background: "#4ade80" }} />
                </div>
                <span className="pvw-chrome__title">FlowBoard — Q3 Sprint</span>
                <div className="pvw-chrome__avatars">
                    {["#4CAF88", "#38bdf8", "#f59e0b"].map((c) => (
                        <span key={c} className="pvw-chrome__avatar" style={{ background: c }} />
                    ))}
                </div>
            </div>
            <div className="pvw-board">
                {BOARD_COLUMNS.map((col, i) => (
                    <BoardColumn key={col.id} col={col} colIndex={i} />
                ))}
            </div>
            <div className="pvw-board-glow" aria-hidden="true" />
        </div>
    );
}

function BulletPoint({ label, detail, index, visible }) {
    return (
        <li
            className={`pvw-bullet${visible ? " pvw-bullet--visible" : ""}`}
            style={{ "--delay": `${0.25 + index * 0.1}s` }}
        >
            <span className="pvw-bullet__check" aria-hidden="true">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>
            <div className="pvw-bullet__text">
                <span className="pvw-bullet__label">{label}</span>
                <span className="pvw-bullet__detail">{detail}</span>
            </div>
        </li>
    );
}

export default function Preview() {
    const copyRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = copyRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return (
        <>
            <section className="pvw" aria-labelledby="pvw-headline">
                <div className="pvw__inner">
                    <BoardPreview />
                    <div className="pvw__copy" ref={copyRef}>
                        <span className="pvw__kicker">
                            <span className="pvw__kicker-dot" aria-hidden="true" />
                            The board
                        </span>
                        <h2 id="pvw-headline" className="pvw__headline">
                            Your workflow,<br />
                            <em>finally visible</em>
                        </h2>
                        <p className="pvw__sub">
                            Stop guessing where work stands. FlowBoard's Kanban board
                            gives your team a single, shared view of every task —
                            from backlog to shipped.
                        </p>
                        <ul className="pvw__bullets" aria-label="Key capabilities">
                            {BULLET_POINTS.map((bp, i) => (
                                <BulletPoint
                                    key={bp.label}
                                    {...bp}
                                    index={i}
                                    visible={visible}
                                />
                            ))}
                        </ul>
                        <nav className="pvw__cta" aria-label="Preview actions">
                            <Link to="/register" className="pvw__btn pvw__btn--primary">
                                Start for free
                                <span className="pvw__btn-arrow" aria-hidden="true">→</span>
                            </Link>
                            <Link to="/demo" className="pvw__btn pvw__btn--ghost">
                                See live demo
                            </Link>
                        </nav>
                    </div>
                </div>
            </section>
        </>
    );
}