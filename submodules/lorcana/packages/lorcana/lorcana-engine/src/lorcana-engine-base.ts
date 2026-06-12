/**
 * Lorcana Engine Base Abstract Class
 *
 * Shared base class for LorcanaClient and LorcanaServer.
 * Provides abstract method declarations and shared utility methods.
 */

import {
  type CommandResult,
  type DeepReadonly,
  type EngineActiveEffectProjection,
  type EngineActorContext,
  type EnginePendingEffectProjection,
  type CardInstanceId,
  type PlayerId,
  type FilteredMatchView,
  type MatchState,
  type MatchRuntimeConfig,
  type GameEngine,
  type CardCatalog,
  type MatchStaticResources,
  type Player,
  type EngineMoveHistoryEntry,
  type EngineMoveValidationResult,
  asCardInstanceIds,
  type ZoneId,
  asPlayerIdOptional,
  MatchRuntime,
} from "#core";
import type {
  AvailableMove,
  AvailableMoveId,
  MoveOption,
  MoveOptionSelectableCost,
  MoveOptionSingTogether,
  EffectTargetInfo,
} from "./available-moves";
import type { CommandFailure } from "#core";
import { cardHasName, hasShift, isSong } from "./card-utils";
import {
  getShiftRules,
  getSingTogetherThreshold,
  getSingerThresholdForInstance,
  isSongCard,
  resolveShiftTargetCandidates,
} from "./runtime-moves/rules/play-card-rules";
import type { Effect } from "@tcg/lorcana-types";
import type {
  AbilityDefinition,
  ActivatedAbilityDefinition,
  BagEffectEntry,
  CardInput,
  LorcanaCard,
  LorcanaCardDefinition,
  LorcanaG,
  LorcanaMatchState,
  LorcanaMoveComposeResult,
  LorcanaMoveRequestValidation,
  LorcanaProjectedBagEffect,
  LorcanaProjectedBoardView,
  LorcanaProjectedCard,
  LorcanaProjectedPendingEffect,
  LorcanaProjectedPendingChoice,
  PendingActionEffect,
  LorcanaRuntimeMoveInputs,
  LorcanaRuntimeMoveParams,
  LorcanaStaticCard,
  SetupMoveId,
} from "./types";
import { isClassification } from "./types";
import { FALLBACK_LORCANA_CARD, FALLBACK_LORCANA_PROJECTED_CARD } from "./fallback-card-definition";
import { resolveCardInstanceIdFromInput } from "./card-input-resolver";
import { restoreProjectedCard } from "./projection/card-derived";
import {
  type LorcanaBaseEngineParams,
  initializeLorcanaEngineBase,
  normalizeBoardPlayerId,
} from "./engine-initialization";
import { type PlayCardCostInput, normalizePlayCardCost } from "./lorcana-engine-normalization";
import type { PlayCardDisabledReason } from "./play-card-disabled-reason";
import {
  flattenSlottedTargets,
  isUnresolvedSlottedTargetInput,
  resolveSlottedTargetInputWith,
  type SlottedTargetInput,
  type SlottedTargetInputOf,
} from "./targeting/slotted-targets";
import {
  getGrantedActivatedAbilities,
  hasStaticCardRestriction,
  toStaticAbilityState,
} from "./runtime-moves/rules/static-ability-utils";
import { buildRegistryFromMatchState } from "./runtime-moves/rules/move-registry-cache";
import { buildValidationContext } from "./core/runtime/match-runtime.utils";
import { getBanishCharacterCostCandidateIds } from "./runtime-moves/moves/abilities/banish-character-cost-candidates";
import { lorcanaRuntimeConfig } from "./runtime-game";
import {
  computeChallengeDamageResult,
  getEligibleChallengeAttackers,
  getLegalChallengeDefendersForAttacker,
} from "./runtime-moves/rules/challenge-rules";
import {
  analyzeActivateAbilityEffectResolutionSlots,
  type ActivateAbilityEffectResolutionSlot,
  analyzeEffectTargets,
  analyzeResolutionRequirements,
  analyzeTargetSelectionAvailability,
  type ActionTargetResolutionContext,
} from "./targeting/targeting-service";
import { shouldSkipEffectWithNoValidTargets } from "./targeting/runtime/optional-skip-analysis";
import { buildResolutionSelectionContext } from "./runtime-moves/resolution/action-effects/selection-context";
import { isScryEffect } from "./runtime-moves/resolution/action-effects/scry-effect";
import { evaluateActionCondition } from "./runtime-moves/resolution/action-effects/action-condition-evaluator";
import { cloneActionResolutionInput } from "./runtime-moves/resolution/action-effects/pending-action-effects";
import type { ActionResolutionInput } from "./runtime-moves/resolution/action-effects/types";
import { getNextBagResolver } from "./runtime-moves/effects/triggered-abilities";
import { getActivePlayFromUnderPermissions } from "./runtime-moves/effects/play-from-under-permissions";
import {
  enumerateAutomatedActionsWithAdapter,
  takeAutomatedActionWithAdapter,
} from "./automation/planner";
import { buildAutomatedActionMoveRequest } from "./automation/move-adapter";
import type {
  AutomatedActionCandidate,
  AutomatedActionDiagnostic,
  AutomatedActionEnumerationOptions,
  AutomatedActionEnumerationResult,
  AutomatedActionExecutionOptions,
  AutomatedActionExecutionResult,
} from "./automation";
import type { DynamicAmountEventSnapshot } from "./types/domain-events";
import { getLogger } from "@logtape/logtape";

export const logger = getLogger(["lorcana-engine", "lorcana-engine-base"]);

type AutoBagDrainResolverScope = "any" | "acting-player";

type SongPlayOptions = {
  singleSingerIds: CardInstanceId[];
  singTogetherOption: MoveOptionSingTogether | null;
};

/**
 * Checks whether an effect record is an "or"-type effect (has options or choices array).
 */
function isOrLikeEffectRecord(
  effect: unknown,
): effect is { type: "or"; options?: unknown[]; choices?: unknown[] } {
  if (!effect || typeof effect !== "object") {
    return false;
  }
  const record = effect as Record<string, unknown>;
  return record.type === "or";
}

/**
 * Recursively checks whether an effect descriptor (or any nested effect within it)
 * carries a chooser field that defers decisions to the opponent rather than the
 * controller.  Covers the same fields as the flat `isOpponentChooser` check
 * (`chosenBy: "opponent"`, `chooser: "OPPONENT"`, `chooser: "EACH_OPPONENT"`) but
 * walks into `for-each-opponent`, `sequence`, `optional`, `conditional`, `choice`,
 * `or`, and other composition wrappers so nested opponent-chooser effects are
 * detected.
 *
 * Intentionally excludes `chosenBy: "TARGET"` because TARGET may resolve to the
 * controller at runtime; only unambiguous opponent deferrals are considered.
 */
function hasOpponentChosenEffect(effect: unknown): boolean {
  if (!effect || typeof effect !== "object") {
    return false;
  }

  if (Array.isArray(effect)) {
    return effect.some((entry) => hasOpponentChosenEffect(entry));
  }

  const record = effect as Record<string, unknown>;

  if (
    record.chosenBy === "opponent" ||
    record.chooser === "OPPONENT" ||
    record.chooser === "EACH_OPPONENT"
  ) {
    return true;
  }

  // Recurse into nested effect fields — mirrors visitNestedEffects in
  // resolution-requirements.ts to cover all composition wrappers.
  for (const key of ["effect", "then", "else", "ifTrue", "ifFalse", "trueEffect", "falseEffect"]) {
    if (hasOpponentChosenEffect(record[key])) {
      return true;
    }
  }

  for (const key of ["effects", "steps", "options", "choices"]) {
    const nested = record[key];
    if (Array.isArray(nested) && nested.some((entry) => hasOpponentChosenEffect(entry))) {
      return true;
    }
  }

  return false;
}

function hasDeferredNonControllerDecision(effect: unknown): boolean {
  if (!effect || typeof effect !== "object") {
    return false;
  }

  if (Array.isArray(effect)) {
    return effect.some((entry) => hasDeferredNonControllerDecision(entry));
  }

  const record = effect as Record<string, unknown>;
  if (
    record.chosenBy === "opponent" ||
    record.chosenBy === "TARGET" ||
    record.chooser === "OPPONENT" ||
    record.chooser === "EACH_OPPONENT"
  ) {
    return true;
  }

  return Object.values(record).some((value) => hasDeferredNonControllerDecision(value));
}

/**
 * Counts the number of currently legal options in an "or"-like effect.
 * Uses lightweight checks available without full PlayCardExecutionContext.
 * Per CR 6.1.5.2, if only one option is legal, the choice is forced.
 */
function countLegalOrOptions(
  effect: { options?: unknown[]; choices?: unknown[] },
  chooserId: string,
  ctx: ActionTargetResolutionContext,
): number {
  const options = effect.options ?? effect.choices ?? [];
  let legalCount = 0;
  for (const option of options) {
    if (isOrOptionCurrentlyLegal(option, chooserId, ctx)) {
      legalCount++;
    }
  }
  return legalCount;
}

/**
 * Lightweight legality check for an "or" option.
 * Handles discard (requires cards in hand) and defaults to legal for other types.
 * This intentionally stays lenient because callers may not have the full execution
 * context needed to prove more complex options legal without false negatives.
 */
function isOrOptionCurrentlyLegal(
  option: unknown,
  chooserId: string,
  ctx: ActionTargetResolutionContext,
): boolean {
  if (!option || typeof option !== "object") {
    return false;
  }
  const record = option as Record<string, unknown>;

  if (record.type === "discard") {
    const target = record.target;
    const isControllerTarget = target === "CONTROLLER" || target === "SELF" || target === "you";
    if (isControllerTarget) {
      const rawAmount = typeof record.amount === "number" && record.amount > 0 ? record.amount : 1;
      const handCards = ctx.framework.zones.getCards({
        zone: "hand",
        playerId: chooserId,
      }) as CardInstanceId[];
      return handCards.length >= rawAmount;
    }
  }

  // For sequence effects starting with a discard, check the first step
  if (record.type === "sequence" || record.type === "then") {
    const steps = Array.isArray(record.steps)
      ? record.steps
      : Array.isArray(record.effects)
        ? record.effects
        : [];
    if (steps.length > 0) {
      return isOrOptionCurrentlyLegal(steps[0], chooserId, ctx);
    }
  }

  // Default: assume legal (conservative — only auto-force when we can confirm illegality)
  return true;
}

type CardRef = CardInput;
type ZoneCounts = Record<"hand" | "deck" | "play" | "inkwell" | "discard", number>;
type ManualActingPlayerPreference = "active-first" | "scoped-first";
export type ResolutionExecutionOptions = {
  /**
   * Target selection for effect resolution.
   *
   * - **Flat array**: single-filter "pick N" effects (`targets: [char1, char2]`).
   * - **Slotted object**: effects with multiple distinct filter steps
   *   (`targets: { kind: "move-damage", from: [a], to: [b] }`). Prefer this form
   *   whenever positional ordering would be ambiguous. See
   *   `targeting/slotted-targets.ts` for the registry of slotted kinds.
   */
  targets?: readonly (CardInput | PlayerId)[] | SlottedTargetInputOf<CardInput | PlayerId>;
  playerTargets?: PlayerId | PlayerId[];
  amount?: number;
  namedCard?: string;
  resolveOptional?: boolean;
  enterPlayExerted?: boolean;
  choiceIndex?: number;
  destinations?: PlayCardDestinationInput[];
  bagIndex?: number;
};
export type PlayCardExecutionOptions = ResolutionExecutionOptions & {
  cost?: PlayCardCostInput;
  playerTargets?: PlayerId | PlayerId[];
  returnProcessedMove?: boolean;
  preventAutoResolveTriggeredEffects?: boolean;
  eventSnapshot?: DynamicAmountEventSnapshot;
};
export type PlayCardDestinationInput = {
  zone: string;
  cards: CardInput | CardInput[];
};
type PlayCardMoveArgs = LorcanaRuntimeMoveParams["playCard"];
type PlayCardMoveCost = PlayCardMoveArgs["cost"];
type PlayCardMoveCostParams<TCost extends PlayCardMoveCost> = Omit<
  Extract<PlayCardMoveArgs, { cost: TCost }>,
  "cardId" | "cost"
>;
export type ActivateAbilityExecutionOptions = {
  ability?: string;
  abilityIndex?: number;
  targets?: CardInput[];
  /** Structured effect selections; merged into `targets` for the runtime move. */
  effectSelections?: LorcanaRuntimeMoveParams["activateAbility"]["effectSelections"];
  choiceIndex?: number;
  preventAutoResolveTriggeredEffects?: boolean;
  costs?: {
    banishCharacters?: CardInput[];
    banishItems?: CardInput[];
    exertCharacters?: CardInput[];
    exertItems?: CardInput[];
    discardCards?: CardInput[];
  };
};
export type { PlayCardCostInput } from "./lorcana-engine-normalization";

export interface ChallengePreviewResult {
  attackerId: CardInstanceId;
  defenderId: CardInstanceId;
  defenderKind: "character" | "location";
  attackerCurrentDamage: number;
  defenderCurrentDamage: number;
  attackerNextDamage: number;
  defenderNextDamage: number;
  attackerWillpower: number;
  defenderWillpower: number;
  attackerDamageDealt: number;
  defenderDamageDealt: number;
  attackerWouldBeBanished: boolean;
  defenderWouldBeBanished: boolean;
  attackerDamageIsReduced: boolean;
  defenderDamageIsReduced: boolean;
}

const ACTIVATION_DISCOVERY_PENDING_CODES = new Set([
  "ABILITY_COST_SELECTION_MISSING",
  "TOO_FEW_TARGETS",
]);

function isDiscoverableActivateAbilityValidation(validation: EngineMoveValidationResult): boolean {
  return (
    validation.valid ||
    (typeof validation.code === "string" && ACTIVATION_DISCOVERY_PENDING_CODES.has(validation.code))
  );
}

/** Wire-level move name aliases → canonical runtime move identifiers. */
const MOVE_ALIASES: Record<string, string> = {
  ink: "putCardIntoInkwell",
  mulligan: "alterHand",
};

export abstract class LorcanaEngineBase {
  abstract engine: GameEngine;
  protected players: Player[];
  protected cardInstanceToDefinitionId: Map<string, string>;
  protected cardCatalog: CardCatalog;
  staticResources: MatchStaticResources;

  // Perf: getAvailableMoves() is pure for a given stateID — same state always
  // produces the same result. Caching eliminates redundant O(n×m) validateMove()
  // calls across all callers (UI refresh, DnD checks, card hover, etc.).
  private _cachedAvailableMoves: AvailableMove[] | null = null;
  private _cachedAvailableMovesStateID: number = -1;
  private _cachedLegalMoveIds: Array<keyof LorcanaRuntimeMoveInputs & string> = [];
  private _cachedLegalMoveIdsStateID: number = -1;
  private _cachedChallengeAttackersStateID: number = -1;
  private _cachedChallengeAttackers: CardInstanceId[] = [];
  private _cachedChallengeMoveOptionsStateID: number = -1;
  private _cachedChallengeMoveOptions = new Map<CardInstanceId, MoveOption[]>();

  private getPlayerZoneCardIdsForMoveOptions(
    playerId: string,
    zone: "hand" | "play",
  ): CardInstanceId[] {
    const playerBoard = this.getBoard().players[playerId];
    if (!playerBoard) {
      return [];
    }

    return (zone === "hand" ? playerBoard.hand : playerBoard.play).map(
      (id) => id as CardInstanceId,
    );
  }

  private matchesDiscardSelectableCostRequirements(
    definition: LorcanaCardDefinition | undefined,
    cost: {
      discardCardType?: string;
      discardCardName?: string;
    },
  ): boolean {
    if (!definition) {
      return false;
    }

    if (cost.discardCardType === "song") {
      if (definition.cardType !== "action" || !isSongCard(definition as LorcanaCard)) {
        return false;
      }
    } else if (cost.discardCardType && definition.cardType !== cost.discardCardType) {
      return false;
    }

    if (
      cost.discardCardName &&
      !cardHasName(definition as LorcanaCardDefinition, cost.discardCardName)
    ) {
      return false;
    }

    return true;
  }

  private getSelectableCostsForActivatedAbility(
    playerId: string,
    sourceCardId: CardInstanceId,
    ability: AbilityDefinition,
  ): MoveOptionSelectableCost[] {
    if (ability.type !== "activated") {
      return [];
    }

    const playableCards = this.getPlayerZoneCardIdsForMoveOptions(playerId, "play");
    const handCards = this.getPlayerZoneCardIdsForMoveOptions(playerId, "hand");
    const selectableCosts: MoveOptionSelectableCost[] = [];
    const discardCount =
      typeof ability.cost?.discardCards === "number"
        ? Math.max(0, Math.floor(ability.cost.discardCards))
        : typeof ability.cost?.discardCard === "number"
          ? Math.max(0, Math.floor(ability.cost.discardCard))
          : typeof ability.cost?.discard === "object" &&
              typeof ability.cost.discard.amount === "number"
            ? Math.max(0, Math.floor(ability.cost.discard.amount))
            : 0;

    if (discardCount > 0) {
      const discardCardType =
        ability.cost?.discardCardType ??
        (typeof ability.cost?.discard === "object" ? ability.cost.discard.cardType : undefined);
      const discardCardName = ability.cost?.discardCardName;
      const candidateCardIds = handCards.filter((cardId) =>
        this.matchesDiscardSelectableCostRequirements(this.getCardDefinitionByInstanceId(cardId), {
          discardCardType,
          discardCardName,
        }),
      );

      selectableCosts.push({
        kind: "discardCards",
        count: discardCount,
        candidateCardIds,
        zone: "hand",
        ...(discardCardType ? { cardType: discardCardType } : {}),
        ...(discardCardName ? { cardName: discardCardName } : {}),
      });
    }

    const exertCharacterCount =
      typeof ability.cost?.exertCharacters === "number"
        ? Math.max(0, Math.floor(ability.cost.exertCharacters))
        : ability.cost?.exertCharacter
          ? 1
          : 0;
    if (exertCharacterCount > 0) {
      const classification = ability.cost?.exertCharactersClassification;
      const candidateCardIds = playableCards.filter((cardId) => {
        if (ability.cost?.exert === true && cardId === sourceCardId) {
          return false;
        }

        const definition = this.getCardDefinitionByInstanceId(cardId);
        if (!definition || definition.cardType !== "character") {
          return false;
        }

        if (classification) {
          const classifications =
            (definition as { classifications?: string[] }).classifications ?? [];
          if (!classifications.includes(classification)) {
            return false;
          }
        }

        return !this.isExerted(cardId) && !this.isDrying(cardId);
      });

      selectableCosts.push({
        kind: "exertCharacters",
        count: exertCharacterCount,
        candidateCardIds,
        zone: "play",
        cardType: "character",
        ...(classification ? { classification } : {}),
      });
    }

    const exertItemCount =
      typeof ability.cost?.exertItems === "number"
        ? Math.max(0, Math.floor(ability.cost.exertItems))
        : 0;
    if (exertItemCount > 0) {
      const candidateCardIds = playableCards.filter((cardId) => {
        const definition = this.getCardDefinitionByInstanceId(cardId);
        return definition?.cardType === "item" && !this.isExerted(cardId);
      });
      selectableCosts.push({
        kind: "exertItems",
        count: exertItemCount,
        candidateCardIds,
        zone: "play",
        cardType: "item",
      });
    }

    const banishCharacterCount = ability.cost?.banishCharacter ? 1 : 0;
    if (banishCharacterCount > 0) {
      const validationContext = buildValidationContext({
        state: this.getState() as LorcanaMatchState,
        playerId,
        input: { args: {} } as LorcanaRuntimeMoveInputs["passTurn"],
        config: lorcanaRuntimeConfig as unknown as MatchRuntimeConfig,
        staticResources: this.getResolvedStaticResources(),
        gameEnded: !!this.getState().ctx.status.gameEnded,
        validationMode: "preflight",
      });
      const candidateCardIds = getBanishCharacterCostCandidateIds(
        validationContext,
        playerId as PlayerId,
        ability as ActivatedAbilityDefinition,
        sourceCardId,
      );
      selectableCosts.push({
        kind: "banishCharacters",
        count: banishCharacterCount,
        candidateCardIds,
        zone: "play",
        cardType: "character",
      });
    }

    const banishItemCount =
      typeof ability.cost?.banishItem === "number"
        ? Math.max(0, Math.floor(ability.cost.banishItem))
        : ability.cost?.banishItem
          ? 1
          : 0;
    if (banishItemCount > 0) {
      const candidateCardIds = playableCards.filter(
        (cardId) => this.getCardDefinitionByInstanceId(cardId)?.cardType === "item",
      );
      selectableCosts.push({
        kind: "banishItems",
        count: banishItemCount,
        candidateCardIds,
        zone: "play",
        cardType: "item",
      });
    }

    return selectableCosts;
  }

  private getSelectableCostsForShift(
    playerId: string,
    cardDef: LorcanaCard,
  ): MoveOptionSelectableCost[] {
    const shiftRules = getShiftRules(cardDef);
    if (!shiftRules?.discardCost) {
      return [];
    }

    const handCards = this.getPlayerZoneCardIdsForMoveOptions(playerId, "hand");
    const candidateCardIds = handCards.filter((cardId) =>
      this.matchesDiscardSelectableCostRequirements(this.getCardDefinitionByInstanceId(cardId), {
        discardCardType: shiftRules.discardCost?.discardCardType,
      }),
    );

    return [
      {
        kind: "discardCards",
        count: shiftRules.discardCost.discardCards,
        candidateCardIds,
        zone: "hand",
        ...(shiftRules.discardCost.discardCardType
          ? { cardType: shiftRules.discardCost.discardCardType }
          : {}),
      },
    ];
  }

  private hasSufficientSelectableCosts(
    selectableCosts: readonly MoveOptionSelectableCost[],
  ): boolean {
    return selectableCosts.every((cost) => cost.candidateCardIds.length >= cost.count);
  }

