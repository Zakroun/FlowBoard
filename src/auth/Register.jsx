import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/Register.css';
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

const STEPS = [
    { id: "account", label: "Account", description: "Your login credentials" },
    { id: "workspace", label: "Workspace", description: "Set up your team space" },
    { id: "invite", label: "Invite", description: "Bring your team along" },
];

const PLAN_OPTIONS = [
    {
        id: "starter",
        name: "Starter",
        price: "Free",
        note: "forever",
        features: ["3 projects", "5 members", "Basic analytics"],
        accent: "#4CAF88",
    },
    {
        id: "pro",
        name: "Pro",
        price: "$10",
        note: "/ member / mo",
        features: ["Unlimited projects", "All views", "Priority support"],
        accent: "#003934",
        recommended: true,
    },
];

const AVATAR_COLORS = ["#4CAF88", "#38bdf8", "#f59e0b", "#a78bfa", "#f87171"];
const VALIDATORS = {
    account: (v) => {
        const e = {};
        if (!v.name?.trim()) e.name = "Full name is required";
        if (!v.email?.trim()) e.email = "Work email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Enter a valid email address";
        if (!v.password?.trim()) e.password = "Password is required";
        else if (v.password.length < 8) e.password = "Use at least 8 characters";
        else if (!/[A-Z]/.test(v.password)) e.password = "Include at least one uppercase letter";
        else if (!/[0-9]/.test(v.password)) e.password = "Include at least one number";
        return e;
    },
    workspace: (v) => {
        const e = {};
        if (!v.workspaceName?.trim()) e.workspaceName = "Workspace name is required";
        else if (v.workspaceName.length < 2) e.workspaceName = "Must be at least 2 characters";
        return e;
    },
    invite: () => ({}),
};
function useStepForm(initial) {
    const [values, setValues] = useState(initial);
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const validate = (step, vals) => VALIDATORS[step]?.(vals) ?? {};
    const handleChange = (id, value, step) => {
        const next = { ...values, [id]: value };
        setValues(next);
        if (touched[id]) setErrors(prev => ({ ...prev, ...validate(step, next) }));
    };
    const handleBlur = (id, step) => {
        setTouched(t => ({ ...t, [id]: true }));
        setErrors(prev => ({ ...prev, ...validate(step, values) }));
    };
    const validateStep = (step) => {
        const e = validate(step, values);
        const stepFields = Object.keys(e);
        setTouched(t => ({ ...t, ...Object.fromEntries(stepFields.map(k => [k, true])) }));
        setErrors(prev => ({ ...prev, ...e }));
        return Object.keys(e).length === 0;
    };
    return { values, errors, touched, handleChange, handleBlur, validateStep, setValues };
}
function Logo() {
    return (
        <Link to="/" className="reg-logo" aria-label="FlowBoard — home">
            <span className="reg-logo__mark" aria-hidden="true">
                <span className="reg-logo__sq" />
                <span className="reg-logo__sq reg-logo__sq--accent" />
            </span>
            FlowBoard
        </Link>
    );
}

