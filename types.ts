
export enum PackageName {
  Classic = 'البكج الكلاسك',
  Royal = 'البكج الملكي',
  American = 'البكج الأمريكي',
}

export enum CustomizationType {
  Print = 'طباعة',
  Embroidery = 'تطريز',
}

export enum Addon {
  CapFront = 'الجهة الأمامية للقبعة',
  Sleeve = 'الردن',
}

export interface CustomizationField {
  id: string;
  label: string;
  image: File | null;
  description: string;
}

export interface Order {
  packageName: PackageName | null;
  customizationType: CustomizationType;
  addons: Addon[];
  fields: CustomizationField[];
  robeColor: string;
  capColor: string;
  sashColor: string;
  customizationColor: string;
  customerName: string;
  phone: string;
  address: string;
  totalPrice: number;
}