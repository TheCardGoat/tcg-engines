import {
  getGrandArchiveAutomatedActionStrategyOption,
  type GrandArchiveAutomatedActionStrategyId,
} from "@tcg/grand-archive-engine/automation";
import {
  GrandArchiveServerEngine,
  restoreGrandArchiveReplayJournal,
  type GrandArchiveReplayJournalV1,
} from "@tcg/grand-archive-server-adapter";
import type { SimulatorBotPacing } from "../../simulator/SimulatorBotQuickControls";

const GRAND_ARCHIVE_PRACTICE_SESSION_KEY = "grand-archive-practice:active-match:v3";

export interface StoredGrandArchivePracticeChatMessage {
  readonly id: number;
  readonly recordedAt: number;
  readonly turn: number;
  readonly actorId: string;
  readonly message: string;
}

interface StoredGrandArchivePracticeSessionV3 {
  readonly version: 3;
  readonly programFingerprint: string;
  readonly strategyId: GrandArchiveAutomatedActionStrategyId;
  readonly botPacing: SimulatorBotPacing;
  readonly journal: GrandArchiveReplayJournalV1;
  readonly chatMessages: readonly StoredGrandArchivePracticeChatMessage[];
}

export type RestoredGrandArchivePracticeSession =
  | { readonly kind: "none" }
  | {
      readonly kind: "restored";
      readonly server: GrandArchiveServerEngine;
      readonly strategyId: GrandArchiveAutomatedActionStrategyId;
      readonly botPacing: SimulatorBotPacing;
      readonly chatMessages: readonly StoredGrandArchivePracticeChatMessage[];
    }
  | { readonly kind: "error"; readonly message: string };

function browserSessionStorage(): Storage | undefined {
  return typeof window === "undefined" ? undefined : window.sessionStorage;
}

export function persistGrandArchivePracticeSession(
  server: GrandArchiveServerEngine,
  strategyId: GrandArchiveAutomatedActionStrategyId,
  botPacing: SimulatorBotPacing,
  chatMessages: readonly StoredGrandArchivePracticeChatMessage[] = [],
  storage: Storage | undefined = browserSessionStorage(),
): boolean {
  if (!storage) return false;
  try {
    const session: StoredGrandArchivePracticeSessionV3 = {
      version: 3,
      programFingerprint: server.program.fingerprint,
      strategyId,
      botPacing,
      journal: server.replayJournal,
      chatMessages,
    };
    storage.setItem(GRAND_ARCHIVE_PRACTICE_SESSION_KEY, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}

export function restoreGrandArchivePracticeSession(
  createFreshServer: () => GrandArchiveServerEngine,
  storage: Storage | undefined = browserSessionStorage(),
): RestoredGrandArchivePracticeSession {
  if (!storage) return { kind: "none" };
  const serialized = storage.getItem(GRAND_ARCHIVE_PRACTICE_SESSION_KEY);
  if (!serialized) return { kind: "none" };
  try {
    const value: unknown = JSON.parse(serialized);
    if (!value || typeof value !== "object") throw new Error("Invalid practice session document.");
    const candidate = value as {
      readonly version?: unknown;
      readonly programFingerprint?: unknown;
      readonly strategyId?: unknown;
      readonly botPacing?: unknown;
      readonly journal?: unknown;
      readonly chatMessages?: unknown;
    };
    if (
      candidate.version !== 3 ||
      typeof candidate.programFingerprint !== "string" ||
      typeof candidate.strategyId !== "string" ||
      !Array.isArray(candidate.chatMessages) ||
      !candidate.chatMessages.every(isStoredGrandArchivePracticeChatMessage)
    ) {
      storage.removeItem(GRAND_ARCHIVE_PRACTICE_SESSION_KEY);
      return { kind: "none" };
    }
    const strategy = getGrandArchiveAutomatedActionStrategyOption(candidate.strategyId);
    if (!strategy || (candidate.botPacing !== "auto" && candidate.botPacing !== "step")) {
      storage.removeItem(GRAND_ARCHIVE_PRACTICE_SESSION_KEY);
      return { kind: "none" };
    }
    const fresh = createFreshServer();
    if (candidate.programFingerprint !== fresh.program.fingerprint) {
      storage.removeItem(GRAND_ARCHIVE_PRACTICE_SESSION_KEY);
      return { kind: "none" };
    }
    const restored = restoreGrandArchiveReplayJournal(fresh.program, candidate.journal);
    return {
      kind: "restored",
      server: new GrandArchiveServerEngine(fresh.program, restored.runtime, restored.journal),
      strategyId: strategy.id,
      botPacing: candidate.botPacing,
      chatMessages: candidate.chatMessages,
    };
  } catch (error) {
    return {
      kind: "error",
      message: error instanceof Error ? error.message : "The saved match could not be restored.",
    };
  }
}

function isStoredGrandArchivePracticeChatMessage(
  value: unknown,
): value is StoredGrandArchivePracticeChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<Record<keyof StoredGrandArchivePracticeChatMessage, unknown>>;
  return (
    typeof message.id === "number" &&
    typeof message.recordedAt === "number" &&
    typeof message.turn === "number" &&
    typeof message.actorId === "string" &&
    typeof message.message === "string"
  );
}

export function undoGrandArchivePracticeCommand(
  server: GrandArchiveServerEngine,
  actorId: string,
): GrandArchiveServerEngine | null {
  const commandIndex = server.replayJournal.commands.findLastIndex(
    (command) => command.actorId === actorId,
  );
  if (commandIndex < 0) return null;
  const commands = server.replayJournal.commands.slice(0, commandIndex);
  const acceptedCorrelationIds = commands.flatMap((command) =>
    command.correlationId ? [command.correlationId] : [],
  );
  const journal: GrandArchiveReplayJournalV1 = {
    ...server.replayJournal,
    commands,
    acceptedCorrelationIds,
  };
  const restored = restoreGrandArchiveReplayJournal(server.program, journal);
  return new GrandArchiveServerEngine(server.program, restored.runtime, restored.journal);
}

export function clearGrandArchivePracticeSession(
  storage: Storage | undefined = browserSessionStorage(),
): void {
  storage?.removeItem(GRAND_ARCHIVE_PRACTICE_SESSION_KEY);
}
