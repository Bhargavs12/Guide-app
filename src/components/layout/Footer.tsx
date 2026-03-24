import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Compass size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              GUIDE <span className="text-teal-600">KAROO</span>
            </span>
          </Link>
          <p className="text-slate-400 leading-relaxed">
            Connecting travelers with verified local guides for authentic, unforgettable experiences across the globe.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-teal-500 transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-teal-500 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-teal-500 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-teal-500 transition-colors"><Youtube size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li><Link to="/guides" className="hover:text-teal-500 transition-colors">Find a Guide</Link></li>
            <li><Link to="/guides" className="hover:text-teal-500 transition-colors">Popular Tours</Link></li>
            <li><Link to="/become-guide" className="hover:text-teal-500 transition-colors">Become a Guide</Link></li>
            <li><Link to="/contact" className="hover:text-teal-500 transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-bold mb-6">Support</h4>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-teal-500 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-teal-500 transition-colors">Safety Guidelines</a></li>
            <li><a href="#" className="hover:text-teal-500 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-teal-500 transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={20} className="text-teal-500 shrink-0" />
              <span>123 Travel Lane, Adventure City, World 45678</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={20} className="text-teal-500 shrink-0" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={20} className="text-teal-500 shrink-0" />
              <span>hello@guidekaroo.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} GUIDE KAROO. All rights reserved. Explore responsibly.</p>
      </div>
    </footer>
  );
}
