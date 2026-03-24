import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, DollarSign, Globe, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function BecomeGuide() {
  const { user, loginWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    location: '',
    experience: '',
    languages: '',
    specialties: '',
    bio: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      await loginWithGoogle();
      return;
    }

    try {
      setIsSubmitting(true);
      const applicationData = {
        userId: user.uid,
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'guide_applications'), applicationData);
      setIsSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'guide_applications');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="pt-32 pb-20 px-4 md:px-8 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl bg-white p-12 md:p-20 rounded-[3rem] shadow-sm border border-slate-100 text-center">
          <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-black mb-4">Application Received!</h2>
          <p className="text-slate-500 text-lg mb-12">
            Thank you for applying to become a guide with GUIDE KAROO. Our team will review your application and get back to you within 3-5 business days.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-teal-600 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <span className="text-teal-600 font-black uppercase tracking-widest text-sm mb-4 block">Join Our Community</span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight">
              Turn Your Passion <br /> Into <span className="text-teal-600">Profit.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              Share your local knowledge, meet travelers from around the world, and earn money doing what you love.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: <DollarSign className="text-teal-600" />, title: 'Earn Extra Income', desc: 'Set your own rates and keep 90% of your earnings.' },
                { icon: <Globe className="text-teal-600" />, title: 'Global Reach', desc: 'Connect with travelers from over 150 countries.' },
                { icon: <ShieldCheck className="text-teal-600" />, title: 'Secure Payments', desc: 'Get paid instantly after every successful tour.' },
                { icon: <CheckCircle2 className="text-teal-600" />, title: 'Flexible Schedule', desc: 'Be your own boss and work whenever you want.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-50" />
            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=1000" 
                alt="Happy Guide" 
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Apply Now</h2>
              <p className="text-slate-500 font-medium">Fill out the form below to start your journey as a local guide.</p>
            </div>

            {!user && (
              <div className="mb-12 p-8 bg-orange-50 rounded-[2rem] border border-orange-100 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <AlertCircle className="text-orange-500 shrink-0" size={48} />
                <div className="flex-grow">
                  <h4 className="text-xl font-bold text-orange-900 mb-2">Authentication Required</h4>
                  <p className="text-orange-700 mb-4">You need to be logged in to submit your application. This helps us verify your identity.</p>
                  <button 
                    onClick={loginWithGoogle}
                    className="px-8 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
                  >
                    Login with Google
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Location (City, Country)</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    placeholder="Barcelona, Spain"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Years of Experience</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    placeholder="e.g. 5"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Languages Spoken</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    placeholder="English, Spanish, French"
                    value={formData.languages}
                    onChange={(e) => setFormData({...formData, languages: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Specialties (e.g. History, Food, Hiking)</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  placeholder="History, Architecture, Photography"
                  value={formData.specialties}
                  onChange={(e) => setFormData({...formData, specialties: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Tell us about yourself</label>
                <textarea 
                  rows={6}
                  required
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                  placeholder="Share your passion and why you want to be a guide..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>

              <div className="pt-8">
                <button 
                  type="submit"
                  disabled={isSubmitting || !user}
                  className="w-full py-6 bg-teal-600 hover:bg-teal-700 text-white font-black text-xl rounded-[2rem] shadow-xl shadow-teal-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <ArrowRight size={24} />}
                  Submit Application
                </button>
                <p className="text-center text-slate-400 text-sm mt-6">
                  By submitting, you agree to our <Link to="#" className="text-teal-600 hover:underline">Terms of Service</Link> and <Link to="#" className="text-teal-600 hover:underline">Privacy Policy</Link>.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
