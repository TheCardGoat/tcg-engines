/**
 * "Rookie" strategy — never takes aggressive actions. Only submits
 * passes and forced/setup responses.
 *
 * Built by overriding the aggressive families' policies to veto every
 * candidate; the rest fall through to the shared defaults (so the
 * `resolveEffect` decision tree stays consistent with every other
 * strategy).
 *
 * Useful as:
 *   - A baseline opponent a human player can reliably win against
 *     while learning the flow.
 *   - A known-good target for strategy A/B testing — if a new strategy
 *     can't beat pass-only, it's worse than doing nothing.
 *   - A deterministic foil in integration tests that need the match
 *     to progress but not end quickly via combat.
 */

import { composeStrategy, vetoFamily } from "./shared-policies.ts";

export const passOnlyStrategy = composeStrategy("pass-only", {
  // Aggressive / development families are vetoed: never deploy, never
  // attack, never block (we'd rather take the shield than swap a unit
  // for a shield), never play commands or activate abilities.
  declareBlock: vetoFamily(),
  enterBattle: vetoFamily(),
  activateAbility: vetoFamily(),
  playCommand: vetoFamily(),
  assignPilot: vetoFamily(),
  deployUnit: vetoFamily(),
  deployBase: vetoFamily(),
  // The planner owns concede as a fallback-of-last-resort; the strategy
  // never proposes it directly. Vetoing here keeps the strategy output
  // stable when the enumerator surfaces concede as a legal candidate.
  concede: vetoFamily(),
  // Setup / forced response and pass families inherit the shared
  // defaults — refusing those would deadlock the match.
});
