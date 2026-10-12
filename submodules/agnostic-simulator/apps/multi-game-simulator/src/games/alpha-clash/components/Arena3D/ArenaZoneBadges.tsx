import { indicatorPosition } from "./indicator-position";
import { Shield, Zap } from "lucide-react";
import type { AcSeat } from "../board-types";
import type { ZoneAnchor } from "./Scene";
import type { ArenaZone } from "./zones";
import { ArenaIndicator } from "./ArenaIndicator";
import styles from "./arena-zone-badges.module.css";

/** Public counts only. The existing spatial zone targets own all input. */
export function ArenaZoneBadges({
  zones,
  anchors,
  viewer,
  highlighted,
  destinationIds,
  compact = false,
}: {
  zones: ArenaZone[];
  anchors: ZoneAnchor[];
  viewer: AcSeat;
  highlighted: string | null;
  destinationIds?: ReadonlySet<string>;
  compact?: boolean;
}) {
  return (
    <div className={styles.layer} aria-hidden="true">
      {zones.map((zone) => {
        if (!zone.counter || zone.zone === "resource") return null;
        const anchor = anchors.find((entry) => entry.id === zone.id);
        if (!anchor) return null;
        if (zone.zone === "deck" || zone.zone === "oblivion" || zone.zone === "banished") {
          return (
            <div
              key={zone.id}
              className={styles.indicator}
              data-zone={zone.zone}
              style={indicatorPosition(zone, anchor, viewer, compact, anchors)}
            >
              <ArenaIndicator
                kind={zone.zone}
                value={zone.count}
                hovered={highlighted === zone.id}
                selectable={destinationIds?.has(zone.id)}
              />
              {highlighted === zone.id && (
                <span className={styles.indicatorLabel}>
                  {zone.name} · {zone.count} cards
                </span>
              )}
            </div>
          );
        }
        const Icon = zone.zone === "accessory" ? Shield : Zap;
        return (
          <div
            key={zone.id}
            className={styles.badge}
            data-zone={zone.zone}
            data-own={zone.seat === viewer || undefined}
            data-empty={zone.count === 0 || undefined}
            data-lit={highlighted === zone.id || undefined}
            style={{ left: anchor.captionLeft, top: anchor.captionTop }}
          >
            <Icon size={17} strokeWidth={1.6} />
            <b>{zone.ready ?? zone.count}</b>
            {zone.ready !== undefined && (
              <>
                <span className={styles.total}>/ {zone.count}</span>
                <span className={styles.cells}>
                  {Array.from({ length: Math.min(zone.count, 12) }, (_, index) => (
                    <i key={index} data-ready={index < zone.ready! || undefined} />
                  ))}
                </span>
              </>
            )}
            <span className={styles.caption}>{zone.name}</span>
          </div>
        );
      })}
    </div>
  );
}
