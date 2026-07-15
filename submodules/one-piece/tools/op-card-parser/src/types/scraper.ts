export interface RawSet {
  id: string;
  name: string;
}

// Raw card shape as returned by optcgapi.com
export interface RawOPCard {
  card_name: string;
  set_name: string;
  card_text: string;
  set_id: string;
  rarity: string;
  card_set_id: string;
  card_color: string;
  card_type: string;
  life: string | null;
  card_cost: string | null;
  card_power: string | null;
  sub_types: string;
  counter_amount: number | null;
  attribute: string | null;
  card_image_id: string | null;
  card_image: string | null;
  inventory_price: number;
  market_price: number;
}

export interface Scraper {
  readonly name: string;
  readonly source: string;
  scrapeSetList(): Promise<RawSet[]>;
  scrapeCards(setId: string): Promise<RawOPCard[]>;
}
