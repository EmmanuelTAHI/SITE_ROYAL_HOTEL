// ─── Imports images locales ──────────────────────────────────────────────────
import heroImg from '../assets/facade_royal_hotel.png';
import galleryImg001 from '../assets/images/hotel-photo-001.jpg';
import galleryImg002 from '../assets/images/hotel-photo-002.jpg';
import galleryImg003 from '../assets/images/hotel-photo-003.jpg';
import galleryImg004 from '../assets/images/hotel-photo-004.jpg';
import galleryImg005 from '../assets/images/hotel-photo-005.jpg';
import galleryImg006 from '../assets/images/hotel-photo-006.jpg';
import galleryImg007 from '../assets/images/hotel-photo-007.jpg';
import galleryImg008 from '../assets/images/hotel-photo-008.jpg';
import galleryImg009 from '../assets/images/hotel-photo-009.jpg';
import galleryImg010 from '../assets/images/hotel-photo-010.jpg';
import galleryImg011 from '../assets/images/hotel-photo-011.jpg';
import galleryImg012 from '../assets/images/hotel-photo-012.jpg';
import galleryImg013 from '../assets/images/hotel-photo-013.jpg';
import galleryImg014 from '../assets/images/hotel-photo-014.jpg';
import galleryImg015 from '../assets/images/hotel-photo-015.jpg';
import galleryImg016 from '../assets/images/hotel-photo-016.jpg';
import galleryImg017 from '../assets/images/hotel-photo-017.jpg';
import galleryImg018 from '../assets/images/hotel-photo-018.jpg';
import galleryImg019 from '../assets/images/hotel-photo-019.jpg';
import galleryImg020 from '../assets/images/hotel-photo-020.jpg';
import galleryImg021 from '../assets/images/hotel-photo-021.jpg';
import galleryImg022 from '../assets/images/hotel-photo-022.jpg';
import galleryImg023 from '../assets/images/hotel-photo-023.jpg';
import galleryImg024 from '../assets/images/hotel-photo-024.jpg';
import galleryImg025 from '../assets/images/hotel-photo-025.jpg';
import galleryImg026 from '../assets/images/hotel-photo-026.jpg';
import galleryImg027 from '../assets/images/hotel-photo-027.jpg';
import galleryImg028 from '../assets/images/hotel-photo-028.jpg';
import galleryImg029 from '../assets/images/hotel-photo-029.jpg';
import galleryImg030 from '../assets/images/hotel-photo-030.jpg';
import galleryImg031 from '../assets/images/hotel-photo-031.jpg';
import galleryImg032 from '../assets/images/hotel-photo-032.jpg';
import galleryImg033 from '../assets/images/hotel-photo-033.jpg';
import galleryImg034 from '../assets/images/hotel-photo-034.jpg';
import galleryImg035 from '../assets/images/hotel-photo-035.jpg';
import galleryImg036 from '../assets/images/hotel-photo-036.jpg';
import galleryImg037 from '../assets/images/hotel-photo-037.jpg';
import galleryImg038 from '../assets/images/hotel-photo-038.jpg';
import galleryImg039 from '../assets/images/hotel-photo-039.jpg';
import galleryImg040 from '../assets/images/hotel-photo-040.jpg';

// ─── Configuration de l'hôtel ────────────────────────────────────────────────
export const HOTEL = {
  name:    "Royal Hotel",
  tagline: "Où l'élégance rencontre le confort",
  phone:   "+225 27 22 000 000",
  email:   "contact@hotelpalmier.ci",
  address: "Grand-Bassam, Côte d'Ivoire",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d640.4203918100485!2d-3.735993877436686!3d5.202677006922828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc20315ff23236f%3A0xfb0025528ed4fc5a!2sRoyal%20Hotel%20Groupe!5e1!3m2!1sfr!2sci!4v1776344646801!5m2!1sfr!2sci",
};

// ─── Images (Locales) ────────────────────────────────────────────────────────
export const IMAGES = {
  hero:  heroImg,
  about: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1000&q=85",
  gallery: [
    galleryImg001, galleryImg002, galleryImg003, galleryImg004, galleryImg005,
    galleryImg006, galleryImg007, galleryImg008, galleryImg009, galleryImg010,
    galleryImg011, galleryImg012, galleryImg013, galleryImg014, galleryImg015,
    galleryImg016, galleryImg017, galleryImg018, galleryImg019, galleryImg020,
    galleryImg021, galleryImg022, galleryImg023, galleryImg024, galleryImg025,
    galleryImg026, galleryImg027, galleryImg028, galleryImg029, galleryImg030,
    galleryImg031, galleryImg032, galleryImg033, galleryImg034, galleryImg035,
    galleryImg036, galleryImg037, galleryImg038, galleryImg039, galleryImg040,
  ],
  rooms: [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=700&q=80",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=700&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80",
  ],
};

// ─── Navigation ───────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { id: "accueil",      label: "Accueil" },
  { id: "apropos",      label: "À Propos" },
  { id: "services",     label: "Services" },
  { id: "galerie",      label: "Galerie" },
  { id: "chambres",     label: "Chambres" },
  { id: "temoignages",  label: "Témoignages" },
  { id: "contact",      label: "Contact" },
];

