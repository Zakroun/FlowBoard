import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/Login.css';
const OAUTH_PROVIDERS = [
    {
        id: "google",
        label: "Continue with Google",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
        ),
    },
    {
        id: "github",
        label: "Continue with GitHub",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
            </svg>
        ),
    },
];

const FIELDS = [
    {
        id: "email",
        label: "Work email",
        type: "email",
        placeholder: "alex@company.com",
        autoComplete: "email",
    },
    {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••••••",
        autoComplete: "current-password",
    },
];
function useForm(initial) {
    const [values, setValues] = useState(initial);
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});

    const validate = (vals) => {
        const e = {};
        if (!vals.email?.trim())
            e.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email))
            e.email = "Enter a valid email address";
        if (!vals.password?.trim())
            e.password = "Password is required";
        else if (vals.password.length < 8)
            e.password = "Password must be at least 8 characters";
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
        const allTouched = Object.fromEntries(FIELDS.map(f => [f.id, true]));
        setTouched(allTouched);
        const e = validate(values);
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    return { values, errors, touched, handleChange, handleBlur, handleSubmit };
}
function Logo() {
    return (
        <Link to="/" className="lgn-logo" aria-label="FlowBoard — home">
            <span className="lgn-logo__mark" aria-hidden="true">
                <span className="lgn-logo__sq" />
                <span className="lgn-logo__sq lgn-logo__sq--accent" />
            </span>
            FlowBoard
        </Link>
    );
}