function StepIndicator({ steps, currentStep, completedSteps }) {
    return (
        <nav className="reg-steps" aria-label="Registration progress">
            <ol className="reg-steps__list" role="list">
                {steps.map((step, i) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isCurrent = currentStep === step.id;
                    const isPending = !isCompleted && !isCurrent;
                    return (
                        <li
                            key={step.id}
                            className={`reg-step${isCurrent ? " reg-step--current" : ""}${isCompleted ? " reg-step--done" : ""}${isPending ? " reg-step--pending" : ""}`}
                        >
                            <span className="reg-step__bubble" aria-hidden="true">
                                {isCompleted ? (
                                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                                        <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <span className="reg-step__num">{i + 1}</span>
                                )}
                            </span>
                            <span className="reg-step__label" aria-current={isCurrent ? "step" : undefined}>
                                {step.label}
                            </span>
                            {i < steps.length - 1 && (
                                <span className="reg-step__connector" aria-hidden="true">
                                    <span className={`reg-step__connector-fill${isCompleted ? " reg-step__connector-fill--done" : ""}`} />
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

function FieldWrapper({ id, label, error, touched, required, children }) {
    const hasError = touched && error;
    return (
        <div className="reg-field">
            <label className="reg-field__label" htmlFor={id}>
                {label}
                {required && <span className="reg-field__req" aria-label="required">*</span>}
            </label>
            {children}
            {hasError && (
                <span id={`${id}-err`} className="reg-field__error" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}

function TextInput({ id, type = "text", placeholder, autoComplete, value, error, touched, onChange, onBlur, suffix }) {
    const hasError = touched && error;
    const isOk = touched && !error && value;
    return (
        <div className="reg-input-wrap">
            <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                value={value}
                onChange={e => onChange(e.target.value)}
                onBlur={onBlur}
                className={`reg-input${hasError ? " reg-input--error" : ""}${isOk ? " reg-input--ok" : ""}`}
                aria-invalid={hasError ? "true" : undefined}
                aria-describedby={hasError ? `${id}-err` : undefined}
            />
            {suffix && <span className="reg-input-suffix">{suffix}</span>}
        </div>
    );
}

function PasswordStrength({ password }) {
    const checks = [
        { label: "8+ characters", pass: password.length >= 8 },
        { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
        { label: "Number", pass: /[0-9]/.test(password) },
        { label: "Special character", pass: /[^A-Za-z0-9]/.test(password) },
    ];
    const score = checks.filter(c => c.pass).length;
    const levels = ["", "Weak", "Fair", "Good", "Strong"];
    const colors = ["#e2e8f0", "#ef4444", "#f59e0b", "#38bdf8", "#4CAF88"];

    if (!password) return null;

    return (
        <div className="reg-strength" aria-label={`Password strength: ${levels[score]}`}>
            <div className="reg-strength__bars" aria-hidden="true">
                {[1, 2, 3, 4].map(i => (
                    <span
                        key={i}
                        className="reg-strength__bar"
                        style={{ background: i <= score ? colors[score] : "#e2e8f0" }}
                    />
                ))}
            </div>
            <div className="reg-strength__checks" aria-hidden="true">
                {checks.map(({ label, pass }) => (
                    <span key={label} className={`reg-strength__check${pass ? " reg-strength__check--pass" : ""}`}>
                        <span className="reg-strength__check-dot" />
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}

function PasswordInput({ id, label, value, error, touched, onChange, onBlur }) {
    const [show, setShow] = useState(false);
    const hasError = touched && error;
    const isOk = touched && !error && value;
    return (
        <div className="reg-field">
            <label className="reg-field__label" htmlFor={id}>
                {label}<span className="reg-field__req" aria-label="required">*</span>
            </label>
            <div className="reg-input-wrap">
                <input
                    id={id} name={id}
                    type={show ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    className={`reg-input${hasError ? " reg-input--error" : ""}${isOk ? " reg-input--ok" : ""}`}
                    aria-invalid={hasError ? "true" : undefined}
                    aria-describedby={hasError ? `${id}-err` : undefined}
                    style={{ paddingRight: "2.5rem" }}
                />
                <button
                    type="button" tabIndex={-1}
                    className="reg-eye"
                    onClick={() => setShow(s => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
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
            {hasError && <span id={`${id}-err`} className="reg-field__error" role="alert">{error}</span>}
            <PasswordStrength password={value} />
        </div>
    );
}

function OAuthButton({ provider, loading, onClick }) {
    return (
        <button
            className={`reg-oauth${loading ? " reg-oauth--loading" : ""}`}
            onClick={() => onClick(provider.id)}
            type="button" disabled={loading}
            aria-label={provider.label}
        >
            <span className="reg-oauth__icon">{provider.icon}</span>
            <span className="reg-oauth__label">{provider.label}</span>
        </button>
    );
}

function Divider() {
    return (
        <div className="reg-divider" role="separator">
            <span className="reg-divider__line" />
            <span className="reg-divider__text">or continue with email</span>
            <span className="reg-divider__line" />
        </div>
    );
}

function PlanCard({ plan, selected, onSelect }) {
    return (
        <button
            type="button"
            className={`reg-plan${selected ? " reg-plan--selected" : ""}${plan.recommended ? " reg-plan--recommended" : ""}`}
            onClick={() => onSelect(plan.id)}
            aria-pressed={selected}
            style={{ "--plan-accent": plan.accent }}
        >
            {plan.recommended && (
                <span className="reg-plan__badge">Recommended</span>
            )}
            <div className="reg-plan__header">
                <span className="reg-plan__name">{plan.name}</span>
                <div className="reg-plan__price-row">
                    <span className="reg-plan__price">{plan.price}</span>
                    <span className="reg-plan__note">{plan.note}</span>
                </div>
            </div>
            <ul className="reg-plan__features" role="list">
                {plan.features.map(f => (
                    <li key={f} className="reg-plan__feature">
                        <span className="reg-plan__feature-check" style={{ color: plan.accent }} aria-hidden="true">
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        {f}
                    </li>
                ))}
            </ul>
            <span className="reg-plan__selector" aria-hidden="true">
                <span className="reg-plan__selector-dot" />
            </span>
        </button>
    );
}

function InviteRow({ email, onChange, onRemove, index, canRemove }) {
    return (
        <div className="reg-invite-row">
            <input
                type="email"
                placeholder={`teammate${index + 1}@company.com`}
                value={email}
                onChange={e => onChange(index, e.target.value)}
                className="reg-input reg-input--invite"
                aria-label={`Invite email ${index + 1}`}
                autoComplete="off"
            />
            {canRemove && (
                <button
                    type="button"
                    className="reg-invite-remove"
                    onClick={() => onRemove(index)}
                    aria-label={`Remove invite ${index + 1}`}
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </button>
            )}
        </div>
    );
}

function StepAccount({ form, oauthLoading, onOAuth }) {
    const { values, errors, touched, handleChange, handleBlur } = form;
    const step = "account";
    return (
        <div className="reg-step-body">
            <div className="reg-oauth-group">
                {OAUTH_PROVIDERS.map(p => (
                    <OAuthButton key={p.id} provider={p} loading={oauthLoading === p.id} onClick={onOAuth} />
                ))}
            </div>
            <Divider />
            <div className="reg-fields">
                <FieldWrapper id="name" label="Full name" error={errors.name} touched={touched.name} required>
                    <TextInput
                        id="name" placeholder="Alex Kim" autoComplete="name"
                        value={values.name} error={errors.name} touched={touched.name}
                        onChange={v => handleChange("name", v, step)}
                        onBlur={() => handleBlur("name", step)}
                    />
                </FieldWrapper>
                <FieldWrapper id="email" label="Work email" error={errors.email} touched={touched.email} required>
                    <TextInput
                        id="email" type="email" placeholder="alex@company.com" autoComplete="email"
                        value={values.email} error={errors.email} touched={touched.email}
                        onChange={v => handleChange("email", v, step)}
                        onBlur={() => handleBlur("email", step)}
                    />
                </FieldWrapper>
                <PasswordInput
                    id="password" label="Password"
                    value={values.password} error={errors.password} touched={touched.password}
                    onChange={v => handleChange("password", v, step)}
                    onBlur={() => handleBlur("password", step)}
                />
            </div>
        </div>
    );
}

function StepWorkspace({ form }) {
    const { values, errors, touched, handleChange, handleBlur, setValues } = form;
    const step = "workspace";
    const slug = (values.workspaceName || "")
        .toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    return (
        <div className="reg-step-body">
            <div className="reg-fields">
                <FieldWrapper id="workspaceName" label="Workspace name" error={errors.workspaceName} touched={touched.workspaceName} required>
                    <TextInput
                        id="workspaceName" placeholder="Acme Inc." autoComplete="organization"
                        value={values.workspaceName} error={errors.workspaceName} touched={touched.workspaceName}
                        onChange={v => handleChange("workspaceName", v, step)}
                        onBlur={() => handleBlur("workspaceName", step)}
                    />
                    {slug && (
                        <p className="reg-slug">
                            Your URL: <strong>app.flowboard.io/<span className="reg-slug__val">{slug}</span></strong>
                        </p>
                    )}
                </FieldWrapper>
                <div className="reg-field">
                    <span className="reg-field__label">Team size</span>
                    <div className="reg-size-options" role="radiogroup" aria-label="Team size">
                        {["Just me", "2–10", "11–50", "50+"].map(size => (
                            <button
                                key={size}
                                type="button"
                                role="radio"
                                aria-checked={values.teamSize === size}
                                className={`reg-size-btn${values.teamSize === size ? " reg-size-btn--on" : ""}`}
                                onClick={() => setValues(v => ({ ...v, teamSize: size }))}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="reg-field">
                    <span className="reg-field__label">Choose your plan</span>
                    <p className="reg-field__hint">You can change this at any time.</p>
                    <div className="reg-plan-grid">
                        {PLAN_OPTIONS.map(plan => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                selected={values.plan === plan.id}
                                onSelect={id => setValues(v => ({ ...v, plan: id }))}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StepInvite({ form }) {
    const { values, setValues } = form;
    const [invites, setInvites] = useState(["", "", ""]);
    const updateInvite = (i, val) => {
        const next = [...invites];
        next[i] = val;
        setInvites(next);
        setValues(v => ({ ...v, invites: next.filter(Boolean) }));
    };
    const removeInvite = (i) => {
        const next = invites.filter((_, idx) => idx !== i);
        setInvites(next);
        setValues(v => ({ ...v, invites: next.filter(Boolean) }));
    };
    const addInvite = () => setInvites(i => [...i, ""]);
    const filledCount = invites.filter(Boolean).length;
    return (
        <div className="reg-step-body">
            <div className="reg-invite-preview" aria-hidden="true">
                <div className="reg-invite-preview__avatars">
                    <span
                        className="reg-invite-preview__you"
                        style={{ background: "#003934" }}
                    >
                        {(values.name || "Y").charAt(0).toUpperCase()}
                    </span>
                    {AVATAR_COLORS.slice(0, Math.max(filledCount, 1)).map((c, i) => (
                        <span
                            key={i}
                            className={`reg-invite-preview__ghost${i < filledCount ? " reg-invite-preview__ghost--filled" : ""}`}
                            style={i < filledCount ? { background: c } : {}}
                        />
                    ))}
                </div>
                <p className="reg-invite-preview__text">
                    {filledCount > 0
                        ? `${filledCount} teammate${filledCount > 1 ? "s" : ""} will receive an invite`
                        : "Add teammates to collaborate from day one"}
                </p>
            </div>
            <div className="reg-fields">
                {invites.map((email, i) => (
                    <InviteRow
                        key={i}
                        email={email}
                        index={i}
                        onChange={updateInvite}
                        onRemove={removeInvite}
                        canRemove={invites.length > 1}
                    />
                ))}
                {invites.length < 8 && (
                    <button type="button" className="reg-invite-add" onClick={addInvite}>
                        <span className="reg-invite-add__icon" aria-hidden="true">+</span>
                        Add another
                    </button>
                )}
                <p className="reg-invite-skip">
                    You can always invite people later from your workspace settings.
                </p>
            </div>
        </div>
    );
}

function SocialProofPanel() {
    const items = [
        { value: "14-day", label: "Free trial on Pro" },
        { value: "No card", label: "Required to start" },
        { value: "2 min", label: "To set up your workspace" },
    ];

    const testimonials = [
        { initials: "PN", color: "#4CAF88", text: "Set up in under two minutes. Our whole team was onboarded before lunch.", name: "Priya N.", role: "VP Eng" },
        { initials: "LB", color: "#38bdf8", text: "Switched from Jira. Never looked back.", name: "Lars B.", role: "CTO" },
    ];

    return (
        <aside className="reg-panel" aria-label="Why FlowBoard">
            <div className="reg-panel__orb" aria-hidden="true" />
            <div className="reg-panel__grid" aria-hidden="true" />
            <div className="reg-panel__content">
                <div className="reg-panel__logo-wrap">
                    <span className="reg-panel__logo-mark" aria-hidden="true">
                        <span className="reg-panel__logo-sq" />
                        <span className="reg-panel__logo-sq reg-panel__logo-sq--accent" />
                    </span>
                    <span className="reg-panel__logo-name">FlowBoard</span>
                </div>
                <div className="reg-panel__headline">
                    <h2 className="reg-panel__h">
                        Your team's best<br />
                        <em>work starts here</em>
                    </h2>
                    <p className="reg-panel__sub">
                        Join 12,400 teams who ship faster with FlowBoard.
                    </p>
                </div>
                <div className="reg-panel__stats" aria-label="Trial highlights">
                    {items.map(({ value, label }) => (
                        <div key={label} className="reg-panel__stat">
                            <span className="reg-panel__stat-val">{value}</span>
                            <span className="reg-panel__stat-label">{label}</span>
                        </div>
                    ))}
                </div>
                <div className="reg-panel__testis">
                    {testimonials.map(({ initials, color, text, name, role }) => (
                        <figure key={name} className="reg-panel__testi">
                            <blockquote className="reg-panel__testi-q">"{text}"</blockquote>
                            <figcaption className="reg-panel__testi-cap">
                                <span className="reg-panel__testi-avatar" style={{ background: color }}>{initials}</span>
                                <div>
                                    <span className="reg-panel__testi-name">{name}</span>
                                    <span className="reg-panel__testi-role">{role}</span>
                                </div>
                            </figcaption>
                        </figure>
                    ))}
                </div>
                <ul className="reg-panel__checklist" role="list" aria-label="Included in every trial">
                    {[
                        "Unlimited projects during trial",
                        "Full Kanban, Timeline & Gantt",
                        "Invite your whole team free",
                        "No setup calls. No onboarding decks.",
                    ].map(item => (
                        <li key={item} className="reg-panel__check-item">
                            <span className="reg-panel__check-icon" aria-hidden="true">
                                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                    <path d="M1 3.5L3.5 6L8 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
export default function Register() {
    const navigate = useNavigate();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [oauthLoading, setOauthLoading] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const currentStep = STEPS[currentStepIndex];
    const isLast = currentStepIndex === STEPS.length - 1;
    const isFirst = currentStepIndex === 0;
    const progressPct = ((currentStepIndex) / STEPS.length) * 100;
    const form = useStepForm({
        name: "", email: "", password: "",
        workspaceName: "", teamSize: "2–10", plan: "pro",
        invites: [],
    });
    const formTopRef = useRef(null);
    useEffect(() => {
        formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [currentStepIndex]);
    const handleNext = async () => {
        if (!form.validateStep(currentStep.id)) return;
        if (isLast) {
            setSubmitLoading(true);
            await new Promise(r => setTimeout(r, 1500));
            setSubmitLoading(false);
            navigate("/dashboard");
            return;
        }
        setCompletedSteps(prev => [...new Set([...prev, currentStep.id])]);
        setCurrentStepIndex(i => i + 1);
    };
    const handleBack = () => {
        setCurrentStepIndex(i => i - 1);
    };
    const onOAuth = async (providerId) => {
        setOauthLoading(providerId);
        await new Promise(r => setTimeout(r, 1200));
        setOauthLoading(null);
        navigate("/dashboard");
    };
    const stepLabels = {
        account: { headline: "Create your account", sub: "Start your 14-day Pro trial — no credit card required." },
        workspace: { headline: "Set up your workspace", sub: "Give your team a home. You can rename this later." },
        invite: { headline: "Invite your teammates", sub: "The best work happens together. Skip and do this later." },
    };

    const { headline, sub } = stepLabels[currentStep.id];

    return (
        <>
            <div className="rg">
                <SocialProofPanel />
                <main className="reg-form-panel" aria-label="Create your FlowBoard account" ref={formTopRef}>
                    <div className="reg-progress" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label="Registration progress">
                        <div className="reg-progress__fill" style={{ width: `${progressPct}%` }} />
                    </div>
                    <div className="reg-form-wrap">
                        <div className="reg-topnav">
                            <Logo />
                            <span className="reg-topnav__signin">
                                Already have an account? <Link to="/login">Sign in</Link>
                            </span>
                        </div>
                        <StepIndicator
                            steps={STEPS}
                            currentStep={currentStep.id}
                            completedSteps={completedSteps}
                        />
                        <header className="reg-form-header">
                            <h1 className="reg-form-headline">
                                {headline.split(" ").slice(0, -1).join(" ")}{" "}
                                <em>{headline.split(" ").slice(-1)}</em>
                            </h1>
                            <p className="reg-form-sub">{sub}</p>
                        </header>
                        {currentStep.id === "account" && <StepAccount form={form} oauthLoading={oauthLoading} onOAuth={onOAuth} />}
                        {currentStep.id === "workspace" && <StepWorkspace form={form} />}
                        {currentStep.id === "invite" && <StepInvite form={form} />}
                        <div className={`reg-nav${isFirst ? " reg-nav--start" : ""}`}>
                            {!isFirst && (
                                <button type="button" className="reg-btn reg-btn--ghost" onClick={handleBack}>
                                    ← Back
                                </button>
                            )}
                            <button
                                type="button"
                                className={`reg-btn reg-btn--primary${submitLoading ? " reg-btn--loading" : ""}`}
                                onClick={handleNext}
                                aria-busy={submitLoading}
                                disabled={submitLoading}
                            >
                                {submitLoading ? (
                                    <>
                                        <span className="reg-btn__spinner" aria-hidden="true" />
                                        Creating workspace…
                                    </>
                                ) : isLast ? (
                                    <>
                                        Launch my workspace
                                        <span className="reg-btn__arrow" aria-hidden="true">→</span>
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <span className="reg-btn__arrow" aria-hidden="true">→</span>
                                    </>
                                )}
                            </button>
                        </div>
                        {currentStep.id === "account" && (
                            <p className="reg-legal">
                                By creating an account you agree to our{" "}
                                <Link to="/terms">Terms of Service</Link> and{" "}
                                <Link to="/privacy">Privacy Policy</Link>.
                                We'll occasionally send product updates — unsubscribe any time.
                            </p>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}