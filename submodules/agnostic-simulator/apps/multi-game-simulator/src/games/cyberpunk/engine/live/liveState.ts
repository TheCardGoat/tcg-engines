import { createCardCatalog, type CardCatalog } from "@tcg/cyberpunk-cards";
import type {
  CardZone,
  LegendCardDefinition,
  StructuredCardDefinition,
  UnitCardDefinition,
} from "@tcg/cyberpunk-types";
import {
  CyberpunkTestEngine,
  createCardInstanceId,
  createEmptyPlayerState,
  createGigDieId,
  createInitialGameState,
  createMatchId,
  createPlayerId,
  getEffectivePowerFromCatalog,
  setCardRegistry,
  type AttackKind,
  type AttackState,
  type AttackStep,
  type CardInstance,
  type ChoicePrompt,
  type DieType,
  type FilteredCardView,
  type FilteredMatchView,
  type GamePhase,
  type GigDie,
  type MatchState,
  type PendingChoice,
  type PlayerId,
} from "@tcg/cyberpunk-engine";

const UNKNOWN_CARD_DEFINITION_ID = "viewer:unknown-card";
const UNKNOWN_LEGEND_DEFINITION_ID = "viewer:unknown-legend";
const CARD_BACK_IMAGE_URL = "https://cdn.tcg.online/public/cyberpunk/cards/back/card-back.webp";
const LEGEND_CARD_BACK_IMAGE_URL =
  "https://cdn.tcg.online/public/cyberpunk/cards/back/legend-card-back.webp";

/**
 * Viewer-only definitions for identities the server intentionally redacted or
 * could not resolve. These must never borrow a real card's definition: a
 * renderer leak, stale component, or future face-up projection bug should say
 * "Unknown Card", not confidently show an unrelated legal card.
 */
const UNKNOWN_CARD_DEFINITION = {
  id: UNKNOWN_CARD_DEFINITION_ID,
  canonicalId: UNKNOWN_CARD_DEFINITION_ID,
  slug: "unknown-card",
  name: "Unknown Card",
  displayName: "Unknown Card",
  rulesText: null,
  color: "yellow",
  classifications: [],
  set: { code: "welcometonightcityretail", name: "Viewer placeholder" },
  printNumber: "",
  printings: [],
  selectedPrintingId: null,
  artist: "",
  imageUrl: CARD_BACK_IMAGE_URL,
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: null,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 0,
  power: 0,
  abilities: [],
  reminderText: [],
} satisfies UnitCardDefinition;

const UNKNOWN_LEGEND_DEFINITION = {
  ...UNKNOWN_CARD_DEFINITION,
  id: UNKNOWN_LEGEND_DEFINITION_ID,
  canonicalId: UNKNOWN_LEGEND_DEFINITION_ID,
  slug: "unknown-legend",
  name: "Unknown Legend",
  displayName: "Unknown Legend",
  imageUrl: LEGEND_CARD_BACK_IMAGE_URL,
  type: "legend",
  cost: null,
  power: null,
} satisfies LegendCardDefinition;

const productionCardCatalog = createCardCatalog();
const viewerPlaceholderDefinitions = new Map<string, StructuredCardDefinition>([
  [UNKNOWN_CARD_DEFINITION_ID, UNKNOWN_CARD_DEFINITION],
  [UNKNOWN_LEGEND_DEFINITION_ID, UNKNOWN_LEGEND_DEFINITION],
]);
const liveMatchCatalog: CardCatalog = {
  get(definitionId) {
    return (
      viewerPlaceholderDefinitions.get(definitionId) ?? productionCardCatalog.get(definitionId)
    );
  },
  *entries() {
    yield* productionCardCatalog.entries();
    yield* viewerPlaceholderDefinitions.entries();
  },
  get size() {
    return productionCardCatalog.size + viewerPlaceholderDefinitions.size;
  },
};

export type CyberpunkViewerState = MatchState | FilteredMatchView;

