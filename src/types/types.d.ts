
export type PanelType =
| "dishDetails"
| "menu"
| "filter"
| "about"
| "locationSummary"
| "locationDetail"
| "foodPrintSummary"
| "foodPrintDetail"
| "explore"
| "home"
| null;

// Used in home and filter panels
export type Dish = {
  name: string;
  image: string;
  description: string;
  tagline: string;
  locations: Location[];
};

// Map markers data types
export type Location = {
  name: string;
  address: string;
  x: number;
  y: number;
  lat?: number;
  lng?: number;
  openHours: string;
  priceRange: string;
  mapLink: string;
  photos: string[];
  menuPhotos?: string[];
  foodPhotos?:string[]
  iconUrl: string;
};

export type District = {
  name: string;
  x: number;
  y: number;
};

export type FoodPrint = {
  name: string;
  location: string;
  x: number;
  y: number;
  lat?: number;
  lng?: number;
  description: string;
  extendedDescription: string[];
  iconUrl: string;
  dishType: string;
  heroImage: string;
  mapLink: string;
};