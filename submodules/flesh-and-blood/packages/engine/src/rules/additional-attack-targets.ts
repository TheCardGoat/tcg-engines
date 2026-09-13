/**
 * Multi-target attack architecture (CR 7.3.2f / Bolfar-style grants).
 *
 * Continuous rule-modification with action "attack-target" + target
 * "additional-hero" (and appliesTo.next filter) widens the next matching
 * attack so the controller may declare one extra opposing hero as a target.
 * Primary combat defense still applies to the primary target; each additional
 * hero is dealt the attack's full power as combat damage on resolution.
 */
import type { FabAttackTarget } from "../state.ts";
import type { FabObjectRef } from "./continuous/ir.ts";
import type { FabRulesView } from "./rules-view.ts";
import { continuousEffectInstanceIsActive } from "./continuous/runtime.ts";
import { buildFabRulesView } from "./state-rules-view.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";

/** True when a continuous attack-target / additional-hero grant applies to this attack. */
export function attackAllowsAdditionalHero(
  state: FabRulesSnapshot,
  actorId: string,
  attackInstanceId: string,
  view: FabRulesView = buildFabRulesView(state),
): boolean {
  const attackRecord = state.objects[attackInstanceId];
  if (!attackRecord) return false;
  const attackRef: FabObjectRef = {
    instanceId: attackRecord.instanceId,
    incarnation: attackRecord.incarnation,
  };
  const attack = view.object(attackRef);
  if (!attack) return false;

  // Latched subjects on active attack-target rules (post-announce).
  for (const rule of view.rules("attack-target")) {
    if (rule.mode !== "allow") continue;
    if (rule.parameters.kind !== "rule-modification") continue;
    if (rule.parameters.attackTargetMode !== "additional-hero") continue;
    if (
      rule.scope.kind === "objects" &&
      rule.scope.subjects.some((subject) => subject.instanceId === attackInstanceId)
    )
      return true;
  }

  // Prospective: unconsumed future-applicability grants that will latch on announce.
  for (const instance of state.continuousEffectInstances) {
    if (instance.controllerId !== actorId) continue;
    if (!continuousEffectInstanceIsActive(state, instance)) continue;
    const future = instance.futureApplicability;
    if (!future || future.remaining <= 0) continue;
    const atom = instance.atoms.find(
      (candidate) =>
        candidate.kind === "rule" &&
        candidate.action === "attack-target" &&
        candidate.mode === "allow" &&
        candidate.parameters.kind === "rule-modification" &&
        candidate.parameters.attackTargetMode === "additional-hero",
    );
    if (!atom || atom.kind !== "rule") continue;
    if (
      view.matchesFilter(attack, future.filter, {
        controllerId: instance.controllerId,
        source: instance.source.ref,
        bindings:
          instance.origin === "layer"
            ? instance.lockedBindings
            : { objects: {}, numbers: {}, strings: {} },
      })
    ) {
      return true;
    }
  }
  return false;
}

/** Resolve a hero-seat attack target from a player id string. */
export function resolveHeroAttackTarget(
  state: FabRulesSnapshot,
  playerId: string,
): FabAttackTarget | null {
  const player = state.players[playerId];
  if (!player) return null;
  return { kind: "hero", playerId: player.playerId };
}

/**
 * Validate and resolve an optional additional hero target for a play/activation.
 * Returns null when the grant is inactive or the id is not a distinct opposing hero.
 */
export function resolveAdditionalHeroAttackTarget(
  state: FabRulesSnapshot,
  actorId: string,
  attackInstanceId: string,
  primary: FabAttackTarget | null,
  additionalTargetId: string | null | undefined,
  view: FabRulesView = buildFabRulesView(state),
): FabAttackTarget | null {
  if (!additionalTargetId) return null;
  if (!attackAllowsAdditionalHero(state, actorId, attackInstanceId, view)) return null;
  if (additionalTargetId === actorId) return null;
  if (primary?.kind === "hero" && primary.playerId === additionalTargetId) return null;
  // Only hero seats for additional-hero mode (not allies/spectra).
  const additionalTarget = state.players[additionalTargetId];
  if (!additionalTarget) return null;
  if (!state.playerIds.some((playerId) => playerId === additionalTargetId)) return null;
  return { kind: "hero", playerId: additionalTarget.playerId };
}
