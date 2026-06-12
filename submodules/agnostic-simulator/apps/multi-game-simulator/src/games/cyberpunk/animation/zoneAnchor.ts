import type { Side } from "../engine";
import type { CardMoveStep } from "./types";

/**
 * Map an engine `CardZone` to the `data-testid` we surface on its UI zone
 * container. Used to resolve a source rect when a per-card snapshot isn't
 * available — most importantly the rival's face-down hand, where hand cards
 * intentionally omit `data-card-id` for privacy.
 */
const ZONE_TESTID: Partial<Record<CardMoveStep["fromZone"], string>> = {
  hand: "hand-zone",
  deck: "deck-zone",
  field: "field-zone",
  trash: "trash-zone",
  legendArea: "legends-zone",
  eddieArea: "eddies-zone",
};

export function findZoneElement(zone: CardMoveStep["fromZone"], side: Side): HTMLElement | null {
  const testid = ZONE_TESTID[zone];
  if (!testid) return null;
  return document.querySelector<HTMLElement>(`[data-testid="${testid}"][data-side="${side}"]`);
}
