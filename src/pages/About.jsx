import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/About.css';
const STATS = [
    { value: "12,400+", label: "Teams worldwide" },
    { value: "3.2M", label: "Tasks completed" },
    { value: "98%", label: "Customer retention" },
    { value: "2021", label: "Founded" },
];

const VALUES = [
    {
        id: "clarity",
        title: "Clarity over noise",
        description:
            "Every product decision starts with one question: does this reduce confusion or add to it? We cut ruthlessly.",
    },
    {
        id: "craft",
        title: "Craft at every layer",
        description:
            "From database queries to border radii — quality is not a final pass. It's baked into how we work.",
    },
    {
        id: "trust",
        title: "Trust by default",
        description:
            "We build for teams that trust each other. FlowBoard reflects that — transparent, open, no hidden complexity.",
    },
    {
        id: "velocity",
        title: "Ship, then refine",
        description:
            "Perfect is the enemy of shipped. We move fast, listen hard, and iterate in the open with our users.",
    },
];

const TEAM = [
    {
        name: "Mara Osei",
        role: "Co-founder & CEO",
        avatar: "#4CAF88",
        initials: "MO",
        bio: "Previously led product at Notion. Obsessed with reducing cognitive load in software.",
    },
    {
        name: "Jin Park",
        role: "Co-founder & CTO",
        avatar: "#38bdf8",
        initials: "JP",
        bio: "Ex-infrastructure engineer at Stripe. Believes fast software is a feature, not a luxury.",
    },
    {
        name: "Lena Richter",
        role: "Head of Design",
        avatar: "#f59e0b",
        initials: "LR",
        bio: "Spent six years at Linear refining how teams experience work. Joins to do it again.",
    },
    {
        name: "Tomás Vega",
        role: "Head of Engineering",
        avatar: "#a78bfa",
        initials: "TV",
        bio: "Full-stack generalist who shipped the first version of FlowBoard in a single weekend.",
    },
];

const TIMELINE = [
    { year: "2021", event: "FlowBoard founded in a Berlin co-working space with four people and a shared spreadsheet." },
    { year: "2022", event: "Launched private beta. First 200 teams onboarded in under 48 hours." },
    { year: "2023", event: "Series A. Expanded to 18 people. Shipped Kanban, timelines, and real-time collaboration." },
    { year: "2024", event: "Crossed 10,000 active teams. Opened offices in Berlin, San Francisco, and Singapore." },
    { year: "2025", event: "Launched FlowBoard AI. Reached 12,400 teams across 90 countries." },
];
function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, visible];
}
function SectionLabel({ children }) {
    return (
        <span className="abt-label">
            <span className="abt-label__dot" aria-hidden="true" />
            {children}
        </span>
    );
}

function StatCard({ value, label, index, visible }) {
    return (
        <div
            className={`abt-stat${visible ? " abt-stat--visible" : ""}`}
            style={{ "--delay": `${index * 0.08}s` }}
        >
            <span className="abt-stat__value">{value}</span>
            <span className="abt-stat__label">{label}</span>
        </div>
    );
}

function ValueCard({ title, description, index, visible }) {
    return (
        <article
            className={`abt-value${visible ? " abt-value--visible" : ""}`}
            style={{ "--delay": `${index * 0.09}s` }}
        >
            <span className="abt-value__num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
            </span>
            <div className="abt-value__body">
                <h3 className="abt-value__title">{title}</h3>
                <p className="abt-value__desc">{description}</p>
            </div>
        </article>
    );
}

function TeamCard({ member, index, visible }) {
    return (
        <article
            className={`abt-member${visible ? " abt-member--visible" : ""}`}
            style={{ "--delay": `${index * 0.1}s` }}
            aria-labelledby={`member-${index}`}
        >
            <div
                className="abt-member__avatar"
                style={{ background: member.avatar }}
                aria-hidden="true"
            >
                <span className="abt-member__initials">{member.initials}</span>
                <div className="abt-member__avatar-ring" />
            </div>
            <div className="abt-member__info">
                <h3 id={`member-${index}`} className="abt-member__name">
                    {member.name}
                </h3>
                <span className="abt-member__role">{member.role}</span>
                <p className="abt-member__bio">{member.bio}</p>
            </div>
        </article>
    );
}

function TimelineItem({ year, event, index, visible, isLast }) {
    return (
        <div
            className={`abt-tl-item${visible ? " abt-tl-item--visible" : ""}`}
            style={{ "--delay": `${index * 0.1}s` }}
        >
            <div className="abt-tl-item__spine" aria-hidden="true">
                <span className="abt-tl-item__dot" />
                {!isLast && <span className="abt-tl-item__line" />}
            </div>
            <div className="abt-tl-item__content">
                <span className="abt-tl-item__year">{year}</span>
                <p className="abt-tl-item__event">{event}</p>
            </div>
        </div>
    );
}

function HeroSection() {
    return (
        <div className="abt-hero">
            <div className="abt-hero__inner">
                <SectionLabel>Our story</SectionLabel>
                <h1 className="abt-hero__headline">
                    We build tools for<br />
                    <em>how teams actually work</em>
                </h1>
                <p className="abt-hero__sub">
                    FlowBoard started as a frustration with project management software that felt
                    built for managers, not the people doing the work. We set out to change that.
                </p>
                <nav className="abt-hero__cta" aria-label="About page actions">
                    <Link to="/register" className="abt-hero__btn abt-hero__btn--primary">
                        Start for free
                        <span className="abt-hero__arrow" aria-hidden="true">→</span>
                    </Link>
                    <Link to="/careers" className="abt-hero__btn abt-hero__btn--ghost">
                        Join our team
                    </Link>
                </nav>
            </div>
            <div className="abt-hero__accent" aria-hidden="true" />
        </div>
    );
}

