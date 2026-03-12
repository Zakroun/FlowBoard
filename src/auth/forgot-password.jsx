import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/ForgotPassword.css';
const STEPS = {
    idle: "idle",
    loading: "loading",
    sent: "sent",
    error: "error",
};
const TIPS = [
    "Check your spam or junk folder if the email doesn't arrive within a minute.",
    "The reset link expires after 60 minutes for your security.",
    "If you signed up with Google or GitHub, use those buttons on the login page instead.",
    "Need help? Our support team responds in under 4 hours.",
];
function useEmailForm() {
    const [email, setEmail] = useState("");
    const [touched, setTouched] = useState(false);
    const [error, setError] = useState("");
    const validate = (val) => {
        if (!val.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email address";
        return "";
    };
    const handleChange = (val) => {
        setEmail(val);
        if (touched) setError(validate(val));
    };
    const handleBlur = () => {
        setTouched(true);
        setError(validate(email));
    };
    const handleSubmit = () => {
        setTouched(true);
        const e = validate(email);
        setError(e);
        return !e;
    };
    return { email, error, touched, handleChange, handleBlur, handleSubmit };
}

function Logo() {
    return (
        <Link to="/" className="fp-logo" aria-label="FlowBoard — home">
            <span className="fp-logo__mark" aria-hidden="true">
                <span className="fp-logo__sq" />
                <span className="fp-logo__sq fp-logo__sq--accent" />
            </span>
            FlowBoard
        </Link>
    );
}

function EnvelopeIllustration({ state }) {
    const isSent = state === STEPS.sent;
    return (
        <div className={`fp-illus${isSent ? " fp-illus--sent" : ""}`} aria-hidden="true">
            <div className="fp-illus__orb" />
            <div className="fp-illus__envelope">
                <svg className="fp-illus__svg" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="92" height="68" rx="7" fill="white" stroke="#e2e8f0" strokeWidth="2" />
                    <path
                        d="M2 9L48 42L94 9"
                        stroke={isSent ? "#4CAF88" : "#cbd5e1"}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={isSent ? "fp-illus__flap--sent" : ""}
                    />
                    <rect x="18" y="50" width="32" height="4" rx="2" fill={isSent ? "rgba(76,175,136,.25)" : "#f1f5f9"} />
                    <rect x="18" y="58" width="20" height="4" rx="2" fill={isSent ? "rgba(76,175,136,.15)" : "#f1f5f9"} />
                </svg>
                {isSent && (
                    <span className="fp-illus__badge">
                        <svg width="16" height="13" viewBox="0 0 16 13" fill="none">
                            <path d="M1.5 6.5L5.5 10.5L14.5 1.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                )}
                {state === STEPS.loading && (
                    <div className="fp-illus__dots">
                        <span className="fp-illus__dot" style={{ "--d": "0s" }} />
                        <span className="fp-illus__dot" style={{ "--d": ".18s" }} />
                        <span className="fp-illus__dot" style={{ "--d": ".36s" }} />
                    </div>
                )}
            </div>
        </div>
    );
}

function TipList() {
    const [ref, setRef] = useState(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!ref) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.1 }
        );
        obs.observe(ref);
        return () => obs.disconnect();
    }, [ref]);
    return (
        <ul
            ref={setRef}
            className={`fp-tips${visible ? " fp-tips--visible" : ""}`}
            role="list"
            aria-label="Helpful tips"
        >
            {TIPS.map((tip, i) => (
                <li
                    key={i}
                    className="fp-tip"
                    style={{ "--d": `${i * 0.07}s` }}
                >
                    <span className="fp-tip__icon" aria-hidden="true">
                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                            <circle cx="4.5" cy="4.5" r="4" stroke="currentColor" strokeWidth="1.4" />
                            <rect x="4" y="2" width="1" height="3.5" rx=".5" fill="currentColor" />
                            <rect x="4" y="6.5" width="1" height="1" rx=".5" fill="currentColor" />
                        </svg>
                    </span>
                    <span>{tip}</span>
                </li>
            ))}
        </ul>
    );
}

