import type { FabCardFilter, FabStatusMarker } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../rules-view.ts";
import { FabRulesEvaluationError } from "./errors.ts";
import { compare } from "./compare.ts";
import {
  arenaObjectZone,
  normalizeText,
  refKey,
  toCatalogZone,
  type MutableObject,
} from "./helpers.ts";
import { evaluateHasStatus } from "./conditions/has-status.ts";
import { printableNameFromSlug } from "../printed-identity.ts";

type FilterStatusFn = (
  object: MutableObject,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
) => boolean;

/** attack-controller-destroyed-{vigor,might,agility}-token family
 * (Confront/Embrace/Overcome Adversity): the attack controller destroyed the
 * named token this turn. Subject is the attack object. */
function attackControllerDestroyedToken(
  object: MutableObject,
  context: FabEvalContext,
  tokenName: string,
): boolean {
  const controllerId = object.controllerId;
  if (controllerId === null) return false;
  const destroyed = context.facts?.playerDestroyedTokenNamesThisTurn[controllerId] ?? [];
  return destroyed.some((name) => name === tokenName || name.includes(tokenName));
}

/** Hero currently targeted by `object` when it is the active attack (1v1
 * prospective quote: the sole opposing seat). Returns undefined when the
 * declared attack target is an object (ally / spectra / permanent) — an
 * attack aimed at an ally is not an attack on the ally's controller's hero. */
function attackTargetHero(
  object: MutableObject,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): MutableObject | undefined {
  const combat = context.facts?.combat;
  if (combat && refKey(combat.attack) === refKey(object.input.ref)) {
    if (combat.heroTargetPlayerId === null) return undefined;
    const heroRef = context.facts?.heroRefs[combat.heroTargetPlayerId];
    return heroRef ? objects.get(refKey(heroRef)) : undefined;
  }
  if (!combat) {
    // Future-latch scans observe the play announce before the chain link
    // opens; the DECLARED attack target travels on the context. An attack
    // declared at an object (ally/spectra/permanent) has no hero target —
    // the 1v1 sole-opponent heuristic below must not fire for it.
    if (context.bindings?.strings?.["declared-attack-target"] === "object") return undefined;
    const controllerId = object.controllerId ?? object.input.ownerId;
    if (!controllerId || !context.facts?.heroRefs) return undefined;
    const seats = Object.keys(context.facts.heroRefs);
    const targetPlayerId = seats.find((id) => id !== controllerId) ?? null;
    if (!targetPlayerId) return undefined;
    const heroRef = context.facts.heroRefs[targetPlayerId];
    return heroRef ? objects.get(refKey(heroRef)) : undefined;
  }
  return undefined;
}

/** defended-by-attack-action[-card]: the attack is currently defended by at
 * least one Attack Action card. */
function defendedByAttackActionCard(
  object: MutableObject,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const combat = context.facts?.combat;
  if (!combat || refKey(combat.attack) !== refKey(object.input.ref)) return false;
  return combat.defending.some((ref) => {
    const defender = objects.get(refKey(ref));
    if (!defender) return false;
    const types = defender.properties.types as readonly string[];
    const subtypes = defender.properties.subtypes as readonly string[];
    return types.includes("Action") && subtypes.includes("Attack");
  });
}

/**
 * Table-driven filter-form has-status evaluator — the filter-side analogue of
 * CONDITION_STATUS_HANDLERS. Each entry decides whether a candidate `object`
 * matches the marker (true = match/continue, false = reject); keys are
 * compile-checked against `FabStatusMarker`. Markers absent here fall through
 * to a fail-closed status-marker check in matchesFilter (NOT a throw — throwing
 * during defend/trigger matching aborts combat resolution and makes cards with
 * unmodeled filter statuses unplayable). The two tables answer different
 * questions (filter = per-candidate, condition = per-source) so they remain
 * separate, keyed by the same union.
 */
