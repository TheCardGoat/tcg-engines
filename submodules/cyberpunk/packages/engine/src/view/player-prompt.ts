import type {
  MatchState,
  PendingChoice,
  PendingChoiceType,
  ChooseTargetSubType,
} from "../types/match-state.ts";
import type { PlayerId } from "../types/branded.ts";
import { MOVE_IDS, type MoveId } from "../moves/index.ts";
import type {
  CardColor,
  CardClassification,
  CardType,
  Effect,
  ScryDestination,
  ScryDestinationZone,
} from "@tcg/cyberpunk-types";
import { enumerateMoves } from "../command/processor.ts";
import { getEffectiveRules, isReadyFieldBlocker } from "../active-effects/index.ts";
import { getMustAttackCardIds, hasPlayedProgramThisTurn } from "../moves/attack-requirements.ts";
import { getOpponentId } from "../state/initial-state.ts";
import { defOf } from "../state/lookups.ts";
import { projectRevealedCardView, type FilteredCardView } from "./filter.ts";
import { DIE_MAX_VALUES } from "../types/gig-die.ts";
import { isReactStep } from "../moves/is-react-step.ts";
import { canActivateAbility, canHostActivatedAbility } from "../moves/activate-ability.ts";
import { computeEffectiveCost } from "../moves/compute-effective-cost.ts";
import { availableEddies } from "../moves/eddie-resources.ts";

const KNOWN_MOVE_IDS: ReadonlySet<MoveId> = new Set(MOVE_IDS);

/**
 * Filter raw enumerated move ids down to known {@link MoveId}s. The command
 * registry is keyed by `string`, so a third-party module could in principle
 * register additional moves; ignoring unknown ids here keeps the prompt API
 * type-safe and prevents `toAvailableMove`'s exhaustive switch from returning
 * `undefined` at runtime.
 */
function knownMoveIds(state: MatchState, playerId: PlayerId): MoveId[] {
  const ids: MoveId[] = [];
  for (const id of enumerateMoves(state, playerId)) {
    if (KNOWN_MOVE_IDS.has(id as MoveId)) ids.push(id as MoveId);
  }
  return ids;
}

// ── Types ──────────────────────────────────────────────────────────────

export type PlayerPromptStatus = "idle" | "action" | "choice" | "waiting";

export interface PlayerPrompt {
  status: PlayerPromptStatus;
  availableMoves: AvailableMove[];
  choice: ChoicePrompt | null;
}

export interface AvailableMove {
  moveId: MoveId;
  inputSpec: MoveInputSpec;
}

export interface AbilityCandidate {
  cardId: string;
  abilityIndex: number;
  effectHints: string[];
  eddieCost: number;
  spendsCard: boolean;
}

/**
 * A `playCard` candidate. `attachTargets` is omitted for cards that don't need
 * an attach target (units, programs) and populated with valid friendly targets
 * for gear. An empty array means "this gear has no legal target right now" and
 * the candidate is unplayable.
 */
export interface PlayCardCandidate {
  cardId: string;
  attachTargets?: string[];
}

export type MoveInputSpec =
  | { type: "none" }
  | { type: "selectCard"; candidates: string[] }
  | { type: "selectPair"; fromCandidates: string[]; toCandidates: string[] }
  | { type: "selectAbility"; candidates: AbilityCandidate[] }
  | { type: "playCard"; candidates: PlayCardCandidate[] };

/**
 * Player-safe projection of a {@link PendingChoice}. Discriminated by `type`
 * so consumers (UI, AI harness) can use exhaustive switches.
 */
export type ChoicePrompt =
  | ScryChoicePrompt
  | RevealDestinationChoicePrompt
  | ChooseTargetChoicePrompt
  | ChooseEffectChoicePrompt
  | ChooseTriggerChoicePrompt
  | ChooseGigsToStealChoicePrompt
  | ChooseCardToPlayChoicePrompt
  | ChooseCardToMoveChoicePrompt
  | ChooseCardTypeChoicePrompt
  | GainGigChoicePrompt;

