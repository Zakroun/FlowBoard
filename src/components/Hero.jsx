import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import '../styles/Hero.css';

function HeroEyebrow() {
    return (
        <div className="hero__eyebrow" aria-hidden="false">
            <span className="hero__eyebrow-dot" />
            <span>Now in public beta</span>
        </div>
    );
}

function HeroHeadline() {
    return (
        <h1 className="hero__headline">
            Manage projects{" "}
            <span className="hero__headline-accent">smarter</span>
            <br />
            with FlowBoard
        </h1>
    );
}

function HeroSubcopy() {
    return (
        <p className="hero__subcopy">
            Organize tasks, collaborate with your team, and track progress — all in
            one clean, focused workspace built for modern teams.
        </p>
    );
}

function HeroActions() {
    return (
        <nav className="hero__actions" aria-label="Primary call to action">
            <Link to="/signup" className="hero__btn hero__btn--primary">
                Get Started Free
            </Link>
            <Link to="/demo" className="hero__btn hero__btn--ghost">
                <span className="hero__btn-icon" aria-hidden="true">▶</span>
                Watch Demo
            </Link>
        </nav>
    );
}

function HeroSocialProof() {
    const avatarColors = ["#4CAF88", "#2E7D6A", "#A8D5C2", "#1A5C4A"];
    return (
        <div className="hero__social-proof" aria-label="Social proof">
            <div className="hero__avatars" aria-hidden="true">
                {avatarColors.map((color, i) => (
                    <span
                        key={i}
                        className="hero__avatar"
                        style={{ background: color, zIndex: avatarColors.length - i }}
                    />
                ))}
            </div>
            <p className="hero__social-text">
                <strong>2,400+</strong> teams already shipping faster
            </p>
        </div>
    );
}

function HeroBoardPreview() {
    const columns = [
        {
            label: "To Do",
            accent: "#94a3b8",
            cards: ["Onboarding flow redesign", "API rate-limit audit"],
        },
        {
            label: "In Progress",
            accent: "#38bdf8",
            cards: ["Dashboard analytics", "Mobile nav"],
        },
        {
            label: "Done",
            accent: "#4ade80",
            cards: ["Auth module", "CI pipeline"],
        },
    ];

    return (
        <figure className="hero__preview" aria-label="FlowBoard Kanban preview">
            <div className="hero__preview-topbar" aria-hidden="true">
                <span className="hero__preview-dot" style={{ background: "#ef4444" }} />
                <span className="hero__preview-dot" style={{ background: "#facc15" }} />
                <span className="hero__preview-dot" style={{ background: "#4ade80" }} />
                <span className="hero__preview-title">FlowBoard — Q3 Sprint</span>
            </div>

            <div className="hero__board" role="img" aria-label="Example Kanban board">
                {columns.map(({ label, accent, cards }) => (
                    <div key={label} className="hero__column">
                        <div className="hero__column-header">
                            <span
                                className="hero__column-dot"
                                style={{ background: accent }}
                            />
                            <span className="hero__column-label">{label}</span>
                            <span className="hero__column-count">{cards.length}</span>
                        </div>
                        {cards.map((card) => (
                            <div key={card} className="hero__card">
                                <span className="hero__card-bar" style={{ background: accent }} />
                                <span className="hero__card-text">{card}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </figure>
    );
}

export default function Hero() {
    const sectionRef = useRef(null);
    useEffect(() => {
        const section = sectionRef.current;
        if (!section || window.matchMedia("(max-width: 900px)").matches) return;

        const preview = section.querySelector(".hero__preview");
        if (!preview) return;

        const handleMouseMove = (e) => {
            const rect = section.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);

            preview.style.transform = `
        perspective(1200px)
        rotateY(${-4 + dx * 3}deg)
        rotateX(${2 - dy * 2}deg)
    `;
        };

        const handleMouseLeave = () => {
            preview.style.transform =
                "perspective(1200px) rotateY(-4deg) rotateX(2deg)";
        };

        section.addEventListener("mousemove", handleMouseMove);
        section.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            section.removeEventListener("mousemove", handleMouseMove);
            section.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <>
            <section
                className="hero"
                ref={sectionRef}
                aria-labelledby="hero-headline"
            >
                <div className="hero__inner">
                    <div className="hero__copy">
                        <HeroEyebrow />
                        <HeroHeadline />
                        <HeroSubcopy />
                        <HeroActions />
                        <HeroSocialProof />
                    </div>
                    <HeroBoardPreview />
                </div>
            </section>
        </>
    );
}