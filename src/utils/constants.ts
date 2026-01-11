import {
  ShoppingBag,
  Plane,
  Utensils,
  Home,
  Film,
  Heart,
  GraduationCap,
  MoreHorizontal,
} from 'lucide-react';
import type { ExpenseCategory } from '../types/expense';

export const CATEGORY_ICONS = {
  Food: Utensils,
  Travel: Plane,
  Shopping: ShoppingBag,
  Rent: Home,
  Entertainment: Film,
  Health: Heart,
  Education: GraduationCap,
  Others: MoreHorizontal,
};

export const CATEGORY_COLORS = {
  Food: '#10b981',
  Travel: '#3b82f6',
  Shopping: '#ec4899',
  Rent: '#f59e0b',
  Entertainment: '#8b5cf6',
  Health: '#ef4444',
  Education: '#06b6d4',
  Others: '#6b7280',
};

export const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Travel',
  'Shopping',
  'Rent',
  'Entertainment',
  'Health',
  'Education',
  'Others',
];
