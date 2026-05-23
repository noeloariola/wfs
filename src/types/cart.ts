export interface CartItem {
  id: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  productImage: string;
  quantity: number;
  wrapperId?: string;
  wrapperColor?: string;
  wrapperVariantId?: string;
  wrapperVariantImage?: string;
  wrapperSelections?: {
    color: string;
    variantId: string;
    variantImage: string;
  }[];
  notes?: string;
  groupItems?: {
    id: string;
    title: string;
    image: string;
    qty: number;
    qtyType: 'piece' | 'bundle';
    description?: string;
    color?: string;
  }[];
  deliveryAddress?: string;
  addedAt: number;
}

export interface Cart {
  items: CartItem[];
  lastUpdated: number;
}

export interface WrapperVariant {
  id: string;
  name: string;
  image: string;
}

export interface WrapperColor {
  name: string;
  variants: WrapperVariant[];
}

export interface Wrappers {
  colors: {
    [colorKey: string]: WrapperColor;
  };
}
