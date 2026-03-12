import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/Pricing.css';
const PLANS = [
    {
        id: "starter",
        name: "Starter",
        monthlyPrice: 0,
        yearlyPrice: 0,
        tagline: "Free forever",
        description: "For freelancers and tiny teams who need the basics done well.",
        accent: "#4CAF88",
        ctaLabel: "Get started free",
        ctaTo: "/register",
        highlighted: false,
    },
    {
        id: "pro",
        name: "Pro",
        monthlyPrice: 14,
        yearlyPrice: 10,
        tagline: "Most popular",
        description: "For teams that ship regularly and need full flexibility.",
        accent: "#003934",
        ctaLabel: "Start 14-day trial",
        ctaTo: "/register?plan=pro",
        highlighted: true,
    },
    {
        id: "business",
        name: "Business",
        monthlyPrice: 28,
        yearlyPrice: 20,
        tagline: "For scaling orgs",
        description: "For multi-team orgs that need governance and deeper insights.",
        accent: "#38bdf8",
        ctaLabel: "Start 14-day trial",
        ctaTo: "/register?plan=business",
        highlighted: false,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        monthlyPrice: null,
        yearlyPrice: null,
        tagline: "Custom pricing",
        description: "For organisations with security, compliance, and scale requirements.",
        accent: "#a78bfa",
        ctaLabel: "Talk to sales",
        ctaTo: "/contact?topic=Enterprise+%2F+Sales",
        highlighted: false,
    },
];

const FEATURE_GROUPS = [
    {
        group: "Projects & tasks",
        rows: [
            { feature: "Projects", values: ["3", "Unlimited", "Unlimited", "Unlimited"] },
            { feature: "Active tasks", values: ["200", "Unlimited", "Unlimited", "Unlimited"] },
            { feature: "Views", values: ["List, Board", "+ Timeline", "+ Gantt", "+ Custom"] },
            { feature: "Custom fields", values: [false, "10", "Unlimited", "Unlimited"] },
            { feature: "Task dependencies", values: [false, true, true, true] },
            { feature: "Recurring tasks", values: [false, true, true, true] },
        ],
    },
    {
        group: "Collaboration",
        rows: [
            { feature: "Members", values: ["5", "Unlimited", "Unlimited", "Unlimited"] },
            { feature: "Guests", values: [false, "5 free", "20 free", "Unlimited"] },
            { feature: "Comments & threads", values: [true, true, true, true] },
            { feature: "File attachments", values: ["2 GB", "50 GB", "250 GB", "Unlimited"] },
            { feature: "Real-time presence", values: [false, true, true, true] },
        ],
    },
    {
        group: "Automation & integrations",
        rows: [
            { feature: "Automations / mo", values: ["50", "1,000", "10,000", "Unlimited"] },
            { feature: "Integrations", values: ["5", "All", "All", "All + custom"] },
            { feature: "API access", values: [false, "Read-only", "Full", "Full + webhooks"] },
            { feature: "Zapier / Make", values: [false, true, true, true] },
        ],
    },
    {
        group: "Analytics & reporting",
        rows: [
            { feature: "Dashboards", values: ["1", "5", "Unlimited", "Unlimited"] },
            { feature: "Velocity reports", values: [false, true, true, true] },
            { feature: "Export to CSV/PDF", values: [false, true, true, true] },
            { feature: "Advanced analytics", values: [false, false, true, true] },
        ],
    },
    {
        group: "Security & admin",
        rows: [
            { feature: "2FA", values: [true, true, true, true] },
            { feature: "SSO (SAML/OIDC)", values: [false, false, true, true] },
            { feature: "Audit logs", values: [false, false, "90 days", "Unlimited"] },
            { feature: "Custom roles", values: [false, false, true, true] },
            { feature: "SLA guarantee", values: [false, false, false, true] },
            { feature: "Dedicated CSM", values: [false, false, false, true] },
        ],
    },
];