const FILTER_STATUS_HANDLERS: Partial<Record<FabStatusMarker, FilterStatusFn>> = {
  // "action card effects you control" (Flicker Wisp): the matched object's
  // controller must be the evaluating ability's controller — a scope check,
  // not an object state, so it delegates to context.controllerId.
  "controller-effect": (object, context) => {
    const controllerId = object.controllerId ?? object.input.ownerId;
    return (
      controllerId !== null && controllerId !== undefined && controllerId === context.controllerId
    );
  },
  // And Again: "target sword … you've attacked with this turn" — THIS object
  // is in the weapon-attack instance ledger (combat.ts stamps on attack).
  "attacked-with-this": (object, context) => {
    const controllerId = object.controllerId ?? object.input.ownerId;
    const ids = context.facts?.playerWeaponAttackInstanceIdsThisTurn?.[controllerId] ?? [];
    return ids.includes(object.input.ref.instanceId);
  },
  attacking: (object, context) => {
    const attack = context.facts?.combat?.attack;
    if (!attack) return false;
    return (
      refKey(attack) === refKey(object.input.ref) ||
      attack.instanceId === object.input.ref.instanceId
    );
  },
  fused: (object) => object.input.declarationFacts?.some((fact) => fact.kind === "fusion") === true,
  "charged-to-play": (object) =>
    object.input.declarationFacts?.some((fact) => fact.kind === "charge") === true,
  "not-on-active-chain-link": (object, context) => {
    // CR 7.0.3: a link includes its attack source and defenders. A weapon
    // attacks through a proxy while its physical card stays in the arena;
    // zone membership alone therefore permits the active dagger incorrectly.
    const combat = context.facts?.combat;
    if (!combat) return true;
    const candidate = refKey(object.input.ref);
    return (
      refKey(combat.attack) !== candidate &&
      !combat.defending.some((defender) => refKey(defender) === candidate)
    );
  },
  "controlled-by-a-guardian-hero": (object, context, objects) => {
    const controllerId = object.controllerId;
    if (!controllerId) return false;
    const heroRef = context.facts?.heroRefs[controllerId];
    const hero = heroRef ? objects.get(refKey(heroRef)) : undefined;
    return (
      (hero?.properties.supertypes as readonly string[] | undefined)?.includes("Guardian") === true
    );
  },
  "attacking-a-marked-hero": (object, context) => {
    const combat = context.facts?.combat;
    if (!combat || refKey(combat.attack) !== refKey(object.input.ref)) return false;
    if (context.facts?.playerMarked[combat.defendingPlayerId] !== true) return false;
    if (!combat.attackTarget) return true;
    const heroRef = context.facts.heroRefs[combat.defendingPlayerId];
    const targetId = combat.attackTarget.instanceId;
    return targetId === combat.defendingPlayerId || targetId === heroRef?.instanceId;
  },
  // Group condition used as a card filter (Rouse). Individual cards must not
  // be rejected; the reveal payment checks the revealed set's total power.
  "total-power-gte-13": () => true,
  // Snap Shot (ELE041-043) fused grant tag (CR 8.1.1d as-though-instant,
  // CR 5.2.3a additional activation — Snap Shot is the CR's own example): the
  // marker tags an allow/activate rule-modification; as a filter on
  // candidates it must not reject the weapons the rule covers.
  "activate-additional-as-instant": () => true,
  // Talisman of Cremation: banish graveyard cards whose full name was named.
  "chosen-name": (object, context) => {
    const named =
      context.bindings?.strings?.["named-card"] ??
      context.bindings?.strings?.namedCard ??
      context.bindings?.strings?.["chosen-option"] ??
      null;
    if (!named) return false;
    const want = named.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "");
    return object.properties.names.some(
      (name) => name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "") === want,
    );
  },
  "named-card": (object, context) => {
    const named =
      context.bindings?.strings?.["named-card"] ?? context.bindings?.strings?.namedCard ?? null;
    if (!named) return false;
    const want = named.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "");
    return object.properties.names.some(
      (name) => name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "") === want,
    );
  },
  "face-down": (object) => object.input.markers.some((marker) => marker.kind === "face-down"),
  "face-up": (object) => !object.input.markers.some((marker) => marker.kind === "face-down"),
  "controller-of-it": (object, context, objects) => {
    const bound = context.bindings?.objects?.it?.[0];
    if (!bound) return false;
    const boundObject = objects.get(refKey(bound));
    if (!boundObject) return false;
    const controller = boundObject.controllerId ?? boundObject.input.ownerId;
    const candidate = object.controllerId ?? object.input.ownerId;
    return controller === candidate;
  },
  // Splatter Skull: a face-down intimidate banish stamps this status marker.
  "banished-by-intimidate-this-turn": (object) =>
    object.input.markers.some(
      (marker) => marker.kind === "status" && marker.value === "banished-by-intimidate-this-turn",
    ),
  // Event-relative status (Evo transform). Object-level evaluation cannot
  // decide alone; treat as matching so trigger-matcher can gate on the
  // transform event's previous/into pair. Without this, evaluation throws
  // and aborts layer resolution.
  "different-name": () => true,
  tapped: (object) => object.input.markers.some((marker) => marker.kind === "tapped"),
  // CR 8.5.46a: the attack that wagered carries object marker {kind:"wagered"}.
  wagered: (object) => object.input.markers.some((marker) => marker.kind === "wagered"),
  "attack-has-wagered": (object) =>
    object.input.markers.some((marker) => marker.kind === "wagered"),
  frozen: (object, context) =>
    object.input.markers.some((marker) => marker.kind === "frozen") ||
    context.facts?.frozenObjectRefs.some((ref) => refKey(ref) === refKey(object.input.ref)) ===
      true,
  // "you may {t} a cog you control" — the tap target must not already be
  // tapped. Mirrors the activation-cost tap requirements filter (quote.ts),
  // which excludes tapped objects at quote time.
  untapped: (object) => !object.input.markers.some((marker) => marker.kind === "tapped"),
  "other-than-source": (object, context) =>
    !(context.source && refKey(context.source) === refKey(object.input.ref)),
  // "another target hero" / "another object": controlled by a different
  // player than the ability controller (Yoji, The Librarian, Heart of Ice
  // opponent tax, …). Hand/deck/arsenal objects often have null controller —
  // fall back to ownerId on the base object (zone seat).
  another: (object, context) => {
    const objectController = object.controllerId ?? object.input.ownerId;
    return (
      objectController !== null &&
      objectController !== undefined &&
      objectController !== context.controllerId
    );
  },
  "greater-life-than-controller": (object, context) => {
    if (object.controllerId === null) return false;
    const objectLife = context.facts?.playerLife[object.controllerId];
    const controllerLife = context.facts?.playerLife[context.controllerId];
    return objectLife !== undefined && controllerLife !== undefined && objectLife > controllerLife;
  },
  // Heroes "control" only arena/equipment/combat seats (baseController).
  // Deck/hand/arsenal/banished still need owner/zone-player for "each hero who
  // lost {h} this turn banishes …" filters (Widespread family).
  "lost-life-this-turn": (object, context) => {
    const playerId = object.controllerId ?? object.input.zone.playerId ?? object.input.ownerId;
    return (
      playerId !== null &&
      playerId !== undefined &&
      context.facts?.playerLostLifeThisTurn[playerId] === true
    );
  },
  // Used by trigger event filters (e.g. Briar ELE062/ELE063) on dealt-damage
  // events: the primary event object (the damage source) must be an Attack
  // Action card controlled by the ability's controller.
  "attack-action-card-you-control": (object, context) => {
    const types = object.properties.types as readonly string[];
    const subtypes = object.properties.subtypes as readonly string[];
    return (
      types.includes("Action") &&
      subtypes.includes("Attack") &&
      object.controllerId === context.controllerId
    );
  },
  // Boltyn AR / similar: current power strictly exceeds printed base power.
  "power-greater-than-base": (object) => {
    const base = object.baseNumeric.power;
    const current = object.properties.numeric.power;
    return base !== undefined && current !== undefined && current > base;
  },
  // EVR053 Helm of Sharp Eye: weapon attack with {p} greater than twice its
  // base (current > 2 * printed base).
  "power-greater-than-twice-base": (object) => {
    const base = object.baseNumeric.power;
    const current = object.properties.numeric.power;
    return base !== undefined && current !== undefined && current > base * 2;
  },
  // Face Adversity family: "may only defend if the attack's controller has
  // drawn a card this turn." Evaluated against the attack object.
  "attack-controller-drawn-a-card-this-turn": (object, context) =>
    object.controllerId !== null &&
    (context.facts?.playerCardsDrawn[object.controllerId] ?? 0) >= 1,
  "attack-controller-destroyed-vigor-token-this-turn": (object, context) =>
    attackControllerDestroyedToken(object, context, "vigor"),
  "attack-controller-destroyed-might-token-this-turn": (object, context) =>
    attackControllerDestroyedToken(object, context, "might"),
  "attack-controller-destroyed-agility-token-this-turn": (object, context) =>
    attackControllerDestroyedToken(object, context, "agility"),
  "defended-by-attack-action": defendedByAttackActionCard,
  "defended-by-attack-action-card": defendedByAttackActionCard,
  // Card has a printed effect that deals arcane damage (any amount).
  "arcane-damage-effect": (object) => objectHasArcaneDamageEffect(object),
  // Blaze Firemind: banish target whose arcane damage effect equals chosen X.
  "arcane-damage-effect-equal-to-x": (object, context) => {
    const x = context.bindings.numbers["x"];
    return x !== undefined && objectHasArcaneDamageEffectEqualTo(object, x);
  },
  // Zephyr Needle / similar: defender's {d} > the active attack's {p}.
  "defense-greater-than-attack-power": (object, context, objects) => {
    const combat = context.facts?.combat;
    if (!combat) return false;
    const attack = objects.get(refKey(combat.attack));
    const attackPower = attack?.properties.numeric.power;
    const defense = object.properties.numeric.defense;
    return attackPower !== undefined && defense !== undefined && defense > attackPower;
  },
  // Captain of the Guard: defending cards whose {p} is greater than the
  // attack they are defending.
  "power-greater-than-attack-defending": (object, context, objects) => {
    const combat = context.facts?.combat;
    if (!combat) return false;
    const attack = objects.get(refKey(combat.attack));
    const attackPower = attack?.properties.numeric.power;
    const power = object.properties.numeric.power;
    return attackPower !== undefined && power !== undefined && power > attackPower;
  },
  // Heart of Vengeance (HNT145): "next attack … that targets Arakni". Live
  // combat: defending seat when this object is the active attack. Prospective
  // quote (no combat yet): 1v1 sole opponent of the attack controller is the
  // only legal hero target — check that hero moniker.
  "targets-a-guardian-hero": (object, context, objects) => {
    const hero = attackTargetHero(object, context, objects);
    return (
      (hero?.properties.supertypes as readonly string[] | undefined)?.includes("Guardian") === true
    );
  },
  "attacks-a-light-hero": (object, context, objects) => {
    const hero = attackTargetHero(object, context, objects);
    return (
      (hero?.properties.supertypes as readonly string[] | undefined)?.includes("Light") === true
    );
  },
  // ARK007: "If it's attacking a Royal hero" on the latched contract attack.
  // Royal is a talent that often lives in types[] (Fang), same table as
  // hero-is-royal. Prospective latch must see the declared defending hero.
  "attacking-a-royal-hero": (object, context, objects) => {
    const hero = attackTargetHero(object, context, objects);
    if (!hero) return false;
    return (
      hero.properties.supertypes.includes("Royal") ||
      (hero.properties.types as readonly string[]).includes("Royal")
    );
  },
  "targets-arakni": (object, context, objects) => {
    const hero = attackTargetHero(object, context, objects);
    if (!hero) return false;
    const heroName = hero.properties.names[0] ?? nameFromObjectIdentity(hero) ?? "";
    return normalizeText(heroName).includes(normalizeText("Arakni"));
  },
  // This Round's On Me: "attacks that target you". Live combat: this object is
  // the active attack and the defending seat is the effect controller.
  "targeting-you": (object, context, objects) => {
    const combat = context.facts?.combat;
    if (combat && refKey(combat.attack) === refKey(object.input.ref)) {
      return combat.defendingPlayerId === context.controllerId;
    }
    const hero = attackTargetHero(object, context, objects);
    const you = context.facts?.heroRefs[context.controllerId];
    return Boolean(hero && you && refKey(hero.input.ref) === refKey(you));
  },
} satisfies Partial<Record<FabStatusMarker, FilterStatusFn>>;

