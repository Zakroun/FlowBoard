// data/dashboardData.jsx
export const SPRINT_TASKS = [
    { id: 1, label: "Auth redesign", assignee: "#4CAF88", pts: 5, status: "done", project: "App Redesign" },
    { id: 2, label: "API rate limits", assignee: "#38bdf8", pts: 3, status: "done", project: "Q4 Sprint" },
    { id: 3, label: "Mobile nav fixes", assignee: "#f59e0b", pts: 8, status: "in-progress", project: "App Redesign" },
    { id: 4, label: "Onboarding flow v2", assignee: "#a78bfa", pts: 5, status: "in-progress", project: "Q4 Sprint" },
    { id: 5, label: "Postgres migration", assignee: "#4CAF88", pts: 13, status: "todo", project: "Infra Migration" },
    { id: 6, label: "Write e2e tests", assignee: "#38bdf8", pts: 3, status: "todo", project: "Q4 Sprint" },
    { id: 7, label: "Analytics dashboard", assignee: "#f59e0b", pts: 8, status: "todo", project: "Q4 Sprint" },
];

export const ACTIVITY = [
    { id: 1, user: "JP", color: "#38bdf8", action: "completed", subject: "CI pipeline fix", time: "2m ago" },
    { id: 2, user: "MO", color: "#4CAF88", action: "commented on", subject: "Auth redesign", time: "14m ago" },
    { id: 3, user: "LR", color: "#f59e0b", action: "moved", subject: "Mobile nav → Review", time: "1h ago" },
    { id: 4, user: "TV", color: "#a78bfa", action: "created", subject: "Infra ticket #204", time: "2h ago" },
    { id: 5, user: "JP", color: "#38bdf8", action: "assigned", subject: "API rate limits to you", time: "3h ago" },
];

export const VELOCITY_DATA = [28, 35, 24, 42, 38, 51, 46, 58, 44, 62, 55, 71];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const STAT_CARDS = [
    { label: "Tasks done", value: "24", delta: "+8", deltaUp: true, color: "#4CAF88", sub: "this sprint" },
    { label: "In progress", value: "7", delta: "-2", deltaUp: false, color: "#38bdf8", sub: "active tasks" },
    { label: "Sprint velocity", value: "71", delta: "+29%", deltaUp: true, color: "#a78bfa", sub: "pts this sprint" },
    { label: "Cycle time", value: "2.4d", delta: "-0.8", deltaUp: true, color: "#f59e0b", sub: "avg. per task" },
];

export const STATUS_COLOR = {
    "done": { bg: "rgba(76,175,136,.12)", color: "#4CAF88", label: "Done" },
    "in-progress": { bg: "rgba(56,189,248,.12)", color: "#38bdf8", label: "In Progress" },
    "todo": { bg: "rgba(148,163,184,.1)", color: "#94a3b8", label: "To Do" },
};