const TESTIMONIALS = [
    {
        quote: "We moved four teams onto Pro in an afternoon. The migration was painless and the speed difference was immediate.",
        name: "Priya Nair",
        role: "VP Engineering, Meridian",
        avatar: "#4CAF88",
        initials: "PN",
    },
    {
        quote: "Enterprise support actually responds. Our dedicated manager knows our stack and checks in weekly without being asked.",
        name: "Lars Brandt",
        role: "CTO, Northlake Systems",
        avatar: "#38bdf8",
        initials: "LB",
    },
    {
        quote: "Switched from a competitor after two years. The custom workflow builder alone saved us six hours a week.",
        name: "Amara Osei",
        role: "Head of Product, Solaris",
        avatar: "#f59e0b",
        initials: "AO",
    },
];

const FAQS = [
    {
        q: "Is there really no credit card required for the trial?",
        a: "Correct. Pro and Business trials run for 14 days with full access. We only ask for payment details if you choose to continue.",
    },
    {
        q: "Can I mix plans across teams in one organisation?",
        a: "Yes — each workspace has its own plan. You can run different teams on different tiers and manage billing centrally on Business and Enterprise.",
    },
    {
        q: "How does the member count work?",
        a: "A member is any person with a login to your workspace. Guests with view-only or limited access are not counted toward your member limit.",
    },
    {
        q: "What happens at the end of my trial?",
        a: "Your workspace automatically downgrades to Starter. Nothing is deleted. You can upgrade again at any time and everything picks up where you left off.",
    },
    {
        q: "Do you offer nonprofit or education discounts?",
        a: "Yes — 50% off Pro and Business for verified nonprofits and accredited educational institutions. Contact us to verify and apply the discount.",
    },
];
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
        <span className={`px-label${light ? " px-label--light" : ""}`}>
            <span className="px-label__dot" aria-hidden="true" />
            {children}
        </span>
    );
}

function BillingToggle({ isYearly, onToggle }) {
    return (
        <div className="px-toggle" role="group" aria-label="Billing period">
            <button
                className={`px-toggle__opt${!isYearly ? " px-toggle__opt--on" : ""}`}
                onClick={() => isYearly && onToggle()}
                type="button"
                aria-pressed={!isYearly}
            >
                Monthly
            </button>
            <button
                className={`px-toggle__opt${isYearly ? " px-toggle__opt--on" : ""}`}
                onClick={() => !isYearly && onToggle()}
                type="button"
                aria-pressed={isYearly}
            >
                Yearly
                <span className="px-toggle__save">–28%</span>
            </button>
        </div>
    );
}

function PriceDisplay({ plan, isYearly }) {
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    if (price === null) {
        return (
            <div className="px-price">
                <span className="px-price__custom">Custom</span>
            </div>
        );
    }
    if (price === 0) {
        return (
            <div className="px-price">
                <span className="px-price__free">Free</span>
                <span className="px-price__sub">forever</span>
            </div>
        );
    }
    return (
        <div className="px-price">
            <sup className="px-price__cur">$</sup>
            <span className="px-price__num">{price}</span>
            <span className="px-price__sub">/ member / mo</span>
        </div>
    );
}

