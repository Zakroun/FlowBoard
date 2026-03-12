import { useEffect, useRef, useState } from "react";
import '../styles/HowItWorks.css';
const STEPS = [
    {
        id: "create-project",
        number: "01",
        title: "Create a project",
        description:
            "Name your project, set a goal, and choose a workflow template. FlowBoard configures your board instantly — no setup overhead.",
        detail: "Takes under 60 seconds",
        visual: <CreateVisual />,
    },
    {
        id: "add-tasks",
        number: "02",
        title: "Break it into tasks",
        description:
            "Add tasks, assign owners, set due dates, and attach context. Everything your team needs lives right on the card.",
        detail: "No more lost context",
        visual: <TasksVisual />,
    },
    {
        id: "track-progress",
        number: "03",
        title: "Ship with confidence",
        description:
            "Drag tasks across your board as work moves forward. Live progress rings and velocity charts keep everyone honest.",
        detail: "Real-time for the whole team",
        visual: <TrackVisual />,
    },
];
function CreateVisual() {
    return (
        <div className="hiw-visual" aria-hidden="true">
            <div className="hiw-form">
                <div className="hiw-form__row">
                    <span className="hiw-form__label">Project name</span>
                    <div className="hiw-form__field hiw-form__field--filled">
                        <span className="hiw-form__cursor" />
                        Q3 Launch
                    </div>
                </div>
                <div className="hiw-form__row">
                    <span className="hiw-form__label">Template</span>
                    <div className="hiw-form__field hiw-form__select">
                        Kanban Board
                        <span className="hiw-form__chevron">▾</span>
                    </div>
                </div>
                <div className="hiw-form__row">
                    <span className="hiw-form__label">Team</span>
                    <div className="hiw-form__avatars">
                        {["#4CAF88", "#38bdf8", "#f59e0b"].map((c) => (
                            <span key={c} className="hiw-form__avatar" style={{ background: c }} />
                        ))}
                        <span className="hiw-form__avatar hiw-form__avatar--add">+</span>
                    </div>
                </div>
                <div className="hiw-form__btn">Create project →</div>
            </div>
        </div>
    );
}

function TasksVisual() {
    const tasks = [
        { label: "Design system audit", tag: "Design", color: "#a78bfa", done: true },
        { label: "API authentication", tag: "Backend", color: "#38bdf8", done: true },
        { label: "Onboarding flow", tag: "Product", color: "#4CAF88", done: false },
        { label: "Mobile nav polish", tag: "Frontend", color: "#f59e0b", done: false },
    ];
    return (
        <div className="hiw-visual" aria-hidden="true">
            <div className="hiw-tasklist">
                {tasks.map(({ label, tag, color, done }) => (
                    <div key={label} className={`hiw-taskitem${done ? " hiw-taskitem--done" : ""}`}>
                        <span
                            className="hiw-taskitem__check"
                            style={done ? { background: color, borderColor: color } : {}}
                        >
                            {done && "✓"}
                        </span>
                        <span className="hiw-taskitem__label">{label}</span>
                        <span className="hiw-taskitem__tag" style={{ color, background: `${color}18` }}>
                            {tag}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TrackVisual() {
    const cols = [
        { label: "To Do", accent: "#94a3b8", pct: 20 },
        { label: "In Progress", accent: "#38bdf8", pct: 65 },
        { label: "Done", accent: "#4CAF88", pct: 100 },
    ];
    return (
        <div className="hiw-visual" aria-hidden="true">
            <div className="hiw-track">
                {cols.map(({ label, accent, pct }) => (
                    <div key={label} className="hiw-track__col">
                        <div className="hiw-track__ring-wrap">
                            <svg viewBox="0 0 44 44" className="hiw-track__ring">
                                <circle cx="22" cy="22" r="18" fill="none" stroke="#e9eff4" strokeWidth="4" />
                                <circle
                                    cx="22" cy="22" r="18"
                                    fill="none"
                                    stroke={accent}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeDasharray={`${(pct / 100) * 113} 113`}
                                    transform="rotate(-90 22 22)"
                                />
                            </svg>
                            <span className="hiw-track__pct" style={{ color: accent }}>{pct}%</span>
                        </div>
                        <span className="hiw-track__label">{label}</span>
                    </div>
                ))}
            </div>
            <div className="hiw-track__bar-wrap">
                <div className="hiw-track__bar-label">
                    <span>Sprint 3 overall</span>
                    <span style={{ color: "#4CAF88", fontWeight: 600 }}>62%</span>
                </div>
                <div className="hiw-track__bar-bg">
                    <div className="hiw-track__bar-fill" />
                </div>
            </div>
        </div>
    );
}
function StepConnector() {
    return (
        <div className="hiw-connector" aria-hidden="true">
            <div className="hiw-connector__line" />
            <div className="hiw-connector__arrow">›</div>
        </div>
    );
}
function StepCard({ step, index, total }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
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
            <article
                ref={ref}
                className={`hiw-step${visible ? " hiw-step--visible" : ""}`}
                style={{ "--delay": `${index * 120}ms` }}
                aria-labelledby={`hiw-title-${step.id}`}
            >
                <div className="hiw-step__badge" aria-hidden="true">
                    <span className="hiw-step__num">{step.number}</span>
                    <span className="hiw-step__ring" />
                </div>
                <div className="hiw-step__media">
                    {step.visual}
                </div>
                <div className="hiw-step__copy">
                    <h3 id={`hiw-title-${step.id}`} className="hiw-step__title">
                        {step.title}
                    </h3>
                    <p className="hiw-step__desc">{step.description}</p>
                    <span className="hiw-step__detail">
                        <span className="hiw-step__detail-dot" aria-hidden="true" />
                        {step.detail}
                    </span>
                </div>
            </article>
            {index < total - 1 && <StepConnector />}
        </>
    );
}

export default function HowItWorks() {
    return (
        <>
            <section className="hiw" aria-labelledby="hiw-headline">
                <div className="hiw__inner">
                    <header className="hiw__header">
                        <span className="hiw__kicker">
                            <span className="hiw__kicker-dot" aria-hidden="true" />
                            Getting started
                        </span>
                        <h2 id="hiw-headline" className="hiw__headline">
                            From zero to shipped<br />
                            <em>in three steps</em>
                        </h2>
                        <p className="hiw__sub">
                            No onboarding calls. No 40-page docs. Just open FlowBoard
                            and start moving work forward.
                        </p>
                    </header>
                    <div className="hiw__steps" role="list">
                        {STEPS.map((step, i) => (
                            <StepCard
                                key={step.id}
                                step={step}
                                index={i}
                                total={STEPS.length}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}