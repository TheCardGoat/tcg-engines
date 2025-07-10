import type {
  InternalLogEntry,
  LogEntry,
} from "@lorcanito/lorcana-engine/types/Log";
import type { Zones } from "@lorcanito/lorcana-engine/types/types";
// TODO: MOVE TO ENGINE
import { createId } from "@paralleldrive/cuid2";

export const privateZones: Zones[] = ["hand", "deck"];
function isPrivateEntry(newEntry: InternalLogEntry) {
  if (newEntry.type === "MOVE_CARD") {
    if (newEntry.isPrivate) {
      return true;
    }
    return (
      privateZones.includes(newEntry.to) && privateZones.includes(newEntry.from)
    );
  }

  if (newEntry.type === "MULLIGAN" || newEntry.type === "NEW_TURN") {
    return true;
  }

  return false;
}

export const createLogEntry = ({
  logEntry,
  sender,
  newLogKey,
}: {
  logEntry: LogEntry;
  sender: string | "system";
  newLogKey?: string | null;
}) => {
  // @ts-expect-error TODO: fix this PASS_TURN needs to be fixed
  const player: string = logEntry?.sender || sender || "system";
  const newEntry: InternalLogEntry = {
    ...logEntry,
    sender: player,
    id: newLogKey || createId(),
  };
  const privateLog = isPrivateEntry(newEntry);

  if (privateLog && player && newEntry.instanceId) {
    newEntry.private = {
      [player]: {
        instanceId: newEntry.instanceId,
      },
    };
  }

  return JSON.parse(JSON.stringify(newEntry));
};