function StatsSection() {
    const [ref, visible] = useInView(0.2);
    return (
        <div className="abt-stats-band">
            <div className="abt-stats-grid" ref={ref} role="list" aria-label="FlowBoard at a glance">
                {STATS.map((s, i) => (
                    <StatCard key={s.label} {...s} index={i} visible={visible} />
                ))}
            </div>
        </div>
    );
}

function MissionSection() {
    const [ref, visible] = useInView(0.15);
    const avatarColors = ["#4CAF88", "#38bdf8", "#f59e0b", "#a78bfa"];
    return (
        <section
            className={`abt-mission`}
            aria-labelledby="abt-mission-headline"
            ref={ref}
        >
            <div className="abt-mission__inner">
                <div className="abt-mission__lhs">
                    <SectionLabel>Our mission</SectionLabel>
                    <h2 id="abt-mission-headline" className="abt-mission__headline">
                        Work should feel<br />
                        <em>like flow, not friction</em>
                    </h2>
                    <p className="abt-mission__body">
                        Most project management tools are built around process — stages, approvals,
                        reports. They optimize for visibility upward, not momentum forward.
                    </p>
                    <p className="abt-mission__body">
                        FlowBoard inverts that. We design around the person doing the work:
                        what's next, who's blocked, and how to move faster together.
                    </p>
                    <blockquote className="abt-mission__quote">
                        <p>
                            The best tool is one that gets out of the way and lets the work speak for itself.
                        </p>
                        <cite>— Mara Osei, Co-founder & CEO</cite>
                    </blockquote>
                </div>
                <div className="abt-mission__visual" aria-hidden="true">
                    <div className="abt-mission__card abt-mission__card--1">
                        <span className="abt-mission__card-label">Sprint velocity</span>
                        <span className="abt-mission__card-value">↑ 34%</span>
                        <div className="abt-mission__card-bar">
                            <div className="abt-mission__card-fill" style={{ width: "72%" }} />
                        </div>
                    </div>
                    <div className="abt-mission__card abt-mission__card--2">
                        <span className="abt-mission__card-label">Team</span>
                        <div className="abt-mission__card-row">
                            <div className="abt-mission__card-avatars">
                                {avatarColors.map((c) => (
                                    <span key={c} className="abt-mission__card-avatar" style={{ background: c }} />
                                ))}
                            </div>
                            <span className="abt-mission__card-tag">4 online</span>
                        </div>
                    </div>
                    <div className="abt-mission__card abt-mission__card--3">
                        <span className="abt-mission__card-label">Tasks shipped this week</span>
                        <span className="abt-mission__card-value">48 / 52</span>
                        <div className="abt-mission__card-bar">
                            <div className="abt-mission__card-fill" style={{ width: "92%" }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ValuesSection() {
    const [ref, visible] = useInView(0.1);
    return (
        <section className="abt-values" aria-labelledby="abt-values-headline">
            <div className="abt-values__inner">
                <header className="abt-values__header">
                    <SectionLabel>What we believe</SectionLabel>
                    <h2 id="abt-values-headline" className="abt-values__headline">
                        Principles, not <em>platitudes</em>
                    </h2>
                </header>
                <div className="abt-values__grid" ref={ref} role="list">
                    {VALUES.map((v, i) => (
                        <ValueCard key={v.id} {...v} index={i} visible={visible} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TeamSection() {
    const [ref, visible] = useInView(0.1);
    return (
        <section className="abt-team" aria-labelledby="abt-team-headline">
            <div className="abt-team__inner">
                <header className="abt-team__header">
                    <SectionLabel>The team</SectionLabel>
                    <h2 id="abt-team-headline" className="abt-team__headline">
                        Built by people who <em>felt the pain</em>
                    </h2>
                </header>
                <div className="abt-team__grid" ref={ref}>
                    {TEAM.map((member, i) => (
                        <TeamCard key={member.name} member={member} index={i} visible={visible} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TimelineSection() {
    const [ref, visible] = useInView(0.1);
    return (
        <section className="abt-timeline" aria-labelledby="abt-tl-headline">
            <div className="abt-timeline__inner">
                <header className="abt-timeline__header">
                    <SectionLabel>The journey</SectionLabel>
                    <h2 id="abt-tl-headline" className="abt-timeline__headline">
                        Four years, one <em>clear direction</em>
                    </h2>
                </header>
                <div ref={ref}>
                    {TIMELINE.map((item, i) => (
                        <TimelineItem
                            key={item.year}
                            {...item}
                            index={i}
                            visible={visible}
                            isLast={i === TIMELINE.length - 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ClosingSection() {
    return (
        <div className="abt-closing">
            <div className="abt-closing__inner">
                <h2 className="abt-closing__headline">
                    Ready to join<br />
                    <em>12,400 teams?</em>
                </h2>
                <p className="abt-closing__sub">
                    Start free. No credit card. No onboarding call. Just open
                    FlowBoard and feel the difference.
                </p>
                <Link to="/register" className="abt-closing__btn">
                    Get started free
                    <span className="abt-closing__arrow" aria-hidden="true">→</span>
                </Link>
            </div>
        </div>
    );
}
export default function About() {
    return (
        <>
            <main className="abt" aria-label="About FlowBoard">
                <HeroSection />
                <StatsSection />
                <MissionSection />
                <ValuesSection />
                <TeamSection />
                <TimelineSection />
                <ClosingSection />
            </main>
        </>
    );
}