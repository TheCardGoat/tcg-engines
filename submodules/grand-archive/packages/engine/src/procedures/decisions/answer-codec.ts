import type { GrandArchiveZone } from "@tcg/grand-archive-types";
import { grandArchiveObjectCurrentCharacteristics } from "../../rules/state/continuous.ts";
import type {
  GrandArchiveAethercallingLoad,
  GrandArchiveCommand,
  GrandArchiveCostPaymentOrder,
  GrandArchivePaymentContributionDeclaration,
  GrandArchivePrepareAbilityIndexes,
  GrandArchiveReservePaymentSource,
  GrandArchiveStarcallingAnswer,
} from "../../commands/commands.ts";
import type { GrandArchiveCostPaymentSelection } from "../activation/costs.ts";
import type { GrandArchiveProposedEvent } from "../../kernel/events.ts";
import type {
  GrandArchiveObjectId,
  GrandArchivePlayerId,
  GrandArchiveTargetId,
} from "../../game/identity.ts";
import { grandArchiveObjectHasActiveKeyword } from "../../rules/abilities/intrinsic-keywords.ts";
import { grandArchiveGrantedKeywordsForAction } from "../../rules/state/rule-modifications.ts";
import type { GrandArchiveCommandHandlerContext } from "../../commands/handler-context.ts";

type GrandArchiveEffectMaterializationAnswer = Omit<
  Extract<GrandArchiveCommand, { readonly move: "materialize" }>,
  "move" | "cardId"
>;

type GrandArchiveEffectActivationAnswer = Omit<
  Extract<GrandArchiveCommand, { readonly move: "activate-card" }>,
  "move" | "cardId" | "activationMethod" | "brewIngredientIds"
>;

interface GrandArchiveEffectAttackAnswer {
  readonly targetIds: readonly GrandArchiveObjectId[];
  readonly weaponIds?: readonly GrandArchiveObjectId[];
  readonly cleavePlayerId?: GrandArchivePlayerId;
  readonly delegatePlayerId?: GrandArchivePlayerId;
  readonly effectCostPayment?: GrandArchiveCostPaymentSelection;
  readonly attackCostPayment?: GrandArchiveCostPaymentSelection;
}

interface GrandArchiveParsedTriggerAnnouncement {
  readonly modeIds?: readonly string[];
  readonly targets?: Readonly<Record<string, readonly GrandArchiveTargetId[]>>;
  readonly variables?: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
}

export class GrandArchiveDecisionAnswerCodec {
  public constructor(private readonly context: GrandArchiveCommandHandlerContext) {}

  private parseCostPaymentOrders(answer: unknown): readonly GrandArchiveCostPaymentOrder[] | null {
    if (!Array.isArray(answer)) return null;
    const declarations: GrandArchiveCostPaymentOrder[] = [];
    for (const value of answer) {
      if (
        typeof value !== "object" ||
        value === null ||
        Array.isArray(value) ||
        Object.keys(value).some((key) => key !== "path" && key !== "order") ||
        !("path" in value) ||
        !("order" in value) ||
        !Array.isArray(value.path) ||
        !Array.isArray(value.order) ||
        value.path.some(
          (segment: unknown) =>
            typeof segment !== "number" || !Number.isSafeInteger(segment) || segment < 0,
        ) ||
        value.order.some(
          (index: unknown) =>
            typeof index !== "number" || !Number.isSafeInteger(index) || index < 0,
        )
      ) {
        return null;
      }
      declarations.push({ path: value.path, order: value.order });
    }
    return declarations;
  }

  private parsePrepareAbilityIndexes(answer: unknown): GrandArchivePrepareAbilityIndexes | null {
    if (!Array.isArray(answer) || answer.length === 0) return null;
    const indexes: number[] = [];
    for (const index of answer) {
      if (typeof index !== "number" || !Number.isSafeInteger(index) || index < 0) return null;
      indexes.push(index);
    }
    if (new Set(indexes).size !== indexes.length) return null;
    const [first, ...rest] = indexes;
    return first === undefined ? null : [first, ...rest];
  }