/** The filter-status markers this evaluator handles (table keys; the rest fall
 * through to the fail-closed status-marker check). Exposed so the debt-ledger
 * test can union it with the condition handled-set. */
export const FILTER_HANDLED_STATUS_MARKERS: readonly string[] = Object.keys(FILTER_STATUS_HANDLERS);

export function matchesFilter(
  object: MutableObject,
  filter: FabCardFilter,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  if (filter.unsupported) return false;
  rejectUnsupportedFilterFields(filter);
  const p = object.properties;
  // Catalog modules keep display names in i18n; when base.name is null, derive
  // a printable name from token:/slug canonical ids so name filters still match
  // (Hyper Driver steam costs, Gold token filters, …).
  // Catalog `base.names` is often the slug (`minnowism-blue`); printed-name
  // filters (`name: "Minnowism"`) still need the i18n-shaped identity.
  const derivedName = nameFromObjectIdentity(object);
  const objectNames = [
    ...p.names,
    ...(derivedName && !p.names.includes(derivedName) ? [derivedName] : []),
  ];
  if (filter.name === "chosen") {
    const chosenRefs =
      context.bindings.objects.it ??
      context.bindings.objects.chosenCard ??
      context.bindings.objects["chosen-card"] ??
      [];
    if (chosenRefs.length !== 1) return false;
    const chosen = objects.get(refKey(chosenRefs[0]!));
    if (!chosen) return false;
    const chosenNames =
      chosen.properties.names.length > 0
        ? chosen.properties.names
        : [nameFromObjectIdentity(chosen)];
    if (
      !chosenNames.every((chosenName) =>
        objectNames.some((objectName) => normalizeText(objectName) === normalizeText(chosenName)),
      )
    ) {
      return false;
    }
  } else if (
    filter.name &&
    !objectNames.some((objectName) => namesMatch(objectName, filter.name!))
  ) {
    return false;
  }
  if (
    filter.nameContains &&
    !objectNames.some((objectName) =>
      normalizeText(objectName).includes(normalizeText(filter.nameContains!)),
    )
  )
    return false;
  if (filter.moniker) {
    const want = normalizeText(filter.moniker);
    const nameHit = objectNames.some((objectName) => normalizeText(objectName).includes(want));
    // Catalog `moniker: "Weapon" | "Dagger" | "1H"` is a type-box identity
    // (CR 1.4.3a inherited attack-source types), not a substring of the
    // printed name. Cintari Saber is a Weapon; its name is not "Weapon".
    const typeHit =
      p.types.some((value) => normalizeText(value) === want) ||
      p.subtypes.some((value) => normalizeText(value) === want) ||
      p.supertypes.some((value) => normalizeText(value) === want);
    if (!nameHit && !typeHit) return false;
  }
  if (filter.color && (!p.color || !filter.color.includes(p.color))) return false;
  if (filter.typeBox) {
    const exact = filter.typeBox;
    if (exact.metatypes && !exact.metatypes.every((value) => p.metatypes.includes(value)))
      return false;
    // Class-as-type prints (Guardian/Ninja/…) and Attack-as-type live in
    // types[] with null supertypeSets. A typeBox token must match any of
    // types / supertypes / subtypes so tutors such as Show Time! find them.
    const inTypeBox = (value: string): boolean =>
      (p.types as readonly string[]).includes(value) ||
      (p.supertypes as readonly string[]).includes(value) ||
      (p.subtypes as readonly string[]).includes(value);
    if (exact.supertypes && !exact.supertypes.every(inTypeBox)) return false;
    if (exact.types && !exact.types.every(inTypeBox)) return false;
    // "Reaction" in a subtypes filter is catalog shorthand (FAB_SUBTYPES) for
    // reaction cards, whose reaction-ness lives in TYPES ("Attack Reaction" /
    // "Defense Reaction" are card types; real card subtypes never carry the
    // bare token — see ARC119 W2-FIX2). The expansion matches BOTH reaction
    // types, so it is ONLY correct for printed text with an UNQUALIFIED
    // "reaction" (OMN232 "reaction cards", MST121-123 "a reaction or instant",
    // MPW037 "plays or activates a reaction"). Printed text naming a specific
    // reaction type ("Defense reactions can't be played…" — AZL015 Widowmaker
    // family, CRU135; "an attack reaction" — CIN006) must author
    // `types: ["Defense Reaction" | "Attack Reaction"]` directly (CRU083
    // convention), never this shorthand — the expansion would over-match the
    // other reaction type (CR 7.3.2a lets attack reactions be declared from
    // hand as defenders).
    const subtypesInclude = (value: string): boolean =>
      inTypeBox(value) ||
      (value === "Reaction" &&
        ((p.types as readonly string[]).includes("Attack Reaction") ||
          (p.types as readonly string[]).includes("Defense Reaction")));
    if (exact.subtypes && !exact.subtypes.every((value) => subtypesInclude(value))) return false;
    if (exact.traits && !exact.traits.every((value) => p.traits.includes(value))) return false;
    if (exact.excludeMetatypes?.some((value) => p.metatypes.includes(value))) return false;
    if (exact.excludeSupertypes?.some((value) => p.supertypes.includes(value))) return false;
    if (exact.excludeTypes?.some((value) => p.types.includes(value))) return false;
    if (exact.excludeSubtypes?.some((value) => subtypesInclude(value))) return false;
    if (exact.excludeTraits?.some((value) => p.traits.includes(value))) return false;
  }
  if (filter.sameNameAs) {
    const refs = context.bindings.objects[filter.sameNameAs.binding];
    const reference = refs?.length === 1 ? objects.get(refKey(refs[0]!)) : undefined;
    if (!reference || !p.names.some((name) => reference.properties.names.includes(name)))
      return false;
  }
  if (filter.sameTypeBoxAs) {
    const binding = context.bindings.objects[filter.sameTypeBoxAs.binding];
    if (!binding || binding.length !== 1) return false;
    const reference = objects.get(refKey(binding[0]!));
    if (!reference) return false;
    for (const category of filter.sameTypeBoxAs.categories) {
      const objectValues: readonly string[] = p[category];
      const referenceValues: readonly string[] = reference.properties[category];
      if (!objectValues.some((value) => referenceValues.includes(value))) {
        return false;
      }
    }
  }
  if (
    filter.pitch &&
    (p.numeric.pitch === undefined || !filter.pitch.includes(p.numeric.pitch as 1 | 2 | 3 | 4))
  )
    return false;
  if (filter.hasKeyword) {
    // CR label keywords (combo 8.4.1, crush 8.5): often emitted as ability
    // label.name rather than a top-level keyword entry — same surface as
    // baseHasKeyword for "card with crush/combo".
    const hasAsKeyword = p.keywords.some((keyword) => keyword.name === filter.hasKeyword);
    const labelKeywordNames = new Set([
      "combo",
      "crush",
      "reprise",
      "contract",
      "rupture",
      "surge",
      "channel",
      "material",
      "tower",
      "bond",
      "flow",
      "heavy",
      "go-fish",
      "high-tide",
      "quickstrike",
      "starfall",
      "galvanize",
      "evo-upgrade",
      "decompose",
      "solflare",
      "unity",
    ]);
    const hasAsLabel =
      labelKeywordNames.has(filter.hasKeyword) &&
      p.abilities.some((ability) => ability.label?.name === filter.hasKeyword);
    if (!hasAsKeyword && !hasAsLabel) return false;
  }
  if (filter.hasLabel && !p.abilities.some((ability) => ability.label?.name === filter.hasLabel))
    return false;
  if (filter.hasProperty && p.numeric[filter.hasProperty] === undefined) return false;
  if (filter.lacksProperty && p.numeric[filter.lacksProperty] !== undefined) return false;
  if (filter.hasCounter && !objectHasCounterToken(object.input.counters, filter.hasCounter))
    return false;
  if (filter.lacksCounter && objectHasCounterToken(object.input.counters, filter.lacksCounter))
    return false;
  if (filter.defending !== undefined) {
    // Live combat defenders, or LKI from the most recently closed link (Nuu
    // stealth banish resolves after combat-chain-close clears the chain).
    const liveDefending =
      context.facts?.combat?.defending.some(
        (ref) =>
          refKey(ref) === refKey(object.input.ref) ||
          ref.instanceId === object.input.ref.instanceId,
      ) ?? false;
    const closedDefending =
      context.facts?.lastClosedDefendingInstanceIds.includes(object.input.ref.instanceId) ?? false;
    const onCombatChain =
      (context.facts?.combatChainInstanceIds ?? []).includes(object.input.ref.instanceId) ||
      object.input.zone.zone === "combatChain";
    const chainNotAttack =
      onCombatChain && context.facts?.combat?.attack?.instanceId !== object.input.ref.instanceId;
    const defending = liveDefending || closedDefending || chainNotAttack;
    if (defending !== filter.defending) return false;
  }
  if (filter.wasBoosted && !object.input.declarationFacts?.some((fact) => fact.kind === "boost"))
    return false;
  if (filter.defendingAgainst) {
    const combat = context.facts?.combat;
    const isDefending =
      combat?.defending.some((ref) => refKey(ref) === refKey(object.input.ref)) ?? false;
    const attack = combat ? objects.get(refKey(combat.attack)) : undefined;
    if (
      !isDefending ||
      !attack ||
      !matchesFilter(attack, filter.defendingAgainst, context, objects)
    ) {
      return false;
    }
  }
  if (
    filter.playedFromZones &&
    !object.input.history.moves.some(
      (move) =>
        move.to.zone === "stack" &&
        move.from !== null &&
        filter.playedFromZones?.includes(toCatalogZone(move.from.zone)),
    )
  )
    return false;
  if (filter.inObjectBinding) {
    const boundObjects = context.bindings.objects[filter.inObjectBinding];
    if (!boundObjects?.some((ref) => refKey(ref) === refKey(object.input.ref))) return false;
  }
  if (filter.controllerPerformedThisTurn) {
    const playerId = object.controllerId ?? object.input.ownerId;
    if (
      !playerId ||
      context.facts?.playerPerformedThisTurn[playerId]?.[filter.controllerPerformedThisTurn] !==
        true
    ) {
      return false;
    }
  }
  if (filter.controllerControls) {
    const playerId = object.controllerId ?? object.input.ownerId;
    if (
      !playerId ||
      ![...objects.values()].some(
        (candidate) =>
          candidate.controllerId === playerId &&
          arenaObjectZone(candidate.input.zone.zone) &&
          matchesFilter(candidate, filter.controllerControls!, context, objects),
      )
    ) {
      return false;
    }
  }
  if (
    filter.banishedByIntimidateThisTurn &&
    !object.input.markers.some(
      (marker) => marker.kind === "status" && marker.value === "banished-by-intimidate-this-turn",
    )
  ) {
    return false;
  }
  if (filter.controllerDestroyedTokenThisTurn) {
    const playerId = object.controllerId ?? object.input.ownerId;
    const wanted = filter.controllerDestroyedTokenThisTurn.toLocaleLowerCase();
    const destroyed = context.facts?.playerDestroyedTokenNamesThisTurn[playerId ?? ""] ?? [];
    if (!destroyed.some((name) => name.toLocaleLowerCase().includes(wanted))) return false;
  }
  if (filter.dealtDamageToControllerThisTurn) {
    const map = context.facts?.playerDamageTakenBySource?.[context.controllerId];
    if ((map?.[object.input.ref.instanceId] ?? 0) <= 0) return false;
  }
  if (filter.firstOfTypeThisTurn) {
    const playerId = object.controllerId ?? object.input.ownerId ?? context.controllerId;
    const plays = context.facts?.playerActionCardPlaysThisTurn[playerId] ?? [];
    const isAttack = (object.properties.subtypes as readonly string[]).includes("Attack");
    const matching = plays.filter((play) =>
      isAttack ? play.subtypes?.includes("Attack") : !play.subtypes?.includes("Attack"),
    );
    if (matching.length > 1) return false;
  }
  if (filter.hasStatus) {
    // `filter.hasStatus` is `string` (the parser generates markers dynamically);
    // cast to FabStatusMarker for the typed lookup. The table is keyed/validated
    // against FabStatusMarker via `satisfies` (drift-checked); an unrecognized
    // marker returns undefined → the fail-closed marker fallback below.
    const handler = FILTER_STATUS_HANDLERS[filter.hasStatus as FabStatusMarker];
    if (handler) {
      if (!handler(object, context, objects)) return false;
    } else {
      // Prefer the condition table so appliesTo.next.hasStatus (charged-to-play,
      // fused, …) matches the resolution evaluator. Unhandled filter markers
      // still fail closed — throwing here aborts defend/trigger matching.
      try {
        if (
          !evaluateHasStatus(
            { type: "has-status", status: filter.hasStatus },
            { ...context, subject: object.input.ref },
            objects,
          )
        ) {
          return false;
        }
      } catch (error) {
        if (!(error instanceof FabRulesEvaluationError)) throw error;
        if (
          !object.input.markers.some(
            (marker) => marker.kind === "status" && marker.value === filter.hasStatus,
          )
        ) {
          return false;
        }
      }
    }
  }
  // Comparison amounts in a filter are "this card's {p}" / counts / literals
  // of the effect source, not the candidate (the candidate is `object`).
  const amountContext = { ...context, subject: undefined };
  for (const numeric of filter.numeric ?? []) {
    const value =
      numeric.basis === "base" ? object.baseNumeric[numeric.property] : p.numeric[numeric.property];
    if (value === undefined || !compare(value, numeric.comparison, amountContext, objects))
      return false;
  }
  for (const [property, comparison] of [
    ["cost", filter.cost],
    ["power", filter.power],
    ["defense", filter.defense],
  ] as const) {
    if (!comparison) continue;
    const value = p.numeric[property] ?? object.baseNumeric[property];
    if (value === undefined || !compare(value, comparison, amountContext, objects)) return false;
  }
  if (filter.and && !filter.and.every((child) => matchesFilter(object, child, context, objects)))
    return false;
  if (filter.or && !filter.or.some((child) => matchesFilter(object, child, context, objects)))
    return false;
  return true;
}

