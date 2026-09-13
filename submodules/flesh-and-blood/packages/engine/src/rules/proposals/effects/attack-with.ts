import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { ProposedEvent } from "../../events.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { compileFabContinuousEffect } from "../../continuous/compiler.ts";
import {
  attackTargetController,
  baseEvent,
  fabZoneForSnapshot,
  objectTargets,
  playersForFabPlayer,
  unsupported,
} from "../shared.ts";

/**
 * CR 8.5.38 "attack with" / "attack an additional time with …":
 *
 * - Attack action card (e.g. Emperor tutor → attack with Command and Conquer):
 *   move the card onto the combat chain and open an attack against the
 *   defending hero. Product scope is 1v1: the sole opponent is the defender.
 */
export function proposeAttackWith(
  ctx: ProposalContext,
  effect: FabEffect & { type: "attack-with" },
): FabEffectProposalResult {
  const { state, layer, processId, effectPath, effectTargets, targetPath } = ctx;
  const objects = objectTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);
  if (!objects) return unsupported(effect, "attack-with target is unresolved");

  const events: ProposedEvent[] = [];

  for (const object of objects) {
    const typeBox = object.current.typeBox;
    // Catalog weapon zone is "weapon"; typeBox.types carries "Weapon".
    const isWeapon = typeBox.types.includes("Weapon") || object.zone === "weapon";
    const isAttackAction = typeBox.types.includes("Action") && typeBox.subtypes.includes("Attack");

    if (isAttackAction && !isWeapon) {
      // Self-target on the resolving attack (leaf "attack with this") is an
      // additional-attack grant, not a re-open of the same chain link.
      if (object.instanceId === layer.source.instanceId && object.zone === "combat-chain") {
        // Fall through to the ready/AP grant path below.
      } else {
        // Put the tutored/selected attack action onto the combat chain and open
        // combat against the defending hero (Emperor C&C, similar tutor-attacks).
        const opponents = playersForFabPlayer(state, layer.controllerId, "opponent");
        if (!opponents || opponents.length !== 1) {
          return unsupported(
            effect,
            "attack-with action card requires a single opposing hero target",
          );
        }
        const defendingPlayerId = opponents[0]!;
        const defendingPlayer = state.players[defendingPlayerId];
        if (!defendingPlayer) return unsupported(effect, "attack-with target is not seated");
        const attackTarget = { kind: "hero" as const, playerId: defendingPlayer.playerId };
        const from = fabZoneForSnapshot(object.zone);
        if (!from) return unsupported(effect, "attack-with source zone is unknown");

        if (from !== "combat-chain") {
          const moveToChain: ProposedEvent = {
            ...baseEvent(layer, processId),
            name: "move-zone",
            affected: [object],
            data: {
              object,
              destinationRef: null,
              from,
              to: "combat-chain",
              reason: "resolve",
            },
          };
          events.push(moveToChain);
        }
        const attack: ProposedEvent = {
          ...baseEvent(layer, processId),
          name: "attack",
          affected: [object],
          source: object,
          data: {
            actorId: layer.controllerId,
            object,
            target: attackTarget,
            defendingPlayerId: attackTargetController(attackTarget),
          },
        };
        events.push(attack);
        // CR 8.5.38 attacks the selected card, rather than merely moving it
        // to the combat chain. Resolution-time continuous restrictions on
        // that attack (for example Command and Conquer's defense-reaction
        // prohibition) therefore have to begin with the resulting link just
        // as they do when the card is played normally.
        for (const ability of object.current.abilities) {
          const resolutionEffect = ability.effect;
          if (
            ability.kind !== "resolution" ||
            !resolutionEffect ||
            resolutionEffect.type !== "rule-modification"
          ) {
            continue;
          }
          const effectId = `${processId}:${layer.layerId}:${object.instanceId}:${ability.id}`;
          const compiled = compileFabContinuousEffect({ effectId, effect: resolutionEffect });
          if (!compiled.ok) {
            return unsupported(effect, compiled.error.mechanic);
          }
          events.push({
            ...baseEvent(layer, processId),
            name: "continuous-effect-generated",
            affected: [object],
            bindings: layer.bindings,
            data: {
              effectId,
              controllerId: layer.controllerId,
              source: object,
              origin: { kind: "layer" },
              effectPath,
              simultaneousGroupId: null,
              atoms: compiled.atoms,
              duration: resolutionEffect.duration,
              // The attack event immediately before this creates the new
              // link. Proposals use the pre-event snapshot, so name that
              // imminent link explicitly rather than expiring at link zero.
              expiresAt: {
                kind: "combat-chain",
                combatNumber: (state.combat?.chainLinkNumber ?? 0) + 1,
              },
              // A rule-modification with no target governs candidate actions
              // globally for its duration (C&C restricts the defender's
              // cards), so it must not be latched only to the attacked card.
              initialSubjects: [],
              futureApplicability: null,
            },
          });
        }
        continue;
      }
    }
    const isLivingAlly =
      typeBox.subtypes.includes("Ally") && object.current.numeric.life !== undefined;
    if (isWeapon || isLivingAlly) {
      // CR 8.3.1b: activating an Attack ability opens combat at the Layer
      // step before this effect resolves. CR 7.6.3: go again lets the next
      // attack open a link from Resolution. Only a mid-link open is illegal.
      if (state.combat?.open && state.combat.step !== "layer" && state.combat.step !== "resolution")
        return unsupported(effect, "immediate attack-with cannot open during another combat");
      const opponents = playersForFabPlayer(state, layer.controllerId, "opponent");
      if (!opponents || opponents.length !== 1)
        return unsupported(effect, "immediate attack-with requires one opposing hero");
      const defendingPlayer = state.players[opponents[0]!];
      if (!defendingPlayer)
        return unsupported(effect, "immediate attack-with opposing hero is unavailable");
      const attackTarget = { kind: "hero" as const, playerId: defendingPlayer.playerId };
      events.push({
        ...baseEvent(layer, processId),
        name: "attack",
        source: object,
        affected: [object],
        data: {
          actorId: layer.controllerId,
          object,
          target: attackTarget,
          defendingPlayerId: attackTargetController(attackTarget),
        },
      });
      continue;
    }
    return unsupported(
      effect,
      "future attack activation permission requires modify-activation-limit",
    );
  }
  return { supported: true, events };
}