// ─── Services ─────────────────────────────────────────────────────────────────
export const SERVICES = [
  {
    icon:  "Bed",
    title: "Chambres & Suites",
    desc:  "Des espaces raffinés avec vue panoramique et équipements haut de gamme pour un repos parfait.",
  },
  {
    icon:  "UtensilsCrossed",
    title: "Restaurant Gastronomique",
    desc:  "Saveurs locales et internationales sublimées par nos chefs dans un cadre d'exception.",
  },
  {
    icon:  "Waves",
    title: "Piscine & Spa",
    desc:  "Détente absolue avec piscine à débordement, hammam et soins bien-être personnalisés.",
  },
  {
    icon:  "CalendarHeart",
    title: "Salles d'Événements",
    desc:  "Espaces modulables et entièrement équipés pour séminaires, mariages et réceptions.",
  },
  {
    icon:  "Car",
    title: "Service de Navette",
    desc:  "Transferts aéroport et excursions sur demande, disponibles 24h/24 et 7j/7.",
  },
  {
    icon:  "Wifi",
    title: "Wi-Fi Premium",
    desc:  "Connexion haut débit ultra-rapide dans toutes les chambres et espaces communs.",
  },
];

// ─── Chambres ─────────────────────────────────────────────────────────────────
export const ROOMS = [
  {
    image:    IMAGES.rooms[0],
    category: "Standard",
    title:    "Chambre Standard",
    desc:     "Chambre confortable avec vue sur jardin, lit queen size, climatisation et minibar.",
    price:    "75 000",
    currency: "FCFA",
    perNight: "/ nuit",
    features: ["Queen Bed", "Wi-Fi", "Climatisation", "Minibar"],
    badge:    null,
  },
  {
    image:    IMAGES.rooms[1],
    category: "Deluxe",
    title:    "Chambre Deluxe",
    desc:     "Chambre spacieuse avec balcon et vue sur la piscine, baignoire balnéo et écran 55''.",
    price:    "120 000",
    currency: "FCFA",
    perNight: "/ nuit",
    features: ["King Bed", "Balcon", "Baignoire", "Vue Piscine"],
    badge:    "Populaire",
  },
  {
    image:    IMAGES.rooms[2],
    category: "Suite",
    title:    "Suite Junior",
    desc:     "Suite élégante avec salon séparé, salle de bain en marbre et service en chambre 24h/24.",
    price:    "185 000",
    currency: "FCFA",
    perNight: "/ nuit",
    features: ["King Bed", "Salon", "Marbre", "Room Service"],
    badge:    null,
  },
  {
    image:    IMAGES.rooms[3],
    category: "Prestige",
    title:    "Suite Présidentielle",
    desc:     "Le summum du luxe : double salon, terrasse privée avec jacuzzi, butler personnel dédié.",
    price:    "350 000",
    currency: "FCFA",
    perNight: "/ nuit",
    features: ["King Bed", "Jacuzzi", "Terrasse", "Butler"],
    badge:    "Exclusif",
  },
];

// ─── Témoignages ──────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    name:    "Sophie Marchetti",
    country: "France 🇫🇷",
    rating:  5,
    text:    "Un hôtel absolument magnifique. Le service était impeccable et l'attention portée aux détails était remarquable. Nous avons adoré chaque instant de notre séjour.",
    avatar:  "SM",
  },
  {
    name:    "James Okafor",
    country: "Nigeria 🇳🇬",
    rating:  5,
    text:    "The best hotel experience I've ever had in West Africa. The staff went above and beyond to make our stay memorable. The spa is world-class!",
    avatar:  "JO",
  },
  {
    name:    "Amina Koné",
    country: "Côte d'Ivoire 🇨🇮",
    rating:  5,
    text:    "J'ai organisé le mariage de ma fille ici et tout était parfait. L'équipe est professionnelle, le cadre sublime. Je recommande vivement.",
    avatar:  "AK",
  },
  {
    name:    "Lukas Becker",
    country: "Allemagne 🇩🇪",
    rating:  5,
    text:    "Exceptional location, beautiful rooms and the restaurant is outstanding. The gastronomic experience was one of the highlights of my trip to Abidjan.",
    avatar:  "LB",
  },
  {
    name:    "Fatou Diallo",
    country: "Sénégal 🇸🇳",
    rating:  5,
    text:    "Séjour parfait pour des vacances en famille. La piscine est superbe, les enfants ont adoré. Le personnel est chaleureux et très attentionné.",
    avatar:  "FD",
  },
];

// ─── Stats (section À Propos) ─────────────────────────────────────────────────
export const STATS = [
  { value: 50,  suffix: "+", label: "Chambres" },
  { value: 10,  suffix: "+", label: "Ans d'expérience" },
  { value: 98,  suffix: "%", label: "Satisfaction client" },
  { value: 24,  suffix: "h",  label: "Service continu" },
];
