import type { FabContinuousInitialSubject, FabRulesSubjectRef } from "./ir.ts";

/**
 * Canonical continuous-subject identity key.
 *
 * Format (stable across process-runner, rules-evaluator, continuous reducers/reconciler):
 * - game → `"game"`
 * - player → `"player:${playerId}"`
 * - object → `"object:${instanceId}#${incarnation}"`
 */
/**
 * Latch uniqueness for appliesTo.next. Same physical instance is one slot
 * across announce + attack and across incarnation bumps from apply/zone
 * moves. Distinct weapon proxies of that instance stay distinct.
 */
export function sameContinuousLatchSubject(
  left: FabContinuousInitialSubject,
  right: FabContinuousInitialSubject,
): boolean {
  if (left.instanceId !== right.instanceId) return false;
  const leftAttack = "attack" in left ? left.attack : undefined;
  const rightAttack = "attack" in right ? right.attack : undefined;
  if (leftAttack && rightAttack) {
    if (leftAttack.kind !== rightAttack.kind) return false;
    return (
      leftAttack.kind === "card" ||
      (leftAttack.kind === "proxy" &&
        rightAttack.kind === "proxy" &&
        leftAttack.proxyId === rightAttack.proxyId)
    );
  }
  // An announce-card subject and its resulting attack are two views of one
  // action, so they intentionally share a latch across the zone move. Every
  // other comparison identifies an object and must retain incarnation: a card
  // replayed from hand is a new object and can consume another "next N" slot.
  if (leftAttack || rightAttack) return true;
  return left.incarnation === right.incarnation;
}

export function continuousSubjectKey(subject: FabRulesSubjectRef): string {
  switch (subject.kind) {
    case "game":
      return "game";
    case "player":
      return `player:${subject.playerId}`;
    case "object":
      return `object:${subject.ref.instanceId}#${subject.ref.incarnation}`;
    default: {
      const _exhaustive: never = subject;
      throw new Error(`Unhandled continuous subject kind: ${JSON.stringify(_exhaustive)}`);
    }
  }
}
