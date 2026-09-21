import type {
  FabAuthorableStatusMarker,
  FabCondition,
  FabLegacyDerivedStatusMarker,
  FabStatusMarker,
  FabSupertype,
} from "@tcg/flesh-and-blood-types";
import type { FabObjectRef } from "../../continuous/ir.ts";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { refKey } from "../helpers.ts";
import { FabRulesEvaluationError } from "../errors.ts";
import { evaluateObjectNumericComparison } from "./object-numeric-comparison.ts";
import { isArenaZone } from "../../zones.ts";
import { resolveTarget } from "../resolve-target.ts";

type CondStatusFn = (
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
) => boolean;

function subjectOf(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): MutableObject | undefined {
  const subjectRef = context.subject ?? context.source;
  return subjectRef ? objects.get(refKey(subjectRef)) : undefined;
}

function subjectHasMarkerKind(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
  kind: "frozen" | "tapped" | "face-down" | "wagered",
): boolean {
  return subjectOf(context, objects)?.input.markers.some((marker) => marker.kind === kind) === true;
}

function subjectHasStatusValue(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
  value: string,
): boolean {
  return (
    subjectOf(context, objects)?.input.markers.some(
      (marker) => marker.kind === "status" && marker.value === value,
    ) === true
  );
}

/** Seat whose per-player fact a per-hero condition reads. Under a for-each
 * iteration the semantic subject is the bound `iteration-subject` seat; the
 * layer controller is only the fallback for conditions evaluated outside a
 * for-each (where controller and subject coincide). */
function perHeroSeat(context: FabEvalContext): string {
  const iterationSubject = context.bindings?.strings?.["iteration-subject"];
  return typeof iterationSubject === "string" ? iterationSubject : context.controllerId;
}

const HYPER_DRIVER_CANONICAL_IDS = new Set([
  "kRRdnfWFfdCmmKTnjmzNk",
  "zPjKJbcG7q8qD8QdKjtnG",
  "chD7n8jHMM6brNhDGJtfG",
  "FwwCqJKcNDNMjJn9mTCgg",
]);

function normalizeName(value: string | null | undefined): string {
  return (value ?? "").toLocaleLowerCase().replace(/[^a-z0-9]+/g, "");
}

/** The last action card played this turn, excluding the source when it *is* that last play. */
function lastActionCardPlayedSupertypes(context: FabEvalContext): readonly string[] {
  const plays = context.facts?.playerActionCardPlaysThisTurn[context.controllerId] ?? [];
  const last = plays.at(-1);
  if (!last) return context.facts?.playerLastActionCardPlayedSupertypes[context.controllerId] ?? [];
  // During event-and-state trigger matching the source snapshot can be the
  // event's LKI rather than the active attack ref. Include every authoritative
  // source identity so the current attack is excluded from "last action"
  // lookups; otherwise a Lightning source sees itself and self-triggers.
  const currentObjectIds = new Set(
    [
      context.source?.instanceId,
      context.subject?.instanceId,
      context.facts?.combat?.attack.instanceId,
    ].filter((instanceId): instanceId is string => instanceId !== undefined),
  );
  if (currentObjectIds.has(last.instanceId)) {
    return plays.at(-2)?.supertypes ?? [];
  }
  return last.supertypes;
}

/** The active attack is targeting the defending player's hero, and that hero is marked. */
function isAttackingMarkedHero(context: FabEvalContext): boolean {
  const combat = context.facts?.combat;
  if (!combat || context.facts?.playerMarked[combat.defendingPlayerId] !== true) return false;
  const heroRef = context.facts.heroRefs[combat.defendingPlayerId];
  if (!combat.attackTarget) return true;
  const targetId = combat.attackTarget.instanceId;
  return targetId === combat.defendingPlayerId || targetId === heroRef?.instanceId;
}

/** for-each binds the current hero as iteration-subject; otherwise the controller. */
function lostLifeSubjectId(context: FabEvalContext): string {
  return context.bindings?.strings?.["iteration-subject"] ?? context.controllerId;
}

function objectPrintedPower(
  objects: ReadonlyMap<string, MutableObject>,
  ref: FabObjectRef,
): number | undefined {
  const object = objects.get(refKey(ref));
  const power = object?.properties.numeric.power ?? object?.input.base.numeric.power;
  return typeof power === "number" ? power : undefined;
}

function thisWayRefs(context: FabEvalContext, keys: readonly string[]): readonly FabObjectRef[] {
  const collected: FabObjectRef[] = [];
  for (const key of keys) {
    collected.push(...(context.bindings?.objects?.[key] ?? []));
  }
  return collected;
}

function _countThisWayPower6(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
  keys: readonly string[],
): number {
  let count = 0;
  const seen = new Set<string>();
  for (const ref of thisWayRefs(context, keys)) {
    const key = refKey(ref);
    if (seen.has(key)) continue;
    seen.add(key);
    const power = objectPrintedPower(objects, ref);
    if (typeof power === "number" && power >= 6) count += 1;
  }
  return count;
}

/** True when any this-way bound object currently carries `talent` (supertype).
 * The live property set is seeded from print and is authoritative thereafter;
 * falling back to print would resurrect a supertype removed by CR 2.11.5. */
function _thisWayHasTalent(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
  keys: readonly string[],
  talent: FabSupertype,
): boolean {
  for (const ref of thisWayRefs(context, keys)) {
    const object = objects.get(refKey(ref));
    const live = object?.properties?.supertypes;
    if (live?.includes(talent)) return true;
  }
  return false;
}

/** Hit layers stamp trigger-event-damage; deal-damage may also bind a number. */
function _damageDealtThisWay(context: FabEvalContext): number {
  const bound = context.bindings?.numbers?.["damage-dealt-this-way"];
  if (typeof bound === "number") return bound;
  return context.bindings?.numbers?.["trigger-event-damage"] ?? 0;
}

/** A card is defending from the moment it is put on the active chain link until
 * it leaves the combat chain (CR 7.0.5a). Catalog definitions use both the
 * generic `defending` marker and the self-referential `this-is-defending`
 * spelling for this same fact. */
function isSubjectDefending(context: FabEvalContext): boolean {
  const combat = context.facts?.combat;
  const subjectRef = context.subject ?? context.source;
  return Boolean(
    combat &&
    subjectRef &&
    combat.defending.some(
      (ref) => refKey(ref) === refKey(subjectRef) || ref.instanceId === subjectRef.instanceId,
    ),
  );
}

/** Attack-action cards keep the same instanceId across stack→chain; incarnation
 * can reset. Weapon attacks use a proxy whose instanceId still matches the
 * seated weapon. Compare instanceId when the exact ref-key misses. */
function isSubjectTheActiveAttack(context: FabEvalContext): boolean {
  const combat = context.facts?.combat;
  const subjectRef = context.subject ?? context.source;
  if (!combat || !subjectRef) return false;
  return (
    refKey(combat.attack) === refKey(subjectRef) ||
    combat.attack.instanceId === subjectRef.instanceId
  );
}

function pitchZoneHasColor(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
  color: string,
): boolean {
  for (const object of objects.values()) {
    if (object.input.zone.zone !== "pitch") continue;
    const seat = object.controllerId ?? object.input.zone.playerId ?? object.input.ownerId;
    if (seat !== context.controllerId) continue;
    if (object.properties.color === color || object.input.base.color === color) return true;
  }
  return false;
}

function defendedByActionCard(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const combat = context.facts?.combat;
  if (!combat || !isSubjectTheActiveAttack(context)) return false;
  return combat.defending.some((ref) => {
    const defender = objects.get(refKey(ref));
    if (!defender) return false;
    return (defender.properties.types as readonly string[]).includes("Action");
  });
}

function defendedByTypeBoxToken(token: string): CondStatusFn {
  return (context, objects) => {
    const combat = context.facts?.combat;
    if (!combat || !isSubjectTheActiveAttack(context)) return false;
    return combat.defending.some((ref) => {
      const defender = objects.get(refKey(ref));
      if (!defender) return false;
      const types = defender.properties.types as readonly string[];
      const supertypes = defender.properties.supertypes as readonly string[];
      return types.includes(token) || supertypes.includes(token);
    });
  };
}

