import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EmailFloat from "./components/EmailFloat";
import MobileActionBar from "./components/MobileActionBar";

import Home from "./pages/Home";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ToursPage from "./pages/ToursPage";
import BookingPage from "./pages/BookingPage";
import PaymentReturnPage from "./pages/PaymentReturnPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import BlogPage from "./pages/BlogPage";

export default function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/assessment" element={<Navigate to="/booking" replace />} />
          <Route path="/payment/return" element={<PaymentReturnPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>

      <Footer />
      <EmailFloat />
      <MobileActionBar />
    </div>
  );
}