export function createLiveMatchViewerEngine(
  state: CyberpunkViewerState,
  matchId = "live-viewer",
): CyberpunkTestEngine {
  // Server-authored Cyberpunk states store card instance definitions by the
  // stable card UUID. Register the production bundle before hydrating the
  // local viewer engine so render-time lookups resolve ids from Redis
  // snapshots instead of relying on prior practice setup.
  setCardRegistry(liveMatchCatalog);
  return CyberpunkTestEngine.fromState(
    isMatchState(state) ? state : viewerProjectionToMatchState(state, matchId),
    { autoGainGig: false },
  );
}

/**
 * Rebuild the minimum read model required by the existing Cyberpunk renderer.
 * Hidden cards are represented by inert placeholder instances, so their counts
 * remain correct without restoring any private definition or instance data.
 * Legality always comes from the server-provided interaction view.
 *
 * This bootstrap conversion is intentionally catalog-explicit and must not
 * read or initialize the engine's ambient card registry. Live context parsing,
 * gateway reduction, and replay loading all run before a viewer engine exists.
 */
export function viewerProjectionToMatchState(
  projection: FilteredMatchView,
  matchId = "live-viewer",
): MatchState {
  const G = createInitialGameState();
  const playerIds = Object.keys(projection.players).map(createPlayerId);
  const placeholderDefinitionId = hiddenCardPlaceholderDefinitionId();

  G.players = {};
  G.cardIndex = {};
  G.gigDice = {};
  const projectedCards = new Map<string, FilteredCardView>();

  for (const [playerIndex, [rawPlayerId, projectedPlayer]] of Object.entries(
    projection.players,
  ).entries()) {
    const playerId = createPlayerId(rawPlayerId);
    const player = createEmptyPlayerState(playerId, playerIndex === 0);
    player.eddies = projectedPlayer.eddies;
    player.spentEddies = Math.max(0, projectedPlayer.eddies - projectedPlayer.availableEddies);
    player.soldThisTurn = projectedPlayer.soldThisTurn;
    player.calledLegendThisTurn = projectedPlayer.calledLegendThisTurn;
    player.calledLegendThisRivalTurn = projectedPlayer.calledLegendThisRivalTurn;

    for (const zone of CARD_ZONES) {
      const projectedZone = projectedPlayer.zones[zone];
      const cards = Array.isArray(projectedZone)
        ? projectedZone
        : hiddenCards(rawPlayerId, zone, projectedZone ?? 0, placeholderDefinitionId);
      for (const card of cards) {
        const instance = cardInstanceFromProjection(card, playerId, placeholderDefinitionId);
        G.cardIndex[String(instance.instanceId)] = instance;
        projectedCards.set(String(instance.instanceId), card);
        player.zones[zone].push(instance.instanceId);
      }
    }

    player.eddieCardIds = [...player.zones.eddieArea];
    player.gigArea = diceFromProjection(
      projectedPlayer.zones.gigArea,
      playerId,
      "gigArea",
      G.gigDice,
    );
    player.fixerArea = diceFromProjection(
      projectedPlayer.zones.fixerArea,
      playerId,
      "fixerArea",
      G.gigDice,
    );
    G.players[rawPlayerId] = player;
  }

  G.gamePhase = gamePhase(projection.gamePhase);
  G.turnMetadata.turnNumber = projection.turnNumber;
  G.turnMetadata.activePlayerId = createPlayerId(projection.activePlayerId);
  G.turnMetadata.playedCardTypesThisTurn = Object.fromEntries(
    Object.entries(projection.playedCardTypesThisTurn).map(([playerId, types]) => [
      playerId,
      [...types],
    ]),
  );
  G.attackState = attackStateFromProjection(projection, G.players);
  G.gameEnded = projection.gameEnded;
  G.winnerId = projection.winnerId ? createPlayerId(projection.winnerId) : null;
  G.winReason = projection.winReason;

  registerPromptRevealedCards(projection, G, placeholderDefinitionId);
  for (const card of revealedCardsFromPrompt(projection.prompt.choice)) {
    projectedCards.set(String(card.instanceId), card);
  }

  const promptChoice = projection.prompt.choice;
  G.turnMetadata.pendingChoice = promptChoice
    ? pendingChoiceFromPromptChoice(promptChoice)
    : undefined;

  const state: MatchState = {
    G,
    ctx: {
      matchId: createMatchId(matchId),
      stateID: projection.stateID,
      playerIds,
      seed: "viewer-projection",
      rngState: null,
    },
  };
  reconcileProjectedPower(state, projectedCards);
  return state;
}

