/**
 * Simple token bucket rate limiter.
 * Ensures a minimum interval between requests to a given domain.
 */
export class RateLimiter {
  readonly #minIntervalMs: number;
  readonly #lastCallAt = new Map<string, number>();

  constructor(requestsPerSecond = 1) {
    this.#minIntervalMs = 1000 / requestsPerSecond;
  }

  async throttle(domain: string): Promise<void> {
    const last = this.#lastCallAt.get(domain) ?? 0;
    const elapsed = Date.now() - last;
    const wait = this.#minIntervalMs - elapsed;
    if (wait > 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, wait));
    }
    this.#lastCallAt.set(domain, Date.now());
  }
}