function defendedByAttackActionCard(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const combat = context.facts?.combat;
  const subjectRef = context.subject ?? context.source;
  if (!combat || !subjectRef) return false;
  if (
    refKey(combat.attack) !== refKey(subjectRef) &&
    combat.attack.instanceId !== subjectRef.instanceId
  ) {
    return false;
  }
  return combat.defending.some((ref) => {
    const defender = objects.get(refKey(ref));
    if (!defender) return false;
    const types = defender.properties.types as readonly string[];
    const subtypes = defender.properties.subtypes as readonly string[];
    return types.includes("Action") && subtypes.includes("Attack");
  });
}

/**
 * CR 8.5.58 records a sharpen as the derived `sharpened-this-turn` marker on
 * the affected weapon. Card definitions use the authorable `sharpened`
 * condition for the same current-turn fact; both spellings must read the
 * authoritative marker on the evaluated subject.
 */
function subjectHasSharpenedThisTurn(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  // Sequence effects such as Display of Craftsmanship bind the weapon as
  // `it` before evaluating the following condition. Prefer that authoritative
  // binding over the layer source (the reaction card itself); self-conditions
  // such as Zenith Blade have no binding and use their source.
  const subjectRef = context.bindings?.objects?.it?.[0] ?? context.subject ?? context.source;
  const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
  if (
    subject?.input.markers.some(
      (marker) => marker.kind === "status" && marker.value === "sharpened-this-turn",
    )
  ) {
    return true;
  }

  // Attack-reaction play conditions author the public `sharpened` marker, but
  // their source is the reaction card rather than the weapon being attacked.
  // Resolve that printed reference through the open weapon attack without
  // weakening the self/bound-object path above.
  const attackRef = context.facts?.combat?.attack;
  const attack = attackRef ? objects.get(refKey(attackRef)) : undefined;
  return Boolean(
    attack?.properties.types.includes("Weapon") &&
    attack.input.markers.some(
      (marker) => marker.kind === "status" && marker.value === "sharpened-this-turn",
    ),
  );
}

// Helpers shared by more than one marker key (bodies preserved verbatim from
// the prior if-ladder). Single-marker bodies are inlined in the table below.

/** `face-down-in-arsenal` / `face-up-in-arsenal` / `face-down-in-your-arsenal`
 * share setup; `wantFaceUp` selects the negated branch. */
function faceInArsenal(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
  wantFaceUp: boolean,
): boolean {
  const subjectRef = context.subject ?? context.source;
  const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
  if (!subject || subject.input.zone.zone !== "arsenal") return false;
  const faceDown = subject.input.markers.some((marker) => marker.kind === "face-down");
  return wantFaceUp ? !faceDown : faceDown;
}

/** `defending-an-attack-with-2-or-less-p` / `defends-attack-with-2-or-less-power`. */
function defendingAttack2OrLessP(context: FabEvalContext): boolean {
  const subjectRef = context.subject ?? context.source;
  const closedAttackPowers = subjectRef
    ? context.facts?.lastClosedDefendedAttackPowersByInstanceId[subjectRef.instanceId]
    : undefined;
  if (closedAttackPowers) return closedAttackPowers.some((power) => power <= 2);
  const closingAttackId = context.bindings?.strings?.["closing-active-attack-id"];
  const closingAttackPower = context.bindings?.numbers?.["closing-attack-power"];
  const closingDefenders = context.bindings?.objects?.["closing-defenders"] ?? [];
  return Boolean(
    subjectRef &&
    closingAttackId &&
    closingAttackPower !== undefined &&
    closingAttackPower <= 2 &&
    closingDefenders.some((ref) => refKey(ref) === refKey(subjectRef)),
  );
}

/**
 * Table-driven has-status CONDITION evaluator. Authorable keys are a required
 * Record; leftover legacy derived reads may still have handlers via Partial.
 * A catalog marker with no table key still throws in evaluateHasStatus. The
 * parametric `defending-on-chain-link-N-or-higher` family is matched by regex
 * (not an exact key) and handled before the table lookup.
 */

