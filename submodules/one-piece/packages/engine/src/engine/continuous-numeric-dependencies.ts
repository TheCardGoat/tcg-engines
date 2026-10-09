import { getCard } from "../../../cards/src/runtime-catalog.ts";
import type { Condition, Target, TargetFilter } from "@tcg/op-types";
import type { MatchState, CardInstance } from "../types.ts";
import { matchesTargetFilter } from "../effects/targeting.ts";
import { evaluateConditions } from "../effects/conditions.ts";

type Property = "basePower" | "power" | "baseCost" | "cost" | "keyword" | "attribute" | "negation";
const properties: Property[] = [
  "basePower",
  "power",
  "baseCost",
  "cost",
  "keyword",
  "attribute",
  "negation",
];
const key = (id: string, property: Property) => `${id}/${property}`;
const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

// Only immutable predicates may narrow a possible target set. Dynamic leaves
// are unknown; AND/OR preserve that unknown rather than excluding candidates.
function staticFilter(
  state: MatchState,
  source: string,
  id: string,
  filter: TargetFilter,
): boolean | undefined {
  if (filter.filter === "allOf" || filter.filter === "anyOf") {
    const children: TargetFilter[] =
      "filters" in filter
        ? filter.filters
        : filter.groups.map((filters) => ({ filter: "allOf", filters }));
    const values = children.map((child) => staticFilter(state, source, id, child));
    if (filter.filter === "allOf")
      return values.includes(false) ? false : values.every((v) => v === true) ? true : undefined;
    return values.includes(true) ? true : values.every((v) => v === false) ? false : undefined;
  }
  switch (filter.filter) {
    case "name":
    case "excludeName":
    case "excludeSelf":
    case "trait":
    case "hasTrigger":
    case "hasEffectType":
    case "noBaseEffect":
    case "cardCategory":
    case "color":
    case "counter":
    case "state":
    case "faceUp":
    case "attachedDon":
    case "player": {
      const evaluated = matchesTargetFilter(state, source, id, filter);
      return evaluated.supported ? evaluated.matches : undefined;
    }
    default:
      return undefined;
  }
}

export function numericTargetScope(
  state: MatchState,
  source: CardInstance,
  target: Target,
): string[] {
  return Object.values(state.cards)
    .filter((card) => {
      if (target.self && card.instanceId !== source.instanceId) return false;
      if (target.player === "self" && card.controller !== source.controller) return false;
      if (target.player === "opponent" && card.controller === source.controller) return false;
      if (
        !target.zones.some(
          (zone) =>
            zone === card.zone ||
            (zone === "field" && ["leader", "character", "stage"].includes(card.zone)),
        )
      )
        return false;
      return !(target.filters ?? []).some(
        (filter) => staticFilter(state, source.instanceId, card.instanceId, filter) === false,
      );
    })
    .map((card) => card.instanceId);
}