  private canDiscoverShiftPlay(cardId: CardInstanceId, shiftTarget: CardInstanceId): boolean {
    const validation = this.validateMove("playCard", {
      args: {
        cardId,
        cost: "shift",
        shiftTarget,
      },
    });

    return validation.valid || validation.code === "SHIFT_DISCARD_REQUIRED";
  }

  protected constructor(init: LorcanaBaseEngineParams) {
    const initialized = initializeLorcanaEngineBase(init);
    this.players = initialized.players;
    this.staticResources = initialized.staticResources;
    this.cardInstanceToDefinitionId = initialized.cardInstanceToDefinitionId;
    this.cardCatalog = initialized.cardCatalog;
  }

  // ============================================================================
  // Abstract Methods - Must be implemented by subclasses
  // ============================================================================
  abstract getClientPlayerId(): string | undefined;

  public turnActions() {
    // 4.1.3. The active player can take the following turn actions during their turn: ink a card, play a card, use a card’s activated ability, quest, challenge, and move a character to a location.
    return [];
  }

  protected executeMoveViaEngine<K extends keyof LorcanaRuntimeMoveInputs & string>(
    _moveId: K,
    _input: LorcanaRuntimeMoveInputs[K],
    _ctx: { playerId: string; prevStateID?: number },
  ): CommandResult | undefined {
    return undefined;
  }

  protected validateMoveForPlayerViaEngine<K extends keyof LorcanaRuntimeMoveInputs & string>(
    _moveId: K,
    _input: LorcanaRuntimeMoveInputs[K],
    _ctx: { playerId: string },
  ): EngineMoveValidationResult | undefined {
    return undefined;
  }

  protected enumerateMovesForPlayerViaEngine(
    playerId: string,
  ): Array<keyof LorcanaRuntimeMoveInputs & string> {
    void playerId;
    return this.enumerateMoves();
  }

  protected getResolvedStaticResources(): MatchStaticResources {
    return this.staticResources;
  }

  protected getAutomatedPlanningBoardForPlayer(_playerId: PlayerId): LorcanaProjectedBoardView {
    return this.getBoard();
  }

  protected loadStateViaEngine(_state: MatchState): void {
    throw new Error("loadState is not supported by this engine implementation");
  }

  private shouldSkipImmediateAutoBagDrain<K extends keyof LorcanaRuntimeMoveInputs & string>(
    moveId: K,
    input: LorcanaRuntimeMoveInputs[K],
  ): boolean {
    if (moveId === "playCard") {
      return (
        (input as LorcanaRuntimeMoveInputs["playCard"]).args.preventAutoResolveTriggeredEffects ===
        true
      );
    }

    if (moveId === "activateAbility") {
      return (
        (input as LorcanaRuntimeMoveInputs["activateAbility"]).args
          .preventAutoResolveTriggeredEffects === true
      );
    }

    if (moveId === "resolveEffect") {
      const effectId = (input as LorcanaRuntimeMoveInputs["resolveEffect"]).args.effectId;
      const pendingEffect = (this.getState().G.pendingEffects ?? []).find(
        (effect) => effect.id === effectId,
      );
      return pendingEffect?.resolutionInput.preventAutoResolveTriggeredEffects === true;
    }

    return false;
  }

  private bagEffectNeedsPlayerDecision(
    bagEffect: BagEffectEntry,
    playerId: PlayerId,
    ctx: ActionTargetResolutionContext,
  ): boolean {
    const requirements = analyzeResolutionRequirements(bagEffect.effect as Effect | undefined);
    if (requirements.canAutoResolve) {
      return false;
    }

    if (bagEffect.autoResolve === true) {
      return false;
    }

    // CRD 6.2.7: If the ability's intervening-if condition will fail at resolution,
    // the effect will be skipped in execute() — no player input is needed.
    if (
      bagEffect.condition !== undefined &&
      bagEffect.condition !== null &&
      !evaluateActionCondition(
        bagEffect.condition as Parameters<typeof evaluateActionCondition>[0],
        ctx as unknown as Parameters<typeof evaluateActionCondition>[1],
        bagEffect.cardPlayed,
        cloneActionResolutionInput(bagEffect.resolutionInput as ActionResolutionInput),
      )
    ) {
      return false;
    }

    // CR 6.1.5.2: If an "or" effect has only one currently legal option, the choice is forced
    // and no player decision is needed — auto-resolve to the only legal branch.
    if (requirements.requiresChoiceSelection && isOrLikeEffectRecord(bagEffect.effect)) {
      const legalCount = countLegalOrOptions(bagEffect.effect, bagEffect.chooserId, ctx);
      if (legalCount <= 1) {
        return false;
      }
    }

    // For scry effects, requiresDestinationSelection is set statically (no runtime amount check).
    // At runtime, if the deck is empty or the variable amount resolves to 0, the effect fizzles —
    // no player decision is needed.
    if (requirements.requiresDestinationSelection && isScryEffect(bagEffect.effect)) {
      const deckSize = ctx.framework.zones.getCards({
        zone: "deck",
        playerId: bagEffect.cardPlayed.playerId,
      }).length;
      if (deckSize === 0) {
        return false;
      }

      // When the scry amount is derived from cards-under-self, resolve it now.
      // Other amount types (fixed numbers, etc.) are not checked here.
      const amountExpr = (bagEffect.effect as { amount?: unknown }).amount;
      if (
        amountExpr !== null &&
        typeof amountExpr === "object" &&
        (amountExpr as Record<string, unknown>).type === "cards-under-self"
      ) {
        const cardsUnder = ctx.cards.require(bagEffect.sourceId).meta?.cardsUnder;
        if (!Array.isArray(cardsUnder) || cardsUnder.length === 0) {
          return false;
        }
      }
    }

    if (
      shouldSkipEffectWithNoValidTargets(
        bagEffect.effect,
        playerId,
        ctx,
        bagEffect.sourceId as CardInstanceId,
        "bag-decision",
      )
    ) {
      return false;
    }

    if (requirements.isOptional) {
      // Special case: a top-level sequence whose first step is mandatory and
      // auto-resolvable, with the optional being a *later* step (e.g. Woody
      // Jungle Guide: "draw a card. Then, you may play a character..."). When
      // the chooser's hand is empty, the optional cannot have any candidates
      // until the leading draw resolves — so partially auto-drain the
      // mandatory step(s) and let the optional surface a pending decision
      // afterwards. When the hand already has cards, leave the trigger in the
      // bag for the player to resolve manually with their chosen targets.
      const effectRecord = bagEffect.effect as unknown as
        | Record<string, unknown>
        | null
        | undefined;
      if (effectRecord?.type === "sequence") {
        const steps = Array.isArray(effectRecord.steps) ? effectRecord.steps : [];
        const firstStep = steps[0];
        if (firstStep && typeof firstStep === "object") {
          const firstStepRequirements = analyzeResolutionRequirements(firstStep as Effect);
          const firstStepType = (firstStep as { type?: unknown }).type;
          if (
            firstStepRequirements.canAutoResolve &&
            firstStepType === "draw" &&
            !hasDeferredNonControllerDecision(firstStep)
          ) {
            const handCards = ctx.framework.zones.getCards({
              zone: "hand",
              playerId: bagEffect.controllerId as PlayerId,
            });
            if (handCards.length === 0) {
              return false;
            }
          }
        }
      }
      return true;
    }

    if (
      requirements.requiresChoiceSelection ||
      requirements.requiresNamedCardSelection ||
      requirements.requiresDestinationSelection ||
      requirements.requiresOrderedTargetSelection ||
      requirements.requiresAmountSelection
    ) {
      return true;
    }

    if (!requirements.requiresExplicitTargetSelection) {
      return true;
    }

    return !analyzeTargetSelectionAvailability(
      bagEffect.effect as Effect | undefined,
      playerId,
      ctx,
      bagEffect.sourceId as CardInstanceId,
    ).shouldAutoRejectForNoValidTargets;
  }

  private getAutoResolvableBagId(playerId: string): string | undefined {
    return this.getAutoResolvableBagIdFromState(this.getState(), playerId);
  }

  private getAutoResolvableBagIdFromState(
    state: DeepReadonly<LorcanaMatchState>,
    playerId: string,
  ): string | undefined {
    if (state.ctx.status.gameEnded) {
      return undefined;
    }
    if ((state.G.pendingEffects?.length ?? 0) > 0) {
      return undefined;
    }
    if (state.ctx.priority.pendingChoice?.type === "action-effect") {
      return undefined;
    }

    const validationContext = buildValidationContext({
      state: state as unknown as LorcanaMatchState,
      playerId,
      input: { args: {} } as LorcanaRuntimeMoveInputs["passTurn"],
      config: lorcanaRuntimeConfig as unknown as MatchRuntimeConfig,
      staticResources: this.getResolvedStaticResources(),
      gameEnded: !!state.ctx.status.gameEnded,
      validationMode: "preflight",
    });
    if (
      getNextBagResolver(
        validationContext as unknown as Parameters<typeof getNextBagResolver>[0],
      ) !== playerId
    ) {
      return undefined;
    }

    // Read bag items directly from raw state. When multiple items are pending for the
    // same resolver, only auto-drain if they are duplicate resolutions of the same printed
    // ability on the same card (same sourceId + abilityId). Otherwise the player must
    // resolve order across different triggers (e.g. two characters with the same trigger).
    const bagItems = (state.G.triggeredAbilities?.bag?.items ?? []) as BagEffectEntry[];
    const playerBagEffects = bagItems.filter((entry) => entry.controllerId === playerId);
    if (playerBagEffects.length === 0) {
      return undefined;
    }

    const actionCtx = validationContext as unknown as ActionTargetResolutionContext;

    if (playerBagEffects.length > 1) {
      const distinctAbilities = new Set(
        playerBagEffects.map((entry) => `${entry.sourceId}:${entry.abilityId}`),
      );
      if (distinctAbilities.size !== 1) {
        const autoResolveEntries = playerBagEffects.filter((entry) => entry.autoResolve === true);
        for (const bagEntry of autoResolveEntries) {
          if (!this.bagEffectNeedsPlayerDecision(bagEntry, playerId as PlayerId, actionCtx)) {
            return bagEntry.id;
          }
        }
        return undefined;
      }
    }

    for (const bagEntry of playerBagEffects) {
      if (this.bagEffectNeedsPlayerDecision(bagEntry, playerId as PlayerId, actionCtx)) {
        // The effect needs player decisions. If it's the only bag item, mandatory,
        // and the decisions are made by someone other than the controller (e.g., opponent
        // chooser), auto-accept from the bag since the controller has nothing to decide.
        // The resolveBag move will suspend into pending effects for the chooser's decisions.
        //
        // The check must recurse into nested effects (for-each-opponent, sequence, optional,
        // conditional, etc.) because the opponent-chooser field may appear on a child
        // effect rather than the top-level wrapper. For example, Leviathan's Lair uses
        // for-each-opponent wrapping a banish with chosenBy: "opponent".
        const isOpponentChooser = hasOpponentChosenEffect(bagEntry.effect);
        if (
          bagItems.length === 1 &&
          !analyzeResolutionRequirements(bagEntry.effect as Effect | undefined).isOptional &&
          isOpponentChooser
        ) {
          return bagEntry.id;
        }
        continue;
      }

      return bagEntry.id;
    }

    return undefined;
  }

  private autoResolveDeterministicBagEffects(
    playerId: string,
    initialResult: CommandResult,
    options: { autoBagDrainResolverScope?: AutoBagDrainResolverScope } = {},
  ): CommandResult {
    let currentResult = initialResult;
    const maxAutoResolveAttempts = 25;

    for (let attempts = 0; attempts < maxAutoResolveAttempts; attempts += 1) {
      const state = this.getState();
      const validationContext = buildValidationContext({
        state: state as LorcanaMatchState,
        playerId,
        input: { args: {} } as LorcanaRuntimeMoveInputs["passTurn"],
        config: lorcanaRuntimeConfig as unknown as MatchRuntimeConfig,
        staticResources: this.getResolvedStaticResources(),
        gameEnded: !!state.ctx.status.gameEnded,
        validationMode: "preflight",
      });
      const nextResolver = getNextBagResolver(
        validationContext as unknown as Parameters<typeof getNextBagResolver>[0],
      );
      const bagId = nextResolver ? this.getAutoResolvableBagId(nextResolver) : undefined;
      const scopedPlayerId = this.getScopedPlayerId();
      if (
        !nextResolver ||
        !bagId ||
        (scopedPlayerId && nextResolver !== scopedPlayerId) ||
        (options.autoBagDrainResolverScope === "acting-player" && nextResolver !== playerId)
      ) {
        return currentResult;
      }

      const autoResult = this.executeMoveInputForPlayer(
        "resolveBag",
        nextResolver,
        {
          args: {
            bagId,
          },
        },
        undefined,
        { skipAutoBagDrain: true },
      );
      if (!autoResult.success) {
        console.error(`Auto-resolving bag effect '${bagId}' failed`, autoResult);
        return currentResult;
      }

      currentResult = autoResult;
    }

    console.error(
      `Stopped auto-resolving deterministic bag effects after ${maxAutoResolveAttempts} attempts for player '${playerId}' to prevent an infinite loop.`,
    );
    return currentResult;
  }

  /**
   * Drain deterministic bag effects inside a sandbox MatchRuntime.
   * Used by the optimistic state builder so the optimistic state matches
   * what the server will produce after auto-resolving trivial bag effects.
   */
  protected drainDeterministicBagEffectsInSandbox(
    sandboxRuntime: MatchRuntime,
    playerId: string,
    _originalStateID: number, // Required by sandboxPostProcess contract; unused here because the sandbox starts from the correct post-move state
  ): void {
    const maxAttempts = 25;

    for (let i = 0; i < maxAttempts; i++) {
      const state = sandboxRuntime.getState() as LorcanaMatchState;
      const bagId = this.getAutoResolvableBagIdFromState(state, playerId);

      if (!bagId) {
        return;
      }

      const currentStateID = sandboxRuntime.getCurrentStateID();
      const result = sandboxRuntime.processCommand(
        {
          commandID: `sandbox-drain-${i}`,
          move: "resolveBag",
          input: { args: { bagId } },
        },
        playerId,
        currentStateID,
        Date.now(),
        "player",
      );

      if (!result.success) {
        logger.warning(`Sandbox auto-drain of bag effect '${bagId}' failed`, {
          error: result.error ?? "unknown",
        });
        return;
      }
    }

    logger.warning(
      `Sandbox auto-drain stopped after ${maxAttempts} attempts for player '${playerId}'`,
    );
  }

  protected validateMoveForPlayer<K extends keyof LorcanaRuntimeMoveInputs & string>(
    playerId: string,
    moveId: K,
    input: LorcanaRuntimeMoveInputs[K],
  ): EngineMoveValidationResult {
    const engineResult = this.validateMoveForPlayerViaEngine(moveId, input, {
      playerId,
    });
    if (engineResult) {
      return engineResult;
    }

    const scopedPlayerId = this.getScopedPlayerId();
    if (scopedPlayerId && scopedPlayerId !== playerId) {
      return {
        valid: false,
        reason: "This engine instance is scoped to a different player",
        code: "PLAYER_SCOPE_MISMATCH",
      };
    }

    return this.engine.validateMove(moveId, input);
  }

  protected executeMoveInputForPlayer<K extends keyof LorcanaRuntimeMoveInputs & string>(
    moveId: K,
    playerId: string,
    input: LorcanaRuntimeMoveInputs[K],
    prevStateID?: number,
    options: {
      autoBagDrainResolverScope?: AutoBagDrainResolverScope;
      skipAutoBagDrain?: boolean;
    } = {},
  ): CommandResult {
    logger.debug(
      "Executing move {moveId} player={playerId} prevStateID={prevStateID} input={input.args}",
      { moveId, playerId, input, prevStateID, options },
    );
    const engineResult = this.executeMoveViaEngine(moveId, input, {
      playerId,
      prevStateID,
    });
    const skipAutoBagDrain =
      options.skipAutoBagDrain || this.shouldSkipImmediateAutoBagDrain(moveId, input);

    const maybeAutoDrain = (result: CommandResult): CommandResult =>
      !result.success || skipAutoBagDrain
        ? result
        : this.autoResolveDeterministicBagEffects(playerId, result, {
            autoBagDrainResolverScope: options.autoBagDrainResolverScope,
          });

    const summarizePostMoveState = (): {
      bag: Array<{ id: string; type: string; chooserId: string; sourceId?: string }>;
      pendingEffects: Array<{ id: string; type: string; sourceId?: string }>;
      pendingChoice?: { type: string; playerID: string; requestID: string };
      turnPlayer: string | null;
      priorityPlayer: string | null;
      phase?: string;
      step?: string | null;
    } => {
      const board = this.getBoard();
      return {
        bag: this.getBagEffects().map((b) => ({
          id: b.id,
          type: b.type,
          chooserId: b.chooserId,
          sourceId: b.sourceId,
        })),
        pendingEffects: this.getPendingEffects().map((p) => ({
          id: p.id,
          type: p.type,
          sourceId: p.sourceId,
        })),
        pendingChoice: this.getPendingChoice(),
        turnPlayer: board.turnPlayer ?? null,
        priorityPlayer: board.priorityPlayer ?? null,
        phase: board.phase,
        step: board.step ?? null,
      };
    };

    const logResult = (result: CommandResult): CommandResult => {
      if (result.success) {
        const snapshot = summarizePostMoveState();
        logger.debug(
          "Move {moveId} OK player={playerId} stateID={stateID} bag={bag} pendingEffects={pendingEffects} pendingChoice={pendingChoice} turnPlayer={turnPlayer} priorityPlayer={priorityPlayer} phase={phase} step={step}",
          {
            moveId,
            playerId,
            stateID: result.stateID,
            bag: snapshot.bag,
            bagCount: snapshot.bag.length,
            pendingEffects: snapshot.pendingEffects,
            pendingEffectCount: snapshot.pendingEffects.length,
            pendingChoice: snapshot.pendingChoice,
            turnPlayer: snapshot.turnPlayer,
            priorityPlayer: snapshot.priorityPlayer,
            phase: snapshot.phase,
            step: snapshot.step,
          },
        );
      } else {
        logger.warning(
          "Move {moveId} FAILED player={playerId} code={errorCode} error={error} input={input}",
          {
            moveId,
            playerId,
            errorCode: result.errorCode,
            error: result.error,
            input,
          },
        );
      }
      return result;
    };

    if (engineResult) {
      return logResult(maybeAutoDrain(engineResult));
    }

    try {
      const result = this.engine.executeMove(moveId, input);

      if (!result.success) {
        return logResult({
          success: false,
          error:
            "reason" in result && result.reason ? String(result.reason) : "Move execution failed",
          errorCode: "code" in result && result.code ? String(result.code) : "EXECUTE_FAILED",
          currentStateID: this.getStateID(),
        });
      }

      return logResult(maybeAutoDrain(result as CommandResult));
    } catch (error) {
      logger.error("Move {moveId} THREW player={playerId} error={error}", {
        moveId,
        playerId,
        error,
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        errorCode: "EXECUTE_FAILED",
        currentStateID: this.getStateID(),
      };
    }
  }

  /**
   * Generic move dispatch — accepts a move type string and flat payload, routes
   * through the same `executeMoveInputForPlayer` path used by all convenience
   * methods. Works identically on both LorcanaClient (optimistic + transport)
   * and LorcanaServer (authoritative execution).
   */
  dispatch(moveType: string, actorId: string, payload: Record<string, unknown>): CommandResult {
    const resolvedMove = MOVE_ALIASES[moveType] ?? moveType;

    if (resolvedMove === "undo") {
      return this.undo(actorId);
    }

    return this.executeMoveInputForPlayer(
      resolvedMove as keyof LorcanaRuntimeMoveInputs & string,
      actorId,
      { args: payload } as LorcanaRuntimeMoveInputs[keyof LorcanaRuntimeMoveInputs & string],
    );
  }

  protected validateAutomatedActionCandidate(
    actorId: PlayerId,
    candidate: AutomatedActionCandidate,
  ): EngineMoveValidationResult {
    const request = buildAutomatedActionMoveRequest(
      actorId,
      candidate,
      this.getState().ctx.playerIds as PlayerId[],
    );
    return this.validateMoveForPlayer(
      actorId,
      request.moveId,
      request.input as LorcanaRuntimeMoveInputs[typeof request.moveId],
    );
  }

  protected executeAutomatedActionCandidate(
    actorId: PlayerId,
    candidate: AutomatedActionCandidate,
    options: { autoBagDrainResolverScope?: AutoBagDrainResolverScope } = {},
  ): CommandResult {
    const request = buildAutomatedActionMoveRequest(
      actorId,
      candidate,
      this.getState().ctx.playerIds as PlayerId[],
    );
    return this.executeMoveInputForPlayer(
      request.moveId,
      actorId,
      request.input as LorcanaRuntimeMoveInputs[typeof request.moveId],
      undefined,
      options,
    );
  }

  private createScopedAutomationDiagnostics(
    actorId: PlayerId | undefined,
  ): AutomatedActionDiagnostic[] {
    return actorId
      ? [
          {
            kind: "actor-resolution",
            source: "scoped-player",
            actorId,
            reason: "Resolved automated action actor from the scoped player engine",
          },
        ]
      : [
          {
            kind: "actor-resolution",
            source: "unresolved",
            reason: "Automated player actions require a player-scoped engine surface",
          },
        ];
  }

  public enumerateAutomatedActions(
    options: AutomatedActionEnumerationOptions = {},
  ): AutomatedActionEnumerationResult {
    const actorId = this.getScopedPlayerId() as PlayerId | undefined;
    const board = actorId ? this.getAutomatedPlanningBoardForPlayer(actorId) : this.getBoard();

    return enumerateAutomatedActionsWithAdapter(
      {
        actorId,
        availableMoveIds: actorId ? this.enumerateMovesForPlayerViaEngine(actorId) : [],
        board,
        concede: (resolvedActorId) =>
          this.executeMoveInputForPlayer("concede", resolvedActorId, {
            args: {
              playerId: resolvedActorId,
            },
          }),
        createErrorResult: (error, errorCode) => this.createErrorResult(error, errorCode),
        createNoopResult: () => this.createNoopResult(),
        executeCandidate: (resolvedActorId, candidate) =>
          this.executeAutomatedActionCandidate(resolvedActorId, candidate),
        getDefinitionByInstanceId: (cardId) =>
          this.getCardDefinitionByInstanceId(cardId) as LorcanaCard,
        passTurn: (resolvedActorId) =>
          this.executeMoveInputForPlayer("passTurn", resolvedActorId, {
            args: {},
          }),
        previewChallenge: (attackerId, defenderId) => this.previewChallenge(attackerId, defenderId),
        state: this.getState(),
        staticResources: this.getResolvedStaticResources(),
        validateCandidate: (resolvedActorId, candidate) =>
          this.validateAutomatedActionCandidate(resolvedActorId, candidate),
      },
      options,
      this.createScopedAutomationDiagnostics(actorId),
    );
  }

  public takeAutomatedAction(
    options: AutomatedActionExecutionOptions = {},
  ): AutomatedActionExecutionResult {
    const actorId = this.getScopedPlayerId() as PlayerId | undefined;
    const board = actorId ? this.getAutomatedPlanningBoardForPlayer(actorId) : this.getBoard();

    return takeAutomatedActionWithAdapter(
      {
        actorId,
        availableMoveIds: actorId ? this.enumerateMovesForPlayerViaEngine(actorId) : [],
        board,
        concede: (resolvedActorId) =>
          this.executeMoveInputForPlayer("concede", resolvedActorId, {
            args: {
              playerId: resolvedActorId,
            },
          }),
        createErrorResult: (error, errorCode) => this.createErrorResult(error, errorCode),
        createNoopResult: () => this.createNoopResult(),
        executeCandidate: (resolvedActorId, candidate) =>
          this.executeAutomatedActionCandidate(resolvedActorId, candidate),
        getDefinitionByInstanceId: (cardId) =>
          this.getCardDefinitionByInstanceId(cardId) as LorcanaCard,
        passTurn: (resolvedActorId) =>
          this.executeMoveInputForPlayer("passTurn", resolvedActorId, {
            args: {},
          }),
        previewChallenge: (attackerId, defenderId) => this.previewChallenge(attackerId, defenderId),
        state: this.getState(),
        staticResources: this.getResolvedStaticResources(),
        validateCandidate: (resolvedActorId, candidate) =>
          this.validateAutomatedActionCandidate(resolvedActorId, candidate),
      },
      options,
      this.createScopedAutomationDiagnostics(actorId),
    );
  }
  /**
   * Execute a move with the given parameters.
   */
  private executeMove<K extends keyof LorcanaRuntimeMoveParams & string>(
    moveId: K,
    input: LorcanaRuntimeMoveInputs[K],
  ): CommandResult;
  private executeMove<K extends keyof LorcanaRuntimeMoveParams & string>(
    moveId: K,
    playerId: string,
    params: LorcanaRuntimeMoveParams[K],
    prevStateID?: number,
  ): CommandResult;
  private executeMove<K extends keyof LorcanaRuntimeMoveParams & string>(
    moveId: K,
    playerOrInput: string | LorcanaRuntimeMoveInputs[K],
    paramsOrPrevStateID?: LorcanaRuntimeMoveParams[K] | number,
    prevStateID?: number,
  ): CommandResult {
    let playerId: string;
    let input: LorcanaRuntimeMoveInputs[K];
    if (typeof playerOrInput === "string") {
      playerId = playerOrInput;
      try {
        input = this.composeMoveInput(
          moveId,
          playerId,
          paramsOrPrevStateID as LorcanaRuntimeMoveParams[K],
        );
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to compose move input",
          errorCode: "MOVE_INPUT_COMPOSE_FAILED",
          currentStateID: this.getStateID(),
        };
      }
    } else {
      input = playerOrInput;
      playerId = this.getClientPlayerId() ?? String(this.getActivePlayer() ?? "");
      if (!playerId) {
        return {
          success: false,
          error: `Unable to execute move '${moveId}': missing player context`,
          errorCode: "MISSING_PLAYER_CONTEXT",
          currentStateID: this.getStateID(),
        };
      }
      if (typeof paramsOrPrevStateID === "number") {
        prevStateID = paramsOrPrevStateID;
      }
    }

    return this.executeMoveInputForPlayer(moveId, playerId, input, prevStateID);
  }

