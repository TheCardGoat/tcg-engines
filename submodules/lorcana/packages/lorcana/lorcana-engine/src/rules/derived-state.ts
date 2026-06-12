import type { CardInstanceId, DeepReadonly, PlayerId, FrameworkStateSnapshot } from "#core";
import type { ModifyStatEffect, StatFloorEffect } from "@tcg/lorcana-types";
import type { MaterializedStaticEffect, StaticEffectRegistry } from "./static-effect-registry";
import { cardHasName, getKeywordValue as getBaseKeywordValue } from "../card-utils";
export { cardHasName };
import type { PlayCardExecutionContext } from "../runtime-moves/resolution/action-effects/types";
import { getActiveStatModifierTotal } from "../runtime-moves/effects/continuous-effects";
import { resolveVariableAmount } from "../runtime-moves/shared/amount/resolve-variable-amount";
import {
  evaluateStaticCondition as _evaluateStaticCondition,
  getSelfStaticCostReductionAmount as _getSelfStaticCostReductionAmount,
  hasStaticSelfRestriction as _hasStaticSelfRestriction,
  isCardInPlay as _isCardInPlay,
  matchesStaticAbilityTarget as _matchesStaticAbilityTarget,
  resolveStaticVariableAmount as _resolveStaticVariableAmount,
} from "../runtime-moves/rules/static-ability-utils";
import { getTurnActionInkLimit } from "../runtime-moves/state/turn-action-ink";
import {
  getTemporaryKeywordValue,
  hasTemporaryKeyword,
  hasTemporaryRestriction,
} from "../runtime-moves/effects/temporary-effects";
import type {
  Classification,
  LorcanaCardDefinition,
  LorcanaCardMeta,
  LorcanaG,
  LorcanaMatchState,
} from "../types";
import { resolveTurnOwnerId } from "../core/runtime/turn-owner";

export type DerivedStateContext = {
  readonly ctx: {
    readonly priority?: {
      readonly holder?: string;
    };
    /** Canonical player order for turn rotation (from framework snapshot / match ctx). */
    readonly playerIds?: readonly PlayerId[];
    readonly status?: {
      readonly turn?: number;
      readonly turnOwnerId?: string;
      readonly otp?: string;
    };
    readonly zones?: {
      readonly private?: {
        readonly cardIndex?: Record<
          string,
          | {
              readonly zoneKey?: string;
              readonly ownerID?: string;
              readonly controllerID?: string;
            }
          | undefined
        >;
        readonly cardMeta?: Record<string, DeepReadonly<LorcanaCardMeta> | undefined>;
        readonly zoneCards?: Record<string, readonly string[] | undefined>;
      };
    };
  };
  readonly G:
    | DeepReadonly<{
        readonly lore?: LorcanaG["lore"];
        readonly continuousEffects?: LorcanaG["continuousEffects"];
        readonly turnMetadata?: Partial<LorcanaG["turnMetadata"]>;
        readonly challengeState?: LorcanaG["challengeState"];
        readonly turnsCompletedByPlayer?: LorcanaG["turnsCompletedByPlayer"];
        readonly staticEffectsVersion?: LorcanaG["staticEffectsVersion"];
      }>
    | undefined;
};

/**
 * The flattened shape of DerivedStateContext consumed by StaticAbilityState-accepting
 * functions in static-ability-utils.ts. Named explicitly to avoid TS7056.
 */
export type FlatDerivedState = {
  priority: DerivedStateContext["ctx"]["priority"];
  status: DerivedStateContext["ctx"]["status"];
  _zonesPrivate: NonNullable<DerivedStateContext["ctx"]["zones"]>["private"];
  playerIds: DerivedStateContext["ctx"]["playerIds"];
  G: DerivedStateContext["G"];
};

/**
 * Converts a FrameworkStateSnapshot + G into a DerivedStateContext.
 * Use this at call sites that previously spread `{ ...framework.state, G }`.
 */
export function createProjectionState(
  snapshot: FrameworkStateSnapshot,
  G: DerivedStateContext["G"],
): DerivedStateContext {
  return {
    ctx: {
      priority: snapshot.priority,
      status: snapshot.status,
      zones: { private: snapshot._zonesPrivate },
      playerIds: snapshot.playerIds,
    },
    G,
  };
}

/**
 * Flattens a DerivedStateContext into the shape expected by StaticAbilityState
 * (i.e. the FrameworkStateSnapshot-like flat layout with priority, status, _zonesPrivate).
 */
export function flattenDerivedState(state: DerivedStateContext): FlatDerivedState {
  return {
    priority: state.ctx.priority,
    status: state.ctx.status,
    _zonesPrivate: state.ctx.zones?.private,
    playerIds: state.ctx.playerIds,
    G: state.G,
  };
}

// Local wrappers that adapt DerivedStateContext → StaticAbilityState (flat shape)
function isCardInPlay(state: DerivedStateContext, cardId: CardInstanceId): boolean {
  return _isCardInPlay(flattenDerivedState(state), cardId);
}

function evaluateStaticCondition(
  args: Omit<Parameters<typeof _evaluateStaticCondition>[0], "state"> & {
    state: DerivedStateContext;
  },
): boolean {
  return _evaluateStaticCondition({
    ...args,
    state: flattenDerivedState(args.state),
  });
}

function matchesStaticAbilityTarget(
  args: Omit<Parameters<typeof _matchesStaticAbilityTarget>[0], "state"> & {
    state: DerivedStateContext;
  },
): boolean {
  return _matchesStaticAbilityTarget({
    ...args,
    state: flattenDerivedState(args.state),
  });
}

