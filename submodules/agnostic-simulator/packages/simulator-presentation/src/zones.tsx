import { Fragment, type ReactNode } from "react";

/** Layout belongs to the caller. Identity, visibility and slot iteration do not. */
export function PresentationZone<Card, Pose>({
  cards,
  getKey,
  getPose,
  children,
}: {
  cards: readonly Card[];
  getKey: (card: Card) => string;
  getPose: (card: Card, index: number) => Pose | undefined;
  children: (card: Card, pose: Pose, index: number) => ReactNode;
}) {
  return (
    <>
      {cards.map((card, index) => {
        const pose = getPose(card, index);
        return pose === undefined ? null : (
          <Fragment key={getKey(card)}>{children(card, pose, index)}</Fragment>
        );
      })}
    </>
  );
}

/** Centered row/grid slots, in caller-owned units (pixels or world coordinates). */
export function cardRowSlot(
  index: number,
  count: number,
  spacing: number,
  columns = count,
  rowSpacing = 0,
) {
  return {
    x: ((index % columns) - (columns - 1) / 2) * spacing,
    y: Math.floor(index / columns) * rowSpacing,
  };
}
