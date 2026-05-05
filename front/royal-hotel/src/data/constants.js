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
  name:     "Royal Hotel",
  tagline:  "Où l'élégance rencontre le confort",
  phone:    "+225 07 04 63 63 63",
  phone2:   "+225 01 51 81 92 14",
  email:    "royalhotelgb@gmail.com",
  address:  "Grand-Bassam, Côte d'Ivoire",
  facebook: "https://www.facebook.com/royalhotelgb",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d640.4203918100485!2d-3.735993877436686!3d5.202677006922828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc20315ff23236f%3A0xfb0025528ed4fc5a!2sRoyal%20Hotel%20Groupe!5e1!3m2!1sfr!2sci!4v1776344646801!5m2!1sfr!2sci",
};

// ─── Images ──────────────────────────────────────────────────────────────────
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
};

// ─── Navigation ───────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { id: "accueil",     label: "Accueil" },
  { id: "apropos",     label: "À Propos" },
  { id: "services",    label: "Services" },
  { id: "galerie",     label: "Galerie" },
  { id: "temoignages", label: "Témoignages" },
  { id: "contact",     label: "Contact" },
];

// ─── Services ─────────────────────────────────────────────────────────────────
export const SERVICES = [
  {
    icon:    "Bed",
    number:  "01",
    title:   "Hébergement",
    desc:    "14 chambres confortables dans un cadre calme et reposant. Ventilées ou climatisées, chaque chambre est pensée pour votre bien-être et votre repos.",
    detail:  "Cadre calme · Ventilée ou Climatisée · 14 chambres disponibles",
  },
  {
    icon:    "GlassWater",
    number:  "02",
    title:   "Bar & Boissons",
    desc:    "Profitez de nos boissons fraîches, sodas, jus de fruits et boissons alcoolisées dans une ambiance conviviale et chaleureuse.",
    detail:  "Boissons fraîches · Jus naturels · Ambiance conviviale",
  },
  {
    icon:    "ShoppingBag",
    number:  "03",
    title:   "Livraison de Repas",
    desc:    "Faites-vous livrer vos repas directement dans votre chambre. Notre équipe vous apporte la nourriture de votre choix avec sourire et rapidité.",
    detail:  "Livraison en chambre · Repas au choix · Service rapide",
  },
];

// ─── Types de chambres (modal de réservation) ─────────────────────────────────
export const ROOM_TYPES = [
  {
    id:       "ventilee",
    label:    "Chambre Ventilée",
    price:    7000,
    type:     "Ventilée",
    desc:     "Chambre confortable avec ventilateur, idéale pour un séjour à budget maîtrisé.",
    features: ["Ventilateur", "Eau chaude", "TV", "Wi-Fi"],
  },
  {
    id:       "clim-confort",
    label:    "Chambre Confort",
    price:    12000,
    type:     "Climatisée",
    desc:     "Climatisation et équipements de confort pour un séjour agréable.",
    features: ["Climatisation", "Eau chaude", "TV", "Wi-Fi"],
  },
  {
    id:       "clim-standard",
    label:    "Chambre Standard",
    price:    15000,
    type:     "Climatisée",
    desc:     "Plus d'espace et de confort avec un design soigné.",
    features: ["Climatisation", "Minibar", "TV HD", "Wi-Fi"],
  },
  {
    id:       "clim-superieure",
    label:    "Chambre Supérieure",
    price:    20000,
    type:     "Climatisée",
    desc:     "Design raffiné et capacité supérieure pour plus d'espace et de confort.",
    features: ["Climatisation", "Design premium", "TV 4K", "Wi-Fi"],
  },
  {
    id:       "clim-deluxe",
    label:    "Chambre Deluxe",
    price:    25000,
    type:     "Climatisée",
    desc:     "Le summum du confort disponible, literie haut de gamme et vue extérieure.",
    features: ["Climatisation", "Literie luxe", "Vue extérieure", "Wi-Fi"],
  },
  {
    id:       "test-200",
    label:    "Chambre Test",
    price:    200,
    type:     "Test",
    desc:     "Chambre de test — 200 FCFA pour vérifier le système de paiement.",
    features: ["Test uniquement"],
  },
];

// ─── Témoignages ──────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    name:    "Sophie Marchetti",
    country: "France 🇫🇷",
    rating:  5,
    text:    "Un hôtel absolument magnifique. Le service était impeccable et l'attention portée aux détails était remarquable. Nous avons adoré chaque instant de notre séjour à Grand-Bassam.",
    avatar:  "SM",
  },
  {
    name:    "James Okafor",
    country: "Nigeria 🇳🇬",
    rating:  5,
    text:    "La meilleure expérience hôtelière que j'aie vécue en Afrique de l'Ouest. Le personnel a tout fait pour rendre notre séjour inoubliable. Le cadre est vraiment exceptionnel !",
    avatar:  "JO",
  },
  {
    name:    "Amina Koné",
    country: "Côte d'Ivoire 🇨🇮",
    rating:  5,
    text:    "Un séjour d'exception au Royal Hotel. L'équipe est professionnelle, le cadre est sublime et l'ambiance est parfaitement calme et reposante. Je recommande vivement à tous !",
    avatar:  "AK",
  },
  {
    name:    "Lukas Becker",
    country: "Allemagne 🇩🇪",
    rating:  5,
    text:    "Emplacement exceptionnel et chambres magnifiques. Mon séjour au Royal Hotel a été l'un des moments forts de mon voyage en Côte d'Ivoire. Je reviendrai sans hésiter.",
    avatar:  "LB",
  },
  {
    name:    "Fatou Diallo",
    country: "Sénégal 🇸🇳",
    rating:  5,
    text:    "Séjour parfait pour des vacances en famille. Le cadre est calme et reposant, les enfants ont adoré. Le personnel est chaleureux et très attentionné. On reviendra certainement !",
    avatar:  "FD",
  },
];

// ─── Stats (section À Propos) ─────────────────────────────────────────────────
export const STATS = [
  { value: 14, suffix: "",  label: "Chambres" },
  { value: 19, suffix: "+", label: "Ans d'expérience" },
  { value: 98, suffix: "%", label: "Satisfaction client" },
  { value: 24, suffix: "h", label: "Service continu" },
];