const CONDITION_STATUS_HANDLERS: Partial<Record<FabStatusMarker, CondStatusFn>> = {
  fused: (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const source = context.source;
    const attack = context.facts?.combat?.attack;
    const ids = new Set<string>();
    if (subjectRef) ids.add(subjectRef.instanceId);
    if (source) ids.add(source.instanceId);
    if (attack && (!source || source.instanceId === attack.instanceId)) ids.add(attack.instanceId);
    if (ids.size === 0) return false;
    const exact = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    if (exact?.input.declarationFacts?.some((fact) => fact.kind === "fusion") === true) {
      return true;
    }
    // Stack→chain incarnation can miss the exact ref; the live instance
    // still carries the fusion declaration fact (CR 8.3.17). LKI snapshots
    // in the same map may predate the fuse stamp — any incarnation with the
    // fact is sufficient. The active attack is the first-class "it was fused"
    // subject for on-attack triggers.
    for (const object of objects.values()) {
      if (!ids.has(object.input.ref.instanceId)) continue;
      if (object.input.declarationFacts?.some((fact) => fact.kind === "fusion") === true) {
        return true;
      }
    }
    return false;
  },
  // Clash sequences attach their result to the resolving layer so a following
  // conditional can observe the outcome before the transaction has finished
  // committing. Used by cards such as Stonewall Impasse.
  "won-clash": (context) => context.bindings?.strings?.["clash-result"] === "won",
  "opponent-won-clash": (context) => context.bindings?.strings?.["clash-result"] === "lost",
  marked: (context) => context.facts?.playerMarked[context.controllerId] === true,
  // Stamp Authority (CRU028): "While [source] is in the arena, attack-action
  // effects don't trigger when they hit." The restriction self-gates on its own
  // arena presence. Subject falls back to the continuous source (self) when no
  // explicit subject is bound.
  attacking: isSubjectTheActiveAttack,
  "attacking-or-defending": (context, objects) => {
    if (isSubjectTheActiveAttack(context) || isSubjectDefending(context)) return true;
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    if (!subject) return false;
    // Leave-arena LKI: the event-subject snapshot is still on the chain.
    if (subject.input.zone.zone === "combatChain") return true;
    const last = subject.input.history.moves.at(-1);
    return last?.from?.zone === "combatChain";
  },
  "attacking-defending-or-on-the-stack": (context, objects) => {
    if (isSubjectTheActiveAttack(context) || isSubjectDefending(context)) return true;
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    return subject?.input.zone.zone === "stack";
  },
  "attacking-or-on-the-stack": (context, objects) => {
    if (isSubjectTheActiveAttack(context)) return true;
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    return subject?.input.zone.zone === "stack";
  },
  "attacks-a-light-hero": (context, objects) => {
    if (!isSubjectTheActiveAttack(context)) return false;
    const combat = context.facts?.combat;
    if (!combat || combat.heroTargetPlayerId === null) return false;
    const heroRef = context.facts?.heroRefs[combat.heroTargetPlayerId];
    const hero = heroRef ? objects.get(refKey(heroRef)) : undefined;
    return (
      (hero?.properties.supertypes as readonly string[] | undefined)?.includes("Light") === true
    );
  },
  defending: isSubjectDefending,
  "this-is-defending": isSubjectDefending,
  tapped: (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    return subject?.input.markers.some((marker) => marker.kind === "tapped") === true;
  },
  untapped: (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    return Boolean(subject && !subject.input.markers.some((marker) => marker.kind === "tapped"));
  },
  "in-the-arena": (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    return subject ? isArenaZone(subject.input.zone.zone) : false;
  },
  "a-hero-has-more-life-than-all-other-heroes": (context) => {
    const life = context.facts?.playerLife ?? {};
    const ownLife = life[context.controllerId];
    return (
      ownLife !== undefined &&
      Object.entries(life).every(
        ([playerId, value]) => playerId === context.controllerId || ownLife > value,
      )
    );
  },
  "defending-a-weapon-attack": (context, objects) => {
    // Continuous resolveSubjects evaluates atom.condition without a subject
    // (Blade Beckoner family "this gets +1{d} while defending a weapon attack").
    // Prefer subject when present; fall back to the continuous source (self).
    const combat = context.facts?.combat;
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    const attack = combat ? objects.get(refKey(combat.attack)) : undefined;
    return Boolean(
      combat &&
      subject &&
      combat.defending.some((ref) => refKey(ref) === refKey(subject.input.ref)) &&
      attack?.properties.types.includes("Weapon"),
    );
  },
  "defending-attack-action-card-with-cost-0": (context, objects) => {
    const combat = context.facts?.combat;
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    const attack = combat ? objects.get(refKey(combat.attack)) : undefined;
    if (!combat || !subject || !attack) return false;
    if (!combat.defending.some((ref) => refKey(ref) === refKey(subject.input.ref))) return false;
    const cost = attack.properties.numeric.cost ?? attack.baseNumeric.cost;
    return (
      attack.properties.types.includes("Action") &&
      attack.properties.subtypes.includes("Attack") &&
      cost === 0
    );
  },
  // Solforge Gauntlet family: combat-chain-close has already cleared the live
  // combat record, so "if this defended" reads the closing-link defender LKI.
  "defended-this-turn": (context) => {
    const subjectRef = context.subject ?? context.source;
    if (!subjectRef) return false;
    return (
      context.facts?.combat?.defending.some((ref) => refKey(ref) === refKey(subjectRef)) === true ||
      context.facts?.lastClosedDefendingInstanceIds.includes(subjectRef.instanceId) === true
    );
  },
  "defending-an-attack-with-2-or-less-p": defendingAttack2OrLessP,
  "defends-attack-with-2-or-less-power": defendingAttack2OrLessP,
  "attacking-a-hero": (context, objects) => {
    const combat = context.facts?.combat;
    if (!combat || !isSubjectTheActiveAttack(context)) return false;
    if (!combat.attackTarget) return true;
    const targetId = combat.attackTarget.instanceId;
    if (targetId === combat.defendingPlayerId) return true;
    const heroRef = context.facts?.heroRefs[combat.defendingPlayerId];
    if (heroRef && targetId === heroRef.instanceId) return true;
    const target = objects.get(refKey(combat.attackTarget));
    return target?.properties.types.includes("Hero") === true;
  },
  "attacking-a-marked-hero": (context) => isAttackingMarkedHero(context),
  "attacking-shadow-hero": (context, objects) => {
    const combat = context.facts?.combat;
    if (!combat || !isSubjectTheActiveAttack(context)) return false;
    if (combat.heroTargetPlayerId === null) return false;
    const heroRef = context.facts?.heroRefs[combat.heroTargetPlayerId];
    const hero = heroRef ? objects.get(refKey(heroRef)) : undefined;
    return hero?.properties.supertypes.includes("Shadow") === true;
  },
  "attacking-a-royal-hero": (context, objects) => {
    const combat = context.facts?.combat;
    if (!combat || !isSubjectTheActiveAttack(context)) return false;
    if (combat.heroTargetPlayerId === null) return false;
    const heroRef = context.facts?.heroRefs[combat.heroTargetPlayerId];
    const hero = heroRef ? objects.get(refKey(heroRef)) : undefined;
    if (!hero) return false;
    return (
      hero.properties.supertypes.includes("Royal") ||
      (hero.properties.types as readonly string[]).includes("Royal")
    );
  },
  "defended-by-fewer-than-2-non-equipment-cards": (context, objects) => {
    const combat = context.facts?.combat;
    const subjectRef = context.subject ?? context.source;
    if (!combat || !subjectRef || refKey(combat.attack) !== refKey(subjectRef)) return false;
    const nonEquipmentDefenders = combat.defending.filter((ref) => {
      const defender = objects.get(refKey(ref));
      return defender && !defender.properties.types.includes("Equipment");
    });
    return nonEquipmentDefenders.length < 2;
  },
  // Widowmaker (AZL015): "If Widowmaker is defended by fewer than 2 cards, it
  // has +3{p}" — every defending card counts (hand cards and equipment
  // alike), unlike the non-equipment variant above (CR: defending cards are
  // the cards declared as defenders for the current chain link).
  "defended-by-fewer-than-2-cards": (context) => {
    const combat = context.facts?.combat;
    const subjectRef = context.subject ?? context.source;
    if (!combat || !subjectRef || refKey(combat.attack) !== refKey(subjectRef)) return false;
    return combat.defending.length < 2;
  },
  // Stonewall Gauntlet family: "When this defends an attack with {p} greater
  // than its base" — Thump/Over the Top `object-numeric-comparison` current gt
  // base on this-attack. Grandfathered slug; catalog rewrites drop it.
  "defended-attack-power-greater-than-base": (context, objects) =>
    evaluateObjectNumericComparison(
      {
        type: "object-numeric-comparison",
        target: { selector: "this-attack" },
        property: "power",
        left: "current",
        op: "gt",
        right: "base",
      },
      context,
      objects,
    ),
  // "When this chain link resolves, if there is a card defending this"
  // (Feign Vengeance PEN036) — the evaluated source is the active attack and
  // at least one card is seated on the active link as a defender (CR 7.0.5a:
  // a card defends from the moment it joins the chain link).
  "card-defending-this": (context) => {
    const combat = context.facts?.combat;
    return Boolean(isSubjectTheActiveAttack(context) && combat && combat.defending.length > 0);
  },
  "defended-by-card-from-hand": (context) => {
    const combat = context.facts?.combat;
    const subjectRef = context.subject ?? context.source;
    // Prefer live combat facts while the chain is open.
    if (combat) {
      if (!subjectRef || combat.attack.instanceId !== subjectRef.instanceId) return false;
      return combat.defendedFromHand === true;
    }
    // At resolution, combat is often already closed. Recover from the
    // last-closed combat defending-origins LKI stored on the attack's
    // history / bindings when available.
    const bound = context.bindings?.strings?.["defended-from-hand"];
    if (bound === "true") return true;
    if (bound === "false") return false;
    // Fall back: if the source was an attack that was defended (any
    // defender still recorded on lastClosedCombat via bindings).
    return context.bindings?.strings?.["defending-hero"] !== undefined;
  },
  // Pick a Card, Any Card: the randomly revealed card is the name named earlier
  // in this resolution (CR 8.5.21). Binding is a string; "it" is the reveal.
  "named-card": (context, objects) => {
    const named =
      context.bindings?.strings?.["named-card"] ?? context.bindings?.strings?.namedCard ?? null;
    if (!named) return false;
    const want = normalizeName(named);
    const refs = [
      ...(context.bindings?.objects?.it ?? []),
      ...(context.bindings?.objects?.["revealed-this-way"] ?? []),
    ];
    return refs.some((ref) =>
      objects.get(refKey(ref))?.properties.names.some((name) => normalizeName(name) === want),
    );
  },
  // Blood Drop Brocade: "if you have dealt or been dealt {p} damage this turn".
  "dealt-or-been-dealt-physical-damage-this-turn": (context) => {
    const dealt = (context.facts?.playerDamageDealt[context.controllerId]?.turn.physical ?? 0) > 0;
    const taken = (context.facts?.playerDamageTaken[context.controllerId]?.physical ?? 0) > 0;
    return dealt || taken;
  },
  "a-weapon-you-control-has-hit-this-turn": (context) =>
    context.facts?.playerWeaponHit[context.controllerId] === true,
  // Dawnblade: "if this hasn't hit this turn" — subject/source instance on
  // the first-class hitOutcomes ledger (CR 7.5.5b).
  "this-has-not-hit-this-turn": (context) => {
    const id = (context.subject ?? context.source)?.instanceId;
    if (!id) return true;
    return context.facts?.sourceHitThisTurn[id] !== true;
  },
  // "Activate this only if an attack has fragmented this turn" (Starfield Veil).
  // Printed is global ("an attack"), not controller-relative.
  "attack-fragmented-this-turn": (context) =>
    Object.values(context.facts?.playerAttackFragmented ?? {}).some(Boolean),
  // Aphrodias: "Activate this only if an aura with a holo counter has entered
  // the arena under your control this turn."
  "aura-with-holo-counter-entered-this-turn": (context) =>
    context.facts?.playerHoloAuraEnteredThisTurn[context.controllerId] === true,
  // Empyrean Rapture: "If a card with Herald in its name has been put into your
  // hero's soul during your turn…" — stamped on soul zone entry while turn player.
  "card-with-herald-in-its-name-put-into-soul-this-turn": (context) =>
    context.facts?.playerHeraldPutIntoSoulThisTurn[context.controllerId] === true,
  // Ice Fusion wizard riders: deal-damage stamps these after the packet.
  "dealt-damage-to-hero": (context) =>
    context.bindings?.strings?.["dealt-damage-to-hero"] === "true",
  "targets-a-hero": (context) => context.bindings?.strings?.["targets-a-hero"] === "true",
  "targets-a-frozen-ally": (context) =>
    context.bindings?.strings?.["targets-a-frozen-ally"] === "true",
  // Hell Hammer (DTD105) a2 / And Again: "if you've attacked with this".
  // Prefer the exact weapon instance; fall back to any weapon attack count
  // when the subject is missing (legacy source-static with no subject).
  "attacked-with-this": (context) => {
    const instanceId = (context.subject ?? context.source)?.instanceId;
    const ids = context.facts?.playerWeaponAttackInstanceIdsThisTurn?.[context.controllerId] ?? [];
    if (instanceId) return ids.includes(instanceId);
    return (context.facts?.playerWeaponAttacks[context.controllerId] ?? 0) >= 1;
  },
  // Merciless Battleaxe (DYN068) a2 / Unsheathed (ROS248) family: "if the
  // attack's {p} is greater than twice its base" — object-level comparison
  // of the live power against 2× the printed base power.
  "power-greater-than-twice-base": (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    if (!subject) return false;
    const current = subject.properties.numeric.power;
    const base = subject.input.base.numeric.power;
    return typeof current === "number" && typeof base === "number" && current > base * 2;
  },
  // DYN123 Pay Day: "If you've completed a contract this turn" (CR 8.4.7 /
  // 8.5.39a — the contracted player completed the contract's actions while the
  // contract effect existed). The completion fact is stamped on the per-player
  // turn ledger by the complete-contract reducer and reset with the turn.
  // LEGACY (binding-threading gap): the yellow-charge gate needs the charge
  // bindings threaded into hit-rider contexts; kept until that lands.
  "yellow-charged-this-way": (context, objects) => {
    if (context.bindings?.strings?.["yellow-charged-this-way"] === "true") return true;
    if (context.bindings?.strings?.["yellow-charged-this-way"] === "false") return false;
    const refs = context.bindings?.objects?.["chargedCard"];
    const ref = refs?.[0];
    if (ref) {
      const charged = objects.get(refKey(ref));
      if (charged) return charged.properties.color === "yellow";
    }
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    const stamped = subject?.input.declarationFacts?.find((fact) => fact.kind === "charge");
    return stamped?.kind === "charge" && stamped.color === "yellow";
  },
  "completed-a-contract-this-turn": (context) =>
    context.facts?.playerCompletedAContractThisTurn[context.controllerId] === true,
  "last-attack-this-turn-hatchet-of-body": (context) => {
    const names = context.facts?.playerLastAttackNamesThisTurn[context.controllerId] ?? [];
    return names.some((name) => normalizeName(name) === normalizeName("Hatchet of Body"));
  },
  "last-attack-this-turn-hatchet-of-mind": (context) => {
    const names = context.facts?.playerLastAttackNamesThisTurn[context.controllerId] ?? [];
    return names.some((name) => normalizeName(name) === normalizeName("Hatchet of Mind"));
  },
  // Blood Scent: "Activate this only if you've attacked with a Crouching Tiger this turn".
  "attacked-with-a-crouching-tiger-this-turn": (context) =>
    context.facts?.playerAttackedWithCrouchingTigerThisTurn[context.controllerId] === true,
  // viserai-usurper IAR106 a2: "if you've created or activated a Gate to
  // i'Arathael this turn" — gates the end-phase traverse.
  "created-or-activated-gate-to-iarathael-this-turn": (context) =>
    context.facts?.playerCreatedOrActivatedGateToIArathaelThisTurn?.[context.controllerId] === true,
  // Volcanic Vice (PEN018) a1: "If you've created a Seismic Surge this
  // turn, this gets spellvoid 3."
  "created-a-seismic-surge-this-turn": (context) =>
    context.facts?.playerCreatedSeismicSurgeThisTurn?.[context.controllerId] === true,
  "created-or-stolen-gold-token-this-turn": (context) =>
    context.facts?.playerCreatedOrStolenGoldThisTurn[context.controllerId] === true,
  "created-or-stolen-gold-this-turn": (context) =>
    context.facts?.playerCreatedOrStolenGoldThisTurn[context.controllerId] === true,
  "didnt-hit": (context) => {
    // Printed "if this didn't hit" is about THIS object as the attack, not
    // whether the chain's attack missed while this card was only defending.
    const sourceId = context.source?.instanceId;
    const boundItId = context.bindings.objects.it?.[0]?.instanceId;
    // Prefer the live link while combat is still open (chain-link-resolve).
    // At combat-chain-close, use the retained result for this exact source
    // across every link rather than the controller's final link.
    if (context.facts?.combat) {
      const attackId = boundItId === context.facts.combat.attack.instanceId ? boundItId : sourceId;
      if (attackId && context.facts.combat.attack.instanceId !== attackId) return false;
      return context.facts.combat.didHit === false;
    }
    for (const attackId of [boundItId, sourceId]) {
      if (!attackId) continue;
      const didHit = context.facts?.lastClosedAttackDidHitByInstanceId[attackId];
      if (didHit !== undefined) return didHit === false;
    }
    if (sourceId) return false;
    return context.facts?.playerLastAttackDidHit[context.controllerId] === false;
  },
  // "Activate only while this is face-down" (Skycrest Keikoi family) — source
  // object carries the face-down marker. Prefer subject when present.
  "face-down": (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    return Boolean(subject?.input.markers.some((marker) => marker.kind === "face-down"));
  },
  // Mentor cards are legally seated face-down in Arsenal and later turn
  // face-up without leaving that zone. Their status must read the actual
  // source object rather than a generic face-up fixture, otherwise neither
  // the public reveal nor the resulting continuous/triggered abilities exist.
  "face-down-in-arsenal": (context, objects) => faceInArsenal(context, objects, false),
  "face-up-in-arsenal": (context, objects) => faceInArsenal(context, objects, true),
  "face-down-in-your-arsenal": (context, objects) => faceInArsenal(context, objects, false),
  // "While this is in your arsenal" (Stadium Security family) — plain seat
  // check on the evaluated source; sibling of the face-in-arsenal delegates.
  "in-your-arsenal": (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    return Boolean(subject && subject.input.zone.zone === "arsenal");
  },
  "equipped-face-down": (context, objects) => {
    const equipmentZones = new Set(["head", "chest", "arms", "legs", "weapon1", "weapon2"]);
    const subject = context.source ? objects.get(refKey(context.source)) : undefined;
    return Boolean(
      subject &&
      equipmentZones.has(subject.input.zone.zone) &&
      subject.input.markers.some((marker) => marker.kind === "face-down"),
    );
  },
  "not-your-turn": (context) =>
    context.facts?.activePlayerId != null && context.facts?.activePlayerId !== context.controllerId,
  // "Activate only during your action phase" (Crown of Reflection, …).
  "during-your-action-phase": (context) =>
    context.facts?.phase === "action" &&
    context.facts?.activePlayerId != null &&
    context.facts.activePlayerId === context.controllerId,
  // Red Alert family: "If an attack reaction has been played or activated
  // this chain link, this gets +1{d}."
  "attack-reaction-played-or-activated-this-chain-link": (context) =>
    context.facts?.combat?.attackReactionPlayedOrActivated === true,
  // Bonds of Attraction (Errata Bulletin #9): the same-color check is part of
  // the banish trigger. True only after this source has already banished
  // another card of this color (count of that color on the turn ledger ≥ 2).
  "banished-another-card-with-same-color": (context, objects) => {
    const sourceId = context.source?.instanceId;
    if (!sourceId) return false;
    const colors = context.facts?.sourceBanishedColorsThisTurn?.[sourceId] ?? [];
    const justBanished =
      context.bindings?.objects?.it?.[0] ??
      context.bindings?.objects?.banished?.[0] ??
      context.bindings?.objects?.["banished-this-way"]?.[0];
    const justColor = (
      justBanished ? objects.get(refKey(justBanished))?.properties.color : colors.at(-1)
    )?.toLowerCase();
    if (!justColor) return false;
    return colors.filter((color) => color === justColor).length >= 2;
  },
  // Rouse the Ancients: revealed attack actions total 13 or more {p}.
  "total-power-gte-13": (context, objects) => {
    const refs = [
      ...(context.bindings?.objects?.["revealed-this-way"] ?? []),
      ...(context.bindings?.objects?.it ?? []),
    ];
    const seen = new Set<string>();
    let total = 0;
    for (const ref of refs) {
      const key = refKey(ref);
      if (seen.has(key)) continue;
      seen.add(key);
      const power = objects.get(key)?.properties.numeric.power;
      if (typeof power === "number") total += power;
    }
    return total >= 13;
  },
  // CR 6.6.5b — Bloodrot Trap (ARA019), Spike Pit Trap (OUT104), Pendulum Trap
  // (OUT107): "…and the attacking hero has played or activated a reaction this
  // chain link". The state half of a combined event+state trigger; reads the
  // attacker-scoped boolean (set only when the acting player IS the link's
  // attacker — see transaction-kernel play/activate gating). In the attacker
  // context an attacker can only play ATTACK reactions during a link, so the
  // `-reaction` and `-attack-reaction` variants collapse to the same boolean;
  // both are declared in status-markers.ts and Hunted or Hunter (ARK017) uses
  // the `-attack-reaction` form.
  "attacking-hero-played-or-activated-this-chain-link-reaction": (context) =>
    context.facts?.combat?.attackReactionPlayedOrActivated === true,
  "attacking-hero-played-or-activated-this-chain-link-attack-reaction": (context) =>
    context.facts?.combat?.attackReactionPlayedOrActivated === true,
  "played-card-or-activated-ability-this-reaction-step": (context) =>
    context.facts?.combat?.playedCardOrActivatedAbilityThisReactionStep === true,
  // "If you are Royal" / Crown of Dominion / Imperial suite.
  // Royal is a talent supertype on the hero (printed types or continuous grant).
  "hero-is-royal": (context, objects) => {
    const heroRef = context.facts?.heroRefs?.[context.controllerId];
    if (!heroRef) return false;
    const hero = objects.get(refKey(heroRef));
    if (!hero) return false;
    return (
      hero.properties.supertypes.includes("Royal") ||
      (hero.properties.types as readonly string[]).includes("Royal")
    );
  },
  // Light Fingers: "if you are a Thief" reads the controller's hero
  // type-line at the time the defend trigger is created.
  "hero-is-thief": (context, objects) => {
    const heroRef = context.facts?.heroRefs?.[context.controllerId];
    if (!heroRef) return false;
    const hero = objects.get(refKey(heroRef));
    return hero?.properties.supertypes.includes("Thief") === true;
  },
  // "If an Earth/Ice/Lightning card is pitched this way" — stamped as string
  // bindings on the activate event / activated layer (activation payment).
  "pitched-attack-action-card-to-play-this": (context) =>
    context.bindings?.strings?.["pitched-attack-action-card-to-play-this"] === "true",
  "pitched-non-attack-action-card-to-play-this": (context) =>
    context.bindings?.strings?.["pitched-non-attack-action-card-to-play-this"] === "true",
  "fused-with-earth-card": (context) =>
    context.bindings?.strings?.["fused-with-earth-card"] === "true",
  "fused-with-ice-card": (context) => context.bindings?.strings?.["fused-with-ice-card"] === "true",
  "fused-with-lightning-card": (context) =>
    context.bindings?.strings?.["fused-with-lightning-card"] === "true",
  // DYN172 Annals of Sutcliffe: "If an attack action card and a 'non-attack'
  // action card were pitched this way" — "this way" is the pitch payment made
  // for THIS play/activation (CR 1.14.2d/1.14.3). Stamped as a string binding
  // on the activate event (payment.ts) / play event (finalize.ts) from the
  // pitched cards' printed type boxes, mirroring the pitched-this-way talent
  // bindings. Only true when BOTH an attack action and a non-attack action
  // were among the pitched cards.
  "pitched-attack-and-non-attack-action-to-play-this": (context) =>
    context.bindings?.strings?.["pitched-attack-and-non-attack-action-to-play-this"] === "true",
  // Graven / Blacktek family: "While this is in your graveyard, …"
  // Source (or subject) must currently sit in the controller's graveyard.
  "in-your-graveyard": (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    return subject?.input.zone.zone === "graveyard";
  },
  // Companion / Demi-Hero equipment check: "If this is equipped, …"
  // (SEA124 Sticky Fingers: unequip after attack). An object is equipped
  // when it sits in any equipment zone (head, chest, arms, legs,
  // weapon1, weapon2).
  equipped: (context, objects) => {
    const equipmentZones = new Set(["head", "chest", "arms", "legs", "weapon1", "weapon2"]);
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    return subject ? equipmentZones.has(subject.input.zone.zone) : false;
  },
  // Demi-Hero inventory gate: "Activate only while this is in your inventory"
  // (DTD164 Levia Redeemed / Blasmophet Levia Consumed). Checks that the
  // subject is both in the controller's inventory zone and owned by the
  // controller.
  "in-your-inventory": (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    return (
      subject?.input.zone.zone === "inventory" && subject?.input.ownerId === context.controllerId
    );
  },
  // Zenith Blade / Hala sharpen family: "If this has been sharpened this turn".
  // The sharpen reducer (counters-status.ts) stamps a `status` marker
  // `sharpened-this-turn` on the sharpened sword object. `sharpened` is the
  // authorable card condition; `sharpened-this-turn` remains the explicit
  // derived spelling used by existing engine-facing definitions. Both read
  // the subject so weapon self-conditions resolve.
  sharpened: subjectHasSharpenedThisTurn,
  "sharpened-this-turn": subjectHasSharpenedThisTurn,
  // AHA010 Silverdrop Downpour (Red): "If the weapon has been sharpened this
  // turn, this costs {r} less to play." The play-static cost-reduction path
  // (legality/play.ts playStaticResourceCostReduction) evaluates with
  // source = the reaction card itself and empty bindings, so "the weapon"
  // cannot come from subject/source — it is the source weapon of the active
  // attack. Attack reactions are played during the Reaction Step with the
  // combat chain open (CR 7.4.1/7.4.2), and weapon attacks resolve through an
  // attack-proxy whose sourceObjectId stays pointed at the seated weapon, so
  // facts.combat.attack IS the weapon object carrying the `sharpened-this-turn`
  // status marker stamped by the sharpen reducer (CR 8.5.58). No open combat
  // → no referent → false.
  "weapon-sharpened-this-turn": (context, objects) => {
    const attackRef = context.facts?.combat?.attack;
    const weapon = attackRef ? objects.get(refKey(attackRef)) : undefined;
    return Boolean(
      weapon?.input.markers.some(
        (marker) => marker.kind === "status" && marker.value === "sharpened-this-turn",
      ),
    );
  },
  // SUP259 Bait: "You can't play or activate cards you own" — restrict filter
  // matches cards whose owner is the same as the controller evaluating legality.
  "owned-by-controller": (context, objects) => {
    const subject = context.subject ? objects.get(refKey(context.subject)) : undefined;
    return subject?.input.ownerId === context.controllerId;
  },
  // SEA245 Goldkiss Rum: "Your hero can't untap this turn unless they're a Pirate."
  "hero-is-pirate": (context, objects) => {
    const heroRef = context.facts?.heroRefs?.[context.controllerId];
    if (!heroRef) return false;
    const hero = objects.get(refKey(heroRef));
    if (!hero) return false;
    return (
      (hero.properties.types as readonly string[]).includes("Pirate") ||
      hero.properties.supertypes.includes("Pirate")
    );
  },
  // Hungering Demigon (DTD173): "If an opposing hero has 1 or more cards in
  // their soul" — any soul-zone object controlled by an opponent.
  "opposing-hero-has-cards-in-soul": (context, objects) => {
    const opponents = new Set(
      Object.keys(context.facts?.heroRefs ?? {}).filter((p) => p !== context.controllerId),
    );
    for (const obj of objects.values()) {
      if (obj.input.zone.zone !== "soul") continue;
      const seat = obj.controllerId ?? obj.input.zone.playerId ?? obj.input.ownerId;
      if (seat !== null && opponents.has(seat)) return true;
    }
    return false;
  },
  "defending-hero-has-cards-in-soul": (context, objects) => {
    const defendingPlayerId =
      context.facts?.combat?.defendingPlayerId ??
      Object.keys(context.facts?.heroRefs ?? {}).find((p) => p !== context.controllerId);
    if (!defendingPlayerId) return false;
    for (const obj of objects.values()) {
      if (obj.input.zone.zone !== "soul") continue;
      const seat = obj.controllerId ?? obj.input.zone.playerId ?? obj.input.ownerId;
      if (seat === defendingPlayerId) return true;
    }
    return false;
  },
  // ── Additional triage: markers reached by tests after the worktree settled ─
  // Lionclaw Maul (OMN247) / Boltyn-style "current {p} > printed base" (subject).
  "power-greater-than-base": (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    const base = subject?.baseNumeric.power;
    const current = subject?.properties.numeric.power;
    return base !== undefined && current !== undefined && current > base;
  },
  // Enion Surge (OMN113) a2: "If this deals damage" — the resolving source dealt
  // realized damage this turn (per-source fact, keyed by source instanceId).
  "this-dealt-damage": (context) => {
    const id = context.source?.instanceId;
    if (!id) return false;
    return (context.facts?.sourceDamageDealtThisTurn?.[id] ?? 0) > 0;
  },
  // Proclaim Vengeance (HNT165): "If that hero is Arakni" — that hero is the
  // marked/targeted opposing hero (1v1: the sole opponent).
  "that-hero-is-arakni": (context, objects) => {
    const opponentId = Object.keys(context.facts?.heroRefs ?? {}).find(
      (p) => p !== context.controllerId,
    );
    if (!opponentId) return false;
    const heroRef = context.facts?.heroRefs[opponentId];
    const hero = heroRef ? objects.get(refKey(heroRef)) : undefined;
    const name = hero?.properties.names[0] ?? "";
    return name.toLocaleLowerCase("en-US").includes("arakni");
  },
  // Out Muscle (MON250): attack is defended by a card whose {p} ≥ the attack's.
  "defended-by-card-with-equal-or-greater-power": (context, objects) => {
    const combat = context.facts?.combat;
    const subjectRef = context.subject ?? context.source;
    if (!combat || !subjectRef || refKey(combat.attack) !== refKey(subjectRef)) return false;
    const attackPower = objects.get(refKey(combat.attack))?.properties.numeric.power;
    if (attackPower === undefined) return false;
    return combat.defending.some((ref) => {
      const dp = objects.get(refKey(ref))?.properties.numeric.power;
      return dp !== undefined && dp >= attackPower;
    });
  },
  // Relentless Pursuit (HNT229): "If you've attacked them this turn" — them = the
  // marked opposing hero. In 1v1 (product scope) every attack targets the sole
  // opponent hero, so this ≈ declared an attack this turn (weapon or action).
  "attacked-them-this-turn": (context) => {
    const c = context.controllerId;
    return (
      (context.facts?.playerWeaponAttacks[c] ?? 0) +
        (context.facts?.playerAttackActionPlayed[c] ?? 0) >
      0
    );
  },
  // Beaming Blade (DTD046): "If a yellow card has been put into your hero's
  // soul this turn". Derived from object state — a controller's soul-zone
  // yellow card whose move history shows it entered soul this turn (mirrors the
  // count `cards-played-this-turn` history filter; no dedicated fact needed).
  "yellow-card-put-into-soul-this-turn": (context, objects) => {
    const turn = context.facts?.turnNumber;
    if (turn === undefined) return false;
    for (const obj of objects.values()) {
      if (obj.controllerId !== context.controllerId && obj.input.ownerId !== context.controllerId) {
        continue;
      }
      if (obj.properties.color !== "yellow" && obj.input.base.color !== "yellow") continue;
      if (obj.input.history.moves.some((m) => m.turnNumber === turn && m.to.zone === "soul"))
        return true;
    }
    return false;
  },
  // for-each each-hero rebinds iteration-subject; "they have lost {h}" reads
  // that seat. Fall back to the ability controller outside a loop.
  "has-lost-life-this-turn": (context) =>
    context.facts?.playerLostLifeThisTurn[lostLifeSubjectId(context)] === true,
  "lost-life-this-turn": (context) =>
    context.facts?.playerLostLifeThisTurn[lostLifeSubjectId(context)] === true,
  "last-attack-on-combat-chain-hit": (context) =>
    context.facts?.playerLastAttackDidHit[context.controllerId] === true,
  "played-at-chain-link-4-or-higher": (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    const stamped = subject?.input.declarationFacts?.find(
      (fact) => fact.kind === "played-at-chain-link",
    );
    if (stamped && stamped.kind === "played-at-chain-link") return stamped.chainLinkNumber >= 4;
    return (context.facts?.combat?.chainLinkNumber ?? 0) >= 4;
  },
  "played-at-chain-link-3-or-higher": (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    const stamped = subject?.input.declarationFacts?.find(
      (fact) => fact.kind === "played-at-chain-link",
    );
    if (stamped && stamped.kind === "played-at-chain-link") return stamped.chainLinkNumber >= 3;
    return (context.facts?.combat?.chainLinkNumber ?? 0) >= 3;
  },
  "charged-to-play": (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    if (subject?.input.declarationFacts?.some((fact) => fact.kind === "charge") === true) {
      return true;
    }
    const id = subjectRef?.instanceId;
    if (!id) return false;
    for (const object of objects.values()) {
      if (object.input.ref.instanceId !== id) continue;
      if (object.input.declarationFacts?.some((fact) => fact.kind === "charge") === true) {
        return true;
      }
    }
    return false;
  },
  "yellow-card-in-pitch-zone": (context, objects) => pitchZoneHasColor(context, objects, "yellow"),
  "defended-by-action": defendedByActionCard,
  "defended-by-reviled": defendedByTypeBoxToken("Reviled"),
  "defended-by-revered": defendedByTypeBoxToken("Revered"),
  "defended-by-guardian": defendedByTypeBoxToken("Guardian"),
  "defended-by-brute": defendedByTypeBoxToken("Brute"),
  "defended-by-attack-action": defendedByAttackActionCard,
  "defended-by-attack-action-card": defendedByAttackActionCard,
  "played-or-activated-this-chain-link-attack-reaction": (context) =>
    context.facts?.combat?.attackReactionPlayedOrActivated === true ||
    (context.facts?.combat?.attackReactionCount ?? 0) > 0,
  "attacked-or-defended-with-attack-action-this-turn": (context) =>
    context.facts?.playerAttackedOrDefendedWithAttackActionThisTurn[context.controllerId] === true,
  "last-action-card-played-this-turn-was-lightning": (context) =>
    lastActionCardPlayedSupertypes(context).includes("Lightning"),

  // MST163 Territorial Domain: "if you've created a Crouching Tiger this turn".
  "created-a-crouching-tiger-this-turn": (context) =>
    context.facts?.playerCreatedCrouchingTigerThisTurn[context.controllerId] === true,
  // HNT016 Anaphylactic Shock: "has dealt damage to you this turn" — the
  // candidate hero/ally appears in the controller's per-source damage-taken
  // turn history (heroes attributed via CR 8.2.8e dealer-hero mapping).
  "dealt-damage-to-you-this-turn": (context) => {
    const subjectRef = context.subject ?? context.source;
    if (!subjectRef) return false;
    const map = context.facts?.playerDamageTakenBySource?.[context.controllerId];
    return (map?.[subjectRef.instanceId] ?? 0) > 0;
  },
  // PEN263 Wax and Wane: "If you choose both" — the play event binds
  // chose-both when the modal's declared modes cover every printed mode.
  "chose-both": (context) => context.bindings?.strings?.["chose-both"] === "true",
  // SUP077 Truth or Trickery: compare the attacker's yes/no guess with whether
  // the hidden bound card actually matches the defender's chosen color.
  "guessed-wrong": (context, objects) => {
    const guessedMatch = context.bindings?.strings?.["guessed-match"];
    // Decision-scan runs before the guess proposal binds the answer:
    // keep the then-branch discoverable (conservative) while unbound.
    if (!guessedMatch) return true;
    const chosenColor = context.bindings?.strings?.["chosen-color"];
    const binding = context.bindings?.strings?.["guessed-binding"] ?? "it";
    if (!chosenColor) return false;
    const refs = context.bindings?.objects?.[binding] ?? [];
    const ref = refs[0];
    if (!ref) return false;
    const card = objects.get(refKey(ref));
    if (!card) return false;
    const actualColor = card.properties.color ?? card.input.base.color;
    const actuallyMatches = actualColor?.toLowerCase() === chosenColor.toLowerCase();
    return (guessedMatch === "yes") !== actuallyMatches;
  },
  // Ominous family: "If an aura you control was destroyed this turn".
  "aura-you-control-was-destroyed-this-turn": (context) =>
    context.facts?.playerDestroyedAuraThisTurn[context.controllerId] === true,
  "first-action-of-your-turn": (context) =>
    (context.facts?.playerAttackActionPlayed[context.controllerId] ?? 0) +
      (context.facts?.playerNonAttackActionPlayed[context.controllerId] ?? 0) ===
    0,
  // "Starting with the hero to your left, each hero chooses war or peace. If
  // they choose war/peace …" (DTD230): under the for-each, "they" is the
  // iteration-subject, not the layer controller. Reading the controller made
  // every iteration evaluate the controller's answer — an opponent-played
  // Diplomacy silently dropped the first chooser's restriction (the
  // controller's status was not stamped yet at proposal time) and mixed
  // choices applied the controller's answer to the other hero.
  "chose-war": (context) => context.facts?.playerDiplomacyChoice[perHeroSeat(context)] === "war",
  "chose-peace": (context) =>
    context.facts?.playerDiplomacyChoice[perHeroSeat(context)] === "peace",
  "didnt-banish-this-way-card-with-6-or-more-p": (context, objects) => {
    if (context.bindings?.strings?.["didnt-banish-this-way-card-with-6-or-more-p"] === "true")
      return true;
    if (context.bindings?.strings?.["didnt-banish-this-way-card-with-6-or-more-p"] === "false")
      return false;
    const playerId = lostLifeSubjectId(context);
    const refs = thisWayRefs(context, ["banished-this-way", "them", "it"]);
    return !refs.some((ref) => {
      const object = objects.get(refKey(ref));
      if (!object) return false;
      const ownerId = object.input.ownerId;
      const power = objectPrintedPower(objects, ref);
      return ownerId === playerId && typeof power === "number" && power >= 6;
    });
  },
  "alternative-cost-paid": (context) =>
    context.bindings?.strings?.["alternative-cost-paid"] === "true",
  "revealed-power-greater-than-damage-dealt-this-turn": (context, objects) => {
    const revealedRefs =
      context.bindings?.objects?.["revealed-this-way"] ?? context.bindings?.objects?.it ?? [];
    let revealed = context.facts?.playerHighestPowerRevealedThisTurn[context.controllerId] ?? 0;
    for (const ref of revealedRefs) {
      const power = objects.get(refKey(ref))?.properties.numeric.power;
      if (typeof power === "number") revealed = Math.max(revealed, power);
    }
    const dealt = context.facts?.playerDamageDealt[context.controllerId]?.turn;
    const total = dealt ? dealt.arcane + dealt.physical + dealt.generic : 0;
    return revealed > total;
  },
  "attacking-with-weapon-this-chain-link": (context, objects) => {
    const combat = context.facts?.combat;
    if (!combat) return false;
    const attack = objects.get(refKey(combat.attack));
    return Boolean(attack && attack.properties.types.includes("Weapon"));
  },
  "face-up-in-any-zone": (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    if (!subject) return false;
    return !subject.input.markers.some((marker) => marker.kind === "face-down");
  },
  "rune-gated": (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    return (
      subject?.input.declarationFacts?.some((fact) => fact.kind === "rune-gate") === true ||
      (subject?.input.history.moves.some((move) => move.from?.zone === "banished") === true &&
        subject.properties.keywords.some((keyword) => keyword.name === "rune-gate"))
    );
  },
  "dealt-arcane-lt-bind-counters-on-self": (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    const bind =
      subject?.input.counters.find((counter) => counter.kind === "named" && counter.name === "bind")
        ?.count ?? 0;
    const arcane = context.facts?.playerDamageDealt[context.controllerId]?.turn.arcane ?? 0;
    return arcane < bind;
  },
  "card-with-cost-3-or-greater-card-in-pitch-zone": (context, objects) =>
    [...objects.values()].some((object) => {
      if (object.input.zone.zone !== "pitch") return false;
      if (object.input.zone.playerId !== context.controllerId) return false;
      const cost = object.properties.numeric.cost ?? object.baseNumeric.cost;
      return cost !== undefined && cost >= 3;
    }),
  // Zealous Belting: while a pitched card has {p} greater than this card's base.
  "pitch-has-card-with-power-greater-than-base": (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    const base = subject?.input.base.numeric.power ?? subject?.baseNumeric.power;
    if (base === undefined) return false;
    return [...objects.values()].some((object) => {
      if (object.input.zone.zone !== "pitch") return false;
      if (object.input.zone.playerId !== context.controllerId) return false;
      const power = object.properties.numeric.power ?? object.baseNumeric.power;
      return power !== undefined && power > base;
    });
  },
  "same-name-as-a-card-in-their-graveyard": (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    if (!subject) return false;
    const playerId = subject.input.ownerId ?? subject.controllerId;
    if (!playerId) return false;
    const names = new Set(subject.properties.names.map((name) => normalizeName(name)));
    return [...objects.values()].some((object) => {
      if (object.input.zone.zone !== "graveyard") return false;
      if (object.input.zone.playerId !== playerId) return false;
      return object.properties.names.some((name) => names.has(normalizeName(name)));
    });
  },
  "same-name-as-card-in-defending-heros-banished": (context, objects) => {
    const defendingPlayerId = context.facts?.combat?.defendingPlayerId;
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    if (!defendingPlayerId || !subject) return false;
    const names = new Set(subject.properties.names.map((name) => normalizeName(name)));
    return [...objects.values()].some((object) => {
      if (object.input.zone.zone !== "banished") return false;
      if (object.input.zone.playerId !== defendingPlayerId) return false;
      return object.properties.names.some((name) => names.has(normalizeName(name)));
    });
  },
  "transformed-evo-is-hero": (context, objects) => {
    const heroRef = context.facts?.heroRefs?.[context.controllerId];
    if (!heroRef) return false;
    const hero = objects.get(refKey(heroRef));
    if (!hero) return false;
    const types = hero.properties.types as readonly string[];
    return types.includes("Evo") || (hero.properties.subtypes ?? []).includes("Evo");
  },
  "played-from-arsenal": (context, objects) => playedFromZone(context, objects, "arsenal"),
  "played-from-hand": (context, objects) => playedFromZone(context, objects, "hand"),
  "played-from-banished-zone": (context, objects) => playedFromZone(context, objects, "banished"),
  "no-sword-hit-this-turn": (context) =>
    (context.facts?.playerSwordHitsThisTurn?.[context.controllerId] ?? 0) === 0,
  "lost-life-during-your-turn": (context) =>
    context.facts?.playerLostLifeThisTurn?.[context.controllerId] === true,
  "banished-earth-card-this-turn": (context) =>
    context.facts?.playerBanishedEarthCardThisTurn?.[context.controllerId] === true,
  "destroyed-a-lightning-flow-this-turn": (context) =>
    context.facts?.playerDestroyedLightningFlowThisTurn?.[context.controllerId] === true,
  "banished-from-hand-this-turn": (context, objects) => {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    if (!subject) return false;
    const turn = context.facts?.turnNumber;
    return subject.input.history.moves.some(
      (move) =>
        move.from?.zone === "hand" &&
        move.to.zone === "banished" &&
        (turn === undefined || move.turnNumber === turn),
    );
  },
  "scrapped-hyper-driver": (context, objects) => {
    const sourceRef = context.subject ?? context.source;
    const source = sourceRef ? objects.get(refKey(sourceRef)) : undefined;
    const fact = source?.input.declarationFacts?.find((entry) => entry.kind === "scrap");
    if (!fact || fact.kind !== "scrap") return false;
    if (fact.scrappedCanonicalId && HYPER_DRIVER_CANONICAL_IDS.has(fact.scrappedCanonicalId)) {
      return true;
    }
    return fact.scrappedNames.some((name) => normalizeName(name).includes("hyperdriver"));
  },
  "activate-additional-as-instant": (context, objects) =>
    subjectHasStatusValue(context, objects, "activate-additional-as-instant"),
  "activated-ability": (context, objects) =>
    subjectHasStatusValue(context, objects, "activated-ability"),
  another: (context, objects) => subjectHasStatusValue(context, objects, "another"),
  "arcane-damage-effect": (context, objects) =>
    subjectHasStatusValue(context, objects, "arcane-damage-effect"),
  "arcane-damage-effect-equal-to-x": (context, objects) =>
    subjectHasStatusValue(context, objects, "arcane-damage-effect-equal-to-x"),
  "arcane-from-controller-sources": (context, objects) =>
    subjectHasStatusValue(context, objects, "arcane-from-controller-sources"),
  "attack-action-card-you-control": (context, objects) =>
    subjectHasStatusValue(context, objects, "attack-action-card-you-control"),
  "attack-hit-this-chain-link": (context, objects) =>
    subjectHasStatusValue(context, objects, "attack-hit-this-chain-link"),
  "attack-hits-you": (context, objects) =>
    subjectHasStatusValue(context, objects, "attack-hits-you"),
  boosted: (context, objects) => subjectHasStatusValue(context, objects, "boosted"),
  "chosen-name": (context, objects) => subjectHasStatusValue(context, objects, "chosen-name"),
  "controlled-by-a-guardian-hero": (context, objects) =>
    subjectHasStatusValue(context, objects, "controlled-by-a-guardian-hero"),
  "controller-effect": (context, objects) =>
    subjectHasStatusValue(context, objects, "controller-effect"),
  "controller-of-it": (context, objects) =>
    subjectHasStatusValue(context, objects, "controller-of-it"),
  "deckbuilding-exception": (context, objects) =>
    subjectHasStatusValue(context, objects, "deckbuilding-exception"),
  "defense-greater-than-attack-power": (context, objects) =>
    subjectHasStatusValue(context, objects, "defense-greater-than-attack-power"),
  "different-name": (context, objects) => subjectHasStatusValue(context, objects, "different-name"),
  "discarded-to-pay-cost-of-brute-attack-action-card": (context, objects) =>
    subjectHasStatusValue(context, objects, "discarded-to-pay-cost-of-brute-attack-action-card"),
  "face-up": (context, objects) => !subjectHasMarkerKind(context, objects, "face-down"),
  fragmented: (context, objects) => subjectHasStatusValue(context, objects, "fragmented"),
  "from-action-card-effect": (context, objects) =>
    subjectHasStatusValue(context, objects, "from-action-card-effect"),
  "from-boosting": (context, objects) => subjectHasStatusValue(context, objects, "from-boosting"),
  "from-effects": (context, objects) => subjectHasStatusValue(context, objects, "from-effects"),
  frozen: (context, objects) => {
    const subject = subjectOf(context, objects);
    if (!subject) return false;
    return (
      subjectHasMarkerKind(context, objects, "frozen") ||
      context.facts?.frozenObjectRefs.some((ref) => refKey(ref) === refKey(subject.input.ref)) ===
        true
    );
  },
  "greater-life-than-controller": (context, objects) =>
    subjectHasStatusValue(context, objects, "greater-life-than-controller"),
  "hero-ability": (context, objects) => subjectHasStatusValue(context, objects, "hero-ability"),
  intimidated: (context, objects) => subjectHasStatusValue(context, objects, "intimidated"),
  lethal: (context, objects) => subjectHasStatusValue(context, objects, "lethal"),
  "more-life-than-you": (context, objects) =>
    subjectHasStatusValue(context, objects, "more-life-than-you"),
  "not-controlled-by-destroyer": (context, objects) =>
    subjectHasStatusValue(context, objects, "not-controlled-by-destroyer"),
  "not-on-active-chain-link": (context, objects) =>
    subjectHasStatusValue(context, objects, "not-on-active-chain-link"),
  "other-than-self": (context, objects) =>
    subjectHasStatusValue(context, objects, "other-than-self"),
  "other-than-source": (context, objects) =>
    subjectHasStatusValue(context, objects, "other-than-source"),
  "played-by-defending-hero": (context, objects) =>
    subjectHasStatusValue(context, objects, "played-by-defending-hero"),
  "power-greater-than-attack-defending": (context, objects) =>
    subjectHasStatusValue(context, objects, "power-greater-than-attack-defending"),
  "power-less-than-base": (context, objects) =>
    subjectHasStatusValue(context, objects, "power-less-than-base"),
  revealed: (context, objects) => subjectHasStatusValue(context, objects, "revealed"),
  "same-hero-twice": (context, objects) =>
    subjectHasStatusValue(context, objects, "same-hero-twice"),
  self: (context, objects) => subjectHasStatusValue(context, objects, "self"),
  target: (context, objects) => subjectHasStatusValue(context, objects, "target"),
  "targeting-you": (context, objects) => subjectHasStatusValue(context, objects, "targeting-you"),
  "targets-a-guardian-hero": (context, objects) =>
    subjectHasStatusValue(context, objects, "targets-a-guardian-hero"),
  "targets-arakni": (context, objects) => subjectHasStatusValue(context, objects, "targets-arakni"),
  "under-this": (context, objects) => {
    const source = context.source ? objects.get(refKey(context.source)) : undefined;
    const subject = subjectOf(context, objects);
    if (!source || !subject) return false;
    return source.input.underInstanceIds?.includes(subject.input.ref.instanceId) === true;
  },
  wagered: (context, objects) => subjectHasMarkerKind(context, objects, "wagered"),
  "attack-has-wagered": (context, objects) => subjectHasMarkerKind(context, objects, "wagered"),
  "you-or-ally-you-control": (context, objects) =>
    subjectHasStatusValue(context, objects, "you-or-ally-you-control"),
} satisfies Record<FabAuthorableStatusMarker, CondStatusFn> &
  Partial<Record<FabLegacyDerivedStatusMarker, CondStatusFn>>;

