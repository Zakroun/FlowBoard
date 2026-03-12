import Hero from "../components/Hero"
import Features from "../components/Features"
import HowItWorks from "../components/HowItWorks"
import Preview from "../components/Preview"
import CTA from "../components/CTA"
import Footer from "../layout/Footer"
import Navbar from "../layout/Navbar"
export default function Home() {
    return (
        <>
            <Hero />
            <Features />
            <HowItWorks />
            <Preview />
            <CTA />
        </>
    )
}