function resolveStaticVariableAmount(
  args: Omit<Parameters<typeof _resolveStaticVariableAmount>[0], "state"> & {
    state: DerivedStateContext;
  },
): number {
  return _resolveStaticVariableAmount({
    ...args,
    state: flattenDerivedState(args.state),
  });
}

function getSelfStaticCostReductionAmount(
  args: Omit<Parameters<typeof _getSelfStaticCostReductionAmount>[0], "state"> & {
    state: DerivedStateContext;
  },
): number {
  return _getSelfStaticCostReductionAmount({
    ...args,
    state: flattenDerivedState(args.state),
  });
}

function hasStaticSelfRestriction(
  args: Omit<Parameters<typeof _hasStaticSelfRestriction>[0], "state"> & {
    state: DerivedStateContext;
  },
): boolean {
  return _hasStaticSelfRestriction({
    ...args,
    state: flattenDerivedState(args.state),
  });
}

function normalizeNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

// Inline registry accessors — avoids circular runtime import from static-effect-registry.ts
// (that module imports helpers from this module, so we import only its types)
function registryEffectsForCard(
  registry: StaticEffectRegistry,
  cardId: CardInstanceId,
  kind: MaterializedStaticEffect["kind"],
): MaterializedStaticEffect[] {
  return (registry.byTarget.get(cardId) ?? []).filter((e) => e.kind === kind);
}

function registryEffectsForPlayer(
  registry: StaticEffectRegistry,
  playerId: PlayerId,
  kind: MaterializedStaticEffect["kind"],
): MaterializedStaticEffect[] {
  return (registry.byPlayer.get(playerId) ?? []).filter((e) => e.kind === kind);
}

function toProjectionCardMeta(
  meta: DeepReadonly<LorcanaCardMeta> | undefined,
): LorcanaCardMeta | undefined {
  if (!meta) {
    return undefined;
  }

  return {
    ...meta,
    cardsUnder: meta.cardsUnder ? [...meta.cardsUnder] : undefined,
    replacementAbilities: meta.replacementAbilities ? [...meta.replacementAbilities] : undefined,
  };
}

function getDerivedStrengthForStaticCondition(args: {
  state: DerivedStateContext;
  actorPlayerId?: PlayerId;
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
  registry?: StaticEffectRegistry;
}): (cardId: CardInstanceId) => number {
  const { state, getDefinitionByInstanceId, registry } = args;

  return (cardId: CardInstanceId) => {
    const definition = getDefinitionByInstanceId?.(cardId);
    return deriveStrength(definition, state, cardId, getDefinitionByInstanceId, registry);
  };
}

function createProjectionAmountContext(args: {
  state: DerivedStateContext;
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
}) {
  const { state, getDefinitionByInstanceId } = args;

  return {
    G: {
      lore: {},
      turnMetadata: state.G?.turnMetadata,
    },
    cards: {
      getDefinition: getDefinitionByInstanceId,
      require: (cardId: CardInstanceId) => ({
        meta: state.ctx.zones?.private?.cardMeta?.[cardId] ?? {},
      }),
    },
    framework: {
      state: {
        priority: state.ctx.priority,
        status: state.ctx.status,
        _zonesPrivate: state.ctx.zones?.private,
        currentPlayer: resolveTurnOwnerId(state.ctx, state.G),
        playerIds: getProjectionPlayerIds(state),
      },
      zones: {
        getCards: ({ zone, playerId }: { zone: string; playerId: PlayerId }) =>
          (state.ctx.zones?.private?.zoneCards?.[`${zone}:${playerId}`] ?? []) as CardInstanceId[],
        getCardCount: ({ zone, playerId }: { zone: string; playerId: PlayerId }) =>
          (state.ctx.zones?.private?.zoneCards?.[`${zone}:${playerId}`] ?? []).length,
      },
    },
  };
}

export function getProjectionPlayerIds(state: DerivedStateContext): PlayerId[] {
  const playerIds = new Set<PlayerId>();

  for (const playerId of (state.ctx as { playerIds?: PlayerId[] }).playerIds ?? []) {
    if (typeof playerId === "string" && playerId.length > 0) {
      playerIds.add(playerId as PlayerId);
    }
  }

  for (const entry of Object.values(state.ctx.zones?.private?.cardIndex ?? {})) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const ownerId = "ownerID" in entry ? (entry.ownerID as PlayerId | undefined) : undefined;
    const controllerId =
      "controllerID" in entry ? (entry.controllerID as PlayerId | undefined) : undefined;

    if (ownerId) {
      playerIds.add(ownerId);
    }
    if (controllerId) {
      playerIds.add(controllerId);
    }
  }

  const activePlayerId = state.ctx.priority?.holder as PlayerId | undefined;
  if (activePlayerId) {
    playerIds.add(activePlayerId);
  }

  return [...playerIds];
}

