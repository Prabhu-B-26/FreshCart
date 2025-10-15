
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

export type OrderItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export type Order = {
  id: string;
  userId: string;
  userEmail: string | null;
  items: OrderItem[];
  total: number;
  createdAt: Date;
};
