import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import '../styles/Contact.css';
const CONTACT_CHANNELS = [
    {
        id: "support",
        label: "Support",
        heading: "Got a problem?",
        detail: "Our support team responds within 4 hours on weekdays.",
        badge: "< 4h response",
        badgeColor: "#4CAF88",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    {
        id: "sales",
        label: "Sales",
        heading: "Exploring FlowBoard for your org?",
        detail: "Talk to our team about enterprise plans, SSO, and custom contracts.",
        badge: "Same-day reply",
        badgeColor: "#38bdf8",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
            </svg>
        ),
    },
    {
        id: "press",
        label: "Press",
        heading: "Writing about FlowBoard?",
        detail: "Reach our comms team for press kits, interviews, and media assets.",
        badge: "press@flowboard.io",
        badgeColor: "#a78bfa",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" />
            </svg>
        ),
    },
];

const TOPICS = [
    "General question",
    "Bug report",
    "Feature request",
    "Billing & plans",
    "Enterprise / Sales",
    "Other",
];

const FIELD_META = [
    { id: "name", label: "Full name", type: "text", placeholder: "Alex Kim", half: true },
    { id: "email", label: "Work email", type: "email", placeholder: "alex@company.com", half: true },
    { id: "company", label: "Company", type: "text", placeholder: "Acme Inc. (optional)", half: true },
    { id: "topic", label: "Topic", type: "select", placeholder: "", half: true },
    { id: "message", label: "Your message", type: "textarea", placeholder: "Tell us what's on your mind…", half: false },
];
function useForm(initial) {
    const [values, setValues] = useState(initial);
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});

    const validate = (vals) => {
        const e = {};
        if (!vals.name?.trim()) e.name = "Name is required";
        if (!vals.email?.trim()) e.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)) e.email = "Enter a valid email";
        if (!vals.topic) e.topic = "Please pick a topic";
        if (!vals.message?.trim()) e.message = "Message can't be empty";
        else if (vals.message.trim().length < 20) e.message = "Please give us a bit more detail";
        return e;
    };

    const handleChange = (id, value) => {
        const next = { ...values, [id]: value };
        setValues(next);
        if (touched[id]) setErrors(validate(next));
    };

    const handleBlur = (id) => {
        const nextTouched = { ...touched, [id]: true };
        setTouched(nextTouched);
        setErrors(validate(values));
    };

    const handleSubmit = () => {
        const allTouched = Object.fromEntries(FIELD_META.map(f => [f.id, true]));
        setTouched(allTouched);
        const e = validate(values);
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const reset = () => { setValues(initial); setTouched({}); setErrors({}); };

    return { values, errors, touched, handleChange, handleBlur, handleSubmit, reset };
}
function SectionLabel({ children, light }) {
    return (
        <span className={`cnt-label${light ? " cnt-label--light" : ""}`}>
            <span className="cnt-label__dot" aria-hidden="true" />
            {children}
        </span>
    );
}

function ChannelCard({ channel, active, onClick }) {
    return (
        <button
            className={`cnt-channel${active ? " cnt-channel--active" : ""}`}
            onClick={() => onClick(channel.id)}
            aria-pressed={active}
            type="button"
        >
            <span
                className="cnt-channel__icon"
                style={{ color: active ? channel.badgeColor : undefined }}
            >
                {channel.icon}
            </span>
            <div className="cnt-channel__body">
                <span className="cnt-channel__label">{channel.label}</span>
                <span className="cnt-channel__heading">{channel.heading}</span>
                <span className="cnt-channel__detail">{channel.detail}</span>
                <span
                    className="cnt-channel__badge"
                    style={{ color: channel.badgeColor, background: `${channel.badgeColor}18`, borderColor: `${channel.badgeColor}30` }}
                >
                    {channel.badge}
                </span>
            </div>
            <span className="cnt-channel__arrow" aria-hidden="true">→</span>
        </button>
    );
}

