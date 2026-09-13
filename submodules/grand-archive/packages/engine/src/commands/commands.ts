import {
  grandArchiveDecisionId,
  grandArchiveObjectId,
  grandArchivePlayerId,
  grandArchiveTargetId,
  type GrandArchiveDecisionId,
  type GrandArchiveObjectId,
  type GrandArchivePlayerId,
  type GrandArchiveTargetId,
} from "../game/identity.ts";

export const GRAND_ARCHIVE_MOVE_NAMES = [
  "pass",
  "concede",
  "skip-materialization",
  "return-preserved-card",
  "materialize",
  "bestow-boon",
  "start-pregame-card",
  "complete-pregame-actions",
  "activate-card",
  "activate-ability",
  "declare-attack",
  "answer-decision",
] as const;

export type GrandArchiveMoveName = (typeof GRAND_ARCHIVE_MOVE_NAMES)[number];

export type GrandArchiveReservePaymentSource =
  | {
      /** Reserve one other card from the payer's hand. */
      readonly kind: "card";
      readonly cardId: GrandArchiveObjectId;
    }
  | {
      /** Rest a ready object with an active Reservable ability. */
      readonly kind: "reservable";
      readonly objectId: GrandArchiveObjectId;
    };

export interface GrandArchiveAethercallingLoad {
  readonly cardId: GrandArchiveObjectId;
  readonly weaponId: GrandArchiveObjectId;
}

/** Active Prepare ability indexes selected as optional additional costs, in payment order. */
export type GrandArchivePrepareAbilityIndexes = readonly [number, ...number[]];

/**
 * Chooses the payment order for one structured `all` cost. `path` addresses that
 * `all` node from the declared cost root; each entry in `order` is one direct
 * child index and the declaration must be an exact permutation.
 */
export interface GrandArchiveCostPaymentOrder {
  readonly path: readonly number[];
  readonly order: readonly number[];
}

/**
 * Declares one optional continuous-effect payment method. The rule id is exposed by
 * `collectGrandArchivePaymentContributionRules`; selections belong only to that rule's cost.
 */
export interface GrandArchivePaymentContributionDeclaration {
  readonly ruleId: string;
  /** Reserve sources required by the contribution rule's own structured cost, if any. */
  readonly reservePayment?: readonly GrandArchiveReservePaymentSource[];
  /** Objects selected by the rule's structured cost, in that cost's declaration order. */
  readonly costSelections?: readonly (readonly GrandArchiveObjectId[])[];
  readonly costPaymentOrders?: readonly GrandArchiveCostPaymentOrder[];
  readonly costOptionIndex?: number;
  readonly payOptionalCost?: boolean;
  /** Cards used by a filter-based contribution such as an opponent's Floating Memory card. */
  readonly paymentSourceIds?: readonly GrandArchiveObjectId[];
}

export interface GrandArchiveStarcallingAnswer {
  readonly kind: "starcall";
  readonly cardId: GrandArchiveObjectId;
  /** Aethercalling special actions performed before the Starcalling activation. */
  readonly loads?: readonly GrandArchiveAethercallingLoad[];
  /** Every other still-looked-at card, in the chosen bottom-of-deck order. */
  readonly bottom: readonly GrandArchiveObjectId[];
  readonly modeIds?: readonly string[];
  readonly targets?: Readonly<Record<string, readonly GrandArchiveTargetId[]>>;
  readonly reservePayment?: readonly GrandArchiveReservePaymentSource[];
  /** Reveal every hand card reserved for this activation to invoke Imbue. */
  readonly revealForImbue?: boolean;
  /** Fire-element graveyard cards banished to pay this activation's Kindle allowance. */
  readonly kindleCardIds?: readonly GrandArchiveObjectId[];
  readonly paymentContributions?: readonly GrandArchivePaymentContributionDeclaration[];
  readonly costSelections?: readonly (readonly GrandArchiveObjectId[])[];
  readonly costPaymentOrders?: readonly GrandArchiveCostPaymentOrder[];
  readonly costOptionIndex?: number;
  readonly payOptionalCost?: boolean;
  /** Active Prepare abilities whose optional additional costs are paid, in payment order. */
  readonly prepareAbilityIndexes?: GrandArchivePrepareAbilityIndexes;
  readonly variables?: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
}