export function resolveStaticStatModifierAmount(args: {
  state: DerivedStateContext;
  effect: ModifyStatEffect;
  sourceId: CardInstanceId;
  targetId: CardInstanceId;
  controllerId?: PlayerId;
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
}): number {
  const { state, effect, sourceId, targetId, controllerId, getDefinitionByInstanceId } = args;

  if (typeof effect.modifier === "number" && Number.isFinite(effect.modifier)) {
    return effect.modifier;
  }

  if (!effect.modifier || typeof effect.modifier !== "object") {
    return 0;
  }

  // `modifier` cannot legitimately be an "up-to" amount — up-to only affects
  // chooser-selectable amounts on effects like remove-damage. Unwrap defensively.
  const modifier =
    (effect.modifier as { type?: unknown }).type === "up-to"
      ? (effect.modifier as { value: unknown }).value
      : effect.modifier;

  if (!modifier || typeof modifier !== "object") {
    return typeof modifier === "number" && Number.isFinite(modifier) ? modifier : 0;
  }

  const resolved = resolveVariableAmount(modifier as Parameters<typeof resolveVariableAmount>[0], {
    ctx: createProjectionAmountContext({
      state,
      getDefinitionByInstanceId,
    }) as unknown as PlayCardExecutionContext,
    controllerId,
    sourceId,
    targets: [targetId],
  });

  if (resolved.mode === "per-target") {
    return normalizeNumber(resolved.perTarget?.[targetId]);
  }

  return normalizeNumber(resolved.value);
}

export function resolveStaticStatFloorMinimum(args: {
  definition: LorcanaCardDefinition | undefined;
  effect: StatFloorEffect;
}): number {
  const { definition, effect } = args;
  if (effect.minimum === "printed") {
    switch (effect.stat) {
      case "strength":
        return normalizeNumber(definition?.strength);
      case "lore":
        return normalizeNumber(definition?.lore);
      case "willpower":
        return normalizeNumber(definition?.willpower);
      default:
        return 0;
    }
  }

  return normalizeNumber(effect.minimum);
}

export function matchesLegacyStaticStatTarget(args: {
  state: DerivedStateContext;
  target: unknown;
  sourceId: CardInstanceId;
  targetCardId: CardInstanceId;
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
}): boolean {
  const { state, target, sourceId, targetCardId, getDefinitionByInstanceId } = args;
  const targetDefinition = getDefinitionByInstanceId(targetCardId);
  const sourceControllerId = state.ctx.zones?.private?.cardIndex?.[sourceId]?.controllerID as
    | PlayerId
    | undefined;
  const targetControllerId = state.ctx.zones?.private?.cardIndex?.[targetCardId]?.controllerID as
    | PlayerId
    | undefined;
  const targetAtLocationId = state.ctx.zones?.private?.cardMeta?.[targetCardId]?.atLocationId as
    | CardInstanceId
    | undefined;

  switch (target) {
    case "SELF":
      return sourceId === targetCardId;
    case "CHARACTERS_HERE":
      return targetDefinition?.cardType === "character" && targetAtLocationId === sourceId;
    case "YOUR_LOCATIONS":
      return targetDefinition?.cardType === "location" && targetControllerId === sourceControllerId;
    case "YOUR_OTHER_SEVEN_DWARFS_CHARACTERS":
      return (
        sourceId !== targetCardId &&
        targetDefinition?.cardType === "character" &&
        targetControllerId === sourceControllerId &&
        (targetDefinition.classifications ?? []).includes("Seven Dwarfs")
      );
    default:
      return false;
  }
}

function getStaticStatModifierTotal(args: {
  state: DerivedStateContext;
  cardInstanceId?: CardInstanceId;
  stat: "strength" | "willpower" | "lore" | "moveCost";
  registry: StaticEffectRegistry;
}): number {
  const { cardInstanceId, stat, registry } = args;
  if (!cardInstanceId) {
    return 0;
  }

  return registryEffectsForCard(registry, cardInstanceId, "modify-stat")
    .filter((e) => e.payload.stat === stat)
    .reduce((sum, e) => sum + (e.payload.modifier as number), 0);
}

export function getStaticStatModifierSources(args: {
  state: DerivedStateContext;
  cardInstanceId?: CardInstanceId;
  stat: "strength" | "willpower" | "lore" | "moveCost";
  registry: StaticEffectRegistry | undefined;
}): Array<{
  stat: string;
  amount: number;
  sourceId: CardInstanceId;
  sourceDefinitionId?: string;
}> {
  const { cardInstanceId, stat, registry } = args;
  if (!cardInstanceId || !registry) {
    return [];
  }

  return registryEffectsForCard(registry, cardInstanceId, "modify-stat")
    .filter((e) => e.payload.stat === stat && (e.payload.modifier as number) !== 0)
    .map((e) => ({
      stat,
      amount: e.payload.modifier as number,
      sourceId: e.sourceId,
      sourceDefinitionId: e.sourceDefinitionId,
    }));
}

function getStaticStatFloor(args: {
  cardInstanceId?: CardInstanceId;
  stat: "strength" | "willpower" | "lore" | "moveCost";
  registry: StaticEffectRegistry;
}): number | undefined {
  const { cardInstanceId, stat, registry } = args;
  if (!cardInstanceId) {
    return undefined;
  }

  const floors = registryEffectsForCard(registry, cardInstanceId, "stat-floor")
    .filter((e) => e.payload.stat === stat)
    .map((e) => e.payload.floor as number);
  return floors.length > 0 ? Math.max(...floors) : undefined;
}

function applyStaticStatFloor(value: number, floor: number | undefined): number {
  if (floor === undefined) {
    return value;
  }

  return Math.max(value, floor);
}

export function clampCharacteristicForRules(value: number): number {
  return Math.max(0, normalizeNumber(value));
}

export function getEffectiveLore(
  definition: LorcanaCardDefinition | undefined,
  state: DerivedStateContext,
  cardInstanceId: CardInstanceId,
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined,
  registry?: StaticEffectRegistry,
): number {
  return clampCharacteristicForRules(
    deriveLore(definition, state, cardInstanceId, getDefinitionByInstanceId, registry),
  );
}