  private composeMoveInput<K extends keyof LorcanaRuntimeMoveParams>(
    moveId: K,
    playerId: string,
    params: LorcanaRuntimeMoveParams[K],
  ): LorcanaRuntimeMoveInputs[K] {
    void moveId;
    void playerId;
    return { args: params } as LorcanaRuntimeMoveInputs[K];
  }

  // ============================================================================
  // Shared Utility Methods
  // ============================================================================

  dispose(): void | Promise<void> {
    return this.engine.dispose();
  }

  getMoveHistory(limit?: number): EngineMoveHistoryEntry[] {
    return this.engine.getMoveHistory(limit);
  }

  canUndo(playerId?: string): boolean {
    const resolvedPlayerId =
      playerId ?? this.getScopedPlayerId() ?? String(this.getActivePlayer() ?? "");
    if (!resolvedPlayerId) {
      return false;
    }

    return this.engine.canUndo?.(resolvedPlayerId) ?? false;
  }

  undo(playerId?: string): CommandResult {
    const resolvedPlayerId =
      playerId ?? this.getScopedPlayerId() ?? String(this.getActivePlayer() ?? "");
    if (!resolvedPlayerId) {
      return this.createErrorResult(
        "undo requires a player id when used from a non-player-scoped engine.",
        "PLAYER_ID_REQUIRED",
      );
    }

    const wasAccepted = this.engine.undo?.(resolvedPlayerId, this.getStateID()) ?? false;
    if (!wasAccepted) {
      return this.createErrorResult("Cannot undo right now.", "UNDO_NOT_AVAILABLE");
    }

    return {
      success: true,
      stateID: this.getStateID(),
      state: this.getState() as LorcanaMatchState,
      patches: [],
      gameEvents: [],
      processedCommand: {
        commandID: `undo-${resolvedPlayerId}-${Date.now()}`,
        move: "undo",
      },
      animations: [],
      undoable: false,
      moveLogs: [],
    };
  }

  validateMove<K extends keyof LorcanaRuntimeMoveInputs & string>(
    moveId: K,
    input: LorcanaRuntimeMoveInputs[K],
  ): EngineMoveValidationResult {
    return this.engine.validateMove(moveId, input);
  }

  getState(): DeepReadonly<LorcanaMatchState> {
    return this.engine.getState() as DeepReadonly<LorcanaMatchState>;
  }

  getBoard(): LorcanaProjectedBoardView {
    return this.engine.getBoard() as unknown as LorcanaProjectedBoardView;
  }

  getGameState(): DeepReadonly<LorcanaG> {
    return this.engine.getState().G as DeepReadonly<LorcanaG>;
  }

  getAuthoritativeState(): DeepReadonly<LorcanaMatchState> {
    return this.engine.getState() as DeepReadonly<LorcanaMatchState>;
  }

  getStateID(): number {
    return this.engine.getStateID();
  }

  isOptimisticMovePending(): boolean {
    return this.engine.isOptimisticMovePending ?? false;
  }

  getActiveEffects(): EngineActiveEffectProjection[] {
    return this.getBoard().activeEffects ?? [];
  }

  getPendingEffects(): LorcanaProjectedPendingEffect[] {
    return this.getBoard().pendingEffects ?? [];
  }

  getPendingChoice(): LorcanaProjectedPendingChoice | undefined {
    return this.getBoard().pendingChoice;
  }

  getBagEffects(): LorcanaProjectedBagEffect[] {
    return this.getBoard().bagEffects ?? [];
  }

  getBagCount(): number {
    return this.getBagEffects().length;
  }

  /**
   * Create a card resolution error result.
   */
  protected createCardResolutionError(action: string, reason: string): CommandResult {
    const trimmedReason = reason.trim();
    const errorCode =
      trimmedReason.startsWith("CARD_SELECTOR_REQUIRED") || trimmedReason.startsWith("Static card")
        ? "CARD_SELECTOR_REQUIRED"
        : trimmedReason.startsWith("CARD_SELECTOR_AMBIGUOUS")
          ? "CARD_SELECTOR_AMBIGUOUS"
          : "CARD_RESOLVE_FAILED";

    return {
      success: false,
      error: `${action}: ${reason}`,
      errorCode,
      currentStateID: this.getStateID(),
    };
  }

  setup(prevStateID?: number): void {
    void prevStateID;
  }

  hasGameEnded(): boolean {
    return !!this.engine.getState().ctx.status.gameEnded;
  }

  getGameEndResult() {
    // TODO THIS IS NOT QUITE RIGHT
    return this.engine.getState().ctx.status.winner;
  }

  getLore(playerId: string | PlayerId): number {
    const board: LorcanaProjectedBoardView = this.getBoard();
    return board.players?.[String(playerId)]?.lore || 0;
  }

  getAvailableInk(playerId: string | PlayerId): number {
    const board = this.getBoard();
    const normalizedPlayerId = normalizeBoardPlayerId(String(playerId), board.playerOrder);
    if (!normalizedPlayerId) {
      return 0;
    }

    const playerBoard = board.players?.[normalizedPlayerId];
    if (!playerBoard) {
      return 0;
    }

    return playerBoard.inkwell.reduce((available, cardId) => {
      const projectedCard = board.cards[cardId];
      return projectedCard?.exerted ? available : available + 1;
    }, 0);
  }

  getTotalInk(playerId: string | PlayerId): number {
    const board = this.getBoard();
    const normalizedPlayerId = normalizeBoardPlayerId(String(playerId), board.playerOrder);
    if (!normalizedPlayerId) {
      return 0;
    }

    return board.players?.[normalizedPlayerId]?.inkwell.length ?? 0;
  }

  isExerted(cardId: CardRef): boolean {
    const resolvedCardId = this.resolveCardId(cardId);
    if (!resolvedCardId) {
      return false;
    }
    const projected = this.getCardByInstance(resolvedCardId);
    if (typeof projected?.exerted === "boolean") {
      return projected.exerted;
    }
    return false;
  }

  isDrying(cardId: CardRef): boolean {
    const resolvedCardId = this.resolveCardId(cardId);
    if (!resolvedCardId) {
      return false;
    }
    const projected = this.getCardByInstance(resolvedCardId);
    if (typeof projected?.drying === "boolean") {
      return projected.drying;
    }
    return false;
  }

  getDamage(cardId: CardRef): number {
    const resolvedCardId = this.resolveCardId(cardId);
    if (!resolvedCardId) {
      return 0;
    }
    const projected = this.getCardByInstance(resolvedCardId);
    if (typeof projected?.damage === "number") {
      return projected.damage;
    }
    return 0;
  }

  getCurrentPhase(): string | undefined {
    return this.getBoard().phase;
  }

  getCurrentStep(): string | null | undefined {
    const challengeStage = this.getState().G.challengeState?.stage;
    if (challengeStage === "declaration") {
      return "challengeDeclaration";
    }
    if (challengeStage === "damage" || challengeStage === "post-damage") {
      return "challengeDamage";
    }

    return this.getBoard().step;
  }

  getGameSegment(): string | undefined {
    return this.getBoard().gameSegment;
  }

  getOpeningTurnPlayer(): PlayerId | undefined {
    return this.getBoard().openingTurnPlayer ?? undefined;
  }

  getPendingMulliganPlayers(): PlayerId[] {
    return [...(this.getBoard().pendingMulligan ?? [])];
  }

  getChoosingFirstPlayer(): PlayerId | undefined {
    return this.getBoard().choosingFirstPlayer ?? undefined;
  }

  getTurnNumber(): number {
    return this.getBoard().turnNumber ?? 1;
  }

  getActivePlayer(): PlayerId | undefined {
    return this.getBoard().priorityPlayer ?? undefined;
  }

  isGameOver(): boolean {
    return this.hasGameEnded();
  }

  getWinner(): PlayerId | undefined {
    const winner = this.getBoard().winner;
    return typeof winner === "string" ? (winner as PlayerId) : undefined;
  }

  chooseFirstPlayer(firstPlayerId: string, prevStateID?: number): CommandResult;
  chooseFirstPlayer(
    choosingPlayerId: string,
    firstPlayerId: string,
    prevStateID?: number,
  ): CommandResult;
  chooseFirstPlayer(
    playerIdOrFirstPlayerId: string,
    firstPlayerIdOrPrevStateID?: string | number,
    prevStateID?: number,
  ): CommandResult {
    let choosingPlayerId = playerIdOrFirstPlayerId;
    let firstPlayerId = firstPlayerIdOrPrevStateID;
    let resolvedPrevStateID = prevStateID;

    if (typeof firstPlayerIdOrPrevStateID !== "string") {
      const scopedPlayerId = this.getScopedPlayerId();
      if (!scopedPlayerId) {
        return this.createErrorResult(
          "chooseFirstPlayer requires a player id when used from a non-player-scoped engine.",
          "PLAYER_ID_REQUIRED",
        );
      }

      choosingPlayerId = scopedPlayerId;
      firstPlayerId = playerIdOrFirstPlayerId;
      resolvedPrevStateID = firstPlayerIdOrPrevStateID;
    }

    return this.executeMove(
      "chooseWhoGoesFirst",
      choosingPlayerId,
      { playerId: firstPlayerId as PlayerId },
      resolvedPrevStateID,
    );
  }

  playCardByInstance<TCost extends PlayCardMoveCost>(
    playerId: string,
    cardId: CardInstanceId,
    cost: TCost,
    costParams?: PlayCardMoveCostParams<TCost>,
    prevStateID?: number,
    opts?: { returnProcessedMove?: boolean },
  ): CommandResult;
  playCardByInstance(
    playerId: string,
    cardId: CardInstanceId,
    cost: PlayCardMoveCost = "standard",
    costParams?: PlayCardMoveCostParams<PlayCardMoveCost>,
    prevStateID?: number,
    opts?: { returnProcessedMove?: boolean },
  ): CommandResult {
    void opts;
    return this.executeMove(
      "playCard",
      playerId,
      {
        cardId,
        cost,
        ...costParams,
      } as LorcanaRuntimeMoveParams["playCard"],
      prevStateID,
    );
  }

  questByInstance(playerId: string, cardId: CardInstanceId, prevStateID?: number): CommandResult {
    return this.executeMove("quest", playerId, { cardId }, prevStateID);
  }

  challengeByInstance(
    playerId: string,
    attackerId: CardInstanceId,
    defenderId: CardInstanceId,
    prevStateID?: number,
  ): CommandResult {
    return this.executeMove(
      "challenge",
      playerId,
      {
        attackerId,
        defenderId,
      },
      prevStateID,
    );
  }

  moveCharacterToLocationByInstance(
    playerId: string,
    characterId: CardInstanceId,
    locationId: CardInstanceId,
    prevStateID?: number,
  ): CommandResult {
    return this.executeMove(
      "moveCharacterToLocation",
      playerId,
      {
        characterId,
        locationId,
      },
      prevStateID,
    );
  }

  putIntoInkwellByInstance(
    playerId: string,
    cardId: CardInstanceId,
    prevStateID?: number,
  ): CommandResult {
    return this.executeMove("putCardIntoInkwell", playerId, { cardId }, prevStateID);
  }

  passTurn(prevStateID?: number): CommandResult;
  passTurn(playerId: string, prevStateID?: number): CommandResult;
  passTurn(playerIdOrPrevStateID?: string | number, prevStateID?: number): CommandResult {
    const playerId =
      typeof playerIdOrPrevStateID === "string"
        ? playerIdOrPrevStateID
        : (this.getScopedPlayerId() ?? String(this.getActivePlayer() ?? ""));
    const resolvedPrevStateID =
      typeof playerIdOrPrevStateID === "number" ? playerIdOrPrevStateID : prevStateID;

    if (!playerId) {
      return this.createErrorResult(
        "passTurn requires a player id when used from a non-player-scoped engine.",
        "PLAYER_ID_REQUIRED",
      );
    }

    return this.executeMove(
      "passTurn",
      playerId,
      {} as LorcanaRuntimeMoveParams["passTurn"],
      resolvedPrevStateID,
    );
  }

  questWithAll(): CommandResult;
  questWithAll(playerId: string): CommandResult;
  questWithAll(playerId?: string): CommandResult {
    const resolvedPlayerId =
      playerId ?? this.getScopedPlayerId() ?? String(this.getActivePlayer() ?? "");
    if (!resolvedPlayerId) {
      return this.createErrorResult(
        "questWithAll requires a player id when used from a non-player-scoped engine.",
        "PLAYER_ID_REQUIRED",
      );
    }
    return this.executeMove(
      "questWithAll",
      resolvedPlayerId,
      {} as LorcanaRuntimeMoveParams["questWithAll"],
    );
  }

  concede(playerId: string, prevStateID?: number): CommandResult {
    return this.executeMove("concede", playerId, { playerId: playerId as PlayerId }, prevStateID);
  }

  mulliganByInstance(
    playerId: string,
    cardsToMulligan: CardInstanceId[],
    prevStateID?: number,
  ): CommandResult {
    return this.executeMove(
      "alterHand",
      playerId,
      {
        playerId: playerId as PlayerId,
        cardsToMulligan,
      },
      prevStateID,
    );
  }

  enumerateMoves(): Array<keyof LorcanaRuntimeMoveInputs & string> {
    const currentStateID = this.getStateID();
    if (this._cachedLegalMoveIdsStateID === currentStateID) {
      return this._cachedLegalMoveIds;
    }

    const legalMoveIds = this.engine.enumerateMoves() as Array<
      keyof LorcanaRuntimeMoveInputs & string
    >;
    this._cachedLegalMoveIds = legalMoveIds;
    this._cachedLegalMoveIdsStateID = currentStateID;
    return legalMoveIds;
  }

  /**
   * Internal perf helper used by simulator refresh paths to reuse move
   * enumeration already computed for the current state.
   */
  getCachedLegalMoveIds(): Array<keyof LorcanaRuntimeMoveInputs & string> {
    return this.enumerateMoves();
  }

  private buildChallengeIntentContext(playerId: PlayerId) {
    return buildValidationContext({
      state: this.getState() as LorcanaMatchState,
      playerId: String(playerId),
      input: { args: {} } as LorcanaRuntimeMoveInputs["passTurn"],
      config: lorcanaRuntimeConfig as unknown as MatchRuntimeConfig,
      staticResources: this.getResolvedStaticResources(),
      gameEnded: !!this.getState().ctx.status.gameEnded,
      validationMode: "preflight",
    });
  }

  private getCachedEligibleChallengeAttackers(playerId: string): CardInstanceId[] {
    const typedPlayerId = asPlayerIdOptional(playerId);
    const currentStateID = this.getStateID();
    if (!typedPlayerId) {
      return [];
    }
    if (this._cachedChallengeAttackersStateID === currentStateID) {
      return this._cachedChallengeAttackers;
    }

    const attackers = getEligibleChallengeAttackers(
      this.buildChallengeIntentContext(typedPlayerId),
    ).slice();
    this._cachedChallengeAttackersStateID = currentStateID;
    this._cachedChallengeAttackers = attackers;
    return attackers;
  }

  private getCachedChallengeMoveOptions(
    playerId: string,
    attackerId: CardInstanceId,
  ): MoveOption[] {
    const typedPlayerId = asPlayerIdOptional(playerId);
    const currentStateID = this.getStateID();
    if (!typedPlayerId) {
      return [];
    }
    if (this._cachedChallengeMoveOptionsStateID !== currentStateID) {
      this._cachedChallengeMoveOptionsStateID = currentStateID;
      this._cachedChallengeMoveOptions.clear();
    }

    const cachedOptions = this._cachedChallengeMoveOptions.get(attackerId);
    if (cachedOptions) {
      return cachedOptions;
    }

    const options = getLegalChallengeDefendersForAttacker(
      this.buildChallengeIntentContext(typedPlayerId),
      attackerId,
    ).map((cardId) => ({
      kind: "card" as const,
      cardId,
    }));
    this._cachedChallengeMoveOptions.set(attackerId, options);
    return options;
  }

  loadState(state: MatchState): void {
    this.loadStateViaEngine(state);
  }

  getActorContext(): EngineActorContext {
    return { role: "judge" };
  }

  getCardsInZone(zone: string, player: string): { count: number; cards: LorcanaProjectedCard[] } {
    const normalized = normalizeBoardPlayerId(player, this.getBoard().playerOrder);
    if (!normalized) {
      return { count: 0, cards: [] };
    }

    const playerBoard = this.getBoard().players[normalized];
    if (!playerBoard) {
      return { count: 0, cards: [] };
    }

    if (zone === "deck") {
      return { count: playerBoard.deckCount, cards: [] };
    }

    const projectedCards = this.selectZoneCards(normalized, zone);
    const cards = projectedCards.map((projectedCard) =>
      restoreProjectedCard({
        projected: projectedCard,
        definition: this.getCardDefinitionByInstanceId(projectedCard.id as CardInstanceId),
      }),
    );

    const count =
      zone === "hand"
        ? playerBoard.handCount
        : zone === "play"
          ? playerBoard.play.length
          : zone === "inkwell"
            ? playerBoard.inkwell.length
            : zone === "discard"
              ? playerBoard.discard.length
              : projectedCards.length;

    return { count, cards };
  }

  getCardByInstance(input: CardInput, _playerId?: string): LorcanaProjectedCard {
    const cardInstanceId = this.resolveCardId(input);

    if (!cardInstanceId) {
      return FALLBACK_LORCANA_PROJECTED_CARD;
    }

    const projected: LorcanaProjectedCard = this.getBoard().cards[cardInstanceId];
    const definition: LorcanaCardDefinition = this.getCardDefinitionByInstanceId(cardInstanceId);

    return restoreProjectedCard({
      projected,
      definition,
    });
  }

