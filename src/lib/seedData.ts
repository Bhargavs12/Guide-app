import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, limit } from 'firebase/firestore';

const MOCK_GUIDES = [
  {
    name: 'Elena Rodriguez',
    location: 'Barcelona, Spain',
    rating: 4.9,
    reviewCount: 124,
    price: 35,
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    languages: ['English', 'Spanish', 'Catalan'],
    specialties: ['History', 'Architecture', 'Food'],
    experience: 5,
    bio: "I'm a local historian with a passion for Barcelona's hidden stories. Let me show you the city through my eyes!",
    isVerified: true
  },
  {
    name: 'Kenji Tanaka',
    location: 'Kyoto, Japan',
    rating: 5.0,
    reviewCount: 89,
    price: 45,
    photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    languages: ['English', 'Japanese'],
    specialties: ['Culture', 'Temples', 'Photography'],
    experience: 8,
    bio: "Born and raised in Kyoto, I specialize in traditional culture and finding the best light for your travel photos.",
    isVerified: true
  },
  {
    name: 'Sarah Jenkins',
    location: 'Cape Town, SA',
    rating: 4.8,
    reviewCount: 210,
    price: 30,
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    languages: ['English', 'Afrikaans'],
    specialties: ['Nature', 'Hiking', 'Wine'],
    experience: 4,
    bio: "Adventure seeker and wine enthusiast. I'll take you off the beaten path to see the best of the Cape.",
    isVerified: true
  }
];

const MOCK_TOURS = [
  {
    title: 'Gothic Quarter Secret Stories & Tapas',
    description: 'Discover the hidden history of Barcelona\'s oldest neighborhood and enjoy authentic tapas at local-only spots.',
    location: 'Barcelona, Spain',
    rating: 4.9,
    reviewCount: 86,
    price: 65,
    duration: '4 Hours',
    groupSize: 'Max 8 people',
    images: [
      'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&q=80&w=800'
    ],
    itinerary: [
      { time: '10:00 AM', title: 'Meeting at Plaça de Catalunya', desc: 'Brief introduction and historical context of the city.' },
      { time: '11:00 AM', title: 'The Jewish Quarter', desc: 'Explore the narrowest streets and hidden synagogues.' },
      { time: '12:30 PM', title: 'Cathedral of Barcelona', desc: 'Admire the Gothic architecture and learn about the city\'s patron saint.' },
      { time: '01:30 PM', title: 'Tapas Tasting', desc: 'Visit a 100-year-old bodega for authentic local flavors.' }
    ],
    includes: ['Professional local guide', '3 Tapas & 2 Drinks', 'Historical map', 'Small group experience'],
    excludes: ['Hotel pickup/drop-off', 'Additional food/drinks', 'Gratuities']
  }
];

export async function seedInitialData() {
  try {
    const guidesSnap = await getDocs(query(collection(db, 'guides'), limit(1)));
    if (guidesSnap.empty) {
      console.log('Seeding initial data...');
      
      // Seed Guides
      for (const guide of MOCK_GUIDES) {
        const guideRef = await addDoc(collection(db, 'guides'), {
          ...guide,
          createdAt: serverTimestamp()
        });
        
        // Seed a tour for the first guide
        if (guide.name === 'Elena Rodriguez') {
          for (const tour of MOCK_TOURS) {
            await addDoc(collection(db, 'tours'), {
              ...tour,
              guideId: guideRef.id,
              createdAt: serverTimestamp()
            });
          }
        }
      }
      console.log('Seeding complete!');
    }
  } catch (error: any) {
    // Silently ignore permission errors during seeding as they are expected for non-admin users
    if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
      console.warn('Seeding skipped: Missing permissions. This is expected for non-admin users.');
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, 'seeding');
  }
}
