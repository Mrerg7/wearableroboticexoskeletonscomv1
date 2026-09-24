export const SITE = {
  name: 'Wearable Robotic Exoskeletons',
  domain: 'wearableroboticexoskeletons.com',
  title:
    'wearableroboticexoskeletons.com for Sale — Premium Exoskeleton Domain | $75K–$195K',
  description:
    'Buy wearableroboticexoskeletons.com — the exact-match premium .com for the wearable robotic exoskeleton industry. Escrow-protected acquisition. Inquire for valuation ($75K–$195K).',
  url: 'https://wearableroboticexoskeletons.com',
  locale: 'en_US',
  language: 'en-US',
  email: 'sales@desertrich.com',
  location: 'Phoenix, Arizona, USA',
  year: 2026,
  datePublished: '2026-06-22',
  dateModified: '2026-09-24',
  googleSiteVerification: 'qyBoStmNrHdXCe3N7-Yty5fzAyTuhP2GltSlODTmJuo',
  owner: 'Desert Rich',
  valuationLow: 75000,
  valuationHigh: 195000,
  priceValidUntil: '2027-12-31',
} as const;

export const HERO_IMAGE =
  'https://imagedelivery.net/-sPAUAWeA405NiWJ0SNIQA/f82386a7-bc22-4685-5b00-a3b7de817400/public';

export const OG_IMAGE = HERO_IMAGE;
export const OG_IMAGE_WIDTH = 1366;
export const OG_IMAGE_HEIGHT = 745;

export function acquisitionMailto(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  params.set(
    'subject',
    subject ?? `Acquisition Inquiry — ${SITE.domain}`,
  );
  if (body) params.set('body', body);
  return `mailto:${SITE.email}?${params.toString()}`;
}
