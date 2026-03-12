import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/CTA.css';
const SOCIAL_PROOF = [
    { value: "12,400+", label: "Teams onboarded" },
    { value: "98%", label: "Customer retention" },
    { value: "4.9 ★", label: "Average rating" },
];

const AVATAR_COLORS = ["#4CAF88", "#38bdf8", "#f59e0b", "#a78bfa", "#f87171"];
function AvatarStack() {
    return (
        <div className="cta__avatars" aria-hidden="true">
            {AVATAR_COLORS.map((color) => (
                <span key={color} className="cta__avatar" style={{ background: color }} />
            ))}
            <span className="cta__avatar-label">+12k teams</span>
        </div>
    );
}

function StatPill({ value, label, index, visible }) {
    return (
        <div
            className={`cta__stat${visible ? " cta__stat--visible" : ""}`}
            style={{ "--delay": `${0.3 + index * 0.1}s` }}
        >
            <span className="cta__stat-value">{value}</span>
            <span className="cta__stat-label">{label}</span>
        </div>
    );
}

function BackgroundOrbs() {
    return (
        <div className="cta__orbs" aria-hidden="true">
            <div className="cta__orb cta__orb--1" />
            <div className="cta__orb cta__orb--2" />
            <div className="cta__orb cta__orb--3" />
        </div>
    );
}

function GridTexture() {
    return (
        <div className="cta__grid" aria-hidden="true" />
    );
}
export default function CTA() {
    const statsRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = statsRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <section className="cta" aria-labelledby="cta-headline">
                <GridTexture />
                <BackgroundOrbs />
                <div className="cta__inner">
                    <span className="cta__kicker">
                        <span className="cta__kicker-dot" aria-hidden="true" />
                        No credit card required
                    </span>
                    <h2 id="cta-headline" className="cta__headline">
                        Your team deserves<br />
                        <em>better than chaos</em>
                    </h2>
                    <p className="cta__sub">
                        FlowBoard brings every task, teammate, and deadline into one
                        calm, focused workspace. Start free and feel the difference
                        in your first sprint.
                    </p>
                    <AvatarStack />
                    <nav className="cta__actions" aria-label="Sign up actions">
                        <Link to="/register" className="cta__btn cta__btn--primary">
                            Start for free
                            <span className="cta__btn-arrow" aria-hidden="true">→</span>
                        </Link>
                        <Link to="/demo" className="cta__btn cta__btn--ghost">
                            Watch a 2-min demo
                        </Link>
                    </nav>
                    <div
                        className="cta__stats"
                        ref={statsRef}
                        role="list"
                        aria-label="FlowBoard by the numbers"
                    >
                        {SOCIAL_PROOF.map((stat, i) => (
                            <StatPill
                                key={stat.label}
                                {...stat}
                                index={i}
                                visible={visible}
                            />
                        ))}
                    </div>
                    <p className="cta__fine">
                        <strong>Free forever</strong> on small teams · No setup fees · Cancel anytime
                    </p>
                </div>
            </section>
        </>
    );
}