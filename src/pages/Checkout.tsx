import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, CreditCard, CheckCircle2, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

interface Tour {
  id: string;
  title: string;
  price: number;
  location: string;
}

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loginWithGoogle } = useAuth();
  
  const tourId = searchParams.get('tourId');
  const peopleCount = parseInt(searchParams.get('people') || '1');
  const selectedDate = searchParams.get('date') || '';

  const [step, setStep] = useState(1);
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    specialRequests: ''
  });

  useEffect(() => {
    const fetchTour = async () => {
      if (!tourId) return;
      try {
        setLoading(true);
        const tourDoc = await getDoc(doc(db, 'tours', tourId));
        if (tourDoc.exists()) {
          setTour({ id: tourDoc.id, ...tourDoc.data() } as Tour);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `tours/${tourId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      await loginWithGoogle();
      return;
    }

    try {
      setIsSubmitting(true);
      const bookingData = {
        userId: user.uid,
        tourId,
        tourTitle: tour?.title,
        peopleCount,
        selectedDate,
        totalPrice: (tour?.price || 0) * peopleCount + 12,
        customerInfo: formData,
        status: 'confirmed',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'bookings'), bookingData);
      setStep(3);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tour not found</h2>
          <Link to="/guides" className="text-teal-600 font-bold hover:underline">Back to all experiences</Link>
        </div>
      </div>
    );
  }

  const subtotal = tour.price * peopleCount;
  const serviceFee = 12;
  const total = subtotal + serviceFee;

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 max-w-md mx-auto relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-all duration-500",
                step >= s ? "bg-teal-600 text-white scale-110 shadow-lg" : "bg-white text-slate-400 border-2 border-slate-200"
              )}
            >
              {step > s ? <CheckCircle2 size={20} /> : s}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100"
                >
                  <h2 className="text-3xl font-black mb-8">Traveler Details</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:ring-2 focus:ring-teal-500 outline-none"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:ring-2 focus:ring-teal-500 outline-none"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:ring-2 focus:ring-teal-500 outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:ring-2 focus:ring-teal-500 outline-none"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Special Requests (Optional)</label>
                      <textarea 
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                      />
                    </div>
                  </form>
                  <div className="mt-12 flex justify-end">
                    <button 
                      onClick={handleNext}
                      className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-teal-600 transition-all flex items-center gap-2"
                    >
                      Continue to Payment <ArrowRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100"
                >
                  <h2 className="text-3xl font-black mb-8">Secure Payment</h2>
                  
                  {!user && (
                    <div className="mb-8 p-6 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-4">
                      <AlertCircle className="text-orange-500 shrink-0" size={24} />
                      <div>
                        <h4 className="font-bold text-orange-900 mb-1">Login Required</h4>
                        <p className="text-orange-700 text-sm mb-4">You need to be logged in to complete your booking.</p>
                        <button 
                          onClick={loginWithGoogle}
                          className="px-6 py-2 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all text-sm"
                        >
                          Login with Google
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="p-6 border-2 border-teal-600 rounded-2xl bg-teal-50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm">
                          <CreditCard size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Credit / Debit Card</p>
                          <p className="text-xs text-slate-500">Pay securely with your card</p>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full border-4 border-teal-600 bg-white" />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Expiry Date</label>
                          <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">CVV</label>
                          <input type="text" placeholder="123" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 flex items-center gap-3 text-slate-400 text-sm">
                      <ShieldCheck size={20} className="text-teal-600" />
                      <span>Your payment information is encrypted and secure.</span>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-between">
                    <button 
                      onClick={handleBack}
                      className="px-8 py-4 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                      <ArrowLeft size={20} /> Back
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting || !user}
                      className="px-10 py-4 bg-teal-600 text-white font-black rounded-2xl hover:bg-teal-700 transition-all flex items-center gap-2 shadow-xl shadow-teal-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                      Confirm & Pay ${total}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-12 md:p-20 rounded-[3rem] shadow-sm border border-slate-100 text-center"
                >
                  <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-4xl font-black mb-4">Booking Confirmed!</h2>
                  <p className="text-slate-500 text-lg mb-12 max-w-md mx-auto">
                    Your adventure is ready. We've sent the confirmation details and itinerary to your email.
                  </p>
                  <div className="flex flex-col md:flex-row justify-center gap-4">
                    <Link to="/" className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-teal-600 transition-all">
                      Back to Home
                    </Link>
                    <button className="px-10 py-4 bg-slate-50 text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all">
                      View My Bookings
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 sticky top-28">
              <h3 className="text-xl font-black mb-6">Order Summary</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80&w=200" alt="Tour" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-tight mb-1">{tour.title}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{tour.location}</p>
                  </div>
                </div>

                <div className="space-y-3 py-6 border-y border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Date</span>
                    <span className="font-bold">{selectedDate || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Travelers</span>
                    <span className="font-bold">{peopleCount} People</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-bold">${subtotal}.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Service Fee</span>
                    <span className="font-bold">${serviceFee}.00</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-slate-900 pt-4">
                    <span>Total</span>
                    <span>${total}.00</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
                <p className="text-xs text-teal-700 font-bold text-center">
                  Free cancellation up to 24 hours before the tour starts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
