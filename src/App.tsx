import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Guides from './pages/Guides';
import GuideProfile from './pages/GuideProfile';
import Experience from './pages/Experience';
import Checkout from './pages/Checkout';
import BecomeGuide from './pages/BecomeGuide';
import Contact from './pages/Contact';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/guide/:id" element={<GuideProfile />} />
                <Route path="/experience/:id" element={<Experience />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/become-guide" element={<BecomeGuide />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-center" richColors />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