/**
 * The filtered server view already includes Gear in effectivePower. The viewer
 * also rebuilds attachment relationships so the engine can render Gear and
 * derive its power locally. Store only the remaining projected delta as the
 * snapshot modifier; otherwise every equipped Gear is counted twice.
 */
function reconcileProjectedPower(
  state: MatchState,
  projectedCards: ReadonlyMap<string, FilteredCardView>,
): void {
  for (const [cardId, projectedCard] of projectedCards) {
    const instance = state.G.cardIndex[cardId];
    if (!instance) continue;

    const locallyDerivedPower = getEffectivePowerFromCatalog(state, cardId, liveMatchCatalog);
    instance.meta.powerModifier = projectedCard.effectivePower - locallyDerivedPower;
  }
}

export function isFilteredMatchView(value: unknown): value is FilteredMatchView {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<FilteredMatchView>;
  return (
    Boolean(candidate.players && typeof candidate.players === "object") &&
    typeof candidate.gamePhase === "string" &&
    typeof candidate.turnNumber === "number" &&
    typeof candidate.activePlayerId === "string" &&
    typeof candidate.stateID === "number" &&
    Boolean(candidate.prompt && typeof candidate.prompt === "object")
  );
}

export function isMatchState(value: unknown): value is MatchState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<MatchState>;
  return Boolean(candidate.G && candidate.ctx);
}

const CARD_ZONES = ["deck", "hand", "field", "trash", "legendArea", "eddieArea"] as const;

/**
 * The zone projection collapses the deck (and rival hands) to counts, so
 * searchDeck-style interaction candidates reference instance ids the viewer's
 * card index would otherwise not contain — leaving choice-modal tiles blank
 * and hover previews inert. The server already vetted every card in these
 * prompt payloads as visible to this viewer (see `projectRevealedCardView`),
 * so rehydrating them here leaks nothing.
 */
function registerPromptRevealedCards(
  projection: FilteredMatchView,
  G: MatchState["G"],
  placeholderDefinitionId: string,
): void {
  const choice = projection.prompt.choice;
  if (!choice) {
    return;
  }
  const chooserId = createPlayerId(choice.chooserId);
  for (const card of revealedCardsFromPrompt(choice)) {
    const instanceId = String(card.instanceId);
    if (G.cardIndex[instanceId]) {
      continue;
    }
    const ownerId = ownerOfInstance(projection, instanceId) ?? chooserId;
    G.cardIndex[instanceId] = cardInstanceFromProjection(card, ownerId, placeholderDefinitionId);
  }
}

function revealedCardsFromPrompt(
  choice: FilteredMatchView["prompt"]["choice"],
): FilteredCardView[] {
  if (!choice) {
    return [];
  }
  switch (choice.type) {
    case "scry":
    case "revealDestination":
      return choice.payload.revealedCards ?? [];
    case "chooseTarget":
    case "chooseCardToPlay":
    case "chooseCardToMove":
    default:
      return [];
  }
}

function ownerOfInstance(projection: FilteredMatchView, instanceId: string): PlayerId | null {
  for (const [pid, player] of Object.entries(projection.players)) {
    for (const zone of CARD_ZONES) {
      const cards = player.zones[zone];
      if (Array.isArray(cards) && cards.some((card) => String(card.instanceId) === instanceId)) {
        return createPlayerId(pid);
      }
    }
  }
  return null;
}

