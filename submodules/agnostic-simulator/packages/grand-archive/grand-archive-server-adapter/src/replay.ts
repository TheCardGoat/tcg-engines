import {
  GrandArchiveMatchRuntime,
  isGrandArchiveMoveName,
  projectGrandArchiveViewerLog,
  projectGrandArchiveViewerState,
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
  type GrandArchiveCommand,
  type GrandArchiveMatchProgram,
  type GrandArchiveMatchSnapshotV1,
} from "@tcg/grand-archive-engine/simulator";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";

export interface GrandArchiveReplayCommandV1 {
  readonly sequence: number;
  readonly actorId: string;
  readonly expectedStateVersion: number;
  readonly resultingStateVersion: number;
  readonly command: GrandArchiveCommand;
  readonly eventTypes: readonly string[];
  readonly correlationId?: string;
}

/** Server-authoritative replay. Never expose this envelope directly to a viewer. */
export interface GrandArchiveReplayV1 {
  readonly schemaVersion: 1;
  readonly game: "grand-archive";
  readonly programFingerprint: string;
  readonly initialSnapshot: GrandArchiveMatchSnapshotV1;
  readonly commands: readonly GrandArchiveReplayCommandV1[];
  readonly finalSnapshotFingerprint: string;
  readonly publicLogFingerprint: string;
}

export interface GrandArchiveReplayJournalV1 {
  readonly schemaVersion: 1;
  readonly programFingerprint: string;
  readonly initialSnapshot: GrandArchiveMatchSnapshotV1;
  readonly commands: readonly GrandArchiveReplayCommandV1[];
  readonly acceptedCorrelationIds: readonly string[];
}

export interface GrandArchiveReplayInspection {
  readonly schemaVersion: 1;
  readonly game: "grand-archive";
  readonly throughCommand: number;
  readonly snapshotFingerprint: string;
  readonly viewerState: unknown;
  readonly viewerLog: unknown;
}