function FormField({ meta, value, error, touched, onChange, onBlur }) {
    const hasError = touched && error;
    const isOk = touched && !error && value;

    const sharedProps = {
        id: meta.id,
        name: meta.id,
        value,
        "aria-invalid": hasError ? "true" : undefined,
        "aria-describedby": hasError ? `${meta.id}-err` : undefined,
        onChange: (e) => onChange(meta.id, e.target.value),
        onBlur: () => onBlur(meta.id),
        placeholder: meta.placeholder,
        className: `cnt-input${hasError ? " cnt-input--error" : ""}${isOk ? " cnt-input--ok" : ""}`,
    };

    return (
        <div className={`cnt-field${meta.half ? " cnt-field--half" : ""}`}>
            <label className="cnt-field__label" htmlFor={meta.id}>
                {meta.label}
                {(meta.id === "name" || meta.id === "email" || meta.id === "topic" || meta.id === "message") && (
                    <span className="cnt-field__req" aria-label="required">*</span>
                )}
            </label>

            {meta.type === "textarea" ? (
                <textarea rows={5} {...sharedProps} />
            ) : meta.type === "select" ? (
                <select {...sharedProps}>
                    <option value="">Select a topic…</option>
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            ) : (
                <input type={meta.type} {...sharedProps} />
            )}

            {hasError && (
                <span id={`${meta.id}-err`} className="cnt-field__error" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}

function SuccessState({ onReset }) {
    return (
        <div className="cnt-success" role="status" aria-live="polite">
            <div className="cnt-success__icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
            <h3 className="cnt-success__heading">Message sent</h3>
            <p className="cnt-success__body">
                We've received your message and will get back to you shortly.
                Keep an eye on your inbox.
            </p>
            <button className="cnt-success__reset" onClick={onReset} type="button">
                Send another message
            </button>
        </div>
    );
}

export default function Contact() {
    const [activeChannel, setActiveChannel] = useState("support");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);

    const channel = CONTACT_CHANNELS.find(c => c.id === activeChannel);

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, reset } = useForm({
        name: "", email: "", company: "", topic: "", message: "",
    });

    const onSubmit = async () => {
        if (!handleSubmit()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);
        setSubmitted(true);
    };

    const onReset = () => { reset(); setSubmitted(false); };

    const onChannelClick = (id) => {
        setActiveChannel(id);
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <main className="cnt" aria-label="Contact FlowBoard">
                <div className="cnt-hero">
                    <div className="cnt-hero__inner">
                        <SectionLabel light>Get in touch</SectionLabel>
                        <h1 className="cnt-hero__headline">
                            We're <em>real people</em><br />who actually reply
                        </h1>
                        <p className="cnt-hero__sub">
                            Whether you're stuck, curious, or ready to go enterprise —
                            pick a channel below and we'll get back to you fast.
                        </p>
                    </div>
                </div>
                <div className="cnt-channels-wrap">
                    <div className="cnt-channels" role="group" aria-label="Contact channels">
                        {CONTACT_CHANNELS.map(ch => (
                            <ChannelCard
                                key={ch.id}
                                channel={ch}
                                active={activeChannel === ch.id}
                                onClick={onChannelClick}
                            />
                        ))}
                    </div>
                </div>
                <div className="cnt-body">
                    <div className="cnt-form-panel" ref={formRef}>
                        <header className="cnt-form-header">
                            <SectionLabel>{channel.label}</SectionLabel>
                            <h2 className="cnt-form-headline">
                                {channel.heading.replace("?", "")} —<br />
                                <em>we'll get back to you.</em>
                            </h2>
                            <p className="cnt-form-sub">{channel.detail}</p>
                        </header>
                        {submitted ? (
                            <SuccessState onReset={onReset} />
                        ) : (
                            <>
                                <div
                                    className="cnt-form"
                                    role="form"
                                    aria-label="Contact form"
                                >
                                    {FIELD_META.map(meta => (
                                        <FormField
                                            key={meta.id}
                                            meta={meta}
                                            value={values[meta.id]}
                                            error={errors[meta.id]}
                                            touched={touched[meta.id]}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    ))}
                                </div>
                                <button
                                    className={`cnt-submit${loading ? " cnt-submit--loading" : ""}`}
                                    onClick={onSubmit}
                                    type="button"
                                    aria-busy={loading}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="cnt-submit__spinner" aria-hidden="true" />
                                            Sending…
                                        </>
                                    ) : (
                                        <>
                                            Send message
                                            <span className="cnt-submit__arrow" aria-hidden="true">→</span>
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                    <aside className="cnt-sidebar" aria-label="Contact information">
                        <div className="cnt-info-card">
                            <div className="cnt-info-card__header">
                                <h3 className="cnt-info-card__title">Support hours</h3>
                                <SectionLabel>Live</SectionLabel>
                            </div>
                            <div className="cnt-info-card__body">
                                {[
                                    { day: "Monday – Friday", open: true },
                                    { day: "Saturday", open: false },
                                    { day: "Sunday", open: false },
                                ].map(({ day, open }) => (
                                    <div key={day} className="cnt-avail">
                                        <span className="cnt-avail__day">{day}</span>
                                        <span className={`cnt-avail__pill cnt-avail__pill--${open ? "open" : "closed"}`}>
                                            {open ? "09:00 – 18:00 CET" : "Closed"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="cnt-info-card">
                            <div className="cnt-info-card__header">
                                <h3 className="cnt-info-card__title">Our offices</h3>
                            </div>
                            <div className="cnt-info-card__body">
                                {[
                                    { city: "Berlin (HQ)", addr: "Torstraße 140\n10119 Berlin, Germany" },
                                    { city: "San Francisco", addr: "535 Mission St, 14th Floor\nSF, CA 94105" },
                                    { city: "Singapore", addr: "1 Raffles Quay, #26-10\n048583 Singapore" },
                                ].map(({ city, addr }) => (
                                    <div key={city} className="cnt-office">
                                        <span className="cnt-office__city">{city}</span>
                                        <span className="cnt-office__addr">{addr}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="cnt-info-card">
                            <div className="cnt-info-card__header">
                                <h3 className="cnt-info-card__title">Self-service</h3>
                            </div>
                            <div className="cnt-info-card__body">
                                {[
                                    { label: "Browse documentation", to: "/docs" },
                                    { label: "Check system status", to: "/status" },
                                    { label: "Visit the help centre", to: "/help" },
                                ].map(({ label, to }) => (
                                    <Link key={to} to={to} className="cnt-doc-link">
                                        <span className="cnt-doc-link__label">{label}</span>
                                        <span className="cnt-doc-link__arrow" aria-hidden="true">→</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </>
    );
}