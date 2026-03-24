import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MapPin, Globe, Clock, CheckCircle2, Heart, Share2, MessageSquare, Calendar, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Guide {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  photoURL: string;
  languages: string[];
  specialties: string[];
  experience: number;
  bio: string;
  isVerified: boolean;
}

export default function GuideProfile() {
  const { id } = useParams();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchGuide = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const guideDoc = await getDoc(doc(db, 'guides', id));
        if (guideDoc.exists()) {
          setGuide({ id: guideDoc.id, ...guideDoc.data() } as Guide);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `guides/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Guide not found</h2>
          <Link to="/guides" className="text-teal-600 font-bold hover:underline">Back to all guides</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full -mr-32 -mt-32 opacity-50" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="relative shrink-0">
                  <img 
                    src={guide.photoURL} 
                    alt={guide.name} 
                    className="w-40 h-40 md:w-56 md:h-56 rounded-[2.5rem] object-cover border-8 border-white shadow-xl"
                  />
                  {guide.isVerified && (
                    <div className="absolute -bottom-4 -right-4 bg-teal-600 text-white p-3 rounded-2xl shadow-lg border-4 border-white">
                      <CheckCircle2 size={24} />
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">{guide.name}</h1>
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <MapPin size={18} className="text-teal-600" />
                        <span>{guide.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className={cn(
                          "p-3 rounded-2xl border transition-all",
                          isWishlisted ? "bg-red-50 border-red-100 text-red-500" : "bg-slate-50 border-slate-100 text-slate-400 hover:text-red-500"
                        )}
                      >
                        <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                      </button>
                      <button className="p-3 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl hover:text-teal-600 transition-all">
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm">
                      <Star size={16} className="fill-orange-500" />
                      {guide.rating} ({guide.reviewCount} Reviews)
                    </div>
                    <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm">
                      <Globe size={16} />
                      {guide.languages.join(', ')}
                    </div>
                    <div className="bg-slate-50 text-slate-700 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm">
                      <Clock size={16} />
                      {guide.experience} Years Experience
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-grow md:flex-none px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-teal-600 transition-all flex items-center justify-center gap-2">
                      <MessageSquare size={20} /> Message Elena
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900">About Me</h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                {guide.bio}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-slate-900">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {guide.specialties.map(s => (
                      <span key={s} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-slate-900">Verified Skills</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <CheckCircle2 size={18} className="text-teal-600" /> First Aid Certified
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <CheckCircle2 size={18} className="text-teal-600" /> Professional License
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <CheckCircle2 size={18} className="text-teal-600" /> Historical Expert
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Gallery Placeholder */}
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-8">My Adventures</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-square rounded-[2rem] overflow-hidden bg-slate-200">
                    <img 
                      src={`https://picsum.photos/seed/guide-${guide.id}-${i}/400/400`} 
                      alt="Adventure" 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-100 sticky top-28">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Starting from</p>
                  <h3 className="text-4xl font-black text-slate-900">${guide.price}<span className="text-lg text-slate-400 font-bold">/hr</span></h3>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-orange-500 font-bold">
                    <Star size={16} fill="currentColor" /> {guide.rating}
                  </div>
                  <p className="text-xs text-slate-400 font-bold">{guide.reviewCount} Reviews</p>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="date" 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:ring-2 focus:ring-teal-500 outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Base Rate (2 hrs min)</span>
                    <span className="font-bold">${guide.price * 2}.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Service Fee</span>
                    <span className="font-bold">$12.00</span>
                  </div>
                  <hr className="border-slate-200" />
                  <div className="flex justify-between text-xl font-black text-slate-900 pt-2">
                    <span>Total</span>
                    <span>${(guide.price * 2) + 12}.00</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-teal-100 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Book Elena
              </button>
              
              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <ShieldCheck size={18} className="text-teal-600" />
                  <span>Secure Payment Guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Clock size={18} className="text-teal-600" />
                  <span>Instant Confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