export function deriveLore(
  definition: LorcanaCardDefinition | undefined,
  state: DerivedStateContext,
  cardInstanceId: CardInstanceId | undefined,
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined,
  registry?: StaticEffectRegistry,
): number {
  const baseLore = normalizeNumber(definition?.lore);

  if (!definition || !cardInstanceId) {
    return baseLore;
  }

  const modifier =
    getActiveStatModifierTotal(state, cardInstanceId, "lore", getDefinitionByInstanceId) +
    (registry
      ? getStaticStatModifierTotal({
          state,
          cardInstanceId,
          stat: "lore",
          registry,
        })
      : 0);
  return applyStaticStatFloor(
    baseLore + modifier,
    registry
      ? getStaticStatFloor({
          cardInstanceId,
          stat: "lore",
          registry,
        })
      : undefined,
  );
}

export function deriveCanBePutInInkwell(args: {
  definition?: LorcanaCardDefinition;
  ownerID?: PlayerId;
  zoneID?: string;
  state: DerivedStateContext;
  actorPlayerId?: PlayerId;
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
}): boolean {
  const { definition, ownerID, zoneID, state, actorPlayerId, getDefinitionByInstanceId } = args;
  if (!definition || !ownerID || !zoneID || !actorPlayerId) {
    return false;
  }

  const cardIndex = state.ctx.zones?.private?.cardIndex;
  if (!cardIndex) {
    return false;
  }

  const normalizedZone = zoneID.split(":")[0];
  const inkedThisTurn = state.G?.turnMetadata?.inkedThisTurn ?? [];
  const inkLimit = getTurnActionInkLimit({
    state: {
      ctx: {
        priority: {
          holder: state.ctx.priority?.holder,
        },
        zones: {
          private: {
            cardIndex,
          },
        },
      },
      G: {
        turnMetadata: {
          inkedThisTurn: state.G?.turnMetadata?.inkedThisTurn ?? [],
          additionalInkwellActions: state.G?.turnMetadata?.additionalInkwellActions,
        },
      },
    },
    getDefinitionByInstanceId,
    playerId: actorPlayerId,
  });
  if (inkedThisTurn.length >= inkLimit) {
    return false;
  }

  if (ownerID !== actorPlayerId) {
    return false;
  }

  const isInHand = normalizedZone === "hand";
  const isInDiscard = normalizedZone === "discard";

  if (!isInHand && !isInDiscard) {
    return false;
  }

  // Check if any active static ability in play grants inkability for this zone
  const allPlayCards = Object.entries(state.ctx.zones?.private?.cardIndex ?? {}).filter(
    ([, entry]) => {
      const zone = entry?.zoneKey?.split(":")[0];
      return zone === "play" && entry?.controllerID === actorPlayerId;
    },
  );

  if (isInDiscard) {
    // Cards in discard can only be inked if a static grants discard inkability
    // AND the card is normally inkable
    if (!definition.inkable) {
      return false;
    }
    for (const [sourceId] of allPlayCards) {
      const sourceDef = getDefinitionByInstanceId?.(sourceId as CardInstanceId);
      if (!sourceDef) continue;
      for (const ability of sourceDef.abilities ?? []) {
        if (
          ability.type !== "static" ||
          (ability.effect as { type?: string }).type !== "grant-discard-inkability"
        ) {
          continue;
        }
        const activeSourceZones = ability.sourceZones ?? ["play"];
        if (!activeSourceZones.includes("play")) {
          continue;
        }
        if (
          !evaluateStaticCondition({
            condition: ability.condition,
            state,
            controllerId: actorPlayerId,
            sourceId: sourceId as CardInstanceId,
            getDefinitionByInstanceId,
          })
        ) {
          continue;
        }
        return true;
      }
    }
    return false;
  }

  // Hand zone: card is inkable by default or via grant-hand-inkability
  if (definition.inkable) {
    return true;
  }

  for (const [sourceId] of allPlayCards) {
    const sourceDef = getDefinitionByInstanceId?.(sourceId as CardInstanceId);
    if (!sourceDef) continue;
    for (const ability of sourceDef.abilities ?? []) {
      if (
        ability.type !== "static" ||
        (ability.effect as { type?: string }).type !== "grant-hand-inkability"
      ) {
        continue;
      }
      const activeSourceZones = ability.sourceZones ?? ["play"];
      if (!activeSourceZones.includes("play")) {
        continue;
      }
      if (
        !evaluateStaticCondition({
          condition: ability.condition,
          state,
          controllerId: actorPlayerId,
          sourceId: sourceId as CardInstanceId,
          getDefinitionByInstanceId,
        })
      ) {
        continue;
      }
      return true;
    }
  }

  return false;
}

export function getEffectiveStrength(
  definition: LorcanaCardDefinition | undefined,
  state: DerivedStateContext,
  cardInstanceId: CardInstanceId,
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined,
  registry?: StaticEffectRegistry,
): number {
  return clampCharacteristicForRules(
    deriveStrength(definition, state, cardInstanceId, getDefinitionByInstanceId, registry),
  );
}

