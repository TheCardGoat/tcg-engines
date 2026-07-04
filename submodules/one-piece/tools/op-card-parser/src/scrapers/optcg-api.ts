import type { RawOPCard, RawSet, Scraper } from "../types/scraper.ts";
import { RateLimiter } from "../utils/rate-limiter.ts";

const BASE_URL = "https://www.optcgapi.com/api";
const DOMAIN = "www.optcgapi.com";

interface ApiSetEntry {
  set_name: string;
  set_id: string;
}

export class OptcgApiScraper implements Scraper {
  readonly name = "optcg-api";
  readonly source = BASE_URL;
  readonly #limiter: RateLimiter;

  constructor(limiter = new RateLimiter(1)) {
    this.#limiter = limiter;
  }

  async scrapeSetList(): Promise<RawSet[]> {
    await this.#limiter.throttle(DOMAIN);
    const res = await fetch(`${BASE_URL}/allSets/`);
    if (!res.ok) throw new Error(`allSets failed: ${res.status}`);
    const data = (await res.json()) as ApiSetEntry[];
    return data.map((s) => ({ id: s.set_id, name: s.set_name }));
  }

  async scrapeCards(setId: string): Promise<RawOPCard[]> {
    await this.#limiter.throttle(DOMAIN);
    // The API uses "OP-01" format for set IDs in the path
    const res = await fetch(`${BASE_URL}/sets/${setId}/`);
    if (!res.ok) throw new Error(`sets/${setId} failed: ${res.status}`);
    return (await res.json()) as RawOPCard[];
  }
}