  get #program() {
    return this.context.getProgram();
  }

  get #state() {
    return this.context.getState();
  }

  public parseTargetAnswer(
    answer: unknown,
  ): Readonly<Record<string, readonly GrandArchiveTargetId[]>> | null {
    if (typeof answer !== "object" || answer === null || Array.isArray(answer)) return null;
    const submitted: Record<string, readonly GrandArchiveTargetId[]> = {};
    const objects = Object.values(this.#state.objects);
    const stackItems = this.#state.stack;
    for (const [declarationId, values] of Object.entries(answer)) {
      if (!Array.isArray(values)) return null;
      const targetIds: GrandArchiveTargetId[] = [];
      for (const value of values) {
        if (typeof value !== "string") return null;
        const object = objects.find((candidate) => candidate.id === value);
        if (object) {
          targetIds.push(object.id);
          continue;
        }
        const stackItem = stackItems.find((candidate) => candidate.id === value);
        if (stackItem) {
          targetIds.push(stackItem.id);
          continue;
        }
        const player = Object.values(this.#state.players).find(
          (candidate) => candidate.id === value,
        );
        if (!player) return null;
        targetIds.push(player.id);
      }
      submitted[declarationId] = targetIds;
    }
    return submitted;
  }

  public parseEffectAttackAnswer(answer: unknown): GrandArchiveEffectAttackAnswer | null {
    if (typeof answer !== "object" || answer === null || Array.isArray(answer)) return null;
    const allowedKeys = new Set([
      "targetIds",
      "weaponIds",
      "cleavePlayerId",
      "delegatePlayerId",
      "effectCostPayment",
      "attackCostPayment",
    ]);
    if (Object.keys(answer).some((key) => !allowedKeys.has(key))) return null;
    if (!("targetIds" in answer) || !Array.isArray(answer.targetIds)) return null;
    const targetIds = this.parseKnownObjectIds(answer.targetIds);
    if (!targetIds) return null;
    const parsed: {
      targetIds: readonly GrandArchiveObjectId[];
      weaponIds?: readonly GrandArchiveObjectId[];
      cleavePlayerId?: GrandArchivePlayerId;
      delegatePlayerId?: GrandArchivePlayerId;
      effectCostPayment?: GrandArchiveCostPaymentSelection;
      attackCostPayment?: GrandArchiveCostPaymentSelection;
    } = { targetIds };
    if ("weaponIds" in answer) {
      if (!Array.isArray(answer.weaponIds)) return null;
      const weaponIds = this.parseKnownObjectIds(answer.weaponIds);
      if (!weaponIds) return null;
      parsed.weaponIds = weaponIds;
    }
    if ("cleavePlayerId" in answer) {
      const player = Object.values(this.#state.players).find(
        (candidate) => candidate.id === answer.cleavePlayerId,
      );
      if (!player) return null;
      parsed.cleavePlayerId = player.id;
    }
    if ("delegatePlayerId" in answer) {
      const player = Object.values(this.#state.players).find(
        (candidate) => candidate.id === answer.delegatePlayerId,
      );
      if (!player) return null;
      parsed.delegatePlayerId = player.id;
    }
    if ("effectCostPayment" in answer) {
      const payment = this.parseCostPaymentAnswer(answer.effectCostPayment);
      if (!payment) return null;
      parsed.effectCostPayment = payment;
    }
    if ("attackCostPayment" in answer) {
      const payment = this.parseCostPaymentAnswer(answer.attackCostPayment);
      if (!payment) return null;
      parsed.attackCostPayment = payment;
    }
    return parsed;
  }

  public parseKnownObjectIds(values: readonly unknown[]): readonly GrandArchiveObjectId[] | null {
    const objects = Object.values(this.#state.objects);
    const objectIds: GrandArchiveObjectId[] = [];
    for (const value of values) {
      if (typeof value !== "string") return null;
      const object = objects.find((candidate) => candidate.id === value);
      if (!object) return null;
      objectIds.push(object.id);
    }
    return objectIds;
  }

  public parsePaymentContributions(
    value: unknown,
  ): readonly GrandArchivePaymentContributionDeclaration[] | null {
    if (!Array.isArray(value)) return null;
    const declarations: GrandArchivePaymentContributionDeclaration[] = [];
    for (const entry of value) {
      if (typeof entry !== "object" || entry === null || Array.isArray(entry)) return null;
      const allowedKeys = new Set([
        "ruleId",
        "reservePayment",
        "costSelections",
        "costPaymentOrders",
        "costOptionIndex",
        "payOptionalCost",
        "paymentSourceIds",
      ]);
      if (Object.keys(entry).some((key) => !allowedKeys.has(key))) return null;
      if (!("ruleId" in entry) || typeof entry.ruleId !== "string") return null;
      let reservePayment: readonly GrandArchiveReservePaymentSource[] | undefined;
      if ("reservePayment" in entry) {
        if (!Array.isArray(entry.reservePayment)) return null;
        const payments: GrandArchiveReservePaymentSource[] = [];
        for (const source of entry.reservePayment) {
          if (typeof source !== "object" || source === null || Array.isArray(source)) return null;
          if (
            "kind" in source &&
            source.kind === "card" &&
            "cardId" in source &&
            Object.keys(source).length === 2
          ) {
            const ids = this.parseKnownObjectIds([source.cardId]);
            if (!ids) return null;
            payments.push({ kind: "card", cardId: ids[0]! });
          } else if (
            "kind" in source &&
            source.kind === "reservable" &&
            "objectId" in source &&
            Object.keys(source).length === 2
          ) {
            const ids = this.parseKnownObjectIds([source.objectId]);
            if (!ids) return null;
            payments.push({ kind: "reservable", objectId: ids[0]! });
          } else {
            return null;
          }
        }
        reservePayment = payments;
      }
      let costSelections: readonly (readonly GrandArchiveObjectId[])[] | undefined;
      if ("costSelections" in entry) {
        if (!Array.isArray(entry.costSelections)) return null;
        const selections: GrandArchiveObjectId[][] = [];
        for (const selection of entry.costSelections) {
          if (!Array.isArray(selection)) return null;
          const ids = this.parseKnownObjectIds(selection);
          if (!ids) return null;
          selections.push([...ids]);
        }
        costSelections = selections;
      }
      let paymentSourceIds: readonly GrandArchiveObjectId[] | undefined;
      let costPaymentOrders: readonly GrandArchiveCostPaymentOrder[] | undefined;
      if ("costPaymentOrders" in entry) {
        costPaymentOrders = this.parseCostPaymentOrders(entry.costPaymentOrders) ?? undefined;
        if (!costPaymentOrders) return null;
      }
      if ("paymentSourceIds" in entry) {
        if (!Array.isArray(entry.paymentSourceIds)) return null;
        paymentSourceIds = this.parseKnownObjectIds(entry.paymentSourceIds) ?? undefined;
        if (!paymentSourceIds) return null;
      }
      let costOptionIndex: number | undefined;
      if ("costOptionIndex" in entry) {
        if (
          typeof entry.costOptionIndex !== "number" ||
          !Number.isSafeInteger(entry.costOptionIndex) ||
          entry.costOptionIndex < 0
        ) {
          return null;
        }
        costOptionIndex = entry.costOptionIndex;
      }
      let payOptionalCost: boolean | undefined;
      if ("payOptionalCost" in entry) {
        if (typeof entry.payOptionalCost !== "boolean") return null;
        payOptionalCost = entry.payOptionalCost;
      }
      declarations.push({
        ruleId: entry.ruleId,
        ...(reservePayment ? { reservePayment } : {}),
        ...(costSelections ? { costSelections } : {}),
        ...(costPaymentOrders ? { costPaymentOrders } : {}),
        ...(costOptionIndex !== undefined ? { costOptionIndex } : {}),
        ...(payOptionalCost !== undefined ? { payOptionalCost } : {}),
        ...(paymentSourceIds ? { paymentSourceIds } : {}),
      });
    }
    return declarations;
  }

  public parseCostPaymentAnswer(answer: unknown): GrandArchiveCostPaymentSelection | null {
    if (typeof answer !== "object" || answer === null || Array.isArray(answer)) return null;
    const allowedKeys = new Set([
      "reservePayment",
      "costSelections",
      "costPaymentOrders",
      "costOptionIndex",
      "payOptionalCost",
    ]);
    if (Object.keys(answer).some((key) => !allowedKeys.has(key))) return null;
    const parsed = this.parseEffectActivationAnswer(answer);
    if (!parsed) return null;
    return {
      ...(parsed.reservePayment ? { reservePayment: parsed.reservePayment } : {}),
      ...(parsed.costSelections ? { costSelections: parsed.costSelections } : {}),
      ...(parsed.costPaymentOrders ? { costPaymentOrders: parsed.costPaymentOrders } : {}),
      ...(parsed.costOptionIndex !== undefined ? { costOptionIndex: parsed.costOptionIndex } : {}),
      ...(parsed.payOptionalCost !== undefined ? { payOptionalCost: parsed.payOptionalCost } : {}),
    };
  }

  public parseEffectMaterializationAnswer(
    answer: unknown,
  ): GrandArchiveEffectMaterializationAnswer | null {
    if (typeof answer !== "object" || answer === null || Array.isArray(answer)) return null;
    const allowedKeys = new Set([
      "modeIds",
      "targets",
      "reservePayment",
      "floatingMemoryCardIds",
      "paymentContributions",
      "costSelections",
      "costPaymentOrders",
      "costOptionIndex",
      "payOptionalCost",
      "variables",
    ]);
    if (Object.keys(answer).some((key) => !allowedKeys.has(key))) return null;
    const parsed: {
      modeIds?: readonly string[];
      targets?: Readonly<Record<string, readonly GrandArchiveTargetId[]>>;
      reservePayment?: readonly GrandArchiveReservePaymentSource[];
      floatingMemoryCardIds?: readonly GrandArchiveObjectId[];
      paymentContributions?: readonly GrandArchivePaymentContributionDeclaration[];
      costSelections?: readonly (readonly GrandArchiveObjectId[])[];
      costPaymentOrders?: readonly GrandArchiveCostPaymentOrder[];
      costOptionIndex?: number;
      payOptionalCost?: boolean;
      variables?: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
    } = {};
    if ("modeIds" in answer) {
      if (!Array.isArray(answer.modeIds) || answer.modeIds.some((id) => typeof id !== "string")) {
        return null;
      }
      parsed.modeIds = answer.modeIds;
    }
    if ("targets" in answer) {
      const targets = this.parseTargetAnswer(answer.targets);
      if (!targets) return null;
      parsed.targets = targets;
    }
    if ("reservePayment" in answer) {
      if (!Array.isArray(answer.reservePayment)) return null;
      const payments: GrandArchiveReservePaymentSource[] = [];
      for (const value of answer.reservePayment) {
        if (
          typeof value !== "object" ||
          value === null ||
          Array.isArray(value) ||
          !("kind" in value)
        ) {
          return null;
        }
        if (value.kind === "card" && "cardId" in value && Object.keys(value).length === 2) {
          const ids = this.parseKnownObjectIds([value.cardId]);
          if (!ids) return null;
          payments.push({ kind: "card", cardId: ids[0]! });
        } else if (
          value.kind === "reservable" &&
          "objectId" in value &&
          Object.keys(value).length === 2
        ) {
          const ids = this.parseKnownObjectIds([value.objectId]);
          if (!ids) return null;
          payments.push({ kind: "reservable", objectId: ids[0]! });
        } else {
          return null;
        }
      }
      parsed.reservePayment = payments;
    }
    if ("floatingMemoryCardIds" in answer) {
      if (!Array.isArray(answer.floatingMemoryCardIds)) return null;
      const ids = this.parseKnownObjectIds(answer.floatingMemoryCardIds);
      if (!ids) return null;
      parsed.floatingMemoryCardIds = ids;
    }
    if ("paymentContributions" in answer) {
      const declarations = this.parsePaymentContributions(answer.paymentContributions);
      if (!declarations) return null;
      parsed.paymentContributions = declarations;
    }
    if ("costSelections" in answer) {
      if (!Array.isArray(answer.costSelections)) return null;
      const selections: GrandArchiveObjectId[][] = [];
      for (const values of answer.costSelections) {
        if (!Array.isArray(values)) return null;
        const ids = this.parseKnownObjectIds(values);
        if (!ids) return null;
        selections.push([...ids]);
      }
      parsed.costSelections = selections;
    }
    if ("costPaymentOrders" in answer) {
      const declarations = this.parseCostPaymentOrders(answer.costPaymentOrders);
      if (!declarations) return null;
      parsed.costPaymentOrders = declarations;
    }
    if ("costOptionIndex" in answer) {
      if (
        typeof answer.costOptionIndex !== "number" ||
        !Number.isSafeInteger(answer.costOptionIndex) ||
        answer.costOptionIndex < 0
      ) {
        return null;
      }
      parsed.costOptionIndex = answer.costOptionIndex;
    }
    if ("payOptionalCost" in answer) {
      if (typeof answer.payOptionalCost !== "boolean") return null;
      parsed.payOptionalCost = answer.payOptionalCost;
    }
    if ("variables" in answer) {
      if (
        typeof answer.variables !== "object" ||
        answer.variables === null ||
        Array.isArray(answer.variables)
      ) {
        return null;
      }
      const variables: Partial<Record<"X" | "Y" | "Z", number>> = {};
      for (const [symbol, amount] of Object.entries(answer.variables)) {
        if (
          (symbol !== "X" && symbol !== "Y" && symbol !== "Z") ||
          typeof amount !== "number" ||
          !Number.isSafeInteger(amount)
        ) {
          return null;
        }
        variables[symbol] = amount;
      }
      parsed.variables = variables;
    }
    return parsed;
  }

  public parseEffectActivationAnswer(answer: unknown): GrandArchiveEffectActivationAnswer | null {
    if (typeof answer !== "object" || answer === null || Array.isArray(answer)) return null;
    const allowedKeys = new Set([
      "attackAttackerId",
      "modeIds",
      "targets",
      "reservePayment",
      "revealForImbue",
      "kindleCardIds",
      "floatingMemoryCardIds",
      "paymentContributions",
      "costSelections",
      "costPaymentOrders",
      "costOptionIndex",
      "payOptionalCost",
      "prepareAbilityIndexes",
      "variables",
    ]);
    if (Object.keys(answer).some((key) => !allowedKeys.has(key))) return null;
    const parsed: {
      attackAttackerId?: GrandArchiveObjectId;
      modeIds?: readonly string[];
      targets?: Readonly<Record<string, readonly GrandArchiveTargetId[]>>;
      reservePayment?: readonly GrandArchiveReservePaymentSource[];
      revealForImbue?: boolean;
      kindleCardIds?: readonly GrandArchiveObjectId[];
      floatingMemoryCardIds?: readonly GrandArchiveObjectId[];
      paymentContributions?: readonly GrandArchivePaymentContributionDeclaration[];
      costSelections?: readonly (readonly GrandArchiveObjectId[])[];
      costPaymentOrders?: readonly GrandArchiveCostPaymentOrder[];
      costOptionIndex?: number;
      payOptionalCost?: boolean;
      prepareAbilityIndexes?: GrandArchivePrepareAbilityIndexes;
      variables?: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
    } = {};
    if ("attackAttackerId" in answer) {
      const ids = this.parseKnownObjectIds([answer.attackAttackerId]);
      if (!ids) return null;
      parsed.attackAttackerId = ids[0]!;
    }
    if ("modeIds" in answer) {
      if (!Array.isArray(answer.modeIds) || answer.modeIds.some((id) => typeof id !== "string")) {
        return null;
      }
      parsed.modeIds = answer.modeIds;
    }
    if ("targets" in answer) {
      const targets = this.parseTargetAnswer(answer.targets);
      if (!targets) return null;
      parsed.targets = targets;
    }
    if ("reservePayment" in answer) {
      if (!Array.isArray(answer.reservePayment)) return null;
      const payments: GrandArchiveReservePaymentSource[] = [];
      for (const value of answer.reservePayment) {
        if (
          typeof value !== "object" ||
          value === null ||
          Array.isArray(value) ||
          !("kind" in value)
        ) {
          return null;
        }
        if (value.kind === "card" && "cardId" in value && Object.keys(value).length === 2) {
          const ids = this.parseKnownObjectIds([value.cardId]);
          if (!ids) return null;
          payments.push({ kind: "card", cardId: ids[0]! });
        } else if (
          value.kind === "reservable" &&
          "objectId" in value &&
          Object.keys(value).length === 2
        ) {
          const ids = this.parseKnownObjectIds([value.objectId]);
          if (!ids) return null;
          payments.push({ kind: "reservable", objectId: ids[0]! });
        } else {
          return null;
        }
      }
      parsed.reservePayment = payments;
    }
    if ("revealForImbue" in answer) {
      if (typeof answer.revealForImbue !== "boolean") return null;
      parsed.revealForImbue = answer.revealForImbue;
    }
    if ("kindleCardIds" in answer) {
      if (!Array.isArray(answer.kindleCardIds)) return null;
      const ids = this.parseKnownObjectIds(answer.kindleCardIds);
      if (!ids) return null;
      parsed.kindleCardIds = ids;
    }
    if ("floatingMemoryCardIds" in answer) {
      if (!Array.isArray(answer.floatingMemoryCardIds)) return null;
      const ids = this.parseKnownObjectIds(answer.floatingMemoryCardIds);
      if (!ids) return null;
      parsed.floatingMemoryCardIds = ids;
    }
    if ("paymentContributions" in answer) {
      const declarations = this.parsePaymentContributions(answer.paymentContributions);
      if (!declarations) return null;
      parsed.paymentContributions = declarations;
    }
    if ("costSelections" in answer) {
      if (!Array.isArray(answer.costSelections)) return null;
      const selections: GrandArchiveObjectId[][] = [];
      for (const values of answer.costSelections) {
        if (!Array.isArray(values)) return null;
        const ids = this.parseKnownObjectIds(values);
        if (!ids) return null;
        selections.push([...ids]);
      }
      parsed.costSelections = selections;
    }
    if ("costPaymentOrders" in answer) {
      const declarations = this.parseCostPaymentOrders(answer.costPaymentOrders);
      if (!declarations) return null;
      parsed.costPaymentOrders = declarations;
    }
    if ("costOptionIndex" in answer) {
      if (
        typeof answer.costOptionIndex !== "number" ||
        !Number.isSafeInteger(answer.costOptionIndex) ||
        answer.costOptionIndex < 0
      ) {
        return null;
      }
      parsed.costOptionIndex = answer.costOptionIndex;
    }
    if ("payOptionalCost" in answer) {
      if (typeof answer.payOptionalCost !== "boolean") return null;
      parsed.payOptionalCost = answer.payOptionalCost;
    }
    if ("prepareAbilityIndexes" in answer) {
      const indexes = this.parsePrepareAbilityIndexes(answer.prepareAbilityIndexes);
      if (!indexes) return null;
      parsed.prepareAbilityIndexes = indexes;
    }
    if ("variables" in answer) {
      if (
        typeof answer.variables !== "object" ||
        answer.variables === null ||
        Array.isArray(answer.variables)
      ) {
        return null;
      }
      const variables: Partial<Record<"X" | "Y" | "Z", number>> = {};
      for (const [symbol, amount] of Object.entries(answer.variables)) {
        if (
          (symbol !== "X" && symbol !== "Y" && symbol !== "Z") ||
          typeof amount !== "number" ||
          !Number.isSafeInteger(amount)
        ) {
          return null;
        }
        variables[symbol] = amount;
      }
      parsed.variables = variables;
    }
    return parsed;
  }

  public parseAethercallingLoads(value: unknown): readonly GrandArchiveAethercallingLoad[] | null {
    if (value === undefined) return [];
    if (!Array.isArray(value)) return null;
    const loads: GrandArchiveAethercallingLoad[] = [];
    for (const entry of value) {
      if (
        typeof entry !== "object" ||
        entry === null ||
        Array.isArray(entry) ||
        Object.keys(entry).some((key) => key !== "cardId" && key !== "weaponId") ||
        !("cardId" in entry) ||
        !("weaponId" in entry)
      ) {
        return null;
      }
      const cardIds = this.parseKnownObjectIds([entry.cardId]);
      const weaponIds = this.parseKnownObjectIds([entry.weaponId]);
      if (!cardIds || !weaponIds) return null;
      loads.push({ cardId: cardIds[0]!, weaponId: weaponIds[0]! });
    }
    return loads;
  }

  public proposeAethercallingLoadEvents(
    loads: readonly GrandArchiveAethercallingLoad[],
    glimpsedCardIds: readonly GrandArchiveObjectId[],
    playerId: GrandArchivePlayerId,
  ): readonly GrandArchiveProposedEvent[] {
    if (new Set(loads.map((load) => load.cardId)).size !== loads.length) {
      throw new Error("A glimpsed card cannot be loaded more than once");
    }
    return loads.map((load) => {
      const card = this.#state.objects[load.cardId];
      const weapon = this.#state.objects[load.weaponId];
      if (
        !card ||
        card.zone !== "main-deck" ||
        card.ownerId !== playerId ||
        !glimpsedCardIds.includes(card.id)
      ) {
        throw new Error("Aethercalling can only load a card in the current Glimpse");
      }
      const grantedAethercalling = grandArchiveGrantedKeywordsForAction(
        this.#program,
        this.#state,
        playerId,
        "glimpse",
        card.id,
      ).some((keyword) => keyword.name === "aethercalling");
      if (
        !grandArchiveObjectHasActiveKeyword(this.#program, this.#state, card, "aethercalling") &&
        !grantedAethercalling
      ) {
        throw new Error("The glimpsed card does not have Aethercalling");
      }
      if (!weapon || weapon.zone !== "field" || weapon.controllerId !== playerId) {
        throw new Error("Aethercalling requires an Aetherwing weapon you control");
      }
      const weaponCharacteristics = grandArchiveObjectCurrentCharacteristics(
        this.#program,
        this.#state,
        weapon,
      );
      if (
        !weaponCharacteristics.types.includes("WEAPON") ||
        (!weaponCharacteristics.subtypes.includes("AETHERWING") &&
          !grandArchiveObjectHasActiveKeyword(this.#program, this.#state, weapon, "aetherwing"))
      ) {
        throw new Error("Aethercalling requires an Aetherwing weapon you control");
      }
      return {
        type: "object-moved" as const,
        objectId: card.id,
        from: "main-deck" as const,
        to: "loaded" as const,
        hostId: weapon.id,
        actorId: playerId,
        gameActionKind: "special-game-action" as const,
        cause: { kind: "rule" as const, rule: "aethercalling-special-game-action" },
      };
    });
  }

  public parseStarcallingAnswer(answer: object): GrandArchiveStarcallingAnswer | null {
    const allowedKeys = new Set([
      "kind",
      "cardId",
      "loads",
      "bottom",
      "modeIds",
      "targets",
      "reservePayment",
      "revealForImbue",
      "kindleCardIds",
      "paymentContributions",
      "costSelections",
      "costPaymentOrders",
      "costOptionIndex",
      "payOptionalCost",
      "prepareAbilityIndexes",
      "variables",
    ]);
    if (Object.keys(answer).some((key) => !allowedKeys.has(key))) return null;
    if (!("cardId" in answer) || !("bottom" in answer)) return null;
    const selectedIds = this.parseKnownObjectIds([answer.cardId]);
    const bottom = Array.isArray(answer.bottom) ? this.parseKnownObjectIds(answer.bottom) : null;
    if (!selectedIds || !bottom) return null;
    const loads = this.parseAethercallingLoads("loads" in answer ? answer.loads : undefined);
    if (!loads) return null;

    let modeIds: readonly string[] | undefined;
    if ("modeIds" in answer) {
      if (!Array.isArray(answer.modeIds) || answer.modeIds.some((id) => typeof id !== "string")) {
        return null;
      }
      modeIds = answer.modeIds;
    }
    let targets: Readonly<Record<string, readonly GrandArchiveTargetId[]>> | undefined;
    if ("targets" in answer) {
      targets = this.parseTargetAnswer(answer.targets) ?? undefined;
      if (!targets) return null;
    }
    let reservePayment: readonly GrandArchiveReservePaymentSource[] | undefined;
    if ("reservePayment" in answer) {
      if (!Array.isArray(answer.reservePayment)) return null;
      const payments: GrandArchiveReservePaymentSource[] = [];
      for (const value of answer.reservePayment) {
        if (
          typeof value !== "object" ||
          value === null ||
          Array.isArray(value) ||
          !("kind" in value)
        ) {
          return null;
        }
        if (value.kind === "card" && "cardId" in value && Object.keys(value).length === 2) {
          const ids = this.parseKnownObjectIds([value.cardId]);
          if (!ids) return null;
          payments.push({ kind: "card", cardId: ids[0]! });
        } else if (
          value.kind === "reservable" &&
          "objectId" in value &&
          Object.keys(value).length === 2
        ) {
          const ids = this.parseKnownObjectIds([value.objectId]);
          if (!ids) return null;
          payments.push({ kind: "reservable", objectId: ids[0]! });
        } else {
          return null;
        }
      }
      reservePayment = payments;
    }
    const revealForImbue = "revealForImbue" in answer ? answer.revealForImbue : undefined;
    if (revealForImbue !== undefined && typeof revealForImbue !== "boolean") return null;
    let costSelections: readonly (readonly GrandArchiveObjectId[])[] | undefined;
    let costPaymentOrders: readonly GrandArchiveCostPaymentOrder[] | undefined;
    let kindleCardIds: readonly GrandArchiveObjectId[] | undefined;
    let paymentContributions: readonly GrandArchivePaymentContributionDeclaration[] | undefined;
    if ("kindleCardIds" in answer) {
      if (!Array.isArray(answer.kindleCardIds)) return null;
      kindleCardIds = this.parseKnownObjectIds(answer.kindleCardIds) ?? undefined;
      if (!kindleCardIds) return null;
    }
    if ("paymentContributions" in answer) {
      paymentContributions =
        this.parsePaymentContributions(answer.paymentContributions) ?? undefined;
      if (!paymentContributions) return null;
    }
    if ("costSelections" in answer) {
      if (!Array.isArray(answer.costSelections)) return null;
      const selections: GrandArchiveObjectId[][] = [];
      for (const values of answer.costSelections) {
        if (!Array.isArray(values)) return null;
        const ids = this.parseKnownObjectIds(values);
        if (!ids) return null;
        selections.push([...ids]);
      }
      costSelections = selections;
    }
    if ("costPaymentOrders" in answer) {
      costPaymentOrders = this.parseCostPaymentOrders(answer.costPaymentOrders) ?? undefined;
      if (!costPaymentOrders) return null;
    }
    let variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>> | undefined;
    if ("variables" in answer) {
      if (
        typeof answer.variables !== "object" ||
        answer.variables === null ||
        Array.isArray(answer.variables)
      ) {
        return null;
      }
      const parsed: Partial<Record<"X" | "Y" | "Z", number>> = {};
      for (const [symbol, amount] of Object.entries(answer.variables)) {
        if (
          (symbol !== "X" && symbol !== "Y" && symbol !== "Z") ||
          typeof amount !== "number" ||
          !Number.isSafeInteger(amount)
        ) {
          return null;
        }
        parsed[symbol] = amount;
      }
      variables = parsed;
    }
    const costOptionIndex = "costOptionIndex" in answer ? answer.costOptionIndex : undefined;
    if (
      costOptionIndex !== undefined &&
      (typeof costOptionIndex !== "number" ||
        !Number.isSafeInteger(costOptionIndex) ||
        costOptionIndex < 0)
    ) {
      return null;
    }
    const payOptionalCost = "payOptionalCost" in answer ? answer.payOptionalCost : undefined;
    if (payOptionalCost !== undefined && typeof payOptionalCost !== "boolean") return null;
    const prepareAbilityIndexes =
      "prepareAbilityIndexes" in answer
        ? this.parsePrepareAbilityIndexes(answer.prepareAbilityIndexes)
        : undefined;
    if (prepareAbilityIndexes === null) return null;
    return {
      kind: "starcall",
      cardId: selectedIds[0]!,
      ...(loads.length > 0 ? { loads } : {}),
      bottom,
      ...(modeIds ? { modeIds } : {}),
      ...(targets ? { targets } : {}),
      ...(reservePayment ? { reservePayment } : {}),
      ...(revealForImbue !== undefined ? { revealForImbue } : {}),
      ...(kindleCardIds ? { kindleCardIds } : {}),
      ...(paymentContributions ? { paymentContributions } : {}),
      ...(costSelections ? { costSelections } : {}),
      ...(costPaymentOrders ? { costPaymentOrders } : {}),
      ...(costOptionIndex !== undefined ? { costOptionIndex } : {}),
      ...(payOptionalCost !== undefined ? { payOptionalCost } : {}),
      ...(prepareAbilityIndexes ? { prepareAbilityIndexes } : {}),
      ...(variables ? { variables } : {}),
    };
  }

  public parseTriggerAnnouncement(answer: unknown): GrandArchiveParsedTriggerAnnouncement | null {
    if (typeof answer !== "object" || answer === null || Array.isArray(answer)) return null;
    let modeIds: readonly string[] | undefined;
    let targets: Readonly<Record<string, readonly GrandArchiveTargetId[]>> | undefined;
    let variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>> | undefined;
    for (const [key, value] of Object.entries(answer)) {
      if (key === "modeIds") {
        if (!Array.isArray(value) || value.some((modeId) => typeof modeId !== "string")) {
          return null;
        }
        modeIds = value;
        continue;
      }
      if (key === "targets") {
        targets = this.parseTargetAnswer(value) ?? undefined;
        if (!targets) return null;
        continue;
      }
      if (key === "variables") {
        if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
        const parsed: Partial<Record<"X" | "Y" | "Z", number>> = {};
        for (const [symbol, amount] of Object.entries(value)) {
          if (
            (symbol !== "X" && symbol !== "Y" && symbol !== "Z") ||
            typeof amount !== "number" ||
            !Number.isSafeInteger(amount)
          ) {
            return null;
          }
          parsed[symbol] = amount;
        }
        variables = parsed;
        continue;
      }
      return null;
    }
    return {
      ...(modeIds ? { modeIds } : {}),
      ...(targets ? { targets } : {}),
      ...(variables ? { variables } : {}),
    };
  }
}
