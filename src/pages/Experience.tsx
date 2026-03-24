import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MapPin, Clock, Users, Check, Calendar, ArrowRight, Info, ShieldCheck, X, Loader2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Tour {
  id: string;
  title: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  duration: string;
  groupSize: string;
  images: string[];
  itinerary: { time: string; title: string; desc: string }[];
  includes: string[];
  excludes: string[];
  guideId: string;
}

export default function Experience() {
  const { id } = useParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [peopleCount, setPeopleCount] = useState(2);

  useEffect(() => {
    const fetchTour = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const tourDoc = await getDoc(doc(db, 'tours', id));
        if (tourDoc.exists()) {
          setTour({ id: tourDoc.id, ...tourDoc.data() } as Tour);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `tours/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

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
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Experience not found</h2>
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
      <div className="max-w-7xl mx-auto">
        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[500px]">
          <div className="md:col-span-2 h-full rounded-[2.5rem] overflow-hidden shadow-lg">
            <img src={tour.images[0]} alt="Tour" className="w-full h-full object-cover" />
          </div>
          <div className="md:col-span-1 h-full flex flex-col gap-4">
            <div className="h-1/2 rounded-[2.5rem] overflow-hidden shadow-lg">
              <img src={tour.images[1]} alt="Tour" className="w-full h-full object-cover" />
            </div>
            <div className="h-1/2 rounded-[2.5rem] overflow-hidden shadow-lg">
              <img src={tour.images[2]} alt="Tour" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-1 h-full rounded-[2.5rem] overflow-hidden shadow-lg relative">
            <img src={tour.images[0]} alt="Tour" className="w-full h-full object-cover blur-sm" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button className="text-white font-bold flex items-center gap-2 hover:scale-105 transition-all">
                View All Photos
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="flex items-center gap-2 text-teal-600 font-bold mb-4">
                <MapPin size={18} />
                <span>{tour.location}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{tour.title}</h1>
              
              <div className="flex flex-wrap gap-6 py-6 border-y border-slate-200">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                    <p className="font-bold text-slate-700">{tour.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Group Size</p>
                    <p className="font-bold text-slate-700">{tour.groupSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star size={20} className="text-orange-400 fill-orange-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</p>
                    <p className="font-bold text-slate-700">{tour.rating} ({tour.reviewCount} reviews)</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Experience Description</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                {tour.description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-8 text-slate-900">Itinerary</h2>
              <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {tour.itinerary.map((item, i) => (
                  <div key={i} className="relative pl-10">
                    <div className="absolute left-0 top-1.5 w-6 h-6 bg-white border-4 border-teal-600 rounded-full z-10" />
                    <span className="text-xs font-black text-teal-600 uppercase tracking-widest mb-1 block">{item.time}</span>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Check className="text-teal-600" /> What's Included
                </h3>
                <ul className="space-y-4">
                  {tour.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600">
                      <Check size={16} className="text-teal-500 mt-1 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Info className="text-orange-500" /> What's Excluded
                </h3>
                <ul className="space-y-4">
                  {tour.excludes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600">
                      <X size={16} className="text-red-400 mt-1 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 sticky top-28">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Price per person</p>
                  <h3 className="text-4xl font-black text-slate-900">${tour.price}</h3>
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
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Number of People</label>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                      className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-50"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold w-8 text-center">{peopleCount}</span>
                    <button 
                      onClick={() => setPeopleCount(peopleCount + 1)}
                      className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">${tour.price} x {peopleCount} people</span>
                    <span className="font-bold">${subtotal}.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Service Fee</span>
                    <span className="font-bold">${serviceFee}.00</span>
                  </div>
                  <hr className="border-slate-200" />
                  <div className="flex justify-between text-xl font-black text-slate-900 pt-2">
                    <span>Total</span>
                    <span>${total}.00</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/checkout?tourId=${tour.id}&people=${peopleCount}&date=${selectedDate}`}
                className="block w-full text-center py-5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-teal-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Book This Experience
              </Link>
              
              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <ShieldCheck size={18} className="text-teal-600" />
                  <span>Secure Payment Guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Users size={18} className="text-teal-600" />
                  <span>Verified Local Guide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
