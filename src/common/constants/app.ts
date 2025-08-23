
export const headerLinks: string[] = [
    'Home', 'Bouquet', 'Add-ons', 'Gifts', 'Centerpieces', 'Wedding', 'Inaugural Standee', 'Funeral & Sympathy'
]

export interface ArrangementData {
  id: string;
  title: string;
  mainImage: string;
  images: string[];
  description: string;
}

export const featuredArrangements: ArrangementData[] = [
  {
    id: 'spring-bouquet',
    title: 'A3',
    mainImage: '/app/featured_arrangement/R12A.jpeg',
    images: [
      '/app/featured_arrangement/R12A.jpeg',
      '/app/featured_arrangement/R12A_2.jpg',
      '/app/featured_arrangement/R12A_3.jpg'
    ],
    description: 'A romantic mix of red and baby pink roses'
  },
  {
    id: 'rose-collection',
    title: 'R14',
    mainImage: '/app/featured_arrangement/R14.jpg',
    images: [
      '/app/featured_arrangement/R14.jpg',
      '/app/featured_arrangement/R14_2.jpg',
      '/app/featured_arrangement/R14_3.jpg'
    ],
    description: 'A burst of yellow happiness'
  },
  {
    id: 'tropical-paradise',
    title: 'S9RO',
    mainImage: '/app/featured_arrangement/S9RO.jpg',
    images: [
      '/app/featured_arrangement/S9RO.jpg',
      '/app/featured_arrangement/S9RO_2.jpg',
      '/app/featured_arrangement/S9RO_3.jpg'
    ],
    description: 'Sunshine wrapped in black and gold'
  },
  {
    id: 'Pang Bading',
    title: 'T3',
    mainImage: '/app/featured_arrangement/T3.jpg',
    images: [
      '/app/featured_arrangement/T3.jpg',
      '/app/featured_arrangement/T3_2.jpg',
      '/app/featured_arrangement/T3_3.jpg'
    ],
    description: 'A vibrant tulip bouquet, bursting with cheerful color, fresh charm, and elegant grace'
  }
]