function canonicalJson(value: unknown): string {
  if (value === undefined) return "undefined";
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
      .map(([key, nested]) => `${JSON.stringify(key)}:${canonicalJson(nested)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function fingerprintGrandArchiveValue(value: unknown): string {
  return `ga-v1-sha256:${bytesToHex(sha256(new TextEncoder().encode(canonicalJson(value))))}`;
}

function publicLog(program: GrandArchiveMatchProgram, snapshot: GrandArchiveMatchSnapshotV1) {
  const state = restoreGrandArchiveMatchSnapshot(program, snapshot);
  const perPlayer = state.turnOrder.map((playerId) =>
    projectGrandArchiveViewerLog(program, state, playerId),
  );
  if (perPlayer.length === 0) return [];
  return perPlayer[0]!.filter((message) => {
    const fingerprint = fingerprintGrandArchiveValue(message);
    return perPlayer
      .slice(1)
      .every((messages) =>
        messages.some((candidate) => fingerprintGrandArchiveValue(candidate) === fingerprint),
      );
  });
}

export function createGrandArchiveReplayJournal(
  initialSnapshot: GrandArchiveMatchSnapshotV1,
  programFingerprint: string,
): GrandArchiveReplayJournalV1 {
  return {
    schemaVersion: 1,
    programFingerprint,
    initialSnapshot,
    commands: [],
    acceptedCorrelationIds: [],
  };
}

export function appendGrandArchiveReplayCommand(
  journal: GrandArchiveReplayJournalV1,
  command: GrandArchiveReplayCommandV1,
): GrandArchiveReplayJournalV1 {
  return {
    ...journal,
    commands: [...journal.commands, command],
    acceptedCorrelationIds:
      command.correlationId && !journal.acceptedCorrelationIds.includes(command.correlationId)
        ? [...journal.acceptedCorrelationIds, command.correlationId]
        : journal.acceptedCorrelationIds,
  };
}

export function parseGrandArchiveReplayJournal(
  value: unknown,
  program: GrandArchiveMatchProgram,
): GrandArchiveReplayJournalV1 {
  if (!value || typeof value !== "object")
    throw new Error("Grand Archive replay metadata is missing");
  const candidate = value as Partial<GrandArchiveReplayJournalV1>;
  if (
    candidate.schemaVersion !== 1 ||
    candidate.programFingerprint !== program.fingerprint ||
    !Array.isArray(candidate.commands) ||
    !Array.isArray(candidate.acceptedCorrelationIds)
  ) {
    throw new Error("Grand Archive replay metadata has an unsupported schema or catalog");
  }
  if (!candidate.initialSnapshot)
    throw new Error("Grand Archive replay initial snapshot is missing");
  const initialSnapshot = candidate.initialSnapshot;
  restoreGrandArchiveMatchSnapshot(program, initialSnapshot);
  if (
    candidate.acceptedCorrelationIds.some(
      (value) => typeof value !== "string" || value.length === 0,
    ) ||
    new Set(candidate.acceptedCorrelationIds).size !== candidate.acceptedCorrelationIds.length
  ) {
    throw new Error("Grand Archive replay retry ledger is malformed");
  }
  let expectedSequence = 0;
  let expectedStateVersion = initialSnapshot.stateVersion;
  const recordedCorrelationIds = new Set<string>();
  for (const command of candidate.commands) {
    if (
      !command ||
      typeof command !== "object" ||
      command.sequence !== expectedSequence ||
      command.expectedStateVersion !== expectedStateVersion ||
      !Number.isSafeInteger(command.resultingStateVersion) ||
      command.resultingStateVersion <= command.expectedStateVersion ||
      typeof command.actorId !== "string" ||
      !command.command ||
      !isGrandArchiveMoveName(command.command.move) ||
      !Array.isArray(command.eventTypes) ||
      command.eventTypes.some((eventType: unknown) => typeof eventType !== "string") ||
      (command.correlationId !== undefined &&
        (typeof command.correlationId !== "string" || command.correlationId.length === 0))
    ) {
      throw new Error(`Grand Archive replay command ${expectedSequence} is malformed`);
    }
    if (command.correlationId) recordedCorrelationIds.add(command.correlationId);
    expectedStateVersion = command.resultingStateVersion;
    expectedSequence += 1;
  }
  if (
    recordedCorrelationIds.size !== candidate.acceptedCorrelationIds.length ||
    candidate.acceptedCorrelationIds.some((value) => !recordedCorrelationIds.has(value))
  ) {
    throw new Error("Grand Archive replay retry ledger does not match its command stream");
  }
  return candidate as GrandArchiveReplayJournalV1;
}

/** Restores only by replaying the validated authoritative command journal. */
export function restoreGrandArchiveReplayJournal(
  program: GrandArchiveMatchProgram,
  value: unknown,
): {
  readonly journal: GrandArchiveReplayJournalV1;
  readonly runtime: GrandArchiveMatchRuntime;
} {
  const journal = parseGrandArchiveReplayJournal(value, program);
  const runtime = new GrandArchiveMatchRuntime(
    program,
    restoreGrandArchiveMatchSnapshot(program, journal.initialSnapshot),
  );
  for (const entry of journal.commands) {
    if (runtime.state.stateVersion !== entry.expectedStateVersion) {
      throw new Error(`Grand Archive journal diverged before command ${entry.sequence}`);
    }
    const transition = runtime.execute(entry.command, {
      playerId: grandArchivePlayerId(entry.actorId),
      expectedStateVersion: entry.expectedStateVersion,
    });
    if (!transition.ok || transition.state.stateVersion !== entry.resultingStateVersion) {
      throw new Error(`Grand Archive journal rejected or diverged at command ${entry.sequence}`);
    }
    if (
      fingerprintGrandArchiveValue(transition.events.map((event) => event.type)) !==
      fingerprintGrandArchiveValue(entry.eventTypes)
    ) {
      throw new Error(`Grand Archive journal event stream diverged at command ${entry.sequence}`);
    }
  }
  return { journal, runtime };
}

export function exportGrandArchiveReplay(
  program: GrandArchiveMatchProgram,
  journal: GrandArchiveReplayJournalV1,
  finalSnapshot: GrandArchiveMatchSnapshotV1,
): GrandArchiveReplayV1 {
  return {
    schemaVersion: 1,
    game: "grand-archive",
    programFingerprint: program.fingerprint,
    initialSnapshot: journal.initialSnapshot,
    commands: journal.commands,
    finalSnapshotFingerprint: fingerprintGrandArchiveValue(finalSnapshot),
    publicLogFingerprint: fingerprintGrandArchiveValue(publicLog(program, finalSnapshot)),
  };
}

export function replayGrandArchiveReplay(
  program: GrandArchiveMatchProgram,
  replay: GrandArchiveReplayV1,
): GrandArchiveMatchSnapshotV1 {
  if (replay.schemaVersion !== 1 || replay.game !== "grand-archive") {
    throw new Error("Unsupported Grand Archive replay schema");
  }
  if (replay.programFingerprint !== program.fingerprint) {
    throw new Error("Grand Archive replay program fingerprint does not match the catalog");
  }
  const runtime = new GrandArchiveMatchRuntime(
    program,
    restoreGrandArchiveMatchSnapshot(program, replay.initialSnapshot),
  );
  for (const entry of replay.commands) {
    if (runtime.state.stateVersion !== entry.expectedStateVersion) {
      throw new Error(`Grand Archive replay diverged before command ${entry.sequence}`);
    }
    const transition = runtime.execute(entry.command, {
      playerId: grandArchivePlayerId(entry.actorId),
      expectedStateVersion: entry.expectedStateVersion,
    });
    if (!transition.ok || transition.state.stateVersion !== entry.resultingStateVersion) {
      throw new Error(`Grand Archive replay rejected or diverged at command ${entry.sequence}`);
    }
    if (
      fingerprintGrandArchiveValue(transition.events.map((event) => event.type)) !==
      fingerprintGrandArchiveValue(entry.eventTypes)
    ) {
      throw new Error(`Grand Archive replay event stream diverged at command ${entry.sequence}`);
    }
  }
  const snapshot = serializeGrandArchiveMatchSnapshot(runtime.state);
  if (fingerprintGrandArchiveValue(snapshot) !== replay.finalSnapshotFingerprint) {
    throw new Error("Grand Archive replay final snapshot fingerprint diverged");
  }
  if (fingerprintGrandArchiveValue(publicLog(program, snapshot)) !== replay.publicLogFingerprint) {
    throw new Error("Grand Archive replay public log fingerprint diverged");
  }
  return snapshot;
}

export function inspectGrandArchiveReplay(
  program: GrandArchiveMatchProgram,
  replay: GrandArchiveReplayV1,
  viewerId: string,
  throughCommand = replay.commands.length,
): GrandArchiveReplayInspection {
  if (
    replay.schemaVersion !== 1 ||
    replay.game !== "grand-archive" ||
    replay.programFingerprint !== program.fingerprint
  ) {
    throw new Error("Replay inspection does not match the Grand Archive catalog");
  }
  if (
    !Number.isSafeInteger(throughCommand) ||
    throughCommand < 0 ||
    throughCommand > replay.commands.length
  ) {
    throw new Error("Replay command index is outside the accepted command stream");
  }
  const runtime = new GrandArchiveMatchRuntime(
    program,
    restoreGrandArchiveMatchSnapshot(program, replay.initialSnapshot),
  );
  for (const entry of replay.commands.slice(0, throughCommand)) {
    if (runtime.state.stateVersion !== entry.expectedStateVersion) {
      throw new Error(`Replay inspection diverged before command ${entry.sequence}`);
    }
    const transition = runtime.execute(entry.command, {
      playerId: grandArchivePlayerId(entry.actorId),
      expectedStateVersion: entry.expectedStateVersion,
    });
    if (!transition.ok || transition.state.stateVersion !== entry.resultingStateVersion) {
      throw new Error(`Replay inspection diverged at command ${entry.sequence}`);
    }
    if (
      fingerprintGrandArchiveValue(transition.events.map((event) => event.type)) !==
      fingerprintGrandArchiveValue(entry.eventTypes)
    ) {
      throw new Error(`Replay inspection event stream diverged at command ${entry.sequence}`);
    }
  }
  const playerId = grandArchivePlayerId(viewerId);
  return {
    schemaVersion: 1,
    game: "grand-archive",
    throughCommand,
    snapshotFingerprint: fingerprintGrandArchiveValue(
      serializeGrandArchiveMatchSnapshot(runtime.state),
    ),
    viewerState: projectGrandArchiveViewerState(program, runtime.state, playerId),
    viewerLog: projectGrandArchiveViewerLog(program, runtime.state, playerId),
  };
}
