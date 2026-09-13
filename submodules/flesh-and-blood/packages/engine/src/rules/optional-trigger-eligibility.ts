import type { FabTriggeredResolution } from "./layers.ts";
import type { FabTriggerSource } from "./trigger-matcher.ts";

const ELIGIBLE_ZONES = new Set(["heroZone", "head", "chest", "arms", "legs", "weapon1", "weapon2"]);
const ELIGIBLE_TYPES = new Set(["Hero", "Equipment", "Weapon"]);

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
    source.source.current.typeBox.types.some((type) => ELIGIBLE_TYPES.has(type)) &&
    resolutionContainsControllerOptional(source.resolution)
  );
}
