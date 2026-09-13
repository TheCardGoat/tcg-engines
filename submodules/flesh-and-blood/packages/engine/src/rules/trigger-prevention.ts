/**
 * Continuous trigger-suppression (CR 6.6.5f).
 *
 * Printed patterns (Tripwire Trap "effects don't trigger when an attack hits
 * this chain link unless the attacking hero pays {r}") compile to continuous
 * rule-modification atoms with `mode: "restrict"` and `action: "trigger"`. At
 * the trigger-collection boundary a matching source's triggered-layer must NOT
 * be created — but the triggering still counts toward the effect's limit (CR
 * 6.6.5f), which the matcher guarantees by consulting `isTriggerPrevented`
 * AFTER incrementing the limit counter (trigger-matcher.ts:88 / :163).
 *
 * Mirrors `damageIsUnpreventable` (CR 6.4.10h) for shape and view API.
 */
import { buildFabRulesView } from "./state-rules-view.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import type { FabTriggerSource } from "./trigger-matcher.ts";
import type { CommittedEvent } from "./events.ts";
import { fabTriggerEventPatterns } from "./trigger-patterns.ts";

/**
 * Read-only view of the combat-chain-link fields this module reads. Distinct
 * from {@link FabChainLink} (whose collections are mutable) so the persisted
 * state's readonly chain link is assignable without a cast.
 */
type FabChainLinkDamageView = {
  readonly attackingPlayerId: string;
  readonly defendingPlayerId: string;
  readonly damage: {
    readonly outcomes: readonly { readonly damageDealtByActiveAttack: number }[];
  };
};

/**
 * Maps a `hasStatus` filter carried by a trigger-restriction to the triggering
 * event name that status tracks. Tripwire gates hit-triggers via the
 * `attack-hit-this-chain-link` status. (Long-term this mapping should be
 * explicit on the catalog restriction; this table is the engine's faithful
 * reading of today's authoring.)
 */
const STATUS_TRIGGER_EVENT: Readonly<Record<string, string>> = {
  "attack-hit-this-chain-link": "hit",
  "attack-hit": "hit",
  "attack-hits-you": "hit",
};

/** True when a continuous restrict rule suppresses this trigger source. */
export function triggerIsPrevented(
  state: FabRulesSnapshot,
  source: FabTriggerSource,
  _event: CommittedEvent | null,
): boolean {
  const eventNames = fabTriggerEventPatterns(source.trigger).map((pattern) => pattern.name);
  if (eventNames.length === 0) return false;

  const link: FabChainLinkDamageView | null = state.combat?.activeLink ?? null;
  const view = buildFabRulesView(state);

  for (const rule of view.rules("trigger")) {
    if (rule.mode !== "restrict") continue;
    if (rule.parameters.kind !== "rule-modification") continue;

    const status = rule.filter?.hasStatus;
    if (status) {
      // Restriction is active only while the named status currently holds, and
      // it only suppresses the trigger kind that status tracks.
      if (!statusHolds(status, link, rule.controllerId)) continue;
      const gatedEvent = STATUS_TRIGGER_EVENT[status];
      if (!gatedEvent || !eventNames.some((name) => name === gatedEvent)) continue;
    }

    // Filter matching: a restriction's filter (minus its hasStatus gate, handled
    // above) scopes WHICH trigger sources it suppresses. Stamp Authority's
    // {typeBox:{Action,Attack}} restricts only attack-action triggers, so it
    // must not suppress a non-matching source (e.g. an Instant's trigger).
    // Without this check the rule over-suppressed every opponent trigger.
    if (rule.filter) {
      const { hasStatus: _gated, ...rest } = rule.filter;
      if (Object.keys(rest).length > 0) {
        const sourceObj = view.object(source.source.ref);
        if (
          !sourceObj ||
          !view.matchesFilter(sourceObj, rest, {
            controllerId: source.controllerId,
            source: source.source.ref,
            bindings: { objects: {}, numbers: {}, strings: {} },
          })
        )
          continue;
      }
    }

    // Scope (CR 6.6.5f). Three shapes:
    //  - Blanket trigger-restrictions (Stamp Authority: game-wide via the
    //    null-target accepted-mode fallback, so no latched object subjects)
    //    suppress EVERY matching trigger — including the controller's own —
    //    because their printed text is a global property of the arena.
    //  - opponents-effects (Gallow: "effects controlled by opponents don't
    //    trigger when their attacks hit") suppress only the opponent's triggers.
    //  - Subject-latched restrictions (Tripwire: bound to the defending hero's
    //    chain-link perspective) suppress only the OPPONENT's triggers (1v1:
    //    source.controllerId !== rule.controllerId).
    if (rule.parameters.sourceRestriction === "opponents-effects") {
      if (rule.controllerId === source.controllerId) continue;
    } else if (rule.scope.kind === "objects" && rule.controllerId === source.controllerId) {
      continue;
    }

    return true;
  }
  return false;
}

/**
 * Whether a `hasStatus` predicate on a trigger-restriction currently holds.
 * `attack-hit-this-chain-link` reads the live combat chain link: at hit-event
 * trigger collection the `resolve-combat-damage` event has already committed
 * (it precedes `hit` in the damage batch — see procedures/combat/combat-damage),
 * so the link's damage outcomes are final, and a positive amount means the
 * attack hit (mirrors `fabCombatDidHit`).
 */
function statusHolds(status: string, link: FabChainLinkDamageView | null, youId: string): boolean {
  const attackHit =
    link !== null && link.damage.outcomes.some((o) => o.damageDealtByActiveAttack > 0);
  if (status === "attack-hit-this-chain-link" || status === "attack-hit") {
    return attackHit;
  }
  if (status === "attack-hits-you") {
    return attackHit && link !== null && link.defendingPlayerId === youId;
  }
  return false;
}
