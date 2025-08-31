export interface ShoppingItem {
  id: string;
  name: string;
  isCompleted: boolean;
  url?: string;
  imageUri?: string;
  emoji?: string; // 自定义emoji图标
  category?: string;
  brand?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomItem {
  id: string;
  name: string;
  category?: string;
  brand?: string;
  defaultUrl?: string;
  defaultImageUri?: string;
  notes?: string;
  tags?: string[];
  color?: string;
  usageCount: number; // Track how often this item is used
  createdAt: Date;
  updatedAt: Date;
  lastUsed?: Date;
}

export interface ItemCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: Date;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: Date;
  updatedAt: Date;
  isHidden?: boolean;
  isArchived?: boolean;
  isDeleted?: boolean;
  deletedAt?: Date;
}

export interface AppState {
  lists: ShoppingList[];
  customItems: CustomItem[];
  categories: ItemCategory[];
  hasCompletedOnboarding: boolean;
  currentListId?: string;
}

export const SUGGESTED_ITEMS = [
  'Toilet paper',
  'Peanut butter',
  'Aluminum foil',
  'Paper bags for recycling',
  'Bread',
  'Milk',
  'Eggs',
  'Cheese',
  'Apples',
  'Bananas',
  'Rice',
  'Pasta',
  'Chicken',
  'Ground beef',
  'Yogurt',
  'Cereal',
  'Coffee',
  'Tea',
  'Sugar',
  'Salt',
];

export const DEFAULT_CATEGORIES: Omit<ItemCategory, 'id' | 'createdAt'>[] = [
  { name: 'Groceries', color: '#4CAF50', icon: 'basket-outline' },
  { name: 'Dairy', color: '#2196F3', icon: 'nutrition-outline' },
  { name: 'Meat & Seafood', color: '#F44336', icon: 'fish-outline' },
  { name: 'Fruits & Vegetables', color: '#FF9800', icon: 'leaf-outline' },
  { name: 'Beverages', color: '#9C27B0', icon: 'wine-outline' },
  { name: 'Snacks', color: '#FF5722', icon: 'fast-food-outline' },
  { name: 'Personal Care', color: '#607D8B', icon: 'person-outline' },
  { name: 'Household', color: '#795548', icon: 'home-outline' },
];