export function deriveStrength(
  definition: LorcanaCardDefinition | undefined,
  state: DerivedStateContext,
  cardInstanceId: CardInstanceId | undefined,
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined,
  registry?: StaticEffectRegistry,
): number {
  if (!definition || definition.cardType !== "character" || !cardInstanceId) {
    return 0;
  }

  const baseStrength = normalizeNumber(definition.strength);
  const modifier =
    getActiveStatModifierTotal(state, cardInstanceId, "strength", getDefinitionByInstanceId) +
    (registry
      ? getStaticStatModifierTotal({
          state,
          cardInstanceId,
          stat: "strength",
          registry,
        })
      : 0);
  return applyStaticStatFloor(
    baseStrength + modifier,
    registry
      ? getStaticStatFloor({
          cardInstanceId,
          stat: "strength",
          registry,
        })
      : undefined,
  );
}

export function getEffectiveWillpower(
  definition: LorcanaCardDefinition | undefined,
  state: DerivedStateContext,
  cardInstanceId: CardInstanceId,
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined,
  registry?: StaticEffectRegistry,
): number {
  return clampCharacteristicForRules(
    deriveWillpower(definition, state, cardInstanceId, getDefinitionByInstanceId, registry),
  );
}

export function deriveWillpower(
  definition: LorcanaCardDefinition | undefined,
  state: DerivedStateContext,
  cardInstanceId: CardInstanceId | undefined,
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined,
  registry?: StaticEffectRegistry,
): number {
  if (!definition || !cardInstanceId) {
    return 0;
  }

  if (definition.cardType === "action" || definition.cardType === "item") {
    return 0;
  }

  const baseWillpower = normalizeNumber(definition.willpower);
  const modifier =
    getActiveStatModifierTotal(state, cardInstanceId, "willpower", getDefinitionByInstanceId) +
    (registry
      ? getStaticStatModifierTotal({
          state,
          cardInstanceId,
          stat: "willpower",
          registry,
        })
      : 0);
  const derivedWillpower = applyStaticStatFloor(
    baseWillpower + modifier,
    registry
      ? getStaticStatFloor({
          cardInstanceId,
          stat: "willpower",
          registry,
        })
      : undefined,
  );

  return definition.cardType === "location" ? Math.max(0, derivedWillpower) : derivedWillpower;
}

export function getEffectiveMoveCost(
  definition: LorcanaCardDefinition | undefined,
  state: DerivedStateContext,
  cardInstanceId: CardInstanceId,
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined,
  registry?: StaticEffectRegistry,
): number {
  return clampCharacteristicForRules(
    deriveMoveCost(definition, state, cardInstanceId, getDefinitionByInstanceId, registry),
  );
}

export function deriveMoveCost(
  definition: LorcanaCardDefinition | undefined,
  state: DerivedStateContext,
  cardInstanceId: CardInstanceId | undefined,
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined,
  registry?: StaticEffectRegistry,
): number {
  if (!definition || definition.cardType !== "location" || !cardInstanceId) {
    return 0;
  }

  const baseMoveCost = normalizeNumber(definition.moveCost);
  const modifier =
    getActiveStatModifierTotal(state, cardInstanceId, "moveCost", getDefinitionByInstanceId) +
    (registry
      ? getStaticStatModifierTotal({
          state,
          cardInstanceId,
          stat: "moveCost",
          registry,
        })
      : 0);
  return applyStaticStatFloor(
    baseMoveCost + modifier,
    registry
      ? getStaticStatFloor({
          cardInstanceId,
          stat: "moveCost",
          registry,
        })
      : undefined,
  );
}

export type PendingCostReduction = {
  amount: number;
  sourceId?: CardInstanceId;
  cardType?:
    | "character"
    | "item"
    | "location"
    | "action"
    | "song"
    | ("character" | "item" | "location" | "action" | "song")[]
    | readonly ("character" | "item" | "location" | "action" | "song")[];
  classification?: Classification | Classification[] | readonly Classification[];
  expiresAtTurn: number;
  consumeOnUse: boolean;
};

function isPendingCostReduction(value: unknown): value is PendingCostReduction {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const reduction = value as Record<string, unknown>;
  return (
    typeof reduction.amount === "number" &&
    Number.isFinite(reduction.amount) &&
    reduction.amount >= 0 &&
    typeof reduction.expiresAtTurn === "number" &&
    Number.isFinite(reduction.expiresAtTurn) &&
    reduction.expiresAtTurn >= 0
  );
}

function matchesCostReductionCardType(
  definition: LorcanaCardDefinition,
  targetCardType: PendingCostReduction["cardType"],
): boolean {
  if (!targetCardType) {
    return true;
  }

  if (Array.isArray(targetCardType)) {
    return targetCardType.some((type) => matchesCostReductionCardType(definition, type));
  }

  if (targetCardType === "song") {
    return definition.cardType === "action" && definition.actionSubtype === "song";
  }

  return definition.cardType === targetCardType;
}

function matchesCostReductionClassification(
  definition: LorcanaCardDefinition,
  classification: PendingCostReduction["classification"],
): boolean {
  if (!classification) {
    return true;
  }

  if (definition.cardType !== "character") {
    return false;
  }

  const cardClassifications = definition.classifications ?? [];
  if (Array.isArray(classification)) {
    return classification.some((c) => cardClassifications.includes(c));
  }

  return typeof classification === "string" && cardClassifications.includes(classification);
}

function matchesCostReductionName(
  definition: LorcanaCardDefinition,
  name: string | undefined,
): boolean {
  if (!name) {
    return true;
  }

  return cardHasName(definition, name);
}