/** The viewer engine never resolves choices locally; this id only marks reconstructed prompts. */
const VIEWER_PROMPT_EFFECT_ID = "viewer-projection-prompt";

/**
 * The zone projection carries the prompt's `choice` but the renderer's board
 * interactions (target-click selection, prompt-active gating, target
 * highlights, combat overlays) all read `G.turnMetadata.pendingChoice`. Without
 * this reconstruction the client believes no choice is pending: card clicks
 * open the inspect popover instead of selecting a target. This is the inverse
 * of the engine's `transformPendingChoice`; projection-only display fields
 * (current die face, projected card views) are dropped. If a legacy projection
 * lacks a required source identity, the interaction view remains authoritative
 * and no engine-shaped pending choice is fabricated.
 */
export function pendingChoiceFromPromptChoice(choice: ChoicePrompt): PendingChoice | undefined {
  const chooserId = createPlayerId(choice.chooserId);
  const effectId = VIEWER_PROMPT_EFFECT_ID;
  switch (choice.type) {
    case "chooseTarget":
      return {
        type: "chooseTarget",
        chooserId,
        effectId,
        payload: {
          type: choice.payload.type,
          ...(choice.payload.amount !== undefined ? { amount: choice.payload.amount } : {}),
          ...(choice.payload.player !== undefined
            ? { player: createPlayerId(choice.payload.player) }
            : {}),
          ...(choice.payload.dieId !== undefined
            ? { dieId: createGigDieId(choice.payload.dieId) }
            : {}),
          ...(choice.payload.direction !== undefined
            ? { direction: choice.payload.direction }
            : {}),
          ...(choice.payload.maxAmount !== undefined
            ? { maxAmount: choice.payload.maxAmount }
            : {}),
          ...(choice.payload.chooseUpTo !== undefined
            ? { chooseUpTo: choice.payload.chooseUpTo }
            : {}),
          ...(choice.payload.targetKind !== undefined
            ? { targetKind: choice.payload.targetKind }
            : {}),
          ...(choice.payload.eligibleIds !== undefined
            ? { eligibleIds: choice.payload.eligibleIds.map(createCardInstanceId) }
            : {}),
          ...(choice.payload.adjustGig !== undefined
            ? { adjustGig: choice.payload.adjustGig }
            : {}),
          ...(choice.payload.min !== undefined ? { min: choice.payload.min } : {}),
          ...(choice.payload.max !== undefined ? { max: choice.payload.max } : {}),
          ...(choice.payload.canDecline !== undefined
            ? { canDecline: choice.payload.canDecline }
            : {}),
          ...(choice.payload.effect !== undefined ? { effect: choice.payload.effect } : {}),
          // The projection only carries the source card's public identity; the
          // owning player is approximated by the chooser (exact for self-
          // effects, which is the only consumer-relevant case today).
          sourceCardId: choice.payload.source
            ? createCardInstanceId(choice.payload.source.cardId)
            : undefined,
          sourcePlayerId: choice.payload.source ? chooserId : undefined,
          ...(choice.payload.targetPurpose !== undefined
            ? { targetPurpose: choice.payload.targetPurpose }
            : {}),
          ...(choice.payload.availableEddiesAfterCosts !== undefined
            ? { availableEddiesAfterCosts: choice.payload.availableEddiesAfterCosts }
            : {}),
          ...(choice.payload.effectiveCostsByCardId !== undefined
            ? { effectiveCostsByCardId: choice.payload.effectiveCostsByCardId }
            : {}),
        },
      };
    case "gainGig":
      return {
        type: "gainGig",
        chooserId,
        effectId,
        payload: { allowedDieIds: choice.payload.allowedDieIds.map(createGigDieId) },
      };
    case "chooseFirstPlayer":
      return { type: "chooseFirstPlayer", chooserId, effectId, payload: {} };
    case "chooseTrigger":
      return {
        type: "chooseTrigger",
        chooserId,
        effectId,
        payload: {
          ...(choice.payload.canPass !== undefined ? { canPass: choice.payload.canPass } : {}),
          options: choice.payload.options.map((option) => ({
            triggerId: option.triggerId,
            sourceCardId: createCardInstanceId(option.sourceCardId),
            sourcePlayerId: createPlayerId(option.sourcePlayerId),
            abilityIndex: option.abilityIndex,
            abilityText: option.abilityText,
            cardName: option.cardName,
            ...(option.optional !== undefined ? { optional: option.optional } : {}),
          })),
        },
      };
    case "chooseEffect":
      if (!choice.payload.source) return undefined;
      return {
        type: "chooseEffect",
        chooserId,
        effectId,
        payload: {
          options: choice.payload.options.map((option) => ({ ...option })),
          sourceCardId: createCardInstanceId(choice.payload.source.cardId),
          sourcePlayerId: createPlayerId(choice.payload.source.controllerId),
          abilityIndex: 0,
          boundTargets: {},
          contextTargets: {},
        },
      };
    case "chooseGigsToSteal":
      return {
        type: "chooseGigsToSteal",
        chooserId,
        effectId,
        payload: {
          count: choice.payload.count,
          attackerId: createCardInstanceId(choice.payload.attackerId),
          rivalId: createPlayerId(choice.payload.rivalId),
          eligibleDieIds: choice.payload.eligibleDice.map((die) => createGigDieId(die.dieId)),
        },
      };
    case "preventGigSteal":
      return {
        type: "preventGigSteal",
        chooserId,
        effectId,
        payload: {
          attackerId: createCardInstanceId(choice.payload.attackerId),
          rivalId: createPlayerId(choice.payload.rivalId),
          attackerName: "",
          attackerPower: 0,
          stealEntries: choice.payload.stealEntries.map((entry) => ({
            dieId: createGigDieId(entry.dieId),
            value: entry.value,
          })),
          handEntries: choice.payload.handEntries.map((entry) => ({
            cardId: createCardInstanceId(entry.cardId),
            cost: entry.cost,
          })),
        },
      };
    case "redirectDefeat":
      return {
        type: "redirectDefeat",
        chooserId,
        effectId,
        payload: {
          protectedCardId: createCardInstanceId(choice.payload.protectedCardId),
          replacementCardId: createCardInstanceId(choice.payload.replacementCardId),
          cost: choice.payload.cost,
          continuation: {
            kind: "fight",
            remainingCardIds: [],
            fightPlayerId: createPlayerId(choice.payload.fightPlayerId),
            attackerPower: 0,
            defenderPower: 0,
          },
        },
      };
    case "chooseSacrificialGear":
      return {
        type: "chooseSacrificialGear",
        chooserId,
        effectId,
        payload: {
          hostId: createCardInstanceId(choice.payload.hostId),
          gearIds: choice.payload.gearIds.map(createCardInstanceId),
          continuation: {
            kind: "fight",
            remainingCardIds: [],
            fightPlayerId: createPlayerId(choice.payload.fightPlayerId),
            attackerPower: 0,
            defenderPower: 0,
          },
          defeatedBy: null,
        },
      };
    case "scry":
      return {
        type: "scry",
        chooserId,
        effectId,
        payload: {
          player: choice.payload.player,
          amount: choice.payload.amount,
          // The projection's destination filters (ScryTargetFilter) are a
          // display projection of the engine's CardTargetDSL, so `target` is
          // not reconstructed; viewer-side resolution never runs.
          destinations: choice.payload.destinations.map((destination) => ({
            zone: destination.zone,
            ...(destination.min !== undefined ? { min: destination.min } : {}),
            ...(destination.max !== undefined ? { max: destination.max } : {}),
            ...(destination.reveal !== undefined ? { reveal: destination.reveal } : {}),
            ...(destination.remainder !== undefined ? { remainder: destination.remainder } : {}),
            ...(destination.order !== undefined ? { order: destination.order } : {}),
          })),
          revealedCardIds: choice.payload.revealedCardIds.map(createCardInstanceId),
          sourceCardId: choice.payload.source
            ? createCardInstanceId(choice.payload.source.cardId)
            : undefined,
          sourcePlayerId: choice.payload.source ? chooserId : undefined,
        },
      };
    case "revealDestination":
      return {
        type: "revealDestination",
        chooserId,
        effectId,
        payload: {
          player: createPlayerId(choice.payload.player),
          destinations: ["hand", "trash"],
          revealedCardIds: choice.payload.revealedCardIds.map(createCardInstanceId),
          sourceCardId: choice.payload.source
            ? createCardInstanceId(choice.payload.source.cardId)
            : undefined,
          sourcePlayerId: choice.payload.source ? chooserId : undefined,
          ...(choice.payload.drawIfDestination !== undefined
            ? {
                drawIfDestination: {
                  destination: choice.payload.drawIfDestination.destination,
                  player: createPlayerId(choice.payload.drawIfDestination.player),
                  amount: choice.payload.drawIfDestination.amount,
                },
              }
            : {}),
        },
      };
    case "chooseCardToPlay":
      return {
        type: "chooseCardToPlay",
        chooserId,
        effectId,
        payload: {
          cardIds: choice.payload.cardIds.map(createCardInstanceId),
          ...(choice.payload.free !== undefined ? { free: choice.payload.free } : {}),
          attachTo: choice.payload.attachTo,
          ...(choice.payload.resolvedAttachToId !== undefined
            ? { resolvedAttachToId: choice.payload.resolvedAttachToId }
            : {}),
          boundTargets: {},
          ...(choice.payload.canDecline !== undefined
            ? { canDecline: choice.payload.canDecline }
            : {}),
        },
      };
    case "chooseCardToMove":
      if (!choice.payload.source) return undefined;
      return {
        type: "chooseCardToMove",
        chooserId,
        effectId,
        payload: {
          cardIds: choice.payload.cardIds.map(createCardInstanceId),
          ...(choice.payload.resolvedAttachToId !== undefined
            ? { resolvedAttachToId: choice.payload.resolvedAttachToId }
            : {}),
          ...(choice.payload.destination !== undefined
            ? { destination: choice.payload.destination }
            : {}),
          boundTargets: {},
          sourceCardId: createCardInstanceId(choice.payload.source.cardId),
          sourcePlayerId: createPlayerId(choice.payload.source.controllerId),
          abilityIndex: 0,
          ifEffects: [],
          elseEffects: [],
          ...(choice.payload.canDecline !== undefined
            ? { canDecline: choice.payload.canDecline }
            : {}),
        },
      };
    case "chooseCardType":
      if (!choice.payload.source) return undefined;
      return {
        type: "chooseCardType",
        chooserId,
        effectId,
        payload: {
          cardTypes: choice.payload.cardTypes,
          sourceCardId: createCardInstanceId(choice.payload.source.cardId),
          sourcePlayerId: createPlayerId(choice.payload.source.controllerId),
          abilityIndex: 0,
        },
      };
  }
}

