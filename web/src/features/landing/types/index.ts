export interface Service {
  id: string;
  name: string;
  category: string;
  duration: number;
  price: number;
  description: string;
  tag?: string;
  image: string;
  features: string[];
}

export interface LookbookItem {
  id: string;
  title: string;
  category: string;
  image: string;
  technique: string;
  durationBonus: string;
  estimatedPrice: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RitualStep {
  num: string;
  title: string;
  subtitle: string;
  desc: string;
}

export interface LandingDate {
  label: string;
  shortLabel: string;
  dateNumber: string;
  fullDate: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