export type GrandArchiveGlimpseAnswer =
  | {
      readonly kind: "reorder";
      /** Aethercalling special actions performed before ordering the remaining cards. */
      readonly loads?: readonly GrandArchiveAethercallingLoad[];
      readonly top: readonly GrandArchiveObjectId[];
      readonly bottom: readonly GrandArchiveObjectId[];
    }
  | GrandArchiveStarcallingAnswer;

/** Complete materialization announcement. */
export interface GrandArchiveMaterializationDeclaration {
  readonly cardId: GrandArchiveObjectId;
  readonly modeIds?: readonly string[];
  readonly targets?: Readonly<Record<string, readonly GrandArchiveTargetId[]>>;
  readonly reservePayment?: readonly GrandArchiveReservePaymentSource[];
  readonly floatingMemoryCardIds?: readonly GrandArchiveObjectId[];
  readonly paymentContributions?: readonly GrandArchivePaymentContributionDeclaration[];
  readonly costSelections?: readonly (readonly GrandArchiveObjectId[])[];
  readonly costPaymentOrders?: readonly GrandArchiveCostPaymentOrder[];
  readonly costOptionIndex?: number;
  readonly payOptionalCost?: boolean;
  readonly variables?: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
}

export type GrandArchiveCommand =
  | { readonly move: "pass" }
  | { readonly move: "concede" }
  | { readonly move: "skip-materialization" }
  | {
      readonly move: "return-preserved-card";
      readonly cardId: GrandArchiveObjectId;
    }
  | { readonly move: "start-pregame-card"; readonly cardId: GrandArchiveObjectId }
  | { readonly move: "complete-pregame-actions" }
  | ({ readonly move: "materialize" } & GrandArchiveMaterializationDeclaration)
  | {
      readonly move: "bestow-boon";
      readonly cardId: GrandArchiveObjectId;
      readonly modeIds?: readonly string[];
      readonly targets?: Readonly<Record<string, readonly GrandArchiveTargetId[]>>;
      readonly reservePayment?: readonly GrandArchiveReservePaymentSource[];
      readonly paymentContributions?: readonly GrandArchivePaymentContributionDeclaration[];
      readonly costSelections?: readonly (readonly GrandArchiveObjectId[])[];
      readonly costPaymentOrders?: readonly GrandArchiveCostPaymentOrder[];
      readonly costOptionIndex?: number;
      readonly payOptionalCost?: boolean;
      readonly variables?: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
    }
  | {
      readonly move: "activate-card";
      readonly cardId: GrandArchiveObjectId;
      /** Unit rested as the additional cost of activating an Attack card. */
      readonly attackAttackerId?: GrandArchiveObjectId;
      /** Declares an alternative activation permission and cost. Omit for normal activation. */
      readonly activationMethod?: "brew" | "ephemerate" | "starcalling";
      /** Exact controlled field objects sacrificed for the declared Brew cost. */
      readonly brewIngredientIds?: readonly GrandArchiveObjectId[];
      readonly modeIds?: readonly string[];
      readonly targets?: Readonly<Record<string, readonly GrandArchiveTargetId[]>>;
      readonly reservePayment?: readonly GrandArchiveReservePaymentSource[];
      /** Reveal every hand card reserved for this activation to invoke Imbue. */
      readonly revealForImbue?: boolean;
      /** Fire-element graveyard cards banished through an active Kindle ability. */
      readonly kindleCardIds?: readonly GrandArchiveObjectId[];
      readonly floatingMemoryCardIds?: readonly GrandArchiveObjectId[];
      readonly paymentContributions?: readonly GrandArchivePaymentContributionDeclaration[];
      readonly costSelections?: readonly (readonly GrandArchiveObjectId[])[];
      readonly costPaymentOrders?: readonly GrandArchiveCostPaymentOrder[];
      readonly costOptionIndex?: number;
      readonly payOptionalCost?: boolean;
      /** Active Prepare abilities whose optional additional costs are paid, in payment order. */
      readonly prepareAbilityIndexes?: GrandArchivePrepareAbilityIndexes;
      readonly variables?: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
    }
  | {
      readonly move: "activate-ability";
      readonly sourceId: GrandArchiveObjectId;
      readonly abilityId: string;
      readonly modeIds?: readonly string[];
      readonly targets?: Readonly<Record<string, readonly GrandArchiveTargetId[]>>;
      readonly reservePayment?: readonly GrandArchiveReservePaymentSource[];
      readonly paymentContributions?: readonly GrandArchivePaymentContributionDeclaration[];
      readonly costSelections?: readonly (readonly GrandArchiveObjectId[])[];
      readonly costPaymentOrders?: readonly GrandArchiveCostPaymentOrder[];
      readonly variables?: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
      readonly costOptionIndex?: number;
      readonly payOptionalCost?: boolean;
    }
  | {
      readonly move: "declare-attack";
      readonly attackerId: GrandArchiveObjectId;
      readonly targetIds: readonly GrandArchiveObjectId[];
      /** Opponent chosen for an attack whose defender selection is delegated. */
      readonly delegatePlayerId?: GrandArchivePlayerId;
      readonly cleavePlayerId?: GrandArchivePlayerId;
      readonly attackCardId?: GrandArchiveObjectId;
      readonly weaponIds?: readonly GrandArchiveObjectId[];
      readonly reservePayment?: readonly GrandArchiveReservePaymentSource[];
      readonly costSelections?: readonly (readonly GrandArchiveObjectId[])[];
      readonly costPaymentOrders?: readonly GrandArchiveCostPaymentOrder[];
      readonly costOptionIndex?: number;
      readonly payOptionalCost?: boolean;
    }
  | {
      readonly move: "answer-decision";
      readonly decisionId: GrandArchiveDecisionId;
      readonly stateVersion: number;
      readonly answer: unknown;
    };

