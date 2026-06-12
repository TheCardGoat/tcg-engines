import type { CardInstanceId, PlayerId, RuntimeValidationResult } from "#core";
import type { KeywordAbilityDefinition, LorcanaCardDefinition } from "@tcg/lorcana-types";
import { isShiftKeywordAbility, isValueKeywordAbility } from "@tcg/lorcana-types";
import type { LorcanaCardMeta } from "../../types";
import { cardHasName, hasMimicry } from "../../card-utils";
import { getActiveStatModifierTotal } from "../effects/continuous-effects";
import {
  evaluateStaticCondition,
  getStaticPropertyModifierTotal,
  matchesStaticAbilityTarget,
} from "./static-ability-utils";
import type { StaticEffectRegistry } from "../../rules/static-effect-registry";

const INKWELL_ZONE_PREFIX = "inkwell:";
const SHIFT_LABEL_PATTERN = /\b(?:([A-Za-z][A-Za-z' -]+)\s+)?Shift\s+(\d+)\b/i;
const SING_TOGETHER_PATTERN = /\bSing Together\s+(\d+)\b/i;

export const UNSUPPORTED_SHIFT_COST_TODO =
  "TODO: Non-ink Shift costs are not supported in playCard yet";

export type ShiftTargetMode =
  | { type: "universal" }
  | { type: "classification"; classification: string }
  | { type: "name"; name: string };

export interface ShiftDiscardCost {
  discardCards: number;
  discardCardType?: string;
}

export interface ShiftRules {
  inkCost?: number;
  discardCost?: ShiftDiscardCost;
  rawLabel?: string;
  targetMode: ShiftTargetMode;
  unsupportedReason?: string;
}

type BasicCostValidationContext = {
  framework: {
    state: object;
    zones: {
      getCards: (zone: { zone: string; playerId: string }) => string[];
    };
    cards: {
      require: (cardId: string) => { meta?: LorcanaCardMeta };
    };
  };
  cards: {
    require: (cardId: string) => { meta?: LorcanaCardMeta };
  };
  playerId: PlayerId;
};

type BasicCostWriteContext = BasicCostValidationContext & {
  cards: BasicCostValidationContext["cards"] & {
    patchMeta: (cardId: string, patch: Partial<LorcanaCardMeta>) => void;
  };
};

function normalizeWord(value: string): string {
  return value.trim().toLowerCase();
}

function sameWord(left: string, right: string): boolean {
  return normalizeWord(left) === normalizeWord(right);
}

function resolveShiftTargetNames(name: string): string[] {
  return name
    .split(/\s+(?:or|and)\s+/i)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function extractTextParts(cardDef: LorcanaCardDefinition | undefined): string[] {
  if (!cardDef) {
    return [];
  }

  const values: string[] = [];

  if (typeof cardDef.text === "string") {
    values.push(cardDef.text);
  } else if (Array.isArray(cardDef.text)) {
    for (const entry of cardDef.text) {
      if (entry?.title) values.push(entry.title);
      if (entry?.description) values.push(entry.description);
    }
  }

  if (Array.isArray(cardDef.abilities)) {
    for (const ability of cardDef.abilities) {
      if (typeof ability.text === "string" && ability.text.trim().length > 0) {
        values.push(ability.text);
      }
    }
  }

  return values;
}

function extractShiftTextParts(
  cardDef: LorcanaCardDefinition | undefined,
  shiftKeyword?: KeywordAbilityDefinition,
  shiftLabel?: string,
): string[] {
  if (!cardDef) {
    return [];
  }

  const values: string[] = [];

  if (typeof shiftKeyword?.text === "string" && shiftKeyword.text.trim().length > 0) {
    values.push(shiftKeyword.text);
  }

  if (typeof shiftLabel === "string" && shiftLabel.trim().length > 0) {
    values.push(shiftLabel);
  }

  if (typeof cardDef.text === "string" && cardDef.text.trim().length > 0) {
    values.push(cardDef.text);
  } else if (Array.isArray(cardDef.text)) {
    for (const entry of cardDef.text) {
      const title = typeof entry?.title === "string" ? entry.title.trim() : "";
      const description = typeof entry?.description === "string" ? entry.description.trim() : "";
      const isShiftEntry =
        /shift/i.test(title) ||
        /shift/i.test(description) ||
        /on top of/i.test(description) ||
        /universal shift/i.test(title) ||
        /universal shift/i.test(description);

      if (!isShiftEntry) {
        continue;
      }

      if (title) {
        values.push(title);
      }

      if (description) {
        values.push(description);
      }

      if (title && description) {
        values.push(`${title} ${description}`);
      }
    }
  }

  return values;
}

function getShiftKeyword(
  cardDef: LorcanaCardDefinition | undefined,
): KeywordAbilityDefinition | undefined {
  if (!cardDef || !Array.isArray(cardDef.abilities)) {
    return undefined;
  }

  return cardDef.abilities.find(
    (ability): ability is KeywordAbilityDefinition =>
      ability.type === "keyword" && ability.keyword === "Shift",
  );
}

function inferShiftLabel(
  cardDef: LorcanaCardDefinition | undefined,
  shiftKeyword?: KeywordAbilityDefinition,
): string | undefined {
  if (shiftKeyword?.text && /Shift/i.test(shiftKeyword.text)) {
    return shiftKeyword.text;
  }

  for (const text of extractTextParts(cardDef)) {
    if (SHIFT_LABEL_PATTERN.test(text)) {
      return text;
    }
  }

  return undefined;
}

function parseShiftModeFromLabel(label: string | undefined): ShiftTargetMode | undefined {
  if (!label) {
    return undefined;
  }

  const match = label.match(SHIFT_LABEL_PATTERN);
  if (!match) {
    return undefined;
  }

  const prefix = match[1]?.trim();
  if (!prefix) {
    return undefined;
  }

  if (sameWord(prefix, "Universal")) {
    return { type: "universal" };
  }

  return {
    type: "classification",
    classification: prefix,
  };
}

function parseShiftNameTargetFromText(
  cardDef: LorcanaCardDefinition | undefined,
  shiftKeyword?: KeywordAbilityDefinition,
  shiftLabel?: string,
): string | undefined {
  const patterns = [
    /on top of (?:one of )?your characters named ([^)]+)/i,
    /on top of a character named ([^)]+)/i,
  ];

  for (const text of extractShiftTextParts(cardDef, shiftKeyword, shiftLabel)) {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match?.[1]) {
        // Strip trailing sentence-ending period (e.g. "Mr. Incredible." → "Mr. Incredible")
        return match[1].replace(/\.\s*$/, "").trim();
      }
    }
  }

  return undefined;
}

