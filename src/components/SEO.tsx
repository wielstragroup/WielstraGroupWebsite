import { Helmet } from 'react-helmet-async';
import { SITE_CONFIG } from '../constants';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({ 
  title, 
  description, 
  image = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070', 
  url, 
  type = 'website' 
}: SEOProps) {
  const siteTitle = title ? `${title} | ${SITE_CONFIG.companyName}` : `${SITE_CONFIG.companyName} | Website Laten Maken Friesland`;
  const siteDescription = description || 'Betaalbare, luxe en moderne websites voor MKB in Friesland. Wielstra Group bouwt uw digitale toekomst.';
  const siteUrl = url ? `${SITE_CONFIG.baseUrl}${url}` : SITE_CONFIG.baseUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={siteDescription} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}
