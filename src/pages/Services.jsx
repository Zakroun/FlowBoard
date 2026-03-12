import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/Services.css';
const PLANS = [
    {
        id: "starter",
        name: "Starter",
        badge: null,
        monthlyPrice: 0,
        yearlyPrice: 0,
        description: "For individuals and small teams getting off the ground.",
        accent: "#4CAF88",
        cta: "Get started free",
        ctaTo: "/register",
        ghost: false,
        features: [
            { text: "Up to 3 projects", included: true },
            { text: "5 team members", included: true },
            { text: "Kanban & list views", included: true },
            { text: "2 GB file storage", included: true },
            { text: "Basic analytics", included: true },
            { text: "Custom workflows", included: false },
            { text: "Priority support", included: false },
            { text: "SSO & advanced security", included: false },
            { text: "Audit logs", included: false },
        ],
    },
    {
        id: "pro",
        name: "Pro",
        badge: "Most popular",
        monthlyPrice: 14,
        yearlyPrice: 10,
        description: "For growing teams that need more power and flexibility.",
        accent: "#003934",
        cta: "Start free trial",
        ctaTo: "/register?plan=pro",
        ghost: false,
        features: [
            { text: "Unlimited projects", included: true },
            { text: "Unlimited members", included: true },
            { text: "All views incl. Timeline", included: true },
            { text: "50 GB file storage", included: true },
            { text: "Advanced analytics", included: true },
            { text: "Custom workflows", included: true },
            { text: "Priority support", included: true },
            { text: "SSO & advanced security", included: false },
            { text: "Audit logs", included: false },
        ],
    },
    {
        id: "enterprise",
        name: "Enterprise",
        badge: null,
        monthlyPrice: null,
        yearlyPrice: null,
        description: "For organisations that need security, control, and scale.",
        accent: "#38bdf8",
        cta: "Talk to sales",
        ctaTo: "/contact?topic=Enterprise+%2F+Sales",
        ghost: true,
        features: [
            { text: "Everything in Pro", included: true },
            { text: "Unlimited storage", included: true },
            { text: "Dedicated success manager", included: true },
            { text: "Custom onboarding", included: true },
            { text: "SLA & uptime guarantee", included: true },
            { text: "SSO & advanced security", included: true },
            { text: "Audit logs", included: true },
            { text: "Custom contracts & invoicing", included: true },
        ],
    },
];

const ADDONS = [
    {
        id: "ai",
        name: "FlowBoard AI",
        price: 6,
        unit: "member / mo",
        description: "Summarise threads, auto-generate tasks from meeting notes, and surface blockers before they happen.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 0 6h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1 0-6h1V6a4 4 0 0 1 4-4z" />
                <path d="M9 12h6M12 9v6" />
            </svg>
        ),
        color: "#a78bfa",
    },
    {
        id: "analytics",
        name: "Advanced Analytics",
        price: 4,
        unit: "member / mo",
        description: "Burndown charts, sprint velocity reports, cycle time analysis, and exportable dashboards.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
            </svg>
        ),
        color: "#f59e0b",
    },
    {
        id: "storage",
        name: "Storage Expansion",
        price: 2,
        unit: "100 GB / mo",
        description: "Add storage in 100 GB increments. Files, attachments, and assets — all in one place.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
            </svg>
        ),
        color: "#38bdf8",
    },
    {
        id: "guests",
        name: "Guest Access",
        price: 0,
        unit: "free on Pro+",
        description: "Invite clients, contractors, and stakeholders with read-only or limited edit permissions.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        color: "#4CAF88",
    },
];

const FAQS = [
    {
        q: "Can I change plans at any time?",
        a: "Yes. You can upgrade, downgrade, or cancel at any time. Upgrades take effect immediately. Downgrades apply at the end of your billing period.",
    },
    {
        q: "Is there a free trial on Pro?",
        a: "Pro comes with a 14-day free trial — no credit card required. You'll only be charged after the trial ends if you choose to continue.",
    },
    {
        q: "How does per-member pricing work?",
        a: "You're billed for each active member on your workspace. Guests and deactivated accounts are never counted.",
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards via Stripe. Enterprise customers can also pay by invoice on net-30 or net-60 terms.",
    },
    {
        q: "Do you offer discounts for nonprofits or education?",
        a: "Yes — we offer 50% off Pro for verified nonprofits and educational institutions. Reach out to our team to apply.",
    },
    {
        q: "What happens to my data if I cancel?",
        a: "Your data is yours. You have 30 days after cancellation to export everything. After that, it's permanently deleted from our servers.",
    },
];