/**
 * Subset of {@link import("@tcg/cyberpunk-types").CardTargetDSL} surfaced for
 * scry resolution. Includes every numeric / categorical field a
 * revealed deck card can be filtered on. The resolver enforces all of these;
 * the engine's `resolveScry.validate` enforces the subset it can verify
 * against the card definition. If either side grows, the other should follow
 * — see the cross-reference in `automation/resolvers/search-deck.ts`.
 */
export interface ScryTargetFilter {
  cardTypes?: CardType[];
  classifications?: CardClassification[];
  minCost?: number;
  maxCost?: number;
  minPower?: number;
  maxPower?: number;
}

export interface ScryDestinationPrompt {
  zone: ScryDestinationZone;
  min?: number;
  max?: number;
  reveal?: boolean;
  remainder?: boolean;
  order?: ScryDestination["order"];
  target: ScryTargetFilter | null;
}

export interface ScryChoicePrompt {
  type: "scry";
  chooserId: string;
  payload: {
    player: string;
    amount: number;
    destinations: ScryDestinationPrompt[];
    revealedCardIds: string[];
    /**
     * Player-safe projections of the revealed cards. Lets resolvers evaluate
     * `target` filters without crossing the boundary into raw card definitions.
     */
    revealedCards: FilteredCardView[];
    source?: EffectSourcePrompt;
  };
}

export interface RevealDestinationChoicePrompt {
  type: "revealDestination";
  chooserId: string;
  payload: {
    player: string;
    destinations: ["hand", "trash"];
    revealedCardIds: string[];
    revealedCards: FilteredCardView[];
    source?: EffectSourcePrompt;
    drawIfDestination?: {
      destination: "hand" | "trash";
      player: string;
      amount: number;
    };
  };
}

export interface ChooseTargetChoicePrompt {
  type: "chooseTarget";
  chooserId: string;
  payload: {
    type: ChooseTargetSubType;
    amount?: number;
    player?: string;
    dieId?: string;
    direction?: string;
    maxAmount?: number;
    chooseUpTo?: boolean;
    /** Current face value of the targeted die (only set for `adjustGig`). */
    currentValue?: number;
    /** Maximum face value of the targeted die (only set for `adjustGig`). */
    maxFaceValue?: number;
    /** Owner of the targeted die (only set for `adjustGig`). */
    dieOwnerId?: string;
    targetKind?: "card" | "gig";
    eligibleIds?: string[];
    adjustGig?: {
      direction?: string;
      maxAmount?: number;
      chooseUpTo?: boolean;
    };
    min?: number;
    max?: number;
    canDecline?: boolean;
    effect?: Effect;
    cards?: FilteredCardView[];
    source?: EffectSourcePrompt;
    targetPurpose?: "attachHost" | "playCard";
    availableEddiesAfterCosts?: number;
    effectiveCostsByCardId?: Record<string, number>;
  };
}

export interface EffectSourcePrompt {
  cardId: string;
  definitionId: string;
  displayName: string;
  rulesText?: string | null;
  cardType: CardType;
  /** Printed color, surfaced so AI choices can follow the source color's game plan. */
  color: CardColor;
}

/**
 * Player-safe projection of one `chooseEffect` option. Mirrors
 * {@link import("../types/match-state.ts").ChooseEffectOption} except `id`
 * is the only field a real player needs to commit a choice — `label` and
 * `effects` are surfaced for UI/AI heuristics that want to score options.
 *
 * CONTRACT(chooseEffect): see the engine type for the wider contract.
 */
export interface ChooseEffectPromptOption {
  id: string;
  label: string;
  effects: Effect[];
}

export interface ChooseEffectChoicePrompt {
  type: "chooseEffect";
  chooserId: string;
  payload: { options: ChooseEffectPromptOption[] };
}

export interface ChooseCardTypeChoicePrompt {
  type: "chooseCardType";
  chooserId: string;
  payload: {
    cardTypes: CardType[];
    source?: EffectSourcePrompt;
  };
}

