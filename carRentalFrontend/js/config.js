/* ═══════════════════════════════════════════
   CONFIG.JS - KONFIGURATION OCH KONSTANTER
═══════════════════════════════════════════ */

// API-adress
const API = 'http://localhost:8080/api/v1';

// Global session-objekt
let session = {
  username: null,
  password: null,
  userId: null,
  isAdmin: false,
};

// Navigeringsmeny för kunder
const customerNav = [
  { id: 'cars', icon: '🚗', label: 'Bilar' },
  { id: 'my-bookings', icon: '📋', label: 'Mina bokningar' },
  { id: 'profile', icon: '👤', label: 'Profil' },
];

// Navigeringsmeny för admins
const adminNav = [
  { id: 'cars', icon: '🚗', label: 'Bilar' },
  { id: 'admin-bookings', icon: '📋', label: 'Bokningar' },
  { id: 'admin-users', icon: '👥', label: 'Användare' },
  { id: 'admin-cars', icon: '🔧', label: 'Hantera bilar' },
  { id: 'profile', icon: '👤', label: 'Profil' },
];

// Standardbilar (fallback om API inte svarar)
const defaultCars = [
  {
    id: 2,
    name: 'Corvette',
    model: 'Z06',
    type: 'Sport',
    price: 3999,
    feature1: 'AC',
    feature2: 'Eluppvärmda backspeglar',
    feature3: 'CD växlare',
    booked: false,
    imagePath: 'http://localhost:8080/images/corvetteZ06.jpg'
  },
  {
    id: 3,
    name: 'Peugeot',
    model: 'Traveller',
    type: 'Familjebuss',
    price: 2599,
    feature1: '8-sits',
    feature2: 'Dubbla sidoskjutdörrar',
    feature3: 'Adaptiv farthållare',
    booked: true,
    imagePath: 'http://localhost:8080/images/peugeotTraveller.jpg'
  },
  {
    id: 5,
    name: 'Skoda',
    model: 'Superb',
    type: 'Kombi',
    price: 1999,
    feature1: 'Rattvärme',
    feature2: 'Dragkrok',
    feature3: 'Keyless',
    booked: false,
    imagePath: 'http://localhost:8080/images/skodaSuperb.jpg'
  },
  {
    id: 6,
    name: 'Skoda',
    model: 'Enyaq',
    type: 'El',
    price: 2499,
    feature1: 'Snabbladdning (DC)',
    feature2: 'Vägmärkesidentifiering',
    feature3: 'Filhållningsassistent',
    booked: true,
    imagePath: 'http://localhost:8080/images/skodaEnyaq.jpg'
  },
  {
    id: 8,
    name: 'BMW',
    model: 'M440i',
    type: 'Coupe',
    price: 1295,
    feature1: 'Automat',
    feature2: 'Sport',
    feature3: 'GPS',
    booked: false,
    imagePath: 'http://localhost:8080/images/BMWM4401.jpg'
  },
  {
    id: 9,
    name: 'Mercedes-Benz',
    model: 'Marco Polo 300',
    type: 'Husbil',
    price: 1890,
    feature1: 'Sovplatser',
    feature2: 'Kök',
    feature3: 'Dusch',
    booked: false,
    imagePath: 'http://localhost:8080/images/MercedesBenzMarcoPolo300.jpg'
  },
  {
    id: 10,
    name: 'Nissan',
    model: 'Juke',
    type: 'Liten SUV',
    price: 695,
    feature1: 'Kompakt',
    feature2: 'Sparsam',
    feature3: 'GPS',
    booked: false,
    imagePath: 'http://localhost:8080/images/NissanJuke.jpg'
  },
  {
    id: 11,
    name: 'Volkswagen',
    model: 'Buzz',
    type: 'Kombi',
    price: 1190,
    feature1: 'Retro Design',
    feature2: 'El-motor',
    feature3: 'Spacious',
    booked: false,
    imagePath: 'http://localhost:8080/images/volkswagenBuzz.jpg'
  }
];

// Mapping för bildvägar när API inte returnerar imagePath
const imageMap = {
  8: 'http://localhost:8080/images/BMWM4401.jpg',
  2: 'http://localhost:8080/images/corvetteZ06.jpg',
  9: 'http://localhost:8080/images/MercedesBenzMarcoPolo300.jpg',
  10: 'http://localhost:8080/images/NissanJuke.jpg',
  3: 'http://localhost:8080/images/peugeotTraveller.jpg',
  6: 'http://localhost:8080/images/skodaEnyaq.jpg',
  5: 'http://localhost:8080/images/skodaSuperb.jpg',
  11: 'http://localhost:8080/images/volkswagenBuzz.jpg'
};