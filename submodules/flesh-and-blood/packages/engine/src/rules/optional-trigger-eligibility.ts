import type { FabTriggeredResolution } from "./layers.ts";
import type { FabTriggerSource } from "./trigger-matcher.ts";

/**
 * Zones whose resident objects the owner may pre-automate: the hero, the
 * equipment and weapon slots, and the arena (auras, items, tokens). Zone
 * membership — not the type line — is the source of truth, so newly authored
 * permanents stay eligible without extending a type list here.
 */
const ELIGIBLE_ZONES = new Set([
  "heroZone",
  "head",
  "chest",
  "arms",
  "legs",
  "weapon1",
  "weapon2",
  "arena",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function resolutionContainsControllerOptional(resolution: FabTriggeredResolution): boolean {
  const visit = (value: unknown): boolean => {
    if (Array.isArray(value)) return value.some(visit);
    if (!isRecord(value)) return false;
    if (
      value.type === "optional" &&
      (value.chooser === undefined || value.chooser === "controller" || value.chooser === "self")
    ) {
      return true;
    }
    return Object.values(value).some(visit);
  };
  return visit(resolution);
}

export function isEligibleOptionalTriggerSource(source: FabTriggerSource): boolean {
  return (
    source.origin === "static" &&
    source.source.ownerId === source.controllerId &&
    ELIGIBLE_ZONES.has(source.source.zoneRef.zone) &&
    resolutionContainsControllerOptional(source.resolution)
  );
}
