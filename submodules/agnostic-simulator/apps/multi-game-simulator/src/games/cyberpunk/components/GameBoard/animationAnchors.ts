import { PLAYER_SIDE_TO_ID, type Side } from "../../engine";
import type { SimulatorZone } from "@tcg/simulator-contract";

type SimZoneVisibility = "public" | "private" | "secret";

interface SimZoneAnchorInput {
  id: string;
  side?: Side;
  visibility: SimZoneVisibility;
  role: SimulatorZone["role"];
}

interface SimEntityAnchorInput {
  entityId?: string;
  zoneId?: string;
  side?: Side;
  face: "public" | "hidden";
}

export function simZoneAnchor({ id, side, visibility, role }: SimZoneAnchorInput) {
  return {
    "data-sim-zone-id": id,
    "data-sim-zone-owner": side ? String(PLAYER_SIDE_TO_ID[side]) : undefined,
    "data-sim-zone-visibility": visibility,
    "data-sim-zone-role": role,
  };
}

export function simEntityAnchor({ entityId, zoneId, side, face }: SimEntityAnchorInput) {
  if (!entityId || !zoneId) {
    return {};
  }

  return {
    "data-sim-entity-id": entityId,
    "data-sim-zone-id": zoneId,
    "data-sim-card-face": face,
    "data-sim-card-owner": side ? String(PLAYER_SIDE_TO_ID[side]) : undefined,
  };
}
