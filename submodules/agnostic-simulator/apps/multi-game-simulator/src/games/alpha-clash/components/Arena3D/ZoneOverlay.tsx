import { indicatorPosition } from "./indicator-position";
import type { AcSeat, LiveBoardState } from "../board-types";
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
  destinationIds,
  compact = false,
  players,
}: {
  destinationIds?: ReadonlySet<string>;
  compact?: boolean;
  players: LiveBoardState["players"];
  zones: ArenaZone[];
  anchors: ZoneAnchor[];
  viewer: AcSeat;
  onOpen: (zone: ArenaZone) => void;
  onHighlight: (id: string | null) => void;
}) {
  const targets = anchors.flatMap((anchor) => {
    const zone = zones.find((candidate) => candidate.id === anchor.id);
    if (!zone || (destinationIds && !destinationIds.has(zone.id))) return [];
    const indicator = indicatorPosition(zone, anchor, viewer, compact, anchors);
    const owner = zone.seat === viewer ? "Your" : "Opponent's";
    const count =
      zone.zone === "contender"
        ? `${players[zone.seat].health} health`
        : zone.ready === undefined
          ? `${zone.count} ${zone.count === 1 ? "card" : "cards"}`
          : `${zone.ready} ready / ${zone.count} total`;
    return [
      {
        ...anchor,
        ...(["deck", "oblivion", "banished"].includes(zone.zone)
          ? {
              left: indicator.left - (compact ? 22 : 26),
              top: indicator.top - (compact ? 28 : 35),
              width: compact ? 44 : 52,
              height: compact ? 56 : 70,
            }
          : {}),
        label: `${destinationIds ? "Place card here · " : ""}${owner} ${zone.name.toLowerCase()} · ${count}`,
      },
    ];
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
