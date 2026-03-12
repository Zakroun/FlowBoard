import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import '../styles/ResetPassword.css';
const STEPS = {
    validating: "validating",
    invalid: "invalid",
    expired: "expired",
    idle: "idle",
    loading: "loading",
    success: "success",
};

const REQUIREMENTS = [
    { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
    { id: "upper", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { id: "number", label: "One number", test: (p) => /[0-9]/.test(p) },
    { id: "special", label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];
function useResetForm() {
    const [values, setValues] = useState({ password: "", confirm: "" });
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});

    const validate = (vals) => {
        const e = {};
        if (!vals.password)
            e.password = "Password is required";
        else if (vals.password.length < 8)
            e.password = "Use at least 8 characters";
        else if (!/[A-Z]/.test(vals.password))
            e.password = "Include at least one uppercase letter";
        else if (!/[0-9]/.test(vals.password))
            e.password = "Include at least one number";
        if (!vals.confirm)
            e.confirm = "Please confirm your password";
        else if (vals.confirm !== vals.password)
            e.confirm = "Passwords don't match";
        return e;
    };

    const handleChange = (id, value) => {
        const next = { ...values, [id]: value };
        setValues(next);
        if (touched[id]) setErrors(validate(next));
    };

    const handleBlur = (id) => {
        setTouched(t => ({ ...t, [id]: true }));
        setErrors(validate(values));
    };

    const handleSubmit = () => {
        setTouched({ password: true, confirm: true });
        const e = validate(values);
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const strength = REQUIREMENTS.filter(r => r.test(values.password)).length;

    return { values, errors, touched, handleChange, handleBlur, handleSubmit, strength };
}

function Logo() {
    return (
        <Link to="/" className="rp-logo" aria-label="FlowBoard — home">
            <span className="rp-logo__mark" aria-hidden="true">
                <span className="rp-logo__sq" />
                <span className="rp-logo__sq rp-logo__sq--accent" />
            </span>
            FlowBoard
        </Link>
    );
}

function ShieldIllustration({ step }) {
    const isSuccess = step === STEPS.success;
    const isInvalid = step === STEPS.invalid || step === STEPS.expired;
    const isLoading = step === STEPS.loading;

    return (
        <div
            className={`rp-shield${isSuccess ? " rp-shield--success" : ""}${isInvalid ? " rp-shield--invalid" : ""}`}
            aria-hidden="true"
        >
            <div className="rp-shield__orb" />
            <div className="rp-shield__icon-wrap">
                <svg className="rp-shield__svg" viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M32 3L6 14v20c0 16 11.5 28.5 26 34C45.5 62.5 58 50 58 34V14L32 3Z"
                        fill={isSuccess ? "rgba(76,175,136,.12)" : isInvalid ? "rgba(239,68,68,.08)" : "rgba(0,57,52,.06)"}
                        stroke={isSuccess ? "#4CAF88" : isInvalid ? "#ef4444" : "#003934"}
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                    {isSuccess ? (
                        <path
                            className="rp-shield__check"
                            d="M22 36l7 7 13-14"
                            stroke="#4CAF88" strokeWidth="2.8"
                            strokeLinecap="round" strokeLinejoin="round"
                        />
                    ) : isInvalid ? (
                        <path
                            d="M25 27l14 14M39 27L25 41"
                            stroke="#ef4444" strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    ) : (
                        <>
                            <rect x="23" y="32" width="18" height="14" rx="3"
                                fill={isLoading ? "rgba(0,57,52,.15)" : "rgba(0,57,52,.12)"}
                                stroke="#003934" strokeWidth="1.8"
                            />
                            <path
                                d="M26 32v-4a6 6 0 0 1 12 0v4"
                                stroke="#003934" strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                            <circle cx="32" cy="38.5" r="2" fill="#003934" />
                            <rect x="31" y="39.5" width="2" height="3" rx="1" fill="#003934" />
                        </>
                    )}
                </svg>
                {isLoading && (
                    <svg className="rp-shield__ring" viewBox="0 0 80 80" fill="none">
                        <circle cx="40" cy="40" r="36" stroke="rgba(0,57,52,.08)" strokeWidth="3" />
                        <circle
                            cx="40" cy="40" r="36"
                            stroke="#4CAF88" strokeWidth="3"
                            strokeDasharray="60 166"
                            strokeLinecap="round"
                            className="rp-shield__ring-arc"
                        />
                    </svg>
                )}
                {isSuccess && (
                    <svg className="rp-shield__burst" viewBox="0 0 80 80" fill="none">
                        <circle cx="40" cy="40" r="36" stroke="rgba(76,175,136,.3)" strokeWidth="2" className="rp-shield__burst-ring" />
                        <circle cx="40" cy="40" r="30" stroke="rgba(76,175,136,.15)" strokeWidth="1.5" className="rp-shield__burst-ring2" />
                    </svg>
                )}
            </div>
        </div>
    );
}

function StrengthMeter({ password, strength }) {
    if (!password) return null;

    const LEVEL = ["", "Weak", "Fair", "Good", "Strong"];
    const COLOR = ["#e2e8f0", "#ef4444", "#f59e0b", "#38bdf8", "#4CAF88"];

    return (
        <div className="rp-strength" aria-label={`Password strength: ${LEVEL[strength] || "none"}`}>
            <div className="rp-strength__bars" aria-hidden="true">
                {[1, 2, 3, 4].map(i => (
                    <span
                        key={i}
                        className="rp-strength__bar"
                        style={{
                            background: i <= strength ? COLOR[strength] : "#e2e8f0",
                            transform: i <= strength ? "scaleY(1)" : "scaleY(0.5)",
                        }}
                    />
                ))}
            </div>
            <span
                className="rp-strength__label"
                style={{ color: COLOR[strength] || "#94a3b8" }}
                aria-hidden="true"
            >
                {LEVEL[strength] || ""}
            </span>
        </div>
    );
}

function RequirementList({ password }) {
    if (!password) return null;
    return (
        <ul className="rp-reqs" role="list" aria-label="Password requirements">
            {REQUIREMENTS.map(({ id, label, test }) => {
                const passed = test(password);
                return (
                    <li
                        key={id}
                        className={`rp-req${passed ? " rp-req--pass" : ""}`}
                        aria-label={`${label}: ${passed ? "met" : "not met"}`}
                    >
                        <span className="rp-req__icon" aria-hidden="true">
                            {passed ? (
                                <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                                    <path d="M1 3.5L3 5.5L7 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <span className="rp-req__dot" />
                            )}
                        </span>
                        {label}
                    </li>
                );
            })}
        </ul>
    );
}

function PasswordField({ id, label, value, error, touched, showToggle, show, onToggle, onChange, onBlur, autoComplete, placeholder }) {
    const hasError = touched && error;
    const isOk = touched && !error && value;
    return (
        <div className="rp-field">
            <label className="rp-field__label" htmlFor={id}>{label}</label>
            <div className="rp-field__input-wrap">
                <input
                    id={id} name={id}
                    type={show ? "text" : "password"}
                    autoComplete={autoComplete}
                    placeholder={placeholder ?? "••••••••••••"}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    className={`rp-input${hasError ? " rp-input--error" : ""}${isOk ? " rp-input--ok" : ""}`}
                    aria-invalid={hasError ? "true" : undefined}
                    aria-describedby={hasError ? `${id}-err` : undefined}
                />
                {showToggle && (
                    <button
                        type="button" tabIndex={-1}
                        className="rp-field__eye"
                        onClick={onToggle}
                        aria-label={show ? "Hide password" : "Show password"}
                    >
                        {show ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                )}
                {isOk && !showToggle && (
                    <span className="rp-field__ok" aria-hidden="true">
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                            <path d="M1 5l3.5 3.5L11 1" stroke="#4CAF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                )}
            </div>
            {hasError && (
                <span id={`${id}-err`} className="rp-field__error" role="alert">{error}</span>
            )}
        </div>
    );
}

function ValidatingState() {
    return (
        <div className="rp-validating" role="status" aria-live="polite" aria-label="Validating reset link">
            <div className="rp-validating__bar">
                <div className="rp-validating__fill" />
            </div>
            <p className="rp-validating__label">Verifying your reset link…</p>
        </div>
    );
}

function InvalidState({ expired }) {
    return (
        <div className="rp-invalid" role="alert" aria-live="assertive">
            <div className="rp-invalid__badge">
                <span className="rp-invalid__badge-dot" />
                {expired ? "Link expired" : "Invalid link"}
            </div>
            <p className="rp-invalid__copy">
                {expired
                    ? "This password reset link has expired. Reset links are valid for 60 minutes."
                    : "This reset link is invalid or has already been used. Please request a new one."}
            </p>
            <Link to="/forgot-password" className="rp-btn rp-btn--primary">
                Request a new link
                <span className="rp-btn__arrow" aria-hidden="true">→</span>
            </Link>
            <Link to="/login" className="rp-btn rp-btn--ghost">
                Back to login
            </Link>
        </div>
    );
}

function SuccessState() {
    const navigate = useNavigate();
    const [secs, setSecs] = useState(5);
    useEffect(() => {
        if (secs <= 0) { navigate("/login"); return; }
        const t = setTimeout(() => setSecs(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [secs, navigate]);
    return (
        <div className="rp-success" role="status" aria-live="polite">
            <div className="rp-success__pill">
                <span className="rp-success__dot" aria-hidden="true" />
                Password updated
            </div>
            <p className="rp-success__copy">
                Your password has been changed successfully. You can now sign in with your new credentials.
            </p>
            <Link to="/login" className="rp-btn rp-btn--primary">
                Sign in now
                <span className="rp-btn__arrow" aria-hidden="true">→</span>
            </Link>
            <p className="rp-success__redirect" aria-live="polite">
                Redirecting in <strong>{secs}s</strong>…
            </p>
            <div className="rp-success__ring-wrap" aria-hidden="true">
                <svg className="rp-success__ring" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" stroke="rgba(76,175,136,.15)" strokeWidth="2.5" fill="none" />
                    <circle
                        cx="20" cy="20" r="16"
                        stroke="#4CAF88" strokeWidth="2.5" fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(secs / 5) * 100.5} 100.5`}
                        transform="rotate(-90 20 20)"
                        style={{ transition: "stroke-dasharray .9s linear" }}
                    />
                </svg>
                <span className="rp-success__ring-num">{secs}</span>
            </div>
        </div>
    );
}
export default function ResetPassword() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const token = params.get("token");

    const [step, setStep] = useState(STEPS.validating);
    const [showPw, setShowPw] = useState(false);
    const [showCfm, setShowCfm] = useState(false);

    const form = useResetForm();
    const passwordRef = useRef(null);
    useEffect(() => {
        const t = setTimeout(() => {
            if (!token) { setStep(STEPS.invalid); return; }
            if (token === "expired") { setStep(STEPS.expired); return; }
            setStep(STEPS.idle);
        }, 1200);
        return () => clearTimeout(t);
    }, [token]);
    useEffect(() => {
        if (step === STEPS.idle) {
            setTimeout(() => passwordRef.current?.focus(), 80);
        }
    }, [step]);
    const handleSubmit = async () => {
        if (!form.handleSubmit()) return;
        setStep(STEPS.loading);
        await new Promise(r => setTimeout(r, 1500));
        setStep(STEPS.success);
    };
    const config = {
        [STEPS.validating]: { kicker: "Verifying", kickerMod: "", headline: <>Checking your <em>link</em></>, sub: null },
        [STEPS.invalid]: { kicker: "Invalid link", kickerMod: "--error", headline: <>This link <em>won't work</em></>, sub: null },
        [STEPS.expired]: { kicker: "Link expired", kickerMod: "--error", headline: <>This link has <em>expired</em></>, sub: null },
        [STEPS.idle]: { kicker: "Reset password", kickerMod: "", headline: <>Choose a new <em>password</em></>, sub: "Make it strong. You won't be asked to change it again for a while." },
        [STEPS.loading]: { kicker: "Saving…", kickerMod: "", headline: <>Updating your <em>password</em></>, sub: null },
        [STEPS.success]: { kicker: "All done", kickerMod: "--success", headline: <>Password <em>updated</em></>, sub: null },
    };
    const { kicker, kickerMod, headline, sub } = config[step];
    return (
        <>
            
            <div className="rp">
                <div className="rp__grid" aria-hidden="true" />
                <nav className="rp-nav" aria-label="Page navigation">
                    <Link to="/login" className="rp-nav__back">
                        <span className="rp-nav__back-arrow" aria-hidden="true">←</span>
                        Back to login
                    </Link>
                    <Logo />
                    <span className="rp-nav__help">
                        Need help? <Link to="/contact">Contact us</Link>
                    </span>
                </nav>
                <main className="rp-main" aria-label="Reset your password">
                    <div
                        className="rp-card"
                        role="region"
                        aria-live="polite"
                        aria-label="Password reset"
                    >
                        <ShieldIllustration step={step} />
                        <header className="rp-card-header">
                            <span className={`rp-kicker${kickerMod ? ` rp-kicker${kickerMod}` : ""}`}>
                                <span className="rp-kicker__dot" aria-hidden="true" />
                                {kicker}
                            </span>
                            <h1 className="rp-headline">{headline}</h1>
                            {sub && <p className="rp-sub">{sub}</p>}
                        </header>
                        {step === STEPS.validating && <ValidatingState />}
                        {(step === STEPS.invalid || step === STEPS.expired) && (
                            <InvalidState expired={step === STEPS.expired} />
                        )}
                        {(step === STEPS.idle || step === STEPS.loading) && (
                            <div className="rp-form">
                                <div className="rp-fields">
                                    <div ref={passwordRef} tabIndex={-1}>
                                        <PasswordField
                                            id="password"
                                            label="New password"
                                            value={form.values.password}
                                            error={form.errors.password}
                                            touched={form.touched.password}
                                            show={showPw}
                                            showToggle
                                            onToggle={() => setShowPw(s => !s)}
                                            onChange={v => form.handleChange("password", v)}
                                            onBlur={() => form.handleBlur("password")}
                                            autoComplete="new-password"
                                        />
                                        <StrengthMeter password={form.values.password} strength={form.strength} />
                                        <RequirementList password={form.values.password} />
                                    </div>
                                    <PasswordField
                                        id="confirm"
                                        label="Confirm new password"
                                        value={form.values.confirm}
                                        error={form.errors.confirm}
                                        touched={form.touched.confirm}
                                        show={showCfm}
                                        showToggle
                                        onToggle={() => setShowCfm(s => !s)}
                                        onChange={v => form.handleChange("confirm", v)}
                                        onBlur={() => form.handleBlur("confirm")}
                                        autoComplete="new-password"
                                        placeholder="Repeat your password"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className={`rp-btn rp-btn--primary${step === STEPS.loading ? " rp-btn--loading" : ""}`}
                                    onClick={handleSubmit}
                                    disabled={step === STEPS.loading}
                                    aria-busy={step === STEPS.loading}
                                >
                                    {step === STEPS.loading ? (
                                        <>
                                            <span className="rp-btn__spinner" aria-hidden="true" />
                                            Saving new password…
                                        </>
                                    ) : (
                                        <>
                                            Set new password
                                            <span className="rp-btn__arrow" aria-hidden="true">→</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                        {step === STEPS.success && <SuccessState />}
                    </div>
                </main>
                <footer className="rp-footer">
                    {[
                        { label: "Help Centre", to: "/help" },
                        { label: "Privacy Policy", to: "/privacy" },
                        { label: "Terms", to: "/terms" },
                        { label: "Contact us", to: "/contact" },
                    ].map(({ label, to }, i, arr) => (
                        <>
                            <Link key={to} to={to} className="rp-footer__link">{label}</Link>
                            {i < arr.length - 1 && <span key={`sep-${i}`} className="rp-footer__sep" aria-hidden="true" />}
                        </>
                    ))}
                </footer>
            </div>
        </>
    );
}