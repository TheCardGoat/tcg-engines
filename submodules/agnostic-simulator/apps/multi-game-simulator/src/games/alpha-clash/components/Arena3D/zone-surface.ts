import type { ArenaZone } from "./zones";

/** Geometry shared by the table engraving and its drop highlight. */
export function zoneSurface(zone: ArenaZone) {
  const width = zone.width + (zone.zone === "clashground" ? 10 : 0);
  const height = zone.height;
  return {
    width,
    height,
    inset: 3,
    bevel: Math.min(12, height / 5),
    arm: Math.min(30, height / 3),
    z: -2,
  };
}
