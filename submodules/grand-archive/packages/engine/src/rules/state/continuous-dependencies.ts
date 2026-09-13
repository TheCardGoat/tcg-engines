import type {
  GrandArchiveAmount,
  GrandArchiveCardFilter,
  GrandArchiveCollection,
  GrandArchiveCondition,
  GrandArchiveContinuousEffect,
  GrandArchiveSubject,
} from "@tcg/grand-archive-types";

/** Ordered CR continuous-effect layers that an expression reads from current game state. */
export type GrandArchiveDependencyLayer = "A" | "B" | "C" | "D" | "E";

const LAYER_ORDER = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
} as const satisfies Record<GrandArchiveDependencyLayer, number>;

/** Stable ordering for the comprehensive-rules A-E continuous-effect layers. */
export function grandArchiveDependencyLayerOrder(layer: GrandArchiveDependencyLayer): number {
  return LAYER_ORDER[layer];
}

function layers(...groups: readonly (readonly GrandArchiveDependencyLayer[])[]) {
  return [...new Set(groups.flat())].sort((left, right) => LAYER_ORDER[left] - LAYER_ORDER[right]);
}

function characteristicLayer(
  characteristic: "card-name" | "name" | "class" | "element" | "subtype" | "type" | "reserve-cost",
): readonly GrandArchiveDependencyLayer[] {
  if (characteristic === "element") return ["C"];
  if (characteristic === "reserve-cost") return ["A", "E"];
  return ["B"];
}

export function grandArchiveFilterDependencyLayers(
  filter: GrandArchiveCardFilter,
): readonly GrandArchiveDependencyLayer[] {
  switch (filter.kind) {
    case "all":
    case "any":
      return layers(...filter.filters.map(grandArchiveFilterDependencyLayers));
    case "not":
      return grandArchiveFilterDependencyLayers(filter.filter);
    case "name":
    case "champion-name":
    case "type":
    case "class":
    case "subtype":
    case "supertype":
      return ["B"];
    case "matches-tracked-characteristic":
      return characteristicLayer(filter.characteristic);
    case "element":
    case "element-category":
      return ["C"];
    case "speed":
      return ["A", "E"];
    case "numeric":
      return grandArchiveComparisonDependencyLayers(filter.comparison);
    case "parity":
      return ["A", "E"];
    case "has-keyword":
    case "has-link-keyword":
      return ["D"];
    case "same-characteristic":
      return characteristicLayer(filter.characteristic);
    case "not-subject":
      return grandArchiveSubjectDependencyLayers(filter.subject);
    case "attacking-subject":
      return grandArchiveSubjectDependencyLayers(filter.defender);
    case "canonical-id":
    case "not-source":
    case "zone":
    case "facing":
    case "has-counter":
    case "object-state":
    case "activation-state":
    case "token":
    case "entered-field-this-turn":
    case "linked":
      return [];
    default:
      return assertNever(filter);
  }
}

export function grandArchiveCollectionDependencyLayers(
  collection: GrandArchiveCollection,
): readonly GrandArchiveDependencyLayer[] {
  return layers(
    collection.filter ? grandArchiveFilterDependencyLayers(collection.filter) : [],
    collection.host ? grandArchiveSubjectDependencyLayers(collection.host) : [],
  );
}

export function grandArchiveSubjectDependencyLayers(
  subject: GrandArchiveSubject,
): readonly GrandArchiveDependencyLayer[] {
  switch (subject.kind) {
    case "attacks-by":
      return grandArchiveSubjectDependencyLayers(subject.attacker);
    case "related":
      return grandArchiveSubjectDependencyLayers(subject.subject);
    case "each":
      return grandArchiveCollectionDependencyLayers(subject.collection);
    case "source":
    case "ability-bearer":
    case "candidate":
    case "controller":
    case "champion":
    case "mastery":
    case "player":
    case "event-source":
    case "event-subject":
    case "event-recipient":
    case "event-attacker":
    case "current-attack":
    case "linked-object":
    case "tracked":
    case "binding-remainder":
    case "stack-source":
    case "bound":
      return [];
    default:
      return assertNever(subject);
  }
}

function grandArchiveComparisonDependencyLayers(
  comparison: import("@tcg/grand-archive-types").GrandArchiveComparison,
): readonly GrandArchiveDependencyLayer[] {
  return layers(
    grandArchiveAmountDependencyLayers(comparison.left),
    grandArchiveAmountDependencyLayers(comparison.right),
  );
}