export interface ChooseTriggerPromptOption {
  triggerId: string;
  sourceCardId: string;
  sourcePlayerId: string;
  abilityIndex: number;
  abilityText: string;
  cardName: string;
  optional?: boolean;
}

export interface ChooseTriggerChoicePrompt {
  type: "chooseTrigger";
  chooserId: string;
  payload: { options: ChooseTriggerPromptOption[]; canPass?: boolean };
}

export interface EligibleGigDie {
  dieId: string;
  faceValue: number;
}

export interface ChooseGigsToStealChoicePrompt {
  type: "chooseGigsToSteal";
  chooserId: string;
  payload: {
    count: number;
    attackerId: string;
    rivalId: string;
    /** Snapshot of every die the attacker may pick from, with face values. */
    eligibleDice: EligibleGigDie[];
  };
}

export interface ChooseCardToPlayChoicePrompt {
  type: "chooseCardToPlay";
  chooserId: string;
  payload: {
    cardIds: string[];
    /** Player-safe projection of each candidate so resolvers can rank them. */
    cards: FilteredCardView[];
    free?: boolean;
    attachTo?: unknown;
    resolvedAttachToId?: string;
  };
}

export interface ChooseCardToMoveChoicePrompt {
  type: "chooseCardToMove";
  chooserId: string;
  payload: {
    cardIds: string[];
    /** Player-safe projection of each candidate so resolvers can rank them. */
    cards: FilteredCardView[];
    /** The destination zone the card will move to (e.g. `field`, `trash`). */
    destination?: string;
    resolvedAttachToId?: string;
    source?: EffectSourcePrompt;
    canDecline?: boolean;
  };
}

/**
 * START PHASE — step 3 ("GAIN A GIG"). The chooser picks one die from
 * `allowedDieIds` (their fixer area, excluding d20 unless it's the only one
 * left).
 */
export interface GainGigChoicePrompt {
  type: "gainGig";
  chooserId: string;
  payload: { allowedDieIds: string[] };
}

/**
 * Compile-time guarantee: every {@link PendingChoiceType} has a matching
 * {@link ChoicePrompt} variant. If a new pending-choice variant is added to
 * the engine without a matching projection here, this assignment fails to
 * type-check.
 */
type _AssertChoicePromptCoversPendingChoice = ChoicePrompt["type"] extends PendingChoiceType
  ? PendingChoiceType extends ChoicePrompt["type"]
    ? true
    : never
  : never;
const _choicePromptCovers: _AssertChoicePromptCoversPendingChoice = true;
void _choicePromptCovers;

// ── Build prompt ───────────────────────────────────────────────────────

/** Moves that are always available regardless of game state (not phase-gated). */
const ALWAYS_AVAILABLE_MOVES = new Set(["concede"]);

/**
 * Compute what the engine wants from a specific player right now.
 *
 * **Note:** This function depends on the global move registry populated by
 * `registerMoves()`. It must be called after moves have been registered
 * (e.g. after constructing a `LocalEngine`).
 */
export function buildPlayerPrompt(state: MatchState, playerId: PlayerId): PlayerPrompt {
  if (state.G.gameEnded) {
    return { status: "idle", availableMoves: [], choice: null };
  }

  const pendingChoice = state.G.turnMetadata.pendingChoice;

  // Pending choice for THIS player → status "choice"
  if (pendingChoice && (pendingChoice.chooserId as string) === (playerId as string)) {
    const moveIds = knownMoveIds(state, playerId);
    const moves = moveIds
      .map((id) => toAvailableMove(id, state, playerId))
      .filter(isMoveActionable);
    return {
      status: "choice",
      availableMoves: moves,
      choice: transformPendingChoice(pendingChoice, state),
    };
  }

  // Pending choice for opponent → this player waits, but may still have
  // pending-choice-safe moves available (e.g. concede).
  if (pendingChoice) {
    const moveIds = knownMoveIds(state, playerId);
    const moves = moveIds
      .map((id) => toAvailableMove(id, state, playerId))
      .filter(isMoveActionable);
    return { status: "waiting", availableMoves: moves, choice: null };
  }

  // No pending choice — enumerate available moves
  const moveIds = knownMoveIds(state, playerId);
  const moves = moveIds.map((id) => toAvailableMove(id, state, playerId)).filter(isMoveActionable);

  // If the only available moves are "always-available" ones (e.g. concede),
  // the player has no meaningful actions — report as waiting.
  const hasMeaningfulMoves = moves.some((m) => !ALWAYS_AVAILABLE_MOVES.has(m.moveId));

  return {
    status: hasMeaningfulMoves ? "action" : "waiting",
    availableMoves: moves,
    choice: null,
  };
}

