/**
 * UI-side drop-event domain types. Owned by the engine adapter so that
 * components and the engine-mapping layer agree on shape without either side
 * importing from the other.
 *
 * - `CardDragSource`: where the drag started (zone + index, plus optional
 *   engine card id when the source is engine-aware).
 * - `DropTarget`: where the drag landed — a zone or a specific card-in-zone.
 * - `CardDropEvent`: the (source, target) pair handed to the page on drop.
 */

export interface CardDragSource {
  type: "card";
  /** Zone the card currently lives in (e.g. "p-hand", "p-field", "opp-field"). */
  zone: string;
  /** Position within the zone. */
  index: number;
  /** Visual data needed to render the drag overlay. */
  imageUrl?: string;
  name?: string;
  /** Engine card-instance id, when the source card is engine-aware. */
  cardId?: string;
  /** Public card category, when the source card is face-up and engine-aware. */
  cardType?: "legend" | "unit" | "gear" | "program";
}

export type DropTarget =
  | { type: "zone"; zone: string }
  | { type: "card"; zone: string; index: number; cardId?: string };

export interface CardDropEvent {
  source: CardDragSource;
  target: DropTarget;
}
