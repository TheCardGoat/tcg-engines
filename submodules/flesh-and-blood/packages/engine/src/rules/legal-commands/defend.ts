import { isFabDefenseCandidate } from "../legality/defense.ts";
import { buildFabRulesView } from "../state-rules-view.ts";
import type { FabLegalCommandSource } from "./types.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import type { FabRulesView } from "../rules-view.ts";
import { evaluatedObject, shortId, type FabLegalCommand } from "./shared.ts";

const MAX_DEFEND_SETS = 1_024;

function defendSets(
  defenderIds: readonly string[],
  maxSize: number,
  strongestFirst: readonly string[],
): readonly (readonly string[])[] {
  const out: string[][] = [];
  for (const instanceId of defenderIds) {
    out.push([instanceId]);
  }
  const upper = Math.min(maxSize, defenderIds.length);
  if (defenderIds.length > 10) {
    // Ordinary hands are exhaustive. For unusually large hands, seed every
    // size (including full blocks) before spending a bounded subset budget.
    // Truncating only by size would again hide the block needed to survive.
    for (let size = 2; size <= upper && out.length < MAX_DEFEND_SETS; size++) {
      out.push(strongestFirst.slice(0, size));
    }
  }
  for (let size = 2; size <= upper; size++) {
    combine(defenderIds, size, 0, [], out);
    if (out.length >= MAX_DEFEND_SETS) break;
  }
  return out;
}

function combine(
  ids: readonly string[],
  size: number,
  start: number,
  chosen: string[],
  out: string[][],
): void {
  if (out.length >= MAX_DEFEND_SETS) return;
  if (chosen.length === size) {
    out.push([...chosen]);
    return;
  }
  for (let index = start; index <= ids.length - (size - chosen.length); index++) {
    chosen.push(ids[index]!);
    combine(ids, size, index + 1, chosen, out);
    chosen.pop();
    if (out.length >= MAX_DEFEND_SETS) break;
  }
}

function collectDefenderCandidates(
  state: FabRulesSnapshot,
  view: FabRulesView,
  actorId: string,
): string[] {
  const player = state.players[actorId];
  if (!player) return [];
  const ids: string[] = [];
  for (const instanceId of state.containers.zonesByPlayerId[actorId]!.hand) {
    const object = evaluatedObject(state, view, instanceId);
    // Defense reactions are cards played in the Reaction Step, not cards
    // declared as defenders in the Defend Step (CR 7.3 / 7.4).
    if (
      object?.current.numeric.defense !== undefined &&
      !object.current.typeBox.types.includes("Defense Reaction")
    )
      ids.push(instanceId);
  }
  for (const zone of ["head", "chest", "arms", "legs", "weapon1", "weapon2"] as const) {
    for (const instanceId of state.containers.zonesByPlayerId[actorId]![zone]) {
      const object = evaluatedObject(state, view, instanceId);
      if (
        object?.current.numeric.defense !== undefined ||
        object?.current.typeBox.types.includes("Equipment")
      )
        ids.push(instanceId);
    }
  }
  for (const instanceId of state.containers.zonesByPlayerId[actorId]!.arsenal) {
    const object = evaluatedObject(state, view, instanceId);
    // Probe filters non-ambush arsenal; include if it has defense for probe to decide.
    if (object?.current.numeric.defense !== undefined) ids.push(instanceId);
  }
  return ids;
}

/**
 * Instantiates legal defend commands: hand, equipment, and ambush arsenal.
 * Multi-card sets are atomic (CR 7.3.2).
 */
export function instantiateDefendLegalCommands(context: {
  readonly state: FabRulesSnapshot;
  readonly view: FabRulesView;
  readonly actorId: string;
  readonly maxDefendSetSize: number;
  readonly push: (command: FabLegalCommand) => void;
}): void {
  const { state, view, actorId, maxDefendSetSize, push } = context;
  // Hand, equipment, and ambush arsenal. Multi-card sets are atomic (CR 7.3.2).
  const defenderIds = collectDefenderCandidates(state, view, actorId);
  const strongestFirst =
    defenderIds.length > 10
      ? defenderIds
          .slice()
          .sort(
            (left, right) =>
              (evaluatedObject(state, view, right)?.current.numeric.defense ?? 0) -
              (evaluatedObject(state, view, left)?.current.numeric.defense ?? 0),
          )
      : defenderIds;
  for (const instanceIds of defendSets(defenderIds, maxDefendSetSize, strongestFirst)) {
    if (!view.quoteDefense({ actorId, instanceIds }).allowed) continue;
    const names = instanceIds.map(
      (id) => evaluatedObject(state, view, id)?.current.names.join(" // ") || shortId(id),
    );
    push({
      move: "defend",
      payload: { instanceIds },
      label:
        instanceIds.length === 1 ? `Defend with ${names[0]}` : `Defend with ${names.join(" + ")}`,
    });
  }
}

/** Selection candidates are not complete declarations; final sets still require a defense quote. */
export function listDefenderCandidates(runtime: FabLegalCommandSource, actorId: string): string[] {
  if (!runtime.enumerateMoves(actorId).includes("defend")) return [];
  const state = runtime.getState();
  const view = buildFabRulesView(state);
  return collectDefenderCandidates(state, view, actorId).filter((instanceId) =>
    isFabDefenseCandidate(state, actorId, instanceId, view),
  );
}
