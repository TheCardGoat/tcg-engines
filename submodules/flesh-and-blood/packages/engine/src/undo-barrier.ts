import type { FabUndoBarrier, FabUndoBarrierReason } from "./moves.ts";
import type { CommittedEvent } from "./rules/events.ts";

const ORDERED_REASONS: readonly FabUndoBarrierReason[] = [
  "draw",
  "reveal",
  "move-hidden-to-public",
  "look-hidden-zone",
  "search-hidden-zone",
  "shuffle",
  "random-result",
];

const HIDDEN_ORIGINS = new Set(["deck", "hand", "arsenal", "inventory"]);
const PUBLIC_DESTINATIONS = new Set([
  "pitch",
  "graveyard",
  "banished",
  "soul",
  "combat-chain",
  "stack",
  "arena",
  "head",
  "chest",
  "arms",
  "legs",
  "weapon1",
  "weapon2",
  "permanent",
]);

/**
 * Derive the conservative information barrier for one accepted command from
 * its committed FAB events. This reports exposure only; the server owns undo
 * snapshots, eligibility, retention, and restoration.
 */
export function fabUndoBarrierForEvents(events: readonly CommittedEvent[]): FabUndoBarrier | null {
  const reasons = new Set<FabUndoBarrierReason>();

  for (const event of events) {
    switch (event.name) {
      case "draw":
        reasons.add("draw");
        break;
      case "reveal":
      case "fuse":
      case "turn-face-up":
        reasons.add("reveal");
        break;
      case "look":
      case "opt":
        reasons.add("look-hidden-zone");
        break;
      case "search":
        reasons.add("search-hidden-zone");
        break;
      case "shuffle-zone":
        reasons.add("shuffle");
        break;
      case "roll":
      case "roll-request":
      case "random-token-request":
      case "consume-random-index":
        reasons.add("random-result");
        break;
    }

    if (movesHiddenIdentityToPublic(event)) reasons.add("move-hidden-to-public");
    if (event.name === "discard" && event.data.random) reasons.add("random-result");
  }

  const ordered = ORDERED_REASONS.filter((reason) => reasons.has(reason));
  return ordered.length > 0 ? { reasons: ordered } : null;
}

function movesHiddenIdentityToPublic(event: CommittedEvent): boolean {
  if (
    event.name === "play" ||
    event.name === "announce-card" ||
    event.name === "pitch" ||
    event.name === "discard" ||
    event.name === "charge"
  ) {
    return "from" in event.data
      ? HIDDEN_ORIGINS.has(event.data.from)
      : event.data.object.visibility === "private" || event.data.object.faceDown;
  }

  if (
    event.name !== "banish" &&
    event.name !== "move-zone" &&
    event.name !== "put-into-graveyard" &&
    event.name !== "enter-arena" &&
    event.name !== "equip"
  ) {
    return false;
  }

  const fromHidden =
    HIDDEN_ORIGINS.has(event.data.from) ||
    event.data.object.visibility === "private" ||
    event.data.object.faceDown;
  const destinationPublic = PUBLIC_DESTINATIONS.has(event.data.to) && event.data.faceDown !== true;
  return fromHidden && destinationPublic;
}
