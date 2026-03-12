import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../layout/navbar.jsx";

const USER = {
    name: "Alex Kim",
    initials: "AK",
    role: "Product Lead",
};

const GREETING_BY_HOUR = (h) =>
    h < 5 ? "Burning the midnight oil" :
        h < 12 ? "Good morning" :
            h < 17 ? "Good afternoon" : "Good evening";

const SPRINT = {
    name: "Sprint 12",
    endsIn: 14,
    total: 45,
    done: 27,
    inProgress: 7,
    blocked: 2,
};

const PROJECTS = [
    {
        id: "p-q4",
        name: "Q4 Sprint",
        to: "/projects/q4",
        color: "#4CAF88",
        progress: 68,
        tasks: { open: 12, done: 26 },
        due: "Dec 20",
        members: ["AK", "JP", "MO"],
        memberColors: ["#4CAF88", "#38bdf8", "#f59e0b"],
        status: "on-track",
    },
    {
        id: "p-app",
        name: "App Redesign",
        to: "/projects/app",
        color: "#38bdf8",
        progress: 41,
        tasks: { open: 8, done: 9 },
        due: "Jan 15",
        members: ["LR", "TV"],
        memberColors: ["#a78bfa", "#f87171"],
        status: "at-risk",
    },
    {
        id: "p-infra",
        name: "Infra Migration",
        to: "/projects/infra",
        color: "#f59e0b",
        progress: 22,
        tasks: { open: 19, done: 6 },
        due: "Feb 3",
        members: ["JP", "AK"],
        memberColors: ["#38bdf8", "#4CAF88"],
        status: "on-track",
    },
];

const MY_TASKS = [
    { id: "t1", label: "Review auth redesign PR", project: "App Redesign", dot: "#38bdf8", priority: "high", done: false },
    { id: "t2", label: "Write Q4 retrospective doc", project: "Q4 Sprint", dot: "#4CAF88", priority: "medium", done: false },
    { id: "t3", label: "Postgres migration runbook", project: "Infra Migration", dot: "#f59e0b", priority: "high", done: false },
    { id: "t4", label: "Sync with design team", project: "App Redesign", dot: "#38bdf8", priority: "low", done: true },
    { id: "t5", label: "Update CI environment vars", project: "Q4 Sprint", dot: "#4CAF88", priority: "medium", done: true },
];

const ACTIVITY = [
    { id: "a1", user: "JP", color: "#38bdf8", action: "completed", subject: "CI pipeline fix", time: "3m" },
    { id: "a2", user: "MO", color: "#4CAF88", action: "commented on", subject: "Auth redesign", time: "18m" },
    { id: "a3", user: "LR", color: "#a78bfa", action: "moved", subject: "Mobile nav → Review", time: "1h" },
    { id: "a4", user: "TV", color: "#f87171", action: "flagged", subject: "Infra ticket #204", time: "2h" },
    { id: "a5", user: "AK", color: "#4CAF88", action: "created", subject: "Q4 retrospective doc", time: "3h" },
];

const DEADLINES = [
    { id: "d1", label: "Q4 sprint review", date: "Dec 20", daysLeft: 8, dot: "#4CAF88" },
    { id: "d2", label: "App redesign handoff", date: "Jan 15", daysLeft: 34, dot: "#38bdf8" },
    { id: "d3", label: "Infra cutover window", date: "Feb 3", daysLeft: 53, dot: "#f59e0b" },
];

const PRIORITY_META = {
    high: { label: "High", color: "#f87171", bg: "rgba(248,113,113,.1)" },
    medium: { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,.1)" },
    low: { label: "Low", color: "#4CAF88", bg: "rgba(76,175,136,.1)" },
};

const STATUS_META = {
    "on-track": { label: "On track", color: "#4CAF88", bg: "rgba(76,175,136,.1)" },
    "at-risk": { label: "At risk", color: "#f59e0b", bg: "rgba(245,158,11,.12)" },
    "blocked": { label: "Blocked", color: "#f87171", bg: "rgba(248,113,113,.1)" },
};

function useInView(threshold = 0.07) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    obs.disconnect();
                }
            },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);

    return [ref, visible];
}

function useNow() {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(id);
    }, []);
    return now;
}

function PageHeader({ now }) {
    const hour = now.getHours();
    const greeting = GREETING_BY_HOUR(hour);
    const dateStr = now.toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric",
    });

    const openCount = MY_TASKS.filter((t) => !t.done).length;
    const highCount = MY_TASKS.filter((t) => !t.done && t.priority === "high").length;

    return (
        <header className="hd-page-header">
            <div className="hd-page-header__copy">
                <p className="hd-page-header__date">{dateStr}</p>
                <h1 className="hd-page-header__greeting">
                    {greeting}, <em>{USER.name.split(" ")[0]}</em>
                </h1>
                <p className="hd-page-header__sub">
                    You have{" "}
                    <strong>{openCount} open tasks</strong>
                    {highCount > 0 && (
                        <>, including <span className="hd-page-header__high">{highCount} high-priority</span></>
                    )}
                    . Sprint {SPRINT.name.split(" ")[1]} ends in <strong>{SPRINT.endsIn} days</strong>.
                </p>
            </div>

            <div className="hd-page-header__actions">
                <Link to="/tasks/new" className="hd-btn hd-btn--ghost">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New task
                </Link>
                <Link to="/projects/new" className="hd-btn hd-btn--primary">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    New project
                </Link>
            </div>
        </header>
    );
}

