import {
  fetchLiveMatches,
  type LiveMatchEntry,
  type LiveMatchFetchFilters,
  type LiveMatchListResponse,
} from "../api/live-matches-api.js";

export class LiveMatchesStore {
  matches = $state<LiveMatchEntry[]>([]);
  total = $state(0);
  loading = $state(false);
  error = $state<string | null>(null);
  displayLimit = $state(25);

  /** Active filters sent to the API */
  filters = $state<LiveMatchFetchFilters>({});

  #intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(initial?: LiveMatchListResponse | null) {
    if (initial) {
      this.setSnapshot(initial);
    }
  }

  setSnapshot(snapshot: LiveMatchListResponse): void {
    this.matches = snapshot.matches;
    this.total = snapshot.total;
  }

  setFilters(filters: LiveMatchFetchFilters): void {
    this.filters = filters;
    this.displayLimit = 25;
    this.refresh();
  }

  async refresh(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const res = await fetchLiveMatches(this.displayLimit, this.filters);
      this.setSnapshot(res);
    } catch (e) {
      this.error = e instanceof Error ? e.message : "Failed to load live matches";
    } finally {
      this.loading = false;
    }
  }

  showMore(count = 25): void {
    this.displayLimit += count;
    this.refresh();
  }

  startPolling(intervalMs = 20_000): void {
    this.refresh();
    this.#intervalId = setInterval(() => this.refresh(), intervalMs);
  }

  stopPolling(): void {
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
  }

  destroy(): void {
    this.stopPolling();
  }
}