export function grandArchiveAmountDependencyLayers(
  amount: GrandArchiveAmount,
): readonly GrandArchiveDependencyLayer[] {
  if (typeof amount === "number") return [];
  switch (amount.kind) {
    case "property":
      return amount.basis === "current" ? ["A", "E"] : [];
    case "count":
      return layers(
        grandArchiveCollectionDependencyLayers(amount.collection),
        amount.distinctBy ? characteristicLayer(amount.distinctBy) : [],
      );
    case "sum-counters":
    case "aggregate-counter-count":
      return grandArchiveCollectionDependencyLayers(amount.collection);
    case "aggregate-property":
      return layers(
        grandArchiveCollectionDependencyLayers(amount.collection),
        amount.basis === "current" ? ["A", "E"] : [],
      );
    case "longest-consecutive-property-run":
      return layers(
        ...amount.collections.map(grandArchiveCollectionDependencyLayers),
        amount.basis === "current" ? ["A", "E"] : [],
      );
    case "player-zone-count":
      return layers(
        amount.filter ? grandArchiveFilterDependencyLayers(amount.filter) : [],
        grandArchiveAmountDependencyLayers(amount.comparison.value),
      );
    case "calculate":
      return layers(...amount.operands.map(grandArchiveAmountDependencyLayers));
    case "conditional":
      return layers(
        grandArchiveConditionDependencyLayers(amount.condition),
        grandArchiveAmountDependencyLayers(amount.then),
        grandArchiveAmountDependencyLayers(amount.else),
      );
    case "all":
    case "variable":
    case "counter-count":
    case "binding":
    case "binding-count":
    case "event-amount":
    case "event-total":
    case "modified-ability-result-amount":
    case "target-count":
    case "activation-payment-card-count":
    case "die":
    case "player-property":
    case "aggregate-player-property":
      return [];
    default:
      return assertNever(amount);
  }
}

export function grandArchiveConditionDependencyLayers(
  condition: GrandArchiveCondition,
): readonly GrandArchiveDependencyLayer[] {
  switch (condition.kind) {
    case "all":
    case "any":
      return layers(...condition.conditions.map(grandArchiveConditionDependencyLayers));
    case "not":
      return grandArchiveConditionDependencyLayers(condition.condition);
    case "compare":
      return grandArchiveComparisonDependencyLayers(condition.comparison);
    case "collection-exists":
    case "collection-count-parity":
      return grandArchiveCollectionDependencyLayers(condition.collection);
    case "subject-matches":
      return layers(
        grandArchiveSubjectDependencyLayers(condition.subject),
        grandArchiveFilterDependencyLayers(condition.filter),
      );
    case "shares-characteristic":
      return layers(
        grandArchiveSubjectDependencyLayers(condition.left),
        grandArchiveSubjectDependencyLayers(condition.right),
        characteristicLayer(condition.characteristic),
      );
    case "controls":
      return grandArchiveFilterDependencyLayers(condition.filter);
    case "controls-subject":
    case "owns-subject":
      return grandArchiveSubjectDependencyLayers(condition.subject);
    case "has-related-object":
      return layers(
        grandArchiveSubjectDependencyLayers(condition.subject),
        condition.filter ? grandArchiveFilterDependencyLayers(condition.filter) : [],
      );
    case "combat-relation":
      return layers(
        grandArchiveSubjectDependencyLayers(condition.subject),
        condition.other ? grandArchiveSubjectDependencyLayers(condition.other) : [],
        condition.otherFilter ? grandArchiveFilterDependencyLayers(condition.otherFilter) : [],
        condition.using ? grandArchiveSubjectDependencyLayers(condition.using) : [],
        condition.usingFilter ? grandArchiveFilterDependencyLayers(condition.usingFilter) : [],
      );
    case "current-attack-target-matches":
      return condition.filter ? grandArchiveFilterDependencyLayers(condition.filter) : [];
    case "player-turn-count":
      return grandArchiveAmountDependencyLayers(condition.value);
    case "has-counter":
      return layers(
        grandArchiveSubjectDependencyLayers(condition.subject),
        condition.comparison ? grandArchiveComparisonDependencyLayers(condition.comparison) : [],
      );
    case "counter-count-parity":
    case "object-state":
    case "subjects-in-zone":
      return grandArchiveSubjectDependencyLayers(condition.subject);
    case "numeric-property-parity":
      return layers(
        grandArchiveSubjectDependencyLayers(condition.subject),
        condition.basis === "current" ? ["A", "E"] : [],
      );
    case "player-property-compare":
      return grandArchiveAmountDependencyLayers(condition.value);
    case "player-zone-count":
      return layers(
        condition.filter ? grandArchiveFilterDependencyLayers(condition.filter) : [],
        grandArchiveAmountDependencyLayers(condition.value),
      );
    case "collection-has-shared-characteristic":
      return layers(
        grandArchiveCollectionDependencyLayers(condition.collection),
        characteristicLayer(condition.characteristic),
        grandArchiveAmountDependencyLayers(condition.minimumMatching),
      );
    case "starting-deck-count":
      return layers(
        condition.filter ? grandArchiveFilterDependencyLayers(condition.filter) : [],
        grandArchiveAmountDependencyLayers(condition.value),
      );
    case "ability-activation-count":
    case "ability-resolution-count":
      return grandArchiveAmountDependencyLayers(condition.value);
    case "ability-target-matches":
      return grandArchiveFilterDependencyLayers(condition.filter);
    case "ability-target-characteristic-in-collection":
      return layers(
        characteristicLayer(condition.characteristic),
        grandArchiveCollectionDependencyLayers(condition.collection),
      );
    case "ability-targets-subject":
      return grandArchiveSubjectDependencyLayers(condition.subject);
    case "champion-matches-source":
      return condition.characteristic === "element" ? ["C"] : ["B"];
    case "history":
      return layers(
        condition.subject ? grandArchiveSubjectDependencyLayers(condition.subject) : [],
        condition.recipient ? grandArchiveSubjectDependencyLayers(condition.recipient) : [],
        condition.source ? grandArchiveSubjectDependencyLayers(condition.source) : [],
        condition.filter ? grandArchiveFilterDependencyLayers(condition.filter) : [],
        condition.eventAmountMinimum
          ? grandArchiveAmountDependencyLayers(condition.eventAmountMinimum)
          : [],
        condition.minimum ? grandArchiveAmountDependencyLayers(condition.minimum) : [],
      );
    case "mastery-has-counter":
      return grandArchiveAmountDependencyLayers(condition.minimum);
    case "turn-player":
    case "phase":
    case "player-relation":
    case "player-state":
    case "player-property-extreme":
    case "activation-state":
    case "source-activation-context":
    case "source-zone":
    case "source-activation-zone":
    case "paid-cost":
    case "effect-succeeded":
    case "effect-result-origin":
    case "target-is-legal":
    case "champion-lineage-is":
      return [];
    default:
      return assertNever(condition);
  }
}

