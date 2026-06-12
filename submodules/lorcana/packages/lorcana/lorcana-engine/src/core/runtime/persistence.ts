import type { MatchState } from "./types";
import type { StaticResourceRefs } from "./static-resources";

// =============================================================================
// Persistence Types
// =============================================================================

export interface MatchConfig {
  matchID: string;
  maxPlayers: number;
  allowSpectators: boolean;
  spectatorPolicy: "public" | "private" | "judges-only";
}

export interface ReplayStepEntry {
  moveNumber: number;
  patches: unknown[];
  logs: unknown[];
  turnNumber: number;
  actorId: string;
  timestamp: number;
}

export interface MatchSnapshot {
  matchID: string;
  stateID: number;
  state: MatchState;
  timestamp: number;
}

export interface MatchMetadata {
  matchID: string;
  createdAt: number;
  updatedAt: number;
  rulesetHash: string;
  config: MatchConfig;
  playerIDs: string[];
  status: "active" | "completed" | "abandoned";
  winner?: string;
  endReason?: string;
  resourceRefs?: StaticResourceRefs;
}

export interface MatchReplayData {
  matchID: string;
  metadata: MatchMetadata;
  initialState: MatchState;
  steps: ReplayStepEntry[];
  finalState?: MatchState;
}

export interface ReplayExportOptions {
  role: "player" | "judge";
  playerID?: string;
  includePrivateData?: boolean;
}

export interface AuditLogEntry {
  timestamp: number;
  matchID: string;
  eventType: string;
  playerID?: string;
  details: Record<string, unknown>;
}

// =============================================================================
// Persistence Interface
// =============================================================================

export interface PersistenceAdapter {
  // Snapshots
  saveSnapshot(snapshot: MatchSnapshot): Promise<void>;
  getLatestSnapshot(matchID: string): Promise<MatchSnapshot | null>;
  getSnapshotAtStateID(matchID: string, stateID: number): Promise<MatchSnapshot | null>;

  // Metadata
  saveMetadata(metadata: MatchMetadata): Promise<void>;
  getMetadata(matchID: string): Promise<MatchMetadata | null>;
  listMatches(filters?: MatchListFilters): Promise<MatchMetadata[]>;

  // Steps
  appendStep(matchID: string, entry: ReplayStepEntry): Promise<void>;
  getSteps(matchID: string): Promise<ReplayStepEntry[]>;

  // Replay
  saveReplayData(data: MatchReplayData): Promise<void>;
  getReplayData(matchID: string): Promise<MatchReplayData | null>;

  // Audit Log
  appendAuditLog(entry: AuditLogEntry): Promise<void>;
  getAuditLog(matchID: string): Promise<AuditLogEntry[]>;

  // Cleanup
  deleteMatch(matchID: string): Promise<void>;
}

export interface MatchListFilters {
  status?: "active" | "completed" | "abandoned";
  playerID?: string;
  rulesetHash?: string;
  limit?: number;
  offset?: number;
}

// =============================================================================
// In-Memory Persistence (for testing)
// =============================================================================

export class InMemoryPersistence implements PersistenceAdapter {
  private snapshots: Map<string, MatchSnapshot[]> = new Map();
  private metadata: Map<string, MatchMetadata> = new Map();
  private steps: Map<string, ReplayStepEntry[]> = new Map();
  private replayData: Map<string, MatchReplayData> = new Map();
  private auditLog: AuditLogEntry[] = [];

  async saveSnapshot(snapshot: MatchSnapshot): Promise<void> {
    const key = snapshot.matchID;
    if (!this.snapshots.has(key)) {
      this.snapshots.set(key, []);
    }
    this.snapshots.get(key)!.push(snapshot);
  }

  async getLatestSnapshot(matchID: string): Promise<MatchSnapshot | null> {
    const snapshots = this.snapshots.get(matchID);
    if (!snapshots || snapshots.length === 0) return null;
    return snapshots[snapshots.length - 1];
  }

  async getSnapshotAtStateID(matchID: string, stateID: number): Promise<MatchSnapshot | null> {
    const snapshots = this.snapshots.get(matchID);
    if (!snapshots) return null;
    return snapshots.find((s) => s.stateID === stateID) || null;
  }

  async saveMetadata(metadata: MatchMetadata): Promise<void> {
    this.metadata.set(metadata.matchID, metadata);
  }

  async getMetadata(matchID: string): Promise<MatchMetadata | null> {
    return this.metadata.get(matchID) || null;
  }

  async listMatches(filters?: MatchListFilters): Promise<MatchMetadata[]> {
    let matches = Array.from(this.metadata.values());

    if (filters?.status) {
      matches = matches.filter((m) => m.status === filters.status);
    }

    if (filters?.playerID) {
      matches = matches.filter((m) => m.playerIDs.includes(filters.playerID!));
    }

    if (filters?.rulesetHash) {
      matches = matches.filter((m) => m.rulesetHash === filters.rulesetHash);
    }

    if (filters?.offset) {
      matches = matches.slice(filters.offset);
    }

    if (filters?.limit) {
      matches = matches.slice(0, filters.limit);
    }

    return matches;
  }