  getDerivedStrengthForCard(card: CardRef): number {
    const resolvedCardId = this.resolveCardId(card);
    if (!resolvedCardId) {
      return 0;
    }
    return this.getCardByInstance(resolvedCardId).strength || 0;
  }

  getDerivedWillpowerForCard(card: CardRef): number {
    const resolvedCardId = this.resolveCardId(card);
    if (!resolvedCardId) {
      return 0;
    }
    return this.getCardByInstance(resolvedCardId).willpower || 0;
  }

  getCardStrength(card: CardRef): number {
    return this.getDerivedStrengthForCard(card);
  }

  protected generateCommandID(): string {
    return `cmd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getCardDefinitionByInstanceId(cardId: CardInstanceId): LorcanaCardDefinition {
    const definitionId = this.cardInstanceToDefinitionId.get(cardId);

    if (!definitionId) {
      return FALLBACK_LORCANA_CARD;
    }

    return this.cardCatalog.get(definitionId) || FALLBACK_LORCANA_CARD;
  }

  protected resolveCardId(card: CardRef, actorPlayerId?: PlayerId): CardInstanceId | undefined {
    try {
      return resolveCardInstanceIdFromInput({
        input: card,
        state: this.getState() as LorcanaMatchState,
        cards: this.getBoard().cards,
        actorPlayerId,
        getDefinitionByInstanceId: (cardId) => this.getCardDefinitionByInstanceId(cardId),
      });
    } catch {
      return undefined;
    }
  }

  canChallenge(attacker: CardInput, defender: CardInput): boolean {
    const actingPlayerId = (this.getScopedPlayerId() ?? this.getActivePlayer()) as
      | PlayerId
      | undefined;
    const resolvedAttackerId = this.resolveCardId(attacker, actingPlayerId);
    const resolvedDefenderId = this.resolveCardId(defender, actingPlayerId);
    if (!resolvedAttackerId || !resolvedDefenderId) {
      return false;
    }

    return this.validateMove("challenge", {
      args: {
        attackerId: resolvedAttackerId,
        defenderId: resolvedDefenderId,
      },
    }).valid;
  }

  protected previewChallengeForActor(
    actorId: PlayerId,
    attackerId: CardInstanceId,
    defenderId: CardInstanceId,
  ): ChallengePreviewResult | null {
    const moveInput = {
      args: {
        attackerId,
        defenderId,
      },
    } satisfies LorcanaRuntimeMoveInputs["challenge"];

    const validation = this.validateMoveForPlayer(actorId, "challenge", moveInput);
    if (!validation.valid) {
      return null;
    }

    const previewContext = buildValidationContext({
      state: this.getState() as LorcanaMatchState,
      playerId: String(actorId),
      input: moveInput,
      config: lorcanaRuntimeConfig as unknown as MatchRuntimeConfig,
      staticResources: this.getResolvedStaticResources(),
      gameEnded: this.hasGameEnded(),
    });
    const result = computeChallengeDamageResult(
      previewContext as unknown as Parameters<typeof computeChallengeDamageResult>[0],
      attackerId,
      defenderId,
    );

    return {
      attackerId,
      defenderId,
      defenderKind: result.defenderDefinition.cardType,
      attackerCurrentDamage: result.attackerCurrentDamage,
      defenderCurrentDamage: result.defenderCurrentDamage,
      attackerNextDamage: result.attackerNextDamage,
      defenderNextDamage: result.defenderNextDamage,
      attackerWillpower: result.attackerWillpower,
      defenderWillpower: result.defenderWillpower,
      attackerDamageDealt: result.attackerToDefenderDamage,
      defenderDamageDealt: result.defenderToAttackerDamage,
      attackerWouldBeBanished: result.attackerLethal,
      defenderWouldBeBanished: result.defenderLethal,
      attackerDamageIsReduced: result.attackerDamageIsReduced,
      defenderDamageIsReduced: result.defenderDamageIsReduced,
    };
  }

  previewChallenge(attacker: CardInput, defender: CardInput): ChallengePreviewResult | null {
    const scopedPlayerId = this.getScopedPlayerId();
    const activePlayerId = this.getActivePlayer();
    const resolvedAttackerId = this.resolveCardId(attacker, activePlayerId);
    const resolvedDefenderId = this.resolveCardId(defender, activePlayerId);

    if (!resolvedAttackerId || !resolvedDefenderId) {
      return null;
    }

    const actingPlayerId =
      scopedPlayerId ??
      this.getState().ctx.zones.private.cardIndex[resolvedAttackerId]?.controllerID ??
      activePlayerId;
    if (!actingPlayerId) {
      return null;
    }

    return this.previewChallengeForActor(
      actingPlayerId as PlayerId,
      resolvedAttackerId,
      resolvedDefenderId,
    );
  }

  manualMoveCard(
    cardId: CardInstanceId,
    targetZoneId: ZoneId,
    position?: "top" | "bottom" | number,
  ): CommandResult {
    return this.executeManualMoveForResolvedCard("manualMoveCard", cardId, (resolvedCardId) => ({
      cardId: resolvedCardId,
      targetZoneId,
      position,
    }));
  }

  protected executeManualMoveForActingPlayer<K extends keyof LorcanaRuntimeMoveParams & string>(
    moveId: K,
    params: LorcanaRuntimeMoveParams[K],
    options: { playerPreference?: ManualActingPlayerPreference } = {},
  ): CommandResult {
    return this.executeManualMoveWithResolvedActingPlayer(moveId, (playerId) =>
      this.executeMove(moveId, playerId, params),
    );
  }

  protected executeManualMoveForResolvedCard<K extends keyof LorcanaRuntimeMoveParams & string>(
    moveId: K,
    cardInput: CardInput,
    createParams: (cardId: CardInstanceId) => LorcanaRuntimeMoveParams[K],
    options: { playerPreference?: ManualActingPlayerPreference } = {},
  ): CommandResult {
    return this.executeManualMoveWithResolvedActingPlayer(
      moveId,
      (playerId) => {
        const resolvedCardId = this.resolveCardId(cardInput);
        if (!resolvedCardId) {
          return this.createCardResolutionError(moveId, "Could not resolve card input");
        }

        return this.executeMove(moveId, playerId, createParams(resolvedCardId));
      },
      options,
    );
  }

  private executeManualMoveWithResolvedActingPlayer(
    moveId: string,
    execute: (playerId: string) => CommandResult,
    options: { playerPreference?: ManualActingPlayerPreference } = {},
  ): CommandResult {
    const playerId = this.resolveManualActingPlayer(options.playerPreference);
    if (!playerId) {
      return this.createErrorResult(
        `${moveId} requires a player id when used from a non-player-scoped engine.`,
        "PLAYER_ID_REQUIRED",
      );
    }

    return execute(playerId);
  }

  manualExertCard(cardInput: CardInput): CommandResult {
    return this.executeManualMoveForResolvedCard(
      "manualExertCard",
      cardInput,
      (cardId) => ({ cardId }),
      { playerPreference: "active-first" },
    );
  }

  manualReadyCard(cardId: CardInstanceId): CommandResult {
    return this.executeManualMoveForResolvedCard("manualReadyCard", cardId, (resolvedCardId) => ({
      cardId: resolvedCardId,
    }));
  }

  manualDryCard(cardId: CardInstanceId): CommandResult {
    return this.executeManualMoveForResolvedCard("manualDryCard", cardId, (resolvedCardId) => ({
      cardId: resolvedCardId,
    }));
  }

  manualSetDamage(card: CardInput, damage: number): CommandResult {
    return this.executeManualMoveForResolvedCard(
      "manualSetDamage",
      card,
      (cardId) => ({ cardId, damage }),
      { playerPreference: "active-first" },
    );
  }

  protected resolveManualActingPlayer(
    preference: ManualActingPlayerPreference = "scoped-first",
  ): string {
    const scopedPlayerId = this.getScopedPlayerId() ?? "";
    const activePlayerId = String(this.getActivePlayer() ?? "");

    if (preference === "active-first") {
      return activePlayerId || scopedPlayerId;
    }

    return scopedPlayerId || activePlayerId;
  }

  protected composeMoveByFixedArgs<K extends keyof LorcanaRuntimeMoveInputs & string>(
    moveId: K,
    args: Record<string, unknown>,
  ): LorcanaRuntimeMoveInputs[K];
  protected composeMoveByFixedArgs(
    moveId: string,
    args: Record<string, unknown>,
  ): LorcanaRuntimeMoveInputs[keyof LorcanaRuntimeMoveInputs] {
    void moveId;
    return {
      args,
    } as LorcanaRuntimeMoveInputs[keyof LorcanaRuntimeMoveInputs];
  }

  manualSetLore(playerId: PlayerId, amount: number): CommandResult {
    return this.executeManualMoveForActingPlayer(
      "manualSetLore",
      { playerId, amount },
      { playerPreference: "active-first" },
    );
  }

  manualShuffleDeck(playerId: PlayerId): CommandResult {
    return this.executeManualMoveForActingPlayer("manualShuffleDeck", {
      playerId,
    });
  }

  manualPassTurn(): CommandResult {
    return this.executeManualMoveForActingPlayer("manualPassTurn", {});
  }

  get playerId(): string {
    return this.getClientPlayerId() ?? "";
  }

  private getScopedPlayerId(): string | undefined {
    const playerId = this.getClientPlayerId();
    return typeof playerId === "string" && playerId.length > 0 ? playerId : undefined;
  }

  getZonesCardCount(playerId: string | PlayerId = this.getClientPlayerId() ?? ""): ZoneCounts {
    const normalized = String(playerId);
    return {
      hand: this.getCardsInZone("hand", normalized).count,
      deck: this.getCardsInZone("deck", normalized).count,
      play: this.getCardsInZone("play", normalized).count,
      inkwell: this.getCardsInZone("inkwell", normalized).count,
      discard: this.getCardsInZone("discard", normalized).count,
    };
  }

  private getPendingActionPayload(pendingEffect: EnginePendingEffectProjection):
    | {
        id?: string;
        sourceCardId?: string;
        sourceId?: string;
        chooserId?: string;
      }
    | undefined {
    const payload = pendingEffect.payload;
    if (!payload || typeof payload !== "object") {
      return undefined;
    }

    return payload as {
      id?: string;
      sourceCardId?: string;
      sourceId?: string;
      chooserId?: string;
    };
  }

  // TODO: Implement this
  validateMoveRequest(
    moveId: string,
    params: Record<string, unknown> = {},
  ): LorcanaMoveRequestValidation {
    return {
      valid: true,
      reason: "",
    };
  }

  resolvePendingEffect(cardInput: CardInput, opts: ResolutionExecutionOptions = {}): CommandResult {
    const resolvedCardId = this.resolveCardId(cardInput);
    if (!resolvedCardId) {
      return this.createErrorResult(
        "No pending effect found for this card.",
        "RESOLVE_PENDING_EFFECT_UNAVAILABLE",
      );
    }

    const matchingPendingEffects = this.getPendingEffects().filter((pendingEffect) => {
      const payload = this.getPendingActionPayload(pendingEffect);
      return payload?.sourceCardId === resolvedCardId || payload?.sourceId === resolvedCardId;
    });
    if (matchingPendingEffects.length === 0) {
      return this.createErrorResult(
        "No pending effect found for this card.",
        "RESOLVE_PENDING_EFFECT_UNAVAILABLE",
      );
    }
    if (matchingPendingEffects.length > 1) {
      return this.createErrorResult(
        "Multiple pending effects match this card; resolve by effect id instead.",
        "RESOLVE_PENDING_EFFECT_AMBIGUOUS",
      );
    }

    return this.resolveEffect(matchingPendingEffects[0]!.id, opts);
  }

  resolvePendingByCard(card?: CardInput, opts: ResolutionExecutionOptions = {}): CommandResult {
    if (card === undefined) {
      return this.createErrorResult(
        "Undefined is not accepted for this card.",
        "RESOLVE_PENDING_EFFECT_UNAVAILABLE",
      );
    }
    const resolvedCardId = this.resolveCardId(card);
    if (!resolvedCardId) {
      return this.createErrorResult(
        "Could not resolve card.",
        "RESOLVE_PENDING_EFFECT_UNAVAILABLE",
      );
    }

    // First, check for a pending effect belonging to this card
    const matchingPendingEffects = this.getPendingEffects().filter((pendingEffect) => {
      const payload = this.getPendingActionPayload(pendingEffect);
      return payload?.sourceCardId === resolvedCardId || payload?.sourceId === resolvedCardId;
    });

    if (matchingPendingEffects.length === 1) {
      return this.resolveEffect(matchingPendingEffects[0]!.id, opts);
    }

    // Then, check for a bag effect belonging to this card
    const matchingBagEffects = this.getBagEffects().filter(
      (bagEffect) => bagEffect.sourceId === resolvedCardId,
    );

    if (matchingBagEffects.length === 0) {
      return this.createErrorResult(
        "No pending effect or bag item found for this card.",
        "RESOLVE_PENDING_EFFECT_UNAVAILABLE",
      );
    }

    if (matchingBagEffects.length > 1 && typeof opts.bagIndex !== "number") {
      return this.createErrorResult(
        "Multiple bag items match this card; resolve by bag id instead.",
        "RESOLVE_PENDING_EFFECT_AMBIGUOUS",
      );
    } else if (typeof opts.bagIndex === "number") {
      return this.resolveBag(matchingBagEffects[opts.bagIndex]!.id, opts);
    }

    return this.resolveBag(matchingBagEffects[0]!.id, opts);
  }
  resolveNextPending(opts: ResolutionExecutionOptions = {}): CommandResult {
    const playerId = asPlayerIdOptional(this.getClientPlayerId());
    if (!playerId) {
      return this.createErrorResult(
        "resolveNextPending requires a player-scoped client.",
        "RESOLVE_PENDING_EFFECT_UNAVAILABLE",
      );
    }

    const matchingPendingEffects = this.getPendingEffects().filter((pendingEffect) => {
      const payload = this.getPendingActionPayload(pendingEffect);
      return pendingEffect.source !== "priority" && payload?.chooserId === playerId;
    });

    if (matchingPendingEffects.length === 0) {
      return this.createErrorResult(
        "No pending effect is waiting for this player.",
        "RESOLVE_PENDING_EFFECT_UNAVAILABLE",
      );
    }

    if (matchingPendingEffects.length > 1) {
      return this.createErrorResult(
        "Multiple pending effects are waiting for this player; resolve by effect id instead.",
        "RESOLVE_PENDING_EFFECT_AMBIGUOUS",
      );
    }

    return this.resolveEffect(matchingPendingEffects[0]!.id, opts);
  }

  resolveOnlyBag(opts: ResolutionExecutionOptions = {}) {
    const [bagEffect] = this.getBagEffects();

    if (!bagEffect || !bagEffect.id) {
      const failure: CommandFailure = {
        success: false,
        error: "Bag Efect Not Found",
        errorCode: "EFFECT_NOT_FOUND",
        currentStateID: this.getStateID(),
      };

      return failure;
    }

    return this.resolveBag(bagEffect.id, opts);
  }

  resolveBag(bagId: string, opts: ResolutionExecutionOptions = {}): CommandResult {
    if (typeof bagId !== "string" || bagId.length === 0) {
      return this.createErrorResult(
        "resolveBag requires a valid bag id.",
        "RESOLVE_BAG_ID_REQUIRED",
      );
    }

    let resolvedTargets: (CardInstanceId | PlayerId)[] | SlottedTargetInput | undefined;
    if (opts.targets !== undefined) {
      try {
        if (isUnresolvedSlottedTargetInput(opts.targets)) {
          const slotted = opts.targets as SlottedTargetInputOf<CardInput | PlayerId>;
          resolvedTargets = resolveSlottedTargetInputWith(slotted, (ids) =>
            ids.length > 0 ? this.resolveSelectionTargets(ids) : [],
          );
        } else {
          resolvedTargets = this.resolveSelectionTargets(
            opts.targets as readonly (CardInput | PlayerId)[],
          );
        }
      } catch (error) {
        return this.createErrorResult(
          error instanceof Error ? error.message : "Failed to resolve resolveBag targets",
          "CARD_RESOLVE_FAILED",
        );
      }
    }

    const resolvedDestinations: LorcanaRuntimeMoveParams["playCard"]["destinations"] =
      Array.isArray(opts.destinations) && opts.destinations.length > 0
        ? opts.destinations.reduce<
            NonNullable<LorcanaRuntimeMoveParams["playCard"]["destinations"]>
          >((acc, destination) => {
            const requestedCards = Array.isArray(destination.cards)
              ? destination.cards
              : [destination.cards];
            let resolvedCards: CardInstanceId[] = [];
            try {
              resolvedCards = this.resolveCardInputs(requestedCards);
            } catch {
              resolvedCards = [];
            }

            acc.push({
              cards: resolvedCards,
              zone: destination.zone,
            });

            return acc;
          }, [])
        : undefined;

    const params: Record<string, unknown> = {};
    if (typeof opts.amount === "number") {
      params.amount = opts.amount;
    }
    if (typeof opts.namedCard === "string" && opts.namedCard.trim().length > 0) {
      params.namedCard = opts.namedCard.trim();
    }
    if (typeof opts.choiceIndex === "number") {
      params.choiceIndex = opts.choiceIndex;
    }
    if (typeof opts.resolveOptional === "boolean") {
      params.resolveOptional = opts.resolveOptional;
    }
    if (typeof opts.enterPlayExerted === "boolean") {
      params.enterPlayExerted = opts.enterPlayExerted;
    }
    if (resolvedDestinations) {
      params.destinations = resolvedDestinations;
    }
    if (opts.playerTargets !== undefined) {
      params.playerTargets = Array.isArray(opts.playerTargets)
        ? opts.playerTargets
        : [opts.playerTargets];
    }

    if (!this.enumerateMoves().includes("resolveBag")) {
      return this.createErrorResult(
        "resolveBag is not currently available.",
        "RESOLVE_BAG_UNAVAILABLE",
      );
    }

    const targetFields =
      resolvedTargets === undefined
        ? {}
        : Array.isArray(resolvedTargets)
          ? { targets: resolvedTargets }
          : {
              slottedTargets: resolvedTargets,
              targets: flattenSlottedTargets(resolvedTargets) as (CardInstanceId | PlayerId)[],
            };
    const input: LorcanaRuntimeMoveInputs["resolveBag"] = {
      args: {
        bagId,
        params: {
          ...params,
          ...targetFields,
        },
      },
    };

    return this.executeMove("resolveBag", input);
  }

  resolveNextBag(opts: ResolutionExecutionOptions = {}): CommandResult {
    const playerId = asPlayerIdOptional(this.getClientPlayerId());
    if (!playerId) {
      return this.createErrorResult(
        "resolveNextBag requires a player-scoped client.",
        "RESOLVE_BAG_UNAVAILABLE",
      );
    }

    const matchingBagEffects = this.getBagEffects().filter(
      (bagEffect) => bagEffect.controllerId === playerId,
    );
    if (matchingBagEffects.length === 0) {
      return this.createErrorResult(
        "No bag effect is waiting for this player.",
        "RESOLVE_BAG_UNAVAILABLE",
      );
    }

    if (matchingBagEffects.length > 1) {
      return this.createErrorResult(
        "Multiple bag effects are waiting for this player; resolve by bag id instead.",
        "RESOLVE_BAG_AMBIGUOUS",
      );
    }

    return this.resolveBag(matchingBagEffects[0]!.id, opts);
  }

  resolveAllBagEffects(opts: ResolutionExecutionOptions & { maxIterations?: number } = {}): void {
    const maxIterations = opts.maxIterations ?? 50;
    for (
      let iterations = 0;
      iterations < maxIterations && this.getBagCount() > 0;
      iterations += 1
    ) {
      const bagEffects = this.getBagEffects();
      if (bagEffects.length === 0) break;
      this.resolveBag(bagEffects[0]!.id, opts);
    }
  }

  respondWith(...targets: CardInput[]): CommandResult {
    return targets.length > 0 ? this.resolveNextPending({ targets }) : this.resolveNextPending();
  }

  respondWithChoice(choiceIndex: number): CommandResult {
    return this.resolveNextPending({ choiceIndex });
  }

  playCardTo(card: CardInput, ...targets: CardInput[]): CommandResult {
    return this.playCard(card, { targets });
  }

  playCardForPlayer(
    card: CardInput,
    playerId: PlayerId,
    opts: Omit<PlayCardExecutionOptions, "targets" | "playerTargets"> = {},
  ): CommandResult {
    const cardId = this.resolveCardId(card);
    if (!cardId) {
      return this.createCardResolutionError("playCardForPlayer", "Could not resolve card input");
    }

    const resolvedCost = this.resolvePlayCardCostInput(opts.cost ?? "standard");
    const costString = typeof resolvedCost === "object" ? resolvedCost.cost : resolvedCost;

    return this.playCardByInstance(
      this.getScopedPlayerId() ?? String(this.getActivePlayer() ?? ""),
      cardId,
      costString as LorcanaRuntimeMoveParams["playCard"]["cost"],
      {
        ...(typeof resolvedCost === "object" ? resolvedCost : {}),
        amount: opts.amount,
        resolveOptional: opts.resolveOptional,
        choiceIndex: opts.choiceIndex,
        destinations: opts.destinations as LorcanaRuntimeMoveParams["playCard"]["destinations"],
        preventAutoResolveTriggeredEffects: opts.preventAutoResolveTriggeredEffects,
        playerTargets: playerId,
        // Runtime currently resolves player choices via `targets` for backward compatibility.
        targets: [playerId as unknown as CardInstanceId],
      },
    );
  }

  playCardWithChoice(
    card: CardInput,
    choiceIndex: number,
    opts: Omit<PlayCardExecutionOptions, "choiceIndex"> = {},
  ): CommandResult {
    return this.playCard(card, { ...opts, choiceIndex });
  }

  playCardOptional(
    card: CardInput,
    resolveOptional: boolean,
    opts: Omit<PlayCardExecutionOptions, "resolveOptional"> = {},
  ): CommandResult {
    return this.playCard(card, { ...opts, resolveOptional });
  }

  playCardWithDestinations(
    card: CardInput,
    ...destinations: PlayCardDestinationInput[]
  ): CommandResult {
    return this.playCard(card, { destinations });
  }

  singSong(card: CardInput, singer: CardInput): CommandResult {
    return this.playCard(card, {
      cost: { cost: "sing", singer: singer as CardInstanceId },
    });
  }

  playSongTogether(card: CardInput, singers: CardInput[]): CommandResult {
    return this.playCard(card, {
      cost: { cost: "singTogether", singers: singers as CardInstanceId[] },
    });
  }

  /**
   * Structured reason the Play CTA is disabled for `cardInput`, or `null` when
   * the card is currently playable (standard, shift, or sing).
   *
   * The engine emits codes + params only; the UI is responsible for mapping
   * each code to a localized tooltip. See `play-card-disabled-reason.ts` for
   * the taxonomy and per-code param contracts.
   *
   * Mirrors the resolution order of `canPlayCard`:
   *   1. Try standard validation via `validateMove`.
   *   2. If `cost === "standard"`, also try the song fallback (sing).
   *   3. If `cost === "standard"`, also try the shift fallback (Devoted
   *      Herald-style discard or ink-cost shift).
   *   4. If none succeed, choose the most informative reason — preferring
   *      shift- or song-specific reasons over the generic standard-validation
   *      error, because those tell the player what's actually missing.
   */
  getPlayCardDisabledReason(
    cardInput: CardInput,
    opts: PlayCardExecutionOptions = {
      cost: "standard",
    },
  ): PlayCardDisabledReason | null {
    const {
      cost = "standard",
      amount,
      resolveOptional,
      choiceIndex,
      destinations,
      playerTargets,
      preventAutoResolveTriggeredEffects,
    } = opts;
    const resolvedCost = this.resolvePlayCardCostInput(cost);
    const playableCardId = this.resolvePlayableCardId(cardInput, resolvedCost);
    if (!playableCardId) {
      return { code: "NOT_IN_HAND" };
    }

    let resolvedTargets: (CardInstanceId | PlayerId)[] | SlottedTargetInput | undefined;
    if (opts.targets !== undefined) {
      try {
        if (isUnresolvedSlottedTargetInput(opts.targets)) {
          const slotted = opts.targets as SlottedTargetInputOf<CardInput | PlayerId>;
          resolvedTargets = resolveSlottedTargetInputWith(slotted, (ids) =>
            ids.length > 0 ? this.resolveSelectionTargets(ids) : [],
          );
        } else {
          resolvedTargets = this.resolveSelectionTargets(
            opts.targets as readonly (CardInput | PlayerId)[],
          );
        }
      } catch {
        return { code: "UNKNOWN", params: { validateMoveErrorCode: "INVALID_TARGETS" } };
      }
    }

    const resolvedDestinations: LorcanaRuntimeMoveParams["playCard"]["destinations"] =
      destinations && destinations.length > 0
        ? destinations.reduce<NonNullable<LorcanaRuntimeMoveParams["playCard"]["destinations"]>>(
            (acc, destination) => {
              const requestedCards = Array.isArray(destination.cards)
                ? destination.cards
                : [destination.cards];

              try {
                const resolvedCards = this.resolveCardInputs(requestedCards);

                if (resolvedCards.length > 0) {
                  acc.push({
                    cards: resolvedCards,
                    zone: destination.zone,
                  });
                }
              } catch {
                return acc;
              }

              return acc;
            },
            [],
          )
        : undefined;

    const args = normalizePlayCardCost(playableCardId, resolvedCost, {
      amount,
      choiceIndex,
      destinations: resolvedDestinations,
      resolveOptional,
      targets: resolvedTargets,
      playerTargets,
      preventAutoResolveTriggeredEffects,
    }) as unknown as Record<string, unknown>;

    const moveInput = this.composeMoveByFixedArgs("playCard", args);
    const standardValidation = this.validateMove(
      "playCard",
      moveInput as LorcanaRuntimeMoveInputs["playCard"],
    );
    if (standardValidation.valid) {
      return null;
    }

    // For non-standard explicit costs (sing, shift with explicit args, etc.)
    // we don't run the implicit fallbacks — just surface what failed.
    if (cost !== "standard") {
      return this.mapValidateMoveErrorToDisabledReason(standardValidation.code, playableCardId);
    }

    const cardDef = this.getCardDefinitionByInstanceId(playableCardId) as LorcanaCard;

    // Song fallback: if this is a song and a singer is available, it's playable.
    // Otherwise, SONG_NO_SINGER beats INSUFFICIENT_INK because it tells the player
    // *what's actually missing* (a ready character with sufficient cost).
    if (isSongCard(cardDef)) {
      const songReason = this.computeSongDisabledReason(playableCardId, cardDef);
      if (songReason === null) {
        return null;
      }
      // Standard-cost play might still be possible — check that before reporting
      // SONG_NO_SINGER. (If the player has enough ink, they don't need a singer.)
      if (standardValidation.code !== "INSUFFICIENT_INK") {
        return this.mapValidateMoveErrorToDisabledReason(standardValidation.code, playableCardId);
      }
      return songReason;
    }

    // Shift fallback: walk the same checks `canPlayCard` does, but capture
    // *which* check fails so we can name it.
    if (hasShift(cardDef)) {
      const shiftReason = this.computeShiftDisabledReason(playableCardId, cardDef);
      if (shiftReason === null) {
        return null;
      }
      // Hard blockers (player-level restrictions, self-play conditions, a
      // pending bag) apply to ALL play paths — `validateMove` checks them
      // before any cost validation, for both standard and shift. When
      // standard failed with one of these, the shift fallback's failure is
      // a *symptom* (no target / no discard / ink); the player needs to see
      // the root cause instead. The per-category accessors
      // (`getShiftPlayDisabledReason`) keep returning the shift-specific
      // reason for the Shift CTA's own tooltip — only the composite answer
      // gets preempted here.
      if (
        standardValidation.code === "PLAYER_PLAY_RESTRICTED" ||
        standardValidation.code === "SELF_PLAY_CONDITION_NOT_MET" ||
        standardValidation.code === "BAG_PENDING"
      ) {
        return this.mapValidateMoveErrorToDisabledReason(standardValidation.code, playableCardId);
      }
      // For "no ink cost on shift and discard is available, yet shift still
      // can't be played" — fall through to the generic standard-cost error.
      if (shiftReason.code === "UNKNOWN") {
        return this.mapValidateMoveErrorToDisabledReason(standardValidation.code, playableCardId);
      }
      return shiftReason;
    }

    return this.mapValidateMoveErrorToDisabledReason(standardValidation.code, playableCardId);
  }

  /**
   * Reason the standard-cost Play CTA is disabled for `cardInput`, or `null`
   * when standard play is available. Does NOT consider alternate-cost paths
   * (shift, sing) — those have their own per-category accessors. Use this to
   * drive the "Play" button's tooltip independently from "Shift" / "Sing".
   */
  getStandardPlayDisabledReason(cardInput: CardInput): PlayCardDisabledReason | null {
    const resolvedCost = this.resolvePlayCardCostInput("standard");
    const playableCardId = this.resolvePlayableCardId(cardInput, resolvedCost);
    if (!playableCardId) {
      return { code: "NOT_IN_HAND" };
    }
    const args = normalizePlayCardCost(playableCardId, resolvedCost, {}) as unknown as Record<
      string,
      unknown
    >;
    const moveInput = this.composeMoveByFixedArgs("playCard", args);
    const result = this.validateMove("playCard", moveInput as LorcanaRuntimeMoveInputs["playCard"]);
    if (result.valid) {
      return null;
    }
    return this.mapValidateMoveErrorToDisabledReason(result.code, playableCardId);
  }

  /**
   * Reason the Shift CTA is disabled for `cardInput`, or `null` when shift is
   * available OR when the card has no Shift keyword (the UI shouldn't render
   * a Shift CTA at all in that case, so "disabled reason" doesn't apply).
   * Returns SHIFT_* codes specifically.
   */
  getShiftPlayDisabledReason(cardInput: CardInput): PlayCardDisabledReason | null {
    const playableCardId = this.resolvePlayableCardId(cardInput, "standard");
    if (!playableCardId) {
      return { code: "NOT_IN_HAND" };
    }
    const cardDef = this.getCardDefinitionByInstanceId(playableCardId) as LorcanaCard;
    if (!hasShift(cardDef)) {
      return null;
    }
    return this.computeShiftDisabledReason(playableCardId, cardDef);
  }

  /**
   * Reason the Sing CTA is disabled for `cardInput`, or `null` when sing is
   * available OR when the card isn't a song.
   */
  getSingPlayDisabledReason(cardInput: CardInput): PlayCardDisabledReason | null {
    const playableCardId = this.resolvePlayableCardId(cardInput, "standard");
    if (!playableCardId) {
      return { code: "NOT_IN_HAND" };
    }
    const cardDef = this.getCardDefinitionByInstanceId(playableCardId) as LorcanaCard;
    if (!isSongCard(cardDef)) {
      return null;
    }
    return this.computeSongDisabledReason(playableCardId, cardDef);
  }

  private computeShiftDisabledReason(
    playableCardId: CardInstanceId,
    cardDef: LorcanaCard,
  ): PlayCardDisabledReason | null {
    const playerId = this.getScopedPlayerId() ?? String(this.getActivePlayer() ?? "");
    const shiftRules = getShiftRules(cardDef);
    const normalizedPlayerId = normalizeBoardPlayerId(playerId, this.getBoard().playerOrder);
    const playerBoard = normalizedPlayerId
      ? this.getBoard().players[normalizedPlayerId]
      : undefined;
    if (!shiftRules || !playerBoard) {
      // Card has Shift keyword but rules are missing/unsupported — surface a
      // generic UNKNOWN so the caller can decide whether to fall back to a
      // different reason or a generic tooltip.
      return { code: "UNKNOWN", params: { validateMoveErrorCode: "SHIFT_RULES_MISSING" } };
    }

    const playCandidates = playerBoard.play.map((pid) => pid as CardInstanceId);
    const shiftTargets = resolveShiftTargetCandidates(
      shiftRules,
      playCandidates,
      (cid) => this.getCardDefinitionByInstanceId(cid) as LorcanaCard,
    );
    if (shiftTargets.length === 0) {
      return { code: "SHIFT_NO_TARGET", params: { targetName: cardDef.name } };
    }

    // Discard-cost shift (e.g. Diablo - Devoted Herald): check the discard
    // pool before the ink portion, because "no action card in hand" is more
    // actionable than "no ink" for these cards.
    if (shiftRules.discardCost) {
      const selectableCosts = this.getSelectableCostsForShift(playerId, cardDef);
      if (!this.hasSufficientSelectableCosts(selectableCosts)) {
        return {
          code: "SHIFT_NO_DISCARD_AVAILABLE",
          params: {
            discardCardType: shiftRules.discardCost.discardCardType ?? "card",
            count: shiftRules.discardCost.discardCards,
          },
        };
      }
    }

    if (!shiftTargets.some((targetId) => this.canDiscoverShiftPlay(playableCardId, targetId))) {
      if (typeof shiftRules.inkCost === "number") {
        // Use the projected `shiftPlayCost` (cost-reduction-adjusted) so the
        // tooltip matches what `canDiscoverShiftPlay` → `validateMove`
        // actually enforced. Fall back to the raw shift rules cost only if
        // the projection is unavailable.
        const projected = this.getBoard().cards[playableCardId];
        const adjustedShiftCost =
          typeof projected?.shiftPlayCost === "number"
            ? projected.shiftPlayCost
            : shiftRules.inkCost;
        return {
          code: "SHIFT_INSUFFICIENT_INK",
          params: {
            needed: adjustedShiftCost,
            available: this.getAvailableInk(playerId),
          },
        };
      }
      // Discard available, no ink portion, yet shift still fails — caller
      // can decide what to surface.
      return { code: "UNKNOWN", params: { validateMoveErrorCode: "SHIFT_UNKNOWN" } };
    }

    return null;
  }

  private computeSongDisabledReason(
    playableCardId: CardInstanceId,
    cardDef: LorcanaCard,
  ): PlayCardDisabledReason | null {
    const playerId = this.getScopedPlayerId() ?? String(this.getActivePlayer() ?? "");
    const songPlayOptions = this.getSongPlayOptions(playableCardId, playerId);
    if (songPlayOptions.singleSingerIds.length > 0 || songPlayOptions.singTogetherOption !== null) {
      return null;
    }
    return { code: "SONG_NO_SINGER", params: { songCost: cardDef.cost } };
  }

  private mapValidateMoveErrorToDisabledReason(
    errorCode: string | undefined,
    playableCardId: CardInstanceId,
  ): PlayCardDisabledReason {
    switch (errorCode) {
      case "INSUFFICIENT_INK": {
        const playerId = this.getScopedPlayerId() ?? String(this.getActivePlayer() ?? "");
        const cardDef = this.getCardDefinitionByInstanceId(playableCardId) as LorcanaCard;
        // Use the projected `playCost` (cost-reduction- and cost-increase-
        // adjusted) so the tooltip matches the amount `validateMove` actually
        // checked. Fall back to the printed cost only if the projection is
        // unavailable (e.g. during early init).
        const projected = this.getBoard().cards[playableCardId];
        const adjustedCost =
          typeof projected?.playCost === "number" ? projected.playCost : cardDef.cost;
        return {
          code: "INSUFFICIENT_INK",
          params: {
            needed: adjustedCost,
            available: this.getAvailableInk(playerId),
          },
        };
      }
      case "PLAYER_PLAY_RESTRICTED":
        return { code: "PLAYER_PLAY_RESTRICTED" };
      case "SELF_PLAY_CONDITION_NOT_MET":
        return { code: "SELF_PLAY_CONDITION_NOT_MET" };
      case "BAG_PENDING":
        return { code: "BAG_PENDING" };
      case "CARD_NOT_IN_HAND":
      case "CARD_NOT_FOUND":
        return { code: "NOT_IN_HAND" };
      case "SHIFT_DISCARD_REQUIRED":
      case "SHIFT_DISCARD_NOT_IN_HAND":
      case "SHIFT_DISCARD_WRONG_TYPE":
        // These come from validateMove when an explicit shift cost was passed
        // with bad inputs — for a standard-cost call we should have caught
        // these in the shift fallback above. Surface generically.
        return {
          code: "UNKNOWN",
          params: { validateMoveErrorCode: errorCode ?? "UNKNOWN" },
        };
      default:
        return {
          code: "UNKNOWN",
          params: { validateMoveErrorCode: errorCode ?? "UNKNOWN" },
        };
    }
  }

  /**
   * Boolean accessor: true iff the card is currently playable (standard cost
   * or via the song/shift fallback). For the *reason* a card can't be played
   * — what the UI needs to render a tooltip on a disabled CTA — call
   * `getPlayCardDisabledReason` instead. The two are kept in lock-step by
   * delegation, so they cannot drift.
   */
  canPlayCard(
    cardInput: CardInput,
    opts: PlayCardExecutionOptions = {
      cost: "standard",
    },
  ): boolean {
    return this.getPlayCardDisabledReason(cardInput, opts) === null;
  }

  protected resolveCardInputs(inputs: CardInput[]): CardInstanceId[] {
    return inputs.map((input) => this.requireCardId(input));
  }

  private resolveSelectionTargets(
    inputs: readonly (CardInput | PlayerId)[],
  ): (CardInstanceId | PlayerId)[] {
    const knownPlayerIds = new Set(this.getBoard().playerOrder);
    const cardInputs: CardInput[] = [];
    const selectedPlayerIds: PlayerId[] = [];

    for (const input of inputs) {
      if (typeof input === "string" && knownPlayerIds.has(input as PlayerId)) {
        selectedPlayerIds.push(input as PlayerId);
        continue;
      }

      cardInputs.push(input);
    }

    const resolvedCardIds = cardInputs.length > 0 ? this.resolveCardInputs(cardInputs) : [];
    return [...resolvedCardIds, ...selectedPlayerIds];
  }

  private resolvePlayableCardId(
    cardInput: CardInput | LorcanaStaticCard,
    cost: PlayCardCostInput = "standard",
  ): CardInstanceId | undefined {
    void cost;
    const resolvedCardId = this.resolveCardId(cardInput);
    if (!resolvedCardId) {
      return undefined;
    }
    return resolvedCardId;
  }

  private resolvePlayCardCostInput(cost: PlayCardCostInput): PlayCardCostInput {
    if (typeof cost !== "object") {
      return cost;
    }

    switch (cost.cost) {
      case "shift": {
        const shiftTarget = this.resolveCardId(cost.shiftTarget);
        return shiftTarget ? { ...cost, shiftTarget } : cost;
      }
      case "sing": {
        const singer = this.resolveCardId(cost.singer);
        return singer ? { ...cost, singer } : cost;
      }
      case "singTogether": {
        const singers = cost.singers
          .map((singer) => this.resolveCardId(singer))
          .filter((singer): singer is CardInstanceId => Boolean(singer));
        return singers.length === cost.singers.length ? { ...cost, singers } : cost;
      }
      case "sacrifice": {
        const sacrificeTarget = this.resolveCardId(cost.sacrificeTarget);
        return sacrificeTarget ? { ...cost, sacrificeTarget } : cost;
      }
      case "exert-items": {
        const exertTargets = cost.exertTargets
          .map((target) => this.resolveCardId(target))
          .filter((target): target is CardInstanceId => Boolean(target));
        return exertTargets.length === cost.exertTargets.length ? { ...cost, exertTargets } : cost;
      }
      case "put-on-deck-bottom": {
        const deckBottomTarget = this.resolveCardId(cost.deckBottomTarget);
        return deckBottomTarget ? { ...cost, deckBottomTarget } : cost;
      }
      default:
        return cost;
    }
  }

  protected createErrorResult(error: string, errorCode: string = "CLIENT_ERROR"): CommandResult {
    return {
      success: false,
      error,
      errorCode,
      currentStateID: this.getStateID(),
    };
  }

  protected createNoopResult(commandId = `automated-noop-${Date.now()}`): CommandResult {
    return {
      success: true,
      stateID: this.getStateID(),
      state: this.getState() as MatchState,
      patches: [],
      gameEvents: [],
      processedCommand: {
        commandID: commandId,
        move: "automatedNoop",
      },
      animations: [],
      undoable: false,
      moveLogs: [],
    };
  }

  getCardZone(card: CardInput): string | undefined {
    const cardInstanceId = this.resolveCardId(card);
    if (!cardInstanceId) {
      return undefined;
    }

    const projectedZone = this.getCardByInstance(cardInstanceId).zone;
    if (typeof projectedZone === "string" && projectedZone.length > 0) {
      return projectedZone;
    }

    const zoneKey = this.getState().ctx.zones.private.cardIndex[cardInstanceId]?.zoneKey;
    if (typeof zoneKey !== "string" || zoneKey.length === 0) {
      return undefined;
    }

    return zoneKey.includes(":") ? zoneKey.split(":", 1)[0] : zoneKey;
  }

  getCard(card?: CardInput): LorcanaProjectedCard {
    if (!card) {
      return FALLBACK_LORCANA_PROJECTED_CARD;
    }
    const cardInstanceId = this.resolveCardId(card);
    if (!cardInstanceId) {
      return FALLBACK_LORCANA_PROJECTED_CARD;
    }

    return this.getCardByInstance(cardInstanceId);
  }

  getCardsUnder(card: CardInput): CardInstanceId[] {
    return [];
  }

  protected findActivatedAbility(
    cardId: CardInstanceId,
    ability?: string,
  ): { ability: ActivatedAbilityDefinition; abilityIndex: number } | null {
    const definition = this.getCardDefinitionByInstanceId(cardId);
    const printedAbilities = (definition.abilities ?? []).filter(
      (entry): entry is ActivatedAbilityDefinition => entry.type === "activated",
    );
    const registry = buildRegistryFromMatchState(this.getAuthoritativeState(), (id) =>
      this.getCardDefinitionByInstanceId(id),
    );
    const grantedAbilities = getGrantedActivatedAbilities({
      state: toStaticAbilityState(this.getAuthoritativeState()),
      cardId,
      getDefinitionByInstanceId: (instanceId) => this.getCardDefinitionByInstanceId(instanceId),
      registry,
    }).map((entry) => entry.ability);
    const activatedAbilities = [...printedAbilities, ...grantedAbilities].map(
      (entry, abilityIndex) => ({
        ability: entry,
        abilityIndex,
      }),
    );

    if (activatedAbilities.length === 0) {
      return null;
    }

    const normalizedAbility = ability?.trim();
    if (!normalizedAbility) {
      return activatedAbilities.length === 1 ? activatedAbilities[0] : null;
    }

    const nameMatch = activatedAbilities.find((entry) => entry.ability.name === normalizedAbility);
    if (nameMatch) {
      return nameMatch;
    }

    const titleMatch = activatedAbilities.find((entry) => {
      const rawTitle = (entry.ability as { title?: unknown }).title;
      return typeof rawTitle === "string" && rawTitle === normalizedAbility;
    });
    if (titleMatch) {
      return titleMatch;
    }

    const textMatch = activatedAbilities.find((entry) => entry.ability.text === normalizedAbility);
    if (textMatch) {
      return textMatch;
    }

    const textPrefixMatch = activatedAbilities.find(
      (entry) =>
        typeof entry.ability.text === "string" && entry.ability.text.startsWith(normalizedAbility),
    );
    if (textPrefixMatch) {
      return textPrefixMatch;
    }

    return null;
  }

  protected findActivatedAbilityByIndex(
    cardId: CardInstanceId,
    abilityIndex: number,
  ): { ability: ActivatedAbilityDefinition; abilityIndex: number } | null {
    const definition = this.getCardDefinitionByInstanceId(cardId);
    const printedAbilities = (definition.abilities ?? []).filter(
      (entry): entry is ActivatedAbilityDefinition => entry.type === "activated",
    );
    const registry = buildRegistryFromMatchState(this.getAuthoritativeState(), (id) =>
      this.getCardDefinitionByInstanceId(id),
    );
    const grantedAbilities = getGrantedActivatedAbilities({
      state: toStaticAbilityState(this.getAuthoritativeState()),
      cardId,
      getDefinitionByInstanceId: (instanceId) => this.getCardDefinitionByInstanceId(instanceId),
      registry,
    }).map((entry) => entry.ability);
    const activatedAbilities = [...printedAbilities, ...grantedAbilities].map(
      (entry, resolvedAbilityIndex) => ({
        ability: entry,
        abilityIndex: resolvedAbilityIndex,
      }),
    );

    return activatedAbilities[abilityIndex] ?? null;
  }

  private getPlayCardTargetSelectionContext(
    cardId: CardInstanceId,
    playerId: PlayerId,
    options?: { allowEmptyCandidates?: boolean },
  ) {
    const cardDef = this.getCardDefinitionByInstanceId(cardId) as LorcanaCard;
    if (cardDef.cardType !== "action" || !this.canPlayCard(cardId)) {
      return undefined;
    }

    const availableMoves = this.getAvailableMoves();
    const hasAlternatePlayMode = availableMoves.some(
      (move) =>
        (move.moveId === "shiftCard" || move.moveId === "singCard") &&
        move.selectableCardIds.some((selectableCardId) => String(selectableCardId) === cardId),
    );
    if (hasAlternatePlayMode) {
      return undefined;
    }

    const actionAbility = cardDef.abilities?.find(
      (
        ability,
      ): ability is Extract<NonNullable<LorcanaCard["abilities"]>[number], { type: "action" }> =>
        ability.type === "action" && "effect" in ability,
    );
    if (!actionAbility?.effect) {
      return undefined;
    }

    // Effects whose targets are chosen by the opponent (or by the resolved
    // TARGET player) defer target selection to a pending effect AFTER the
    // card moves to limbo. The active player must NOT be shown a pre-play
    // target picker for these — playing the card has to come first so the
    // opponent can pick from their own characters at resolution time
    // (e.g. Be King Undisputed, Dinky - Has the Brains).
    const effectChosenBy = (actionAbility.effect as { chosenBy?: string }).chosenBy;
    if (effectChosenBy === "opponent" || effectChosenBy === "TARGET") {
      return undefined;
    }

    const validationContext = buildValidationContext({
      state: this.getState() as LorcanaMatchState,
      playerId: String(playerId),
      input: { args: {} } as LorcanaRuntimeMoveInputs["passTurn"],
      config: lorcanaRuntimeConfig as unknown as MatchRuntimeConfig,
      staticResources: this.getResolvedStaticResources(),
      gameEnded: !!this.getState().ctx.status.gameEnded,
      validationMode: "preflight",
    });

    const selectionContext = buildResolutionSelectionContext({
      origin: "pending-effect",
      requestId: `play-card:preview:${cardId}`,
      sourceCardId: cardId,
      chooserId: playerId,
      cardPlayed: {
        cardId,
        cardType: "action",
        costType: "standard",
        playerId,
      },
      effect: actionAbility.effect,
      resolutionInput: {},
      ctx: {
        ...validationContext,
        playerId,
      },
    });

    if (
      !selectionContext ||
      selectionContext.kind !== "target-selection" ||
      selectionContext.playerCandidateIds.length > 0 ||
      selectionContext.maxSelections !== 1 ||
      selectionContext.ordered ||
      selectionContext.autoRejected
    ) {
      return undefined;
    }

    const cardCandidateIds = selectionContext.cardCandidateIds.filter((candidateId) => {
      const zoneKey = validationContext.framework.zones.getCardZone(candidateId);
      return zoneKey?.split(":")[0] === "play";
    });
    if (
      (!options?.allowEmptyCandidates && cardCandidateIds.length === 0) ||
      cardCandidateIds.length !== selectionContext.cardCandidateIds.length
    ) {
      return undefined;
    }

    return {
      ...selectionContext,
      cardCandidateIds,
    };
  }

  hasTargetedPlayCardPreview(card: CardInput): boolean {
    const cardId = this.resolveCardId(card);
    if (!cardId) {
      return false;
    }

    const ownerId = this.findProjectedCardById(cardId)?.ownerId as PlayerId | undefined;
    if (!ownerId) {
      return false;
    }

    const cardDef = this.getCardDefinitionByInstanceId(cardId) as LorcanaCard;
    if (cardDef.cardType !== "action" || !this.canPlayCard(cardId)) {
      return false;
    }

    const availableMoves = this.getAvailableMoves();
    const hasAlternatePlayMode = availableMoves.some(
      (move) =>
        (move.moveId === "shiftCard" || move.moveId === "singCard") &&
        move.selectableCardIds.some((selectableCardId) => String(selectableCardId) === cardId),
    );
    if (hasAlternatePlayMode) {
      return false;
    }

    const actionAbility = cardDef.abilities?.find(
      (
        ability,
      ): ability is Extract<NonNullable<LorcanaCard["abilities"]>[number], { type: "action" }> =>
        ability.type === "action" && "effect" in ability,
    );
    if (!actionAbility?.effect) {
      return false;
    }

    const requirements = analyzeResolutionRequirements(actionAbility.effect);
    if (
      !requirements.requiresExplicitTargetSelection ||
      requirements.allowsExplicitEmptyTargetSelection
    ) {
      return false;
    }

    const validationContext = buildValidationContext({
      state: this.getState() as LorcanaMatchState,
      playerId: String(ownerId),
      input: { args: {} } as LorcanaRuntimeMoveInputs["passTurn"],
      config: lorcanaRuntimeConfig as unknown as MatchRuntimeConfig,
      staticResources: this.getResolvedStaticResources(),
      gameEnded: !!this.getState().ctx.status.gameEnded,
      validationMode: "preflight",
    });

    const targetAnalysis = analyzeEffectTargets(
      actionAbility.effect,
      ownerId,
      validationContext,
      cardId,
    );

    return (
      targetAnalysis.requiresExplicitSelection &&
      targetAnalysis.playerCandidates.length === 0 &&
      targetAnalysis.maxSelections === 1 &&
      targetAnalysis.allowedZones.length > 0 &&
      targetAnalysis.allowedZones.every((zone) => zone === "play")
    );
  }

  isCardUnder(parent: CardInput, child: CardInput): boolean {
    const childId = this.resolveCardId(child);
    if (!childId) {
      return false;
    }

    return this.getCardsUnder(parent).includes(childId);
  }

  getCardLore(card: CardInput): number {
    return this.getCard(card)?.lore ?? 0;
  }

  getCardsUnderCount(card: CardInput): number {
    const cardInstanceId = this.resolveCardId(card);
    if (!cardInstanceId) {
      return 0;
    }

    const projected = this.getCard(cardInstanceId);
    return Array.isArray(projected.cardsUnder) ? projected.cardsUnder.length : 0;
  }

  getCardLocationId(card: CardInput): CardInstanceId | undefined {
    const cardInstanceId = this.resolveCardId(card);
    if (!cardInstanceId) {
      return undefined;
    }

    return this.getCard(cardInstanceId).atLocationId;
  }

  hasKeyword(card: CardInput, keyword: string): boolean {
    const cardInstanceId = this.resolveCardId(card);
    if (!cardInstanceId) {
      return false;
    }

    const projected = this.getCardByInstance(cardInstanceId);
    if (projected.keywords?.includes(keyword)) {
      return true;
    }
    return (projected.keywordValues?.[keyword.toLowerCase()] ?? 0) > 0;
  }

  getKeywordValue(card: CardInput, keyword: string): number | null {
    const cardInstanceId = this.resolveCardId(card);
    if (!cardInstanceId) {
      return null;
    }

    const keywordValues = this.getCardByInstance(cardInstanceId).keywordValues;
    if (!keywordValues) {
      return null;
    }

    const value = keywordValues[keyword.toLowerCase()] ?? null;

    if (typeof value !== "number" || value <= 0) {
      return null;
    }

    return value;
  }

  hasTemporaryAbility(card: CardInput, ability: string): boolean {
    const cardInstanceId = this.resolveCardId(card);
    if (!cardInstanceId) {
      return false;
    }

    const projected = this.getCard(cardInstanceId) as
      | { temporaryAbilities?: Record<string, number> }
      | undefined;
    return typeof projected?.temporaryAbilities?.[ability] === "number";
  }

  hasTemporaryRestriction(card: CardInput, restriction: string): boolean {
    const cardInstanceId = this.resolveCardId(card);
    if (!cardInstanceId) {
      return false;
    }

    const projected = this.getCard(cardInstanceId) as
      | { temporaryRestrictions?: Record<string, number> }
      | undefined;
    return typeof projected?.temporaryRestrictions?.[restriction] === "number";
  }

  hasPlayerRestriction(playerId: string | PlayerId, restriction: string): boolean {
    const currentTurn = this.getTurnNumber();
    const expiryTurn =
      this.getBoard().temporaryPlayerRestrictions?.[String(playerId)]?.[restriction];
    return typeof expiryTurn === "number" && expiryTurn >= currentTurn;
  }

  protected requireCardId(cardInput: CardInput | LorcanaStaticCard): CardInstanceId {
    const id = this.resolveCardId(cardInput);
    if (!id) {
      throw new Error(`Card not found: ${cardInput}`);
    }

    return id as CardInstanceId;
  }

  private findProjectedCardById(cardId: CardInstanceId): LorcanaProjectedCard | undefined {
    return this.getBoard().cards[String(cardId)];
  }

  private selectZoneCards(owner: string, zone: string): LorcanaProjectedCard[] {
    const ownerId =
      owner === "you"
        ? (this.getClientPlayerId() ?? owner)
        : owner === "opponent"
          ? (this.getBoard().playerOrder.find(
              (playerId) => playerId !== this.getClientPlayerId(),
            ) ?? owner)
          : owner;
    const playerBoard = this.getBoard().players[ownerId];
    if (!playerBoard) {
      return [];
    }

    switch (zone) {
      case "hand":
        return playerBoard.hand
          .map((cardId) => this.getBoard().cards[String(cardId)])
          .filter((card): card is LorcanaProjectedCard => Boolean(card));
      case "play":
        return playerBoard.play
          .map((cardId) => this.getBoard().cards[String(cardId)])
          .filter((card): card is LorcanaProjectedCard => Boolean(card));
      case "inkwell":
        return playerBoard.inkwell
          .map((cardId) => this.getBoard().cards[String(cardId)])
          .filter((card): card is LorcanaProjectedCard => Boolean(card));
      case "discard":
        return playerBoard.discard
          .map((cardId) => this.getBoard().cards[String(cardId)])
          .filter((card): card is LorcanaProjectedCard => Boolean(card));
      default:
        return [];
    }
  }

  private getPendingActionEffectRecord(
    effectId: string,
  ): DeepReadonly<PendingActionEffect> | undefined {
    return this.getState().G.pendingEffects.find((effect) => effect.id === effectId);
  }

  private resolveOrRequiredSelectionCount(count: unknown): number {
    if (typeof count === "number" && Number.isFinite(count)) {
      return Math.max(0, Math.floor(count));
    }

    return 1;
  }

  private getOrTargetPlayerIds(target: unknown, controllerId: string): string[] {
    const playerOrder = this.getBoard().playerOrder;
    switch (target) {
      case "OPPONENT":
      case "OPPONENTS":
      case "EACH_OPPONENT":
        return playerOrder.filter((playerId) => playerId !== controllerId);
      case "EACH_PLAYER":
      case "ALL_PLAYERS":
        return [...playerOrder];
      case "CONTROLLER":
      case "CURRENT_TURN":
      default:
        return [controllerId];
    }
  }

  private isProjectedOrOptionLegal(
    effect: unknown,
    controllerId: string,
    sourceCardId: string,
  ): boolean {
    if (!effect || typeof effect !== "object") {
      return false;
    }

    const effectRecord = effect as Record<string, unknown>;
    const effectType = effectRecord.type;

    if (effectType === "sequence") {
      const nestedEffects = Array.isArray(effectRecord.steps)
        ? effectRecord.steps
        : Array.isArray(effectRecord.effects)
          ? effectRecord.effects
          : [];
      const firstNestedEffect = nestedEffects[0];
      return firstNestedEffect
        ? this.isProjectedOrOptionLegal(firstNestedEffect, controllerId, sourceCardId)
        : false;
    }

    if (effectType === "discard") {
      const requiredCount =
        effectRecord.amount === "all"
          ? 1
          : this.resolveOrRequiredSelectionCount(effectRecord.amount);
      const filter =
        effectRecord.filter && typeof effectRecord.filter === "object"
          ? (effectRecord.filter as Record<string, unknown>)
          : undefined;
      const sourceZone = typeof effectRecord.from === "string" ? effectRecord.from : "hand";

      return this.getOrTargetPlayerIds(effectRecord.target, controllerId).every((playerId) => {
        const candidates = this.selectZoneCards(playerId, sourceZone).filter((card) => {
          const definition = this.getCardDefinitionByInstanceId(card.id as CardInstanceId);
          const cardType = typeof filter?.cardType === "string" ? filter.cardType : undefined;
          const notCardType =
            typeof filter?.notCardType === "string" ? filter.notCardType : undefined;
          const classification =
            typeof filter?.classification === "string" && isClassification(filter.classification)
              ? filter.classification
              : undefined;
          const maxCost = typeof filter?.maxCost === "number" ? filter.maxCost : undefined;

          if (cardType && definition.cardType !== cardType) {
            return false;
          }
          if (notCardType && definition.cardType === notCardType) {
            return false;
          }
          if (classification && !(definition.classifications ?? []).includes(classification)) {
            return false;
          }
          if (typeof maxCost === "number" && typeof definition.cost === "number") {
            return definition.cost <= maxCost;
          }

          return true;
        });

        return candidates.length >= requiredCount;
      });
    }

    if (effectType === "return-to-hand") {
      const target =
        effectRecord.target && typeof effectRecord.target === "object"
          ? (effectRecord.target as Record<string, unknown>)
          : undefined;
      if (!target || target.selector !== "chosen") {
        return false;
      }

      const requiredCount = this.resolveOrRequiredSelectionCount(target.count);
      const owner =
        target.owner === "you" || target.owner === "opponent" || target.owner === "any"
          ? target.owner
          : "any";
      const playerIds =
        owner === "you"
          ? [controllerId]
          : owner === "opponent"
            ? this.getBoard().playerOrder.filter((playerId) => playerId !== controllerId)
            : this.getBoard().playerOrder;
      const cardTypes = Array.isArray(target.cardTypes)
        ? target.cardTypes.filter((cardType): cardType is string => typeof cardType === "string")
        : [];
      const excludeSelf = target.excludeSelf === true;

      const candidates = playerIds
        .flatMap((playerId) => this.selectZoneCards(playerId, "play"))
        .filter((card) => !excludeSelf || String(card.id) !== sourceCardId)
        .filter((card) => {
          const definition = this.getCardDefinitionByInstanceId(card.id as CardInstanceId);
          return cardTypes.length === 0 || cardTypes.includes(definition.cardType);
        });

      return candidates.length >= requiredCount;
    }

    if (effectType === "banish") {
      const target = effectRecord.target;
      const isSelfTarget =
        target === "SELF" ||
        target === "THIS_CHARACTER" ||
        target === "THIS_ITEM" ||
        target === "THIS_LOCATION" ||
        (typeof target === "object" &&
          target !== null &&
          (((target as Record<string, unknown>).ref === "self" &&
            (target as Record<string, unknown>).selector === undefined) ||
            (target as Record<string, unknown>).selector === "self"));
      if (!isSelfTarget) {
        return false;
      }

      const zone = this.getCardZone(sourceCardId as CardInput);
      return zone === "play" || zone === "limbo";
    }

    return true;
  }

  private getForcedOrSelection(effectId: string, requestedChoiceIndex: number): number | undefined {
    const pendingEffect = this.getPendingActionEffectRecord(effectId);
    if (
      pendingEffect?.kind !== "choice-selection" ||
      !pendingEffect.cardPlayed?.playerId ||
      !pendingEffect.cardPlayed.cardId ||
      !pendingEffect.effect ||
      typeof pendingEffect.effect !== "object"
    ) {
      return undefined;
    }

    const effectRecord = pendingEffect.effect as Record<string, unknown>;
    if (effectRecord.type !== "or") {
      return undefined;
    }

    const options = Array.isArray(effectRecord.options)
      ? effectRecord.options
      : Array.isArray(effectRecord.choices)
        ? effectRecord.choices
        : [];
    if (options.length === 0) {
      return undefined;
    }

    const normalizedRequestedIndex = Math.min(requestedChoiceIndex, options.length - 1);
    const legalIndices = options.flatMap((option, index) =>
      this.isProjectedOrOptionLegal(
        option,
        pendingEffect.cardPlayed!.playerId!,
        pendingEffect.cardPlayed!.cardId!,
      )
        ? [index]
        : [],
    );

    return legalIndices.length === 1 && legalIndices[0] !== normalizedRequestedIndex
      ? legalIndices[0]
      : undefined;
  }

  resolveEffect(effectId: string, opts: ResolutionExecutionOptions = {}): CommandResult {
    if (typeof effectId !== "string" || effectId.length === 0) {
      return this.createErrorResult(
        "resolveEffect requires a valid effect id.",
        "RESOLVE_EFFECT_ID_REQUIRED",
      );
    }

    let resolvedTargets: (CardInstanceId | PlayerId)[] | SlottedTargetInput | undefined;
    if (opts.targets !== undefined) {
      try {
        if (isUnresolvedSlottedTargetInput(opts.targets)) {
          const slotted = opts.targets as SlottedTargetInputOf<CardInput | PlayerId>;
          resolvedTargets = resolveSlottedTargetInputWith(slotted, (ids) =>
            ids.length > 0 ? this.resolveSelectionTargets(ids) : [],
          );
        } else {
          resolvedTargets = this.resolveSelectionTargets(
            opts.targets as readonly (CardInput | PlayerId)[],
          );
        }
      } catch (error) {
        return this.createErrorResult(
          error instanceof Error ? error.message : "Failed to resolve resolveEffect targets",
          "CARD_RESOLVE_FAILED",
        );
      }
    }

    const resolvedDestinations: LorcanaRuntimeMoveParams["playCard"]["destinations"] =
      Array.isArray(opts.destinations)
        ? opts.destinations.reduce<
            NonNullable<LorcanaRuntimeMoveParams["playCard"]["destinations"]>
          >((acc, destination) => {
            const requestedCards = Array.isArray(destination.cards)
              ? destination.cards
              : [destination.cards];
            let resolvedCards: CardInstanceId[] = [];
            try {
              resolvedCards = this.resolveCardInputs(requestedCards);
            } catch {
              resolvedCards = [];
            }

            acc.push({
              cards: resolvedCards,
              zone: destination.zone,
            });

            return acc;
          }, [])
        : undefined;

    const params: Record<string, unknown> = {};
    if (typeof opts.amount === "number") {
      params.amount = opts.amount;
    }
    if (typeof opts.namedCard === "string" && opts.namedCard.trim().length > 0) {
      params.namedCard = opts.namedCard.trim();
    }
    if (typeof opts.choiceIndex === "number") {
      params.choiceIndex = opts.choiceIndex;
    }
    if (typeof opts.resolveOptional === "boolean") {
      params.resolveOptional = opts.resolveOptional;
    }
    if (typeof opts.enterPlayExerted === "boolean") {
      params.enterPlayExerted = opts.enterPlayExerted;
    }
    if (Array.isArray(opts.destinations)) {
      params.destinations = resolvedDestinations ?? [];
    }

    // Build args - only effectId is needed to match the intent
    // targets are passed in params, not at the top level
    if (!this.enumerateMoves().includes("resolveEffect")) {
      return this.createErrorResult(
        "resolveEffect is not currently available.",
        "RESOLVE_EFFECT_UNAVAILABLE",
      );
    }

    // Build the final args - the resolveEffect move expects:
    // { effectId, params: { resolveOptional?, targets?, ... } }
    // Note: We explicitly construct args rather than spreading matchingMove.args
    // to avoid including any unintended fields at the top level
    const input: LorcanaRuntimeMoveInputs["resolveEffect"] = {
      args: {
        effectId,
        params: {
          ...params,
          ...(resolvedTargets ? { targets: resolvedTargets } : {}),
        },
      },
    };

    const forcedChoiceIndex =
      typeof opts.choiceIndex === "number"
        ? this.getForcedOrSelection(effectId, opts.choiceIndex)
        : undefined;
    if (typeof forcedChoiceIndex === "number") {
      (input.args.params as Record<string, unknown>).choiceIndex = forcedChoiceIndex;
    }

    const result = this.executeMove("resolveEffect", input);
    if (!result.success) {
      return result;
    }

    if (typeof forcedChoiceIndex === "number") {
      return {
        success: false,
        error: "The selected branch is not legal; the only legal branch was resolved instead.",
        errorCode: "FORCED_OR_BRANCH",
        currentStateID: this.getStateID(),
      };
    }

    return result;
  }

  /**
   * Convenience method to play a card.
   * @param playerId - The player executing the move
   * @param card - The card to play (CardInput)
   * @param opts - Optional play parameters
   * @returns CommandResult
   */
  playCard(card: CardInput, opts?: PlayCardExecutionOptions): CommandResult;
  playCard(playerId: string, card: CardInput, opts?: PlayCardExecutionOptions): CommandResult;
  playCard(
    playerIdOrCard: string | CardInput,
    cardOrOpts?: CardInput | PlayCardExecutionOptions,
    opts?: PlayCardExecutionOptions,
  ): CommandResult {
    const scopedPlayerId = this.getScopedPlayerId();
    const isScopedCall =
      scopedPlayerId !== undefined &&
      (cardOrOpts === undefined ||
        (typeof cardOrOpts === "object" && cardOrOpts !== null && !Array.isArray(cardOrOpts)));

    const playerId = isScopedCall ? scopedPlayerId : playerIdOrCard;
    const card = (isScopedCall ? playerIdOrCard : cardOrOpts) as CardInput | undefined;
    const resolvedOpts = (isScopedCall ? cardOrOpts : opts) as PlayCardExecutionOptions | undefined;

    if (!card) {
      return this.createErrorResult("playCard requires a card input.", "CARD_INPUT_REQUIRED");
    }

    const cardId = this.resolveCardId(card);
    if (!cardId) {
      return this.createCardResolutionError("playCard", "Could not resolve card input");
    }
    const resolvedCost = this.resolvePlayCardCostInput(resolvedOpts?.cost ?? "standard");
    // Extract the simple cost string from PlayCardCostInput
    const costString = typeof resolvedCost === "object" ? resolvedCost.cost : resolvedCost;

    // Resolve targets from CardInput[]/PlayerId[] to runtime selection target ids.
    // The input may be a flat array (legacy positional form) or a slotted
    // discriminated object (new form). Slotted inputs are resolved slot-by-slot
    // and forwarded to the move runtime as a structured `SlottedTargetInput`.
    let resolvedTargets: (CardInstanceId | PlayerId)[] | SlottedTargetInput | undefined;
    if (resolvedOpts?.targets !== undefined) {
      try {
        if (isUnresolvedSlottedTargetInput(resolvedOpts.targets)) {
          const slotted = resolvedOpts.targets as SlottedTargetInputOf<CardInput | PlayerId>;
          resolvedTargets = resolveSlottedTargetInputWith(slotted, (ids) =>
            ids.length > 0 ? this.resolveSelectionTargets(ids) : [],
          );
        } else {
          resolvedTargets = this.resolveSelectionTargets(
            resolvedOpts.targets as readonly (CardInput | PlayerId)[],
          );
        }
      } catch (error) {
        return this.createErrorResult(
          error instanceof Error ? error.message : "Failed to resolve playCard targets",
          "CARD_RESOLVE_FAILED",
        );
      }
    }

    // Resolve destinations if provided
    const resolvedDestinations: LorcanaRuntimeMoveParams["playCard"]["destinations"] =
      Array.isArray(resolvedOpts?.destinations) && resolvedOpts.destinations.length > 0
        ? resolvedOpts.destinations.reduce<
            NonNullable<LorcanaRuntimeMoveParams["playCard"]["destinations"]>
          >((acc, destination) => {
            const requestedCards = Array.isArray(destination.cards)
              ? destination.cards
              : [destination.cards];
            let resolvedCards: CardInstanceId[] = [];
            try {
              resolvedCards = this.resolveCardInputs(requestedCards);
            } catch {
              resolvedCards = [];
            }

            // Preserve empty destinations to maintain positional mapping
            // between player selections and ability destination definitions.
            acc.push({
              cards: resolvedCards,
              zone: destination.zone,
            });

            return acc;
          }, [])
        : undefined;

    const costParams: Omit<LorcanaRuntimeMoveParams["playCard"], "cardId" | "cost"> = {
      ...(typeof resolvedCost === "object" ? resolvedCost : {}),
      ...(resolvedTargets !== undefined ? { targets: resolvedTargets } : {}),
      ...(resolvedOpts?.playerTargets !== undefined
        ? { playerTargets: resolvedOpts.playerTargets }
        : {}),
      ...(resolvedOpts?.amount !== undefined ? { amount: resolvedOpts.amount } : {}),
      ...(resolvedOpts?.resolveOptional !== undefined
        ? { resolveOptional: resolvedOpts.resolveOptional }
        : {}),
      ...(resolvedOpts?.enterPlayExerted !== undefined
        ? { enterPlayExerted: resolvedOpts.enterPlayExerted }
        : {}),
      ...(resolvedOpts?.choiceIndex !== undefined ? { choiceIndex: resolvedOpts.choiceIndex } : {}),
      ...(resolvedDestinations !== undefined ? { destinations: resolvedDestinations } : {}),
      ...(resolvedOpts?.preventAutoResolveTriggeredEffects !== undefined
        ? {
            preventAutoResolveTriggeredEffects: resolvedOpts.preventAutoResolveTriggeredEffects,
          }
        : {}),
      ...(resolvedOpts?.eventSnapshot ? { eventSnapshot: resolvedOpts.eventSnapshot } : {}),
    };

    const result = this.playCardByInstance(
      String(playerId),
      cardId,
      costString as LorcanaRuntimeMoveParams["playCard"]["cost"],
      costParams,
      undefined,
      {
        returnProcessedMove: resolvedOpts?.returnProcessedMove,
      },
    );

    // When standard cost fails for a song card and no explicit cost was specified,
    // auto-select a singer to sing the song.
    if (!result.success && costString === "standard" && !resolvedOpts?.cost) {
      const cardDef = this.getCardDefinitionByInstanceId(cardId) as LorcanaCard;
      if (isSongCard(cardDef)) {
        const resolvedPlayerId = String(playerId);
        const songPlayOptions = this.getSongPlayOptions(cardId, resolvedPlayerId);
        if (songPlayOptions.singleSingerIds.length > 0) {
          return this.playCardByInstance(
            resolvedPlayerId,
            cardId,
            "sing",
            {
              ...costParams,
              singer: songPlayOptions.singleSingerIds[0]!,
            },
            undefined,
            {
              returnProcessedMove: resolvedOpts?.returnProcessedMove,
            },
          );
        }
      }
    }

    return result;
  }

  /**
   * Convenience method to quest with a character.
   * @param playerId - The player executing the move
   * @param card - The character to quest with (CardInput)
   * @returns CommandResult
   */
  quest(card: CardInput): CommandResult;
  quest(playerId: string, card: CardInput): CommandResult;
  quest(playerIdOrCard: string | CardInput, card?: CardInput): CommandResult {
    const playerId = card === undefined ? this.getScopedPlayerId() : playerIdOrCard;
    const resolvedCard = (card === undefined ? playerIdOrCard : card) as CardInput;

    if (!playerId) {
      return this.createErrorResult(
        "quest requires a player id when used from a non-player-scoped engine.",
        "PLAYER_ID_REQUIRED",
      );
    }

    const cardId = this.resolveCardId(resolvedCard);
    if (!cardId) {
      return this.createCardResolutionError("quest", "Could not resolve card input");
    }
    return this.questByInstance(String(playerId), cardId);
  }

  /**
   * Convenience method to challenge with a character.
   * @param playerId - The player executing the move
   * @param attacker - The attacking character (CardInput)
   * @param defender - The defending character (CardInput)
   * @returns CommandResult
   */
  challenge(attacker: CardInput, defender: CardInput): CommandResult;
  challenge(playerId: string, attacker: CardInput, defender: CardInput): CommandResult;
  challenge(
    playerIdOrAttacker: string | CardInput,
    attackerOrDefender: CardInput,
    defender?: CardInput,
  ): CommandResult {
    const playerId = defender === undefined ? this.getScopedPlayerId() : playerIdOrAttacker;
    const attacker = (
      defender === undefined ? playerIdOrAttacker : attackerOrDefender
    ) as CardInput;
    const resolvedDefender = (defender === undefined ? attackerOrDefender : defender) as CardInput;

    if (!playerId) {
      return this.createErrorResult(
        "challenge requires a player id when used from a non-player-scoped engine.",
        "PLAYER_ID_REQUIRED",
      );
    }

    const actingPlayerId = playerId as PlayerId;
    const attackerId = this.resolveCardId(attacker, actingPlayerId);
    const defenderId = this.resolveCardId(resolvedDefender, actingPlayerId);
    if (!attackerId || !defenderId) {
      return this.createCardResolutionError("challenge", "Could not resolve card input");
    }
    return this.challengeByInstance(String(playerId), attackerId, defenderId);
  }

  moveCharacterToLocation(character: CardInput, location: CardInput): CommandResult;
  moveCharacterToLocation(
    playerId: string,
    character: CardInput,
    location: CardInput,
  ): CommandResult;
  moveCharacterToLocation(
    playerIdOrCharacter: string | CardInput,
    characterOrLocation: CardInput,
    location?: CardInput,
  ): CommandResult {
    const playerId = location === undefined ? this.getScopedPlayerId() : playerIdOrCharacter;
    const character = (
      location === undefined ? playerIdOrCharacter : characterOrLocation
    ) as CardInput;
    const resolvedLocation = (location === undefined ? characterOrLocation : location) as CardInput;

    if (!playerId) {
      return this.createErrorResult(
        "moveCharacterToLocation requires a player id when used from a non-player-scoped engine.",
        "PLAYER_ID_REQUIRED",
      );
    }

    const characterId = this.resolveCardId(character);
    const locationId = this.resolveCardId(resolvedLocation);
    if (!characterId || !locationId) {
      return this.createCardResolutionError(
        "moveCharacterToLocation",
        "Could not resolve card input",
      );
    }

    return this.moveCharacterToLocationByInstance(String(playerId), characterId, locationId);
  }

  /**
   * Convenience method to put a card into the inkwell.
   * @param playerId - The player executing the move
   * @param card - The card to put into inkwell (CardInput)
   * @returns CommandResult
   */
  putIntoInkwell(playerId: string, card: CardInput): CommandResult {
    const cardId = this.resolveCardId(card);
    if (!cardId) {
      return this.createCardResolutionError("putIntoInkwell", "Could not resolve card input");
    }
    return this.putIntoInkwellByInstance(playerId, cardId);
  }

  /**
   * Convenience method to mulligan cards.
   * @param playerId - The player executing the move
   * @param cards - The cards to mulligan (CardInput[])
   * @returns CommandResult
   */
  mulligan(cards: CardInput[]): CommandResult;
  mulligan(playerId: string, cards: CardInput[]): CommandResult;
  mulligan(playerIdOrCards: string | CardInput[], cards?: CardInput[]): CommandResult {
    const playerId = Array.isArray(playerIdOrCards) ? this.getScopedPlayerId() : playerIdOrCards;
    const resolvedCards = (Array.isArray(playerIdOrCards) ? playerIdOrCards : cards) ?? [];

    if (!playerId) {
      return this.createErrorResult(
        "mulligan requires a player id when used from a non-player-scoped engine.",
        "PLAYER_ID_REQUIRED",
      );
    }

    const cardIds = resolvedCards
      .map((c) => this.resolveCardId(c))
      .filter((id): id is CardInstanceId => Boolean(id));
    if (cardIds.length !== resolvedCards.length) {
      return this.createCardResolutionError("mulligan", "Could not resolve some card inputs");
    }
    return this.mulliganByInstance(playerId, cardIds);
  }

  /**
   * Convenience method to add ink (put a card into inkwell).
   * Alias for putIntoInkwell.
   * @param playerId - The player executing the move
   * @param card - The card to ink (CardInput)
   * @returns CommandResult
   */
  ink(card: CardInput): CommandResult;
  ink(playerId: string, card: CardInput): CommandResult;
  ink(playerIdOrCard: string | CardInput, card?: CardInput): CommandResult {
    if (card === undefined) {
      const playerId = this.getScopedPlayerId();
      if (!playerId) {
        return this.createErrorResult(
          "ink requires a player id when used from a non-player-scoped engine.",
          "PLAYER_ID_REQUIRED",
        );
      }
      return this.putIntoInkwell(playerId, playerIdOrCard as CardInput);
    }

    return this.putIntoInkwell(String(playerIdOrCard), card);
  }

  activateAbility(
    playerId: string,
    card: CardInput,
    ability?: string | ActivateAbilityExecutionOptions,
  ): CommandResult;
  activateAbility(
    card: CardInput,
    ability?: string | ActivateAbilityExecutionOptions,
  ): CommandResult;
  activateAbility(
    playerIdOrCard: string | CardInput,
    cardOrAbility?: CardInput | string | ActivateAbilityExecutionOptions,
    ability?: string | ActivateAbilityExecutionOptions,
  ): CommandResult {
    const scopedCall =
      cardOrAbility === undefined ||
      (typeof cardOrAbility === "string" &&
        ability === undefined &&
        this.resolveCardId(playerIdOrCard as CardInput) !== undefined) ||
      (typeof cardOrAbility === "object" &&
        cardOrAbility !== null &&
        !Array.isArray(cardOrAbility) &&
        ("ability" in cardOrAbility ||
          "abilityIndex" in cardOrAbility ||
          "targets" in cardOrAbility ||
          "effectSelections" in cardOrAbility ||
          "choiceIndex" in cardOrAbility ||
          "costs" in cardOrAbility));

    const playerId = scopedCall ? this.getScopedPlayerId() : String(playerIdOrCard);
    const card = (scopedCall ? playerIdOrCard : cardOrAbility) as CardInput;
    const resolvedAbility = (scopedCall ? cardOrAbility : ability) as
      | string
      | ActivateAbilityExecutionOptions
      | undefined;

    return this.activateAbilityInternal(playerId, card, resolvedAbility);
  }

  private activateAbilityInternal(
    playerId: string | undefined,
    card: CardInput,
    ability?: string | ActivateAbilityExecutionOptions,
  ): CommandResult {
    const cardId = this.resolveCardId(card);
    if (!cardId) {
      return this.createCardResolutionError("activateAbility", "Could not resolve card input");
    }

    if (!playerId) {
      return this.createErrorResult(
        "activateAbility requires a player id when used from a non-player-scoped engine.",
        "PLAYER_ID_REQUIRED",
      );
    }

    const resolvedOptions =
      typeof ability === "string" || ability === undefined ? { ability } : ability;

    const resolvedAbility =
      typeof resolvedOptions.abilityIndex === "number"
        ? this.findActivatedAbilityByIndex(cardId, resolvedOptions.abilityIndex)
        : this.findActivatedAbility(cardId, resolvedOptions.ability);
    if (!resolvedAbility) {
      return this.createErrorResult(
        typeof resolvedOptions.abilityIndex === "number"
          ? `Activated ability not found at index ${resolvedOptions.abilityIndex}`
          : `Activated ability not found${resolvedOptions.ability ? `: ${resolvedOptions.ability}` : ""}`,
        "ABILITY_NOT_FOUND",
      );
    }

    let resolvedTargets: CardInstanceId[] | undefined;
    if (resolvedOptions.targets !== undefined) {
      try {
        resolvedTargets = this.resolveCardInputs(resolvedOptions.targets);
      } catch (error) {
        return this.createErrorResult(
          error instanceof Error ? error.message : "Failed to resolve activateAbility targets",
          "CARD_RESOLVE_FAILED",
        );
      }
    }

    let resolvedExertCharacterCosts: CardInstanceId[] | undefined;
    if (resolvedOptions.costs?.exertCharacters !== undefined) {
      try {
        resolvedExertCharacterCosts = this.resolveCardInputs(resolvedOptions.costs.exertCharacters);
      } catch (error) {
        return this.createErrorResult(
          error instanceof Error
            ? error.message
            : "Failed to resolve activateAbility exert-character costs",
          "CARD_RESOLVE_FAILED",
        );
      }
    }

    let resolvedExertItemCosts: CardInstanceId[] | undefined;
    if (resolvedOptions.costs?.exertItems !== undefined) {
      try {
        resolvedExertItemCosts = this.resolveCardInputs(resolvedOptions.costs.exertItems);
      } catch (error) {
        return this.createErrorResult(
          error instanceof Error
            ? error.message
            : "Failed to resolve activateAbility exert-item costs",
          "CARD_RESOLVE_FAILED",
        );
      }
    }

    let resolvedDiscardCardCosts: CardInstanceId[] | undefined;
    if (resolvedOptions.costs?.discardCards !== undefined) {
      try {
        resolvedDiscardCardCosts = this.resolveCardInputs(resolvedOptions.costs.discardCards);
      } catch (error) {
        return this.createErrorResult(
          error instanceof Error
            ? error.message
            : "Failed to resolve activateAbility discard-card costs",
          "CARD_RESOLVE_FAILED",
        );
      }
    }

    let resolvedBanishItemCosts: CardInstanceId[] | undefined;
    if (resolvedOptions.costs?.banishItems !== undefined) {
      try {
        resolvedBanishItemCosts = this.resolveCardInputs(resolvedOptions.costs.banishItems);
      } catch (error) {
        return this.createErrorResult(
          error instanceof Error
            ? error.message
            : "Failed to resolve activateAbility banish-item costs",
          "CARD_RESOLVE_FAILED",
        );
      }
    }

    let resolvedBanishCharacterCosts: CardInstanceId[] | undefined;
    if (resolvedOptions.costs?.banishCharacters !== undefined) {
      try {
        resolvedBanishCharacterCosts = this.resolveCardInputs(
          resolvedOptions.costs.banishCharacters,
        );
      } catch (error) {
        return this.createErrorResult(
          error instanceof Error
            ? error.message
            : "Failed to resolve activateAbility banish-character costs",
          "CARD_RESOLVE_FAILED",
        );
      }
    }

    return this.executeMove("activateAbility", playerId, {
      cardId,
      abilityIndex: resolvedAbility.abilityIndex,
      ...(resolvedTargets !== undefined ? { targets: resolvedTargets } : {}),
      ...(resolvedOptions.effectSelections !== undefined
        ? { effectSelections: resolvedOptions.effectSelections }
        : {}),
      ...(resolvedOptions.choiceIndex !== undefined
        ? { choiceIndex: resolvedOptions.choiceIndex }
        : {}),
      ...(resolvedOptions.preventAutoResolveTriggeredEffects !== undefined
        ? { preventAutoResolveTriggeredEffects: resolvedOptions.preventAutoResolveTriggeredEffects }
        : {}),
      ...(resolvedBanishItemCosts !== undefined ||
      resolvedBanishCharacterCosts !== undefined ||
      resolvedExertCharacterCosts !== undefined ||
      resolvedExertItemCosts !== undefined ||
      resolvedDiscardCardCosts !== undefined
        ? {
            costs: {
              ...(resolvedBanishItemCosts !== undefined
                ? { banishItems: resolvedBanishItemCosts }
                : {}),
              ...(resolvedBanishCharacterCosts !== undefined
                ? { banishCharacters: resolvedBanishCharacterCosts }
                : {}),
              ...(resolvedExertCharacterCosts !== undefined
                ? { exertCharacters: resolvedExertCharacterCosts }
                : {}),
              ...(resolvedExertItemCosts !== undefined
                ? { exertItems: resolvedExertItemCosts }
                : {}),
              ...(resolvedDiscardCardCosts !== undefined
                ? { discardCards: resolvedDiscardCardCosts }
                : {}),
            },
          }
        : {}),
    });
  }

  private isSetupMove(moveId: string): moveId is SetupMoveId {
    return moveId === "chooseWhoGoesFirst" || moveId === "alterHand";
  }

  private composeSetupMoveRequest(
    moveId: SetupMoveId,
    params: Record<string, unknown>,
  ): LorcanaMoveComposeResult {
    try {
      if (moveId === "chooseWhoGoesFirst") {
        const firstPlayerId = this.resolveFirstPlayerId(params);
        if (!firstPlayerId) {
          return {
            success: false,
            moveId,
            reason: "chooseWhoGoesFirst requires a target playerId or side.",
          };
        }

        return {
          success: true,
          moveId,
          input: {
            args: { playerId: firstPlayerId },
          } as LorcanaRuntimeMoveInputs[keyof LorcanaRuntimeMoveInputs],
        };
      }

      const cardsToMulligan = this.resolveCardsToMulligan(params);
      if (!cardsToMulligan) {
        return {
          success: false,
          moveId,
          reason: "alterHand requires cardsToMulligan to be an array of card ids.",
        };
      }

      return {
        success: true,
        moveId,
        input: {
          args: { cardsToMulligan },
        } as LorcanaRuntimeMoveInputs[keyof LorcanaRuntimeMoveInputs],
      };
    } catch (error) {
      return {
        success: false,
        moveId,
        reason: error instanceof Error ? error.message : "Failed to compose setup move input.",
      };
    }
  }

  private resolveCardsToMulligan(params: Record<string, unknown>): CardInstanceId[] | null {
    const rawCards = params.cardsToMulligan;
    if (rawCards === undefined) {
      return [];
    }
    if (!Array.isArray(rawCards) || !rawCards.every((cardId) => typeof cardId === "string")) {
      return null;
    }
    return asCardInstanceIds(rawCards);
  }

  private resolveFirstPlayerId(params: Record<string, unknown>): string | null {
    const maybeSide = params.side ?? params.firstPlayerSide;
    if (maybeSide === "playerOne" || maybeSide === "playerTwo") {
      return maybeSide === "playerOne" ? "player_one" : "player_two";
    }

    return typeof params.playerId === "string" && params.playerId.length > 0
      ? params.playerId
      : null;
  }

  // ============================================================================
  // Available Moves API — Structured move enumeration for UI consumption
  // ============================================================================

  /**
   * Layer 1: Returns all available moves and which cards can start each move.
   * playCard is split into playCard (standard/free), singCard, and shiftCard.
   */
  getAvailableMoves(): AvailableMove[] {
    const currentStateID = this.getStateID();
    if (this._cachedAvailableMoves && this._cachedAvailableMovesStateID === currentStateID) {
      return this._cachedAvailableMoves;
    }

    const clientPlayerId = this.getClientPlayerId();
    if (!clientPlayerId) {
      return [];
    }

    const legalMoveIds = this.enumerateMoves();
    const board = this.getBoard();
    const playerBoard = board.players[clientPlayerId];
    if (!playerBoard) {
      return [];
    }

    const hasPlayablePlayFromUnderCard = (() => {
      const currentTurn = this.getState().ctx.status.turn ?? 1;
      const permissions = getActivePlayFromUnderPermissions(
        this.getState().G.playFromUnderPermissions,
        clientPlayerId as PlayerId,
        currentTurn,
      );
      for (const permission of permissions) {
        const sourceItemMeta = this.getState().ctx.zones.private.cardMeta[permission.sourceItemId];
        const underCardIds = Array.isArray(sourceItemMeta?.cardsUnder)
          ? (sourceItemMeta.cardsUnder as CardInstanceId[])
          : [];
        if (underCardIds.some((cardId) => this.canPlayCard(cardId))) {
          return true;
        }
      }
      return false;
    })();

    const shouldAnalyzePlayCards =
      legalMoveIds.includes("playCard") ||
      playerBoard.hand.some((cardId) => this.canPlayCard(cardId as CardInstanceId)) ||
      hasPlayablePlayFromUnderCard;
    const moveIdsToAnalyze =
      shouldAnalyzePlayCards && !legalMoveIds.includes("playCard")
        ? [...legalMoveIds, "playCard"]
        : legalMoveIds;

    const moves: AvailableMove[] = [];

    for (const moveId of moveIdsToAnalyze) {
      if (moveId === "alterHand") {
        continue;
      }
      if (moveId.startsWith("manual") || moveId === "resolveBag" || moveId === "resolveEffect") {
        continue;
      }

      if (moveId === "playCard") {
        const playCardIds: CardInstanceId[] = [];
        const singCardIds: CardInstanceId[] = [];
        const shiftCardIds: CardInstanceId[] = [];

        for (const cardId of playerBoard.hand) {
          const id = cardId as CardInstanceId;
          const definition = this.getCardDefinitionByInstanceId(id);
          const card = definition as LorcanaCard;

          // Check standard/free play only. canPlayCard also includes sing/shift
          // fallbacks, but those belong in the dedicated singCard/shiftCard
          // move buckets below.
          if (
            this.validateMove("playCard", {
              args: { cardId: id, cost: "standard" },
            }).valid
          ) {
            playCardIds.push(id);
          }

          // Check shift — need at least one valid shift target on board
          if (hasShift(definition)) {
            const shiftRules = getShiftRules(card);
            if (shiftRules) {
              const selectableCosts = this.getSelectableCostsForShift(clientPlayerId, card);
              if (!this.hasSufficientSelectableCosts(selectableCosts)) {
                continue;
              }
              const playCandidates = playerBoard.play.map((pid) => pid as CardInstanceId);
              const shiftTargets = resolveShiftTargetCandidates(
                shiftRules,
                playCandidates,
                (cid) => this.getCardDefinitionByInstanceId(cid) as LorcanaCard,
              );
              const hasValidShiftTarget = shiftTargets.some((targetId) =>
                this.canDiscoverShiftPlay(id, targetId),
              );
              if (hasValidShiftTarget) {
                shiftCardIds.push(id);
              }
            }
          }

          // Check sing — songs can be sung by characters
          if (isSongCard(card)) {
            const songPlayOptions = this.getSongPlayOptions(id, clientPlayerId);
            if (
              songPlayOptions.singleSingerIds.length > 0 ||
              songPlayOptions.singTogetherOption !== null
            ) {
              singCardIds.push(id);
            }
          }

          // Check sacrifice alternative cost (e.g., Belle - Apprentice Inventor)
          if (
            !playCardIds.includes(id) &&
            card.abilities?.some(
              (a) =>
                a.type === "action" &&
                "alternativeCost" in a &&
                a.alternativeCost === "sacrifice-item",
            )
          ) {
            const hasItem = playerBoard.play.some((pid) => {
              const pDef = this.getCardDefinitionByInstanceId(pid as CardInstanceId);
              return pDef?.cardType === "item";
            });
            if (hasItem) {
              playCardIds.push(id);
            }
          }

          // Check exert-items alternative cost (e.g., Scrooge McDuck - Resourceful Miser)
          if (
            !playCardIds.includes(id) &&
            card.abilities?.some(
              (a) =>
                a.type === "action" &&
                "alternativeCost" in a &&
                a.alternativeCost === "exert-4-items",
            )
          ) {
            const readyItemCount = playerBoard.play.filter((pid) => {
              const pDef = this.getCardDefinitionByInstanceId(pid as CardInstanceId);
              if (pDef?.cardType !== "item") return false;
              const cardState = this.getBoard().cards[String(pid)];
              return !cardState?.exerted;
            }).length;
            if (readyItemCount >= 4) {
              playCardIds.push(id);
            }
          }

          // Check put-toy-character-on-deck-bottom alternative cost
          // (e.g., Hand-in-the-Box - Sid's Toy)
          if (
            !playCardIds.includes(id) &&
            card.abilities?.some(
              (a) =>
                a.type === "action" &&
                "alternativeCost" in a &&
                a.alternativeCost === "put-toy-character-on-deck-bottom",
            )
          ) {
            const hasToyCharacterInDiscard = playerBoard.discard.some((pid) => {
              const pDef = this.getCardDefinitionByInstanceId(pid as CardInstanceId);
              if (pDef?.cardType !== "character") return false;
              return (pDef.classifications ?? []).includes("Toy");
            });
            if (hasToyCharacterInDiscard) {
              playCardIds.push(id);
            }
          }
        }

        // Check limbo cards that can be played via play-from-under permissions
        const currentTurnForLimbo = this.getState().ctx.status.turn ?? 1;
        const validPermissions = getActivePlayFromUnderPermissions(
          this.getState().G.playFromUnderPermissions,
          clientPlayerId as PlayerId,
          currentTurnForLimbo,
        );
        for (const permission of validPermissions) {
          const sourceItemMeta =
            this.getState().ctx.zones.private.cardMeta[permission.sourceItemId];
          const underCardIds = Array.isArray(sourceItemMeta?.cardsUnder)
            ? (sourceItemMeta.cardsUnder as CardInstanceId[])
            : [];
          for (const underCardId of underCardIds) {
            if (!playCardIds.includes(underCardId) && this.canPlayCard(underCardId)) {
              playCardIds.push(underCardId);
            }
            // Also check if limbo cards can be shifted
            if (!shiftCardIds.includes(underCardId)) {
              const underDef = this.getCardDefinitionByInstanceId(underCardId);
              if (hasShift(underDef)) {
                const underShiftRules = getShiftRules(underDef as LorcanaCard);
                if (underShiftRules && !underShiftRules.unsupportedReason) {
                  const playCandidates = playerBoard.play.map((pid) => pid as CardInstanceId);
                  const shiftTargets = resolveShiftTargetCandidates(
                    underShiftRules,
                    playCandidates,
                    (cid) => this.getCardDefinitionByInstanceId(cid) as LorcanaCard,
                  );
                  const hasValidShiftTarget = shiftTargets.some((targetId) =>
                    this.canDiscoverShiftPlay(underCardId, targetId),
                  );
                  if (hasValidShiftTarget) {
                    shiftCardIds.push(underCardId);
                  }
                }
              }
            }
          }
        }

        if (playCardIds.length > 0) {
          moves.push({ moveId: "playCard", selectableCardIds: playCardIds });
        }
        if (singCardIds.length > 0) {
          moves.push({ moveId: "singCard", selectableCardIds: singCardIds });
        }
        if (shiftCardIds.length > 0) {
          moves.push({ moveId: "shiftCard", selectableCardIds: shiftCardIds });
        }
        continue;
      }

      if (moveId === "putCardIntoInkwell") {
        const inkableCardIds: CardInstanceId[] = [];
        for (const cardId of [...playerBoard.hand, ...playerBoard.discard]) {
          const id = cardId as CardInstanceId;
          if (
            this.validateMove("putCardIntoInkwell", {
              args: { cardId: id },
            }).valid
          ) {
            inkableCardIds.push(id);
          }
        }
        if (inkableCardIds.length > 0) {
          moves.push({
            moveId: "putCardIntoInkwell",
            selectableCardIds: inkableCardIds,
          });
        }
        continue;
      }

      if (moveId === "quest") {
        const questableCardIds: CardInstanceId[] = [];
        for (const cardId of playerBoard.play) {
          const id = cardId as CardInstanceId;
          if (this.validateMove("quest", { args: { cardId: id } }).valid) {
            questableCardIds.push(id);
          }
        }
        if (questableCardIds.length > 0) {
          moves.push({ moveId: "quest", selectableCardIds: questableCardIds });
        }
        continue;
      }

      if (moveId === "challenge") {
        const challengerCardIds = this.getCachedEligibleChallengeAttackers(clientPlayerId).filter(
          (attackerId) => playerBoard.play.includes(attackerId),
        );
        if (challengerCardIds.length > 0) {
          moves.push({
            moveId: "challenge",
            selectableCardIds: challengerCardIds,
          });
        }
        continue;
      }

      if (moveId === "moveCharacterToLocation") {
        const movableCharacterIds: CardInstanceId[] = [];
        for (const cardId of playerBoard.play) {
          const id = cardId as CardInstanceId;
          const definition = this.getCardDefinitionByInstanceId(id);
          if (definition.cardType !== "character") continue;

          // Check if this character can move to ANY location
          const canMoveToAny = playerBoard.play.some((locationId) => {
            const locDef = this.getCardDefinitionByInstanceId(locationId as CardInstanceId);
            if (locDef.cardType !== "location") return false;
            return this.validateMove("moveCharacterToLocation", {
              args: {
                characterId: id,
                locationId: locationId as CardInstanceId,
              },
            }).valid;
          });
          if (canMoveToAny) {
            movableCharacterIds.push(id);
          }
        }
        if (movableCharacterIds.length > 0) {
          moves.push({
            moveId: "moveCharacterToLocation",
            selectableCardIds: movableCharacterIds,
          });
        }
        continue;
      }

      if (moveId === "activateAbility") {
        const activatableCardIds: CardInstanceId[] = [];
        const activateRegistry = buildRegistryFromMatchState(this.getAuthoritativeState(), (id) =>
          this.getCardDefinitionByInstanceId(id),
        );
        for (const cardId of playerBoard.play) {
          const id = cardId as CardInstanceId;
          const definition = this.getCardDefinitionByInstanceId(id);
          const abilityEntryCount = (definition.abilities ?? []).filter(
            (a: { type: string }) => a.type === "activated",
          ).length;
          const grantedCount = getGrantedActivatedAbilities({
            state: toStaticAbilityState(this.getAuthoritativeState()),
            cardId: id,
            getDefinitionByInstanceId: (instanceId) =>
              this.getCardDefinitionByInstanceId(instanceId),
            registry: activateRegistry,
          }).length;
          const totalAbilities = abilityEntryCount + grantedCount;

          for (let abilityIndex = 0; abilityIndex < totalAbilities; abilityIndex++) {
            const validation = this.validateMove("activateAbility", {
              args: { cardId: id, abilityIndex },
            });
            if (isDiscoverableActivateAbilityValidation(validation)) {
              activatableCardIds.push(id);
              break; // At least one ability is activatable
            }
          }
        }
        if (activatableCardIds.length > 0) {
          moves.push({
            moveId: "activateAbility",
            selectableCardIds: activatableCardIds,
          });
        }
        continue;
      }

      if (moveId === "passTurn") {
        moves.push({ moveId: "passTurn", selectableCardIds: [] });
        continue;
      }

      if (moveId === "questWithAll") {
        moves.push({ moveId: "questWithAll", selectableCardIds: [] });
        continue;
      }

      if (moveId === "chooseWhoGoesFirst") {
        moves.push({ moveId: "chooseWhoGoesFirst", selectableCardIds: [] });
        continue;
      }

      if (moveId === "concede") {
        moves.push({ moveId: "concede", selectableCardIds: [] });
        continue;
      }
    }

    this._cachedAvailableMoves = moves;
    this._cachedAvailableMovesStateID = currentStateID;
    this._cachedLegalMoveIds = legalMoveIds;
    this._cachedLegalMoveIdsStateID = currentStateID;
    return moves;
  }

  /**
   * Layer 2: Given a move and first card selection, returns second-layer options.
   * Returns empty array if the move needs no second selection (ready to execute).
   */
  getMoveOptions(moveId: AvailableMoveId, cardId: CardInstanceId): MoveOption[] {
    const clientPlayerId = this.getClientPlayerId();
    if (!clientPlayerId) {
      return [];
    }

    const board = this.getBoard();

    switch (moveId) {
      case "quest":
      case "putCardIntoInkwell":
      case "passTurn":
      case "questWithAll":
        return [];

      case "playCard": {
        const typedClientPlayerId = asPlayerIdOptional(clientPlayerId);
        if (!typedClientPlayerId) {
          return [];
        }

        const selectionContext = this.getPlayCardTargetSelectionContext(
          cardId,
          typedClientPlayerId,
        );
        if (!selectionContext) {
          return [];
        }

        return selectionContext.cardCandidateIds.map((targetCardId) => ({
          kind: "card" as const,
          cardId: targetCardId,
        }));
      }

      case "challenge": {
        return this.getCachedChallengeMoveOptions(clientPlayerId, cardId);
      }

      case "moveCharacterToLocation": {
        const options: MoveOption[] = [];
        const playerBoard = board.players[clientPlayerId];
        if (!playerBoard) return [];
        for (const locationId of playerBoard.play) {
          const id = locationId as CardInstanceId;
          const definition = this.getCardDefinitionByInstanceId(id);
          if (definition.cardType !== "location") continue;
          if (
            this.validateMove("moveCharacterToLocation", {
              args: { characterId: cardId, locationId: id },
            }).valid
          ) {
            options.push({ kind: "card", cardId: id });
          }
        }
        return options;
      }

      case "activateAbility": {
        const options: MoveOption[] = [];
        const definition = this.getCardDefinitionByInstanceId(cardId);
        const printedAbilities = (definition.abilities ?? []).filter(
          (a: { type: string }) => a.type === "activated",
        );
        const moveOptionsRegistry = buildRegistryFromMatchState(
          this.getAuthoritativeState(),
          (id) => this.getCardDefinitionByInstanceId(id),
        );
        const grantedAbilities = getGrantedActivatedAbilities({
          state: toStaticAbilityState(this.getAuthoritativeState()),
          cardId,
          getDefinitionByInstanceId: (instanceId) => this.getCardDefinitionByInstanceId(instanceId),
          registry: moveOptionsRegistry,
        }).map((entry) => entry.ability);
        const allAbilities = [...printedAbilities, ...grantedAbilities];

        for (let abilityIndex = 0; abilityIndex < allAbilities.length; abilityIndex++) {
          const validation = this.validateMove("activateAbility", {
            args: { cardId, abilityIndex },
          });
          if (isDiscoverableActivateAbilityValidation(validation)) {
            const ability = allAbilities[abilityIndex];
            const label = ability.name || ability.text || `Ability ${abilityIndex + 1}`;
            const selectableCosts = this.getSelectableCostsForActivatedAbility(
              clientPlayerId,
              cardId,
              ability,
            );
            if (!this.hasSufficientSelectableCosts(selectableCosts)) {
              continue;
            }
            options.push({
              kind: "ability",
              abilityIndex,
              abilityLabel: label,
              ...(selectableCosts.length > 0 ? { selectableCosts } : {}),
            });
          }
        }
        return options;
      }

      case "singCard": {
        const songPlayOptions = this.getSongPlayOptions(cardId, clientPlayerId);
        return [
          ...songPlayOptions.singleSingerIds.map((singerId) => ({
            kind: "card" as const,
            cardId: singerId,
          })),
          ...(songPlayOptions.singTogetherOption ? [songPlayOptions.singTogetherOption] : []),
        ];
      }

      case "shiftCard": {
        const options: MoveOption[] = [];
        const definition = this.getCardDefinitionByInstanceId(cardId);
        const shiftRules = getShiftRules(definition as LorcanaCard);
        if (!shiftRules) return [];
        const selectableCosts = this.getSelectableCostsForShift(
          clientPlayerId,
          definition as LorcanaCard,
        );
        if (!this.hasSufficientSelectableCosts(selectableCosts)) {
          return [];
        }

        const playerBoard = board.players[clientPlayerId];
        if (!playerBoard) return [];

        const playCandidates = playerBoard.play.map((id) => id as CardInstanceId);
        const validTargets = resolveShiftTargetCandidates(
          shiftRules,
          playCandidates,
          (id) => this.getCardDefinitionByInstanceId(id) as LorcanaCard,
        );

        for (const targetId of validTargets) {
          // Validate the full shift move
          if (this.canDiscoverShiftPlay(cardId, targetId)) {
            options.push({
              kind: "card",
              cardId: targetId,
              ...(selectableCosts.length > 0 ? { selectableCosts } : {}),
            });
          }
        }
        return options;
      }

      default:
        return [];
    }
  }

  /**
   * Layer 3: Returns valid target card IDs for a pending bag effect resolution.
   */
  getEffectTargetInfo(bagId: string): EffectTargetInfo | null {
    const clientPlayerId = this.getClientPlayerId();
    if (!clientPlayerId) {
      return null;
    }

    const bagEffect = this.getBagEffects().find((b) => b.id === bagId);
    if (!bagEffect) {
      return null;
    }

    const validationContext = buildValidationContext({
      state: this.getState() as LorcanaMatchState,
      playerId: String(clientPlayerId),
      input: { args: {} } as LorcanaRuntimeMoveInputs["passTurn"],
      config: lorcanaRuntimeConfig as unknown as MatchRuntimeConfig,
      staticResources: this.getResolvedStaticResources(),
      gameEnded: !!this.getState().ctx.status.gameEnded,
      validationMode: "preflight",
    });

    const analysis = analyzeEffectTargets(
      bagEffect.payload as Effect,
      clientPlayerId as PlayerId,
      validationContext as unknown as Parameters<typeof analyzeEffectTargets>[2],
      bagEffect.sourceId as CardInstanceId | undefined,
    );

    return {
      cardCandidates: analysis.cardCandidates,
      minSelections: analysis.minSelections,
      maxSelections: analysis.maxSelections,
    };
  }

  /**
   * Per-slot effect targets for an activated ability (excluding printed `costs.*` payments).
   */
  getActivateAbilityEffectTargetLayout(
    cardId: CardInstanceId,
    abilityIndex: number,
  ): { slots: ActivateAbilityEffectResolutionSlot[] } | null {
    const clientPlayerId = this.getClientPlayerId();
    if (!clientPlayerId) {
      return null;
    }

    const validationContext = buildValidationContext({
      state: this.getState() as LorcanaMatchState,
      playerId: String(clientPlayerId),
      input: { args: {} } as LorcanaRuntimeMoveInputs["passTurn"],
      config: lorcanaRuntimeConfig as unknown as MatchRuntimeConfig,
      staticResources: this.getResolvedStaticResources(),
      gameEnded: !!this.getState().ctx.status.gameEnded,
      validationMode: "preflight",
    });

    const definition = this.getCardDefinitionByInstanceId(cardId);
    if (!definition) {
      return null;
    }

    const printedAbilities = (definition.abilities ?? []).filter(
      (a: { type: string }) => a.type === "activated",
    );
    const moveOptionsRegistry = buildRegistryFromMatchState(this.getAuthoritativeState(), (id) =>
      this.getCardDefinitionByInstanceId(id),
    );
    const grantedAbilities = getGrantedActivatedAbilities({
      state: toStaticAbilityState(this.getAuthoritativeState()),
      cardId,
      getDefinitionByInstanceId: (instanceId) => this.getCardDefinitionByInstanceId(instanceId),
      registry: moveOptionsRegistry,
    }).map((entry) => entry.ability);
    const allAbilities = [...printedAbilities, ...grantedAbilities];
    const ability = allAbilities[abilityIndex];
    if (!ability || ability.type !== "activated") {
      return null;
    }

    const slots = analyzeActivateAbilityEffectResolutionSlots(
      ability.effect,
      clientPlayerId as PlayerId,
      validationContext as unknown as Parameters<
        typeof analyzeActivateAbilityEffectResolutionSlots
      >[2],
      cardId,
    );

    return { slots };
  }

  /**
   * Helper: finds characters in play that can sing a given song card.
   */
  private getAvailableSingersForSong(
    songCardId: CardInstanceId,
    playerId: string,
  ): CardInstanceId[] {
    return this.getSongPlayOptions(songCardId, playerId).singleSingerIds;
  }

  private getSongPlayOptions(songCardId: CardInstanceId, playerId: string): SongPlayOptions {
    const playerBoard = this.getBoard().players[playerId];
    if (!playerBoard) {
      return { singleSingerIds: [], singTogetherOption: null };
    }

    const songDefinition = this.getCardDefinitionByInstanceId(songCardId) as
      | LorcanaCard
      | undefined;
    if (!isSongCard(songDefinition)) {
      return { singleSingerIds: [], singTogetherOption: null };
    }

    const singTogetherThreshold = getSingTogetherThreshold(songDefinition);
    const staticAbilityState = toStaticAbilityState(this.getAuthoritativeState());
    const songPlayRegistry = buildRegistryFromMatchState(this.getAuthoritativeState(), (id) =>
      this.getCardDefinitionByInstanceId(id),
    );
    const singleSingerIds: CardInstanceId[] = [];
    const singTogetherSingers: MoveOptionSingTogether["singers"] = [];

    for (const candidateId of playerBoard.play) {
      const id = candidateId as CardInstanceId;
      const candidateDefinition = this.getCardDefinitionByInstanceId(id) as LorcanaCard | undefined;
      if (candidateDefinition?.cardType !== "character") {
        continue;
      }

      if (
        this.canPlayCard(songCardId, {
          cost: { cost: "sing", singer: id },
        })
      ) {
        singleSingerIds.push(id);
      }

      if (singTogetherThreshold == null) {
        continue;
      }

      if (this.isExerted(id) || this.isDrying(id)) {
        continue;
      }

      if (
        hasStaticCardRestriction({
          state: staticAbilityState,
          cardId: id,
          restriction: "cant-sing",
          registry: songPlayRegistry,
        }) ||
        this.hasTemporaryRestriction(id, "cant-sing")
      ) {
        continue;
      }

      const singerValue = getSingerThresholdForInstance({
        framework: {
          state: this.getAuthoritativeState(),
        } as Parameters<typeof getSingerThresholdForInstance>[0]["framework"],
        singerId: id,
        singerDef: candidateDefinition,
        getDefinitionByInstanceId: (cardInstanceId) =>
          this.getCardDefinitionByInstanceId(cardInstanceId) as LorcanaCard | undefined,
        G: this.getState().G,
      });
      if (singerValue == null) {
        continue;
      }

      singTogetherSingers.push({
        cardId: id,
        value: singerValue,
      });
    }

    const singTogetherTotal = singTogetherSingers.reduce(
      (total, singer) => total + singer.value,
      0,
    );

    return {
      singleSingerIds,
      singTogetherOption:
        singTogetherThreshold != null && singTogetherTotal >= singTogetherThreshold
          ? {
              kind: "singTogether",
              requiredTotal: singTogetherThreshold,
              singers: singTogetherSingers,
            }
          : null,
    };
  }
}