/** Layers read while determining whether/how one continuous modifier applies. */
export function grandArchiveContinuousDependencyLayers(
  effect: GrandArchiveContinuousEffect,
): readonly GrandArchiveDependencyLayer[] {
  const changeDependencies: readonly GrandArchiveDependencyLayer[] = (() => {
    const change = effect.change;
    switch (change.kind) {
      case "numeric":
        return change.amount ? grandArchiveAmountDependencyLayers(change.amount) : [];
      case "copy-characteristic":
        return layers(
          grandArchiveSubjectDependencyLayers(change.from),
          characteristicLayer(change.characteristic),
        );
      case "copy-abilities":
        return layers(grandArchiveSubjectDependencyLayers(change.from), ["D"]);
      case "copy-abilities-from-collection":
        return layers(grandArchiveCollectionDependencyLayers(change.collection), ["D"]);
      case "remove-abilities":
      case "transform-abilities":
      case "remove-keyword":
        return ["D"];
      case "grant-ability":
      case "add-characteristic":
      case "remove-characteristic":
      case "add-tracked-characteristic":
      case "set-elements":
      case "set-types":
      case "grant-keyword":
      case "control":
        return [];
      default:
        return assertNever(change);
    }
  })();
  return layers(
    grandArchiveSubjectDependencyLayers(effect.subjects),
    effect.condition ? grandArchiveConditionDependencyLayers(effect.condition) : [],
    changeDependencies,
  );
}

export function grandArchiveContinuousApplicationLayer(
  effect: GrandArchiveContinuousEffect,
): GrandArchiveDependencyLayer {
  const modificationLayer = effect.layer.layer === "control" ? "A" : effect.layer.layer;
  return grandArchiveContinuousDependencyLayers(effect).reduce(
    (latest, dependency) => (LAYER_ORDER[dependency] > LAYER_ORDER[latest] ? dependency : latest),
    modificationLayer,
  );
}

/** Whether evaluating this effect reads its own layer (or a later one). */
export function grandArchiveContinuousHasLayerDependency(
  effect: GrandArchiveContinuousEffect,
): boolean {
  const modificationLayer = effect.layer.layer === "control" ? "A" : effect.layer.layer;
  return grandArchiveContinuousDependencyLayers(effect).some(
    (dependency) => LAYER_ORDER[dependency] >= LAYER_ORDER[modificationLayer],
  );
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive dependency expression: ${JSON.stringify(value)}`);
}
