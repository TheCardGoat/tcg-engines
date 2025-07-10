import type { LogEntry } from "@lorcanito/lorcana-engine/types/Log";
import type { NotificationType } from "@lorcanito/lorcana-engine/types/Notification";

type MatchMetadata = {
  chat: "free_text" | "preset" | "disabled";
};

export type Dependencies = {
  playerId: string;
  logger: {
    log: (entry: LogEntry) => void;
    batchLogs: (entries: LogEntry[]) => Promise<void> | void;
  };
  notifier: {
    sendNotification: (notification: unknown) => void;
    clearNotification: (id: string) => void;
    clearAllNotifications: () => void;
  };
  modals: {
    openYesOrNoModal: (args: unknown) => void;
    openTargetModal: (args: unknown) => void;
    openScryModal: (args: unknown) => void;
  };
  // TODO: This is a temporary solution to avoid circular dependencies
  externals?: {
    undo?: (mode: "turn" | "move") => Promise<void>;
    updateMetadata?: (metadata: Partial<MatchMetadata>) => Promise<void>;
    concede?: (params: {
      loserId: string;
      reason: string;
      type: "game" | "match";
    }) => Promise<void>;
  };
};

export type MatchLog = {
  id: string;
};

export type MoveResponse = {
  success: boolean;
  notifications?: NotificationType[];
  logs?: LogEntry[];
};

export type { MatchMove } from "@lorcanito/lorcana-engine/types/Moves";
