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

// desktop header: split either side of the centred wordmark. "Gummies" opens the mega menu (every line and flavor);
// Learn and About open dropdowns. Together they carry everything the mobile drawer does.
export const NAV_L = [
  { label: 'Gummies', mega: true },
  { label: 'Find us', href: '/find-us/' },
  { label: 'Learn', id: 'learn', items: [
    { label: 'FAQs', href: '/faqs/', icon: 'spark', text: 'The questions we hear most' },
    { label: 'Lab Results', href: '/lab-results/', icon: 'lab', text: 'How to get the COA for your pack' },
    { label: 'Blog', href: '/blog/', icon: 'wave', text: 'Live rosin 101, flavor guides and more' },
  ] },
];
export const NAV_R = [
  { label: 'About', id: 'about', social: true, items: [
    { label: 'Our Story', href: '/our-story/', icon: 'sun', text: 'Fresh pressed, New England’s own' },
    { label: 'Awards & Press', href: '/press/', icon: 'trophy', text: 'Hardware on the shelf' },
    { label: 'About Nova Farms', href: SITE.nova, ext: true, icon: 'leaf', text: 'Proudly part of the Nova Farms family' },
  ] },
  { label: 'Contact', href: '/contact/' },
];

// mobile drawer (below the desktop breakpoint the header shows only the menu button, the wordmark and the CTA)
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
