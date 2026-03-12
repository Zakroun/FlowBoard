import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import '../styles/Navbar.css';

const NAV_LINKS = [
    { label: "Features", to: "/features" },
    { label: "Pricing", to: "/pricing" },
    { label: "Services", to: "/services" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
];

function NavLogo({ isScrolled }) {
    const { pathname } = useLocation();
    const isActivePage = pathname === "/features" || pathname === "/pricing" || pathname === "/services" || pathname === "/about" || pathname === "/contact";

    return (
        <Link to="/" className={`navbar__logo ${isActivePage && !isScrolled ? "navbar__logo--active-page" : ""}`} aria-label="FlowBoard — home">
            <span className="navbar__logo-mark" aria-hidden="true">
                <span className={`navbar__logo-square ${isActivePage && !isScrolled ? "navbar__logo-square--active" : ""}`} />
                <span className="navbar__logo-square navbar__logo-square--accent" />
            </span>
            FlowBoard
        </Link>
    );
}

function NavLink({ to, label, onClick, isScrolled }) {
    const { pathname } = useLocation();
    const isActive = pathname === to;
    const isActivePage = pathname === "/features" || pathname === "/pricing" || pathname === "/services" || pathname === "/about" || pathname === "/contact";

    return (
        <li className="navbar__item">
            <Link
                to={to}
                className={`navbar__link ${isActive ? "navbar__link--active" : ""} ${isActivePage && !isScrolled ? "navbar__link--active-page" : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={onClick}
            >
                {label}
                <span className="navbar__link-underline" aria-hidden="true" />
            </Link>
        </li>
    );
}

function NavActions({ onLinkClick, isScrolled }) {
    const { pathname } = useLocation();
    const isActivePage = pathname === "/features" || pathname === "/pricing" || pathname === "/services" || pathname === "/about" || pathname === "/contact";

    return (
        <div className="navbar__actions">
            <Link
                to="/login"
                className={`navbar__action navbar__action--ghost ${isActivePage && !isScrolled ? "navbar__action--active-page" : ""}`}
                onClick={onLinkClick}
            >
                Log in
            </Link>
            <Link
                to="/register"
                className="navbar__action navbar__action--primary"
                onClick={onLinkClick}
            >
                Get Started
                <span className="navbar__action-arrow" aria-hidden="true">→</span>
            </Link>
        </div>
    );
}

function HamburgerButton({ isOpen, onToggle, isScrolled }) {
    const { pathname } = useLocation();
    const isActivePage = pathname === "/features" || pathname === "/pricing" || pathname === "/services" || pathname === "/about" || pathname === "/contact";

    return (
        <button
            className={`navbar__hamburger ${isOpen ? "navbar__hamburger--open" : ""} ${isActivePage && !isScrolled ? "navbar__hamburger--active-page" : ""}`}
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
            <span className={`navbar__hamburger-bar ${isActivePage && !isScrolled ? "navbar__hamburger-bar--active" : ""}`} />
            <span className={`navbar__hamburger-bar ${isActivePage && !isScrolled ? "navbar__hamburger-bar--active" : ""}`} />
            <span className={`navbar__hamburger-bar ${isActivePage && !isScrolled ? "navbar__hamburger-bar--active" : ""}`} />
        </button>
    );
}

function MobileDrawer({ isOpen, onLinkClick, isScrolled }) {
    return (
        <div
            id="mobile-menu"
            className={`navbar__drawer ${isOpen ? "navbar__drawer--open" : ""}`}
            aria-hidden={!isOpen}
            inert={!isOpen ? "" : undefined}
        >
            <div className="navbar__drawer-inner">
                <nav aria-label="Mobile navigation">
                    <ul className="navbar__drawer-list" role="list">
                        {NAV_LINKS.map(({ label, to }) => (
                            <NavLink isScrolled={isScrolled} key={to} to={to} label={label} onClick={onLinkClick} />
                        ))}
                    </ul>
                </nav>
                <div className="navbar__drawer-footer">
                    <NavActions onLinkClick={onLinkClick} isScrolled={isScrolled} />
                </div>
            </div>
        </div>
    );
}

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 12);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [menuOpen]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    const closeMenu = useCallback(() => setMenuOpen(false), []);
    const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

    return (
        <>
            <div
                className={`navbar__overlay ${menuOpen ? "navbar__overlay--visible" : ""}`}
                onClick={closeMenu}
                aria-hidden="true"
            />
            <header
                ref={navRef}
                className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}
                role="banner"
            >
                <div className="navbar__inner">
                    <NavLogo isScrolled={isScrolled} />
                    <nav aria-label="Primary navigation">
                        <ul className="navbar__list" role="list">
                            {NAV_LINKS.map(({ label, to }) => (
                                <NavLink key={to} to={to} label={label} isScrolled={isScrolled} />
                            ))}
                        </ul>
                    </nav>
                    <div className="navbar__actions" aria-label="Account actions">
                        <NavActions isScrolled={isScrolled} />
                    </div>
                    <HamburgerButton isOpen={menuOpen} onToggle={toggleMenu} isScrolled={isScrolled} />
                </div>
            </header>
            <MobileDrawer isOpen={menuOpen} onLinkClick={closeMenu} isScrolled={isScrolled} />
        </>
    );
}