export function getPendingCostReductions(
  state: DerivedStateContext,
  playerId: PlayerId,
): PendingCostReduction[] {
  if (!state.G) {
    return [];
  }

  const pendingByPlayer = state.G.turnMetadata?.pendingCostReductionsByPlayer;
  if (!pendingByPlayer || typeof pendingByPlayer !== "object") {
    return [];
  }

  const rawEntries = pendingByPlayer[playerId];
  if (!Array.isArray(rawEntries)) {
    return [];
  }

  return rawEntries.filter(isPendingCostReduction);
}

function getStaticCostReductionAmount(args: {
  state: DerivedStateContext;
  playerId: PlayerId;
  definition: LorcanaCardDefinition;
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
  playMethod?: "shift" | "standard" | "either";
  registry: StaticEffectRegistry;
}): number {
  const { state, playerId, definition, getDefinitionByInstanceId, playMethod, registry } = args;

  const effects = registryEffectsForPlayer(registry, playerId, "cost-reduction");
  let total = 0;
  const baseCost = Number(definition.cost ?? 0);
  for (const e of effects) {
    const payload = e.payload as {
      rawAmount?: unknown;
      rawReduction?: { ink?: unknown };
      cardType?: unknown;
      classification?: unknown;
      cardName?: string;
      playMethod?: string;
    };
    const effectPlayMethod = payload.playMethod;
    // "either" on the cost-reduction effect itself is a wildcard that matches both shift and standard.
    if (
      effectPlayMethod !== undefined &&
      effectPlayMethod !== "either" &&
      (!playMethod || (playMethod !== "either" && playMethod !== effectPlayMethod))
    )
      continue;
    if (
      !matchesCostReductionCardType(
        definition,
        payload.cardType as PendingCostReduction["cardType"],
      )
    )
      continue;
    if (
      !matchesCostReductionClassification(
        definition,
        payload.classification as PendingCostReduction["classification"],
      )
    )
      continue;
    if (payload.cardName && !matchesCostReductionName(definition, payload.cardName)) continue;

    const rawAmount = payload.rawAmount;
    const rawReduction = payload.rawReduction;
    const amount =
      rawAmount === "full" || rawReduction?.ink === "full"
        ? baseCost
        : typeof rawAmount === "number"
          ? (rawAmount as number)
          : typeof rawAmount === "object" && rawAmount !== null
            ? resolveStaticVariableAmount({
                amount: rawAmount as Parameters<typeof resolveStaticVariableAmount>[0]["amount"],
                state,
                controllerId: playerId,
                sourceId: e.sourceId,
                getDefinitionByInstanceId,
              })
            : typeof rawReduction?.ink === "number"
              ? (rawReduction.ink as number)
              : 0;
    total += Math.max(0, amount);
  }
  return total;
}

/**
 * Sum up static cost-increase amounts from ALL in-play cards (any player).
 * Used for effects like "Each player pays N more to play actions or items."
 */
export function getStaticCostIncreaseAmount(args: {
  state: DerivedStateContext;
  definition: LorcanaCardDefinition;
  registry: StaticEffectRegistry | undefined;
}): number {
  const { definition, registry } = args;

  if (!registry) {
    return 0;
  }

  const isSong =
    definition.cardType === "action" &&
    "actionSubtype" in definition &&
    definition.actionSubtype === "song";
  let total = 0;
  for (const e of registry.global.filter((g) => g.kind === "cost-increase")) {
    const cardTypes = e.payload.cardType;
    if (cardTypes !== undefined) {
      const types = Array.isArray(cardTypes) ? (cardTypes as string[]) : [cardTypes as string];
      const matches = types.some((t) => {
        if (t === "song") return isSong;
        return definition.cardType === t;
      });
      if (!matches) continue;
    }
    total += Math.max(0, e.payload.amount as number);
  }
  return total;
}

export type CostReductionApplication = {
  reductionAmount: number;
  consumeIndexes: number[];
};

export function getAppliedCostReductions(args: {
  definition?: LorcanaCardDefinition;
  state: DerivedStateContext;
  cardInstanceId?: CardInstanceId;
  ownerID?: PlayerId;
  zoneID?: string;
  actorPlayerId?: PlayerId;
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
  playMethod?: "shift" | "standard";
  registry: StaticEffectRegistry | undefined;
}): CostReductionApplication {
  const {
    definition,
    state,
    cardInstanceId,
    ownerID,
    zoneID,
    actorPlayerId,
    getDefinitionByInstanceId,
    playMethod,
    registry,
  } = args;

  if (!definition) {
    return { reductionAmount: 0, consumeIndexes: [] };
  }

  const normalizedZone = zoneID?.split(":")[0];
  const isSupportedPlaySourceZone = normalizedZone === "hand" || normalizedZone === "discard";
  if (!actorPlayerId || ownerID !== actorPlayerId || !isSupportedPlaySourceZone) {
    return { reductionAmount: 0, consumeIndexes: [] };
  }

  const currentTurn = state.ctx.status?.turn ?? 1;
  const pendingReductions = getPendingCostReductions(state, actorPlayerId);
  let pendingAmount = 0;
  const consumeIndexes: number[] = [];

  pendingReductions.forEach((reduction, index) => {
    if (reduction.expiresAtTurn < currentTurn) {
      return;
    }
    if (!matchesCostReductionCardType(definition, reduction.cardType)) {
      return;
    }
    if (!matchesCostReductionClassification(definition, reduction.classification)) {
      return;
    }
    pendingAmount += reduction.amount;
    if (reduction.consumeOnUse) {
      consumeIndexes.push(index);
    }
  });

  const staticReduction = registry
    ? getStaticCostReductionAmount({
        state,
        playerId: actorPlayerId,
        definition,
        getDefinitionByInstanceId,
        playMethod,
        registry,
      })
    : 0;
  const getCardStrengthByInstanceId = getDerivedStrengthForStaticCondition({
    state,
    actorPlayerId,
    getDefinitionByInstanceId,
    registry,
  });
  const selfStaticReduction = getSelfStaticCostReductionAmount({
    state,
    cardId: cardInstanceId,
    controllerId: actorPlayerId,
    definition,
    sourceZone: normalizedZone as "play" | "hand" | "discard" | "inkwell" | undefined,
    getDefinitionByInstanceId,
    getCardStrengthByInstanceId,
  });

  return {
    reductionAmount: pendingAmount + staticReduction + selfStaticReduction,
    consumeIndexes,
  };
}

