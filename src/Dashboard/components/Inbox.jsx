import { useState, useRef, useEffect, useCallback, useMemo, useReducer } from "react";
import { Link } from "react-router-dom";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CURRENT_USER_ID = "u-ak";

const USERS = {
    "u-ak": { id: "u-ak", name: "Alex Kim", initials: "AK", color: "#4CAF88" },
    "u-jp": { id: "u-jp", name: "Jamie Park", initials: "JP", color: "#38bdf8" },
    "u-mo": { id: "u-mo", name: "Morgan O.", initials: "MO", color: "#f59e0b" },
    "u-lr": { id: "u-lr", name: "Lee Rivera", initials: "LR", color: "#a78bfa" },
    "u-tv": { id: "u-tv", name: "Taylor V.", initials: "TV", color: "#f87171" },
};

const LABELS = {
    "mention": { id: "mention", text: "Mention", color: "#38bdf8", bg: "rgba(56,189,248,.1)" },
    "assigned": { id: "assigned", text: "Assigned", color: "#4CAF88", bg: "rgba(76,175,136,.1)" },
    "comment": { id: "comment", text: "Comment", color: "#a78bfa", bg: "rgba(167,139,250,.1)" },
    "due-soon": { id: "due-soon", text: "Due soon", color: "#f59e0b", bg: "rgba(245,158,11,.1)" },
    "blocked": { id: "blocked", text: "Blocked", color: "#f87171", bg: "rgba(248,113,113,.1)" },
    "completed": { id: "completed", text: "Completed", color: "#4CAF88", bg: "rgba(76,175,136,.08)" },
};

const PROJECT_DOTS = {
    "Q4 Sprint": "#4CAF88",
    "App Redesign": "#38bdf8",
    "Infra Migration": "#f59e0b",
};

const MESSAGES = [
    {
        id: "m-01",
        from: "u-jp",
        subject: "Auth redesign PR — needs your review",
        preview: "Hey, I pushed the new session handling changes. Can you take a look before EOD? There are a few edge cases I'm not sure about.",
        body: "Hey Alex,\n\nI pushed the new session handling changes to the auth redesign branch. Can you take a look before EOD? There are a few edge cases I'm not 100% sure about — specifically around token refresh on mobile Safari.\n\nI left inline comments on the tricky bits. The main PR is at /projects/app/prs/88.\n\nThanks,\nJamie",
        project: "App Redesign",
        labels: ["mention", "assigned"],
        time: "9:41 AM",
        timestamp: "2024-12-12T09:41:00",
        read: false,
        starred: true,
        archived: false,
    },
    {
        id: "m-02",
        from: "u-mo",
        subject: "Q4 retrospective — agenda items?",
        preview: "Scheduling the retro for next Thursday. Drop your agenda items in the doc before Wednesday EOD so I can prep the board.",
        body: "Hi team,\n\nScheduling the retro for next Thursday the 19th at 2 PM. Drop your agenda items in the shared doc before Wednesday EOD so I can prep the board and timebox properly.\n\nDoc link: /docs/q4-retro-2024\n\nMorgan",
        project: "Q4 Sprint",
        labels: ["mention"],
        time: "Yesterday",
        timestamp: "2024-12-11T14:22:00",
        read: false,
        starred: false,
        archived: false,
    },
    {
        id: "m-03",
        from: "u-lr",
        subject: "Postgres migration — blocked on credentials",
        preview: "Still waiting on the prod DB credentials from DevOps. Ticket's been open 4 days. Can someone escalate?",
        body: "Hi,\n\nStill waiting on the prod DB credentials from DevOps. The ticket has been open for 4 days now (#infra-204) and I haven't heard back. This is blocking the migration runbook.\n\nCan someone with more clout escalate? The window closes Friday.\n\nLee",
        project: "Infra Migration",
        labels: ["blocked", "due-soon"],
        time: "Yesterday",
        timestamp: "2024-12-11T10:05:00",
        read: false,
        starred: false,
        archived: false,
    },
    {
        id: "m-04",
        from: "u-tv",
        subject: "Mobile nav component — feedback needed",
        preview: "Finished the revised mobile nav. Loom walkthrough attached. Let me know if the swipe gesture feels off.",
        body: "Hey Alex,\n\nFinished the revised mobile nav component — the swipe gesture and overlay transitions are smoother now. I recorded a quick Loom walkthrough: loom.com/share/xyz\n\nLet me know if anything feels off. Happy to pair on it tomorrow.\n\nTaylor",
        project: "App Redesign",
        labels: ["comment"],
        time: "Mon",
        timestamp: "2024-12-09T16:30:00",
        read: true,
        starred: false,
        archived: false,
    },
    {
        id: "m-05",
        from: "u-jp",
        subject: "Sprint 12 velocity — looking strong",
        preview: "Just checked the numbers — we're on track for 71 points this sprint. Best velocity all year.",
        body: "Hey,\n\nJust pulled the numbers — we're sitting at 58 points with 5 days left. On track to hit 71, which would be our best sprint velocity all year.\n\nThe auth work and the CI fixes really moved the needle. Nice work everyone.\n\nJamie",
        project: "Q4 Sprint",
        labels: ["completed"],
        time: "Mon",
        timestamp: "2024-12-09T11:18:00",
        read: true,
        starred: false,
        archived: false,
    },
    {
        id: "m-06",
        from: "u-mo",
        subject: "Design system token audit — findings",
        preview: "Finished the audit. We have 34 redundant colour tokens and 12 spacing values that don't match the grid. Summary doc attached.",
        body: "Hi all,\n\nFinished the design system token audit. Key findings:\n\n• 34 redundant colour tokens across light/dark modes\n• 12 spacing values that don't align to the 4px grid\n• 6 typography scales that are near-identical\n\nFull summary in the doc: /docs/token-audit-dec2024\n\nRecommend a cleanup sprint in January.\n\nMorgan",
        project: "App Redesign",
        labels: ["comment"],
        time: "Fri",
        timestamp: "2024-12-06T09:00:00",
        read: true,
        starred: true,
        archived: false,
    },
    {
        id: "m-07",
        from: "u-lr",
        subject: "Infra runbook draft — ready for review",
        preview: "First draft of the migration runbook is up. Focus areas: rollback procedure and the dual-write window. Comments welcome.",
        body: "Hi,\n\nFirst draft of the Postgres migration runbook is up at /docs/infra-migration-runbook.\n\nThe two areas I'd like eyes on most:\n1. Rollback procedure (section 4) — want to make sure the steps are reversible in under 10 minutes\n2. The dual-write window timing (section 6) — not sure if 72 hours is long enough\n\nComments welcome by Thursday.\n\nLee",
        project: "Infra Migration",
        labels: ["assigned"],
        time: "Fri",
        timestamp: "2024-12-06T08:14:00",
        read: true,
        starred: false,
        archived: false,
    },
];

