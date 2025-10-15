export type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  imageHint: string;
};

export type CartItem = {
  id: string;
  name:string;
  imageUrl: string;
  price: number;
  quantity: number;
  imageHint: string;
};

export type Order = {
  id: string;
  userId: string;
  userEmail: string | null;
  items: CartItem[];
  total: number;
  createdAt: number;
};
