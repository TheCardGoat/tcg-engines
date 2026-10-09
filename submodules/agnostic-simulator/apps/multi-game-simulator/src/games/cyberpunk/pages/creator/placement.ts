import { creatorCards, setupSchema, type CreatorSetup, type CreatorZone } from "./setup";
import type { Side } from "../../engine";

export type CardLocation = { side: Side; zone: CreatorZone; index: number };
export type CardSource = { id: string; location?: CardLocation };
export type CardDestination = { side: Side; zone: CreatorZone; hostIndex?: number };

/** Authoring operations never dispatch gameplay moves. Validate the complete draft before saving. */
export function placeCard(
  setup: CreatorSetup,
  source: CardSource,
  target: CardDestination,
): CreatorSetup {
  const card = creatorCards.find((entry) => entry.id === source.id);
  if (!card) throw new Error("Card not found.");
  const next = structuredClone(setup);
  const entry = source.location
    ? next[source.location.side][source.location.zone][source.location.index]
    : { id: card.id, spent: false, faceDown: target.zone === "legendArea", damage: 0, gearIds: [] };
  if (!entry || entry.id !== source.id) throw new Error("Select the card again.");
  if (target.hostIndex !== undefined) {
    if (card.type !== "gear") throw new Error("Only gear can attach to a card.");
    if (target.zone !== "field" && target.zone !== "legendArea")
      throw new Error("Choose a Unit or Legend on the board.");
    const host = next[target.side][target.zone][target.hostIndex];
    const hostType = creatorCards.find((entry) => entry.id === host?.id)?.type;
    if (!host || (hostType !== "unit" && hostType !== "legend"))
      throw new Error("Choose a Unit or Legend.");
    host.gearIds.push(card.id);
  } else {
    if (target.zone === "field" && card.type !== "unit" && card.type !== "legend")
      throw new Error("Drop Units or Legends in the Field. Drop gear onto a Unit or Legend.");
    if (target.zone === "legendArea" && card.type !== "legend")
      throw new Error("Only Legends can go in the Legends zone.");
    if (source.location?.side === target.side && source.location.zone === target.zone) return setup;
    next[target.side][target.zone].push(entry);
  }
  if (source.location)
    next[source.location.side][source.location.zone].splice(source.location.index, 1);
  const parsed = setupSchema.safeParse(next);
  if (!parsed.success)
    throw new Error(parsed.error.issues[0]?.message ?? "This placement is not valid.");
  return parsed.data;
}