// ── Available move with inputSpec ──────────────────────────────────────

/** Return true when a move actually has non-empty candidate lists. */
function isMoveActionable(move: AvailableMove): boolean {
  switch (move.inputSpec.type) {
    case "none":
      return true;
    case "selectCard":
      return move.inputSpec.candidates.length > 0;
    case "selectPair":
      return move.inputSpec.fromCandidates.length > 0 && move.inputSpec.toCandidates.length > 0;
    case "selectAbility":
      return move.inputSpec.candidates.length > 0;
    case "playCard":
      return move.inputSpec.candidates.some(
        (c) => c.attachTargets === undefined || c.attachTargets.length > 0,
      );
  }
}

function toAvailableMove(moveId: MoveId, state: MatchState, playerId: PlayerId): AvailableMove {
  switch (moveId) {
    case "playCard":
      return {
        moveId,
        inputSpec: { type: "playCard", candidates: getPlayCardCandidates(state, playerId) },
      };
    case "sellCard":
      return {
        moveId,
        inputSpec: { type: "selectCard", candidates: getSellableCards(state, playerId) },
      };
    case "callLegend":
      return {
        moveId,
        inputSpec: { type: "selectCard", candidates: getCallableLegends(state, playerId) },
      };
    case "attackUnit":
      return {
        moveId,
        inputSpec: {
          type: "selectPair",
          fromCandidates: getReadyAttackers(state, playerId),
          toCandidates: getSpentDefenders(state, playerId),
        },
      };
    case "attackRival":
      return {
        moveId,
        inputSpec: {
          type: "selectCard",
          candidates: getReadyAttackers(state, playerId, { excludeUnitOnlyAttackers: true }),
        },
      };
    case "useBlocker":
      return {
        moveId,
        inputSpec: { type: "selectCard", candidates: getReadyBlockers(state, playerId) },
      };
    case "goSolo":
      return {
        moveId,
        inputSpec: { type: "selectCard", candidates: getGoSoloLegends(state, playerId) },
      };
    case "resolveCardToPlay":
      return {
        moveId,
        inputSpec: { type: "selectCard", candidates: getChoiceCardCandidates(state) },
      };
    case "activateAbility":
      return {
        moveId,
        inputSpec: { type: "selectAbility", candidates: getActivatableAbilities(state, playerId) },
      };
    case "passPhase":
    case "concede":
    case "mulligan":
    case "keepHand":
    case "gainGig":
    case "resolveAttack":
    case "resolveCardToMove":
    case "resolveScry":
    case "resolveRevealDestination":
    case "resolveDiscardFromHand":
    case "resolveAdjustGig":
    case "resolveStealGigs":
    case "resolveTrigger":
    case "resolveEffectTarget":
    case "resolveCardTypeChoice":
      return { moveId, inputSpec: { type: "none" } };
  }
}

// ── Candidate helpers ──────────────────────────────────────────────────

