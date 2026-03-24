import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Search, MapPin, Calendar, Users, Star, ShieldCheck, Globe, ArrowRight, Play, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { seedInitialData } from '../lib/seedData';

interface Guide {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  photoURL: string;
  specialties: string[];
}

interface Tour {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  images: string[];
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredGuides, setFeaturedGuides] = useState<Guide[]>([]);
  const [popularTours, setPopularTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Try seeding, but don't let it block the page if it fails
        try {
          await seedInitialData();
        } catch (e) {
          console.warn('Initial seeding failed, continuing to fetch data...', e);
        }
        
        const guidesRef = collection(db, 'guides');
        const guidesQuery = query(guidesRef, limit(4));
        const guidesSnapshot = await getDocs(guidesQuery);
        setFeaturedGuides(guidesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Guide)));

        const toursRef = collection(db, 'tours');
        const toursQuery = query(toursRef, limit(3));
        const toursSnapshot = await getDocs(toursQuery);
        setPopularTours(toursSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tour)));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'home-data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        <motion.div style={{ y: y1, opacity }} className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000" 
            alt="Travel Hero" 
            className="w-full h-full object-cover opacity-60 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-slate-900" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 bg-teal-500/20 backdrop-blur-md border border-teal-500/30 text-teal-400 rounded-full text-sm font-black uppercase tracking-widest mb-6">
              Verified Local Guides Worldwide
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight tracking-tighter">
              Explore Like <br /> <span className="text-teal-400">A Local.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-2xl mx-auto font-medium">
              Book verified local guides for authentic experiences you won't find in any guidebook.
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-2xl p-2 rounded-[2.5rem] border border-white/20 shadow-2xl">
              <div className="bg-white rounded-[2rem] p-2 flex flex-col md:flex-row items-center gap-2">
                <div className="flex-grow flex items-center px-6 py-4 gap-4 border-r border-slate-100">
                  <MapPin className="text-teal-600" size={24} />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                    <input 
                      type="text" 
                      placeholder="Where are you going?" 
                      className="w-full bg-transparent outline-none font-bold text-slate-800 placeholder:text-slate-300"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="hidden md:flex flex-grow items-center px-6 py-4 gap-4 border-r border-slate-100">
                  <Calendar className="text-teal-600" size={24} />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                    <p className="font-bold text-slate-800">Add dates</p>
                  </div>
                </div>
                <Link 
                  to={`/guides?q=${searchQuery}`}
                  className="w-full md:w-auto px-10 py-5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-teal-500/20"
                >
                  <Search size={20} />
                  Search
                </Link>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-slate-900" alt="User" />
                  ))}
                </div>
                <div className="text-left ml-2">
                  <div className="flex text-orange-400">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-xs font-bold">10k+ Happy Travelers</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/20 hidden md:block" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-teal-400" size={24} />
                <span className="text-sm font-bold">100% Verified Guides</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Featured Guides */}
      <section className="py-32 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-teal-600 font-black uppercase tracking-widest text-sm mb-4 block">Top Rated</span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                Meet Our Most <br /> <span className="text-teal-600">Expert Guides.</span>
              </h2>
            </div>
            <Link to="/guides" className="group flex items-center gap-3 font-black text-xl text-slate-900 hover:text-teal-600 transition-all">
              View All Guides <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredGuides.map((guide, i) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <Link to={`/guide/${guide.id}`}>
                    <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl">
                      <img 
                        src={guide.photoURL} 
                        alt={guide.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <button className="w-full py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-teal-500 hover:text-white transition-colors">
                          Book Now
                        </button>
                      </div>
                      <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1 shadow-lg">
                        <Star size={14} className="text-orange-500 fill-orange-500" />
                        <span className="text-xs font-black">{guide.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">{guide.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                      <MapPin size={16} className="text-teal-600" />
                      {guide.location}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Experiences */}
      <section className="py-32 px-4 md:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-teal-600 font-black uppercase tracking-widest text-sm mb-4 block">Trending Now</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900">Popular Experiences</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {popularTours.map((tour, i) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all group border border-slate-100"
                >
                  <Link to={`/experience/${tour.id}`}>
                    <div className="relative h-72 overflow-hidden">
                      <img 
                        src={tour.images[0]} 
                        alt={tour.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-slate-900 shadow-lg">
                        ${tour.price}
                      </div>
                    </div>
                    <div className="p-10">
                      <div className="flex items-center gap-2 text-teal-600 font-black text-xs uppercase tracking-widest mb-4">
                        <MapPin size={14} />
                        {tour.location}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-6 group-hover:text-teal-600 transition-colors leading-tight">
                        {tour.title}
                      </h3>
                      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="flex text-orange-400">
                            {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                          </div>
                          <span className="text-sm font-black text-slate-900">{tour.rating}</span>
                        </div>
                        <span className="text-teal-600 font-black flex items-center gap-1 group-hover:gap-3 transition-all">
                          Book Now <ArrowRight size={18} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-4 md:px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-50" />
              <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=1000" 
                  alt="How it works" 
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                  <button className="w-24 h-24 bg-white text-teal-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                    <Play size={32} fill="currentColor" className="ml-2" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <span className="text-teal-600 font-black uppercase tracking-widest text-sm mb-4 block">Simple Process</span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-12 leading-tight">
                Your Journey <br /> <span className="text-teal-600">Starts Here.</span>
              </h2>

              <div className="space-y-10">
                {[
                  { step: '01', title: 'Find Your Guide', desc: 'Browse hundreds of verified local experts based on your destination and interests.' },
                  { step: '02', title: 'Personalize Experience', desc: 'Chat with your guide to tailor the tour exactly to your preferences and pace.' },
                  { step: '03', title: 'Book & Explore', desc: 'Secure instant booking with our safe payment system and start your adventure.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8">
                    <span className="text-5xl font-black text-slate-100">{item.step}</span>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 mb-2">{item.title}</h4>
                      <p className="text-slate-500 font-medium text-lg leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 p-8 bg-slate-900 rounded-[2.5rem] text-white flex items-center justify-between">
                <div>
                  <p className="text-teal-400 font-black mb-1">Ready to start?</p>
                  <p className="text-slate-400 text-sm">Join 10,000+ happy travelers</p>
                </div>
                <Link to="/guides" className="px-8 py-4 bg-teal-600 hover:bg-teal-700 rounded-2xl font-black transition-all">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto bg-teal-600 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-teal-200">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-48 -mb-48 blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight">Are You a Local Expert?</h2>
            <p className="text-xl md:text-2xl text-teal-50 mb-12 font-medium opacity-90">
              Join our community of passionate guides and share your city's secrets with travelers from around the world.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <Link to="/become-guide" className="px-12 py-6 bg-white text-teal-600 font-black text-xl rounded-2xl hover:bg-teal-50 transition-all shadow-xl">
                Become a Guide
              </Link>
              <Link to="/contact" className="px-12 py-6 bg-teal-700 text-white font-black text-xl rounded-2xl hover:bg-teal-800 transition-all border border-teal-500/30">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
