// site.mjs - site-wide content: identity, navigation, footer, contacts. Every address and link traces to docs/FACTS.md.
export const SITE = {
  name: 'Hashables',
  tagline: 'Tastes like paradise.',
  url: 'https://hashables.com',
  description: 'Hashables are the original fresh-pressed hash gummies: solventless live rosin from our own fresh frozen farm flower, stacked into flavors that taste like paradise. New England’s own, from Nova Farms.',
  email: 'info@hashables.com',
  wholesale: 'info@stashie.com',
  instagram: 'https://www.instagram.com/hashables/',
  twitter: 'https://twitter.com/eat_hashables',
  apparel: 'https://higherbreed.com/',
  nova: 'https://novafarms.com/brands',
  video: '21xpuWqF_bw',
  locator: 'https://storelocator.litalerts.com/?hashkey=12AC2D0BBA3B0E965AB0399D2614A433',
};

// header bar (desktop) - the full menu lives in the drawer, as on the reference structure
export const NAV = [
  { label: 'Gummies', href: '/live-rosin-gummies/' },
  { label: 'Our Story', href: '/our-story/' },
  { label: 'FAQs', href: '/faqs/' },
  { label: 'Blog', href: '/blog/' },
];

export const DRAWER_LINKS = [
  { label: 'Find Hashables', href: '/find-us/' },
  { label: 'Our Story', href: '/our-story/' },
  { label: 'FAQs', href: '/faqs/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Awards & Press', href: '/press/' },
  { label: 'Lab Results', href: '/lab-results/' },
  { label: 'Contact Us', href: '/contact/' },
];

export const FOOTER = {
  explore: [
    { label: 'All Gummies', href: '/live-rosin-gummies/' },
    { label: 'Core Flavors', href: '/live-rosin-gummies/core/' },
    { label: 'Specialty', href: '/live-rosin-gummies/specialty/' },
    { label: 'Limited Edition', href: '/live-rosin-gummies/limited-edition/' },
    { label: 'Find Hashables', href: '/find-us/' },
    { label: 'Our Story', href: '/our-story/' },
  ],
  learn: [
    { label: 'FAQs', href: '/faqs/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Awards & Press', href: '/press/' },
    { label: 'Lab Results', href: '/lab-results/' },
    { label: 'Contact', href: '/contact/' },
    { label: 'Careers', href: '/careers/' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy/' },
    { label: 'Accessibility', href: '/accessibility/' },
  ],
};