function SprintBanner({ visible }) {
    const pct = Math.round((SPRINT.done / SPRINT.total) * 100);
    const remaining = SPRINT.total - SPRINT.done - SPRINT.inProgress;

    const segments = [
        { key: "done", value: SPRINT.done, color: "#4CAF88", label: "Done" },
        { key: "progress", value: SPRINT.inProgress, color: "#38bdf8", label: "In progress" },
        { key: "blocked", value: SPRINT.blocked, color: "#f87171", label: "Blocked" },
        { key: "remaining", value: remaining, color: "rgba(0,57,52,.08)", label: "Remaining" },
    ];

    return (
        <section
            className={`hd-sprint${visible ? " hd-sprint--visible" : ""}`}
            aria-label="Sprint overview"
        >
            <div className="hd-sprint__left">
                <div className="hd-sprint__meta">
                    <span className="hd-sprint__name">{SPRINT.name}</span>
                    <span className="hd-sprint__days">{SPRINT.endsIn} days left</span>
                </div>

                <div
                    className="hd-sprint__track"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Sprint completion: ${pct}%`}
                >
                    {segments.map((seg) => (
                        <div
                            key={seg.key}
                            className="hd-sprint__seg"
                            style={{
                                flex: seg.value,
                                background: seg.color,
                                transform: visible ? "scaleX(1)" : "scaleX(0)",
                                transitionDelay: seg.key === "done" ? "0ms" :
                                    seg.key === "progress" ? "80ms" :
                                        seg.key === "blocked" ? "140ms" : "180ms",
                            }}
                            aria-label={`${seg.label}: ${seg.value}`}
                        />
                    ))}
                </div>

                <div className="hd-sprint__legend" aria-hidden="true">
                    {segments.slice(0, 3).map((seg) => (
                        <span key={seg.key} className="hd-sprint__legend-item">
                            <span className="hd-sprint__legend-dot" style={{ background: seg.color }} />
                            {seg.value} {seg.label}
                        </span>
                    ))}
                </div>
            </div>

            <div className="hd-sprint__right" aria-hidden="true">
                <span className="hd-sprint__pct">{pct}<sup>%</sup></span>
                <span className="hd-sprint__pct-label">complete</span>
            </div>
        </section>
    );
}

function ProjectCard({ project, index, visible }) {
    const status = STATUS_META[project.status];

    return (
        <Link
            to={project.to}
            className={`hd-proj${visible ? " hd-proj--visible" : ""}`}
            style={{ "--delay": `${index * 0.08}s` }}
            aria-label={`${project.name} — ${project.progress}% complete, status: ${status.label}`}
        >
            <span
                className="hd-proj__bar"
                style={{ background: project.color }}
                aria-hidden="true"
            />

            <div className="hd-proj__head">
                <span className="hd-proj__name">{project.name}</span>
                <span
                    className="hd-proj__status"
                    style={{ color: status.color, background: status.bg }}
                >
                    {status.label}
                </span>
            </div>

            <div className="hd-proj__progress-row">
                <div className="hd-proj__track" aria-hidden="true">
                    <div
                        className="hd-proj__fill"
                        style={{
                            width: visible ? `${project.progress}%` : "0%",
                            background: project.color,
                            transitionDelay: `${index * 0.08 + 0.2}s`,
                        }}
                    />
                </div>
                <span className="hd-proj__pct">{project.progress}%</span>
            </div>

            <div className="hd-proj__foot">
                <div className="hd-proj__avatars" aria-label={`Team: ${project.members.join(", ")}`}>
                    {project.members.map((m, i) => (
                        <span
                            key={m}
                            className="hd-proj__avatar"
                            style={{ background: project.memberColors[i], zIndex: project.members.length - i }}
                            aria-hidden="true"
                        >
                            {m}
                        </span>
                    ))}
                </div>
                <div className="hd-proj__task-count">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="9 11 12 14 22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                    {project.tasks.done}/{project.tasks.open + project.tasks.done}
                </div>
                <span className="hd-proj__due">Due {project.due}</span>
            </div>
        </Link>
    );
}

function MyTasks({ visible }) {
    const [tasks, setTasks] = useState(MY_TASKS);
    const [filter, setFilter] = useState("all");

    const toggleTask = useCallback((id) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
        );
    }, []);

    const filtered = useMemo(() => {
        if (filter === "open") return tasks.filter((t) => !t.done);
        if (filter === "done") return tasks.filter((t) => t.done);
        return tasks;
    }, [tasks, filter]);

    const doneCount = tasks.filter((t) => t.done).length;

    return (
        <section
            className={`hd-tasks${visible ? " hd-tasks--visible" : ""}`}
            aria-label="My tasks for today"
        >
            <div className="hd-tasks__header">
                <div className="hd-tasks__title-row">
                    <h2 className="hd-tasks__title">My Tasks</h2>
                    <span className="hd-tasks__count" aria-label={`${doneCount} of ${tasks.length} complete`}>
                        {doneCount}/{tasks.length}
                    </span>
                </div>

                <div className="hd-tasks__filters" role="tablist" aria-label="Filter tasks">
                    {["all", "open", "done"].map((f) => (
                        <button
                            key={f}
                            type="button"
                            role="tab"
                            aria-selected={filter === f}
                            className={`hd-tasks__filter${filter === f ? " hd-tasks__filter--active" : ""}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <ul className="hd-tasks__list" role="list">
                {filtered.map((task, i) => {
                    const priority = PRIORITY_META[task.priority];
                    return (
                        <li
                            key={task.id}
                            className={`hd-tasks__item${task.done ? " hd-tasks__item--done" : ""}`}
                            style={{ "--td": `${i * 45}ms` }}
                        >
                            <button
                                type="button"
                                role="checkbox"
                                aria-checked={task.done}
                                aria-label={`Mark "${task.label}" as ${task.done ? "incomplete" : "complete"}`}
                                className={`hd-tasks__check${task.done ? " hd-tasks__check--done" : ""}`}
                                onClick={() => toggleTask(task.id)}
                                style={{ "--c": task.dot }}
                            >
                                {task.done && (
                                    <svg width="9" height="9" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>

                            <div className="hd-tasks__body">
                                <span className="hd-tasks__label">{task.label}</span>
                                <div className="hd-tasks__meta">
                                    <span className="hd-tasks__dot" style={{ background: task.dot }} aria-hidden="true" />
                                    <span className="hd-tasks__project">{task.project}</span>
                                </div>
                            </div>

                            <span
                                className="hd-tasks__priority"
                                style={{ color: priority.color, background: priority.bg }}
                                aria-label={`Priority: ${priority.label}`}
                            >
                                {priority.label}
                            </span>
                        </li>
                    );
                })}
            </ul>

            <div className="hd-tasks__footer">
                <Link to="/tasks" className="hd-tasks__view-all">
                    View all tasks
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                </Link>
            </div>
        </section>
    );
}

function ActivityFeed({ visible }) {
    return (
        <section
            className={`hd-activity${visible ? " hd-activity--visible" : ""}`}
            aria-label="Team activity"
        >
            <div className="hd-activity__header">
                <h2 className="hd-activity__title">Activity</h2>
                <span className="hd-activity__live" aria-label="Live updates active">
                    <span className="hd-activity__live-pip" aria-hidden="true" />
                    Live
                </span>
            </div>

            <ul className="hd-activity__list" role="list">
                {ACTIVITY.map((item, i) => (
                    <li
                        key={item.id}
                        className={`hd-activity__item${visible ? " hd-activity__item--visible" : ""}`}
                        style={{ "--ad": `${i * 0.07}s` }}
                    >
                        <span
                            className="hd-activity__avatar"
                            style={{ background: item.color }}
                            aria-hidden="true"
                        >
                            {item.user}
                        </span>
                        <div className="hd-activity__body">
                            <p className="hd-activity__text">
                                <strong>{item.user}</strong>{" "}
                                <span className="hd-activity__action">{item.action}</span>{" "}
                                <span className="hd-activity__subject">{item.subject}</span>
                            </p>
                            <time className="hd-activity__time" dateTime={item.time}>
                                {item.time} ago
                            </time>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function Deadlines({ visible }) {
    return (
        <section
            className={`hd-deadlines${visible ? " hd-deadlines--visible" : ""}`}
            aria-label="Upcoming deadlines"
        >
            <h2 className="hd-deadlines__title">Upcoming</h2>
            <ul className="hd-deadlines__list" role="list">
                {DEADLINES.map((dl, i) => {
                    const urgency =
                        dl.daysLeft <= 7 ? "urgent" :
                            dl.daysLeft <= 21 ? "soon" : "fine";

                    return (
                        <li
                            key={dl.id}
                            className={`hd-deadlines__item hd-deadlines__item--${urgency}${visible ? " hd-deadlines__item--visible" : ""}`}
                            style={{ "--dd": `${i * 0.07}s` }}
                        >
                            <span
                                className="hd-deadlines__dot"
                                style={{ background: dl.dot }}
                                aria-hidden="true"
                            />
                            <span className="hd-deadlines__label">{dl.label}</span>
                            <span className="hd-deadlines__days" aria-label={`${dl.daysLeft} days remaining`}>
                                {dl.daysLeft}d
                            </span>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

function QuickCapture({ visible }) {
    const [value, setValue] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const inputRef = useRef(null);

    const handleSubmit = useCallback(() => {
        const trimmed = value.trim();
        if (!trimmed) return;
        setSubmitted(true);
        setValue("");
        setTimeout(() => setSubmitted(false), 2200);
    }, [value]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit]);

    return (
        <section
            className={`hd-capture${visible ? " hd-capture--visible" : ""}`}
            aria-label="Quick task capture"
        >
            <h2 className="hd-capture__title">Quick capture</h2>
            <p className="hd-capture__hint">Press Enter to add to My Tasks</p>

            <div className={`hd-capture__field${submitted ? " hd-capture__field--success" : ""}`}>
                <input
                    ref={inputRef}
                    className="hd-capture__input"
                    placeholder="What needs doing?"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label="New task description"
                />
                <button
                    type="button"
                    className="hd-capture__submit"
                    onClick={handleSubmit}
                    disabled={!value.trim()}
                    aria-label="Add task"
                >
                    {submitted ? (
                        <svg width="13" height="13" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                            <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    )}
                </button>
            </div>

            {submitted && (
                <p className="hd-capture__feedback" role="status" aria-live="polite">
                    Task added ✓
                </p>
            )}
        </section>
    );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Instrument+Serif:ital@0;1&display=swap');

  :root {
    --hd-bg: #f5f5f0;
    --hd-surface: #ffffff;
    --hd-surface-alt: #fafaf5;
    --hd-border: rgba(0,57,52,.08);
    --hd-border-md: rgba(0,57,52,.12);
    --hd-forest: #003934;
    --hd-forest-lt: #0a5449;
    --hd-muted: #64748b;
    --hd-faint: #94a3b8;
    --hd-accent: #4CAF88;
    --hd-ease: cubic-bezier(.4,0,.2,1);
    --hd-radius: 14px;
    --hd-radius-sm: 8px;
    --hd-shadow-sm: 0 1px 3px rgba(0,57,52,.05), 0 4px 14px rgba(0,57,52,.05);
    --hd-shadow-md: 0 2px 6px rgba(0,57,52,.07), 0 8px 24px rgba(0,57,52,.08);
  }

  .hd-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.75rem;
    scrollbar-width: thin;
    scrollbar-color: rgba(0,57,52,.1) transparent;
    background: var(--hd-bg);
  }
  .hd-content::-webkit-scrollbar {
    width: 4px;
  }

  .hd-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .hd-content::-webkit-scrollbar-thumb {
    background: rgba(0,57,52,.12);
    border-radius: 2px;
  }

  @keyframes hdFadeUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .hd-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    animation: hdFadeUp .4s var(--hd-ease) both;
  }

  .hd-page-header__date {
    font-family: 'DM Sans', sans-serif;
    font-size: .78rem;
    font-weight: 500;
    color: var(--hd-faint);
    margin: 0 0 .25rem;
    text-transform: uppercase;
    letter-spacing: .06em;
  }

  .hd-page-header__greeting {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(1.65rem, 2.8vw, 2.15rem);
    font-weight: 400;
    color: var(--hd-forest);
    margin: 0 0 .38rem;
    letter-spacing: -.02em;
    line-height: 1.15;
  }

  .hd-page-header__greeting em {
    font-style: italic;
    color: #0a5449;
  }

  .hd-page-header__sub {
    font-family: 'DM Sans', sans-serif;
    font-size: .875rem;
    color: var(--hd-muted);
    margin: 0;
    line-height: 1.55;
  }

  .hd-page-header__sub strong {
    color: var(--hd-forest);
    font-weight: 600;
  }

  .hd-page-header__high {
    color: #ef4444;
    font-weight: 600;
  }

  .hd-page-header__actions {
    display: flex;
    gap: .5rem;
    align-items: center;
    flex-shrink: 0;
    padding-top: .25rem;
  }

  .hd-btn {
    display: inline-flex;
    align-items: center;
    gap: .38rem;
    padding: .52rem 1rem;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: .82rem;
    font-weight: 600;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background .18s var(--hd-ease), transform .18s, box-shadow .18s;
  }

  .hd-btn--primary {
    background: var(--hd-forest);
    color: white;
    box-shadow: 0 2px 6px rgba(0,57,52,.22);
  }

  .hd-btn--primary:hover {
    background: var(--hd-forest-lt);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,57,52,.28);
  }

  .hd-btn--ghost {
    background: var(--hd-surface);
    color: var(--hd-forest);
    border: 1px solid var(--hd-border-md);
  }

  .hd-btn--ghost:hover {
    background: #efefea;
    border-color: rgba(0,57,52,.22);
  }

  .hd-btn:focus-visible {
    outline: 2px solid var(--hd-accent);
    outline-offset: 2px;
  }

  .hd-sprint {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 1.25rem 1.5rem;
    background: var(--hd-forest);
    border-radius: var(--hd-radius);
    box-shadow: 0 2px 8px rgba(0,57,52,.22), 0 8px 24px rgba(0,57,52,.18);
    opacity: 0;
    transform: translateY(10px);
    transition: opacity .45s var(--hd-ease) .08s, transform .45s var(--hd-ease) .08s;
    position: relative;
    overflow: hidden;
    margin-top: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .hd-sprint::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(76,175,136,.18) 0%, transparent 65%);
    pointer-events: none;
  }

  .hd-sprint--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hd-sprint__left {
    flex: 1;
    min-width: 0;
    position: relative;
    z-index: 1;
  }

  .hd-sprint__meta {
    display: flex;
    align-items: baseline;
    gap: .75rem;
    margin-bottom: .8rem;
  }

  .hd-sprint__name {
    font-family: 'DM Sans', sans-serif;
    font-size: .9rem;
    font-weight: 700;
    color: rgba(255,255,255,.95);
  }

  .hd-sprint__days {
    font-family: 'DM Sans', sans-serif;
    font-size: .72rem;
    color: rgba(255,255,255,.45);
    font-weight: 500;
  }

  .hd-sprint__track {
    display: flex;
    height: 7px;
    border-radius: 100px;
    overflow: hidden;
    gap: 2px;
    margin-bottom: .65rem;
  }

  .hd-sprint__seg {
    border-radius: 100px;
    transform-origin: left;
    transition: transform .7s var(--hd-ease);
  }

  .hd-sprint__legend {
    display: flex;
    align-items: center;
    gap: 1.1rem;
  }

  .hd-sprint__legend-item {
    display: flex;
    align-items: center;
    gap: .35rem;
    font-family: 'DM Sans', sans-serif;
    font-size: .72rem;
    color: rgba(255,255,255,.5);
    font-weight: 500;
  }

  .hd-sprint__legend-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .hd-sprint__right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: .08rem;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  .hd-sprint__pct {
    font-family: 'Instrument Serif', serif;
    font-size: 2.8rem;
    font-weight: 400;
    color: rgba(255,255,255,.95);
    line-height: 1;
    letter-spacing: -.03em;
  }

  .hd-sprint__pct sup {
    font-size: 1.1rem;
    letter-spacing: 0;
    opacity: .65;
    vertical-align: super;
  }

  .hd-sprint__pct-label {
    font-family: 'DM Sans', sans-serif;
    font-size: .68rem;
    color: rgba(255,255,255,.38);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: .08em;
  }

  .hd-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 1.25rem;
    align-items: start;
  }

  .hd-grid__left {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    min-width: 0;
  }

  .hd-grid__right {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .hd-projects {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: .85rem;
  }

  .hd-proj {
    display: flex;
    flex-direction: column;
    gap: .75rem;
    padding: 1.15rem 1.25rem 1.1rem;
    background: var(--hd-surface);
    border: 1px solid var(--hd-border);
    border-radius: var(--hd-radius);
    text-decoration: none;
    position: relative;
    overflow: hidden;
    box-shadow: var(--hd-shadow-sm);
    opacity: 0;
    transform: translateY(14px);
    transition: opacity .42s var(--hd-ease) var(--delay, 0s), transform .42s var(--hd-ease) var(--delay, 0s), box-shadow .22s, border-color .22s;
  }

  .hd-proj--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hd-proj:hover {
    box-shadow: var(--hd-shadow-md);
    border-color: var(--hd-border-md);
    transform: translateY(-2px);
  }

  .hd-proj:focus-visible {
    outline: 2px solid var(--hd-accent);
    outline-offset: 2px;
  }

  .hd-proj__bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    border-radius: 0;
    opacity: .85;
  }

  .hd-proj__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: .5rem;
  }

  .hd-proj__name {
    font-family: 'DM Sans', sans-serif;
    font-size: .86rem;
    font-weight: 700;
    color: var(--hd-forest);
    line-height: 1.3;
  }

  .hd-proj__status {
    font-size: .65rem;
    font-weight: 700;
    border-radius: 100px;
    padding: .14rem .48rem;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .hd-proj__progress-row {
    display: flex;
    align-items: center;
    gap: .55rem;
  }

  .hd-proj__track {
    flex: 1;
    height: 4px;
    background: rgba(0,57,52,.07);
    border-radius: 100px;
    overflow: hidden;
  }

  .hd-proj__fill {
    height: 100%;
    border-radius: 100px;
    transition: width .7s var(--hd-ease);
  }

  .hd-proj__pct {
    font-family: 'DM Sans', sans-serif;
    font-size: .72rem;
    font-weight: 700;
    color: var(--hd-muted);
    min-width: 2.4rem;
    text-align: right;
  }

  .hd-proj__foot {
    display: flex;
    align-items: center;
    gap: .6rem;
  }

  .hd-proj__avatars {
    display: flex;
    align-items: center;
  }

  .hd-proj__avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    font-size: .5rem;
    font-weight: 800;
    color: white;
    border: 1.5px solid var(--hd-surface);
    margin-left: -5px;
    flex-shrink: 0;
  }

  .hd-proj__avatars .hd-proj__avatar:first-child {
    margin-left: 0;
  }

  .hd-proj__task-count {
    display: flex;
    align-items: center;
    gap: .28rem;
    font-family: 'DM Sans', sans-serif;
    font-size: .7rem;
    font-weight: 600;
    color: var(--hd-faint);
    margin-left: auto;
  }

  .hd-proj__due {
    font-family: 'DM Sans', sans-serif;
    font-size: .68rem;
    font-weight: 500;
    color: var(--hd-faint);
    white-space: nowrap;
  }

  .hd-tasks {
    padding: 1.3rem 1.4rem;
    background: var(--hd-surface);
    border: 1px solid var(--hd-border);
    border-radius: var(--hd-radius);
    box-shadow: var(--hd-shadow-sm);
    opacity: 0;
    transform: translateY(12px);
    transition: opacity .48s var(--hd-ease) .15s, transform .48s var(--hd-ease) .15s;
  }

  .hd-tasks--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hd-tasks__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    gap: .75rem;
    flex-wrap: wrap;
  }

  .hd-tasks__title-row {
    display: flex;
    align-items: center;
    gap: .5rem;
  }

  .hd-tasks__title {
    font-family: 'DM Sans', sans-serif;
    font-size: .9rem;
    font-weight: 700;
    color: var(--hd-forest);
    margin: 0;
  }

  .hd-tasks__count {
    font-family: 'DM Sans', sans-serif;
    font-size: .72rem;
    font-weight: 600;
    color: var(--hd-faint);
    background: rgba(0,57,52,.06);
    border-radius: 100px;
    padding: .1rem .42rem;
  }

  .hd-tasks__filters {
    display: flex;
    gap: .2rem;
  }

  .hd-tasks__filter {
    padding: .28rem .62rem;
    border: none;
    background: transparent;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: .75rem;
    font-weight: 500;
    color: var(--hd-faint);
    cursor: pointer;
    transition: background .15s, color .15s;
  }

  .hd-tasks__filter:hover {
    background: rgba(0,57,52,.06);
    color: var(--hd-forest);
  }

  .hd-tasks__filter--active {
    background: rgba(0,57,52,.08);
    color: var(--hd-forest);
    font-weight: 700;
  }

  .hd-tasks__filter:focus-visible {
    outline: 2px solid var(--hd-accent);
    outline-offset: 1px;
  }

  .hd-tasks__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .hd-tasks__item {
    display: flex;
    align-items: center;
    gap: .75rem;
    padding: .62rem 0;
    border-bottom: 1px solid rgba(0,57,52,.05);
    animation: hdFadeUp .28s var(--hd-ease) var(--td, 0ms) both;
  }

  .hd-tasks__item:last-child {
    border-bottom: none;
  }

  .hd-tasks__item--done .hd-tasks__label {
    text-decoration: line-through;
    color: var(--hd-faint);
  }

  .hd-tasks__check {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    border: 1.5px solid rgba(0,57,52,.2);
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background .18s, border-color .18s;
  }

  .hd-tasks__check--done {
    background: var(--c, var(--hd-accent));
    border-color: var(--c, var(--hd-accent));
  }

  .hd-tasks__check:hover:not(.hd-tasks__check--done) {
    border-color: var(--c, var(--hd-accent));
    background: rgba(76,175,136,.08);
  }

  .hd-tasks__check:focus-visible {
    outline: 2px solid var(--hd-accent);
    outline-offset: 2px;
  }

  .hd-tasks__body {
    flex: 1;
    min-width: 0;
  }

  .hd-tasks__label {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: .84rem;
    font-weight: 500;
    color: var(--hd-forest);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
    transition: color .18s;
  }

  .hd-tasks__meta {
    display: flex;
    align-items: center;
    gap: .35rem;
    margin-top: .12rem;
  }

  .hd-tasks__dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .hd-tasks__project {
    font-family: 'DM Sans', sans-serif;
    font-size: .7rem;
    color: var(--hd-faint);
    font-weight: 500;
  }

  .hd-tasks__priority {
    font-size: .65rem;
    font-weight: 700;
    border-radius: 100px;
    padding: .13rem .42rem;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .hd-tasks__footer {
    padding-top: .85rem;
    margin-top: .25rem;
    border-top: 1px solid rgba(0,57,52,.06);
  }

  .hd-tasks__view-all {
    display: inline-flex;
    align-items: center;
    gap: .35rem;
    font-family: 'DM Sans', sans-serif;
    font-size: .8rem;
    font-weight: 600;
    color: var(--hd-accent);
    text-decoration: none;
    transition: opacity .15s, gap .2s var(--hd-ease);
  }

  .hd-tasks__view-all:hover {
    opacity: .75;
    gap: .5rem;
  }

  .hd-tasks__view-all:focus-visible {
    outline: 2px solid var(--hd-accent);
    outline-offset: 2px;
    border-radius: 3px;
  }

  .hd-activity {
    padding: 1.25rem 1.35rem;
    background: var(--hd-surface);
    border: 1px solid var(--hd-border);
    border-radius: var(--hd-radius);
    box-shadow: var(--hd-shadow-sm);
    opacity: 0;
    transform: translateY(12px);
    transition: opacity .48s var(--hd-ease) .1s, transform .48s var(--hd-ease) .1s;
  }

  .hd-activity--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hd-activity__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: .9rem;
  }

  .hd-activity__title {
    font-family: 'DM Sans', sans-serif;
    font-size: .875rem;
    font-weight: 700;
    color: var(--hd-forest);
    margin: 0;
  }

  .hd-activity__live {
    display: flex;
    align-items: center;
    gap: .32rem;
    font-family: 'DM Sans', sans-serif;
    font-size: .7rem;
    font-weight: 600;
    color: var(--hd-accent);
  }

  .hd-activity__live-pip {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--hd-accent);
    animation: hdLivePulse 2s ease-in-out infinite;
  }

  @keyframes hdLivePulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(76,175,136,.5);
    }
    50% {
      box-shadow: 0 0 0 5px rgba(76,175,136,0);
    }
  }

  .hd-activity__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .hd-activity__item {
    display: flex;
    align-items: flex-start;
    gap: .6rem;
    padding: .55rem 0;
    border-bottom: 1px solid rgba(0,57,52,.05);
    opacity: 0;
    transform: translateX(-6px);
    transition: opacity .32s var(--hd-ease) var(--ad, 0s), transform .32s var(--hd-ease) var(--ad, 0s);
  }

  .hd-activity__item:last-child {
    border-bottom: none;
  }

  .hd-activity__item--visible {
    opacity: 1;
    transform: translateX(0);
  }

  .hd-activity__avatar {
    width: 26px;
    height: 26px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    font-size: .56rem;
    font-weight: 800;
    color: white;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .hd-activity__body {
    min-width: 0;
  }

  .hd-activity__text {
    font-family: 'DM Sans', sans-serif;
    font-size: .79rem;
    color: var(--hd-muted);
    line-height: 1.45;
    margin: 0;
  }

  .hd-activity__text strong {
    color: var(--hd-forest);
    font-weight: 600;
  }

  .hd-activity__action {
    color: var(--hd-muted);
  }

  .hd-activity__subject {
    color: var(--hd-forest);
    font-weight: 500;
  }

  .hd-activity__time {
    font-family: 'DM Sans', sans-serif;
    font-size: .69rem;
    color: var(--hd-faint);
    font-weight: 500;
    display: block;
    margin-top: .1rem;
  }

  .hd-deadlines {
    padding: 1.1rem 1.35rem;
    background: var(--hd-surface);
    border: 1px solid var(--hd-border);
    border-radius: var(--hd-radius);
    box-shadow: var(--hd-shadow-sm);
    opacity: 0;
    transform: translateY(12px);
    transition: opacity .48s var(--hd-ease) .18s, transform .48s var(--hd-ease) .18s;
  }

  .hd-deadlines--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hd-deadlines__title {
    font-family: 'DM Sans', sans-serif;
    font-size: .875rem;
    font-weight: 700;
    color: var(--hd-forest);
    margin: 0 0 .7rem;
  }

  .hd-deadlines__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .hd-deadlines__item {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .5rem 0;
    border-bottom: 1px solid rgba(0,57,52,.05);
    opacity: 0;
    transform: translateX(-6px);
    transition: opacity .3s var(--hd-ease) var(--dd, 0s), transform .3s var(--hd-ease) var(--dd, 0s);
  }

  .hd-deadlines__item:last-child {
    border-bottom: none;
  }

  .hd-deadlines__item--visible {
    opacity: 1;
    transform: translateX(0);
  }

  .hd-deadlines__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .hd-deadlines__label {
    flex: 1;
    font-family: 'DM Sans', sans-serif;
    font-size: .79rem;
    font-weight: 500;
    color: var(--hd-forest);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hd-deadlines__days {
    font-family: 'DM Sans', sans-serif;
    font-size: .7rem;
    font-weight: 700;
    flex-shrink: 0;
    min-width: 1.8rem;
    text-align: right;
  }

  .hd-deadlines__item--urgent .hd-deadlines__days {
    color: #ef4444;
  }

  .hd-deadlines__item--soon .hd-deadlines__days {
    color: #f59e0b;
  }

  .hd-deadlines__item--fine .hd-deadlines__days {
    color: var(--hd-faint);
  }

  .hd-capture {
    padding: 1.1rem 1.35rem;
    background: var(--hd-surface);
    border: 1px solid var(--hd-border);
    border-radius: var(--hd-radius);
    box-shadow: var(--hd-shadow-sm);
    opacity: 0;
    transform: translateY(12px);
    transition: opacity .48s var(--hd-ease) .24s, transform .48s var(--hd-ease) .24s;
  }

  .hd-capture--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hd-capture__title {
    font-family: 'DM Sans', sans-serif;
    font-size: .875rem;
    font-weight: 700;
    color: var(--hd-forest);
    margin: 0 0 .12rem;
  }

  .hd-capture__hint {
    font-family: 'DM Sans', sans-serif;
    font-size: .72rem;
    color: var(--hd-faint);
    margin: 0 0 .8rem;
  }

  .hd-capture__field {
    display: flex;
    gap: .4rem;
    align-items: center;
    transition: transform .15s;
  }

  .hd-capture__field--success {
    transform: scale(.99);
  }

  .hd-capture__input {
    flex: 1;
    font-family: 'DM Sans', sans-serif;
    font-size: .84rem;
    font-weight: 500;
    color: var(--hd-forest);
    background: var(--hd-surface-alt);
    border: 1.5px solid var(--hd-border-md);
    border-radius: 8px;
    padding: .52rem .7rem;
    outline: none;
    transition: border-color .18s, box-shadow .18s, background .18s;
  }

  .hd-capture__input::placeholder {
    color: var(--hd-faint);
  }

  .hd-capture__input:focus {
    border-color: var(--hd-forest);
    background: var(--hd-surface);
    box-shadow: 0 0 0 3px rgba(0,57,52,.07);
  }

  .hd-capture__submit {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: none;
    background: var(--hd-forest);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background .18s, transform .18s, opacity .18s;
  }

  .hd-capture__submit:hover:not(:disabled) {
    background: var(--hd-forest-lt);
    transform: scale(1.06);
  }

  .hd-capture__submit:disabled {
    opacity: .32;
    cursor: not-allowed;
  }

  .hd-capture__submit:focus-visible {
    outline: 2px solid var(--hd-accent);
    outline-offset: 2px;
  }

  .hd-capture__feedback {
    font-family: 'DM Sans', sans-serif;
    font-size: .75rem;
    font-weight: 600;
    color: var(--hd-accent);
    margin: .5rem 0 0;
    animation: hdFadeUp .2s var(--hd-ease);
  }

  @media (max-width: 1100px) {
    .hd-grid {
      grid-template-columns: 1fr;
    }
    .hd-projects {
      grid-template-columns: repeat(3, 1fr);
    }
    .hd-grid__right {
      order: -1;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .hd-content {
      padding: 1.25rem;
      gap: 1rem;
    }
    .hd-projects {
      grid-template-columns: 1fr;
    }
    .hd-page-header {
      flex-direction: column;
      gap: .75rem;
    }
    .hd-page-header__actions {
      flex-direction: row;
    }
    .hd-grid__right {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .hd-grid__right {
      grid-template-columns: 1fr;
    }
    .hd-tasks__header {
      flex-direction: column;
      align-items: flex-start;
      gap: .5rem;
    }
  }
`;

export function HomeDashboard({ onMenuOpen }) {
    const now = useNow();

    const [sprintRef, sprintVisible] = useInView(0.15);
    const [projectsRef, projectsVisible] = useInView(0.08);
    const [tasksRef, tasksVisible] = useInView(0.05);
    const [rightRef, rightVisible] = useInView(0.05);

    return (
        <>
            <style>{styles}</style>
            <main className="hd-content" id="main-content" aria-label="Home dashboard">
                <PageHeader now={now} />
                <div ref={sprintRef}>
                    <SprintBanner visible={sprintVisible} />
                </div>
                <div className="hd-grid">
                    <div className="hd-grid__left">
                        <div
                            ref={projectsRef}
                            className="hd-projects"
                            aria-label="Active projects"
                        >
                            {PROJECTS.map((project, i) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    index={i}
                                    visible={projectsVisible}
                                />
                            ))}
                        </div>
                        <div ref={tasksRef}>
                            <MyTasks visible={tasksVisible} />
                        </div>
                    </div>
                    <div className="hd-grid__right" ref={rightRef}>
                        <ActivityFeed visible={rightVisible} />
                        <Deadlines visible={rightVisible} />
                        <QuickCapture visible={rightVisible} />
                    </div>
                </div>
            </main>
        </>
    );
}

export default HomeDashboard;