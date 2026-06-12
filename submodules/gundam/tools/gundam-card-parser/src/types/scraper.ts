export interface RawSet {
  id: string;
  name: string;
  packageId?: string;
}

// Raw card shape as returned by apitcg.com/api/gundam
export interface RawGundamCard {
  id: string;
  code: string;
  name: string;
  rarity: string;
  cardType: string;
  level: string | null;
  cost: number | null;
  color: string | null;
  ap: number | string | null;
  hp: number | string | null;
  effect: string | null;
  zone: string | null;
  trait: string | null;
  link: string | null;
  images: {
    small: string | null;
    large: string | null;
  };
  sourceTitle: string | null;
  getIt: string | null;
  set: {
    id: string;
    name: string;
    packageId?: string;
  } | null;
}

export interface Scraper {
  readonly name: string;
  readonly source: string;
  scrapeSetList(): Promise<RawSet[]>;
  scrapeCards(setId: string): Promise<RawGundamCard[]>;
}
