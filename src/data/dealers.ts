export type DealerType = "dealer" | "showroom";

export type Dealer = {
  id: string;
  nameKo: string;
  nameEn?: string;
  province: string;
  district: string;
  address: string;
  addressDetail?: string;
  phone: string;
  latitude: number;
  longitude: number;
  type: DealerType;
  operatingHours?: string;
  naverMapUrl?: string;
  kakaoMapUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  sortOrder?: number;
};

/** Public, verified HOYANG dealer records only. */
export const dealers: Dealer[] = [];