export function isGrandArchiveMoveName(value: string): value is GrandArchiveMoveName {
  return (GRAND_ARCHIVE_MOVE_NAMES as readonly string[]).includes(value);
}

interface ParsedActivationDeclaration {
  readonly modeIds?: readonly string[];
  readonly targets?: Readonly<Record<string, readonly GrandArchiveTargetId[]>>;
  readonly reservePayment?: readonly GrandArchiveReservePaymentSource[];
  readonly paymentContributions?: readonly GrandArchivePaymentContributionDeclaration[];
  readonly costSelections?: readonly (readonly GrandArchiveObjectId[])[];
  readonly costPaymentOrders?: readonly GrandArchiveCostPaymentOrder[];
  readonly costOptionIndex?: number;
  readonly payOptionalCost?: boolean;
  readonly variables?: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireOnly(record: Record<string, unknown>, allowed: readonly string[]): void {
  if (Object.keys(record).some((key) => !allowed.includes(key))) {
    throw new Error("Command contains an unknown field");
  }
}

function identifier(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("Command identifier is missing or empty");
  }
  return value.trim();
}

function optionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") throw new Error("Command flag must be boolean");
  return value;
}

function optionalIndex(value: unknown): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new Error("Command index must be a non-negative safe integer");
  }
  return value;
}

function optionalNonEmptyIndexes(value: unknown): GrandArchivePrepareAbilityIndexes | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("Command indexes must be a non-empty array");
  }
  const [first, ...rest] = value;
  const indexes = [first, ...rest].map((index) => {
    if (typeof index !== "number" || !Number.isSafeInteger(index) || index < 0) {
      throw new Error("Command indexes must be non-negative safe integers");
    }
    return index;
  });
  if (new Set(indexes).size !== indexes.length) {
    throw new Error("Command indexes must be unique");
  }
  return [indexes[0]!, ...indexes.slice(1)];
}