export function derivePlayCost(args: {
  definition?: LorcanaCardDefinition;
  state: DerivedStateContext;
  cardInstanceId?: CardInstanceId;
  ownerID?: PlayerId;
  zoneID?: string;
  actorPlayerId?: PlayerId;
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
  playMethod?: "shift" | "standard";
  registry: StaticEffectRegistry | undefined;
}): number {
  const { definition } = args;
  const baseCost = normalizeNumber(definition?.cost);
  if (!definition) {
    return baseCost;
  }

  const { state, registry } = args;
  const application = getAppliedCostReductions(args);
  const increaseAmount = getStaticCostIncreaseAmount({
    state,
    definition,
    registry,
  });
  return Math.max(0, baseCost - application.reductionAmount + increaseAmount);
}

function isSourceInPlayForProjection(state: DerivedStateContext, sourceId: string): boolean {
  const zoneKey = state.ctx.zones?.private?.cardIndex?.[sourceId]?.zoneKey;
  return typeof zoneKey === "string" && (zoneKey === "play" || zoneKey.startsWith("play:"));
}

export function getActiveTemporaryKeywordNames(
  meta: LorcanaCardMeta | undefined,
  currentTurn: number,
  state?: DerivedStateContext,
): string[] {
  const rawKeywords = meta?.temporaryKeywords;
  if (!rawKeywords || typeof rawKeywords !== "object" || Array.isArray(rawKeywords)) {
    return [];
  }

  const isSourceInPlay = state
    ? (sourceId: string) => isSourceInPlayForProjection(state, sourceId)
    : undefined;

  const names = Object.keys(rawKeywords).filter((keyword) =>
    hasTemporaryKeyword(
      meta,
      currentTurn,
      keyword,
      isSourceInPlay ? { isSourceInPlay } : undefined,
    ),
  );
  names.sort((left, right) => left.localeCompare(right));
  return names;
}

export function getActiveStaticSelfKeywordGrants(args: {
  definition: LorcanaCardDefinition | undefined;
  state: DerivedStateContext;
  controllerId?: PlayerId;
  zoneID?: string;
  cardInstanceId?: CardInstanceId;
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
}): { keywords: string[]; values: Record<string, number> } {
  const { definition, state, controllerId, zoneID, cardInstanceId, getDefinitionByInstanceId } =
    args;
  const normalizedZone = zoneID?.split(":")[0];
  if (!definition || normalizedZone !== "play") {
    return { keywords: [], values: {} };
  }
  const getCardStrengthByInstanceId = getDerivedStrengthForStaticCondition({
    state,
    actorPlayerId: controllerId,
    getDefinitionByInstanceId,
  });

  const keywords: string[] = [];
  const values: Record<string, number> = {};

  for (const ability of definition.abilities ?? []) {
    if (ability.type !== "static" || ability.effect?.type !== "gain-keyword") {
      continue;
    }

    if (ability.effect.target !== "SELF") {
      continue;
    }

    if (
      !evaluateStaticCondition({
        condition: ability.condition,
        state,
        controllerId,
        sourceId: cardInstanceId,
        getDefinitionByInstanceId,
        getCardStrengthByInstanceId,
      })
    ) {
      continue;
    }

    const keyword =
      typeof ability.effect.keyword === "string" && ability.effect.keyword.trim().length > 0
        ? ability.effect.keyword.trim()
        : undefined;
    if (!keyword) {
      continue;
    }

    keywords.push(keyword);

    if (typeof ability.effect.value === "number" && Number.isFinite(ability.effect.value)) {
      const amount = ability.effect.value;
      if (amount > 0) {
        values[keyword] = (values[keyword] ?? 0) + amount;
      }
    } else if (typeof ability.effect.value === "object" && ability.effect.value !== null) {
      const resolvedAmount = resolveStaticVariableAmount({
        amount: ability.effect.value,
        state,
        controllerId,
        sourceId: cardInstanceId,
        getDefinitionByInstanceId,
      });
      if (resolvedAmount > 0) {
        values[keyword] = (values[keyword] ?? 0) + resolvedAmount;
      }
    }
  }

  keywords.sort((left, right) => left.localeCompare(right));
  return { keywords, values };
}