function IdleForm({ form, onSubmit }) {
    const { email, error, touched, handleChange, handleBlur } = form;
    const hasError = touched && error;
    const isOk = touched && !error && email;
    const inputRef = useRef(null);
    useEffect(() => { inputRef.current?.focus(); }, []);
    return (
        <div className="fp-idle" role="form" aria-label="Password reset request">
            <div className="fp-field">
                <label className="fp-label" htmlFor="fp-email">
                    Work email
                </label>
                <input
                    ref={inputRef}
                    id="fp-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="alex@company.com"
                    value={email}
                    onChange={e => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={e => { if (e.key === "Enter") onSubmit(); }}
                    className={`fp-input${hasError ? " fp-input--error" : ""}${isOk ? " fp-input--ok" : ""}`}
                    aria-invalid={hasError ? "true" : undefined}
                    aria-describedby={hasError ? "fp-email-err" : "fp-email-hint"}
                />
                {hasError ? (
                    <span id="fp-email-err" className="fp-field__error" role="alert">
                        {error}
                    </span>
                ) : (
                    <span id="fp-email-hint" className="fp-field__hint">
                        We'll send a reset link to this address.
                    </span>
                )}
            </div>
            <button
                type="button"
                className="fp-btn fp-btn--primary"
                onClick={onSubmit}
            >
                Send reset link
                <span className="fp-btn__arrow" aria-hidden="true">→</span>
            </button>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="fp-loading" role="status" aria-live="polite" aria-label="Sending reset link">
            <div className="fp-loading__bar">
                <div className="fp-loading__fill" />
            </div>
            <p className="fp-loading__label">Sending your reset link…</p>
        </div>
    );
}

function SentState({ email, onTryAnother }) {
    return (
        <div className="fp-sent" role="status" aria-live="polite">
            <div className="fp-sent__pill">
                <span className="fp-sent__dot" aria-hidden="true" />
                Email sent
            </div>
            <p className="fp-sent__copy">
                We sent a reset link to{" "}
                <strong className="fp-sent__email">{email}</strong>.
                Check your inbox — it should arrive within a minute.
            </p>
            <div className="fp-sent__actions">
                <a
                    href={`https://mail.google.com/mail/u/0/#search/from%3Aflowboard+reset`}
                    className="fp-btn fp-btn--primary"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open Gmail
                    <span className="fp-btn__ext" aria-label="opens in new tab" aria-hidden="true">↗</span>
                </a>
                <button
                    type="button"
                    className="fp-btn fp-btn--ghost"
                    onClick={onTryAnother}
                >
                    Try a different email
                </button>
            </div>
            <TipList />
        </div >
    );
}

function ErrorState({ onRetry }) {
    return (
        <div className="fp-error-state" role="alert">
            <div className="fp-error-state__icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </div>
            <p className="fp-error-state__msg">
                Something went wrong sending the email. Please check your connection and try again.
            </p>
            <button type="button" className="fp-btn fp-btn--primary" onClick={onRetry}>
                Try again
                <span className="fp-btn__arrow" aria-hidden="true">→</span>
            </button>
        </div>
    );
}
export default function ForgotPassword() {
    const [step, setStep] = useState(STEPS.idle);
    const form = useEmailForm();

    const handleSubmit = async () => {
        if (!form.handleSubmit()) return;
        setStep(STEPS.loading);
        try {
            await new Promise((res, rej) =>
                setTimeout(() => Math.random() > 0.1 ? res() : rej(), 1600)
            );
            setStep(STEPS.sent);
        } catch {
            setStep(STEPS.error);
        }
    };

    const handleTryAnother = () => {
        form.handleSubmit(); // reset touched
        setStep(STEPS.idle);
    };

    const headlines = {
        [STEPS.idle]: { kicker: "Account recovery", text: <>Reset your <em>password</em></> },
        [STEPS.loading]: { kicker: "Sending…", text: <>Just a <em>moment</em></> },
        [STEPS.sent]: { kicker: "Check your inbox", text: <>Email <em>on its way</em></> },
        [STEPS.error]: { kicker: "Something's wrong", text: <>Let's try <em>again</em></> },
    };

    const { kicker, text } = headlines[step];

    return (
        <>
            
            <div className="fp">
                <div className="fp__grid" aria-hidden="true" />
                <nav className="fp-nav" aria-label="Page navigation">
                    <Link to="/login" className="fp-nav__back">
                        <span className="fp-nav__back-arrow" aria-hidden="true">←</span>
                        Back to login
                    </Link>
                    <Logo />
                    <span className="fp-nav__register">
                        No account? <Link to="/register">Sign up free</Link>
                    </span>
                </nav>
                <main className="fp-main" aria-label="Forgot password">
                    <div className="fp-card" role="region" aria-live="polite" aria-label="Reset form">
                        <EnvelopeIllustration state={step} />
                        <header className="fp-card-header">
                            <span className="fp-kicker">
                                <span className="fp-kicker__dot" aria-hidden="true" />
                                {kicker}
                            </span>
                            <h1 className="fp-headline">{text}</h1>
                            {step === STEPS.idle && (
                                <p className="fp-sub">
                                    Enter the email address on your account and we'll send
                                    you a link to reset your password.
                                </p>
                            )}
                        </header>
                        {step === STEPS.idle && <IdleForm form={form} onSubmit={handleSubmit} />}
                        {step === STEPS.loading && <LoadingState />}
                        {step === STEPS.sent && <SentState email={form.email} onTryAnother={handleTryAnother} />}
                        {step === STEPS.error && <ErrorState onRetry={handleSubmit} />}

                    </div>
                </main>
                <footer className="fp-footer">
                    {[
                        { label: "Help Centre", to: "/help" },
                        { label: "Privacy Policy", to: "/privacy" },
                        { label: "Terms", to: "/terms" },
                        { label: "Status", to: "/status" },
                        { label: "Contact us", to: "/contact" },
                    ].map(({ label, to }, i, arr) => (
                        <>
                            <Link key={to} to={to} className="fp-footer__link">{label}</Link>
                            {i < arr.length - 1 && <span key={`sep-${i}`} className="fp-footer__sep" aria-hidden="true" />}
                        </>
                    ))}
                </footer>
            </div>
        </>
    );
}