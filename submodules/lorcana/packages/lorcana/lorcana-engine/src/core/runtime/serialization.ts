/**
 * Serialization Contract for Match State
 *
 * Provides a standardized way to serialize and deserialize match states
 * for persistence, testing, and tooling across all game packages.
 *
 * ## Two Distinct Concepts
 *
 * **1. State Restore (Production)**
 * Load an engine from a single SerializedMatchState. Used for:
 * - Redis persistence
 * - Replay functionality
 * - Any production rehydration
 *
 * Engines support this via loadState() on the SerializableEngine interface.
 *
 * **2. Fixture Setup (Test/Simulator Only)**
 * Build game state from two per-player fixture specs. Used for:
 * - Unit tests
 * - Simulator sessions
 * - Development tooling
 *
 * Test-only fixture APIs live in game-specific testing packages
 * (e.g., @tcg/lorcana-engine/testing) and should NEVER be used in production.
 *
 * This contract ensures:
 * - Version compatibility for state snapshots
 * - Game-agnostic serialization format
 * - Round-trip integrity (serialize → deserialize → execute)
 */

import type { MatchState } from "./types";
import type { DeepReadonly, Player } from "./match-runtime.types";
import type { MatchStaticResources, StaticResourceRefs } from "./static-resources";
import type { MatchRuntimeConfig } from "./match-runtime.types";
import type { MultiplayerEngine } from "./multiplayer-engine";
import type { LorcanaG } from "../../types/runtime-state";

// =============================================================================
// Serialized State Contract
// =============================================================================

/**
 * Current version of the serialization format.
 * Increment when making breaking changes to the format.
 */
export const SERIALIZATION_FORMAT_VERSION = 1;

/**
 * Canonical serialized match state shape.
 *
 * This is the contract that all game packages must produce/consume
 * for state serialization. It wraps the raw MatchState with metadata
 * required for proper deserialization and version management.
 *
 * @template G - Game-specific state type
 */
export interface SerializedMatchState {
  /** Serialization format version for migration support */
  version: number;

  /** Game identifier (e.g., "lorcana", "gundam") */
  gameType: string;

  /** State ID at time of serialization */
  stateID: number;

  /** Timestamp when state was serialized */
  timestamp: number;

  /** The actual match state (G + ctx) */
  state: MatchState;

  /** References to static resources (not the full resources) */
  resourceRefs: StaticResourceRefs;

  /** Player configuration at time of serialization */
  players: Player[];

  /** Optional seed for deterministic replay */
  seed?: string;
}

/**
 * Metadata about a serialized state without the full state payload.
 * Useful for listing available snapshots without loading full data.
 */
export interface SerializedStateMetadata {
  version: number;
  gameType: string;
  stateID: number;
  timestamp: number;
  playerCount: number;
  playerIDs: string[];
  resourceRefs: StaticResourceRefs;
}

// =============================================================================
// Validation
// =============================================================================

/**
 * Validates that a serialized state matches the expected contract.
 */
export function validateSerializedMatchState(
  serialized: unknown,
): serialized is SerializedMatchState {
  if (!serialized || typeof serialized !== "object") {
    return false;
  }

  const s = serialized as Partial<SerializedMatchState>;

  // Check required fields
  if (typeof s.version !== "number") return false;
  if (typeof s.gameType !== "string") return false;
  if (typeof s.stateID !== "number") return false;
  if (typeof s.timestamp !== "number") return false;
  if (!s.state || typeof s.state !== "object") return false;
  if (!s.players || !Array.isArray(s.players)) return false;
  if (!s.resourceRefs || typeof s.resourceRefs !== "object") return false;

  // Validate resource refs
  const refs = s.resourceRefs as Partial<StaticResourceRefs>;
  if (typeof refs.cardsCatalogRef !== "string") return false;
  if (typeof refs.cardInstancesRef !== "string") return false;

  return true;
}

/**
 * Checks if a serialized state version is supported.
 */
export function isSerializationVersionSupported(version: number): boolean {
  // Currently only support version 1
  return version === SERIALIZATION_FORMAT_VERSION;
}

// =============================================================================
// Serialization Helpers
// =============================================================================

/**
 * Creates a SerializedMatchState from a MatchState and related metadata.
 */
export function createSerializedMatchState(
  gameType: string,
  state: MatchState,
  resources: MatchStaticResources,
  players: Player[],
  seed?: string,
): SerializedMatchState {
  return {
    version: SERIALIZATION_FORMAT_VERSION,
    gameType,
    stateID: state.ctx._stateID,
    timestamp: Date.now(),
    state,
    resourceRefs: {
      cardsCatalogRef: resources.cards.ref,
      cardInstancesRef: resources.instances.ref,
    },
    players,
    seed,
  };
}

