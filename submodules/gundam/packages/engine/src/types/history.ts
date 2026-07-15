import type { PlayerId } from "./branded.ts";
import type { ActorRole } from "./command.ts";

export interface MoveHistoryEntry {
  moveId: string;
  commandID: string;
  args: unknown;
  playerId: PlayerId;
  actorRole: ActorRole;
  timestamp: number;
  stateID: number;
  turnNumber: number;
  gameSegment?: string;
  phase?: string;
  step?: string;
}