function getPlayCardCandidates(state: MatchState, playerId: PlayerId): PlayCardCandidate[] {
  const player = state.G.players[playerId as string];
  if (!player) return [];
  const candidates: PlayCardCandidate[] = [];
  const isDefending = isReactStep(state, playerId);
  for (const id of player.zones.hand) {
    const card = state.G.cardIndex[id as string];
    if (!card) continue;
    const def = defOf(card);
    const cost = computeEffectiveCost(state, id, playerId);
    if (cost > availableEddies(state, playerId)) continue;

    // During react step, only QUICK cards can be played as reactions.
    if (isDefending && !def.keywords.includes("quick")) continue;

    if (def.type === "gear") {
      const attachTargets = getGearAttachTargets(state, playerId);
      // Skip gear with no legal targets — keeping it in the candidate list
      // would let strategies try to play it and produce illegal commands.
      if (attachTargets.length === 0) continue;
      candidates.push({ cardId: id as string, attachTargets });
    } else {
      candidates.push({ cardId: id as string });
    }
  }
  return candidates;
}

/**
 * Friendly field units and face-up legends that gear can attach to. Card-specific
 * attachment filters are intentionally broad here; move validation remains the
 * authority for actual play legality.
 */
function getGearAttachTargets(state: MatchState, playerId: PlayerId): string[] {
  const player = state.G.players[playerId as string];
  if (!player) return [];
  const out: string[] = [];
  for (const id of player.zones.field) {
    const card = state.G.cardIndex[id as string];
    if (
      card &&
      (defOf(card).type === "unit" || (defOf(card).type === "legend" && !card.meta.faceDown))
    )
      out.push(id as string);
  }
  for (const id of player.zones.legendArea) {
    const card = state.G.cardIndex[id as string];
    if (card && defOf(card).type === "legend" && !card.meta.faceDown) out.push(id as string);
  }
  return out;
}

function getSellableCards(state: MatchState, playerId: PlayerId): string[] {
  const player = state.G.players[playerId as string];
  if (!player) return [];
  return player.zones.hand
    .filter((id) => {
      const card = state.G.cardIndex[id as string];
      return card && defOf(card).hasSellTag;
    })
    .map((id) => id as string);
}

function getCallableLegends(state: MatchState, playerId: PlayerId): string[] {
  const player = state.G.players[playerId as string];
  if (!player) return [];
  return player.zones.legendArea
    .filter((id) => {
      const card = state.G.cardIndex[id as string];
      return card && card.meta.faceDown;
    })
    .map((id) => id as string);
}

function getReadyAttackers(
  state: MatchState,
  playerId: PlayerId,
  opts?: { excludeUnitOnlyAttackers?: boolean },
): string[] {
  const player = state.G.players[playerId as string];
  if (!player) return [];
  const attackers = player.zones.field
    .filter((id) => {
      const card = state.G.cardIndex[id as string];
      if (!card || card.meta.spent) return false;
      const rules = getEffectiveRules(state, id as string);
      if (rules.includes("cantAttack")) return false;
      if (
        rules.includes("requiresProgramPlayedThisTurn") &&
        !hasPlayedProgramThisTurn(state, playerId)
      ) {
        return false;
      }
      if (card.meta.hasLag) {
        if (rules.includes("adrenaline")) {
          // Adrenaline units can attack both units and the rival on the played turn
          return true;
        }
        if (rules.includes("canAttackRivalOnPlayedTurn") && opts?.excludeUnitOnlyAttackers) {
          // These units can attack the rival directly even if another effect also lets them attack units
          return true;
        }
        if (rules.includes("canAttackOnPlayedTurnAgainstUnits")) {
          // These units can only attack other units, not the rival directly
          return !opts?.excludeUnitOnlyAttackers;
        }
        if (rules.includes("canAttackRivalOnPlayedTurn")) {
          // These units can only attack the rival directly, not other units
          return opts?.excludeUnitOnlyAttackers === true;
        }
        return false;
      }
      const def = defOf(card);
      return def.type === "unit" || def.keywords.includes("goSolo");
    })
    .map((id) => id as string);
  const mustAttackIds = new Set(getMustAttackCardIds(state, playerId).map((id) => id as string));
  if (mustAttackIds.size === 0) return attackers;
  return attackers.filter((id) => mustAttackIds.has(id));
}

