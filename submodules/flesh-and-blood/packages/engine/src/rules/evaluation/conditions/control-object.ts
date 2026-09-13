import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { matchesFilter } from "../matches-filter.ts";
import { playerMatches, toCatalogZone } from "../helpers.ts";

/**
 * "If you/they control …" / "while attacking a hero who controls …".
 * `player` defaults to the ability controller; use `defending-hero` for
 * attack-target control (Groundbreaker Crix Seismic Surge, defending aura
 * tokens, etc.).
 */
export function evaluateControlObject(
  condition: FabCondition & { type: "control-object" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const player = condition.player ?? "controller";
  const currentlyControls = [...objects.values()].some(
    (object) =>
      playerMatches(player, object.controllerId, context) &&
      (!condition.zones || condition.zones.includes(toCatalogZone(object.input.zone.zone))) &&
      matchesFilter(object, condition.filter, context, objects),
  );
  if (currentlyControls) return true;
  if (condition.per !== "turn") return false;
  const playerId =
    player === "opponent"
      ? (context.facts?.playerIds.find((id) => id !== context.controllerId) ?? null)
      : context.controllerId;
  if (!playerId) return false;
  const name = condition.filter.name;
  if (name === "Vigor") return context.facts?.playerControlledVigorThisTurn[playerId] === true;
  if (name === "Might") return context.facts?.playerControlledMightThisTurn[playerId] === true;
  return false;
}
