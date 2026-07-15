/**
 * Replay System
 *
 * Phase 6 of PLAN.md: Persistence, Replay, Audit, and Auth
 *
 * Provides replay functionality for matches with role-based filtering.
 */

import type { MatchState } from "./types";
import type { MatchReplayData, ReplayExportOptions, ReplayStepEntry } from "./persistence";
import {
  getStaticResourceRefs,
  type MatchStaticResources,
  type StaticResourceRefs,
} from "./static-resources";
import { StateSanitizer } from "./security";

// =============================================================================
// Replay Types
// =============================================================================

export interface ReplayState {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  currentState?: MatchState;
  speed: number;
}

export interface ReplayStep {
  step: number;
  timestamp: number;
  patches: unknown[];
  logs: unknown[];
  actorId: string;
  turnNumber: number;
}

export interface ReplayExport {
  format: "json" | "compressed";
  data: string;
  metadata: {
    matchID: string;
    version: string;
    exportedAt: number;
    totalSteps: number;
  };
}

export interface ReplayEngineOptions {
  /**
   * External resources used to resolve runtime cards during replay inspection.
   * If replay metadata includes resourceRefs, refs are validated against this object.
   */
  staticResources?: MatchStaticResources;
  /**
   * Optional explicit refs if the caller doesn't want to pass the full resources object.
   */
  resourceRefs?: StaticResourceRefs;
  /**
   * If true, require refs even when replay metadata does not include them.
   */
  requireResourceRefs?: boolean;
}

// =============================================================================
// Replay Engine
// =============================================================================

export class ReplayEngine {
  private replayData: MatchReplayData;
  private steps: ReplayStep[] = [];
  private currentStep = 0;

  constructor(replayData: MatchReplayData, options: ReplayEngineOptions = {}) {
    ReplayEngine.assertRequiredResources(replayData, options);
    this.replayData = replayData;
    this.buildSteps();
  }

  private static assertRequiredResources(
    replayData: MatchReplayData,
    options: ReplayEngineOptions,
  ): void {
    const expected = replayData.metadata.resourceRefs;
    const provided =
      options.resourceRefs ??
      (options.staticResources ? getStaticResourceRefs(options.staticResources) : undefined);

    if (!expected) {
      if (options.requireResourceRefs) {
        throw new Error("REPLAY_RESOURCE_REFS_MISSING: replay metadata has no resourceRefs");
      }
      return;
    }

    if (!provided) {
      throw new Error(
        "REPLAY_RESOURCES_REQUIRED: replay metadata requires external card resources but none were provided",
      );
    }

    if (provided.cardsCatalogRef !== expected.cardsCatalogRef) {
      throw new Error(
        `REPLAY_RESOURCE_REF_MISMATCH: cardsCatalogRef expected '${expected.cardsCatalogRef}' got '${provided.cardsCatalogRef}'`,
      );
    }

    if (provided.cardInstancesRef !== expected.cardInstancesRef) {
      throw new Error(
        `REPLAY_RESOURCE_REF_MISMATCH: cardInstancesRef expected '${expected.cardInstancesRef}' got '${provided.cardInstancesRef}'`,
      );
    }
  }

  /**
   * Build replay steps from step entries.
   */
  private buildSteps(): void {
    this.steps = this.replayData.steps.map((entry, i) => ({
      step: i,
      timestamp: entry.timestamp,
      patches: entry.patches,
      logs: entry.logs,
      actorId: entry.actorId,
      turnNumber: entry.turnNumber,
    }));
  }

  getTotalSteps(): number {
    return this.steps.length;
  }

  getCurrentStep(): number {
    return this.currentStep;
  }

  getStep(index: number): ReplayStep | undefined {
    return this.steps[index];
  }

  getAllSteps(): ReplayStep[] {
    return this.steps;
  }

  jumpToStep(step: number): ReplayStep | undefined {
    if (step < 0 || step >= this.steps.length) {
      return undefined;
    }
    this.currentStep = step;
    return this.steps[step];
  }

  nextStep(): ReplayStep | undefined {
    return this.jumpToStep(this.currentStep + 1);
  }

  previousStep(): ReplayStep | undefined {
    return this.jumpToStep(this.currentStep - 1);
  }

  getMetadata(): MatchReplayData["metadata"] {
    return this.replayData.metadata;
  }

  exportToJSON(): string {
    return JSON.stringify(
      {
        version: "2.0.0",
        exportedAt: Date.now(),
        data: this.replayData,
      },
      null,
      2,
    );
  }

  getLogsAtStep(step: number): unknown[] {
    const replayStep = this.steps[step];
    return replayStep?.logs || [];
  }
}