/**
 * Counter presence for filter.hasCounter / lacksCounter.
 * Supports named counters (`steam`, `aim`, …) and catalog numeric shorthand
 * (`+1{p}`, `-1{d}`, `+2{h}`) used by Smelting of the Old Ones, Cosmo Scroll,
 * Paragon Plate cost targets, etc.
 */
function objectHasCounterToken(
  counters: MutableObject["input"]["counters"],
  token: string,
): boolean {
  if (
    counters.some(
      (counter) => counter.kind === "named" && counter.name === token && counter.count > 0,
    )
  ) {
    return true;
  }
  const match = /^([+-]?\d+)\{([pdh])\}$/.exec(token);
  if (!match) return false;
  const value = Number(match[1]);
  const property = match[2] === "p" ? "power" : match[2] === "d" ? "defense" : "life";
  return counters.some(
    (counter) =>
      counter.kind === "numeric" &&
      counter.property === property &&
      counter.value === value &&
      counter.count > 0,
  );
}

/**
 * Derive a printable name when catalog base.name is null (names live in i18n).
 * `token:hyper-driver` / slug `hyper-driver-red` → "Hyper Driver" / "Hyper Driver Red".
 */
/** Printed-name identity: ignore punctuation/spacing so i18n commas match slug-derived names. */
function namesMatch(left: string, right: string): boolean {
  const compact = (value: string) => normalizeText(value).replace(/[^a-z0-9]+/g, "");
  return compact(left) === compact(right);
}

