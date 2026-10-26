// Business details transcribed from the supplied presentation and flyer.
export const site = {
  name: "Tio Philo Coffee Corner",
  tagline: "Where Every Cup Brings Hearts Together.",
  faithMessage: "A cup of faith, a community of love.",
  description:
    "Where Every Cup Brings Hearts Together. Make every celebration Brew-tiful with Tio Philo Coffee Corner, event coffee packages, and a free Love Wall with every package.",
  phones: [
    { label: "0976-416-1770", href: "tel:+639764161770" },
    { label: "0967-099-1001", href: "tel:+639760991001" },
  ],
  facebookUrl: "https://www.facebook.com/tiophilo",
  facebookName: "TIO PHILO",
  facebookQr: "/brand/tio-philo-facebook-qr.svg",
  flyer: "/brand/tio-philo-flyer-v3.png",
};

// Wording and translation labels reproduced from the updated promotional flyer.
export const verses = [
  {
    text: "When the time is right, I, the Lord, will come quickly. I will make these things happen.",
    reference: "Isaiah 60:22b",
    translation: "ERV",
  },
  {
    text: "Rejoice with those who rejoice, weep with those who weep. Live in harmony with one another.",
    reference: "Romans 12:15–16",
    translation: "ESV",
  },
];

export const flavors = [
  {
    category: "Coffee",
    items: [
      "Americano",
      "Spanish Latte",
      "Caramel Macchiato",
      "White Chocolate Mocha",
      "Roasted Almond Latte",
    ],
  },
  {
    category: "Non-coffee & refreshers",
    items: [
      "Strawberry Milk",
      "Chocolate Milk",
      "Blueberry Soda",
      "Cucumber Lemonade",
    ],
  },
];

export const packages = [
  { cups: 50, price: 6000 },
  { cups: 75, price: 8500 },
  { cups: 100, price: 11000 },
  { cups: 150, price: 16000 },
  { cups: 200, price: 21000 },
  { cups: 250, price: 28300 },
];

export const addOns = [
  { name: "Customized sticker on cup", detail: "₱3 / cup" },
  { name: "Transportation within Cavite", detail: "Free" },
  { name: "Transportation to other areas", detail: "Additional fee" },
  { name: "On-the-day extra cup, any flavor", detail: "₱130 / cup" },
];

export type DrinkPhoto = {
  label: string;
  alt: string;
  src: string | null;
  illustration: "coffee" | "creamy" | "refreshing";
};

// Place real photos in public/photos, then set src to /photos/your-file.jpg.
// A null src displays a styled placeholder, never a broken image.
export const drinkPhotos: DrinkPhoto[] = [
  {
    label: "Our coffee",
    illustration: "coffee",
    alt: "Tio Philo coffee served at an event",
    src: null,
  },
  {
    label: "Creamy favorites",
    illustration: "creamy",
    alt: "Tio Philo milk-based drinks",
    src: null,
  },
  {
    label: "Something refreshing",
    illustration: "refreshing",
    alt: "Tio Philo fruit refreshers",
    src: null,
  },
];
