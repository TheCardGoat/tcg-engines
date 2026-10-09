import type { AcSeat } from "../board-types";
import type { ZoneAnchor } from "./Scene";
import type { ArenaZone } from "./zones";
import { SpatialZoneTargets } from "@tcg/simulator-presentation/inspection";

/** Semantic hit targets only; visible zone markings belong to the scene. */
export function ZoneOverlay({
  zones,
  anchors,
  viewer,
  onOpen,
  onHighlight,
}: {
  zones: ArenaZone[];
  anchors: ZoneAnchor[];
  viewer: AcSeat;
  onOpen: (zone: ArenaZone) => void;
  onHighlight: (id: string | null) => void;
}) {
  const targets = anchors.flatMap((anchor) => {
    const zone = zones.find((candidate) => candidate.id === anchor.id);
    if (!zone) return [];
    const owner = zone.seat === viewer ? "Your" : "Opponent's";
    const count =
      zone.ready === undefined
        ? `${zone.count} ${zone.count === 1 ? "card" : "cards"}`
        : `${zone.ready} ready / ${zone.count} total`;
    return [{ ...anchor, label: `${owner} ${zone.name.toLowerCase()} · ${count}` }];
  });
  return (
    <SpatialZoneTargets
      targets={targets}
      onHighlight={onHighlight}
      onOpen={(id) => {
        const zone = zones.find((candidate) => candidate.id === id);
        if (zone) onOpen(zone);
      }}
    />
  );
}