  async appendStep(matchID: string, entry: ReplayStepEntry): Promise<void> {
    if (!this.steps.has(matchID)) {
      this.steps.set(matchID, []);
    }
    this.steps.get(matchID)!.push(entry);
  }

  async getSteps(matchID: string): Promise<ReplayStepEntry[]> {
    return this.steps.get(matchID) || [];
  }

  async saveReplayData(data: MatchReplayData): Promise<void> {
    this.replayData.set(data.matchID, data);
  }

  async getReplayData(matchID: string): Promise<MatchReplayData | null> {
    return this.replayData.get(matchID) || null;
  }

  async appendAuditLog(entry: AuditLogEntry): Promise<void> {
    this.auditLog.push(entry);
  }

  async getAuditLog(matchID: string): Promise<AuditLogEntry[]> {
    return this.auditLog.filter((e) => e.matchID === matchID);
  }

  async deleteMatch(matchID: string): Promise<void> {
    this.snapshots.delete(matchID);
    this.metadata.delete(matchID);
    this.steps.delete(matchID);
    this.replayData.delete(matchID);
  }

  // Test utility: clear all data
  clear(): void {
    this.snapshots.clear();
    this.metadata.clear();
    this.steps.clear();
    this.replayData.clear();
    this.auditLog = [];
  }
}

// =============================================================================
// Persistence Manager
// =============================================================================

export class PersistenceManager {
  private adapter: PersistenceAdapter;

  constructor(adapter: PersistenceAdapter) {
    this.adapter = adapter;
  }

  /**
   * Save a match snapshot.
   */
  async saveSnapshot(matchID: string, state: MatchState): Promise<void> {
    await this.adapter.saveSnapshot({
      matchID,
      stateID: state.ctx._stateID,
      state,
      timestamp: Date.now(),
    });
  }

  /**
   * Load the latest snapshot for a match.
   */
  async loadLatestSnapshot(matchID: string): Promise<MatchState | null> {
    const snapshot = await this.adapter.getLatestSnapshot(matchID);
    return snapshot?.state || null;
  }

  /**
   * Create or update match metadata.
   */
  async saveMatchMetadata(
    matchID: string,
    rulesetHash: string,
    config: MatchConfig,
    playerIDs: string[],
    resourceRefs?: StaticResourceRefs,
  ): Promise<void> {
    const existing = await this.adapter.getMetadata(matchID);
    const now = Date.now();

    await this.adapter.saveMetadata({
      matchID,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      rulesetHash,
      config,
      playerIDs,
      status: existing?.status || "active",
      winner: existing?.winner,
      endReason: existing?.endReason,
      resourceRefs: resourceRefs ?? existing?.resourceRefs,
    });
  }

  /**
   * Mark a match as completed.
   */
  async completeMatch(matchID: string, winner?: string, endReason?: string): Promise<void> {
    const metadata = await this.adapter.getMetadata(matchID);
    if (metadata) {
      metadata.status = "completed";
      metadata.updatedAt = Date.now();
      metadata.winner = winner;
      metadata.endReason = endReason;
      await this.adapter.saveMetadata(metadata);
    }
  }

  /**
   * Log an audit event.
   */
  async logAuditEvent(
    matchID: string,
    eventType: string,
    details: Record<string, unknown>,
    playerID?: string,
  ): Promise<void> {
    await this.adapter.appendAuditLog({
      timestamp: Date.now(),
      matchID,
      eventType,
      playerID,
      details,
    });
  }

  /**
   * Export replay data for a match.
   */
  async exportReplay(
    matchID: string,
    options: ReplayExportOptions,
  ): Promise<MatchReplayData | null> {
    const data = await this.adapter.getReplayData(matchID);
    if (!data) return null;

    // Filter based on role
    if (options.role === "player") {
      return this.filterReplayForPlayer(data, options.playerID, options);
    }

    return data;
  }

  /**
   * Filter replay data for a specific player's perspective.
   */
  private filterReplayForPlayer(
    data: MatchReplayData,
    _playerID: string | undefined,
    _options: ReplayExportOptions,
  ): MatchReplayData {
    const filtered: MatchReplayData = {
      matchID: data.matchID,
      metadata: data.metadata,
      initialState: data.initialState,
      steps: data.steps,
    };

    if (!_options.includePrivateData) {
      delete filtered.finalState;
    }

    return filtered;
  }

  /**
   * Get match statistics.
   */
  async getMatchStats(matchID: string): Promise<{
    totalSteps: number;
    duration?: number;
  } | null> {
    const metadata = await this.adapter.getMetadata(matchID);
    if (!metadata) return null;

    const steps = await this.adapter.getSteps(matchID);

    return {
      totalSteps: steps.length,
      duration:
        metadata.status === "completed" && metadata.createdAt
          ? metadata.updatedAt - metadata.createdAt
          : undefined,
    };
  }
}