/**
 * Extracts metadata from a serialized state without the full payload.
 */
export function extractSerializedStateMetadata(
  serialized: SerializedMatchState,
): SerializedStateMetadata {
  return {
    version: serialized.version,
    gameType: serialized.gameType,
    stateID: serialized.stateID,
    timestamp: serialized.timestamp,
    playerCount: serialized.players.length,
    playerIDs: serialized.players.map((p) => p.id),
    resourceRefs: serialized.resourceRefs,
  };
}

// =============================================================================
// Engine Interface for Serialization
// =============================================================================

/**
 * Interface that engines must implement to support serialization.
 *
 * Both single engines (GameEngine) and multiplayer test engines
 * should implement this interface for serialization support.
 *
 * This is the **production** state restoration mechanism.
 * Test-only fixture setup is a separate concept in game-specific
 * testing packages.
 */
export interface SerializableEngine {
  /** Get the full authoritative state for serialization */
  getAuthoritativeState(): DeepReadonly<MatchState>;

  /** Get the current state ID */
  getStateID(): number;

  /** Load a state into the engine (restores from serialized) */
  loadState(state: MatchState): void;
}

/**
 * Get the full authoritative state from a MultiplayerEngine for persistence.
 *
 * This is the production serializer entrypoint for generic multiplayer engines.
 */
export function getMultiplayerEngineAuthoritativeState(engine: MultiplayerEngine): MatchState {
  return engine.getMatchState();
}

/**
 * Load a previously serialized authoritative state into a MultiplayerEngine.
 *
 * This is the production deserializer entrypoint for generic multiplayer engines.
 */
export function loadMultiplayerEngineAuthoritativeState(
  engine: MultiplayerEngine,
  state: MatchState,
): void {
  engine.loadState(state);
}

/**
 * Type guard to check if an engine supports serialization.
 */
export function isSerializableEngine(engine: unknown): engine is SerializableEngine {
  if (!engine || typeof engine !== "object") return false;

  const e = engine as Partial<SerializableEngine>;
  return (
    typeof e.getAuthoritativeState === "function" &&
    typeof e.getStateID === "function" &&
    typeof e.loadState === "function"
  );
}

// =============================================================================
// Runtime Restoration Helpers
// =============================================================================

/**
 * Configuration for restoring a MatchRuntime from serialized state.
 */
export interface RuntimeRestoreConfig {
  /** The serialized state to restore */
  serializedState: SerializedMatchState;

  /** Runtime config for the game */
  runtimeConfig: MatchRuntimeConfig;

  /** Static resources (card catalog and instance registry) */
  staticResources: MatchStaticResources;

  /** Optional new seed (uses original if not provided) */
  seed?: string;
}

/**
 * Result of a state restoration operation.
 */
export interface StateRestoreResult {
  success: true;
  state: MatchState;
  stateID: number;
}

export interface StateRestoreError {
  success: false;
  error: string;
  errorCode: string;
}

export type RestoreResult = StateRestoreResult | StateRestoreError;

// =============================================================================
// Version Migration
// =============================================================================

/**
 * Migration function type for upgrading serialized states.
 */
export type StateMigration = (state: unknown, fromVersion: number) => SerializedMatchState;

/**
 * Registry of migrations from older versions.
 */
const migrations: Map<number, StateMigration> = new Map();

/**
 * Register a migration from a specific version.
 */
export function registerStateMigration(fromVersion: number, migration: StateMigration): void {
  migrations.set(fromVersion, migration);
}

/**
 * Attempts to migrate a serialized state to the current version.
 */
export function migrateSerializedState(serialized: unknown): RestoreResult {
  // First, check if it's already valid
  if (validateSerializedMatchState(serialized)) {
    if (serialized.version === SERIALIZATION_FORMAT_VERSION) {
      return {
        success: true,
        state: serialized.state,
        stateID: serialized.stateID,
      };
    }
  }

  // Try to extract version from the serialized data
  const s = serialized as Partial<SerializedMatchState>;
  const fromVersion = s.version;

  if (typeof fromVersion !== "number") {
    return {
      success: false,
      error: "Cannot determine serialization version",
      errorCode: "UNKNOWN_VERSION",
    };
  }

  // Look for a migration
  const migration = migrations.get(fromVersion);
  if (!migration) {
    return {
      success: false,
      error: `No migration available from version ${fromVersion}`,
      errorCode: "UNSUPPORTED_VERSION",
    };
  }

  try {
    const migrated = migration(serialized, fromVersion);
    return {
      success: true,
      state: migrated.state,
      stateID: migrated.stateID,
    };
  } catch (error) {
    return {
      success: false,
      error: `Migration failed: ${error instanceof Error ? error.message : String(error)}`,
      errorCode: "MIGRATION_FAILED",
    };
  }
}
