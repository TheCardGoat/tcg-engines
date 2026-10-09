import type { GrandArchiveBoardMetrics } from "./types";

/** Demand rendering has no idle frames: readiness/resource changes report immediately. */
export function grandArchiveShouldReportMetrics(
  previous: GrandArchiveBoardMetrics | undefined,
  current: GrandArchiveBoardMetrics,
  elapsedSinceReport: number,
): boolean {
  return (
    !previous ||
    previous.drawCalls !== current.drawCalls ||
    previous.geometries !== current.geometries ||
    previous.textures !== current.textures ||
    elapsedSinceReport >= 0.5
  );
}
