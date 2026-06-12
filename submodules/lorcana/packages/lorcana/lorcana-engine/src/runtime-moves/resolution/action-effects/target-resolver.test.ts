import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import type { CardPlayedPayload } from "../../../types";
import type { PlayCardExecutionContext } from "./types";
import {
  analyzeEffectTargets,
  isPlayerTargetDescriptor,
  normalizeTargetDescriptor,
  resolveEffectTargets,
  resolveTargetBounds,
  resolveTargetQuery,
  resolveTargetPlayerIds as resolveRuntimeTargetPlayerIds,
  selectTargets,
  validateAndNormalizeTargetSelection,
} from "../../../targeting/runtime";

type TestCardDefinition = {
  id: string;
  cardType: "character" | "item" | "location" | "action";
  name?: string;
  strength?: number;
  willpower?: number;
  lore?: number;
  cost?: number;
};

const PLAYER_ONE = "player-one" as PlayerId;
const PLAYER_TWO = "player-two" as PlayerId;

function createTestContext(args?: {
  definitions?: Record<string, TestCardDefinition>;
  zoneCards?: Record<string, CardInstanceId[]>;
  cardMeta?: Record<string, Record<string, unknown>>;
  currentPlayer?: PlayerId;
}): PlayCardExecutionContext {
  const definitions = args?.definitions ?? {};
  const zoneCards = args?.zoneCards ?? {};
  const cardMeta = args?.cardMeta ?? {};
  const cardIndex: Record<string, { ownerID: PlayerId; zoneKey: string }> = {};

  for (const [zoneKey, cards] of Object.entries(zoneCards)) {
    const [, ownerSegment] = zoneKey.split(":");
    const owner = (ownerSegment ?? PLAYER_ONE) as PlayerId;
    for (const cardId of cards) {
      cardIndex[cardId] = { ownerID: owner, zoneKey };
    }
  }

  const currentPlayer = args?.currentPlayer ?? PLAYER_ONE;
  const getCards = ({ zone, playerId }: { zone: string; playerId: PlayerId }): CardInstanceId[] => [
    ...(zoneCards[`${zone}:${playerId}`] ?? []),
  ];
  const zonesApi = {
    getCards,
    getCardOwner: (cardId: CardInstanceId) => cardIndex[cardId]?.ownerID,
    getCardZone: (cardId: CardInstanceId) => cardIndex[cardId]?.zoneKey,
  };
  const runtimeCtx = {
    priority: { holder: currentPlayer },
    status: { turn: 1 },
    zones: {
      private: {
        cardIndex,
        cardMeta,
        zoneCards,
      },
    },
  };
  const cardsApi = {
    get: (cardId: CardInstanceId) => ({
      definition: definitions[cardId],
      meta: cardMeta[cardId] ?? {},
    }),
    require: (cardId: CardInstanceId) => ({
      definition: definitions[cardId],
      meta: cardMeta[cardId] ?? {},
    }),
    getDefinition: (cardId: CardInstanceId) => definitions[cardId],
    patchMeta: (cardId: CardInstanceId, nextMeta: Record<string, unknown>) => {
      cardMeta[cardId] = {
        ...cardMeta[cardId],
        ...nextMeta,
      };
    },
    setMeta: (cardId: CardInstanceId, nextMeta: Record<string, unknown>) => {
      cardMeta[cardId] = { ...nextMeta };
    },
    clearMeta: (cardId: CardInstanceId) => {
      delete cardMeta[cardId];
    },
    entriesMeta: () => Object.entries(cardMeta),
  };

  return {
    G: {
      lore: {
        [PLAYER_ONE]: 0,
        [PLAYER_TWO]: 0,
      },
    },
    playerId: currentPlayer,

    cards: cardsApi,
    framework: {
      cards: cardsApi,
      state: {
        priority: runtimeCtx.priority as never,
        status: runtimeCtx.status as never,
        _zonesPrivate: runtimeCtx.zones?.private as never,
        playerIds: [PLAYER_ONE, PLAYER_TWO],
        turn: 1,
        currentPlayer,
        phase: undefined,
        step: undefined,
        gameSegment: undefined,
        stateID: 0,
        matchID: "test-match",
        gameID: "test-game",
        gameEnded: false,
      },
      time: {
        getRemainingTime: () => 0,
      },
      zones: zonesApi as never,
    },
  } as unknown as PlayCardExecutionContext;
}

function createCardPlayedPayload(cardId: CardInstanceId, playerId: PlayerId): CardPlayedPayload {
  return {
    cardId,
    cardType: "action",
    costType: "free",
    playerId,
  };
}

