import {
  fetchQueueStats,
  type QueueStatsFormat,
  type QueueStatsMatchType,
  type QueueStatsMode,
  type QueueStatsPartition,
  type QueueStatsResponse,
} from "../api/queue-stats-api.js";

export class QueueStatsStore {
  partitions = $state<QueueStatsPartition[]>([]);
  loading = $state(false);
  error = $state<string | null>(null);

  #intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(initial?: QueueStatsResponse | null) {
    if (initial) {
      this.setSnapshot(initial);
    }
  }

  setSnapshot(snapshot: QueueStatsResponse): void {
    this.partitions = snapshot.partitions ?? [];
  }

  async refresh(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const result = await fetchQueueStats();
      this.setSnapshot(result);
    } catch (error) {
      this.error = error instanceof Error ? error.message : "Failed to load queue stats";
    } finally {
      this.loading = false;
    }
  }

  statsByPartition(
    format: QueueStatsFormat,
    mode: QueueStatsMode,
    matchType: QueueStatsMatchType = "ranked",
  ): QueueStatsPartition | null {
    return (
      this.partitions.find(
        (partition) =>
          partition.format === format &&
          partition.mode === mode &&
          partition.matchType === matchType,
      ) ?? null
    );
  }

  totalInQueue(mode: QueueStatsMode, matchType: QueueStatsMatchType = "ranked"): number {
    return this.partitions
      .filter((partition) => partition.mode === mode && partition.matchType === matchType)
      .reduce((total, partition) => total + partition.inQueue, 0);
  }

  totalLiveMatches(mode: QueueStatsMode, matchType: QueueStatsMatchType = "ranked"): number {
    return this.partitions
      .filter((partition) => partition.mode === mode && partition.matchType === matchType)
      .reduce((total, partition) => total + partition.liveMatches, 0);
  }

  startPolling(intervalMs = 10_000): void {
    this.refresh();
    this.stopPolling();
    this.#intervalId = setInterval(() => {
      void this.refresh();
    }, intervalMs);
  }

  stopPolling(): void {
    if (this.#intervalId !== null) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
  }

  destroy(): void {
    this.stopPolling();
  }
}