const staticConditions = new Set([
  "donAttached",
  "turn",
  "oncePerTurn",
  "leaderName",
  "leaderAttribute",
  "leaderTrait",
  "leaderMulticolored",
  "leaderColor",
  "handCount",
  "lifeCount",
  "totalLifeCount",
  "restedCardCount",
  "lifeComparison",
  "compareHands",
  "donFieldCount",
  "donFieldComparison",
  "donGiven",
  "givenDonCount",
  "playedThisTurn",
  "faceUpLife",
  "activeDonCount",
  "playerTurnCount",
  "activatedEvent",
  "characterKodThisTurn",
  "cardTrashedFromHandByEffectThisTurn",
]);
function reads(
  state: MatchState,
  source: CardInstance,
  value: unknown,
  scope = Object.keys(state.cards),
): Set<string> {
  const result = new Set<string>();
  const add = (ids: string[], property: Property) =>
    ids.forEach((id) => result.add(key(id, property)));
  const visit = (item: unknown, ids: string[]) => {
    if (Array.isArray(item)) {
      item.forEach((child) => visit(child, ids));
      return;
    }
    if (!record(item)) return;
    let local = ids;
    if (item.self === true) local = [source.instanceId];
    // Recognize genuine typed targets through the caller; unknown structures
    // retain all candidates. Conditions with numeric filters can read other cards.
    if (item.condition === "cardState") local = [source.instanceId];
    const dimension = item.filter ?? item.property;
    const knownFilters = [
      "name",
      "excludeName",
      "excludeSelf",
      "trait",
      "hasTrigger",
      "hasEffectType",
      "noBaseEffect",
      "cardCategory",
      "color",
      "counter",
      "state",
      "faceUp",
      "attachedDon",
      "player",
      "power",
      "basePower",
      "cost",
      "baseCost",
      "dynamicCost",
      "hasKeyword",
      "attribute",
      "allOf",
      "anyOf",
    ];
    if (
      (typeof item.filter === "string" && !knownFilters.includes(item.filter)) ||
      (typeof item.property === "string" &&
        !["power", "cost", "state", "basePower", "baseCost"].includes(item.property))
    )
      properties.forEach((p) => add(Object.keys(state.cards), p));
    if (
      dimension === "power" ||
      dimension === "basePower" ||
      dimension === "cost" ||
      dimension === "baseCost"
    )
      add(local, dimension);
    if (dimension === "dynamicCost") add(local, "cost");
    if (dimension === "hasKeyword") add(local, "keyword");
    if (dimension === "attribute" || item.condition === "leaderAttribute") add(local, "attribute");
    if (
      typeof item.condition === "string" &&
      !staticConditions.has(item.condition) &&
      ![
        "cardState",
        "zoneCount",
        "zoneValueTotal",
        "combinedZoneCount",
        "zoneCountComparison",
        "hasCard",
        "notHasCard",
        "existsOnField",
        "compound",
      ].includes(item.condition)
    )
      properties.forEach((p) => add(Object.keys(state.cards), p));
    for (const child of Object.values(item)) visit(child, local);
  };
  visit(value, scope);
  return result;
}

// Native condition scopes are explicit. In particular, a named-card predicate
// must not acquire reads of every unrelated Character's numeric properties.
function conditionReads(
  state: MatchState,
  source: CardInstance,
  conditions: Condition[] = [],
): Set<string> {
  const result = new Set<string>();
  for (const condition of conditions) {
    let inputs: Set<string>;
    switch (condition.condition) {
      case "compound":
        inputs = conditionReads(state, source, condition.conditions);
        break;
      case "hasCard":
      case "notHasCard":
      case "existsOnField":
      case "zoneCount":
      case "zoneValueTotal": {
        const scope = numericTargetScope(state, source, {
          player: condition.player ?? "any",
          zones: [condition.zone],
          count: { amount: "all" },
          filters: condition.filters,
        });
        inputs = reads(state, source, condition, scope);
        break;
      }
      case "combinedZoneCount":
      case "zoneCountComparison":
        inputs = new Set();
        break;
      case "cardState":
        inputs = reads(state, source, condition, [source.instanceId]);
        break;
      case "leaderAttribute":
        inputs = reads(
          state,
          source,
          condition,
          numericTargetScope(state, source, {
            player: "self",
            zones: ["leader"],
            count: { amount: "all" },
          }),
        );
        break;
      default:
        inputs = reads(state, source, condition);
        break;
    }
    for (const input of inputs) result.add(input);
  }
  return result;
}

export function deterministicPowerTarget(target: Target): boolean {
  if (target.totalConstraint || target.count.upTo || target.count.amountFromMatchingCards)
    return false;
  return (
    target.self === true ||
    target.count.amount === "all" ||
    (target.count.amount === 1 &&
      target.zones.length === 1 &&
      target.zones[0] === "leader" &&
      (target.player === "self" || target.player === "opponent"))
  );
}

export function basePowerActionKey(source: CardInstance, effect: number, action: number): string {
  return `${source.instanceId}:${source.zoneChangeCounter}:${effect}/${action}`;
}

