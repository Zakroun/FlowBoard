import { useState, useEffect } from "react";
import { Sidebar } from "../layout/sidebar";
import Navbar from "../layout/navbar";
import { HomeDashboard } from "../components/HomeDashboard";
import Inbox from "../components/Inbox";
import Projects from "../components/Projects";
import MyTasks from "../components/MyTasks";
import Boards from "../components/Boards";
import Timeline from "../components/Timeline";
import Docs from "../components/Docs";
import Analytics from "../components/Analytics";
import Reports from "../components/Reports";
import Settings from "../components/Settings";
import '../styles/sidebarStyles.css';
import "../styles/dashboardStyles.css";
import { useParams } from "react-router-dom";

export default function DashboardPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { d } = useParams();

    useEffect(() => {
        const btn = document.getElementById("db-menu-btn");
        if (!btn) return;
        const handler = () => setMobileOpen(o => !o);
        btn.addEventListener("click", handler);
        return () => btn.removeEventListener("click", handler);
    }, []);

    const renderContent = () => {
        switch (d) {
            case "inbox":
                return <Inbox />;
            case "projects":
                return <Projects />;
            case "tasks":
                return <MyTasks />;
            case "boards":
                return <Boards />;
            case "timeline":
                return <Timeline />;
            case "docs":
                return <Docs />;
            case "analytics":
                return <Analytics />;
            case "reports":
                return <Reports />;
            case "settings":
                return <Settings />;
            default:
                return <HomeDashboard />;
        }
    };

    return (
        <div className="db-shell">
            <Sidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed(c => !c)}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />
            <div className="db-main-content">
                <Navbar />
                {renderContent()}
            </div>
        </div>
    );
}