function playedFromZone(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
  zone: "arsenal" | "hand" | "banished",
): boolean {
  const subjectRef = context.subject ?? context.source;
  const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
  const stamped = subject?.input.declarationFacts?.find((fact) => fact.kind === "played-from");
  if (stamped && stamped.kind === "played-from") return stamped.zone === zone;
  const moves = subject?.input.history.moves ?? [];
  const current = subject?.input.zone.zone;
  return moves.length === 0 && current === zone;
}

/** The condition-status markers this evaluator handles (table keys; the
 * `defending-on-chain-link-N` regex family is handled separately in
 * evaluateHasStatus). Exposed so has-status-coverage.test.ts can snapshot the
 * unhandled-set debt ledger (markers declared in the catalog but not yet
 * wired here). */
export const CONDITION_HANDLED_STATUS_MARKERS: readonly string[] =
  Object.keys(CONDITION_STATUS_HANDLERS);

export function evaluateHasStatus(
  condition: FabCondition & { type: "has-status" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  if (condition.target) {
    const { target: _target, ...sourceCondition } = condition;
    return resolveTarget(condition.target, context, objects).some((object) =>
      evaluateHasStatus(sourceCondition, { ...context, subject: object.input.ref }, objects),
    );
  }
  // Blazen Yoroi family: "While this is defending on chain link N or higher".
  // Parser emits defending-on-chain-link-N-or-higher; N is the threshold. Parametric,
  // so it cannot be an exact table key — matched by regex before the table lookup.
  const chainLinkMatch = /^defending-on-chain-link-(\d+)-or-higher$/.exec(condition.status);
  if (chainLinkMatch) {
    const threshold = Number(chainLinkMatch[1]);
    const combat = context.facts?.combat;
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    return Boolean(
      combat &&
      subject &&
      (combat.chainLinkNumber ?? 0) >= threshold &&
      combat.defending.some((ref) => refKey(ref) === refKey(subject.input.ref)),
    );
  }
  // `condition.status` is `string` (the parser generates markers dynamically);
  // cast to FabStatusMarker for the typed lookup. The table is keyed/validated
  // against FabStatusMarker via `satisfies` (drift-checked); an unrecognized
  // marker returns undefined → the fail-loud throw below.
  const handler = CONDITION_STATUS_HANDLERS[condition.status as FabStatusMarker];
  if (handler) return handler(context, objects);
  // A declared-but-unhandled marker (catalog reads it, but no handler exists
  // yet). Fail loud: reaching here means that marker's mechanic is not yet
  // wired, which must surface as an error rather than silently disabling the
  // card (the has-status trapdoor). The closed catalog guard
  // (has-status-coverage.test.ts) guarantees `status` is a declared marker.
  throw new FabRulesEvaluationError(`unhandled has-status marker: ${condition.status}`);
}
