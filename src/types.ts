export interface PageContent {
  id: string;
  title: string;
  slug: string;
  sections: Section[];
  updatedAt: any;
}

export interface Section {
  id: string;
  type: 'hero' | 'text' | 'features' | 'cta' | 'faq';
  title?: string;
  subtitle?: string;
  content?: string;
  items?: any[];
  buttonText?: string;
  buttonLink?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  galleryImages: string[];
  clientName?: string;
  industry?: string;
  tags: string[];
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  isDemo: boolean;
  featured: boolean;
  published: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  order: number;
}

export interface SiteSettings {
  id: 'main';
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  whatsapp: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  address?: string;
  footerText: string;
}