describe("target-resolver", () => {
  it("normalizes string aliases", () => {
    expect(normalizeTargetDescriptor("YOUR_CHARACTERS")).toEqual({
      selector: "all",
      count: "all",
      owner: "you",
      zones: ["play"],
      cardTypes: ["character"],
    });
  });

  it("intersects chosen selected targets with candidate targets", () => {
    const targetOne = "target-one" as CardInstanceId;
    const targetTwo = "target-two" as CardInstanceId;
    const offBoardTarget = "off-board-target" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [targetOne]: { id: "target-one", cardType: "character" },
        [targetTwo]: { id: "target-two", cardType: "character" },
        [offBoardTarget]: { id: "off-board-target", cardType: "character" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [targetOne, targetTwo],
      },
    });

    const resolvedTargets = resolveEffectTargets(
      ctx,
      createCardPlayedPayload("source" as CardInstanceId, PLAYER_ONE),
      "CHOSEN_CHARACTER",
      [targetTwo, offBoardTarget],
    );

    expect(resolvedTargets).toEqual([targetTwo]);
  });

  it("resolves previous-target references to the selected target instead of the source card", () => {
    const source = "source" as CardInstanceId;
    const selectedTarget = "selected-target" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [selectedTarget]: { id: "selected-target", cardType: "character" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [selectedTarget],
      },
    });

    const resolvedTargets = resolveEffectTargets(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      { ref: "previous-target" },
      [selectedTarget],
    );

    expect(resolvedTargets).toEqual([selectedTarget]);
  });

  it("filters matching cards by the chosen card name and excludes the chosen card", () => {
    const source = "source" as CardInstanceId;
    const chosen = "chosen" as CardInstanceId;
    const sameNameOther = "same-name-other" as CardInstanceId;
    const differentName = "different-name" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action", name: "Source" },
        [chosen]: { id: "chosen", cardType: "character", name: "Merlin" },
        [sameNameOther]: { id: "same-name-other", cardType: "character", name: "Merlin" },
        [differentName]: { id: "different-name", cardType: "character", name: "Madam Mim" },
      },
      zoneCards: {
        [`play:${PLAYER_TWO}`]: [chosen, sameNameOther, differentName],
      },
    });

    const resolvedTargets = resolveEffectTargets(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        selector: "all",
        count: "all",
        owner: "opponent",
        cardTypes: ["character"],
        filter: {
          sameNameAsChosenCard: true,
          excludeChosenCard: true,
        },
      },
      undefined,
      { chosenCardId: chosen },
    );

    expect(resolvedTargets).toEqual([sameNameOther]);
  });

  it("counts a repeated chosen target descriptor only once when later steps reuse the same target", () => {
    const source = "source" as CardInstanceId;
    const selectedTarget = "selected-target" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [selectedTarget]: { id: "selected-target", cardType: "character" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [selectedTarget],
      },
    });

    const analysis = analyzeEffectTargets(
      {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            duration: "this-turn",
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
      PLAYER_ONE,
      ctx,
      source,
    );

    expect(analysis.requiresExplicitSelection).toBe(true);
    expect(analysis.minSelections).toBe(1);
    expect(analysis.maxSelections).toBe(1);
  });

  it("resolves trigger-subject references from the event snapshot", () => {
    const source = "source" as CardInstanceId;
    const triggeredCharacter = "triggered-character" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [source]: { id: "source", cardType: "location" },
        [triggeredCharacter]: { id: "triggered-character", cardType: "character" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source],
        [`discard:${PLAYER_ONE}`]: [triggeredCharacter],
      },
    });

    const resolvedTargets = resolveEffectTargets(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        selector: "all",
        count: 1,
        reference: "trigger-subject",
      },
      undefined,
      { subjectCardId: triggeredCharacter },
    );

    expect(resolvedTargets).toEqual([triggeredCharacter]);
  });

  it("honors explicit zone constraints for trigger-subject references", () => {
    const source = "source" as CardInstanceId;
    const triggeredCharacter = "triggered-character" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [source]: { id: "source", cardType: "location" },
        [triggeredCharacter]: { id: "triggered-character", cardType: "character" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source],
        [`hand:${PLAYER_ONE}`]: [triggeredCharacter],
      },
    });

    const resolvedTargets = resolveEffectTargets(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        selector: "all",
        count: 1,
        reference: "trigger-subject",
        zones: ["discard"],
      },
      undefined,
      { subjectCardId: triggeredCharacter },
    );

    expect(resolvedTargets).toEqual([]);
  });

  it("resolves trigger-destination references from a move event snapshot", () => {
    const source = "source" as CardInstanceId;
    const destinationLocation = "destination-location" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [source]: { id: "source", cardType: "character" },
        [destinationLocation]: { id: "destination-location", cardType: "location" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source, destinationLocation],
      },
    });

    const resolvedTargets = resolveEffectTargets(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      { ref: "trigger-destination" },
      undefined,
      { toZone: `location:${destinationLocation}` },
    );

    expect(resolvedTargets).toEqual([destinationLocation]);
  });

  it("resolves all/each selectors to all candidates", () => {
    const targetOne = "target-one" as CardInstanceId;
    const targetTwo = "target-two" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [targetOne]: { id: "target-one", cardType: "character" },
        [targetTwo]: { id: "target-two", cardType: "character" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [targetOne, targetTwo],
      },
    });

    const resolvedTargets = resolveEffectTargets(
      ctx,
      createCardPlayedPayload("source" as CardInstanceId, PLAYER_ONE),
      "YOUR_CHARACTERS",
      undefined,
    );

    expect(resolvedTargets).toEqual([targetOne, targetTwo]);
  });

  it("treats negative strength and lore as 0 in target filters", () => {
    const weakenedTarget = "weakened-target" as CardInstanceId;
    const normalTarget = "normal-target" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [weakenedTarget]: {
          id: "weakened-target",
          cardType: "character",
          strength: -1,
          lore: -2,
        },
        [normalTarget]: {
          id: "normal-target",
          cardType: "character",
          strength: 2,
          lore: 1,
        },
      },
      zoneCards: {
        [`play:${PLAYER_TWO}`]: [weakenedTarget, normalTarget],
      },
    });

    const result = resolveEffectTargets(
      ctx,
      createCardPlayedPayload("source" as CardInstanceId, PLAYER_ONE),
      {
        selector: "all",
        count: "all",
        owner: "opponent",
        zones: ["play"],
        cardTypes: ["character"],
        filters: [
          { type: "strength-comparison", comparison: "equal", value: 0 },
          { type: "lore-value", comparison: "equal", value: 0 },
        ],
      },
      undefined,
    );

    expect(result).toEqual([weakenedTarget]);
  });

  it("resolves players tied for the highest hand count", () => {
    const ctx = createTestContext({
      zoneCards: {
        [`hand:${PLAYER_ONE}`]: ["a" as CardInstanceId, "b" as CardInstanceId],
        [`hand:${PLAYER_TWO}`]: ["c" as CardInstanceId, "d" as CardInstanceId],
      },
      currentPlayer: PLAYER_ONE,
    });

    expect(
      resolveRuntimeTargetPlayerIds(
        ctx as Parameters<typeof resolveRuntimeTargetPlayerIds>[0],
        {
          selector: "each-player",
          filter: {
            type: "zone-count-rank",
            zone: "hand",
            rank: "highest",
            ties: "all",
            minCount: 1,
          },
        },
        { controllerId: PLAYER_ONE },
      ),
    ).toEqual([PLAYER_ONE, PLAYER_TWO]);
  });

  it("resolves only the unique highest hand-count player", () => {
    const ctx = createTestContext({
      zoneCards: {
        [`hand:${PLAYER_ONE}`]: ["a" as CardInstanceId],
        [`hand:${PLAYER_TWO}`]: [
          "b" as CardInstanceId,
          "c" as CardInstanceId,
          "d" as CardInstanceId,
        ],
      },
      currentPlayer: PLAYER_ONE,
    });

    expect(
      resolveRuntimeTargetPlayerIds(
        ctx as Parameters<typeof resolveRuntimeTargetPlayerIds>[0],
        {
          selector: "each-player",
          filter: {
            type: "zone-count-rank",
            zone: "hand",
            rank: "highest",
            ties: "all",
            minCount: 1,
          },
        },
        { controllerId: PLAYER_ONE },
      ),
    ).toEqual([PLAYER_TWO]);
  });

  it("skips ranked players when the highest count is below minCount", () => {
    const ctx = createTestContext({
      zoneCards: {
        [`hand:${PLAYER_ONE}`]: [],
        [`hand:${PLAYER_TWO}`]: [],
      },
      currentPlayer: PLAYER_ONE,
    });

    expect(
      resolveRuntimeTargetPlayerIds(
        ctx as Parameters<typeof resolveRuntimeTargetPlayerIds>[0],
        {
          selector: "each-player",
          filter: {
            type: "zone-count-rank",
            zone: "hand",
            rank: "highest",
            ties: "all",
            minCount: 1,
          },
        },
        { controllerId: PLAYER_ONE },
      ),
    ).toEqual([]);
  });

  it("resolves card query references from source/selected/revealed context", () => {
    const source = "source" as CardInstanceId;
    const selected = "selected" as CardInstanceId;
    const revealed = "revealed" as CardInstanceId;
    const chosen = "chosen" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [source]: { id: "source", cardType: "character" },
        [selected]: { id: "selected", cardType: "character" },
        [revealed]: { id: "revealed", cardType: "character" },
        [chosen]: { id: "chosen", cardType: "character" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source, selected, chosen],
        [`deck:${PLAYER_ONE}`]: [revealed],
      },
    });
    const cardPlayed = createCardPlayedPayload(source, PLAYER_ONE);

    expect(
      resolveTargetQuery(
        ctx,
        cardPlayed,
        { selector: "all", reference: "source" },
        {
          sourceCardId: source,
          selectedTargets: [selected],
          eventSnapshot: { revealedCardIds: [revealed] },
        },
      ),
    ).toEqual({ kind: "card", cardIds: [source] });

    expect(
      resolveTargetQuery(
        ctx,
        cardPlayed,
        { selector: "all", reference: "selected-first" },
        { sourceCardId: source, selectedTargets: [selected] },
      ),
    ).toEqual({ kind: "card", cardIds: [selected] });

    expect(
      resolveTargetQuery(
        ctx,
        cardPlayed,
        { selector: "all", reference: "previous-target" } as never,
        { sourceCardId: source, selectedTargets: [selected] },
      ),
    ).toEqual({ kind: "card", cardIds: [selected] });

    expect(
      resolveTargetQuery(
        ctx,
        cardPlayed,
        { selector: "all", reference: "revealed-first" },
        { sourceCardId: source, eventSnapshot: { revealedCardIds: [revealed] } },
      ),
    ).toEqual({ kind: "card", cardIds: [revealed] });

    expect(
      resolveTargetQuery(
        ctx,
        cardPlayed,
        { selector: "all", reference: "chosen-or-source" },
        { sourceCardId: source, eventSnapshot: { chosenCardId: chosen } },
      ),
    ).toEqual({ kind: "card", cardIds: [chosen] });

    expect(
      resolveTargetQuery(
        ctx,
        { ...cardPlayed, singerIds: [selected] },
        { selector: "all", reference: "singers" },
        { sourceCardId: source },
      ),
    ).toEqual({ kind: "card", cardIds: [selected] });

    expect(
      resolveTargetQuery(ctx, cardPlayed, "chosen-for-effect" as never, {
        selectedTargets: [selected],
      }),
    ).toEqual({ kind: "card", cardIds: [selected] });
  });

  it("filters discard characters by the named card stored in the event snapshot", () => {
    const source = "source" as CardInstanceId;
    const namedOne = "named-one" as CardInstanceId;
    const namedTwo = "named-two" as CardInstanceId;
    const different = "different" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [namedOne]: { id: "named-one", cardType: "character", name: "Pete" },
        [namedTwo]: { id: "named-two", cardType: "character", name: "Pete" },
        [different]: { id: "different", cardType: "character", name: "Peter Pan's Shadow" },
      },
      zoneCards: {
        [`discard:${PLAYER_ONE}`]: [namedOne, namedTwo, different],
      },
    });

    expect(
      resolveTargetQuery(
        ctx,
        createCardPlayedPayload(source, PLAYER_ONE),
        {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["discard"],
          cardTypes: ["character"],
          filters: [{ type: "named-card" }],
        },
        {
          controllerId: PLAYER_ONE,
          eventSnapshot: { namedCardName: "Pete" },
        },
      ),
    ).toEqual({ kind: "card", cardIds: [namedOne, namedTwo] });
  });

  it("filters cards by same-location-as-source and cards-under", () => {
    const source = "source" as CardInstanceId;
    const sameLocation = "same-location" as CardInstanceId;
    const otherLocation = "other-location" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [source]: { id: "source", cardType: "location" },
        [sameLocation]: { id: "same-location", cardType: "character" },
        [otherLocation]: { id: "other-location", cardType: "character" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source, sameLocation, otherLocation],
      },
      cardMeta: {
        [source]: { atLocationId: "location-a" as CardInstanceId },
        [sameLocation]: { atLocationId: "location-a" as CardInstanceId, cardsUnder: ["u1"] },
        [otherLocation]: { atLocationId: "location-b" as CardInstanceId, cardsUnder: [] },
      },
    });

    const result = resolveTargetQuery(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        selector: "all",
        owner: "you",
        zones: ["play"],
        cardType: "character",
        filters: [
          { type: "same-location-as-source" },
          { type: "cards-under", comparison: "gte", value: 1 },
        ],
      },
      { sourceCardId: source, strictUnknownFilters: true },
    );

    expect(result).toEqual({ kind: "card", cardIds: [sameLocation] });
  });

  it("evaluates player lore and current-turn filters", () => {
    const source = "source" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source],
      },
      currentPlayer: PLAYER_ONE,
    });
    ctx.G.lore[PLAYER_ONE] = 3;
    ctx.G.lore[PLAYER_TWO] = 0;

    const opponentLoreResult = resolveTargetQuery(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        selector: "opponent",
        filters: [{ type: "lore", comparison: "eq", value: 0 }],
      },
      { strictUnknownFilters: true },
    );
    expect(opponentLoreResult).toEqual({ kind: "player", playerIds: [PLAYER_TWO] });

    const currentTurnResult = resolveTargetQuery(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        selector: "you",
        filters: [{ type: "current-turn-player", value: true }],
      },
      { strictUnknownFilters: true },
    );
    expect(currentTurnResult).toEqual({ kind: "player", playerIds: [PLAYER_ONE] });
  });

  it("keeps each-opponent player selectors resolving to opponents", () => {
    const source = "source" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source],
      },
    });
    const legacyDescriptor: unknown = { selector: "each-opponent" };
    expect(isPlayerTargetDescriptor(legacyDescriptor)).toBe(true);

    const result = resolveTargetQuery(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      legacyDescriptor as never,
      { strictUnknownFilters: true },
    );

    expect(result).toEqual({ kind: "player", playerIds: [PLAYER_TWO] });
  });

  it("enforces target bounds for optional and exact selections", () => {
    expect(resolveTargetBounds({ upTo: 2 }, "chosen")).toEqual({ min: 0, max: 2 });
    expect(resolveTargetBounds({ exactly: 1 }, "chosen")).toEqual({ min: 1, max: 1 });
  });

  it("keeps optional zero-target selections empty", () => {
    const candidate = "candidate" as CardInstanceId;
    expect(selectTargets([candidate], { selector: "chosen", count: { upTo: 1 } }, [])).toEqual([]);
  });

  it("accepts explicit empty target input only when the target analysis allows zero selections", () => {
    const emptyAllowed = validateAndNormalizeTargetSelection([], {
      targetDsl: [],
      cardCandidates: [],
      playerCandidates: [],
      allowedZones: ["play"],
      minSelections: 0,
      maxSelections: 1,
      requiresExplicitSelection: true,
      allowsDeferredResolutionWithoutInitialSelection: false,
      allowDuplicateTargets: false,
    });
    expect(emptyAllowed.valid).toBe(true);

    const emptyRejected = validateAndNormalizeTargetSelection([], {
      targetDsl: [],
      cardCandidates: [],
      playerCandidates: [],
      allowedZones: ["play"],
      minSelections: 1,
      maxSelections: 1,
      requiresExplicitSelection: true,
      allowsDeferredResolutionWithoutInitialSelection: false,
      allowDuplicateTargets: false,
    });
    expect(emptyRejected).toMatchObject({
      valid: false,
      errorCode: "TOO_FEW_TARGETS",
    });
  });

  it("still rejects explicit invalid targets even when zero selections would be allowed", () => {
    const legalTarget = "legal-target" as CardInstanceId;
    const illegalTarget = "illegal-target" as CardInstanceId;

    const selection = validateAndNormalizeTargetSelection([illegalTarget], {
      targetDsl: [],
      cardCandidates: [legalTarget],
      playerCandidates: [],
      allowedZones: ["play"],
      minSelections: 0,
      maxSelections: 1,
      requiresExplicitSelection: true,
      allowsDeferredResolutionWithoutInitialSelection: false,
      allowDuplicateTargets: false,
    });

    expect(selection).toMatchObject({
      valid: false,
      errorCode: "INVALID_ACTION_TARGET",
    });
  });

  it("fails closed for unknown strict player filters", () => {
    const source = "source" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source],
      },
    });

    const result = resolveTargetQuery(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        selector: "each-player",
        filters: [{ type: "unknown-filter-type" }],
      } as never,
      { strictUnknownFilters: true },
    );

    expect(result).toEqual({ kind: "player", playerIds: [] });
  });
});