function BoardPreviewPanel() {
    const cols = [
        { label: "To Do", accent: "#94a3b8", cards: ["Onboarding flow", "API docs review"] },
        { label: "In Progress", accent: "#38bdf8", cards: ["Dashboard v2", "Auth refactor"] },
        { label: "Done", accent: "#4CAF88", cards: ["Design tokens", "CI pipeline", "Tests"] },
    ];
    const avatars = ["#4CAF88", "#38bdf8", "#f59e0b", "#a78bfa"];
    return (
        <div className="lgn-panel" aria-hidden="true">
            <div className="lgn-panel__orb" />
            <div className="lgn-panel__grid" />
            <div className="lgn-panel__content">
                <div className="lgn-panel__chrome">
                    <div className="lgn-panel__dots">
                        <span className="lgn-panel__dot" style={{ background: "#ef4444" }} />
                        <span className="lgn-panel__dot" style={{ background: "#facc15" }} />
                        <span className="lgn-panel__dot" style={{ background: "#4ade80" }} />
                    </div>
                    <span className="lgn-panel__chrome-title">FlowBoard — Q4 Sprint</span>
                    <div className="lgn-panel__avatars">
                        {avatars.map(c => (
                            <span key={c} className="lgn-panel__avatar" style={{ background: c }} />
                        ))}
                    </div>
                </div>
                <div className="lgn-panel__board">
                    {cols.map(({ label, accent, cards }, ci) => (
                        <div key={label} className="lgn-panel__col">
                            <div className="lgn-panel__col-header">
                                <span className="lgn-panel__col-dot" style={{ background: accent }} />
                                <span className="lgn-panel__col-label">{label}</span>
                                <span className="lgn-panel__col-count">{cards.length}</span>
                            </div>
                            {cards.map((card, i) => (
                                <div
                                    key={card}
                                    className="lgn-panel__card"
                                    style={{ animationDelay: `${ci * 100 + i * 60}ms` }}
                                >
                                    <span className="lgn-panel__card-bar" style={{ background: accent }} />
                                    <div className="lgn-panel__card-body">
                                        <span className="lgn-panel__card-text">{card}</span>
                                        <div className="lgn-panel__card-meta">
                                            <span className="lgn-panel__card-dot" />
                                            <span className="lgn-panel__card-dot" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="lgn-panel__stats">
                    {[
                        { label: "Velocity", value: "↑ 28%", color: "#4CAF88" },
                        { label: "On track", value: "91%", color: "#38bdf8" },
                        { label: "Sprints", value: "12", color: "#a78bfa" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="lgn-panel__stat">
                            <span className="lgn-panel__stat-val" style={{ color }}>{value}</span>
                            <span className="lgn-panel__stat-label">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="lgn-panel__quote">
                <p className="lgn-panel__quote-text">
                    "FlowBoard cut our standup time in half. Everything's already visible."
                </p>
                <div className="lgn-panel__quote-author">
                    <span className="lgn-panel__quote-avatar" style={{ background: "#4CAF88" }}>MO</span>
                    <div>
                        <span className="lgn-panel__quote-name">Mara Osei</span>
                        <span className="lgn-panel__quote-role">VP Eng, Meridian</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OAuthButton({ provider, loading, onClick }) {
    return (
        <button
            className={`lgn-oauth${loading ? " lgn-oauth--loading" : ""}`}
            onClick={() => onClick(provider.id)}
            type="button"
            disabled={loading}
            aria-label={provider.label}
        >
            <span className="lgn-oauth__icon">{provider.icon}</span>
            <span className="lgn-oauth__label">{provider.label}</span>
        </button>
    );
}

function Divider() {
    return (
        <div className="lgn-divider" role="separator">
            <span className="lgn-divider__line" />
            <span className="lgn-divider__text">or continue with email</span>
            <span className="lgn-divider__line" />
        </div>
    );
}

function PasswordField({ value, error, touched, onChange, onBlur }) {
    const [show, setShow] = useState(false);
    const hasError = touched && error;
    const isOk = touched && !error && value;

    return (
        <div className="lgn-field">
            <div className="lgn-field__label-row">
                <label className="lgn-field__label" htmlFor="password">Password</label>
                <Link to="/forgot-password" className="lgn-field__forgot">Forgot password?</Link>
            </div>
            <div className="lgn-field__input-wrap">
                <input
                    id="password"
                    name="password"
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    value={value}
                    onChange={e => onChange("password", e.target.value)}
                    onBlur={() => onBlur("password")}
                    className={`lgn-input${hasError ? " lgn-input--error" : ""}${isOk ? " lgn-input--ok" : ""}`}
                    aria-invalid={hasError ? "true" : undefined}
                    aria-describedby={hasError ? "password-err" : undefined}
                />
                <button
                    type="button"
                    className="lgn-field__eye"
                    onClick={() => setShow(s => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
                    tabIndex={-1}
                >
                    {show ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    )}
                </button>
            </div>
            {hasError && (
                <span id="password-err" className="lgn-field__error" role="alert">{error}</span>
            )}
        </div>
    );
}

function EmailField({ value, error, touched, onChange, onBlur }) {
    const hasError = touched && error;
    const isOk = touched && !error && value;
    return (
        <div className="lgn-field">
            <label className="lgn-field__label" htmlFor="email">Work email</label>
            <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="alex@company.com"
                value={value}
                onChange={e => onChange("email", e.target.value)}
                onBlur={() => onBlur("email")}
                className={`lgn-input${hasError ? " lgn-input--error" : ""}${isOk ? " lgn-input--ok" : ""}`}
                aria-invalid={hasError ? "true" : undefined}
                aria-describedby={hasError ? "email-err" : undefined}
            />
            {hasError && (
                <span id="email-err" className="lgn-field__error" role="alert">{error}</span>
            )}
        </div>
    );
}

function SubmitButton({ loading }) {
    return (
        <button
            type="submit"
            className={`lgn-submit${loading ? " lgn-submit--loading" : ""}`}
            disabled={loading}
            aria-busy={loading}
        >
            {loading ? (
                <>
                    <span className="lgn-submit__spinner" aria-hidden="true" />
                    Signing in…
                </>
            ) : (
                <>
                    Sign in to FlowBoard
                    <span className="lgn-submit__arrow" aria-hidden="true">→</span>
                </>
            )}
        </button>
    );
}

function ErrorBanner({ message, onDismiss }) {
    return (
        <div className="lgn-banner" role="alert" aria-live="assertive">
            <span className="lgn-banner__icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </span>
            <span className="lgn-banner__text">{message}</span>
            <button className="lgn-banner__close" onClick={onDismiss} aria-label="Dismiss error" type="button">×</button>
        </div>
    );
}

export default function Login() {
    const navigate = useNavigate();
    const [remember, setRemember] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState(null);
    const [serverError, setServerError] = useState(null);
    const emailRef = useRef(null);

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm({
        email: "", password: "",
    });
    useEffect(() => { emailRef.current?.focus(); }, []);
    const onSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        if (!handleSubmit()) return;
        setSubmitLoading(true);
        try {
            await new Promise(r => setTimeout(r, 1400));
            navigate("/dashboard");
        } catch {
            setServerError("Incorrect email or password. Please try again.");
        } finally {
            setSubmitLoading(false);
        }
    };

    const onOAuth = async (providerId) => {
        setOauthLoading(providerId);
        await new Promise(r => setTimeout(r, 1200));
        setOauthLoading(null);
        navigate("/dashboard");
    };

    return (
        <>
            <div className="lgn">
                <BoardPreviewPanel />
                <nav className="lgn-topnav" aria-label="Login page navigation">
                    <Logo />
                    <Link
                        to="/register"
                        style={{
                            fontSize: ".82rem", fontWeight: 600, color: "var(--lgn-forest)",
                            textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Create account →
                    </Link>
                </nav>
                <main className="lgn-form-panel" aria-label="Sign in to FlowBoard">
                    <div className="lgn-form-wrap">
                        <header className="lgn-form-header">
                            <h1 className="lgn-form-headline">
                                Welcome <em>back</em>
                            </h1>
                            <p className="lgn-form-sub">
                                Sign in to your workspace to pick up where you left off.
                            </p>
                        </header>
                        {serverError && (
                            <ErrorBanner message={serverError} onDismiss={() => setServerError(null)} />
                        )}
                        <div className="lgn-oauth-group" aria-label="Sign in with a provider">
                            {OAUTH_PROVIDERS.map(p => (
                                <OAuthButton
                                    key={p.id}
                                    provider={p}
                                    loading={oauthLoading === p.id}
                                    onClick={onOAuth}
                                />
                            ))}
                        </div>
                        <Divider />
                        <form
                            onSubmit={onSubmit}
                            noValidate
                            aria-label="Sign in with email"
                        >
                            <div className="lgn-fields">
                                <div ref={emailRef} tabIndex={-1}>
                                    <EmailField
                                        value={values.email}
                                        error={errors.email}
                                        touched={touched.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>
                                <PasswordField
                                    value={values.password}
                                    error={errors.password}
                                    touched={touched.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <label className="lgn-remember" aria-label="Remember me for 30 days">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={e => setRemember(e.target.checked)}
                                        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                                        aria-hidden="true"
                                    />
                                    <span className={`lgn-remember__box${remember ? " lgn-remember__box--checked" : ""}`}>
                                        {remember && (
                                            <svg className="lgn-remember__check" width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden="true">
                                                <path d="M1 3.5L3.5 6L8 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </span>
                                    <span className="lgn-remember__label">Remember me for 30 days</span>
                                </label>
                                <SubmitButton loading={submitLoading} />
                            </div>
                        </form>
                        <footer className="lgn-form-footer">
                            <p className="lgn-form-footer__signup">
                                Don't have an account?{" "}
                                <Link to="/register">Start for free</Link>
                            </p>
                            <p className="lgn-form-footer__legal">
                                By signing in you agree to our{" "}
                                <Link to="/terms">Terms of Service</Link> and{" "}
                                <Link to="/privacy">Privacy Policy</Link>.
                            </p>
                        </footer>
                    </div>
                </main>
            </div>
        </>
    );
}