/** Proves isolation, not a new interpretation of self-referential setters. */
export function orderedPowerDependencies(state: MatchState) {
  const baseCostSetters: Array<{ inputs: Set<string>; writes: Set<string>; supported: boolean }> =
    [];
  const getterBridges: Array<{ inputs: Set<string>; writes: Set<string> }> = [];
  const ordered = new Set<string>();
  const seeds = new Set<string>();
  const edges = new Map<string, Set<string>>();
  const orderedNegation = new Set<string>();
  const legacyReads: Set<string>[] = [];
  const legacyWrites = new Set<string>();
  const connect = (from: string, to: string) => {
    const next = edges.get(from) ?? new Set<string>();
    next.add(to);
    edges.set(from, next);
  };
  for (const card of Object.values(state.cards)) {
    connect(key(card.instanceId, "basePower"), key(card.instanceId, "power"));
    connect(key(card.instanceId, "baseCost"), key(card.instanceId, "cost"));
  }
  for (const source of Object.values(state.cards)) {
    if (!["leader", "character", "stage", "hand"].includes(source.zone)) continue;
    (getCard(source.cardId).effects?.permanentEffects ?? []).forEach((effect, effectIndex) => {
      const blockReads = conditionReads(state, source, effect.conditions);
      // Numeric-independent false gates cannot become true inside settlement.
      const gate =
        blockReads.size === 0
          ? evaluateConditions(state, source.controller, source.instanceId, effect.conditions)
          : undefined;
      const disabled = gate?.supported && !gate.matches;
      effect.actions.forEach((action, actionIndex) => {
        if (source.zone === "hand" && (!("target" in action) || !action.target?.self)) return;
        const targets =
          "target" in action && action.target
            ? numericTargetScope(state, source, action.target)
            : Object.keys(state.cards);
        const inputs = new Set([
          ...blockReads,
          ...reads(state, source, "target" in action ? action.target : undefined, targets),
        ]);
        const actionConditions =
          "condition" in action && action.condition ? [action.condition] : [];
        const actionInputs = conditionReads(state, source, actionConditions);
        for (const input of actionInputs) inputs.add(input);
        const actionGate =
          actionInputs.size === 0
            ? evaluateConditions(state, source.controller, source.instanceId, actionConditions)
            : undefined;
        const inactive = disabled || (actionGate?.supported && !actionGate.matches);
        const eligibilityIsStatic = inputs.size === 0;
        inputs.add(key(source.instanceId, "negation"));
        const writes = new Set<string>();
        const write = (p: Property) => targets.forEach((id) => writes.add(key(id, p)));
        let eligible = false;
        switch (action.action) {
          case "setBasePower":
            write("basePower");
            eligible = eligibilityIsStatic && deterministicPowerTarget(action.target);
            break;
          case "setBasePowerFrom": {
            write("basePower");
            const copy = action.source;
            eligible =
              eligibilityIsStatic &&
              action.target.self === true &&
              deterministicPowerTarget(action.target) &&
              copy.player === "self" &&
              copy.zones.length === 1 &&
              copy.zones[0] === "leader" &&
              copy.count.amount === 1 &&
              !copy.filters?.length &&
              !copy.chosenBy &&
              !copy.totalConstraint &&
              !copy.self &&
              !copy.count.upTo &&
              !copy.count.amountFromMatchingCards &&
              reads(state, source, copy).size === 0;
            for (const id of numericTargetScope(state, source, copy))
              inputs.add(key(id, "basePower"));
            for (const input of reads(state, source, copy)) inputs.add(input);
            break;
          }
          case "modifyPower":
            write("power");
            break;
          case "modifyCost":
            if (!action.paymentOnly) write("cost");
            break;
          case "setCost":
            write("cost");
            break;
          case "setBaseCost":
            write("baseCost");
            break;
          case "grantKeyword":
            write("keyword");
            break;
          case "negateEffects":
            // Timing-scoped negation cannot disable a permanent numeric effect.
            if (!action.effectTypes?.length) write("negation");
            break;
          case "negatePlayerEffects":
            if (action.effectTypes?.length) break;
            for (const card of Object.values(state.cards))
              if (
                action.player === "self"
                  ? card.controller === source.controller
                  : card.controller !== source.controller
              )
                writes.add(key(card.instanceId, "negation"));
            break;
          case "grantAttribute":
            write("attribute");
            break;
          default:
            break;
        }
        // Scaling and other native action fields can introduce transitive reads.
        for (const [field, value] of Object.entries(action))
          if (!["target", "source", "condition"].includes(field))
            for (const input of reads(state, source, value)) inputs.add(input);
        if (eligible) {
          ordered.add(basePowerActionKey(source, effectIndex, actionIndex));
          if (!inactive) orderedNegation.add(key(source.instanceId, "negation"));
        }
        if (inactive) return;
        if (action.action === "setBaseCost")
          baseCostSetters.push({
            inputs,
            writes,
            supported:
              (action.target.self === true || action.target.count.amount === "all") &&
              !action.target.totalConstraint &&
              !action.target.count.upTo &&
              !action.target.count.amountFromMatchingCards,
          });
        if (
          ["grantKeyword", "grantAttribute", "negateEffects", "negatePlayerEffects"].includes(
            action.action,
          )
        )
          getterBridges.push({ inputs, writes });
        for (const input of inputs) for (const output of writes) connect(input, output);
        if (action.action === "setBasePower" || action.action === "setBasePowerFrom") {
          if (!eligible) {
            legacyReads.push(inputs);
            for (const output of writes) legacyWrites.add(output);
          }
        } else if (["modifyCost", "modifyPower", "setBaseCost", "setCost"].includes(action.action))
          for (const output of writes) seeds.add(output);
        if (eligible) for (const output of writes) seeds.add(output);
      });
    });
  }
  // Resolved additive modifiers are applied at stage1. Their values are fixed,
  // but a legacy current-value reader cannot be frozen across that transition.
  for (const modifier of Object.values(state.modifiers))
    if (modifier.type === "power" || modifier.type === "cost")
      seeds.add(key(modifier.targetId, modifier.type));
  const reach = (start: ReadonlySet<string>) => {
    const reached = new Set(start);
    for (const input of reached) for (const output of edges.get(input) ?? []) reached.add(output);
    return reached;
  };
  const intersects = (first: ReadonlySet<string>, second: ReadonlySet<string>) =>
    [...first].some((item) => second.has(item));
  const reachable = reach(seeds);
  // Even a legacy setter can change a negation condition. Include its writes
  // here without broadening the separate ordered-setter eligibility proof.
  const negationReachable = reach(new Set([...seeds, ...legacyWrites]));
  // Getter-derived grants have no first-class order step. Do not infer their
  // order from acyclicity alone when numeric changes can alter their output.
  const mutableBridgeOutputs = new Set<string>();
  for (const bridge of getterBridges)
    if (intersects(bridge.inputs, reachable))
      for (const output of reach(bridge.writes)) mutableBridgeOutputs.add(output);
  let baseCostIssue: string | undefined;
  for (const setter of baseCostSetters) {
    if (!setter.supported) {
      baseCostIssue = "Unsupported base-cost target selection";
      break;
    }
    if (intersects(setter.inputs, reach(setter.writes))) {
      baseCostIssue = "Base-cost setting can change its own eligibility";
      break;
    }
    if (intersects(setter.inputs, mutableBridgeOutputs)) {
      baseCostIssue = "Base-cost eligibility depends on an unordered mutable grant";
      break;
    }
  }
  return {
    baseCostIssue,
    ordered,
    numericNegationTargets: new Set(
      Object.keys(state.cards).filter((id) => negationReachable.has(key(id, "negation"))),
    ),
    unsupportedLegacy: legacyReads.some((inputs) =>
      [...inputs].some((input) =>
        ["power", "cost", "baseCost", "keyword"].includes(input.slice(input.lastIndexOf("/") + 1)),
      ),
    ),
    connectedNegation: [...orderedNegation].some((input) => reachable.has(input)),
    connectedLegacy: legacyReads.some((inputs) =>
      [...inputs].some((input) => reachable.has(input)),
    ),
  };
}