const FILTERS = [
    { id: "all", label: "All", count: null },
    { id: "unread", label: "Unread", count: null },
    { id: "starred", label: "Starred", count: null },
    { id: "archived", label: "Archived", count: null },
];

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initialState = {
    messages: MESSAGES,
    activeId: MESSAGES[0].id,
    filter: "all",
    search: "",
    composing: false,
};

function inboxReducer(state, action) {
    switch (action.type) {
        case "SELECT": {
            // mark as read on open
            return {
                ...state,
                activeId: action.id,
                messages: state.messages.map((m) =>
                    m.id === action.id ? { ...m, read: true } : m
                ),
            };
        }
        case "TOGGLE_STAR": {
            return {
                ...state,
                messages: state.messages.map((m) =>
                    m.id === action.id ? { ...m, starred: !m.starred } : m
                ),
            };
        }
        case "TOGGLE_READ": {
            return {
                ...state,
                messages: state.messages.map((m) =>
                    m.id === action.id ? { ...m, read: !m.read } : m
                ),
            };
        }
        case "ARCHIVE": {
            const next = state.messages.map((m) =>
                m.id === action.id ? { ...m, archived: true, read: true } : m
            );
            // advance selection to the next visible message
            const visible = next.filter((m) => !m.archived);
            const nextActive = visible.find((m) => m.id !== action.id)?.id ?? null;
            return { ...state, messages: next, activeId: nextActive };
        }
        case "DELETE": {
            const remaining = state.messages.filter((m) => m.id !== action.id);
            const nextActive = remaining[0]?.id ?? null;
            return { ...state, messages: remaining, activeId: nextActive };
        }
        case "SET_FILTER": return { ...state, filter: action.filter, activeId: state.activeId };
        case "SET_SEARCH": return { ...state, search: action.search };
        case "SET_COMPOSING": return { ...state, composing: action.composing };
        default: return state;
    }
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useClickOutside(ref, onClose) {
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onClose();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [ref, onClose]);
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function Avatar({ userId, size = 28 }) {
    const user = USERS[userId];
    if (!user) return null;
    return (
        <span
            className="ibx-avatar"
            style={{
                width: size,
                height: size,
                background: user.color,
                fontSize: size * 0.3,
                borderRadius: size <= 24 ? "6px" : "8px",
            }}
            aria-hidden="true"
        >
            {user.initials}
        </span>
    );
}

function LabelPill({ labelId }) {
    const label = LABELS[labelId];
    if (!label) return null;
    return (
        <span
            className="ibx-label"
            style={{ color: label.color, background: label.bg }}
        >
            {label.text}
        </span>
    );
}

function StarButton({ starred, onToggle, messageId }) {
    return (
        <button
            type="button"
            className={`ibx-star${starred ? " ibx-star--active" : ""}`}
            onClick={(e) => { e.stopPropagation(); onToggle(messageId); }}
            aria-label={starred ? "Unstar message" : "Star message"}
            aria-pressed={starred}
        >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        </button>
    );
}

// ─── MessageRow ───────────────────────────────────────────────────────────────

function MessageRow({ message, isActive, onSelect, onToggleStar }) {
    const sender = USERS[message.from];
    const dot = PROJECT_DOTS[message.project];

    return (
        <li
            className={[
                "ibx-row",
                !message.read ? "ibx-row--unread" : "",
                isActive ? "ibx-row--active" : "",
                message.archived ? "ibx-row--archived" : "",
            ].filter(Boolean).join(" ")}
            role="option"
            aria-selected={isActive}
            onClick={() => onSelect(message.id)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(message.id); } }}
            tabIndex={0}
            aria-label={`${message.read ? "" : "Unread. "}From ${sender?.name}. ${message.subject}. ${message.time}`}
        >
            <Avatar userId={message.from} size={32} />

            <div className="ibx-row__body">
                <div className="ibx-row__top">
                    <span className="ibx-row__sender">{sender?.name}</span>
                    <span className="ibx-row__time">{message.time}</span>
                </div>
                <div className="ibx-row__subject-row">
                    <span className="ibx-row__subject">{message.subject}</span>
                    {!message.read && <span className="ibx-row__unread-pip" aria-hidden="true" />}
                </div>
                <p className="ibx-row__preview">{message.preview}</p>
                <div className="ibx-row__footer">
                    <span
                        className="ibx-row__project-dot"
                        style={{ background: dot }}
                        aria-hidden="true"
                    />
                    <span className="ibx-row__project">{message.project}</span>
                    <div className="ibx-row__labels">
                        {message.labels.slice(0, 2).map((l) => (
                            <LabelPill key={l} labelId={l} />
                        ))}
                    </div>
                </div>
            </div>

            <StarButton
                starred={message.starred}
                onToggle={onToggleStar}
                messageId={message.id}
            />
        </li>
    );
}

// ─── MessageList ──────────────────────────────────────────────────────────────

