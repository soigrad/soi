import { PackageName, CustomizationType } from './types';
import type { CustomizationField } from './types';

export const WHATSAPP_NUMBER = '9647738536861';
export const ADDON_PRICE = 5000;

export const FABRIC_COLORS = [
    { name: 'أسود', hex: '#000000' },
    { name: 'كحلي', hex: '#000080' },
    { name: 'أبيض', hex: '#FFFFFF' },
    { name: 'ماروني', hex: '#800000' },
    { name: 'رصاصي', hex: '#808080' },
];

export const CUSTOMIZATION_COLORS = [
    { name: 'ذهبي', hex: '#FFD700' },
    { name: 'فضي', hex: '#C0C0C0' },
    { name: 'أبيض', hex: '#FFFFFF' },
    { name: 'أسود', hex: '#000000' },
    { name: 'أحمر', hex: '#FF0000' },
];

export const PACKAGES = [
  {
    name: PackageName.Classic,
    pieces: '3 قطع',
    material: 'قماش باربي',
    description: 'تصميم مميز ويحمل اسم البكج.',
    image: 'https://storage.googleapis.com/source.agpar.in/app/986b5e02-40f7-418c-8f47-810a90407158.jpg',
    fields: [
      { id: 'classic_right_sash', label: 'الجهة اليمنى للوشاح', image: null, description: '' },
      { id: 'classic_left_sash', label: 'الجهة اليسرى للوشاح', image: null, description: '' },
      { id: 'classic_tassel', label: 'ظهر القبعة او المسطرة', image: null, description: '' },
    ] as CustomizationField[],
  },
  {
    name: PackageName.Royal,
    pieces: '3 قطع',
    material: 'قماش باربي',
    description: 'تصميم مميز ويحمل اسم البكج.',
    image: 'https://storage.googleapis.com/source.agpar.in/app/e5c2b1a3-1f1d-4a8e-9b0a-7c9d0f3d6b4c.jpg',
    fields: [
        { id: 'royal_right', label: 'الجهة اليمنى', image: null, description: '' },
        { id: 'royal_left', label: 'الجهة اليسرى', image: null, description: '' },
        { id: 'royal_sash_back', label: 'ظهر الوشاح', image: null, description: '' },
        { id: 'royal_tassel', label: 'ظهر القبعة او المسطرة', image: null, description: '' },
    ] as CustomizationField[],
  },
  {
    name: PackageName.American,
    pieces: '3 قطع',
    material: 'قماش باربي',
    description: 'تصميم مميز ويحمل اسم البكج.',
    image: 'https://storage.googleapis.com/source.agpar.in/app/149e038f-432d-4340-9a3b-2852230a1099.jpg',
    fields: [
        { id: 'american_sash', label: 'الجهة الأمامية للوشاح', image: null, description: '' },
        { id: 'american_tassel', label: 'ظهر القبعة او المسطرة', image: null, description: '' },
    ] as CustomizationField[],
  },
];

export const PRICES = {
  [PackageName.Classic]: {
    [CustomizationType.Print]: 35000,
    [CustomizationType.Embroidery]: 49000,
  },
  [PackageName.Royal]: {
    [CustomizationType.Print]: 45000,
    [CustomizationType.Embroidery]: 59000,
  },
  [PackageName.American]: {
    [CustomizationType.Print]: 64000,
    [CustomizationType.Embroidery]: 69000,
  },
};