// =============================================================================
// Replay Builder
// =============================================================================

export interface ReplayBuilderConfig {
  matchID: string;
  rulesetHash: string;
  config: MatchReplayData["metadata"]["config"];
  playerIDs: string[];
  resourceRefs?: StaticResourceRefs;
}

export class ReplayBuilder {
  private config: ReplayBuilderConfig;
  private initialState?: MatchState;
  private steps: ReplayStepEntry[] = [];
  private finalState?: MatchState;

  constructor(config: ReplayBuilderConfig) {
    this.config = config;
  }

  setInitialState(state: MatchState): this {
    this.initialState = JSON.parse(JSON.stringify(state));
    return this;
  }

  addStep(entry: ReplayStepEntry): this {
    this.steps.push(entry);
    return this;
  }

  setFinalState(state: MatchState): this {
    this.finalState = JSON.parse(JSON.stringify(state));
    return this;
  }

  build(): MatchReplayData {
    if (!this.initialState) {
      throw new Error("Initial state is required");
    }

    return {
      matchID: this.config.matchID,
      metadata: {
        matchID: this.config.matchID,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        rulesetHash: this.config.rulesetHash,
        config: this.config.config,
        playerIDs: this.config.playerIDs,
        status: this.finalState ? "completed" : "active",
        resourceRefs: this.config.resourceRefs,
      },
      initialState: this.initialState,
      steps: this.steps,
      finalState: this.finalState,
    };
  }
}

// =============================================================================
// Replay Exporter
// =============================================================================

export class ReplayExporter {
  static toJSON(replayData: MatchReplayData): ReplayExport {
    return {
      format: "json",
      data: JSON.stringify(replayData),
      metadata: {
        matchID: replayData.matchID,
        version: "2.0.0",
        exportedAt: Date.now(),
        totalSteps: replayData.steps.length,
      },
    };
  }

  static toCompressed(replayData: MatchReplayData): ReplayExport {
    const json = JSON.stringify(replayData);
    const compressed =
      typeof Buffer !== "undefined" ? Buffer.from(json).toString("base64") : btoa(json);

    return {
      format: "compressed",
      data: compressed,
      metadata: {
        matchID: replayData.matchID,
        version: "2.0.0",
        exportedAt: Date.now(),
        totalSteps: replayData.steps.length,
      },
    };
  }

  static fromJSON(data: string): MatchReplayData {
    return JSON.parse(data);
  }

  static createEngineFromJSON(data: string, options?: ReplayEngineOptions): ReplayEngine {
    return new ReplayEngine(ReplayExporter.fromJSON(data), options);
  }

  static fromCompressed(data: string): MatchReplayData {
    const json =
      typeof Buffer !== "undefined" ? Buffer.from(data, "base64").toString() : atob(data);
    return JSON.parse(json);
  }

  static createEngineFromCompressed(data: string, options?: ReplayEngineOptions): ReplayEngine {
    return new ReplayEngine(ReplayExporter.fromCompressed(data), options);
  }

  static filterForRole(
    replayData: MatchReplayData,
    role: "player" | "judge",
    _playerID?: string,
  ): MatchReplayData {
    if (role === "judge") {
      return replayData;
    }

    const filtered: MatchReplayData = {
      matchID: replayData.matchID,
      metadata: replayData.metadata,
      initialState: replayData.initialState,
      steps: replayData.steps,
    };

    if (filtered.initialState) {
      filtered.initialState = ReplayExporter.sanitizeState(filtered.initialState);
    }

    if (filtered.finalState) {
      filtered.finalState = ReplayExporter.sanitizeState(filtered.finalState);
    }

    return filtered;
  }

  private static sanitizeState(state: MatchState): MatchState {
    const sanitized = JSON.parse(JSON.stringify(state));
    if (sanitized.ctx.random) {
      sanitized.ctx.random.state = null;
    }
    return sanitized;
  }
}

// =============================================================================
// Replay Validator
// =============================================================================

export interface ReplayValidationResult {
  valid: boolean;
  errors: string[];
}

export class ReplayValidator {
  static validate(replayData: MatchReplayData): ReplayValidationResult {
    const errors: string[] = [];

    if (!replayData.matchID) {
      errors.push("Missing matchID");
    }

    if (!replayData.metadata) {
      errors.push("Missing metadata");
    }

    if (!replayData.initialState) {
      errors.push("Missing initialState");
    }

    if (!replayData.steps) {
      errors.push("Missing steps");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static canReconstruct(replayData: MatchReplayData): boolean {
    return (
      replayData.initialState !== undefined &&
      replayData.steps.length > 0 &&
      replayData.steps.every((s) => s.patches.length > 0)
    );
  }
}