function parseShiftClassificationFromText(
  cardDef: LorcanaCardDefinition | undefined,
  shiftKeyword?: KeywordAbilityDefinition,
  shiftLabel?: string,
): string | undefined {
  const classificationPattern = /on top of (?:one of )?your ([A-Za-z][A-Za-z' -]+?) characters/i;

  for (const text of extractShiftTextParts(cardDef, shiftKeyword, shiftLabel)) {
    const match = text.match(classificationPattern);
    if (match?.[1] && !sameWord(match[1], "any")) {
      return match[1].trim();
    }
  }

  return undefined;
}

function parseUniversalShiftFromText(
  cardDef: LorcanaCardDefinition | undefined,
  shiftKeyword?: KeywordAbilityDefinition,
  shiftLabel?: string,
): boolean {
  const universalPatterns = [
    /Universal Shift/i,
    /on top of any one of your characters/i,
    /on top of any of your characters/i,
  ];

  return extractShiftTextParts(cardDef, shiftKeyword, shiftLabel).some((text) =>
    universalPatterns.some((pattern) => pattern.test(text)),
  );
}

function parseShiftCostFromLabel(label: string | undefined): number | undefined {
  if (!label) {
    return undefined;
  }

  const match = label.match(SHIFT_LABEL_PATTERN);
  if (!match?.[2]) {
    return undefined;
  }

  return Number.parseInt(match[2], 10);
}

function resolveShiftCostSupport(
  shiftKeyword: KeywordAbilityDefinition | undefined,
  fallbackLabel: string | undefined,
): {
  inkCost?: number;
  discardCost?: ShiftDiscardCost;
  unsupportedReason?: string;
} {
  if (shiftKeyword && isShiftKeywordAbility(shiftKeyword)) {
    const cost = shiftKeyword.cost;

    // Check for discard-based shift cost (e.g., "Shift: Discard a location card")
    if (typeof cost.discardCards === "number" && cost.discardCards > 0) {
      return {
        discardCost: {
          discardCards: cost.discardCards,
          discardCardType: cost.discardCardType as string | undefined,
        },
      };
    }

    const nonInkCostKeys = Object.keys(cost).filter(
      (key) => key !== "ink" && cost[key as keyof typeof cost] !== undefined,
    );

    if (nonInkCostKeys.length > 0) {
      return { unsupportedReason: UNSUPPORTED_SHIFT_COST_TODO };
    }

    if (typeof cost.ink === "number") {
      return { inkCost: cost.ink };
    }
  }

  return { inkCost: parseShiftCostFromLabel(fallbackLabel) };
}

function resolveShiftTargetMode(
  cardDef: LorcanaCardDefinition,
  shiftKeyword: KeywordAbilityDefinition | undefined,
  shiftLabel: string | undefined,
): ShiftTargetMode {
  // Explicit shiftTarget from keyword data takes priority over text parsing.
  // Text-based parsing can produce false positives (e.g., "gains Shift 0"
  // misinterpreted as classification "gains"), so structured data wins.
  if (
    shiftKeyword &&
    isShiftKeywordAbility(shiftKeyword) &&
    typeof shiftKeyword.shiftTarget === "string" &&
    shiftKeyword.shiftTarget.trim().length > 0
  ) {
    return { type: "name", name: shiftKeyword.shiftTarget.trim() };
  }

  const fromLabel = parseShiftModeFromLabel(shiftLabel);
  if (fromLabel) {
    return fromLabel;
  }

  if (parseUniversalShiftFromText(cardDef, shiftKeyword, shiftLabel)) {
    return { type: "universal" };
  }

  const classificationFromText = parseShiftClassificationFromText(
    cardDef,
    shiftKeyword,
    shiftLabel,
  );
  if (classificationFromText) {
    return { type: "classification", classification: classificationFromText };
  }

  const explicitName = parseShiftNameTargetFromText(cardDef, shiftKeyword, shiftLabel);
  if (explicitName) {
    return { type: "name", name: explicitName };
  }

  return { type: "name", name: cardDef.name };
}

function getCharacterCost(cardDef: LorcanaCardDefinition | undefined): number {
  return cardDef?.cardType === "character" ? cardDef.cost : 0;
}

function getKeywordSingerThreshold(cardDef: LorcanaCardDefinition | undefined): number | undefined {
  if (!cardDef || !Array.isArray(cardDef.abilities)) {
    return undefined;
  }

  for (const ability of cardDef.abilities) {
    if (
      ability.type === "keyword" &&
      ability.keyword === "Singer" &&
      isValueKeywordAbility(ability)
    ) {
      return ability.value;
    }
  }

  return undefined;
}

function getKeywordSingTogetherThreshold(
  cardDef: LorcanaCardDefinition | undefined,
): number | undefined {
  if (!cardDef || !Array.isArray(cardDef.abilities)) {
    return undefined;
  }

  for (const ability of cardDef.abilities) {
    if (
      ability.type === "keyword" &&
      ability.keyword === "SingTogether" &&
      isValueKeywordAbility(ability)
    ) {
      return ability.value;
    }
  }

  return undefined;
}

function parseTextSingTogetherThreshold(
  cardDef: LorcanaCardDefinition | undefined,
): number | undefined {
  for (const text of extractTextParts(cardDef)) {
    const match = text.match(SING_TOGETHER_PATTERN);
    if (match?.[1]) {
      return Number.parseInt(match[1], 10);
    }
  }

  return undefined;
}

export function getInkwellZoneId(playerId: PlayerId): string {
  return `${INKWELL_ZONE_PREFIX}${playerId}`;
}

/** Available ink = ready cards in the current player's inkwell. */
export function getAvailableInk(
  state: {
    framework: {
      zones: {
        getCards: (zone: { zone: string; playerId: string }) => string[];
      };
      cards: {
        require: (cardId: string) => { meta?: LorcanaCardMeta };
      };
    };
  },
  playerId: PlayerId,
): number {
  const cards = state.framework.zones.getCards({
    zone: "inkwell",
    playerId,
  }) as string[];
  return cards.filter((id) => state.framework.cards.require(id).meta?.state !== "exerted").length;
}

/** Exert ready inkwell cards in zone order to pay ink costs. */
export function spendInk(
  ctx: BasicCostWriteContext,
  playerId: PlayerId,
  amount: number,
): CardInstanceId[] {
  const cards = ctx.framework.zones.getCards({
    zone: "inkwell",
    playerId,
  }) as string[];
  const paidWith: CardInstanceId[] = [];

  for (const cardId of cards) {
    if (paidWith.length >= amount) {
      break;
    }
    if (ctx.cards.require(cardId).meta?.state === "exerted") {
      continue;
    }
    ctx.cards.patchMeta(cardId, { state: "exerted" });
    paidWith.push(cardId as CardInstanceId);
  }

  return paidWith;
}

export function isSongCard(cardDef: LorcanaCardDefinition | undefined): boolean {
  return cardDef?.cardType === "action" && cardDef.actionSubtype === "song";
}

/** Singer threshold = Singer X when present, otherwise character's printed cost. */
export function getSingerThreshold(cardDef: LorcanaCardDefinition | undefined): number | null {
  if (!cardDef || cardDef.cardType !== "character") {
    return null;
  }

  return getKeywordSingerThreshold(cardDef) ?? getCharacterCost(cardDef);
}

export function getSingerThresholdForInstance(args: {
  framework: BasicCostValidationContext["framework"];
  singerId: CardInstanceId;
  singerDef: LorcanaCardDefinition | undefined;
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
  G?: { continuousEffects?: unknown };
  registry?: StaticEffectRegistry;
}): number | null {
  const { framework, singerId, singerDef, getDefinitionByInstanceId, G, registry } = args;
  const baseThreshold = getSingerThreshold(singerDef);
  if (baseThreshold == null) {
    return null;
  }
  const keywordSingerValue = getKeywordSingerThreshold(singerDef) ?? 0;
  const printedCost = getCharacterCost(singerDef);

  const rawState = framework.state as {
    priority?: unknown;
    status?: unknown;
    _zonesPrivate?: {
      cardIndex?: Record<string, { zoneKey?: string; controllerID?: PlayerId }>;
    };
  };
  const state = {
    priority: rawState.priority,
    status: rawState.status,
    _zonesPrivate: rawState._zonesPrivate,
    G,
  } as Parameters<typeof evaluateStaticCondition>[0]["state"];

  let grantedSingerThreshold = 0;
  for (const [cardId, entry] of Object.entries(rawState._zonesPrivate?.cardIndex ?? {}) as Array<
    [CardInstanceId, { zoneKey?: string; controllerID?: PlayerId }]
  >) {
    if (typeof entry.zoneKey !== "string" || !entry.zoneKey.startsWith("play")) {
      continue;
    }

    const definition = getDefinitionByInstanceId(cardId);
    if (!definition) {
      continue;
    }

    for (const ability of definition.abilities ?? []) {
      if (
        ability.type !== "static" ||
        ability.effect?.type !== "gain-keyword" ||
        ability.effect.keyword !== "Singer"
      ) {
        continue;
      }

      if (
        !evaluateStaticCondition({
          condition: ability.condition,
          state,
          controllerId: entry.controllerID,
          sourceId: cardId,
          getDefinitionByInstanceId,
        })
      ) {
        continue;
      }

      if (
        !matchesStaticAbilityTarget({
          state,
          target: ability.effect.target,
          sourceId: cardId,
          targetCardId: singerId,
          controllerId: entry.controllerID,
          getDefinitionByInstanceId,
        })
      ) {
        continue;
      }

      if (typeof ability.effect.value === "number" && Number.isFinite(ability.effect.value)) {
        grantedSingerThreshold = Math.max(grantedSingerThreshold, ability.effect.value);
      }
    }
  }

  const staticModifier = getStaticPropertyModifierTotal({
    state: framework.state as Parameters<typeof getStaticPropertyModifierTotal>[0]["state"],
    cardId: singerId,
    property: "singer-threshold",
    getDefinitionByInstanceId,
    registry,
  });

  const continuousModifier = G
    ? getActiveStatModifierTotal(
        { G, framework } as Parameters<typeof getActiveStatModifierTotal>[0],
        singerId,
        "singer-threshold",
        getDefinitionByInstanceId,
      )
    : 0;

  // Per rule 8.11: a "+N cost to sing songs" modifier raises the modified printed
  // cost, and a Singer character can sing songs up to max(Singer value, modified
  // printed cost). The `singer-threshold` stat modifier encodes "+N cost to sing".
  const singerValue = Math.max(keywordSingerValue, grantedSingerThreshold);
  const costToSingModifier = staticModifier + continuousModifier;
  const modifiedPrintedCost = printedCost + costToSingModifier;
  return Math.max(baseThreshold, singerValue, modifiedPrintedCost);
}

/** Sing Together N from keyword data when available, else from card text fallback. */
export function getSingTogetherThreshold(
  cardDef: LorcanaCardDefinition | undefined,
): number | null {
  if (!isSongCard(cardDef)) {
    return null;
  }

  return (
    getKeywordSingTogetherThreshold(cardDef) ?? parseTextSingTogetherThreshold(cardDef) ?? null
  );
}

/**
 * Extract Shift rules from keyword data with text fallbacks.
 * Returns explicit TODO paths for unsupported non-ink Shift costs.
 */
export function getShiftRules(cardDef: LorcanaCardDefinition | undefined): ShiftRules | null {
  if (!cardDef) {
    return null;
  }

  const shiftKeyword = getShiftKeyword(cardDef);
  const fallbackLabel = inferShiftLabel(cardDef, shiftKeyword);
  const { inkCost, discardCost, unsupportedReason } = resolveShiftCostSupport(
    shiftKeyword,
    fallbackLabel,
  );

  if (!shiftKeyword && fallbackLabel == null) {
    return null;
  }

  return {
    inkCost,
    discardCost,
    rawLabel: fallbackLabel,
    unsupportedReason,
    targetMode: resolveShiftTargetMode(cardDef, shiftKeyword, fallbackLabel),
  };
}

export function resolveShiftTargetCandidates(
  shiftRules: ShiftRules | null,
  candidates: readonly CardInstanceId[],
  getCardDefinition: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined,
): CardInstanceId[] {
  if (!shiftRules) {
    return [];
  }

  if (shiftRules.targetMode.type === "universal") {
    return [...candidates];
  }

  if (shiftRules.targetMode.type === "classification") {
    const { classification } = shiftRules.targetMode;
    return candidates.filter((cardId) => {
      const candidate = getCardDefinition(cardId);
      if (candidate?.cardType !== "character") {
        return false;
      }
      return (
        candidate.classifications?.some((candidateClassification) =>
          sameWord(candidateClassification, classification),
        ) ?? false
      );
    });
  }

  const { name } = shiftRules.targetMode;
  const targetNames = resolveShiftTargetNames(name);
  return candidates.filter((cardId) => {
    const candidate = getCardDefinition(cardId);
    if (candidate?.cardType !== "character") {
      return false;
    }
    // Mimicry: character is treated as having any name for Shift targeting
    if (hasMimicry(candidate)) {
      return true;
    }
    return targetNames.some((targetName) => cardHasName(candidate, targetName));
  });
}

export function isReadyAndNotDrying(meta: LorcanaCardMeta | undefined): boolean {
  return meta?.state !== "exerted" && meta?.isDrying !== true;
}

/**
 * Validation result for exert cost checks
 */
export type ExertCostValidationResult =
  | { valid: true }
  | { valid: false; error: string; errorCode: string };

/**
 * Validate that a card can pay an exert cost.
 * Checks that the card is not already exerted and (for characters) not drying.
 *
 * @param meta - The card's runtime meta state
 * @param cardType - The card type (to determine if drying check applies)
 * @returns Validation result with error details if invalid
 */
export function validateExertCost(
  meta: LorcanaCardMeta | undefined,
  cardType: string | undefined,
): ExertCostValidationResult {
  if (meta?.state === "exerted") {
    return {
      valid: false,
      error: "Card is exerted",
      errorCode: "CARD_EXERTED",
    };
  }
  if (cardType === "character" && meta?.isDrying) {
    return { valid: false, error: "Card is drying", errorCode: "CARD_DRYING" };
  }
  return { valid: true };
}

type BasicCostFailure = { valid: false; error: string; errorCode: string };
type BasicCostValidationResult = { valid: true } | BasicCostFailure;

export interface ExertCostCard {
  cardId: CardInstanceId;
  cardType?: string;
  subject?: string;
  exhaustedErrorCode?: string;
  dryingErrorCode?: string;
}

export interface BasicCost {
  ink?: number;
  exertCards?: readonly ExertCostCard[];
}

function createBasicCostFailure(error: string, errorCode: string): BasicCostFailure {
  return {
    valid: false,
    error,
    errorCode,
  };
}

function normalizeInkCost(ink: number | undefined): number {
  return typeof ink === "number" && Number.isFinite(ink) && ink > 0 ? ink : 0;
}

function normalizeExertSubject(subject: string | undefined): string {
  return subject && subject.trim().length > 0 ? subject : "Card";
}

function validateInkCost(
  state: Pick<BasicCostValidationContext, "framework">,
  playerId: PlayerId,
  ink: number,
): BasicCostValidationResult {
  const normalizedInk = normalizeInkCost(ink);
  if (normalizedInk === 0) {
    return { valid: true };
  }

  const availableInk = getAvailableInk(state, playerId);
  if (availableInk < normalizedInk) {
    return createBasicCostFailure(
      `Not enough ink (have ${availableInk}, need ${normalizedInk})`,
      "INSUFFICIENT_INK",
    );
  }

  return { valid: true };
}

function validateExertCardCost(
  ctx: Pick<BasicCostValidationContext, "cards">,
  exertCard: ExertCostCard,
): BasicCostValidationResult {
  const validation = validateExertCost(
    ctx.cards.require(exertCard.cardId).meta,
    exertCard.cardType,
  );
  if (validation.valid) {
    return validation;
  }

  const subject = normalizeExertSubject(exertCard.subject);
  if (validation.errorCode === "CARD_EXERTED") {
    return createBasicCostFailure(
      `${subject} is exerted`,
      exertCard.exhaustedErrorCode ?? validation.errorCode,
    );
  }

  if (validation.errorCode === "CARD_DRYING") {
    return createBasicCostFailure(
      `${subject} is drying`,
      exertCard.dryingErrorCode ?? validation.errorCode,
    );
  }

  return validation;
}

/**
 * Context for paying basic ability costs (ink and exert)
 */
export interface PayBasicCostContext {
  framework: BasicCostWriteContext["framework"];
  cards: BasicCostWriteContext["cards"];
  playerId: PlayerId;
}

/**
 * Result of paying basic ability costs
 */
export type PayBasicCostResult =
  | { success: true; inkPaid: number }
  | { success: false; error: string; errorCode: string };

/**
 * Validate that a basic cost can be paid.
 *
 * Ink validation happens after exert checks so callers preserve the current
 * behavior of returning exert failures first when both would fail.
 */
export function validateBasicCost(
  ctx: BasicCostValidationContext,
  cost: BasicCost,
): BasicCostValidationResult {
  for (const exertCard of cost.exertCards ?? []) {
    const exertValidation = validateExertCardCost(ctx, exertCard);
    if (!exertValidation.valid) {
      return exertValidation;
    }
  }

  return validateInkCost({ framework: ctx.framework }, ctx.playerId, cost.ink ?? 0);
}

/**
 * Pay ink and exert costs after validating that they can be paid.
 */
export function payBasicCost(ctx: PayBasicCostContext, cost: BasicCost): PayBasicCostResult {
  const validation = validateBasicCost(ctx, cost);
  if (validation.valid === false) {
    return {
      success: false,
      error: validation.error,
      errorCode: validation.errorCode,
    };
  }

  const inkPaid = normalizeInkCost(cost.ink);
  if (inkPaid > 0) {
    spendInk(ctx, ctx.playerId, inkPaid);
  }

  for (const exertCard of cost.exertCards ?? []) {
    ctx.cards.patchMeta(exertCard.cardId, { state: "exerted" });
  }

  return { success: true, inkPaid };
}