function PlanCard({ plan, isYearly, index, visible }) {
    return (
        <article
            className={`px-card${plan.highlighted ? " px-card--hi" : ""}${visible ? " px-card--visible" : ""}`}
            style={{ "--delay": `${index * 0.09}s`, "--accent": plan.accent }}
            aria-labelledby={`px-plan-${plan.id}`}
        >
            {plan.highlighted && <div className="px-card__glow" aria-hidden="true" />}
            <header className="px-card__head">
                <div className="px-card__name-row">
                    <h2 id={`px-plan-${plan.id}`} className="px-card__name">{plan.name}</h2>
                    <span
                        className="px-card__tag"
                        style={{
                            color: plan.highlighted ? "#fff" : plan.accent,
                            background: plan.highlighted ? "rgba(255,255,255,.15)" : `${plan.accent}18`,
                            borderColor: plan.highlighted ? "rgba(255,255,255,.25)" : `${plan.accent}30`,
                        }}
                    >
                        {plan.tagline}
                    </span>
                </div>
                <p className="px-card__desc">{plan.description}</p>
            </header>
            <PriceDisplay plan={plan} isYearly={isYearly} />
            {isYearly && plan.monthlyPrice > 0 && plan.yearlyPrice !== null && (
                <p className="px-card__saving">
                    ↓ ${(plan.monthlyPrice - plan.yearlyPrice) * 12} saved per member / yr
                </p>
            )}
            <Link
                to={plan.ctaTo}
                className={`px-card__cta${plan.highlighted ? " px-card__cta--solid" : " px-card__cta--outline"}`}
            >
                {plan.ctaLabel}
                <span className="px-card__cta-arrow" aria-hidden="true">→</span>
            </Link>
            {plan.id !== "enterprise" && (
                <p className="px-card__trial">
                    {plan.id === "starter" ? "No credit card needed" : "14-day free trial · No card required"}
                </p>
            )}
        </article>
    );
}

function CellValue({ val, accent }) {
    if (val === true) {
        return (
            <span className="px-cell__check" style={{ color: accent ?? "#4CAF88" }} aria-label="Included">
                <svg width="14" height="11" viewBox="0 0 14 11" fill="none" aria-hidden="true">
                    <path d="M1 5.5L5 9.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>
        );
    }
    if (val === false) {
        return (
            <span className="px-cell__cross" aria-label="Not included">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            </span>
        );
    }
    return <span className="px-cell__text">{val}</span>;
}

