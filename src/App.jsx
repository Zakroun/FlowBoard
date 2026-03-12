import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Services from "./pages/Services";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
// auth
import Login from "./auth/Login";
import Register from "./auth/Register";
import ResetPassword from "./auth/reset-password";
import ForgotPassword from "./auth/forgot-password";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
        <Route path="/features" element={<><Navbar /><Features /><Footer /></>} />
        <Route path="/pricing" element={<><Navbar /><Pricing /><Footer /></>} />
        <Route path="/services" element={<><Navbar /><Services /><Footer /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/verification-code" element={<VerificationCode />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  )
}

export default App