function hiddenCardPlaceholderDefinitionId(): string {
  return UNKNOWN_CARD_DEFINITION_ID;
}

/**
 * A face-down card in the legends zone is publicly known to be a legend (the
 * zone itself discloses it), so its placeholder must carry a legend-type
 * definition — otherwise the viewer renders the generic card back instead of
 * the legend card back.
 */
function legendCardPlaceholderDefinitionId(): string {
  return UNKNOWN_LEGEND_DEFINITION_ID;
}

function hiddenCards(
  playerId: string,
  zone: CardZone,
  count: number,
  definitionId: string,
): FilteredCardView[] {
  return Array.from({ length: Math.max(0, count) }, (_, index) => ({
    instanceId: `viewer-hidden:${playerId}:${zone}:${index}`,
    definitionId,
    cardName: null,
    zone,
    faceDown: true,
    spent: false,
    damage: 0,
    power: 0,
    effectivePower: 0,
    cost: null,
    type: null,
    classifications: [],
    hasSellTag: false,
    attachedGearIds: [],
    attachedToId: null,
    hasLag: false,
    hasAttackedThisTurn: false,
    hasStolenGigThisTurn: false,
    grantedRules: [],
    keywords: [],
    triggerHints: [],
    abilityHints: [],
  }));
}

function cardInstanceFromProjection(
  card: FilteredCardView,
  ownerId: PlayerId,
  placeholderDefinitionId: string,
): CardInstance {
  const resolvedPlaceholderId =
    card.zone === "legendArea" ? legendCardPlaceholderDefinitionId() : placeholderDefinitionId;
  // Fail closed to an explicit viewer-only placeholder. Never substitute a
  // real catalog card for missing identity, even when a malformed face-up
  // projection slips through: displaying "Unknown Card" is honest, while a
  // plausible but unrelated card corrupts both the board and linked log UI.
  const definitionId = card.definitionId || resolvedPlaceholderId;
  return {
    instanceId: createCardInstanceId(card.instanceId),
    definitionId,
    ownerId,
    controllerId: ownerId,
    zone: card.zone,
    meta: {
      spent: card.spent,
      faceDown: card.faceDown,
      revealed: card.revealed === true,
      damage: card.damage,
      powerModifier: 0,
      powerMultiplier: 1,
      counters: {},
      attachedGearIds: card.attachedGearIds.map(createCardInstanceId),
      attachedToId: card.attachedToId ? createCardInstanceId(card.attachedToId) : null,
      hasLag: card.hasLag,
      hasAttackedThisTurn: card.hasAttackedThisTurn,
      hasStolenGigThisTurn: card.hasStolenGigThisTurn,
    },
  };
}