function getSpentDefenders(state: MatchState, playerId: PlayerId): string[] {
  const opponentId = getOpponentId(state, playerId);
  const opponent = state.G.players[opponentId as string];
  if (!opponent) return [];
  return opponent.zones.field
    .filter((id) => {
      const card = state.G.cardIndex[id as string];
      return card && card.meta.spent;
    })
    .map((id) => id as string);
}

function getReadyBlockers(state: MatchState, playerId: PlayerId): string[] {
  const player = state.G.players[playerId as string];
  if (!player) return [];
  return player.zones.field
    .filter((id) => isReadyFieldBlocker(state, id as string))
    .map((id) => id as string);
}

function getGoSoloLegends(state: MatchState, playerId: PlayerId): string[] {
  if (state.G.gamePhase !== "main") return [];
  if ((state.G.turnMetadata.activePlayerId as string) !== (playerId as string)) return [];

  const player = state.G.players[playerId as string];
  if (!player) return [];
  return player.zones.legendArea
    .filter((id) => {
      const card = state.G.cardIndex[id as string];
      if (!card || card.meta.faceDown) return false;
      const def = defOf(card);
      return def.keywords.includes("goSolo") && availableEddies(state, playerId) >= (def.cost ?? 0);
    })
    .map((id) => id as string);
}

function getChoiceCardCandidates(state: MatchState): string[] {
  const choice = state.G.turnMetadata.pendingChoice;
  if (!choice || choice.type !== "chooseCardToPlay") return [];
  return choice.payload.cardIds.map((id) => id as string);
}

/**
 * Enumerate every (cardId, abilityIndex) pair the player can currently
 * activate. Mirrors `activateAbility.available` exactly — including the
 * full cost check via the engine's shared `canPayCosts` helper — so the
 * prompt never advertises an ability that the engine would then reject.
 */
function getActivatableAbilities(state: MatchState, playerId: PlayerId): AbilityCandidate[] {
  if (state.G.gamePhase !== "main") return [];

  const isDefending = isReactStep(state, playerId);
  if (state.G.attackState && !isDefending) return [];
  if (!isDefending && (state.G.turnMetadata.activePlayerId as string) !== (playerId as string))
    return [];

  const player = state.G.players[playerId as string];
  if (!player) return [];

  const out: AbilityCandidate[] = [];
  for (const zone of ["field", "legendArea"] as const) {
    for (const cardId of player.zones[zone]) {
      const card = state.G.cardIndex[cardId as string];
      if (!card) continue;
      const def = defOf(card);
      if (!canHostActivatedAbility(card, def, zone)) continue;

      const abilities = (def as import("@tcg/cyberpunk-types").StructuredCardDefinition).abilities;
      if (!abilities) continue;
      for (let i = 0; i < abilities.length; i++) {
        const ability = abilities[i]!;
        if (ability.trigger?.trigger !== "activated") continue;
        if (state.G.attackState && isDefending) {
          const isQuick = ability.keyword === "quick" || def.keywords.includes("quick");
          if (!isQuick) continue;
        }
        if (!canActivateAbility(ability, state, cardId, playerId)) continue;
        out.push({
          cardId: cardId as string,
          abilityIndex: i,
          effectHints: ability.effects.map((effect) => effect.effect),
          eddieCost: (ability.costs ?? []).reduce((total, cost) => {
            if (cost.cost === "payEddies") return total + cost.amount;
            if (cost.cost === "payCardCost") return total + (def.cost ?? 0);
            return total;
          }, 0),
          spendsCard: (ability.costs ?? []).some((cost) => cost.cost === "spend"),
        });
      }
    }
  }
  return out;
}

// ── Transform pending choice ───────────────────────────────────────────