function optionalStringIds(value: unknown): readonly string[] | undefined {
  if (value === undefined) return undefined;
  return requiredStringIds(value);
}

function requiredStringIds(value: unknown): readonly string[] {
  if (!Array.isArray(value)) throw new Error("Command identifiers must be an array");
  return value.map(identifier);
}

function optionalObjectIds(value: unknown): readonly GrandArchiveObjectId[] | undefined {
  return optionalStringIds(value)?.map(grandArchiveObjectId);
}

function requiredObjectIds(value: unknown): readonly GrandArchiveObjectId[] {
  return requiredStringIds(value).map(grandArchiveObjectId);
}

function optionalTargets(
  value: unknown,
): Readonly<Record<string, readonly GrandArchiveTargetId[]>> | undefined {
  if (value === undefined) return undefined;
  if (!isRecord(value)) throw new Error("Command targets must be an object");
  return Object.fromEntries(
    Object.entries(value).map(([binding, targets]) => [
      identifier(binding),
      requiredStringIds(targets).map(grandArchiveTargetId),
    ]),
  );
}

function optionalReservePayment(
  value: unknown,
): readonly GrandArchiveReservePaymentSource[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new Error("Reserve payment must be an array");
  return value.map((entry): GrandArchiveReservePaymentSource => {
    if (!isRecord(entry)) throw new Error("Reserve source must be an object");
    if (entry.kind === "card") {
      requireOnly(entry, ["kind", "cardId"]);
      return { kind: "card", cardId: grandArchiveObjectId(identifier(entry.cardId)) };
    }
    if (entry.kind === "reservable") {
      requireOnly(entry, ["kind", "objectId"]);
      return { kind: "reservable", objectId: grandArchiveObjectId(identifier(entry.objectId)) };
    }
    throw new Error("Unknown reserve source kind");
  });
}

function optionalCostSelections(
  value: unknown,
): readonly (readonly GrandArchiveObjectId[])[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new Error("Cost selections must be an array");
  return value.map(requiredObjectIds);
}

function optionalCostPaymentOrders(
  value: unknown,
): readonly GrandArchiveCostPaymentOrder[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new Error("Cost payment orders must be an array");
  return value.map((entry) => {
    if (!isRecord(entry)) throw new Error("Cost payment order must be an object");
    requireOnly(entry, ["path", "order"]);
    const indexes = (candidate: unknown): readonly number[] => {
      if (!Array.isArray(candidate)) throw new Error("Cost payment order must be an array");
      return candidate.map((index) => {
        if (typeof index !== "number" || !Number.isSafeInteger(index) || index < 0) {
          throw new Error("Cost payment paths must contain non-negative safe integers");
        }
        return index;
      });
    };
    return { path: indexes(entry.path), order: indexes(entry.order) };
  });
}

function optionalVariables(
  value: unknown,
): Readonly<Partial<Record<"X" | "Y" | "Z", number>>> | undefined {
  if (value === undefined) return undefined;
  if (!isRecord(value)) throw new Error("Variables must be an object");
  requireOnly(value, ["X", "Y", "Z"]);
  const variables: Partial<Record<"X" | "Y" | "Z", number>> = {};
  for (const name of ["X", "Y", "Z"] as const) {
    const amount = value[name];
    if (amount === undefined) continue;
    if (typeof amount !== "number" || !Number.isFinite(amount)) {
      throw new Error("Variable values must be finite numbers");
    }
    variables[name] = amount;
  }
  return variables;
}