function ComparisonTable({ isYearly }) {
    const [ref, visible] = useInView(0.05);

    return (
        <section
            className={`px-table-section${visible ? " px-table-section--visible" : ""}`}
            ref={ref}
            aria-label="Full feature comparison"
        >
            <div className="px-table-section__inner">
                <header className="px-table-header">
                    <SectionLabel>Full comparison</SectionLabel>
                    <h2 className="px-table-headline">
                        Everything, <em>side by side</em>
                    </h2>
                </header>

                <div className="px-table-wrap" role="region" aria-label="Feature comparison table" tabIndex="0">
                    <table className="px-table">
                        <thead>
                            <tr>
                                <th className="px-th px-th--feature" scope="col">Feature</th>
                                {PLANS.map(p => (
                                    <th key={p.id} className={`px-th${p.highlighted ? " px-th--hi" : ""}`} scope="col">
                                        <span className="px-th__name">{p.name}</span>
                                        <PriceDisplay plan={p} isYearly={isYearly} />
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {FEATURE_GROUPS.map(({ group, rows }) => (
                                <>
                                    <tr key={group} className="px-tr-group">
                                        <td colSpan={5} className="px-td-group">{group}</td>
                                    </tr>
                                    {rows.map(({ feature, values }) => (
                                        <tr key={feature} className="px-tr">
                                            <td className="px-td px-td--label">{feature}</td>
                                            {values.map((val, i) => (
                                                <td
                                                    key={i}
                                                    className={`px-td${PLANS[i].highlighted ? " px-td--hi" : ""}`}
                                                >
                                                    <CellValue val={val} accent={PLANS[i].accent} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

function TestimonialCard({ t, index, visible }) {
    return (
        <figure
            className={`px-testi${visible ? " px-testi--visible" : ""}`}
            style={{ "--delay": `${index * 0.1}s` }}
        >
            <blockquote className="px-testi__quote">
                <span className="px-testi__mark" aria-hidden="true">"</span>
                {t.quote}
            </blockquote>
            <figcaption className="px-testi__cap">
                <span className="px-testi__avatar" style={{ background: t.avatar }} aria-hidden="true">
                    {t.initials}
                </span>
                <div className="px-testi__meta">
                    <span className="px-testi__name">{t.name}</span>
                    <span className="px-testi__role">{t.role}</span>
                </div>
            </figcaption>
        </figure>
    );
}

function FaqItem({ faq, index }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`px-faq${open ? " px-faq--open" : ""}`}>
            <button
                className="px-faq__btn"
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                aria-controls={`px-faq-body-${index}`}
                type="button"
            >
                <span className="px-faq__q">{faq.q}</span>
                <span className="px-faq__icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </button>
            <div id={`px-faq-body-${index}`} className="px-faq__body" aria-hidden={!open}>
                <p className="px-faq__a">{faq.a}</p>
            </div>
        </div>
    );
}

function CardsSection({ isYearly }) {
    const [ref, visible] = useInView(0.05);
    return (
        <div className="px-cards-wrap">
            <div className="px-cards" ref={ref} role="list" aria-label="Pricing plans">
                {PLANS.map((plan, i) => (
                    <PlanCard key={plan.id} plan={plan} isYearly={isYearly} index={i} visible={visible} />
                ))}
            </div>
        </div>
    );
}

function TestimonialsSection() {
    const [ref, visible] = useInView(0.1);
    return (
        <section className="px-testis-section" aria-labelledby="px-testis-heading">
            <div className="px-testis-section__inner">
                <header className="px-testis-header">
                    <SectionLabel>What teams say</SectionLabel>
                    <h2 id="px-testis-heading" className="px-testis-headline">
                        Teams that made the <em>switch</em>
                    </h2>
                </header>
                <div className="px-testis-grid" ref={ref}>
                    {TESTIMONIALS.map((t, i) => (
                        <TestimonialCard key={t.name} t={t} index={i} visible={visible} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FaqSection() {
    return (
        <section className="px-faq-section" aria-labelledby="px-faq-heading">
            <div className="px-faq-section__inner">
                <header className="px-faq-header">
                    <SectionLabel>FAQ</SectionLabel>
                    <h2 id="px-faq-heading" className="px-faq-headline">
                        Before you <em>decide</em>
                    </h2>
                </header>
                {FAQS.map((faq, i) => (
                    <FaqItem key={i} faq={faq} index={i} />
                ))}
            </div>
        </section>
    );
}
export default function Pricing() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <>
            
            <main className="px" aria-label="FlowBoard pricing">
                <div className="px-hero">
                    <div className="px-hero__inner">
                        <SectionLabel light>Pricing</SectionLabel>
                        <h1 className="px-hero__headline">
                            Pick the plan that<br />
                            <em>fits your team</em>
                        </h1>
                        <p className="px-hero__sub">
                            Every plan includes a 14-day trial on paid tiers.
                            No credit card. No surprises.
                        </p>
                        <BillingToggle isYearly={isYearly} onToggle={() => setIsYearly(y => !y)} />
                    </div>
                </div>
                <CardsSection isYearly={isYearly} />
                <ComparisonTable isYearly={isYearly} />
                <TestimonialsSection />
                <FaqSection />
                <div className="px-closing">
                    <div className="px-closing__inner">
                        <SectionLabel light>Ready?</SectionLabel>
                        <h2 className="px-closing__headline">
                            Start free,<br />
                            <em>upgrade when ready</em>
                        </h2>
                        <p className="px-closing__sub">
                            Starter is free forever. Pro and Business include a 14-day
                            full-access trial with no card required.
                        </p>
                        <nav className="px-closing__actions" aria-label="Get started actions">
                            <Link to="/register" className="px-closing__btn px-closing__btn--primary">
                                Get started free
                                <span className="px-closing__btn-arrow" aria-hidden="true">→</span>
                            </Link>
                            <Link to="/contact" className="px-closing__btn px-closing__btn--ghost">
                                Talk to sales
                            </Link>
                        </nav>
                        <p className="px-closing__fine">No credit card · Cancel anytime · SOC 2 certified</p>
                    </div>
                </div>
            </main>
        </>
    );
}