function transformPendingChoice(choice: PendingChoice, state: MatchState): ChoicePrompt {
  const chooserId = choice.chooserId as string;
  switch (choice.type) {
    case "chooseCardToPlay": {
      const cardIds = choice.payload.cardIds.map((id) => id as string);
      return {
        type: "chooseCardToPlay",
        chooserId,
        payload: {
          cardIds,
          cards: cardIds
            .map((id) => projectRevealedCardView(state, id))
            .filter((c): c is FilteredCardView => c !== null),
          free: choice.payload.free,
          attachTo: choice.payload.attachTo,
          resolvedAttachToId: choice.payload.resolvedAttachToId ?? undefined,
        },
      };
    }
    case "chooseTarget": {
      const dieId = choice.payload.dieId ? (choice.payload.dieId as string) : undefined;
      const die = dieId ? state.G.gigDice[dieId] : undefined;
      const source = projectEffectSource(state, choice.payload.sourceCardId as string | undefined);
      const discardEligibleIds =
        choice.payload.type === "discardFromHand"
          ? (state.G.players[choice.chooserId as string]?.zones.hand ?? []).map(
              (id) => id as string,
            )
          : undefined;
      const eligibleIds = choice.payload.eligibleIds ?? discardEligibleIds;
      return {
        type: "chooseTarget",
        chooserId,
        payload: {
          type: choice.payload.type,
          amount: choice.payload.amount,
          player: choice.payload.player,
          dieId,
          direction: choice.payload.direction,
          maxAmount: choice.payload.maxAmount,
          chooseUpTo: choice.payload.chooseUpTo,
          currentValue: die?.faceValue,
          maxFaceValue: die ? DIE_MAX_VALUES[die.dieType] : undefined,
          dieOwnerId: die ? (die.ownerId as string) : undefined,
          targetKind: choice.payload.targetKind ?? (discardEligibleIds ? "card" : undefined),
          eligibleIds,
          adjustGig: choice.payload.adjustGig,
          min: choice.payload.min,
          max: choice.payload.max,
          canDecline: choice.payload.canDecline,
          effect: choice.payload.effect,
          cards: (eligibleIds ?? [])
            .map((id) => projectRevealedCardView(state, id))
            .filter((c): c is FilteredCardView => c !== null),
          source,
          targetPurpose: choice.payload.targetPurpose,
          availableEddiesAfterCosts: choice.payload.availableEddiesAfterCosts,
          effectiveCostsByCardId: choice.payload.effectiveCostsByCardId,
        },
      };
    }
    case "chooseEffect":
      // CONTRACT(chooseEffect): payload is `ChooseEffectOption[]` — passed
      // through unchanged because each option already carries the player-
      // visible fields (id, label, effects). No filtering needed.
      return {
        type: "chooseEffect",
        chooserId,
        payload: { options: choice.payload.options as ChooseEffectPromptOption[] },
      };
    case "chooseTrigger":
      return {
        type: "chooseTrigger",
        chooserId,
        payload: {
          canPass: choice.payload.canPass,
          options: choice.payload.options.map((option) => ({
            triggerId: option.triggerId,
            sourceCardId: option.sourceCardId as string,
            sourcePlayerId: option.sourcePlayerId as string,
            abilityIndex: option.abilityIndex,
            abilityText: option.abilityText,
            cardName: option.cardName,
            optional: option.optional,
          })),
        },
      };
    case "chooseGigsToSteal":
      return {
        type: "chooseGigsToSteal",
        chooserId,
        payload: {
          count: choice.payload.count,
          attackerId: choice.payload.attackerId as string,
          rivalId: choice.payload.rivalId as string,
          eligibleDice: choice.payload.eligibleDieIds
            .map((id) => {
              const die = state.G.gigDice[id as string];
              return die ? { dieId: id as string, faceValue: die.faceValue } : null;
            })
            .filter((d): d is EligibleGigDie => d !== null),
        },
      };
    case "scry": {
      const revealedIds = choice.payload.revealedCardIds.map((id) => id as string);
      return {
        type: "scry",
        chooserId,
        payload: {
          player: choice.payload.player,
          amount: choice.payload.amount,
          destinations: choice.payload.destinations.map((destination) => ({
            zone: destination.zone,
            min: destination.min,
            max: destination.max,
            reveal: destination.reveal,
            remainder: destination.remainder,
            order: destination.order,
            target: projectScryTarget(destination.target),
          })),
          revealedCardIds: revealedIds,
          revealedCards: revealedIds
            .map((id) => projectRevealedCardView(state, id))
            .filter((c): c is FilteredCardView => c !== null),
          source: projectEffectSource(state, choice.payload.sourceCardId as string | undefined),
        },
      };
    }
    case "revealDestination": {
      const revealedIds = choice.payload.revealedCardIds.map((id) => id as string);
      return {
        type: "revealDestination",
        chooserId,
        payload: {
          player: choice.payload.player as string,
          destinations: choice.payload.destinations,
          revealedCardIds: revealedIds,
          revealedCards: revealedIds
            .map((id) => projectRevealedCardView(state, id))
            .filter((c): c is FilteredCardView => c !== null),
          source: projectEffectSource(state, choice.payload.sourceCardId as string | undefined),
          drawIfDestination: choice.payload.drawIfDestination
            ? {
                destination: choice.payload.drawIfDestination.destination,
                player: choice.payload.drawIfDestination.player as string,
                amount: choice.payload.drawIfDestination.amount,
              }
            : undefined,
        },
      };
    }
    case "chooseCardToMove": {
      const cardIds = choice.payload.cardIds.map((id) => id as string);
      return {
        type: "chooseCardToMove",
        chooserId,
        payload: {
          cardIds,
          cards: cardIds
            .map((id) => projectRevealedCardView(state, id))
            .filter((c): c is FilteredCardView => c !== null),
          destination: choice.payload.destination,
          source: projectEffectSource(state, choice.payload.sourceCardId as string | undefined),
          resolvedAttachToId: choice.payload.resolvedAttachToId
            ? (choice.payload.resolvedAttachToId as string)
            : undefined,
          canDecline: choice.payload.canDecline,
        },
      };
    }
    case "chooseCardType":
      return {
        type: "chooseCardType",
        chooserId,
        payload: {
          cardTypes: choice.payload.cardTypes,
          source: projectEffectSource(state, choice.payload.sourceCardId as string | undefined),
        },
      };
    case "gainGig":
      return {
        type: "gainGig",
        chooserId,
        payload: {
          allowedDieIds: choice.payload.allowedDieIds.map((id) => id as string),
        },
      };
  }
}