function optionalPaymentContributions(
  value: unknown,
): readonly GrandArchivePaymentContributionDeclaration[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new Error("Payment contributions must be an array");
  return value.map((entry) => {
    if (!isRecord(entry)) throw new Error("Payment contribution must be an object");
    requireOnly(entry, [
      "ruleId",
      "reservePayment",
      "costSelections",
      "costPaymentOrders",
      "costOptionIndex",
      "payOptionalCost",
      "paymentSourceIds",
    ]);
    return {
      ruleId: identifier(entry.ruleId),
      ...(optionalReservePayment(entry.reservePayment)
        ? { reservePayment: optionalReservePayment(entry.reservePayment) }
        : {}),
      ...(optionalCostSelections(entry.costSelections)
        ? { costSelections: optionalCostSelections(entry.costSelections) }
        : {}),
      ...(optionalCostPaymentOrders(entry.costPaymentOrders)
        ? { costPaymentOrders: optionalCostPaymentOrders(entry.costPaymentOrders) }
        : {}),
      ...(optionalIndex(entry.costOptionIndex) !== undefined
        ? { costOptionIndex: optionalIndex(entry.costOptionIndex) }
        : {}),
      ...(optionalBoolean(entry.payOptionalCost) !== undefined
        ? { payOptionalCost: optionalBoolean(entry.payOptionalCost) }
        : {}),
      ...(optionalObjectIds(entry.paymentSourceIds)
        ? { paymentSourceIds: optionalObjectIds(entry.paymentSourceIds) }
        : {}),
    };
  });
}

function activationDeclaration(record: Record<string, unknown>): ParsedActivationDeclaration {
  const modeIds = optionalStringIds(record.modeIds);
  const targets = optionalTargets(record.targets);
  const reservePayment = optionalReservePayment(record.reservePayment);
  const paymentContributions = optionalPaymentContributions(record.paymentContributions);
  const costSelections = optionalCostSelections(record.costSelections);
  const costPaymentOrders = optionalCostPaymentOrders(record.costPaymentOrders);
  const costOptionIndex = optionalIndex(record.costOptionIndex);
  const payOptionalCost = optionalBoolean(record.payOptionalCost);
  const variables = optionalVariables(record.variables);
  return {
    ...(modeIds ? { modeIds } : {}),
    ...(targets ? { targets } : {}),
    ...(reservePayment ? { reservePayment } : {}),
    ...(paymentContributions ? { paymentContributions } : {}),
    ...(costSelections ? { costSelections } : {}),
    ...(costPaymentOrders ? { costPaymentOrders } : {}),
    ...(costOptionIndex !== undefined ? { costOptionIndex } : {}),
    ...(payOptionalCost !== undefined ? { payOptionalCost } : {}),
    ...(variables ? { variables } : {}),
  };
}

const ACTIVATION_FIELDS = [
  "modeIds",
  "targets",
  "reservePayment",
  "paymentContributions",
  "costSelections",
  "costPaymentOrders",
  "costOptionIndex",
  "payOptionalCost",
  "variables",
] as const;

function materializationDeclaration(
  record: Record<string, unknown>,
): GrandArchiveMaterializationDeclaration {
  requireOnly(record, ["cardId", "floatingMemoryCardIds", ...ACTIVATION_FIELDS]);
  const floatingMemoryCardIds = optionalObjectIds(record.floatingMemoryCardIds);
  return {
    cardId: grandArchiveObjectId(identifier(record.cardId)),
    ...activationDeclaration(record),
    ...(floatingMemoryCardIds ? { floatingMemoryCardIds } : {}),
  };
}

