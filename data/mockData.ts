import { Category, Retailer, Product } from '../types';

export const categories: Category[] = [
  { id: 'cat1', name: 'Fruits & Veg', imageUrl: 'https://img.icons8.com/fluent/96/000000/group-of-vegetables.png' },
  { id: 'cat2', name: 'Dairy & Bread', imageUrl: 'https://img.icons8.com/color/96/000000/bread-and-milk.png' },
  { id: 'cat3', name: 'Snacks', imageUrl: 'https://img.icons8.com/color/96/000000/chips.png' },
  { id: 'cat4', name: 'Beverages', imageUrl: 'https://img.icons8.com/color/96/000000/soda-bottle.png' },
  { id: 'cat5', name: 'Meat & Fish', imageUrl: 'https://img.icons8.com/color/96/000000/fish-and-meat.png' },
  { id: 'cat6', name: 'Cleaning', imageUrl: 'https://img.icons8.com/color/96/000000/cleaning-spray.png' },
  { id: 'cat7', name: 'Personal Care', imageUrl: 'https://img.icons8.com/color/96/000000/soap-dispenser.png' },
  { id: 'cat8', name: 'Baby Care', imageUrl: 'https://img.icons8.com/color/96/000000/baby-bottle.png' },
];

const allProducts: Product[] = [
  // Fruits & Veg
  { id: 'prod1', name: 'Apple', description: 'Fresh Shimla Apples', price: 120, weight: '1kg', imageUrl: 'https://picsum.photos/seed/apple/200', categoryId: 'cat1' },
  { id: 'prod2', name: 'Banana', description: 'Ripe Robusta Bananas', price: 50, weight: '1 dozen', imageUrl: 'https://picsum.photos/seed/banana/200', categoryId: 'cat1' },
  { id: 'prod3', name: 'Carrot', description: 'Sweet Ooty Carrots', price: 60, weight: '500g', imageUrl: 'https://picsum.photos/seed/carrot/200', categoryId: 'cat1' },
  
  // Dairy & Bread
  { id: 'prod4', name: 'Milk', description: 'Full Cream Cow Milk', price: 28, weight: '500ml', imageUrl: 'https://picsum.photos/seed/milk/200', categoryId: 'cat2' },
  { id: 'prod5', name: 'Brown Bread', description: 'Whole Wheat Bread', price: 45, weight: '400g', imageUrl: 'https://picsum.photos/seed/bread/200', categoryId: 'cat2' },
  { id: 'prod6', name: 'Cheese Slices', description: 'Amul Cheese Slices', price: 110, weight: '100g', imageUrl: 'https://picsum.photos/seed/cheese/200', categoryId: 'cat2' },

  // Snacks
  { id: 'prod7', name: 'Potato Chips', description: 'Classic Salted Chips', price: 20, weight: '52g', imageUrl: 'https://picsum.photos/seed/chips/200', categoryId: 'cat3' },
  { id: 'prod8', name: 'Chocolate Cookies', description: 'Dark Fantasy Choco Fills', price: 35, weight: '75g', imageUrl: 'https://picsum.photos/seed/cookies/200', categoryId: 'cat3' },

  // Beverages
  { id: 'prod9', name: 'Cola', description: 'Chilled Coca-Cola Can', price: 40, weight: '300ml', imageUrl: 'https://picsum.photos/seed/cola/200', categoryId: 'cat4' },
  { id: 'prod10', name: 'Orange Juice', description: 'Tropicana Orange Juice', price: 125, weight: '1L', imageUrl: 'https://picsum.photos/seed/juice/200', categoryId: 'cat4' },
];

export const retailers: Retailer[] = [
  {
    id: 'ret1',
    name: 'Shyam Super Bazzar',
    rating: 4.5,
    imageUrl: 'https://picsum.photos/seed/store1/400/200',
    products: allProducts.filter(p => ['cat1', 'cat2', 'cat4'].includes(p.categoryId)),
    mobileNo: '9876543210',
    email: 'shyam.bazzar@example.com',
    operatingHours: '8 AM - 10 PM',
    description: 'Your friendly neighborhood store for all daily needs. We stock fresh produce, dairy, and a wide variety of snacks.',
    status: 'active',
    accountNo: '12345678901',
    ifscCode: 'SBIN0001234',
    bankName: 'State Bank of India',
  },
  {
    id: 'ret2',
    name: 'AG MART',
    rating: 4.7,
    imageUrl: 'https://picsum.photos/seed/store2/400/200',
    products: allProducts,
    mobileNo: '9876543211',
    email: 'ag.mart@example.com',
    operatingHours: '24/7',
    description: 'The one-stop supermarket for all your needs. From exotic imports to local favorites, we have it all, available 24/7.',
    status: 'active',
    accountNo: '12345678902',
    ifscCode: 'HDFC0005678',
    bankName: 'HDFC Bank',
  },
  {
    id: 'ret3',
    name: 'Sanjivini Stores',
    rating: 4.8,
    imageUrl: 'https://picsum.photos/seed/store3/400/200',
    products: allProducts.filter(p => ['cat2', 'cat3', 'cat6', 'cat7'].includes(p.categoryId)),
    mobileNo: '9876543212',
    email: 'sanjivini@example.com',
    operatingHours: '9 AM - 9 PM',
    description: 'Specializing in organic products and health foods. Your destination for a healthy lifestyle.',
    status: 'active',
    accountNo: '12345678903',
    ifscCode: 'ICIC0009101',
    bankName: 'ICICI Bank',
  }
];