function nameFromObjectIdentity(object: MutableObject): string | null {
  for (const name of object.properties.names) {
    const fromSlug = printableNameFromSlug(name);
    if (fromSlug) return fromSlug;
  }
  const canonicalId = object.input.canonicalId;
  if (!canonicalId) return null;
  return printableNameFromSlug(canonicalId);
}

/** True when any ability effect tree deals arcane damage for a fixed amount. */
function objectHasArcaneDamageEffect(object: MutableObject): boolean {
  return printedArcaneDamageAmounts(object).length > 0;
}

function objectHasArcaneDamageEffectEqualTo(object: MutableObject, x: number): boolean {
  return printedArcaneDamageAmounts(object).includes(x);
}

/**
 * Collect fixed printed arcane damage amounts from ability ASTs.
 * Variable/X amounts are ignored — Blaze equal-to-X needs a concrete number.
 */
function printedArcaneDamageAmounts(object: MutableObject): number[] {
  const amounts: number[] = [];
  const visit = (node: unknown): void => {
    if (!node || typeof node !== "object") return;
    const effect = node as Record<string, unknown>;
    if (
      effect.type === "deal-damage" &&
      effect.damageType === "arcane" &&
      typeof effect.amount === "number"
    ) {
      amounts.push(effect.amount);
    }
    if (Array.isArray(effect.steps)) {
      for (const step of effect.steps) visit(step);
    }
    if (effect.effect && typeof effect.effect === "object") visit(effect.effect);
    if (effect.then && typeof effect.then === "object") visit(effect.then);
    if (effect.else && typeof effect.else === "object") visit(effect.else);
    if (Array.isArray(effect.modes)) {
      for (const mode of effect.modes) {
        if (mode && typeof mode === "object" && "effect" in mode) visit(mode.effect);
      }
    }
  };
  for (const ability of object.properties.abilities) {
    if (ability && typeof ability === "object" && "effect" in ability) {
      visit((ability as { effect?: unknown }).effect);
    }
  }
  return amounts;
}

function rejectUnsupportedFilterFields(filter: FabCardFilter): void {
  // differentNames is a multi-pick set constraint (chosen cards must have
  // distinct names). It does not filter individual objects — legalTargets
  // still lists every match; selection validation / test picks enforce
  // uniqueness. Do not throw here (Spoiled Skull / different-names tutors).
  const unsupported = [filter.pitchAsset && "pitchAsset"].find(Boolean);
  if (unsupported) throw new FabRulesEvaluationError(`filter field ${unsupported}`);
  if (filter.color?.some((color) => color === "chosen" || color.startsWith("same-as-")))
    throw new FabRulesEvaluationError("dynamic filter color");
}