/** Strict, fail-closed decoder for untrusted adapter and simulator payloads. */
export function decodeGrandArchiveCommand(
  move: GrandArchiveMoveName,
  payload: unknown,
): GrandArchiveCommand | null {
  if (!isRecord(payload)) return null;
  try {
    switch (move) {
      case "pass":
      case "concede":
      case "skip-materialization":
      case "complete-pregame-actions":
        requireOnly(payload, []);
        return { move };
      case "return-preserved-card": {
        requireOnly(payload, ["cardId"]);
        return {
          move,
          cardId: grandArchiveObjectId(identifier(payload.cardId)),
        };
      }
      case "start-pregame-card":
        requireOnly(payload, ["cardId"]);
        return { move, cardId: grandArchiveObjectId(identifier(payload.cardId)) };
      case "materialize": {
        return { move, ...materializationDeclaration(payload) };
      }
      case "bestow-boon":
        requireOnly(payload, ["cardId", ...ACTIVATION_FIELDS]);
        return {
          move,
          cardId: grandArchiveObjectId(identifier(payload.cardId)),
          ...activationDeclaration(payload),
        };
      case "activate-card": {
        requireOnly(payload, [
          "cardId",
          "attackAttackerId",
          "activationMethod",
          "brewIngredientIds",
          "revealForImbue",
          "kindleCardIds",
          "floatingMemoryCardIds",
          "prepareAbilityIndexes",
          ...ACTIVATION_FIELDS,
        ]);
        const method = payload.activationMethod;
        if (
          method !== undefined &&
          method !== "brew" &&
          method !== "ephemerate" &&
          method !== "starcalling"
        ) {
          throw new Error("Unknown activation method");
        }
        const prepareAbilityIndexes = optionalNonEmptyIndexes(payload.prepareAbilityIndexes);
        return {
          move,
          cardId: grandArchiveObjectId(identifier(payload.cardId)),
          ...activationDeclaration(payload),
          ...(payload.attackAttackerId !== undefined
            ? { attackAttackerId: grandArchiveObjectId(identifier(payload.attackAttackerId)) }
            : {}),
          ...(method ? { activationMethod: method } : {}),
          ...(optionalObjectIds(payload.brewIngredientIds)
            ? { brewIngredientIds: optionalObjectIds(payload.brewIngredientIds) }
            : {}),
          ...(optionalBoolean(payload.revealForImbue) !== undefined
            ? { revealForImbue: optionalBoolean(payload.revealForImbue) }
            : {}),
          ...(optionalObjectIds(payload.kindleCardIds)
            ? { kindleCardIds: optionalObjectIds(payload.kindleCardIds) }
            : {}),
          ...(optionalObjectIds(payload.floatingMemoryCardIds)
            ? { floatingMemoryCardIds: optionalObjectIds(payload.floatingMemoryCardIds) }
            : {}),
          ...(prepareAbilityIndexes ? { prepareAbilityIndexes } : {}),
        };
      }
      case "activate-ability":
        requireOnly(payload, ["sourceId", "abilityId", ...ACTIVATION_FIELDS]);
        return {
          move,
          sourceId: grandArchiveObjectId(identifier(payload.sourceId)),
          abilityId: identifier(payload.abilityId),
          ...activationDeclaration(payload),
        };
      case "declare-attack":
        requireOnly(payload, [
          "attackerId",
          "targetIds",
          "delegatePlayerId",
          "cleavePlayerId",
          "attackCardId",
          "weaponIds",
          "reservePayment",
          "costSelections",
          "costPaymentOrders",
          "costOptionIndex",
          "payOptionalCost",
        ]);
        return {
          move,
          attackerId: grandArchiveObjectId(identifier(payload.attackerId)),
          targetIds: requiredObjectIds(payload.targetIds),
          ...(payload.delegatePlayerId !== undefined
            ? { delegatePlayerId: grandArchivePlayerId(identifier(payload.delegatePlayerId)) }
            : {}),
          ...(payload.cleavePlayerId !== undefined
            ? { cleavePlayerId: grandArchivePlayerId(identifier(payload.cleavePlayerId)) }
            : {}),
          ...(payload.attackCardId !== undefined
            ? { attackCardId: grandArchiveObjectId(identifier(payload.attackCardId)) }
            : {}),
          ...(optionalObjectIds(payload.weaponIds)
            ? { weaponIds: optionalObjectIds(payload.weaponIds) }
            : {}),
          ...activationDeclaration(payload),
        };
      case "answer-decision":
        requireOnly(payload, ["decisionId", "stateVersion", "answer"]);
        if (
          typeof payload.stateVersion !== "number" ||
          !Number.isSafeInteger(payload.stateVersion) ||
          payload.stateVersion < 0 ||
          !Object.hasOwn(payload, "answer")
        ) {
          throw new Error("Decision answer is malformed");
        }
        return {
          move,
          decisionId: grandArchiveDecisionId(identifier(payload.decisionId)),
          stateVersion: payload.stateVersion,
          answer: payload.answer,
        };
    }
  } catch {
    return null;
  }
}