const LOGOS = ["Acme Co.", "Meridian", "Northlake", "Solaris", "Brightwave", "Vanta"];
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
function SectionLabel({ children, light }) {
    return (
        <span className={`svc-label${light ? " svc-label--light" : ""}`}>
            <span className="svc-label__dot" aria-hidden="true" />
            {children}
        </span>
    );
}

function CheckIcon({ included, accent }) {
    return included ? (
        <span className="svc-feat__icon svc-feat__icon--yes" style={{ background: `${accent}18`, color: accent }} aria-label="Included">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
    ) : (
        <span className="svc-feat__icon svc-feat__icon--no" aria-label="Not included">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        </span>
    );
}

function PlanCard({ plan, isYearly, index, visible }) {
    const isPro = plan.id === "pro";
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

    return (
        <article
            className={`svc-plan${isPro ? " svc-plan--featured" : ""}${visible ? " svc-plan--visible" : ""}`}
            style={{ "--delay": `${index * 0.1}s`, "--accent": plan.accent }}
            aria-labelledby={`plan-${plan.id}`}
        >
            {isPro && (
                <div className="svc-plan__glow" aria-hidden="true" />
            )}
            {plan.badge && (
                <div className="svc-plan__badge" style={{ background: plan.accent }}>
                    {plan.badge}
                </div>
            )}
            <header className="svc-plan__header">
                <h3 id={`plan-${plan.id}`} className="svc-plan__name">{plan.name}</h3>
                <p className="svc-plan__desc">{plan.description}</p>
            </header>
            <div className="svc-plan__price" aria-label={
                price === null ? "Custom pricing" :
                    price === 0 ? "Free" :
                        `$${price} per member per month`
            }>
                {price === null ? (
                    <span className="svc-plan__custom">Custom</span>
                ) : (
                    <>
                        <span className="svc-plan__currency">$</span>
                        <span className="svc-plan__amount">{price}</span>
                        {price > 0 && <span className="svc-plan__unit">/ member / mo</span>}
                        {price === 0 && <span className="svc-plan__unit">forever free</span>}
                    </>
                )}
            </div>
            {isYearly && plan.monthlyPrice > 0 && plan.yearlyPrice !== null && (
                <p className="svc-plan__saving">
                    Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/yr per member
                </p>
            )}
            <Link
                to={plan.ctaTo}
                className={`svc-plan__cta${isPro ? " svc-plan__cta--primary" : " svc-plan__cta--ghost"}`}
            >
                {plan.cta}
                <span className="svc-plan__cta-arrow" aria-hidden="true">→</span>
            </Link>
            <ul className="svc-plan__features" role="list" aria-label={`${plan.name} features`}>
                {plan.features.map(({ text, included }) => (
                    <li key={text} className={`svc-feat${!included ? " svc-feat--dim" : ""}`}>
                        <CheckIcon included={included} accent={plan.accent} />
                        <span className="svc-feat__text">{text}</span>
                    </li>
                ))}
            </ul>
        </article>
    );
}

function AddonCard({ addon, index, visible }) {
    return (
        <article
            className={`svc-addon${visible ? " svc-addon--visible" : ""}`}
            style={{ "--delay": `${index * 0.08}s` }}
            aria-labelledby={`addon-${addon.id}`}
        >
            <div className="svc-addon__icon" style={{ background: `${addon.color}15`, color: addon.color }}>
                {addon.icon}
            </div>
            <div className="svc-addon__body">
                <div className="svc-addon__top">
                    <h3 id={`addon-${addon.id}`} className="svc-addon__name">{addon.name}</h3>
                    <div className="svc-addon__price">
                        {addon.price === 0 ? (
                            <span className="svc-addon__free">{addon.unit}</span>
                        ) : (
                            <>
                                <span className="svc-addon__amount">${addon.price}</span>
                                <span className="svc-addon__unit">{addon.unit}</span>
                            </>
                        )}
                    </div>
                </div>
                <p className="svc-addon__desc">{addon.description}</p>
            </div>
        </article>
    );
}

