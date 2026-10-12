import type { AcSeat } from "../board-types";
import type { ZoneAnchor } from "./Scene";
import type { ArenaZone } from "./zones";

/** Keep the visible badge and its hit area together, clear of the contender frame. */
export function indicatorPosition(
  zone: ArenaZone,
  anchor: ZoneAnchor,
  viewer: AcSeat,
  compact: boolean,
  anchors: readonly ZoneAnchor[],
) {
  const index = ["deck", "oblivion", "banished"].indexOf(zone.zone);
  if (index < 0) return { left: anchor.captionLeft, top: anchor.captionTop };
  // One projected origin keeps both seats in the same order and on one baseline.
  const center = anchors.find((entry) => entry.id === `${zone.seat}:oblivion`) ?? anchor;
  const spacing = compact ? 48 : 56;
  return {
    left: center.captionLeft + (index - 1) * spacing,
    top: center.captionTop + (compact ? (zone.seat === viewer ? 22 : -12) : 0),
  };
}