function projectEffectSource(
  state: MatchState,
  sourceCardId: string | undefined,
): EffectSourcePrompt | undefined {
  if (!sourceCardId) return undefined;
  const card = state.G.cardIndex[sourceCardId];
  if (!card) return undefined;
  const def = defOf(card);
  return {
    cardId: sourceCardId,
    definitionId: def.id,
    displayName: def.displayName,
    rulesText: def.rulesText,
    cardType: def.type,
    color: def.color,
  };
}

/**
 * Narrow the engine's full {@link import("@tcg/cyberpunk-types").CardTargetDSL}
 * down to the {@link ScryTargetFilter} subset surfaced for resolvers.
 * Returning `null` signals "no filter" so the resolver/UI can skip filtering
 * work entirely.
 */
function projectScryTarget(raw: unknown): ScryTargetFilter | null {
  if (!raw || typeof raw !== "object") return null;
  const t = raw as {
    cardTypes?: CardType[];
    classifications?: CardClassification[];
    minCost?: number;
    maxCost?: number;
    minPower?: number;
    maxPower?: number;
  };
  const filter: ScryTargetFilter = {};
  if (Array.isArray(t.cardTypes) && t.cardTypes.length > 0) filter.cardTypes = t.cardTypes;
  if (Array.isArray(t.classifications) && t.classifications.length > 0) {
    filter.classifications = t.classifications;
  }
  if (typeof t.minCost === "number") filter.minCost = t.minCost;
  if (typeof t.maxCost === "number") filter.maxCost = t.maxCost;
  if (typeof t.minPower === "number") filter.minPower = t.minPower;
  if (typeof t.maxPower === "number") filter.maxPower = t.maxPower;
  return Object.keys(filter).length === 0 ? null : filter;
}
