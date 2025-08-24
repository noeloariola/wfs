
export const headerLinks: {title: string, href: string}[] = [
  {
    title: 'Home',
    href: '/'
  },
  {
    title: 'Bouquet',
    href: '/bouquets'
  },
  {
    title: 'Add-ons',
    href: '/add-ons'
  },
  {
    title: 'Gifts',
    href: '/gifts'
  },
  {
    title: 'Centerpieces',
    href: '/centerpieces'
  },
  {
    title: 'Wedding',
    href: '/weddings'
  },
  {
    title: 'Inaugural Standee',
    href: '/inaugural-standee'
  },
  {
    title: 'Funeral & Sympathy',
    href: '/funeral-sympathy'
  },
  {
    title: 'Videos',
    href: '/videos'
  }
]

export type ArrangementCategory = 'bouquet' | 'add-on' | 'gift' | 'centerpiece' | 'wedding' | 'inaugural-standee' | 'funeral-sympathy';
export interface ArrangementData {
  id: string;
  title: string;
  mainImage: string;
  images: string[];
  description: string;
  category?: ArrangementCategory;
}

export const featuredArrangements: ArrangementData[] = [
  {
    id: 'rose-collection',
    title: 'SUN14-1',
    mainImage: '/app/featured_arrangement/ROSEYLW14-1/ROSEYLW14-1.1.jpg',
    images: [
      '/app/featured_arrangement/ROSEYLW14-1/ROSEYLW14-1.1.jpg',
      '/app/featured_arrangement/ROSEYLW14-1/ROSEYLW14-1.2.jpg',
    ],
    description: 'A burst of yellow happiness',
    category: 'bouquet'
  },
  {
    id: 'spring-bouquet',
    title: 'REDPNK20-#1',
    mainImage: '/app/featured_arrangement/REDPNK20-1/REDPNK20-1.1.jpg',
    images: [
      '/app/featured_arrangement/REDPNK20-1/REDPNK20-1.1.jpg'
    ],
    description: 'A romantic mix of red and baby pink roses',
    category: 'bouquet'
  },
  {
    id: 'tropical-paradise',
    title: 'SUN12-#1',
    mainImage: '/app/featured_arrangement/SUN12-1/SUN12-1.1.jpg',
    images: [
      '/app/featured_arrangement/SUN12-1/SUN12-1.1.jpg'
    ],
    description: 'Sunshine wrapped in black and gold',
    category: 'bouquet'
  },
  {
    id: 'Pang Bading',
    title: 'T3-#1',
    mainImage: '/app/featured_arrangement/T3-1/T3-1.1.jpg',
    images: [
      '/app/featured_arrangement/T3-1/T3-1.1.jpg'
    ],
    description: 'A vibrant tulip bouquet, bursting with cheerful color, fresh charm, and elegant grace',
    category: 'bouquet'
  }
]