function FaqItem({ faq, index }) {
    const [open, setOpen] = useState(false);
    const bodyId = `faq-body-${index}`;

    return (
        <div className={`svc-faq-item${open ? " svc-faq-item--open" : ""}`}>
            <button
                className="svc-faq-btn"
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                aria-controls={bodyId}
                type="button"
            >
                <span className="svc-faq-btn__q">{faq.q}</span>
                <span className="svc-faq-btn__icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </button>
            <div id={bodyId} className="svc-faq-body" role="region" aria-hidden={!open}>
                <p className="svc-faq-body__text">{faq.a}</p>
            </div>
        </div>
    );
}
function HeroSection({ isYearly, onToggle }) {
    return (
        <div className="svc-hero">
            <div className="svc-hero__inner">
                <SectionLabel light>Pricing</SectionLabel>

                <h1 className="svc-hero__headline">
                    Simple pricing,<br />
                    <em>no surprises</em>
                </h1>

                <p className="svc-hero__sub">
                    Start free. Upgrade when your team needs more. Cancel anytime,
                    no questions asked.
                </p>

                {/* Billing toggle */}
                <div className="svc-toggle" role="group" aria-label="Billing period">
                    <span className={`svc-toggle__label${!isYearly ? " svc-toggle__label--active" : ""}`}>
                        Monthly
                    </span>
                    <button
                        className={`svc-toggle__track${isYearly ? " svc-toggle__track--on" : ""}`}
                        onClick={onToggle}
                        role="switch"
                        aria-checked={isYearly}
                        aria-label="Toggle yearly billing"
                        type="button"
                    >
                        <span className="svc-toggle__thumb" />
                    </button>
                    <span className={`svc-toggle__label${isYearly ? " svc-toggle__label--active" : ""}`}>
                        Yearly
                    </span>
                    <span className="svc-toggle__save">Save 28%</span>
                </div>
            </div>
        </div>
    );
}

function LogoBand() {
    return (
        <div className="svc-logos" aria-label="Trusted by">
            <div className="svc-logos__inner">
                <span className="svc-logos__eyebrow">Trusted by teams at</span>
                <ul className="svc-logos__list" role="list">
                    {LOGOS.map(name => (
                        <li key={name} className="svc-logos__item" aria-label={name}>{name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function PlansSection({ isYearly }) {
    const [ref, visible] = useInView(0.1);
    return (
        <section className="svc-plans-section" aria-labelledby="svc-plans-heading">
            <div className="svc-plans-section__inner">
                <div className="svc-plans-grid" ref={ref} role="list">
                    {PLANS.map((plan, i) => (
                        <PlanCard key={plan.id} plan={plan} isYearly={isYearly} index={i} visible={visible} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function AddonsSection() {
    const [ref, visible] = useInView(0.1);
    return (
        <section className="svc-addons-section" aria-labelledby="svc-addons-heading">
            <div className="svc-addons-section__inner">
                <header className="svc-addons-header">
                    <SectionLabel>Add-ons</SectionLabel>
                    <h2 id="svc-addons-heading" className="svc-addons-headline">
                        Power up with <em>optional extras</em>
                    </h2>
                    <p className="svc-addons-sub">
                        Add only what your team needs. All add-ons are billed monthly
                        and can be removed at any time.
                    </p>
                </header>
                <div className="svc-addons-grid" ref={ref}>
                    {ADDONS.map((addon, i) => (
                        <AddonCard key={addon.id} addon={addon} index={i} visible={visible} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FaqSection() {
    return (
        <section className="svc-faq-section" aria-labelledby="svc-faq-heading">
            <div className="svc-faq-section__inner">
                <header className="svc-faq-header">
                    <SectionLabel>FAQ</SectionLabel>
                    <h2 id="svc-faq-heading" className="svc-faq-headline">
                        Questions, <em>answered</em>
                    </h2>
                </header>
                <div>
                    {FAQS.map((faq, i) => (
                        <FaqItem key={i} faq={faq} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ClosingSection() {
    return (
        <div className="svc-closing">
            <div className="svc-closing__inner">
                <SectionLabel light>Get started</SectionLabel>
                <h2 className="svc-closing__headline">
                    Your first sprint is<br />
                    <em>on us</em>
                </h2>
                <p className="svc-closing__sub">
                    14-day Pro trial. No credit card. Full access from day one.
                </p>
                <nav className="svc-closing__actions" aria-label="Signup actions">
                    <Link to="/register" className="svc-closing__btn svc-closing__btn--primary">
                        Start free trial
                        <span className="svc-closing__btn-arrow" aria-hidden="true">→</span>
                    </Link>
                    <Link to="/contact" className="svc-closing__btn svc-closing__btn--ghost">
                        Talk to sales
                    </Link>
                </nav>
                <p className="svc-closing__fine">No credit card required · Cancel anytime</p>
            </div>
        </div>
    );
}
export default function Services() {
    const [isYearly, setIsYearly] = useState(false);
    return (
        <>
            
            <main className="svc" aria-label="FlowBoard pricing and services">
                <HeroSection isYearly={isYearly} onToggle={() => setIsYearly(y => !y)} />
                <LogoBand />
                <PlansSection isYearly={isYearly} />
                <AddonsSection />
                <FaqSection />
                <ClosingSection />
            </main>
        </>
    );
}