export function getActiveStaticKeywordGrants(args: {
  definition: LorcanaCardDefinition | undefined;
  state: DerivedStateContext;
  controllerId?: PlayerId;
  zoneID?: string;
  cardInstanceId?: CardInstanceId;
  registry: StaticEffectRegistry | undefined;
}): { keywords: string[]; values: Record<string, number> } {
  const { zoneID, cardInstanceId, registry } = args;
  const normalizedZone = zoneID?.split(":")[0];

  if (!registry || !cardInstanceId || normalizedZone !== "play")
    return { keywords: [], values: {} };
  const effects = registryEffectsForCard(registry, cardInstanceId, "gain-keyword").filter(
    (e) => !e.payload.selfGrant,
  );
  const keywords: string[] = [];
  const values: Record<string, number> = {};
  for (const e of effects) {
    const kw = e.payload.keyword as string;
    keywords.push(kw);
    if (typeof e.payload.value === "number" && (e.payload.value as number) > 0) {
      values[kw] = (values[kw] ?? 0) + (e.payload.value as number);
    }
  }
  keywords.sort((a, b) => a.localeCompare(b));
  return { keywords, values };
}

export function getActiveStaticKeywordLosses(args: {
  definition: LorcanaCardDefinition | undefined;
  state: DerivedStateContext;
  controllerId?: PlayerId;
  zoneID?: string;
  cardInstanceId?: CardInstanceId;
  registry: StaticEffectRegistry | undefined;
}): string[] {
  const { zoneID, cardInstanceId, registry } = args;
  const normalizedZone = zoneID?.split(":")[0];

  if (!registry || !cardInstanceId || normalizedZone !== "play") return [];
  const kws = registryEffectsForCard(registry, cardInstanceId, "lose-keyword").map(
    (e) => e.payload.keyword as string,
  );
  return [...new Set(kws)].sort((a, b) => a.localeCompare(b));
}

export function getActiveStaticKeywordGrantSources(args: {
  definition: LorcanaCardDefinition | undefined;
  state: DerivedStateContext;
  controllerId?: PlayerId;
  zoneID?: string;
  cardInstanceId?: CardInstanceId;
  registry: StaticEffectRegistry | undefined;
}): Array<{
  keyword: string;
  sourceId: CardInstanceId;
  sourceDefinitionId?: string;
}> {
  const { zoneID, cardInstanceId, registry } = args;
  const normalizedZone = zoneID?.split(":")[0];

  if (!registry || !cardInstanceId || normalizedZone !== "play") return [];
  return registryEffectsForCard(registry, cardInstanceId, "gain-keyword")
    .filter((e) => !e.payload.selfGrant && e.sourceId !== cardInstanceId)
    .map((e) => ({
      keyword: e.payload.keyword as string,
      sourceId: e.sourceId,
      sourceDefinitionId: e.sourceDefinitionId,
    }));
}

export function getActiveStaticClassificationGrants(args: {
  definition: LorcanaCardDefinition | undefined;
  state: DerivedStateContext;
  controllerId?: PlayerId;
  zoneID?: string;
  cardInstanceId?: CardInstanceId;
  registry: StaticEffectRegistry | undefined;
}): string[] {
  const { state, zoneID, cardInstanceId, registry } = args;
  const normalizedZone = zoneID?.split(":")[0];

  if (!registry || !cardInstanceId || normalizedZone !== "play") return [];
  const activeTemporaryClassifications = getActiveTemporaryMap(
    state.ctx.zones?.private?.cardMeta?.[cardInstanceId]?.temporaryClassifications,
    state.ctx.zones?.private?.cardMeta?.[cardInstanceId]?.temporaryClassificationStarts,
    state.ctx.status?.turn ?? 1,
  );
  const tempClassifications = activeTemporaryClassifications
    ? Object.keys(activeTemporaryClassifications)
    : [];
  const staticGrants = registryEffectsForCard(registry, cardInstanceId, "grant-classification").map(
    (e) => e.payload.classification as string,
  );
  return [...new Set([...tempClassifications, ...staticGrants])].sort((a, b) => a.localeCompare(b));
}

export function getActiveTemporaryMap(
  effectMap: Record<string, number> | undefined,
  startMap: Record<string, number> | undefined,
  currentTurn: number,
): Record<string, number> | undefined {
  if (!effectMap || typeof effectMap !== "object") {
    return undefined;
  }

  const activeEntries = Object.entries(effectMap).filter(([key, expiryTurn]) => {
    if (typeof expiryTurn !== "number" || !Number.isFinite(expiryTurn)) {
      return false;
    }

    const startTurn = startMap?.[key];
    const normalizedStart =
      typeof startTurn === "number" && Number.isFinite(startTurn) ? startTurn : 1;
    return currentTurn >= normalizedStart && currentTurn <= expiryTurn;
  });

  return activeEntries.length > 0 ? Object.fromEntries(activeEntries) : undefined;
}

export function getDerivedHasQuestRestriction(
  meta: LorcanaCardMeta | undefined,
  currentTurn: number,
  state: DerivedStateContext,
  cardInstanceId: CardInstanceId | undefined,
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined,
  registry?: StaticEffectRegistry,
): boolean {
  if (
    hasTemporaryRestriction(meta, currentTurn, "cant-quest", {
      isSourceInPlay: (sourceId) => isSourceInPlayForProjection(state, sourceId),
    })
  ) {
    return true;
  }

  if (cardInstanceId) {
    const getCardWillpowerByInstanceId = registry
      ? (id: CardInstanceId) =>
          getEffectiveWillpower(
            getDefinitionByInstanceId(id),
            state,
            id,
            getDefinitionByInstanceId,
            registry,
          )
      : undefined;
    if (
      hasStaticSelfRestriction({
        state,
        cardId: cardInstanceId,
        restriction: "cant-quest",
        getDefinitionByInstanceId,
        getCardWillpowerByInstanceId,
      })
    ) {
      return true;
    }
  }

  return false;
}