function diceFromProjection(
  value: FilteredCardView[] | number | undefined,
  ownerId: PlayerId,
  location: "gigArea" | "fixerArea",
  index: Record<string, GigDie>,
) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((card) => {
    if (!isDieType(card.definitionId)) return [];
    const id = createGigDieId(card.instanceId);
    index[card.instanceId] = {
      id,
      dieType: card.definitionId,
      faceValue: card.power,
      location,
      ownerId,
    };
    return [id];
  });
}

function gamePhase(value: string): GamePhase {
  return value === "setup" || value === "start" || value === "main" || value === "end"
    ? value
    : "setup";
}

function attackStateFromProjection(
  projection: FilteredMatchView,
  players: MatchState["G"]["players"],
): AttackState | null {
  const attack = projection.attackState;
  if (!attack || !attack.attackerId || !isAttackKind(attack.kind) || !isAttackStep(attack.step)) {
    return null;
  }
  const attackerOwner = Object.entries(players).find(([, player]) =>
    player.zones.field.some((id) => String(id) === attack.attackerId),
  )?.[0];
  const rivalId = Object.keys(players).find((playerId) => playerId !== attackerOwner);
  if (!rivalId) return null;
  return {
    attackerId: createCardInstanceId(attack.attackerId),
    defenderId: attack.defenderId ? createCardInstanceId(attack.defenderId) : null,
    rivalId: createPlayerId(rivalId),
    kind: attack.kind,
    step: attack.step,
    redirectedByBlocker: attack.redirectedByBlocker,
  };
}

function isAttackKind(value: string): value is AttackKind {
  return value === "fight" || value === "direct";
}

function isAttackStep(value: string): value is AttackStep {
  return value === "attack" || value === "react" || value === "fight" || value === "steal";
}

function isDieType(value: string): value is DieType {
  return (
    value === "d4" ||
    value === "d6" ||
    value === "d8" ||
    value === "d10" ||
    value === "d12" ||
    value === "d20"
  );
}
