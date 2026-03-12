import { Link } from "react-router-dom";
import '../styles/Footer.css';
const NAV_COLUMNS = [
    {
        heading: "Product",
        links: [
            { label: "Features", to: "/features" },
            { label: "Pricing", to: "/pricing" },
            { label: "Changelog", to: "/changelog" },
            { label: "Roadmap", to: "/roadmap" },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "About", to: "/about" },
            { label: "Blog", to: "/blog" },
            { label: "Careers", to: "/careers" },
            { label: "Press", to: "/press" },
        ],
    },
    {
        heading: "Support",
        links: [
            { label: "Help centre", to: "/help" },
            { label: "Documentation", to: "/docs" },
            { label: "Status", to: "/status" },
            { label: "Contact us", to: "/contact" },
        ],
    },
    {
        heading: "Legal",
        links: [
            { label: "Privacy", to: "/privacy" },
            { label: "Terms", to: "/terms" },
            { label: "Cookie policy", to: "/cookies" },
            { label: "Security", to: "/security" },
        ],
    },
];

const SOCIAL_LINKS = [
    {
        label: "X (Twitter)",
        to: "https://twitter.com",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L2.25 2.25h6.988l4.26 5.632 4.746-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
            </svg>
        ),
    },
    {
        label: "GitHub",
        to: "https://github.com",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
            </svg>
        ),
    },
    {
        label: "LinkedIn",
        to: "https://linkedin.com",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
            </svg>
        ),
    },
];

const LEGAL_YEAR = new Date().getFullYear();

function FooterLogo() {
    return (
        <Link to="/" className="ftr__logo" aria-label="FlowBoard — home">
            <span className="ftr__logo-mark" aria-hidden="true">
                <span className="ftr__logo-sq" />
                <span className="ftr__logo-sq ftr__logo-sq--accent" />
            </span>
            FlowBoard
        </Link>
    );
}

function FooterBrand() {
    return (
        <div className="ftr__brand">
            <FooterLogo />
            <p className="ftr__tagline">
                The focused workspace for teams that ship. Bring every task,
                timeline, and teammate into one calm place.
            </p>
            <div className="ftr__social" role="list" aria-label="Social media links">
                {SOCIAL_LINKS.map(({ label, to, icon }) => (
                    <a
                        key={label}
                        href={to}
                        className="ftr__social-btn"
                        aria-babel={label}
                        target="_blank"
                        rel="noopener noreferrer"
                        role="listitem"
                    >
                        {icon}
                    </a>
                ))}
            </div>
            <div className="ftr__badge">
                <span className="ftr__badge-dot" aria-hidden="true" />
                All systems operational
            </div>
        </div >
    );
}

function FooterNavColumn({ heading, links }) {
    return (
        <nav aria-labelledby={`ftr-col-${heading.toLowerCase()}`}>
            <h3 id={`ftr-col-${heading.toLowerCase()}`} className="ftr__col-heading">
                {heading}
            </h3>
            <ul className="ftr__col-list" role="list">
                {links.map(({ label, to }) => (
                    <li key={label}>
                        <Link to={to} className="ftr__col-link">
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

function FooterBottom() {
    return (
        <div className="ftr__bottom">
            <p className="ftr__copyright">
                © {LEGAL_YEAR} FlowBoard, Inc. All rights reserved.
            </p>
            <p className="ftr__made">
                Crafted with care for teams everywhere
            </p>
        </div>
    );
}
export default function Footer() {
    return (
        <>

            <footer className="ftr" aria-label="Site footer">
                <div className="ftr__main">
                    <FooterBrand />
                    {NAV_COLUMNS.map((col) => (
                        <FooterNavColumn key={col.heading} heading={col.heading} links={col.links} />
                    ))}
                </div>

                <FooterBottom />
            </footer>
        </>
    );
}