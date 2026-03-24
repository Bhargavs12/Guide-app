import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Star, MapPin, Globe, Clock, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '../lib/utils';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { seedInitialData } from '../lib/seedData';

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
}

export default function Guides() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(100);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ensure we have some data
        await seedInitialData();
        
        const guidesRef = collection(db, 'guides');
        const q = query(guidesRef, limit(20));
        const querySnapshot = await getDocs(q);
        
        const fetchedGuides: Guide[] = [];
        querySnapshot.forEach((doc) => {
          fetchedGuides.push({ id: doc.id, ...doc.data() } as Guide);
        });
        
        setGuides(fetchedGuides);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'guides');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          guide.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = guide.price <= priceRange;
    return matchesSearch && matchesPrice;
  });

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Your Perfect Guide</h1>
            <p className="text-slate-600">Showing {filteredGuides.length} verified guides worldwide</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search location or guide..."
                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-3 rounded-xl border transition-all flex items-center gap-2 font-bold",
                showFilters ? "bg-teal-600 border-teal-600 text-white" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <SlidersHorizontal size={20} />
              <span className="hidden md:inline">Filters</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={cn(
            "lg:w-72 space-y-8 lg:block",
            showFilters ? "block" : "hidden"
          )}>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Filters</h3>
                <button className="text-teal-600 text-sm font-bold hover:underline">Reset</button>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <div className="flex justify-between mb-4">
                  <span className="text-sm font-bold text-slate-700">Max Price</span>
                  <span className="text-sm font-bold text-teal-600">${priceRange}/hr</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                />
              </div>

              {/* Languages */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Languages</h4>
                <div className="space-y-3">
                  {['English', 'Spanish', 'French', 'Japanese', 'Mandarin'].map((lang) => (
                    <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                      <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Minimum Rating</h4>
                <div className="space-y-3">
                  {[5, 4, 3].map((star) => (
                    <label key={star} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="rating" className="w-5 h-5 border-slate-300 text-teal-600 focus:ring-teal-500" />
                      <div className="flex items-center gap-1">
                        {[...Array(star)].map((_, i) => (
                          <Star key={i} size={14} className="text-orange-400 fill-orange-400" />
                        ))}
                        <span className="text-slate-600 text-sm ml-1">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Recommendation Banner */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <h3 className="font-bold text-lg mb-2">Need Help?</h3>
              <p className="text-teal-100 text-sm mb-4">Let our AI recommend the perfect guide for your interests.</p>
              <button className="w-full bg-white text-teal-700 py-2.5 rounded-xl font-bold text-sm hover:bg-teal-50 transition-colors">
                Get AI Suggestions
              </button>
            </div>
          </aside>

          {/* Guides Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-100">
                <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
                <p className="text-slate-500 font-bold">Finding the best guides for you...</p>
              </div>
            ) : filteredGuides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredGuides.map((guide) => (
                  <motion.div
                    key={guide.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={guide.photoURL}
                        alt={guide.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <Star size={14} className="text-orange-500 fill-orange-500" />
                        <span className="text-xs font-bold">{guide.rating}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 flex flex-wrap gap-1">
                        {guide.specialties?.slice(0, 2).map((s) => (
                          <span key={s} className="bg-black/40 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold group-hover:text-teal-600 transition-colors">{guide.name}</h3>
                        <span className="text-teal-600 font-bold">${guide.price}/hr</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-4">
                        <MapPin size={14} />
                        <span>{guide.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                          <Globe size={14} className="text-teal-500" />
                          <span>{guide.languages?.length || 0} Languages</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                          <Clock size={14} className="text-teal-500" />
                          <span>{guide.experience || 0}y Exp.</span>
                        </div>
                      </div>

                      <Link
                        to={`/guide/${guide.id}`}
                        className="block w-full text-center py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-teal-600 transition-all shadow-md"
                      >
                        View Profile
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                <p className="text-slate-500 font-bold">No guides found matching your criteria.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setPriceRange(100); }}
                  className="mt-4 text-teal-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredGuides.length > 0 && (
              <div className="mt-12 flex justify-center gap-2">
                <button className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">1</button>
                <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:border-teal-600 hover:text-teal-600 transition-all">2</button>
                <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:border-teal-600 hover:text-teal-600 transition-all">3</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