function MessageList({ messages, activeId, filter, search, dispatch }) {
    const filtered = useMemo(() => {
        let list = messages;

        if (filter === "unread") list = list.filter((m) => !m.read && !m.archived);
        if (filter === "starred") list = list.filter((m) => m.starred && !m.archived);
        if (filter === "archived") list = list.filter((m) => m.archived);
        if (filter === "all") list = list.filter((m) => !m.archived);

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (m) =>
                    m.subject.toLowerCase().includes(q) ||
                    USERS[m.from]?.name.toLowerCase().includes(q) ||
                    m.preview.toLowerCase().includes(q) ||
                    m.project.toLowerCase().includes(q)
            );
        }

        return list;
    }, [messages, filter, search]);

    const counts = useMemo(() => ({
        all: messages.filter((m) => !m.archived).length,
        unread: messages.filter((m) => !m.read && !m.archived).length,
        starred: messages.filter((m) => m.starred && !m.archived).length,
        archived: messages.filter((m) => m.archived).length,
    }), [messages]);

    const onSelect = useCallback((id) => dispatch({ type: "SELECT", id }), [dispatch]);
    const onToggleStar = useCallback((id) => dispatch({ type: "TOGGLE_STAR", id }), [dispatch]);
    const onSetFilter = useCallback((f) => dispatch({ type: "SET_FILTER", filter: f }), [dispatch]);
    const onSetSearch = useCallback((v) => dispatch({ type: "SET_SEARCH", search: v }), [dispatch]);

    return (
        <div className="ibx-list-pane" role="region" aria-label="Message list">

            {/* Search */}
            <div className="ibx-search">
                <span className="ibx-search__icon" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </span>
                <input
                    className="ibx-search__input"
                    type="search"
                    placeholder="Search messages…"
                    value={search}
                    onChange={(e) => onSetSearch(e.target.value)}
                    aria-label="Search inbox"
                />
                {search && (
                    <button
                        type="button"
                        className="ibx-search__clear"
                        onClick={() => onSetSearch("")}
                        aria-label="Clear search"
                    >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Filter tabs */}
            <div className="ibx-filters" role="tablist" aria-label="Filter messages">
                {FILTERS.map((f) => (
                    <button
                        key={f.id}
                        type="button"
                        role="tab"
                        aria-selected={filter === f.id}
                        className={`ibx-filter-tab${filter === f.id ? " ibx-filter-tab--active" : ""}`}
                        onClick={() => onSetFilter(f.id)}
                    >
                        {f.label}
                        {counts[f.id] > 0 && (
                            <span
                                className="ibx-filter-tab__count"
                                aria-label={`${counts[f.id]} messages`}
                            >
                                {counts[f.id]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="ibx-empty" role="status">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                    </svg>
                    <p className="ibx-empty__text">
                        {search ? "No messages match your search" : "Nothing here"}
                    </p>
                </div>
            ) : (
                <ul
                    className="ibx-list"
                    role="listbox"
                    aria-label="Messages"
                    aria-activedescendant={activeId ?? undefined}
                >
                    {filtered.map((msg) => (
                        <MessageRow
                            key={msg.id}
                            message={msg}
                            isActive={msg.id === activeId}
                            onSelect={onSelect}
                            onToggleStar={onToggleStar}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}

// ─── ComposeModal ─────────────────────────────────────────────────────────────

function ComposeModal({ onClose }) {
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sent, setSent] = useState(false);
    const ref = useRef(null);
    const closeCallback = useCallback(onClose, [onClose]);

    useClickOutside(ref, closeCallback);

    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    // Focus trap: first input on mount
    const toRef = useRef(null);
    useEffect(() => { toRef.current?.focus(); }, []);

    const handleSend = useCallback(() => {
        if (!to.trim() || !subject.trim()) return;
        setSent(true);
        setTimeout(onClose, 1400);
    }, [to, subject, onClose]);

    return (
        <div
            className="ibx-compose-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="Compose new message"
        >
            <div className="ibx-compose" ref={ref}>
                <div className="ibx-compose__header">
                    <span className="ibx-compose__title">New message</span>
                    <button
                        type="button"
                        className="ibx-compose__close"
                        onClick={onClose}
                        aria-label="Close compose window"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {sent ? (
                    <div className="ibx-compose__sent" role="status" aria-live="polite">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4CAF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Message sent</span>
                    </div>
                ) : (
                    <>
                        <div className="ibx-compose__fields">
                            <div className="ibx-compose__field">
                                <label className="ibx-compose__field-label" htmlFor="ibx-to">To</label>
                                <input
                                    ref={toRef}
                                    id="ibx-to"
                                    className="ibx-compose__field-input"
                                    type="text"
                                    placeholder="Teammate name or email"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                />
                            </div>
                            <div className="ibx-compose__field ibx-compose__field--sep">
                                <label className="ibx-compose__field-label" htmlFor="ibx-subject">Subject</label>
                                <input
                                    id="ibx-subject"
                                    className="ibx-compose__field-input"
                                    type="text"
                                    placeholder="What's it about?"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>
                        </div>
                        <textarea
                            className="ibx-compose__body"
                            placeholder="Your message…"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            aria-label="Message body"
                        />
                        <div className="ibx-compose__footer">
                            <button
                                type="button"
                                className="ibx-compose__send"
                                onClick={handleSend}
                                disabled={!to.trim() || !subject.trim()}
                                aria-label="Send message"
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                                Send
                            </button>
                            <button
                                type="button"
                                className="ibx-compose__discard"
                                onClick={onClose}
                            >
                                Discard
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── MessageDetail ────────────────────────────────────────────────────────────

function MessageDetail({ message, dispatch }) {
    const [replyValue, setReplyValue] = useState("");
    const [replySent, setReplySent] = useState(false);
    const sender = USERS[message.from];
    const dot = PROJECT_DOTS[message.project];
    const paragraphs = message.body.split("\n\n");

    const handleArchive = useCallback(
        () => dispatch({ type: "ARCHIVE", id: message.id }),
        [dispatch, message.id]
    );
    const handleDelete = useCallback(
        () => dispatch({ type: "DELETE", id: message.id }),
        [dispatch, message.id]
    );
    const handleToggleRead = useCallback(
        () => dispatch({ type: "TOGGLE_READ", id: message.id }),
        [dispatch, message.id]
    );
    const handleToggleStar = useCallback(
        () => dispatch({ type: "TOGGLE_STAR", id: message.id }),
        [dispatch, message.id]
    );

    const handleSendReply = useCallback(() => {
        if (!replyValue.trim()) return;
        setReplySent(true);
        setReplyValue("");
        setTimeout(() => setReplySent(false), 2000);
    }, [replyValue]);

    return (
        <article className="ibx-detail" aria-label={`Message: ${message.subject}`}>

            {/* Detail toolbar */}
            <div className="ibx-detail__toolbar">
                <div className="ibx-detail__toolbar-left">
                    <span
                        className="ibx-detail__project-dot"
                        style={{ background: dot }}
                        aria-hidden="true"
                    />
                    <Link
                        to={`/projects/${message.project.toLowerCase().replace(/\s+/g, "-")}`}
                        className="ibx-detail__project-link"
                        aria-label={`Go to ${message.project}`}
                    >
                        {message.project}
                    </Link>
                </div>

                <div className="ibx-detail__toolbar-actions" role="toolbar" aria-label="Message actions">
                    <button
                        type="button"
                        className="ibx-detail__action"
                        onClick={handleToggleStar}
                        aria-label={message.starred ? "Unstar" : "Star"}
                        aria-pressed={message.starred}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={message.starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="ibx-detail__action"
                        onClick={handleToggleRead}
                        aria-label={message.read ? "Mark as unread" : "Mark as read"}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            {message.read ? (
                                <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                            ) : (
                                <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
                            )}
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="ibx-detail__action"
                        onClick={handleArchive}
                        aria-label="Archive message"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" rx="1" />
                            <line x1="10" y1="12" x2="14" y2="12" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="ibx-detail__action ibx-detail__action--danger"
                        onClick={handleDelete}
                        aria-label="Delete message"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" /><path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Message header */}
            <header className="ibx-detail__head">
                <div className="ibx-detail__head-top">
                    <h1 className="ibx-detail__subject">{message.subject}</h1>
                    <div className="ibx-detail__labels">
                        {message.labels.map((l) => <LabelPill key={l} labelId={l} />)}
                    </div>
                </div>

                <div className="ibx-detail__sender-row">
                    <Avatar userId={message.from} size={36} />
                    <div className="ibx-detail__sender-info">
                        <span className="ibx-detail__sender-name">{sender?.name}</span>
                        <span className="ibx-detail__sender-meta">
                            to <strong>me</strong> · <time dateTime={message.timestamp}>{message.time}</time>
                        </span>
                    </div>
                </div>
            </header>

            {/* Body */}
            <div className="ibx-detail__body" aria-label="Message body">
                {paragraphs.map((para, i) => (
                    <p key={i} className="ibx-detail__para">{para}</p>
                ))}
            </div>

            {/* Reply box */}
            <div className="ibx-detail__reply">
                <Avatar userId={CURRENT_USER_ID} size={30} />
                <div className="ibx-detail__reply-field">
                    <textarea
                        className="ibx-detail__reply-input"
                        placeholder={`Reply to ${sender?.name}…`}
                        value={replyValue}
                        onChange={(e) => setReplyValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSendReply();
                        }}
                        aria-label={`Reply to ${sender?.name}`}
                        rows={1}
                    />
                    <div className="ibx-detail__reply-footer">
                        <span className="ibx-detail__reply-hint" aria-hidden="true">
                            ⌘↵ to send
                        </span>
                        <button
                            type="button"
                            className={`ibx-detail__reply-send${replySent ? " ibx-detail__reply-send--sent" : ""}`}
                            onClick={handleSendReply}
                            disabled={!replyValue.trim()}
                            aria-label="Send reply"
                        >
                            {replySent ? (
                                <>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Sent
                                </>
                            ) : (
                                <>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <line x1="22" y1="2" x2="11" y2="13" />
                                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                    </svg>
                                    Reply
                                </>
                            )}
                        </button>
                    </div>
                    {replySent && (
                        <p className="ibx-detail__reply-confirm" role="status" aria-live="polite">
                            Reply sent ✓
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}

// ─── EmptyDetail ──────────────────────────────────────────────────────────────

function EmptyDetail() {
    return (
        <div className="ibx-detail-empty" role="status">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
            <p className="ibx-detail-empty__text">Select a message to read</p>
        </div>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Instrument+Serif:ital@0;1&display=swap');

  /* ── Tokens ── */
  :root {
    --ibx-bg:         #f5f5f0;
    --ibx-surface:    #ffffff;
    --ibx-surface-alt:#fafaf5;
    --ibx-border:     rgba(0,57,52,.07);
    --ibx-border-md:  rgba(0,57,52,.12);
    --ibx-forest:     #003934;
    --ibx-forest-lt:  #0a5449;
    --ibx-muted:      #64748b;
    --ibx-faint:      #94a3b8;
    --ibx-accent:     #4CAF88;
    --ibx-ease:       cubic-bezier(.4,0,.2,1);
    --ibx-radius:     14px;
    --ibx-radius-sm:  8px;
    --ibx-shadow:     0 1px 3px rgba(0,57,52,.04), 0 4px 16px rgba(0,57,52,.05);
  }

  /* ── Page shell ── */
  .ibx-shell {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Topbar ── */
  .ibx-topbar {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    background: rgba(245,245,240,.92);
    backdrop-filter: blur(12px) saturate(140%);
    border-bottom: 1px solid var(--ibx-border-md);
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 30;
  }
  .ibx-topbar__left {
    display: flex;
    align-items: center;
    gap: .55rem;
  }
  .ibx-topbar__hamburger {
    display: none;
    width: 30px; height: 30px;
    align-items: center; justify-content: center;
    background: none;
    border: 1px solid var(--ibx-border-md);
    border-radius: 7px;
    cursor: pointer;
    color: var(--ibx-forest);
    transition: background .15s;
  }
  .ibx-topbar__hamburger:hover         { background: rgba(0,57,52,.06); }
  .ibx-topbar__hamburger:focus-visible { outline: 2px solid var(--ibx-accent); outline-offset: 2px; }
  .ibx-topbar__crumb {
    display: flex;
    align-items: center;
    gap: .35rem;
    font-size: .82rem;
    color: var(--ibx-muted);
  }
  .ibx-topbar__crumb-sep     { opacity: .4; }
  .ibx-topbar__crumb-current { font-weight: 600; color: var(--ibx-forest); }
  .ibx-topbar__right {
    display: flex;
    align-items: center;
    gap: .45rem;
  }
  .ibx-topbar__unread-badge {
    font-size: .68rem;
    font-weight: 700;
    color: white;
    background: var(--ibx-accent);
    border-radius: 100px;
    padding: .14rem .52rem;
  }
  .ibx-topbar__compose {
    display: inline-flex;
    align-items: center;
    gap: .38rem;
    padding: .46rem .9rem;
    background: var(--ibx-forest);
    border: none;
    border-radius: var(--ibx-radius-sm);
    font-family: 'DM Sans', sans-serif;
    font-size: .8rem;
    font-weight: 600;
    color: white;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,57,52,.22);
    transition: background .18s var(--ibx-ease), transform .18s, box-shadow .18s;
  }
  .ibx-topbar__compose:hover {
    background: var(--ibx-forest-lt);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,57,52,.28);
  }
  .ibx-topbar__compose:focus-visible { outline: 2px solid var(--ibx-accent); outline-offset: 2px; }

  /* ── Body: two-pane split ── */
  .ibx-body {
    display: grid;
    grid-template-columns: 340px 1fr;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  /* ── Avatar primitive ── */
  .ibx-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: white;
    flex-shrink: 0;
    letter-spacing: .01em;
  }

  /* ── Label pill primitive ── */
  .ibx-label {
    display: inline-flex;
    align-items: center;
    font-size: .62rem;
    font-weight: 700;
    border-radius: 100px;
    padding: .12rem .42rem;
    white-space: nowrap;
  }

  /* ── Star button ── */
  .ibx-star {
    flex-shrink: 0;
    width: 26px; height: 26px;
    display: flex; align-items: center; justify-content: center;
    background: none;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: var(--ibx-faint);
    opacity: 0;
    transition: opacity .15s, color .15s, background .15s;
  }
  .ibx-row:hover .ibx-star,
  .ibx-star--active   { opacity: 1; }
  .ibx-star--active   { color: #f59e0b; }
  .ibx-star:hover:not(.ibx-star--active) { background: rgba(0,57,52,.06); color: var(--ibx-muted); }
  .ibx-star:focus-visible { outline: 2px solid var(--ibx-accent); outline-offset: 1px; opacity: 1; }

  /* ── List pane ── */
  .ibx-list-pane {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--ibx-border-md);
    background: var(--ibx-surface-alt);
    overflow: hidden;
    min-width: 0;
  }

  /* Search */
  .ibx-search {
    position: relative;
    padding: .65rem .75rem .5rem;
    border-bottom: 1px solid var(--ibx-border);
    flex-shrink: 0;
  }
  .ibx-search__icon {
    position: absolute;
    left: 1.3rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--ibx-faint);
    display: flex;
    pointer-events: none;
  }
  .ibx-search__input {
    width: 100%;
    padding: .44rem .44rem .44rem 2rem;
    background: var(--ibx-surface);
    border: 1.5px solid var(--ibx-border-md);
    border-radius: var(--ibx-radius-sm);
    font-family: 'DM Sans', sans-serif;
    font-size: .82rem;
    font-weight: 500;
    color: var(--ibx-forest);
    outline: none;
    transition: border-color .18s, box-shadow .18s;
  }
  .ibx-search__input::placeholder   { color: var(--ibx-faint); }
  .ibx-search__input:focus {
    border-color: var(--ibx-forest);
    box-shadow: 0 0 0 3px rgba(0,57,52,.07);
    background: var(--ibx-surface);
  }
  /* hide browser default clear button on search inputs */
  .ibx-search__input::-webkit-search-cancel-button { display: none; }
  .ibx-search__clear {
    position: absolute;
    right: 1.2rem;
    top: 50%;
    transform: translateY(-50%);
    width: 20px; height: 20px;
    display: flex; align-items: center; justify-content: center;
    background: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: var(--ibx-faint);
    transition: color .15s, background .15s;
  }
  .ibx-search__clear:hover         { color: var(--ibx-forest); background: rgba(0,57,52,.06); }
  .ibx-search__clear:focus-visible { outline: 2px solid var(--ibx-accent); outline-offset: 1px; }

  /* Filter tabs */
  .ibx-filters {
    display: flex;
    padding: .4rem .6rem;
    gap: .15rem;
    border-bottom: 1px solid var(--ibx-border);
    flex-shrink: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .ibx-filters::-webkit-scrollbar { display: none; }
  .ibx-filter-tab {
    display: inline-flex;
    align-items: center;
    gap: .3rem;
    padding: .3rem .58rem;
    border: none;
    background: transparent;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: .76rem;
    font-weight: 500;
    color: var(--ibx-faint);
    cursor: pointer;
    white-space: nowrap;
    transition: background .15s, color .15s;
    flex-shrink: 0;
  }
  .ibx-filter-tab:hover           { background: rgba(0,57,52,.06); color: var(--ibx-forest); }
  .ibx-filter-tab--active         { background: rgba(0,57,52,.08); color: var(--ibx-forest); font-weight: 700; }
  .ibx-filter-tab:focus-visible   { outline: 2px solid var(--ibx-accent); outline-offset: 1px; }
  .ibx-filter-tab__count {
    font-size: .62rem;
    font-weight: 700;
    background: rgba(0,57,52,.08);
    color: var(--ibx-muted);
    border-radius: 100px;
    padding: .06rem .35rem;
    min-width: 1.1rem;
    text-align: center;
  }
  .ibx-filter-tab--active .ibx-filter-tab__count {
    background: var(--ibx-forest);
    color: white;
  }

  /* Message list */
  .ibx-list {
    list-style: none;
    margin: 0; padding: 0;
    overflow-y: auto;
    flex: 1;
    scrollbar-width: thin;
    scrollbar-color: rgba(0,57,52,.1) transparent;
  }
  .ibx-list::-webkit-scrollbar       { width: 4px; }
  .ibx-list::-webkit-scrollbar-track { background: transparent; }
  .ibx-list::-webkit-scrollbar-thumb { background: rgba(0,57,52,.1); border-radius: 2px; }

  /* Message row */
  .ibx-row {
    display: flex;
    align-items: flex-start;
    gap: .65rem;
    padding: .9rem .85rem .8rem;
    border-bottom: 1px solid var(--ibx-border);
    cursor: pointer;
    position: relative;
    transition: background .15s;
    background: transparent;
    outline: none;
  }
  .ibx-row:hover                      { background: rgba(0,57,52,.03); }
  .ibx-row--active                    { background: rgba(0,57,52,.06) !important; }
  .ibx-row--active::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--ibx-accent);
    border-radius: 0 2px 2px 0;
  }
  .ibx-row:focus-visible              { outline: 2px solid var(--ibx-accent); outline-offset: -2px; }
  .ibx-row--archived                  { opacity: .5; }

  .ibx-row__body { flex: 1; min-width: 0; }
  .ibx-row__top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: .5rem;
    margin-bottom: .12rem;
  }
  .ibx-row__sender {
    font-size: .82rem;
    font-weight: 700;
    color: var(--ibx-forest);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ibx-row--unread .ibx-row__sender  { color: var(--ibx-forest); }
  .ibx-row:not(.ibx-row--unread) .ibx-row__sender { font-weight: 500; color: var(--ibx-muted); }
  .ibx-row__time {
    font-size: .7rem;
    font-weight: 500;
    color: var(--ibx-faint);
    white-space: nowrap;
    flex-shrink: 0;
  }
  .ibx-row--unread .ibx-row__time    { color: var(--ibx-accent); font-weight: 700; }

  .ibx-row__subject-row {
    display: flex;
    align-items: center;
    gap: .38rem;
    margin-bottom: .2rem;
  }
  .ibx-row__subject {
    font-size: .8rem;
    font-weight: 500;
    color: var(--ibx-forest);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    line-height: 1.35;
  }
  .ibx-row--unread .ibx-row__subject { font-weight: 600; }
  .ibx-row__unread-pip {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--ibx-accent);
    flex-shrink: 0;
  }

  .ibx-row__preview {
    font-size: .75rem;
    color: var(--ibx-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
    margin: 0 0 .35rem;
  }

  .ibx-row__footer {
    display: flex;
    align-items: center;
    gap: .35rem;
    flex-wrap: wrap;
  }
  .ibx-row__project-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .ibx-row__project {
    font-size: .68rem;
    font-weight: 600;
    color: var(--ibx-faint);
  }
  .ibx-row__labels {
    display: flex;
    gap: .2rem;
    margin-left: .1rem;
    flex-wrap: wrap;
  }

  /* Empty state */
  .ibx-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: .75rem;
    color: var(--ibx-faint);
    padding: 2rem;
  }
  .ibx-empty__text {
    font-size: .84rem;
    font-weight: 500;
    color: var(--ibx-faint);
    margin: 0;
    text-align: center;
  }

  /* ── Detail pane ── */
  .ibx-detail {
    display: flex;
    flex-direction: column;
    background: var(--ibx-surface);
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(0,57,52,.1) transparent;
    animation: ibxFadeIn .22s var(--ibx-ease);
  }
  .ibx-detail::-webkit-scrollbar       { width: 4px; }
  .ibx-detail::-webkit-scrollbar-track { background: transparent; }
  .ibx-detail::-webkit-scrollbar-thumb { background: rgba(0,57,52,.1); border-radius: 2px; }
  @keyframes ibxFadeIn {
    from { opacity: 0; transform: translateX(6px); }
    to   { opacity: 1; transform: translateX(0);   }
  }

  .ibx-detail-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: .75rem;
    background: var(--ibx-surface);
    color: var(--ibx-faint);
  }
  .ibx-detail-empty__text {
    font-size: .84rem;
    font-weight: 500;
    margin: 0;
    color: var(--ibx-faint);
  }

  /* Detail toolbar */
  .ibx-detail__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .75rem 1.75rem;
    border-bottom: 1px solid var(--ibx-border);
    flex-shrink: 0;
    gap: 1rem;
    position: sticky;
    top: 0;
    background: rgba(255,255,255,.92);
    backdrop-filter: blur(10px);
    z-index: 10;
  }
  .ibx-detail__toolbar-left {
    display: flex;
    align-items: center;
    gap: .4rem;
    min-width: 0;
  }
  .ibx-detail__project-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .ibx-detail__project-link {
    font-size: .78rem;
    font-weight: 600;
    color: var(--ibx-muted);
    text-decoration: none;
    transition: color .15s;
  }
  .ibx-detail__project-link:hover         { color: var(--ibx-forest); }
  .ibx-detail__project-link:focus-visible { outline: 2px solid var(--ibx-accent); outline-offset: 2px; border-radius: 3px; }

  .ibx-detail__toolbar-actions {
    display: flex;
    align-items: center;
    gap: .2rem;
    flex-shrink: 0;
  }
  .ibx-detail__action {
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    background: none;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: var(--ibx-muted);
    transition: background .15s, color .15s;
  }
  .ibx-detail__action:hover         { background: rgba(0,57,52,.07); color: var(--ibx-forest); }
  .ibx-detail__action:focus-visible { outline: 2px solid var(--ibx-accent); outline-offset: 1px; }
  .ibx-detail__action[aria-pressed="true"] { color: #f59e0b; }
  .ibx-detail__action--danger:hover { background: rgba(239,68,68,.08); color: #ef4444; }

  /* Detail head */
  .ibx-detail__head {
    padding: 1.75rem 1.75rem 1.25rem;
    border-bottom: 1px solid var(--ibx-border);
    flex-shrink: 0;
  }
  .ibx-detail__head-top {
    display: flex;
    align-items: flex-start;
    gap: .85rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  .ibx-detail__subject {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(1.2rem, 2vw, 1.5rem);
    font-weight: 400;
    color: var(--ibx-forest);
    margin: 0;
    line-height: 1.25;
    letter-spacing: -.018em;
    flex: 1;
    min-width: 0;
  }
  .ibx-detail__labels {
    display: flex;
    gap: .3rem;
    flex-wrap: wrap;
    flex-shrink: 0;
    padding-top: .2rem;
  }
  .ibx-detail__sender-row {
    display: flex;
    align-items: center;
    gap: .65rem;
  }
  .ibx-detail__sender-info { display: flex; flex-direction: column; gap: .1rem; }
  .ibx-detail__sender-name {
    font-size: .84rem;
    font-weight: 700;
    color: var(--ibx-forest);
    line-height: 1.3;
  }
  .ibx-detail__sender-meta {
    font-size: .74rem;
    color: var(--ibx-faint);
    font-weight: 400;
  }
  .ibx-detail__sender-meta strong { color: var(--ibx-muted); font-weight: 600; }

  /* Body */
  .ibx-detail__body {
    padding: 1.5rem 1.75rem;
    flex: 1;
  }
  .ibx-detail__para {
    font-size: .9rem;
    color: var(--ibx-muted);
    line-height: 1.72;
    margin: 0 0 1.1em;
    max-width: 62ch;
  }
  .ibx-detail__para:last-child { margin-bottom: 0; }

  /* Reply box */
  .ibx-detail__reply {
    display: flex;
    gap: .7rem;
    align-items: flex-start;
    padding: 1.1rem 1.75rem 1.5rem;
    border-top: 1px solid var(--ibx-border);
    flex-shrink: 0;
    background: var(--ibx-surface-alt);
  }
  .ibx-detail__reply-field { flex: 1; min-width: 0; }
  .ibx-detail__reply-input {
    width: 100%;
    resize: none;
    font-family: 'DM Sans', sans-serif;
    font-size: .84rem;
    font-weight: 500;
    color: var(--ibx-forest);
    background: var(--ibx-surface);
    border: 1.5px solid var(--ibx-border-md);
    border-radius: var(--ibx-radius-sm);
    padding: .62rem .75rem;
    outline: none;
    min-height: 44px;
    max-height: 160px;
    overflow-y: auto;
    transition: border-color .18s, box-shadow .18s, min-height .2s var(--ibx-ease);
  }
  .ibx-detail__reply-input::placeholder { color: var(--ibx-faint); }
  .ibx-detail__reply-input:focus {
    border-color: var(--ibx-forest);
    box-shadow: 0 0 0 3px rgba(0,57,52,.07);
    min-height: 80px;
  }
  .ibx-detail__reply-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: .5rem;
  }
  .ibx-detail__reply-hint {
    font-size: .7rem;
    color: var(--ibx-faint);
    font-weight: 500;
  }
  .ibx-detail__reply-send {
    display: inline-flex;
    align-items: center;
    gap: .38rem;
    padding: .44rem .85rem;
    background: var(--ibx-forest);
    border: none;
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: .78rem;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: background .18s, opacity .18s, transform .18s;
  }
  .ibx-detail__reply-send:hover:not(:disabled) {
    background: var(--ibx-forest-lt);
    transform: translateY(-1px);
  }
  .ibx-detail__reply-send:disabled        { opacity: .32; cursor: not-allowed; }
  .ibx-detail__reply-send--sent           { background: var(--ibx-accent); }
  .ibx-detail__reply-send:focus-visible   { outline: 2px solid var(--ibx-accent); outline-offset: 2px; }
  .ibx-detail__reply-confirm {
    font-size: .72rem;
    font-weight: 600;
    color: var(--ibx-accent);
    margin: .4rem 0 0;
  }

  /* ── Compose modal ── */
  .ibx-compose-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.35);
    backdrop-filter: blur(3px);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 0 1.5rem 1.5rem 0;
    animation: ibxBackdropIn .2s var(--ibx-ease);
  }
  @keyframes ibxBackdropIn { from { opacity: 0; } to { opacity: 1; } }
  .ibx-compose {
    width: 460px;
    max-width: calc(100vw - 2rem);
    background: var(--ibx-surface);
    border-radius: var(--ibx-radius);
    border: 1px solid var(--ibx-border-md);
    box-shadow: 0 8px 32px rgba(0,57,52,.2), 0 2px 8px rgba(0,57,52,.12);
    display: flex;
    flex-direction: column;
    animation: ibxComposeSlide .25s var(--ibx-ease);
    overflow: hidden;
  }
  @keyframes ibxComposeSlide {
    from { opacity: 0; transform: translateY(20px) scale(.97); }
    to   { opacity: 1; transform: translateY(0)   scale(1);   }
  }
  .ibx-compose__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .8rem 1rem .7rem;
    background: var(--ibx-forest);
    flex-shrink: 0;
  }
  .ibx-compose__title {
    font-size: .84rem;
    font-weight: 700;
    color: rgba(255,255,255,.9);
  }
  .ibx-compose__close {
    width: 24px; height: 24px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,.1);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: rgba(255,255,255,.7);
    transition: background .15s, color .15s;
  }
  .ibx-compose__close:hover         { background: rgba(255,255,255,.18); color: white; }
  .ibx-compose__close:focus-visible { outline: 2px solid var(--ibx-accent); outline-offset: 2px; }

  .ibx-compose__fields { padding: .6rem .9rem 0; flex-shrink: 0; }
  .ibx-compose__field {
    display: flex;
    align-items: center;
    gap: .6rem;
    padding: .5rem 0;
    border-bottom: 1px solid var(--ibx-border);
  }
  .ibx-compose__field--sep { border-bottom: 1px solid var(--ibx-border); }
  .ibx-compose__field-label {
    font-size: .72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: var(--ibx-faint);
    min-width: 3.5rem;
    flex-shrink: 0;
  }
  .ibx-compose__field-input {
    flex: 1;
    border: none;
    background: none;
    font-family: 'DM Sans', sans-serif;
    font-size: .84rem;
    font-weight: 500;
    color: var(--ibx-forest);
    outline: none;
    padding: 0;
  }
  .ibx-compose__field-input::placeholder { color: var(--ibx-faint); }

  .ibx-compose__body {
    flex: 1;
    min-height: 140px;
    resize: none;
    font-family: 'DM Sans', sans-serif;
    font-size: .84rem;
    font-weight: 400;
    color: var(--ibx-muted);
    background: none;
    border: none;
    padding: .75rem .9rem;
    outline: none;
    line-height: 1.65;
  }
  .ibx-compose__body::placeholder { color: var(--ibx-faint); }

  .ibx-compose__footer {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .65rem .9rem;
    border-top: 1px solid var(--ibx-border);
    flex-shrink: 0;
  }
  .ibx-compose__send {
    display: inline-flex;
    align-items: center;
    gap: .38rem;
    padding: .46rem .9rem;
    background: var(--ibx-forest);
    border: none;
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: .8rem;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: background .18s, opacity .18s;
  }
  .ibx-compose__send:hover:not(:disabled) { background: var(--ibx-forest-lt); }
  .ibx-compose__send:disabled             { opacity: .32; cursor: not-allowed; }
  .ibx-compose__send:focus-visible        { outline: 2px solid var(--ibx-accent); outline-offset: 2px; }
  .ibx-compose__discard {
    padding: .46rem .75rem;
    background: none;
    border: none;
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: .8rem;
    font-weight: 500;
    color: var(--ibx-muted);
    cursor: pointer;
    transition: background .15s, color .15s;
  }
  .ibx-compose__discard:hover         { background: rgba(0,57,52,.06); color: var(--ibx-forest); }
  .ibx-compose__discard:focus-visible { outline: 2px solid var(--ibx-accent); outline-offset: 2px; }

  .ibx-compose__sent {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: .65rem;
    padding: 2rem 1rem;
    font-size: .9rem;
    font-weight: 600;
    color: var(--ibx-forest);
    animation: ibxFadeIn .25s var(--ibx-ease);
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .ibx-body { grid-template-columns: 1fr; }
    .ibx-detail { display: none; }
    .ibx-body--detail-open .ibx-list-pane { display: none; }
    .ibx-body--detail-open .ibx-detail    { display: flex; }
    .ibx-topbar__hamburger { display: flex; }
  }
  @media (max-width: 480px) {
    .ibx-topbar { padding: 0 1rem; }
    .ibx-compose { width: calc(100vw - 2rem); }
  }
`;

// ─── Inbox ────────────────────────────────────────────────────────────────────

export default function Inbox({ onMenuOpen }) {
    const [state, dispatch] = useReducer(inboxReducer, initialState);
    const { messages, activeId, filter, search, composing } = state;

    const activeMessage = useMemo(
        () => messages.find((m) => m.id === activeId) ?? null,
        [messages, activeId]
    );

    const unreadCount = useMemo(
        () => messages.filter((m) => !m.read && !m.archived).length,
        [messages]
    );

    const openCompose = useCallback(() => dispatch({ type: "SET_COMPOSING", composing: true }), []);
    const closeCompose = useCallback(() => dispatch({ type: "SET_COMPOSING", composing: false }), []);

    // Keyboard navigation: j/k to move between messages, e to archive
    useEffect(() => {
        const visibleMessages = messages.filter((m) =>
            filter === "archived" ? m.archived :
                filter === "unread" ? !m.read && !m.archived :
                    filter === "starred" ? m.starred && !m.archived :
                        !m.archived
        );

        const handler = (e) => {
            // Don't intercept when typing in a field
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
            const idx = visibleMessages.findIndex((m) => m.id === activeId);

            if (e.key === "j" || e.key === "ArrowDown") {
                e.preventDefault();
                const next = visibleMessages[idx + 1];
                if (next) dispatch({ type: "SELECT", id: next.id });
            }
            if (e.key === "k" || e.key === "ArrowUp") {
                e.preventDefault();
                const prev = visibleMessages[idx - 1];
                if (prev) dispatch({ type: "SELECT", id: prev.id });
            }
            if (e.key === "e" && activeId) {
                e.preventDefault();
                dispatch({ type: "ARCHIVE", id: activeId });
            }
            if (e.key === "c") {
                e.preventDefault();
                openCompose();
            }
        };

        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [messages, activeId, filter, openCompose]);

    const bodyClass = [
        "ibx-body",
        activeMessage ? "ibx-body--detail-open" : "",
    ].filter(Boolean).join(" ");

    return (
        <>
            <style>{styles}</style>

            <div className="ibx-shell">

                {/* ── Topbar ── */}
                <header className="ibx-topbar">
                    <div className="ibx-topbar__left">
                        <button
                            type="button"
                            className="ibx-topbar__hamburger"
                            onClick={onMenuOpen}
                            aria-label="Open navigation"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>

                        <nav className="ibx-topbar__crumb" aria-label="Breadcrumb">
                            <Link to="/dashboard" className="ibx-topbar__crumb-sep" style={{ textDecoration: "none", color: "inherit" }}>
                                Meridian
                            </Link>
                            <span className="ibx-topbar__crumb-sep" aria-hidden="true">/</span>
                            <span className="ibx-topbar__crumb-current" aria-current="page">Inbox</span>
                        </nav>
                    </div>

                    <div className="ibx-topbar__right">
                        {unreadCount > 0 && (
                            <span
                                className="ibx-topbar__unread-badge"
                                aria-label={`${unreadCount} unread messages`}
                            >
                                {unreadCount} unread
                            </span>
                        )}
                        <button
                            type="button"
                            className="ibx-topbar__compose"
                            onClick={openCompose}
                            aria-label="Compose new message (C)"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Compose
                        </button>
                    </div>
                </header>

                {/* ── Two-pane body ── */}
                <div className={bodyClass}>
                    <MessageList
                        messages={messages}
                        activeId={activeId}
                        filter={filter}
                        search={search}
                        dispatch={dispatch}
                    />
                    {activeMessage
                        ? <MessageDetail key={activeMessage.id} message={activeMessage} dispatch={dispatch} />
                        : <EmptyDetail />
                    }
                </div>

            </div>

            {/* ── Compose modal ── */}
            {composing && <ComposeModal onClose={closeCompose} />}
        </>
    );
}