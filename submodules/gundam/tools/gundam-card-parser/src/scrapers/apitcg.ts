import type { RawGundamCard, RawSet, Scraper } from "../types/scraper.ts";
import { RateLimiter } from "../utils/rate-limiter.ts";

const BASE_URL = "https://apitcg.com/api/gundam";
const DOMAIN = "apitcg.com";

interface ApiCardsPage {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: RawGundamCard[];
}

export class ApitcgScraper implements Scraper {
  readonly name = "apitcg";
  readonly source = BASE_URL;
  readonly #apiKey: string;
  readonly #limiter: RateLimiter;
  #allCards: RawGundamCard[] | null = null;

  constructor(apiKey: string, limiter = new RateLimiter(1)) {
    this.#apiKey = apiKey;
    this.#limiter = limiter;
  }

  #headers(): Record<string, string> {
    return { "x-api-key": this.#apiKey };
  }

  /** Fetch every card from the API (all pages) and cache the result. */
  async #fetchAll(): Promise<RawGundamCard[]> {
    if (this.#allCards) return this.#allCards;

    const cards: RawGundamCard[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      await this.#limiter.throttle(DOMAIN);
      const url = new URL(`${BASE_URL}/cards`);
      url.searchParams.set("page", String(page));

      const res = await fetch(url.toString(), { headers: this.#headers() });
      if (!res.ok) throw new Error(`GET /cards page=${page} failed: ${res.status}`);

      const body = (await res.json()) as ApiCardsPage;
      cards.push(...body.data);
      totalPages = body.totalPages;
      process.stdout.write(`\r  Fetching cards... page ${page}/${totalPages}`);
      page++;
    } while (page <= totalPages);

    process.stdout.write("\n");
    this.#allCards = cards;
    return cards;
  }

  /** Derives the set list from the full card catalogue. */
  async scrapeSetList(): Promise<RawSet[]> {
    const all = await this.#fetchAll();
    const seen = new Map<string, string>();
    for (const card of all) {
      if (card.set && !seen.has(card.set.id)) {
        seen.set(card.set.id, card.set.name);
      }
    }
    return [...seen.entries()].map(([id, name]) => ({ id, name }));
  }

  /** Returns cached cards filtered to a single set. */
  async scrapeCards(setId: string): Promise<RawGundamCard[]> {
    const all = await this.#fetchAll();
    return all.filter((c) => c.set?.id === setId);
  }
}
