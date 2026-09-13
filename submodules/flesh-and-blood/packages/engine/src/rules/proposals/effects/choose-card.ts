import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { nextRandom } from "../../../random.ts";
import { snapshotObject } from "../../snapshots.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, objectTargets, unsupported } from "../shared.ts";

/**
 * CR "Choose a card" / "choose N cards" — bind chosen object(s) for later steps.
 * Does **not** move or destroy the card; follow-up sequence leaves act on
 * `{ selector: "binding", binding }`.
 *
 * - count 1 → bind a single snapshot under outputBinding
 * - count > 1 → bind `readonly FabObjectSnapshot[]` under outputBinding ("them")
 * - random:true → pick uniformly from the resolved pool (count 1 default)
 */
export function proposeChooseCard(
  ctx: ProposalContext,
  effect: FabEffect & { type: "choose-card" },
): FabEffectProposalResult {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;
  let objects = objectTargets(
    state,
    layer,
    effect.target,
    targetPath,
    effectTargets,
    effectPath,
    effect.random === true,
  );

  // Self on a resolving attack → choose a different hand card (leaf path).
  // Combat-chain "choose a card on the chain" may legally be this attack.
  const chainChoice =
    "zones" in effect.target &&
    Array.isArray(effect.target.zones) &&
    effect.target.zones.includes("combat-chain");
  if (
    !chainChoice &&
    objects &&
    objects.length === 1 &&
    objects[0]!.instanceId === layer.source.instanceId
  ) {
    const handIds = state.containers.zonesByPlayerId[layer.controllerId]?.hand ?? [];
    const handCardId = handIds.find((id) => id !== layer.source.instanceId);
    if (handCardId) {
      objects = [snapshotObject(state, handCardId, layer.controllerId, "hand")];
    }
  }

  if (!objects) return unsupported(effect, "choose-card target is unresolved");
  const emptyBinding = (bindingKey: string): FabEffectProposalResult => ({
    supported: true,
    events: [
      {
        ...baseEvent(layer, processId),
        name: "set-status",
        affected: [],
        bindings: { ...layer.bindings, [bindingKey]: [] },
        // Binding-only: reducer no-ops without `data.object`.
        data: { status: "chosen-card", object: layer.source },
      },
    ],
  });
  if (objects.length === 0) {
    return emptyBinding(effect.outputBinding ?? "chosen-card");
  }

  // CR 1.8.6: "choose a card" from a looked/revealed cohort is a player
  // parameter when more than `count` objects are legal. A recorded selection
  // intersects the bound set; pool.length <= count is determined (1.8.6c).
  const selected = effectTargets[effectPath.join(".")];
  const count =
    "count" in effect.target && typeof effect.target.count === "number" ? effect.target.count : 1;
  if (selected) {
    const selectedIds = new Set(
      selected.flatMap((entry) => (entry.kind === "object" ? [entry.ref.instanceId] : [])),
    );
    objects = objects.filter((object) => selectedIds.has(object.instanceId));
    if (objects.length === 0) {
      return emptyBinding(effect.outputBinding ?? "chosen-card");
    }
  } else if (objects.length < count && effect.random !== true) {
    return emptyBinding(effect.outputBinding ?? "chosen-card");
  } else if (objects.length > count && effect.random !== true) {
    return unsupported(effect, "choose-card requires a player choice among the bound cards");
  }

  const bindingKey = effect.outputBinding ?? "chosen-card";

  // Random pick one from a multi-card pool (Spoiled Skull: random among "them").
  if (effect.random === true && objects.length > 1) {
    let rngState = state.rngState;
    const roll = nextRandom(rngState);
    rngState = roll.state;
    const picked = objects[Math.floor(roll.value * objects.length)]!;
    const named = picked.current.names[0] ?? picked.base.names[0] ?? null;
    const priorNamed = layer.bindings["named-card"];
    return {
      supported: true,
      events: [
        {
          ...baseEvent(layer, processId),
          name: "set-status",
          affected: [picked],
          bindings: {
            ...layer.bindings,
            [bindingKey]: picked,
            chosenCardId: picked.instanceId,
            it: picked,
            ...(named && priorNamed === undefined ? { "named-card": named } : {}),
          },
          data: { object: picked, status: "chosen-card" },
        },
      ],
    };
  }

  if (objects.length === 1) {
    const object = objects[0]!;
    const named = object.current.names[0] ?? object.base.names[0] ?? null;
    const priorNamed = layer.bindings["named-card"];
    const activeAttack = state.combat?.activeLink?.activeAttack;
    const binding =
      effect.target.selector === "this-attack" && activeAttack
        ? {
            kind: "exact-attack" as const,
            attack:
              activeAttack.kind === "proxy"
                ? {
                    ...object.ref,
                    attack: { kind: "proxy" as const, proxyId: activeAttack.proxyId },
                  }
                : { ...object.ref, attack: { kind: "card" as const } },
            object,
          }
        : object;
    return {
      supported: true,
      events: [
        {
          ...baseEvent(layer, processId),
          name: "set-status",
          affected: [object],
          bindings: {
            ...layer.bindings,
            [bindingKey]: binding,
            chosenCardId: object.instanceId,
            ...(bindingKey !== "it" ? { it: object } : {}),
            ...(named && priorNamed === undefined ? { "named-card": named } : {}),
          },
          data: { object, status: "chosen-card" },
        },
      ],
    };
  }

  // Multi-card choose: bind the full set for later random / opponent pick.
  return {
    supported: true,
    events: [
      {
        ...baseEvent(layer, processId),
        name: "set-status",
        affected: objects,
        bindings: {
          ...layer.bindings,
          [bindingKey]: objects,
        },
        data: { object: objects[0]!, status: "chosen-card" },
      },
    ],
  };
}
