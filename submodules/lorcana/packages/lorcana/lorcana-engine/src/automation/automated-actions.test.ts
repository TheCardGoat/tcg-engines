import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type {
  ActionCard,
  ActivatedAbilityDefinition,
  Effect,
  ItemCard,
  LocationCard,
  LorcanaCardDefinition,
} from "@tcg/lorcana-types";
import { createCardI18n } from "../card-i18n";
import type {
  BagEffectEntry,
  CardPlayedPayload,
  LorcanaMatchState,
  PendingActionEffect,
} from "../types";
import type { AutomatedActionDecisionTrace } from "./types";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockSong,
} from "../testing";

import { resolveServerCurrentActor } from "./actor-resolution";
import {
  aggressiveBoardControlLoreRaceAutomatedActionStrategy,
  boardControlLoreRaceAutomatedActionStrategy,
} from "./default-strategy";
import {
  bestDeckAwareLoreRaceAutomatedActionStrategy,
  bestDeckAwareOracleLoreRaceAutomatedActionStrategy,
  deckAwareLoreRaceAutomatedActionStrategy,
} from "./deck-aware-strategy";
import {
  challengeOnlyTestAutomatedActionStrategy,
  questOnlyTestAutomatedActionStrategy,
} from "./forced-family-strategy";
import { enumerateAutomatedActionsWithAdapter, takeAutomatedActionWithAdapter } from "./planner";

function createMockActionCard(params: {
  id: string;
  name: string;
  cost: number;
  text: string;
  inkable?: boolean;
  abilities: ActionCard["abilities"];
}): ActionCard {
  return {
    id: params.id,
    canonicalId: `ci_${params.id}`,
    cardType: "action",
    name: params.name,
    cost: params.cost,
    inkType: ["amber"],
    inkable: params.inkable ?? true,
    set: "TST",
    rarity: "common",
    text: params.text,
    abilities: params.abilities,
    i18n: createCardI18n(params.name, {
      en: {
        name: params.name,
        text: params.text,
      },
    }),
    cardNumber: 701,
  };
}

function createMockItem(params: {
  id: string;
  name: string;
  cost: number;
  abilities?: ItemCard["abilities"];
}): ItemCard {
  return {
    id: params.id,
    canonicalId: `ci_${params.id}`,
    cardType: "item",
    name: params.name,
    cost: params.cost,
    inkType: ["amber"],
    inkable: true,
    set: "TST",
    rarity: "common",
    abilities: params.abilities ?? [],
    i18n: createCardI18n(params.name),
    cardNumber: 702,
  };
}

function createMockLocation(params: {
  id: string;
  name: string;
  cost: number;
  willpower: number;
  moveCost?: number;
  lore?: number;
}): LocationCard {
  return {
    id: params.id,
    canonicalId: `ci_${params.id}`,
    cardType: "location",
    name: params.name,
    cost: params.cost,
    moveCost: params.moveCost ?? 1,
    willpower: params.willpower,
    lore: params.lore ?? 0,
    inkType: ["amber"],
    inkable: true,
    set: "TST",
    rarity: "common",
    abilities: [],
    i18n: createCardI18n(params.name),
    cardNumber: 703,
  };
}

function getCardPlayedPayload(args: {
  playerId: typeof PLAYER_ONE | typeof PLAYER_TWO;
  cardId: string;
  cardType: CardPlayedPayload["cardType"];
}): CardPlayedPayload {
  return {
    playerId: args.playerId,
    cardId: args.cardId as CardPlayedPayload["cardId"],
    cardType: args.cardType,
    costType: "standard",
  };
}

function createDocDrasticMeasuresBagEffect(sourceId: CardInstanceId): BagEffectEntry {
  return {
    id: "bag:doc:drastic-measures",
    type: "bag-effect",
    kind: "triggered-ability",
    abilityId: "doc-drastic-measures",
    abilityKey: "doc-drastic-measures",
    abilityName: "DRASTIC MEASURES",
    controllerId: PLAYER_ONE,
    chooserId: PLAYER_ONE,
    sourceId,
    cardPlayed: getCardPlayedPayload({
      playerId: PLAYER_ONE,
      cardId: sourceId,
      cardType: "character",
    }),
    effect: {
      chooser: "CONTROLLER",
      effect: {
        type: "sequence",
        steps: [
          {
            amount: "all",
            from: "hand",
            target: "CONTROLLER",
            type: "discard",
          },
          {
            amount: 2,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
      },
      type: "optional",
    } satisfies Effect,
    occurrenceIndex: 0,
    resolutionInput: {},
  };
}

function getDefinitionByInstanceId(
  engine: LorcanaMultiplayerTestEngine,
  cardId: string,
): LorcanaCardDefinition | undefined {
  const definitionId = engine.asServer().staticResources.instances.get(cardId)?.definitionId;
  return definitionId ? engine.asServer().staticResources.cards.get(definitionId) : undefined;
}

function getExecutionTrace(
  traces: readonly AutomatedActionDecisionTrace[],
): AutomatedActionDecisionTrace | undefined {
  return traces.find((trace) => trace.kind === "execution");
}

function getSelectedHeuristicValue(
  trace: AutomatedActionDecisionTrace | undefined,
  key: string,
): boolean | number | string | undefined {
  return trace?.selectedCandidate?.heuristics.find((heuristic) => heuristic.key === key)?.value;
}

function findTraceCandidate(
  trace: AutomatedActionDecisionTrace | undefined,
  predicate: (
    summary: NonNullable<AutomatedActionDecisionTrace["orderedCandidates"]>[number],
  ) => boolean,
) {
  return trace?.orderedCandidates.find(predicate);
}

function loadMutatedState(
  engine: LorcanaMultiplayerTestEngine,
  mutate: (state: LorcanaMatchState) => void,
): void {
  const state = structuredClone(engine.asServer().getState()) as LorcanaMatchState;
  mutate(state);
  engine.loadState(state);
}

function setPendingActionChoice(
  state: LorcanaMatchState,
  effectId: string,
  playerId: typeof PLAYER_ONE | typeof PLAYER_TWO,
): void {
  state.ctx.priority.pendingChoice = {
    type: "action-effect",
    playerID: playerId,
    requestID: effectId,
  };
}

function createQuestAdapter(args: {
  executionResults: Array<
    ReturnType<typeof createFailureResult> | ReturnType<typeof createSuccessResult>
  >;
  passTurnResult?: ReturnType<typeof createFailureResult> | ReturnType<typeof createSuccessResult>;
  concedeResult?: ReturnType<typeof createFailureResult> | ReturnType<typeof createSuccessResult>;
}) {
  const questers = [
    createMockCharacter({ id: "stub-quester-1", name: "Stub Quester 1", cost: 2, lore: 2 }),
    createMockCharacter({ id: "stub-quester-2", name: "Stub Quester 2", cost: 2, lore: 1 }),
    createMockCharacter({ id: "stub-quester-3", name: "Stub Quester 3", cost: 2, lore: 1 }),
  ];
  const engine = LorcanaMultiplayerTestEngine.createWithFixture({
    play: questers.map((card) => ({ card, isDrying: false })),
    deck: 1,
  });
  const player = engine.asPlayerOne();
  const board = player.getBoard();
  const state = engine.asServer().getState();
  let executionIndex = 0;

  return {
    actorId: PLAYER_ONE,
    availableMoveIds: ["quest"],
    board,
    concede: () => args.concedeResult ?? createFailureResult("Concede failed", "CONCEDE_FAILED"),
    createErrorResult: createFailureResult,
    createNoopResult: createSuccessResult,
    executeCandidate: () => {
      const result =
        args.executionResults[executionIndex] ??
        createFailureResult("Unexpected execution", "UNEXPECTED_EXECUTION");
      executionIndex += 1;
      return result;
    },
    getDefinitionByInstanceId: (cardId: string) => getDefinitionByInstanceId(engine, cardId),
    passTurn: () => args.passTurnResult ?? createSuccessResult(),
    previewChallenge: () => null,
    state,
    staticResources: engine.asServer().staticResources,
    validateCandidate: () => ({ valid: true }),
  };
}

function createFailureResult(error: string, errorCode = "FAILED") {
  return {
    success: false as const,
    error,
    errorCode,
    currentStateID: 0,
  };
}

function createForcedFamilyTargetSelectionEngine() {
  const source = createMockCharacter({
    id: "forced-family-target-source",
    name: "Forced Family Target Source",
    cost: 2,
    abilities: [
      {
        id: "forced-family-target-source-removal",
        name: "PING",
        type: "activated",
        cost: {},
        effect: { amount: 2, target: "CHOSEN_CHARACTER", type: "deal-damage" },
        text: "PING - Deal 2 damage to chosen character.",
      } satisfies ActivatedAbilityDefinition,
    ],
  });
  const supportTarget = createMockCharacter({
    id: "forced-family-support-target",
    name: "Forced Family Support Target",
    cost: 2,
    lore: 0,
    strength: 1,
    willpower: 4,
    inkType: ["emerald"],
  });
  const threatTarget = createMockCharacter({
    id: "forced-family-threat-target",
    name: "Forced Family Threat Target",
    cost: 2,
    lore: 2,
    strength: 2,
    willpower: 2,
    inkType: ["emerald"],
    abilities: [
      {
        id: "forced-family-threat-target-draw",
        name: "THREAT DRAW",
        type: "activated",
        cost: {},
        effect: { amount: 1, target: "CONTROLLER", type: "draw" },
        text: "THREAT DRAW - Draw a card.",
      } satisfies ActivatedAbilityDefinition,
    ],
  });
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [{ card: source, isDrying: false }],
      deck: 1,
    },
    {
      play: [
        { card: supportTarget, exerted: true, isDrying: false },
        { card: threatTarget, exerted: true, isDrying: false },
      ],
      deck: 1,
    },
  );
  const sourceId = engine.asPlayerOne().getCard(source).id as CardInstanceId;
  const supportTargetId = engine.asPlayerTwo().getCard(supportTarget).id as CardInstanceId;
  const threatTargetId = engine.asPlayerTwo().getCard(threatTarget).id as CardInstanceId;

  loadMutatedState(engine, (state) => {
    state.ctx.priority.holder = PLAYER_ONE;
    state.G.pendingEffects = [
      {
        id: "pending:forced-family:target:1",
        type: "action-effect",
        kind: "target-selection",
        sourceId,
        sourceCardId: sourceId,
        controllerId: PLAYER_ONE,
        chooserId: PLAYER_ONE,
        cardPlayed: getCardPlayedPayload({
          playerId: PLAYER_ONE,
          cardId: sourceId,
          cardType: "character",
        }),
        effect: {
          amount: 2,
          target: "CHOSEN_CHARACTER",
          type: "deal-damage",
        } satisfies Effect,
        resolutionInput: {},
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending:forced-family:target:1",
          kind: "target-selection",
          sourceCardId: sourceId,
          chooserId: PLAYER_ONE,
          currentSelection: {},
          submitField: "targets",
          targetDsl: [],
          cardCandidateIds: [supportTargetId, threatTargetId],
          playerCandidateIds: [],
          allowedZones: ["play"],
          minSelections: 1,
          maxSelections: 1,
          ordered: false,
          autoRejected: false,
        },
      } satisfies PendingActionEffect,
    ];
    setPendingActionChoice(state, "pending:forced-family:target:1", PLAYER_ONE);
  });

  return {
    engine,
    sourceId,
    supportTarget,
    supportTargetId,
    threatTarget,
    threatTargetId,
  };
}

function createSuccessResult() {
  return {
    success: true as const,
    stateID: 0,
    state: structuredClone(
      LorcanaMultiplayerTestEngine.createWithFixture({ deck: 1 }, { deck: 1 })
        .asServer()
        .getState(),
    ) as LorcanaMatchState,
    patches: [],
    gameEvents: [],
    processedCommand: {
      commandID: "test-command",
      move: "test-move",
    },
    animations: [],
    undoable: false,
  };
}

describe("automated actions", () => {
  it("ranks choose-first-player candidates to choose self first", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [createMockCharacter({ id: "pregame-hand", name: "Pregame Hand", cost: 2 })],
        deck: 1,
      },
      {
        deck: 1,
      },
      { skipPreGame: false },
    );

    const result = engine.asPlayerOne().enumerateAutomatedActions();

    expect(result.actorId).toBe(PLAYER_ONE);
    expect(result.candidates[0]).toMatchObject({
      family: "chooseWhoGoesFirst",
      firstPlayerId: PLAYER_ONE,
    });
  });

  it("ranks choose-first-player candidates to choose self first for the current actor", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
      },
      {
        deck: 1,
      },
      { skipPreGame: false },
    );

    loadMutatedState(engine, (state) => {
      state.ctx.status.choosingFirstPlayer = PLAYER_TWO;
      state.ctx.priority.holder = PLAYER_TWO;
      state.ctx.status.phase = "chooseFirstPlayer";
      state.ctx.status.step = "";
    });

    const result = engine.asServer().enumerateAutomatedActionsForCurrentActor();

    expect(result.actorId).toBe(PLAYER_TWO);
    expect(result.candidates[0]).toMatchObject({
      family: "chooseWhoGoesFirst",
      firstPlayerId: PLAYER_TWO,
    });
  });

  it("aggressive board-control still chooses itself to go first", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
      },
      {
        deck: 1,
      },
      { skipPreGame: false },
    );

    loadMutatedState(engine, (state) => {
      state.ctx.status.choosingFirstPlayer = PLAYER_TWO;
      state.ctx.priority.holder = PLAYER_TWO;
      state.ctx.status.phase = "chooseFirstPlayer";
      state.ctx.status.step = "";
    });

    const result = engine.asServer().takeAutomatedActionForCurrentActor({
      strategy: aggressiveBoardControlLoreRaceAutomatedActionStrategy,
    });

    expect(result.actorId).toBe(PLAYER_TWO);
    expect(result.selectedCandidate).toMatchObject({
      family: "chooseWhoGoesFirst",
      firstPlayerId: PLAYER_TWO,
    });
    expect(result.finalResult.success).toBe(true);
  });

  it("builds keep-all, structural, and full mulligan candidates in deterministic order", () => {
    const keeperOne = createMockCharacter({ id: "keeper-one", name: "Keeper One", cost: 1 });
    const keeperTwo = createMockCharacter({ id: "keeper-two", name: "Keeper Two", cost: 2 });
    const expensiveInkable = createMockCharacter({
      id: "expensive-inkable",
      name: "Expensive Inkable",
      cost: 7,
    });
    const expensiveNonInkable = {
      ...createMockCharacter({
        id: "expensive-non-inkable",
        name: "Expensive Non-Inkable",
        cost: 6,
      }),
      inkable: false,
    };
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [keeperOne, keeperTwo, expensiveInkable, expensiveNonInkable],
        deck: 1,
      },
      {
        deck: 1,
      },
      { skipPreGame: false },
    );

    loadMutatedState(engine, (state) => {
      state.ctx.status.choosingFirstPlayer = undefined;
      state.ctx.status.pendingMulligan = [PLAYER_ONE, PLAYER_TWO];
      state.ctx.status.phase = "alterHand";
      state.ctx.status.step = "";
    });

    const mulliganCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter((candidate) => candidate.family === "alterHand");

    expect(mulliganCandidates.map((candidate) => candidate.plan)).toEqual([
      "structural-mulligan",
      "keep-all",
      "full-mulligan",
    ]);
    expect(mulliganCandidates[0]).toMatchObject({
      family: "alterHand",
      cardsToMulligan: expect.arrayContaining([
        engine.asPlayerOne().getCard(expensiveInkable).id,
        engine.asPlayerOne().getCard(expensiveNonInkable).id,
      ]),
    });
  });

  it("aggressive board-control keeps the shared mulligan ordering", () => {
    const keeperOne = createMockCharacter({
      id: "agg-keeper-one",
      name: "Agg Keeper One",
      cost: 1,
    });
    const keeperTwo = createMockCharacter({
      id: "agg-keeper-two",
      name: "Agg Keeper Two",
      cost: 2,
    });
    const expensiveInkable = createMockCharacter({
      id: "agg-expensive-inkable",
      name: "Agg Expensive Inkable",
      cost: 7,
    });
    const expensiveNonInkable = {
      ...createMockCharacter({
        id: "agg-expensive-non-inkable",
        name: "Agg Expensive Non-Inkable",
        cost: 6,
      }),
      inkable: false,
    };
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [keeperOne, keeperTwo, expensiveInkable, expensiveNonInkable],
        deck: 1,
      },
      {
        deck: 1,
      },
      { skipPreGame: false },
    );

    loadMutatedState(engine, (state) => {
      state.ctx.status.choosingFirstPlayer = undefined;
      state.ctx.status.pendingMulligan = [PLAYER_ONE, PLAYER_TWO];
      state.ctx.status.phase = "alterHand";
      state.ctx.status.step = "";
    });

    const mulliganCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions({
        strategy: aggressiveBoardControlLoreRaceAutomatedActionStrategy,
      })
      .candidates.filter((candidate) => candidate.family === "alterHand");

    expect(mulliganCandidates.map((candidate) => candidate.plan)).toEqual([
      "keep-all",
      "structural-mulligan",
      "full-mulligan",
    ]);
  });

  it("enumerates resolveBag candidates from the active bag", () => {
    const source = createMockCharacter({ id: "bag-source", name: "Bag Source", cost: 2 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: source, isDrying: false }],
      deck: 1,
    });
    const sourceId = engine.asPlayerOne().getCard(source).id as CardInstanceId;

    loadMutatedState(engine, (state) => {
      state.G.triggeredAbilities.bag.items = [
        {
          id: "bag:automation:1",
          type: "bag-effect",
          kind: "triggered-ability",
          abilityId: "bag-ability-1",
          abilityKey: "bag-ability-1",
          controllerId: PLAYER_ONE,
          chooserId: PLAYER_ONE,
          sourceId,
          cardPlayed: getCardPlayedPayload({
            playerId: PLAYER_ONE,
            cardId: sourceId,
            cardType: "character",
          }),
          effect: {
            amount: 1,
            target: "CONTROLLER",
            type: "gain-lore",
          } satisfies Effect,
          occurrenceIndex: 0,
          resolutionInput: {},
        } satisfies BagEffectEntry,
      ];
    });

    const bagCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter((candidate) => candidate.family === "resolveBag");

    expect(bagCandidates).toHaveLength(1);
    expect(bagCandidates[0]).toMatchObject({
      family: "resolveBag",
      bagId: "bag:automation:1",
    });
  });

  it("enumerates resolveBag candidates when the bag holds more than eight items", () => {
    const source = createMockCharacter({
      id: "bag-many-source",
      name: "Bag Many Source",
      cost: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: source, isDrying: false }],
      deck: 1,
    });
    const sourceId = engine.asPlayerOne().getCard(source).id as CardInstanceId;

    loadMutatedState(engine, (state) => {
      state.G.triggeredAbilities.bag.items = Array.from(
        { length: 9 },
        (_, index) =>
          ({
            id: `bag:automation:many:${index + 1}`,
            type: "bag-effect",
            kind: "triggered-ability",
            abilityId: `bag-many-ability-${index + 1}`,
            abilityKey: `bag-many-ability-${index + 1}`,
            controllerId: PLAYER_ONE,
            chooserId: PLAYER_ONE,
            sourceId,
            cardPlayed: getCardPlayedPayload({
              playerId: PLAYER_ONE,
              cardId: sourceId,
              cardType: "character",
            }),
            effect: {
              amount: 1,
              target: "CONTROLLER",
              type: "gain-lore",
            } satisfies Effect,
            occurrenceIndex: index,
            resolutionInput: {},
          }) satisfies BagEffectEntry,
      );
    });

    const result = engine.asPlayerOne().enumerateAutomatedActions();
    const bagCandidates = result.candidates.filter(
      (candidate) => candidate.family === "resolveBag",
    );

    expect(bagCandidates).toHaveLength(9);
    expect(bagCandidates.map((candidate) => candidate.bagId)).toEqual(
      Array.from({ length: 9 }, (_, index) => `bag:automation:many:${index + 1}`),
    );
    expect(
      result.diagnostics.some(
        (diagnostic) => diagnostic.kind === "overflow-skip" && diagnostic.family === "resolveBag",
      ),
    ).toBe(false);
  });

  it("keeps a resolveBag candidate with empty targets when no valid candidates exist — effect fizzles", () => {
    const source = createMockCharacter({
      id: "bag-empty-source",
      name: "Bag Empty Source",
      cost: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: source, isDrying: false }],
      deck: 1,
    });
    const sourceId = engine.asPlayerOne().getCard(source).id as CardInstanceId;

    loadMutatedState(engine, (state) => {
      state.G.triggeredAbilities.bag.items = [
        {
          id: "bag:automation:empty-targets",
          type: "bag-effect",
          kind: "triggered-ability",
          abilityId: "bag-ability-empty-targets",
          abilityKey: "bag-ability-empty-targets",
          controllerId: PLAYER_ONE,
          chooserId: PLAYER_ONE,
          sourceId,
          cardPlayed: getCardPlayedPayload({
            playerId: PLAYER_ONE,
            cardId: sourceId,
            cardType: "character",
          }),
          effect: {
            type: "ready",
            target: "CHOSEN_EXERTED_CHARACTER",
          } satisfies Effect,
          occurrenceIndex: 0,
          resolutionInput: {},
        } satisfies BagEffectEntry,
      ];
    });

    const bagCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter((candidate) => candidate.family === "resolveBag");

    // When no valid targets exist, the fizzle path is valid — automation enumerates an empty-target candidate
    expect(bagCandidates).toEqual([
      expect.objectContaining({
        family: "resolveBag",
        bagId: "bag:automation:empty-targets",
      }),
    ]);
  });

  it("enumerates resolveEffect candidates for optional pending effects", () => {
    const source = createMockCharacter({ id: "pending-source", name: "Pending Source", cost: 2 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: source, isDrying: false }],
      deck: 2,
    });
    const sourceId = engine.asPlayerOne().getCard(source).id as CardInstanceId;

    loadMutatedState(engine, (state) => {
      state.G.pendingEffects = [
        {
          id: "pending:automation:1",
          type: "action-effect",
          kind: "optional-selection",
          sourceId,
          sourceCardId: sourceId,
          controllerId: PLAYER_ONE,
          chooserId: PLAYER_ONE,
          cardPlayed: getCardPlayedPayload({
            playerId: PLAYER_ONE,
            cardId: sourceId,
            cardType: "character",
          }),
          effect: {
            chooser: "CONTROLLER",
            effect: {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            type: "optional",
          } satisfies Effect,
          resolutionInput: {},
        } satisfies PendingActionEffect,
      ];
      setPendingActionChoice(state, "pending:automation:1", PLAYER_ONE);
    });

    const resolveEffectCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter((candidate) => candidate.family === "resolveEffect");

    expect(resolveEffectCandidates).toEqual([
      {
        family: "resolveEffect",
        effectId: "pending:automation:1",
        resolveOptional: true,
      },
      {
        family: "resolveEffect",
        effectId: "pending:automation:1",
        resolveOptional: false,
      },
    ]);
  });

  it("prefers accepting a beneficial optional resolveBag candidate", () => {
    const source = createMockCharacter({
      id: "bag-benefit-source",
      name: "Bag Benefit Source",
      cost: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: source, isDrying: false }],
      deck: 1,
      lore: 0,
    });
    const sourceId = engine.asPlayerOne().getCard(source).id as CardInstanceId;

    loadMutatedState(engine, (state) => {
      state.G.triggeredAbilities.bag.items = [
        {
          id: "bag:automation:benefit",
          type: "bag-effect",
          kind: "triggered-ability",
          abilityId: "bag-benefit-ability",
          abilityKey: "bag-benefit-ability",
          controllerId: PLAYER_ONE,
          chooserId: PLAYER_ONE,
          sourceId,
          cardPlayed: getCardPlayedPayload({
            playerId: PLAYER_ONE,
            cardId: sourceId,
            cardType: "character",
          }),
          effect: {
            chooser: "CONTROLLER",
            effect: {
              amount: 2,
              target: "CONTROLLER",
              type: "gain-lore",
            },
            type: "optional",
          } satisfies Effect,
          occurrenceIndex: 0,
          resolutionInput: {},
        } satisfies BagEffectEntry,
      ];
    });

    const result = engine.asPlayerOne().takeAutomatedAction();

    expect(result.selectedCandidate).toEqual({
      family: "resolveBag",
      bagId: "bag:automation:benefit",
      resolveOptional: true,
    });
    expect(result.finalResult.success).toBe(true);
    expect(engine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
  });

  it("declines Doc's drastic measures when the hand is large and still inkable", () => {
    const docSource = createMockCharacter({
      id: "qUy",
      name: "Doc",
      version: "Bold Knight",
      cost: 2,
      inkable: false,
    });
    const inkableOne = createMockCharacter({ id: "doc-inkable-1", name: "Inkable One", cost: 1 });
    const inkableTwo = createMockCharacter({ id: "doc-inkable-2", name: "Inkable Two", cost: 2 });
    const inkableThree = createMockCharacter({
      id: "doc-inkable-3",
      name: "Inkable Three",
      cost: 3,
    });
    const inkableFour = createMockCharacter({
      id: "doc-inkable-4",
      name: "Inkable Four",
      cost: 4,
    });
    const uninkableFive = createMockCharacter({
      id: "doc-uninkable-5",
      name: "Uninkable Five",
      cost: 5,
      inkable: false,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkableOne, inkableTwo, inkableThree, inkableFour, uninkableFive],
      play: [{ card: docSource, isDrying: false }],
      deck: 3,
    });
    const sourceId = engine.asPlayerOne().getCard(docSource).id as CardInstanceId;
    const traces: AutomatedActionDecisionTrace[] = [];

    loadMutatedState(engine, (state) => {
      state.G.triggeredAbilities.bag.items = [createDocDrasticMeasuresBagEffect(sourceId)];
    });

    const result = engine.asPlayerOne().takeAutomatedAction({
      traceSink: {
        push(trace) {
          traces.push(trace);
        },
      },
    });

    expect(result.selectedCandidate).toEqual({
      family: "resolveBag",
      bagId: "bag:doc:drastic-measures",
      resolveOptional: false,
    });
    expect(result.finalResult.success).toBe(true);
    expect(engine.asPlayerOne().getBoard().players[PLAYER_ONE]?.handCount).toBe(5);

    const executionTrace = getExecutionTrace(traces);
    expect(getSelectedHeuristicValue(executionTrace, "resolvePolicyMatched")).toBe(true);
    expect(getSelectedHeuristicValue(executionTrace, "resolvePolicyId")).toBe(
      "doc-bold-knight:drastic-measures",
    );
    expect(getSelectedHeuristicValue(executionTrace, "resolvePolicyDecision")).toBe("decline");
    expect(getSelectedHeuristicValue(executionTrace, "resolvePolicyReason")).toBe(
      "keep-larger-inkable-hand",
    );
    expect(getSelectedHeuristicValue(executionTrace, "resolvePolicyHandSize")).toBe(5);
    expect(getSelectedHeuristicValue(executionTrace, "resolvePolicyUninkableHandCount")).toBe(1);
    expect(getSelectedHeuristicValue(executionTrace, "resolvePolicyDecisionAligned")).toBe(true);
  });

  it("accepts Doc's drastic measures when the hand has two or fewer cards", () => {
    const docSource = createMockCharacter({
      id: "qUy",
      name: "Doc",
      version: "Bold Knight",
      cost: 2,
      inkable: false,
    });
    const handOne = createMockCharacter({ id: "doc-small-hand-1", name: "Small Hand 1", cost: 1 });
    const handTwo = createMockCharacter({ id: "doc-small-hand-2", name: "Small Hand 2", cost: 2 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [handOne, handTwo],
      play: [{ card: docSource, isDrying: false }],
      deck: 3,
    });
    const sourceId = engine.asPlayerOne().getCard(docSource).id as CardInstanceId;
    const traces: AutomatedActionDecisionTrace[] = [];

    loadMutatedState(engine, (state) => {
      state.G.triggeredAbilities.bag.items = [createDocDrasticMeasuresBagEffect(sourceId)];
    });

    const result = engine.asPlayerOne().takeAutomatedAction({
      traceSink: {
        push(trace) {
          traces.push(trace);
        },
      },
    });

    expect(result.selectedCandidate).toEqual({
      family: "resolveBag",
      bagId: "bag:doc:drastic-measures",
      resolveOptional: true,
    });
    expect(result.finalResult.success).toBe(true);
    expect(engine.asPlayerOne().getBoard().players[PLAYER_ONE]?.handCount).toBe(2);

    const executionTrace = getExecutionTrace(traces);
    expect(getSelectedHeuristicValue(executionTrace, "resolvePolicyDecision")).toBe("accept");
    expect(getSelectedHeuristicValue(executionTrace, "resolvePolicyReason")).toBe(
      "hand-size-at-most-two",
    );
    expect(getSelectedHeuristicValue(executionTrace, "resolvePolicyHandSize")).toBe(2);
    expect(getSelectedHeuristicValue(executionTrace, "resolvePolicyUninkableHandCount")).toBe(0);
  });

  it("accepts Doc's drastic measures when every hand card is uninkable", () => {
    const docSource = createMockCharacter({
      id: "qUy",
      name: "Doc",
      version: "Bold Knight",
      cost: 2,
      inkable: false,
    });
    const uninkableOne = createMockCharacter({
      id: "doc-large-uninkable-1",
      name: "Large Uninkable 1",
      cost: 3,
      inkable: false,
    });
    const uninkableTwo = createMockCharacter({
      id: "doc-large-uninkable-2",
      name: "Large Uninkable 2",
      cost: 4,
      inkable: false,
    });
    const uninkableThree = createMockCharacter({
      id: "doc-large-uninkable-3",
      name: "Large Uninkable 3",
      cost: 5,
      inkable: false,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [uninkableOne, uninkableTwo, uninkableThree],
      play: [{ card: docSource, isDrying: false }],
      deck: 3,
    });
    const sourceId = engine.asPlayerOne().getCard(docSource).id as CardInstanceId;
    const traces: AutomatedActionDecisionTrace[] = [];

    loadMutatedState(engine, (state) => {
      state.G.triggeredAbilities.bag.items = [createDocDrasticMeasuresBagEffect(sourceId)];
    });

    const result = engine.asPlayerOne().takeAutomatedAction({
      traceSink: {
        push(trace) {
          traces.push(trace);
        },
      },
    });

    expect(result.selectedCandidate).toEqual({
      family: "resolveBag",
      bagId: "bag:doc:drastic-measures",
      resolveOptional: true,
    });
    expect(result.finalResult.success).toBe(true);
    expect(engine.asPlayerOne().getBoard().players[PLAYER_ONE]?.handCount).toBe(2);

    const executionTrace = getExecutionTrace(traces);
    expect(getSelectedHeuristicValue(executionTrace, "resolvePolicyDecision")).toBe("accept");
    expect(getSelectedHeuristicValue(executionTrace, "resolvePolicyReason")).toBe(
      "all-hand-cards-uninkable",
    );
    expect(getSelectedHeuristicValue(executionTrace, "resolvePolicyHandSize")).toBe(3);
    expect(getSelectedHeuristicValue(executionTrace, "resolvePolicyUninkableHandCount")).toBe(3);
    expect(getSelectedHeuristicValue(executionTrace, "resolvePolicyAllHandCardsUninkable")).toBe(
      true,
    );
  });

  it("prefers accepting a beneficial optional resolveEffect candidate", () => {
    const source = createMockCharacter({
      id: "pending-benefit-source",
      name: "Pending Benefit Source",
      cost: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
      },
      {
        play: [{ card: source, isDrying: false }],
        deck: 2,
      },
    );
    const sourceId = engine.asPlayerTwo().getCard(source).id as CardInstanceId;

    loadMutatedState(engine, (state) => {
      state.ctx.priority.holder = PLAYER_ONE;
      state.G.pendingEffects = [
        {
          id: "pending:benefit:1",
          type: "action-effect",
          kind: "optional-selection",
          sourceId,
          sourceCardId: sourceId,
          controllerId: PLAYER_TWO,
          chooserId: PLAYER_TWO,
          cardPlayed: getCardPlayedPayload({
            playerId: PLAYER_TWO,
            cardId: sourceId,
            cardType: "character",
          }),
          effect: {
            chooser: "CONTROLLER",
            effect: {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            type: "optional",
          } satisfies Effect,
          resolutionInput: {},
        } satisfies PendingActionEffect,
      ];
      setPendingActionChoice(state, "pending:benefit:1", PLAYER_TWO);
    });

    const result = engine.asServer().takeAutomatedActionForCurrentActor();

    expect(result.actorId).toBe(PLAYER_TWO);
    expect(result.selectedCandidate).toEqual({
      family: "resolveEffect",
      effectId: "pending:benefit:1",
      resolveOptional: true,
    });
    expect(result.finalResult.success).toBe(true);
    expect(engine.asPlayerTwo().getBoard().players[PLAYER_TWO]?.handCount).toBe(1);
  });

  it("enumerates resolveEffect candidates when more than eight chooser-owned pending effects exist", () => {
    const source = createMockCharacter({
      id: "pending-many-source",
      name: "Pending Many Source",
      cost: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: source, isDrying: false }],
      deck: 2,
    });
    const sourceId = engine.asPlayerOne().getCard(source).id as CardInstanceId;

    const state = structuredClone(engine.asServer().getState()) as LorcanaMatchState;
    state.G.pendingEffects = Array.from(
      { length: 9 },
      (_, index) =>
        ({
          id: `pending:automation:many:${index + 1}`,
          type: "action-effect",
          kind: "optional-selection",
          sourceId,
          sourceCardId: sourceId,
          controllerId: PLAYER_ONE,
          chooserId: PLAYER_ONE,
          cardPlayed: getCardPlayedPayload({
            playerId: PLAYER_ONE,
            cardId: sourceId,
            cardType: "character",
          }),
          effect: {
            chooser: "CONTROLLER",
            effect: {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            type: "optional",
          } satisfies Effect,
          resolutionInput: {},
        }) satisfies PendingActionEffect,
    );

    const result = enumerateAutomatedActionsWithAdapter({
      actorId: PLAYER_ONE,
      availableMoveIds: ["resolveEffect"],
      board: engine.asPlayerOne().getBoard(),
      concede: () => createFailureResult("Concede should not be used", "UNEXPECTED_CONCEDE"),
      createErrorResult: createFailureResult,
      createNoopResult: createSuccessResult,
      executeCandidate: () => createFailureResult("Execution should not be used", "UNEXPECTED"),
      getDefinitionByInstanceId: (cardId: string) => getDefinitionByInstanceId(engine, cardId),
      passTurn: () => createFailureResult("Pass should not be used", "UNEXPECTED_PASS"),
      previewChallenge: () => null,
      state,
      staticResources: engine.asServer().staticResources,
      validateCandidate: () => ({ valid: true }),
    });
    const resolveEffectCandidates = result.candidates.filter(
      (candidate) => candidate.family === "resolveEffect",
    );

    expect(resolveEffectCandidates).toHaveLength(18);
    expect(resolveEffectCandidates.map((candidate) => candidate.effectId)).toEqual([
      ...Array.from({ length: 9 }, (_, index) => `pending:automation:many:${index + 1}`),
      ...Array.from({ length: 9 }, (_, index) => `pending:automation:many:${index + 1}`),
    ]);
    expect(
      resolveEffectCandidates.slice(0, 9).every((candidate) => candidate.resolveOptional),
    ).toBe(true);
    expect(
      resolveEffectCandidates.slice(9).every((candidate) => candidate.resolveOptional === false),
    ).toBe(true);
    expect(
      result.diagnostics.some(
        (diagnostic) =>
          diagnostic.kind === "overflow-skip" && diagnostic.family === "resolveEffect",
      ),
    ).toBe(false);
  });

  it("enumerates resolveBag candidates for optional look-at-the-top effects", () => {
    const source = createMockCharacter({ id: "scry-bag-source", name: "Scry Bag Source", cost: 2 });
    const badTopCard = {
      ...createMockCharacter({
        id: "bad-top-card",
        name: "Bad Top Card",
        cost: 7,
        lore: 0,
      }),
      inkable: false,
    };
    const nextCard = createMockCharacter({
      id: "next-top-card",
      name: "Next Top Card",
      cost: 2,
      lore: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: source, isDrying: false }],
      deck: [badTopCard, nextCard],
    });
    const sourceId = engine.asPlayerOne().getCard(source).id as CardInstanceId;

    loadMutatedState(engine, (state) => {
      state.G.triggeredAbilities.bag.items = [
        {
          id: "bag:scry:1",
          type: "bag-effect",
          kind: "triggered-ability",
          abilityId: "scry-bag-ability",
          abilityKey: "scry-bag-ability",
          sourceId,
          controllerId: PLAYER_ONE,
          chooserId: PLAYER_ONE,
          cardPlayed: getCardPlayedPayload({
            playerId: PLAYER_ONE,
            cardId: sourceId,
            cardType: "character",
          }),
          effect: {
            type: "optional",
            effect: {
              type: "scry",
              amount: 1,
              destinations: [
                {
                  zone: "deck-top",
                  min: 0,
                  max: 1,
                },
                {
                  zone: "deck-bottom",
                  remainder: true,
                },
              ],
            },
          } satisfies Effect,
          resolutionInput: {},
          occurrenceIndex: 0,
        } satisfies BagEffectEntry,
      ];
    });

    const result = engine.asPlayerOne().enumerateAutomatedActions();
    const bagCandidates = result.candidates.filter(
      (candidate) => candidate.family === "resolveBag",
    );

    expect(bagCandidates).toContainEqual({
      family: "resolveBag",
      bagId: "bag:scry:1",
      resolveOptional: false,
    });
    expect(bagCandidates).toContainEqual(
      expect.objectContaining({
        family: "resolveBag",
        bagId: "bag:scry:1",
        resolveOptional: true,
        destinations: expect.arrayContaining([
          expect.objectContaining({ zone: "deck-top" }),
          expect.objectContaining({ zone: "deck-bottom" }),
        ]),
      }),
    );
  });

  it("enumerates resolveEffect destinations for look-at-the-top pending effects", () => {
    const source = createMockCharacter({ id: "scry-source", name: "Scry Source", cost: 2 });
    const usefulTopCard = createMockCharacter({
      id: "useful-top-card",
      name: "Useful Top Card",
      cost: 2,
      lore: 2,
    });
    const badBottomCard = {
      ...createMockCharacter({
        id: "bad-bottom-card",
        name: "Bad Bottom Card",
        cost: 7,
        lore: 0,
      }),
      inkable: false,
    };
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: source, isDrying: false }],
      deck: [usefulTopCard, badBottomCard],
    });
    const sourceId = engine.asPlayerOne().getCard(source).id as CardInstanceId;
    const usefulTopCardId = engine.findCardInstanceId(usefulTopCard, "deck", PLAYER_ONE);
    const badBottomCardId = engine.findCardInstanceId(badBottomCard, "deck", PLAYER_ONE);

    loadMutatedState(engine, (state) => {
      state.G.pendingEffects = [
        {
          id: "pending:scry:1",
          type: "action-effect",
          kind: "scry-selection",
          sourceId,
          sourceCardId: sourceId,
          controllerId: PLAYER_ONE,
          chooserId: PLAYER_ONE,
          cardPlayed: getCardPlayedPayload({
            playerId: PLAYER_ONE,
            cardId: sourceId,
            cardType: "character",
          }),
          effect: {
            type: "scry",
            amount: 2,
            destinations: [
              { zone: "deck-top", min: 0, max: 1 },
              { zone: "deck-bottom", remainder: true },
            ],
          } satisfies Effect,
          resolutionInput: {
            eventSnapshot: {
              revealedCardIds: [usefulTopCardId, badBottomCardId],
            },
          },
          selectionContext: {
            amount: 2,
            chooserId: PLAYER_ONE,
            currentSelection: {},
            destinationRules: [
              { id: "deck-top", max: 1, min: 0, remainder: false, zone: "deck-top" },
              { id: "deck-bottom", max: null, min: 0, remainder: true, zone: "deck-bottom" },
            ],
            kind: "scry-selection",
            origin: "pending-effect",
            requestId: "pending:scry:1",
            revealedCardIds: [usefulTopCardId, badBottomCardId],
            revealedCards: [
              {
                cardId: usefulTopCardId,
                label: "Useful Top Card",
                cardType: "character",
                cost: 2,
              },
              {
                cardId: badBottomCardId,
                label: "Bad Bottom Card",
                cardType: "character",
                cost: 7,
              },
            ],
            sourceCardId: sourceId,
            submitField: "destinations",
          },
        } satisfies PendingActionEffect,
      ];
      setPendingActionChoice(state, "pending:scry:1", PLAYER_ONE);
    });

    const result = engine.asPlayerOne().enumerateAutomatedActions();

    expect(result.candidates).toContainEqual({
      family: "resolveEffect",
      effectId: "pending:scry:1",
      destinations: [
        { zone: "deck-top", cards: [usefulTopCardId] },
        { zone: "deck-bottom", cards: [badBottomCardId] },
      ],
    });
  });

  it("enumerates resolveEffect destinations for opponent-delegated scry pending effects", () => {
    const source = createMockCharacter({
      id: "opponent-scry-source",
      name: "Opponent Scry Source",
      cost: 1,
    });
    const revealedChar = createMockCharacter({
      id: "revealed-char",
      name: "Revealed Character",
      cost: 2,
      lore: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: source, isDrying: false }] },
      { deck: [revealedChar] },
    );
    const sourceId = engine.asPlayerOne().getCard(source).id as CardInstanceId;
    const revealedCharId = engine.findCardInstanceId(revealedChar, "deck", PLAYER_TWO);

    loadMutatedState(engine, (state) => {
      state.G.pendingEffects = [
        {
          id: "pending:opponent-scry:1",
          type: "action-effect",
          kind: "scry-selection",
          sourceId,
          sourceCardId: sourceId,
          controllerId: PLAYER_TWO,
          chooserId: PLAYER_TWO,
          cardPlayed: getCardPlayedPayload({
            playerId: PLAYER_ONE,
            cardId: sourceId,
            cardType: "character",
          }),
          effect: {
            type: "scry",
            amount: 1,
            target: "EACH_OPPONENT",
            chooser: "OPPONENT",
            revealAll: true,
            destinations: [
              {
                zone: "hand",
                min: 0,
                max: 1,
                filter: { type: "card-type", cardType: "character" },
                reveal: true,
              },
              {
                zone: "deck-bottom",
                remainder: true,
                reveal: true,
              },
            ],
          } satisfies Effect,
          resolutionInput: {
            eventSnapshot: {
              revealedCardIds: [revealedCharId],
            },
          },
          selectionContext: {
            amount: 1,
            chooserId: PLAYER_TWO,
            currentSelection: {},
            destinationRules: [
              {
                id: "hand",
                max: 1,
                min: 0,
                remainder: false,
                zone: "hand",
                filters: [{ type: "card-type", cardType: "character" }],
              },
              { id: "deck-bottom", max: null, min: 0, remainder: true, zone: "deck-bottom" },
            ],
            kind: "scry-selection",
            origin: "pending-effect",
            requestId: "pending:opponent-scry:1",
            revealedCardIds: [revealedCharId],
            revealedCards: [
              {
                cardId: revealedCharId,
                label: "Revealed Character",
                cardType: "character",
                cost: 2,
              },
            ],
            sourceCardId: sourceId,
            submitField: "destinations",
          },
        } satisfies PendingActionEffect,
      ];
      setPendingActionChoice(state, "pending:opponent-scry:1", PLAYER_TWO);
    });

    const result = engine.asPlayerTwo().enumerateAutomatedActions();
    const resolveEffectCandidates = result.candidates.filter(
      (candidate) => candidate.family === "resolveEffect",
    );
    const unsupportedDiagnostics = result.diagnostics.filter(
      (d) =>
        d.kind === "unsupported-shape" &&
        d.family === "resolveEffect" &&
        d.reason?.includes("destination"),
    );

    expect(unsupportedDiagnostics).toHaveLength(0);
    expect(resolveEffectCandidates.length).toBeGreaterThan(0);
    expect(resolveEffectCandidates).toContainEqual(
      expect.objectContaining({
        family: "resolveEffect",
        effectId: "pending:opponent-scry:1",
        destinations: expect.arrayContaining([
          expect.objectContaining({ zone: "hand", cards: [revealedCharId] }),
          expect.objectContaining({ zone: "deck-bottom" }),
        ]),
      }),
    );
  });

  it("enumerates playCard candidates for action cards with scry destinations and player-choice ordering", () => {
    const scryAction = createMockActionCard({
      id: "scry-action",
      name: "Scry Action",
      cost: 2,
      text: "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
      abilities: [
        {
          id: "scry-action-1",
          text: "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
          type: "action",
          effect: {
            type: "scry",
            amount: 5,
            target: "CONTROLLER",
            destinations: [
              { zone: "hand", min: 1, max: 1 },
              { zone: "deck-bottom", remainder: true, ordering: "player-choice" },
            ],
          },
        },
      ],
    });
    const deckCards = Array.from({ length: 6 }, (_, index) =>
      createMockCharacter({
        id: `deck-card-${index}`,
        name: `Deck Card ${index}`,
        cost: index + 1,
        lore: index % 3,
      }),
    );
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [scryAction],
      inkwell: 2,
      deck: deckCards,
    });

    const result = engine.asPlayerOne().enumerateAutomatedActions();
    const playCardCandidates = result.candidates.filter(
      (candidate) => candidate.family === "playCard",
    );
    const unsupportedDiagnostics = result.diagnostics.filter(
      (d) => d.kind === "unsupported-shape" && d.family === "playCard",
    );

    expect(unsupportedDiagnostics).toHaveLength(0);
    expect(playCardCandidates.length).toBeGreaterThan(0);
    expect(playCardCandidates[0]).toMatchObject({
      family: "playCard",
    });
  });

  it("emits overflow diagnostics when target pools exceed the search cap", () => {
    const source = createMockCharacter({
      id: "overflow-source",
      name: "Overflow Source",
      cost: 2,
      abilities: [
        {
          id: "overflow-source-ability",
          name: "READY TARGET",
          type: "activated",
          cost: {},
          effect: { type: "ready", target: "CHOSEN_CHARACTER" },
          text: "READY TARGET - Ready chosen character.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const extraTargets = Array.from({ length: 9 }, (_, index) =>
      createMockCharacter({
        id: `overflow-target-${index + 1}`,
        name: `Overflow Target ${index + 1}`,
        cost: 2,
      }),
    );
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: source, isDrying: false },
        ...extraTargets.map((card) => ({ card, exerted: true, isDrying: false })),
      ],
      deck: 1,
    });

    const result = engine.asPlayerOne().enumerateAutomatedActions();
    const activateAbilityCandidates = result.candidates.filter(
      (candidate) => candidate.family === "activateAbility",
    );

    expect(
      result.diagnostics.some(
        (diagnostic) =>
          diagnostic.kind === "overflow-skip" &&
          diagnostic.family === "activateAbility" &&
          diagnostic.cap === 8,
      ),
    ).toBe(true);
    expect(activateAbilityCandidates).toHaveLength(8);
    expect(activateAbilityCandidates.every((candidate) => candidate.targets?.length === 1)).toBe(
      true,
    );
    expect(
      activateAbilityCandidates.some((candidate) => candidate.targets?.[0] === "overflow-target-9"),
    ).toBe(false);
  });

  it("ranks inkwell candidates by lower cost then lower lore", () => {
    const expensiveLowLore = createMockCharacter({
      id: "expensive-low-lore",
      name: "Expensive Low Lore",
      cost: 6,
      lore: 0,
    });
    const expensiveHighLore = createMockCharacter({
      id: "expensive-high-lore",
      name: "Expensive High Lore",
      cost: 6,
      lore: 2,
    });
    const cheapCard = createMockCharacter({
      id: "cheap-card",
      name: "Cheap Card",
      cost: 2,
      lore: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [expensiveHighLore, cheapCard, expensiveLowLore],
      deck: 1,
    });

    const inkCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter((candidate) => candidate.family === "putCardIntoInkwell");

    expect(inkCandidates.map((candidate) => candidate.cardId)).toEqual([
      engine.asPlayerOne().getCard(expensiveLowLore).id,
      engine.asPlayerOne().getCard(expensiveHighLore).id,
      engine.asPlayerOne().getCard(cheapCard).id,
    ]);
  });

  it("ranks play-card candidates by higher cost then higher lore", () => {
    const expensiveHighLore = createMockCharacter({
      id: "expensive-high-lore-play",
      name: "Expensive High Lore Play",
      cost: 6,
      lore: 2,
    });
    const expensiveLowLore = createMockCharacter({
      id: "expensive-low-lore-play",
      name: "Expensive Low Lore Play",
      cost: 6,
      lore: 0,
    });
    const cheapHighLore = createMockCharacter({
      id: "cheap-high-lore-play",
      name: "Cheap High Lore Play",
      cost: 2,
      lore: 3,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cheapHighLore, expensiveLowLore, expensiveHighLore],
      inkwell: 6,
      deck: 1,
    });

    const playCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter((candidate) => candidate.family === "playCard");

    expect(playCandidates.map((candidate) => candidate.cardId)).toEqual([
      engine.asPlayerOne().getCard(cheapHighLore).id,
      engine.asPlayerOne().getCard(expensiveHighLore).id,
      engine.asPlayerOne().getCard(expensiveLowLore).id,
    ]);
  });

  it("enumerates play-card cost modes including standard, shift, sing, and singTogether", () => {
    const shiftBase = createMockCharacter({
      id: "shift-base",
      name: "Shifting Hero",
      cost: 2,
    });
    const shiftCard = createMockCharacter({
      id: "shift-card",
      name: "Shifting Hero",
      cost: 6,
      abilities: [
        {
          id: "shift-card-keyword",
          type: "keyword",
          keyword: "Shift",
          cost: { ink: 2 },
          text: "Shift 2",
        },
      ],
    });
    const singerFive = createMockCharacter({ id: "singer-five", name: "Singer Five", cost: 5 });
    const singerThree = createMockCharacter({ id: "singer-three", name: "Singer Three", cost: 3 });
    const singerTwo = createMockCharacter({ id: "singer-two", name: "Singer Two", cost: 2 });
    const song = createMockSong({
      id: "automation-song",
      name: "Automation Song",
      cost: 5,
      text: "Sing Together 5. Draw a card.",
      abilities: [
        {
          id: "automation-song-sing-together",
          type: "keyword",
          keyword: "SingTogether",
          value: 5,
          text: "Sing Together 5",
        },
        {
          id: "automation-song-effect",
          type: "action",
          effect: {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          text: "Draw a card.",
        },
      ],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [shiftCard, song],
      inkwell: 6,
      play: [
        { card: shiftBase, isDrying: false },
        { card: singerFive, isDrying: false },
        { card: singerThree, isDrying: false },
        { card: singerTwo, isDrying: false },
      ],
      deck: 2,
    });

    const playCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter((candidate) => candidate.family === "playCard");
    const shiftCardId = engine.asPlayerOne().getCard(shiftCard).id;
    const shiftBaseId = engine.asPlayerOne().getCard(shiftBase).id;
    const songId = engine.asPlayerOne().getCard(song).id;
    const singerFiveId = engine.asPlayerOne().getCard(singerFive).id;
    const singerThreeId = engine.asPlayerOne().getCard(singerThree).id;
    const singerTwoId = engine.asPlayerOne().getCard(singerTwo).id;

    expect(
      playCandidates.some(
        (candidate) =>
          candidate.family === "playCard" &&
          candidate.cardId === shiftCardId &&
          typeof candidate.cost === "object" &&
          candidate.cost.cost === "shift" &&
          candidate.cost.shiftTarget === shiftBaseId,
      ),
    ).toBe(true);
    expect(
      playCandidates.some(
        (candidate) =>
          candidate.family === "playCard" &&
          candidate.cardId === songId &&
          candidate.cost === "standard",
      ),
    ).toBe(true);
    expect(
      playCandidates.some(
        (candidate) =>
          candidate.family === "playCard" &&
          candidate.cardId === songId &&
          typeof candidate.cost === "object" &&
          candidate.cost.cost === "sing" &&
          candidate.cost.singer === singerFiveId,
      ),
    ).toBe(true);
    expect(
      playCandidates.some(
        (candidate) =>
          candidate.family === "playCard" &&
          candidate.cardId === songId &&
          typeof candidate.cost === "object" &&
          candidate.cost.cost === "singTogether" &&
          candidate.cost.singers.join(",") === [singerThreeId, singerTwoId].join(","),
      ),
    ).toBe(true);
  });

  it("enumerates activated abilities with concrete target selections", () => {
    const source = createMockCharacter({
      id: "ability-source",
      name: "Ability Source",
      cost: 2,
      abilities: [
        {
          id: "ready-target",
          name: "READY TARGET",
          type: "activated",
          cost: {},
          effect: { type: "ready", target: "CHOSEN_CHARACTER" },
          text: "READY TARGET - Ready chosen character.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const target = createMockCharacter({
      id: "ability-target",
      name: "Ability Target",
      cost: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: source, isDrying: false },
        { card: target, exerted: true, isDrying: false },
      ],
      deck: 1,
    });

    const abilityCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter((candidate) => candidate.family === "activateAbility");

    expect(abilityCandidates).toEqual([
      {
        family: "activateAbility",
        abilityIndex: 0,
        cardId: engine.asPlayerOne().getCard(source).id,
        targets: [engine.asPlayerOne().getCard(source).id],
      },
      {
        family: "activateAbility",
        abilityIndex: 0,
        cardId: engine.asPlayerOne().getCard(source).id,
        targets: [engine.asPlayerOne().getCard(target).id],
      },
    ]);
  });

  it("ranks challenge candidates by preview outcome and defender lore", () => {
    const attacker = createMockCharacter({
      id: "challenge-attacker",
      name: "Challenge Attacker",
      cost: 3,
      strength: 4,
      willpower: 5,
    });
    const highLoreDefender = createMockCharacter({
      id: "high-lore-defender",
      name: "High Lore Defender",
      cost: 2,
      strength: 2,
      willpower: 4,
      lore: 3,
    });
    const lowLoreDefender = createMockCharacter({
      id: "low-lore-defender",
      name: "Low Lore Defender",
      cost: 2,
      strength: 2,
      willpower: 4,
      lore: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: attacker, isDrying: false }],
        deck: 1,
      },
      {
        play: [
          { card: highLoreDefender, exerted: true, isDrying: false },
          { card: lowLoreDefender, exerted: true, isDrying: false },
        ],
        deck: 1,
      },
    );

    const challengeCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter((candidate) => candidate.family === "challenge");

    expect(challengeCandidates[0]).toMatchObject({
      family: "challenge",
      defenderId: engine.asPlayerTwo().getCard(highLoreDefender).id,
    });
  });

  it("enumerates move-to-location candidates", () => {
    const character = createMockCharacter({
      id: "location-mover",
      name: "Location Mover",
      cost: 2,
    });
    const location = createMockLocation({
      id: "automation-location",
      name: "Automation Location",
      cost: 2,
      willpower: 6,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: character, isDrying: false }, location],
      inkwell: 1,
      deck: 1,
    });

    const moveCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter((candidate) => candidate.family === "moveCharacterToLocation");

    expect(moveCandidates).toEqual([
      {
        family: "moveCharacterToLocation",
        characterId: engine.asPlayerOne().getCard(character).id,
        locationId: engine.asPlayerOne().getCard(location).id,
      },
    ]);
  });

  it("resolves the current server actor from pending effects before priority", () => {
    const source = createMockCharacter({
      id: "server-pending-source",
      name: "Server Pending Source",
      cost: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
      },
      {
        play: [{ card: source, isDrying: false }],
        deck: 2,
      },
    );
    const sourceId = engine.asPlayerTwo().getCard(source).id as CardInstanceId;

    loadMutatedState(engine, (state) => {
      state.ctx.priority.holder = PLAYER_ONE;
      state.G.pendingEffects = [
        {
          id: "pending:server:1",
          type: "action-effect",
          kind: "optional-selection",
          sourceId,
          sourceCardId: sourceId,
          controllerId: PLAYER_TWO,
          chooserId: PLAYER_TWO,
          cardPlayed: getCardPlayedPayload({
            playerId: PLAYER_TWO,
            cardId: sourceId,
            cardType: "character",
          }),
          effect: {
            chooser: "CONTROLLER",
            effect: {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            type: "optional",
          } satisfies Effect,
          resolutionInput: {},
        } satisfies PendingActionEffect,
      ];
      setPendingActionChoice(state, "pending:server:1", PLAYER_TWO);
    });

    const result = engine.asServer().enumerateAutomatedActionsForCurrentActor();

    expect(result.actorId).toBe(PLAYER_TWO);
    expect(result.diagnostics[0]).toMatchObject({
      kind: "actor-resolution",
      source: "pending-effect-chooser",
      actorId: PLAYER_TWO,
    });
    expect(result.candidates[0]).toMatchObject({
      family: "resolveEffect",
      effectId: "pending:server:1",
    });
  });

  it("lets the chosen first-player AI take its mulligan action next", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
      },
      {
        deck: 1,
      },
      { skipPreGame: false },
    );

    expect(engine.asPlayerOne().chooseFirstPlayer(PLAYER_TWO).success).toBe(true);

    const result = engine.asServer().takeAutomatedActionForCurrentActor();

    expect(result.actorId).toBe(PLAYER_TWO);
    expect(result.selectedCandidate).toMatchObject({
      family: "alterHand",
    });
    expect(result.finalResult.success).toBe(true);
    expect(engine.asServer().getPendingMulliganPlayers()).toEqual([PLAYER_ONE]);
  });

  it("takes automated actions through the player-one surface", () => {
    const quester = createMockCharacter({
      id: "player-one-quester",
      name: "Player One Quester",
      cost: 2,
      lore: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: quester, isDrying: false }],
      deck: 1,
    });

    const result = engine.asPlayerOne().takeAutomatedAction();

    expect(result.selectedCandidate).toMatchObject({
      family: "quest",
      cardId: engine.asPlayerOne().getCard(quester).id,
    });
    expect(result.finalResult.success).toBe(true);
    expect(engine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
  });

  it("takes automated actions through the player-two surface", () => {
    const quester = createMockCharacter({
      id: "player-two-quester",
      name: "Player Two Quester",
      cost: 2,
      lore: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
      },
      {
        play: [{ card: quester, isDrying: false }],
        deck: 1,
      },
    );

    loadMutatedState(engine, (state) => {
      state.ctx.priority.holder = PLAYER_TWO;
    });

    const result = engine.asPlayerTwo().takeAutomatedAction();

    expect(result.selectedCandidate).toMatchObject({
      family: "quest",
      cardId: engine.asPlayerTwo().getCard(quester).id,
    });
    expect(result.finalResult.success).toBe(true);
    expect(engine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(1);
  });

  it("prefers challenging an exerted high-lore threat when behind on lore", () => {
    const attacker = createMockCharacter({
      id: "challenge-attacker",
      name: "Challenge Attacker",
      cost: 3,
      strength: 3,
      willpower: 3,
      lore: 1,
    });
    const defender = createMockCharacter({
      id: "challenge-defender",
      name: "Challenge Defender",
      cost: 3,
      strength: 2,
      willpower: 2,
      lore: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: attacker, isDrying: false }],
        deck: 1,
        lore: 10,
      },
      {
        play: [{ card: defender, exerted: true, isDrying: false }],
        deck: 1,
        lore: 14,
      },
    );

    loadMutatedState(engine, (state) => {
      state.ctx.priority.holder = PLAYER_ONE;
    });

    const result = engine.asPlayerOne().takeAutomatedAction();

    expect(result.selectedCandidate).toMatchObject({
      family: "challenge",
      attackerId: engine.asPlayerOne().getCard(attacker).id,
      defenderId: engine.asPlayerTwo().getCard(defender).id,
    });
    expect(result.finalResult.success).toBe(true);
  });

  it("still prefers questing when the available quest reaches 20 lore", () => {
    const lethalQuester = createMockCharacter({
      id: "lethal-quester",
      name: "Lethal Quester",
      cost: 3,
      strength: 3,
      willpower: 3,
      lore: 2,
    });
    const defender = createMockCharacter({
      id: "lethal-defense-target",
      name: "Lethal Defense Target",
      cost: 3,
      strength: 2,
      willpower: 2,
      lore: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: lethalQuester, isDrying: false }],
        deck: 1,
        lore: 18,
      },
      {
        play: [{ card: defender, exerted: true, isDrying: false }],
        deck: 1,
        lore: 19,
      },
    );

    loadMutatedState(engine, (state) => {
      state.ctx.priority.holder = PLAYER_ONE;
    });

    const result = engine.asPlayerOne().takeAutomatedAction();

    expect(result.selectedCandidate).toMatchObject({
      family: "quest",
      cardId: engine.asPlayerOne().getCard(lethalQuester).id,
    });
    expect(result.finalResult.success).toBe(true);
    expect(engine.asPlayerOne().getLore(PLAYER_ONE)).toBe(20);
  });

  it("plays a board enabler before questing with a conditionally-buffed character", () => {
    // Models the Piglet (Pooh Pirate Captain) pattern: Piglet has +2 lore
    // while you have 2+ other characters in play. With one other character
    // already in play and a third in hand, the bot should play the enabler
    // first (boosting Piglet from 1 to 3 lore) before questing.
    const piglet = createMockCharacter({
      id: "play-before-quest-piglet",
      name: "Piglet",
      version: "Pooh Pirate Captain",
      cost: 2,
      strength: 2,
      willpower: 2,
      lore: 1,
      abilities: [
        {
          condition: {
            type: "has-character-count",
            comparison: "greater-or-equal",
            controller: "you",
            count: 3,
          },
          effect: {
            modifier: 2,
            stat: "lore",
            target: "SELF",
            type: "modify-stat",
          },
          id: "play-before-quest-piglet-static",
          name: "AND I'M THE CAPTAIN!",
          text: "AND I'M THE CAPTAIN! While you have 2 or more other characters in play, this character gets +2 {L}.",
          type: "static",
        },
      ],
    });
    const enablerInPlay = createMockCharacter({
      id: "play-before-quest-enabler-in-play",
      name: "Enabler In Play",
      cost: 1,
      strength: 1,
      willpower: 2,
      lore: 1,
    });
    const enablerInHand = createMockCharacter({
      id: "play-before-quest-enabler-in-hand",
      name: "Enabler In Hand",
      cost: 2,
      strength: 1,
      willpower: 2,
      lore: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: piglet, isDrying: false },
        { card: enablerInPlay, isDrying: false },
      ],
      hand: [enablerInHand],
      inkwell: 2,
      deck: 1,
    });

    const result = engine.asPlayerOne().takeAutomatedAction({
      strategy: deckAwareLoreRaceAutomatedActionStrategy,
    });

    expect(result.selectedCandidate).toMatchObject({
      family: "playCard",
      cardId: engine.asPlayerOne().getCard(enablerInHand).id,
    });
    expect(result.finalResult.success).toBe(true);
  });

  it("lets quest-only-test pick a quest when quest, challenge, and play are all legal", () => {
    const quester = createMockCharacter({
      id: "quest-only-quester",
      name: "Quest Only Quester",
      cost: 3,
      strength: 3,
      willpower: 3,
      lore: 2,
    });
    const playable = createMockCharacter({
      id: "quest-only-playable",
      name: "Quest Only Playable",
      cost: 2,
      lore: 1,
    });
    const defender = createMockCharacter({
      id: "quest-only-defender",
      name: "Quest Only Defender",
      cost: 2,
      strength: 1,
      willpower: 1,
      lore: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: quester, isDrying: false }],
        hand: [playable],
        inkwell: 2,
        deck: 1,
      },
      {
        play: [{ card: defender, exerted: true, isDrying: false }],
        deck: 1,
      },
    );
    const traces: AutomatedActionDecisionTrace[] = [];

    loadMutatedState(engine, (state) => {
      state.ctx.priority.holder = PLAYER_ONE;
    });

    const result = engine.asPlayerOne().takeAutomatedAction({
      strategy: questOnlyTestAutomatedActionStrategy,
      traceSink: {
        push(trace) {
          traces.push(trace);
        },
      },
    });

    expect(result.selectedCandidate).toMatchObject({
      family: "quest",
      cardId: engine.asPlayerOne().getCard(quester).id,
    });
    expect(result.finalResult.success).toBe(true);

    const executionTrace = getExecutionTrace(traces);
    expect(getSelectedHeuristicValue(executionTrace, "forcedFamilyMode")).toBe("quest-only-test");
    expect(getSelectedHeuristicValue(executionTrace, "forcedFamilyMatched")).toBe(true);
    expect(getSelectedHeuristicValue(executionTrace, "forcedFamilyFallbackUsed")).toBe(false);
  });

  it("lets challenge-only-test pick a challenge when quest, challenge, and play are all legal", () => {
    const challenger = createMockCharacter({
      id: "challenge-only-attacker",
      name: "Challenge Only Attacker",
      cost: 3,
      strength: 3,
      willpower: 3,
      lore: 2,
    });
    const playable = createMockCharacter({
      id: "challenge-only-playable",
      name: "Challenge Only Playable",
      cost: 2,
      lore: 1,
    });
    const defender = createMockCharacter({
      id: "challenge-only-defender",
      name: "Challenge Only Defender",
      cost: 2,
      strength: 1,
      willpower: 1,
      lore: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: challenger, isDrying: false }],
        hand: [playable],
        inkwell: 2,
        deck: 1,
      },
      {
        play: [{ card: defender, exerted: true, isDrying: false }],
        deck: 1,
      },
    );
    const traces: AutomatedActionDecisionTrace[] = [];

    loadMutatedState(engine, (state) => {
      state.ctx.priority.holder = PLAYER_ONE;
    });

    const result = engine.asPlayerOne().takeAutomatedAction({
      strategy: challengeOnlyTestAutomatedActionStrategy,
      traceSink: {
        push(trace) {
          traces.push(trace);
        },
      },
    });

    expect(result.selectedCandidate).toMatchObject({
      family: "challenge",
      attackerId: engine.asPlayerOne().getCard(challenger).id,
      defenderId: engine.asPlayerTwo().getCard(defender).id,
    });
    expect(result.finalResult.success).toBe(true);

    const executionTrace = getExecutionTrace(traces);
    expect(getSelectedHeuristicValue(executionTrace, "forcedFamilyMode")).toBe(
      "challenge-only-test",
    );
    expect(getSelectedHeuristicValue(executionTrace, "forcedFamilyMatched")).toBe(true);
    expect(getSelectedHeuristicValue(executionTrace, "forcedFamilyFallbackUsed")).toBe(false);
  });

  it("lets quest-only-test resolve targeted prompts with the shared target-selection logic", () => {
    const { engine, threatTargetId } = createForcedFamilyTargetSelectionEngine();
    const baselineState = structuredClone(engine.asServer().getState()) as LorcanaMatchState;

    const deckAwareResult = engine.asPlayerOne().takeAutomatedAction({
      strategy: deckAwareLoreRaceAutomatedActionStrategy,
    });

    expect(deckAwareResult.selectedCandidate).toEqual({
      family: "resolveEffect",
      effectId: "pending:forced-family:target:1",
      targets: [threatTargetId],
    });

    engine.loadState(baselineState);

    const result = engine.asPlayerOne().takeAutomatedAction({
      strategy: questOnlyTestAutomatedActionStrategy,
    });

    expect(result.selectedCandidate).toEqual(deckAwareResult.selectedCandidate);
    expect(result.finalResult.success).toBe(true);
    expect(engine.asServer().getState().G.pendingEffects).toHaveLength(0);
  });

  it("lets challenge-only-test resolve targeted prompts with the shared target-selection logic", () => {
    const { engine, threatTargetId } = createForcedFamilyTargetSelectionEngine();
    const baselineState = structuredClone(engine.asServer().getState()) as LorcanaMatchState;

    const deckAwareResult = engine.asPlayerOne().takeAutomatedAction({
      strategy: deckAwareLoreRaceAutomatedActionStrategy,
    });

    expect(deckAwareResult.selectedCandidate).toEqual({
      family: "resolveEffect",
      effectId: "pending:forced-family:target:1",
      targets: [threatTargetId],
    });

    engine.loadState(baselineState);

    const result = engine.asPlayerOne().takeAutomatedAction({
      strategy: challengeOnlyTestAutomatedActionStrategy,
    });

    expect(result.selectedCandidate).toEqual(deckAwareResult.selectedCandidate);
    expect(result.finalResult.success).toBe(true);
    expect(engine.asServer().getState().G.pendingEffects).toHaveLength(0);
  });

  it("lets quest-only-test fall back to deck-aware ordering when no quest candidate exists", () => {
    const playable = createMockCharacter({
      id: "quest-only-fallback-playable",
      name: "Quest Only Fallback Playable",
      cost: 2,
      lore: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [playable],
      inkwell: 2,
      deck: 1,
    });
    const baselineState = structuredClone(engine.asServer().getState()) as LorcanaMatchState;

    const deckAwareResult = engine.asPlayerOne().takeAutomatedAction({
      strategy: deckAwareLoreRaceAutomatedActionStrategy,
    });

    engine.loadState(baselineState);

    const traces: AutomatedActionDecisionTrace[] = [];
    const result = engine.asPlayerOne().takeAutomatedAction({
      strategy: questOnlyTestAutomatedActionStrategy,
      traceSink: {
        push(trace) {
          traces.push(trace);
        },
      },
    });

    expect(result.selectedCandidate).toEqual(deckAwareResult.selectedCandidate);
    expect(result.finalResult.success).toBe(true);

    const executionTrace = getExecutionTrace(traces);
    expect(getSelectedHeuristicValue(executionTrace, "forcedFamilyMode")).toBe("quest-only-test");
    expect(getSelectedHeuristicValue(executionTrace, "forcedFamilyMatched")).toBe(false);
    expect(getSelectedHeuristicValue(executionTrace, "forcedFamilyFallbackUsed")).toBe(true);
  });

  it("lets challenge-only-test fall back to deck-aware ordering when no challenge candidate exists", () => {
    const quester = createMockCharacter({
      id: "challenge-only-fallback-quester",
      name: "Challenge Only Fallback Quester",
      cost: 3,
      strength: 3,
      willpower: 3,
      lore: 2,
    });
    const playable = createMockCharacter({
      id: "challenge-only-fallback-playable",
      name: "Challenge Only Fallback Playable",
      cost: 2,
      lore: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: quester, isDrying: false }],
      hand: [playable],
      inkwell: 2,
      deck: 1,
    });
    const baselineState = structuredClone(engine.asServer().getState()) as LorcanaMatchState;

    const deckAwareResult = engine.asPlayerOne().takeAutomatedAction({
      strategy: deckAwareLoreRaceAutomatedActionStrategy,
    });

    engine.loadState(baselineState);

    const traces: AutomatedActionDecisionTrace[] = [];
    const result = engine.asPlayerOne().takeAutomatedAction({
      strategy: challengeOnlyTestAutomatedActionStrategy,
      traceSink: {
        push(trace) {
          traces.push(trace);
        },
      },
    });

    expect(result.selectedCandidate).toEqual(deckAwareResult.selectedCandidate);
    expect(result.finalResult.success).toBe(true);

    const executionTrace = getExecutionTrace(traces);
    expect(getSelectedHeuristicValue(executionTrace, "forcedFamilyMode")).toBe(
      "challenge-only-test",
    );
    expect(getSelectedHeuristicValue(executionTrace, "forcedFamilyMatched")).toBe(false);
    expect(getSelectedHeuristicValue(executionTrace, "forcedFamilyFallbackUsed")).toBe(true);
  });

  it("lets board-control-lore-race challenge a lore threat before taking a smaller quest", () => {
    const quester = createMockCharacter({
      id: "board-control-quester",
      name: "Board Control Quester",
      cost: 2,
      strength: 2,
      willpower: 2,
      lore: 1,
    });
    const challenger = createMockCharacter({
      id: "board-control-challenger",
      name: "Board Control Challenger",
      cost: 3,
      strength: 3,
      willpower: 3,
      lore: 0,
    });
    const defender = createMockCharacter({
      id: "board-control-defender",
      name: "Board Control Defender",
      cost: 3,
      strength: 1,
      willpower: 1,
      lore: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: quester, isDrying: false },
          { card: challenger, isDrying: false },
        ],
        deck: 1,
        lore: 8,
      },
      {
        play: [{ card: defender, exerted: true, isDrying: false }],
        deck: 1,
        lore: 8,
      },
    );

    loadMutatedState(engine, (state) => {
      state.ctx.priority.holder = PLAYER_ONE;
    });

    const boardControlResult = engine.asPlayerOne().takeAutomatedAction({
      strategy: boardControlLoreRaceAutomatedActionStrategy,
    });

    expect(boardControlResult.selectedCandidate).toMatchObject({
      family: "challenge",
      attackerId: engine.asPlayerOne().getCard(challenger).id,
      defenderId: engine.asPlayerTwo().getCard(defender).id,
    });
    expect(boardControlResult.finalResult.success).toBe(true);
  });

  it("lets board-control-lore-race play playable cards before inking", () => {
    const efficientPermanent = createMockCharacter({
      id: "board-control-efficient-permanent",
      name: "Board Control Permanent",
      cost: 2,
      strength: 2,
      willpower: 2,
      lore: 1,
    });
    const expensiveInkCard = createMockCharacter({
      id: "board-control-expensive-ink-card",
      name: "Board Control Expensive Ink Card",
      cost: 6,
      strength: 3,
      willpower: 5,
      lore: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [efficientPermanent, expensiveInkCard],
      inkwell: 2,
      deck: 1,
    });

    const playResult = engine.asPlayerOne().takeAutomatedAction({
      strategy: boardControlLoreRaceAutomatedActionStrategy,
    });

    expect(playResult.selectedCandidate).toMatchObject({
      family: "playCard",
      cardId: engine.asPlayerOne().getCard(efficientPermanent).id,
    });
    expect(playResult.finalResult.success).toBe(true);

    const inkResult = engine.asPlayerOne().takeAutomatedAction({
      strategy: boardControlLoreRaceAutomatedActionStrategy,
    });

    expect(inkResult.selectedCandidate).toMatchObject({
      family: "putCardIntoInkwell",
      cardId: engine.asPlayerOne().getCard(expensiveInkCard).id,
    });
    expect(inkResult.finalResult.success).toBe(true);
  });

  it("lets aggressive board-control challenge for a clear value trade before questing", () => {
    const quester = createMockCharacter({
      id: "agg-value-trade-quester",
      name: "Agg Value Trade Quester",
      cost: 2,
      strength: 2,
      willpower: 2,
      lore: 2,
    });
    const attacker = createMockCharacter({
      id: "agg-value-trade-attacker",
      name: "Agg Value Trade Attacker",
      cost: 2,
      strength: 3,
      willpower: 4,
      lore: 0,
    });
    const defender = createMockCharacter({
      id: "agg-value-trade-defender",
      name: "Agg Value Trade Defender",
      cost: 5,
      strength: 2,
      willpower: 3,
      lore: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: quester, isDrying: false },
          { card: attacker, isDrying: false },
        ],
        deck: 1,
        lore: 8,
      },
      {
        play: [{ card: defender, exerted: true, isDrying: false }],
        deck: 1,
        lore: 9,
      },
    );

    const result = engine.asPlayerOne().takeAutomatedAction({
      strategy: aggressiveBoardControlLoreRaceAutomatedActionStrategy,
    });

    expect(result.selectedCandidate).toMatchObject({
      family: "challenge",
      attackerId: engine.asPlayerOne().getCard(attacker).id,
      defenderId: engine.asPlayerTwo().getCard(defender).id,
    });
    expect(result.finalResult.success).toBe(true);
  });

  it("lets aggressive board-control take a mutual-banish trade into a higher-value threat", () => {
    const quester = createMockCharacter({
      id: "agg-mutual-trade-quester",
      name: "Agg Mutual Trade Quester",
      cost: 2,
      strength: 2,
      willpower: 2,
      lore: 2,
    });
    const attacker = createMockCharacter({
      id: "agg-mutual-trade-attacker",
      name: "Agg Mutual Trade Attacker",
      cost: 2,
      strength: 3,
      willpower: 3,
      lore: 0,
    });
    const defender = createMockCharacter({
      id: "agg-mutual-trade-defender",
      name: "Agg Mutual Trade Defender",
      cost: 6,
      strength: 3,
      willpower: 3,
      lore: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: quester, isDrying: false },
          { card: attacker, isDrying: false },
        ],
        deck: 1,
        lore: 10,
      },
      {
        play: [{ card: defender, exerted: true, isDrying: false }],
        deck: 1,
        lore: 10,
      },
    );

    const result = engine.asPlayerOne().takeAutomatedAction({
      strategy: aggressiveBoardControlLoreRaceAutomatedActionStrategy,
    });

    expect(result.selectedCandidate).toMatchObject({
      family: "challenge",
      attackerId: engine.asPlayerOne().getCard(attacker).id,
      defenderId: engine.asPlayerTwo().getCard(defender).id,
    });
    expect(result.finalResult.success).toBe(true);
    expect(engine.asPlayerOne().getCardZone(attacker)).toBe("discard");
    expect(engine.asPlayerTwo().getCardZone(defender)).toBe("discard");
  });

  it("does not let aggressive board-control challenge away an immediate lore win", () => {
    const winningQuester = createMockCharacter({
      id: "agg-winning-quester",
      name: "Agg Winning Quester",
      cost: 2,
      strength: 2,
      willpower: 2,
      lore: 1,
    });
    const attacker = createMockCharacter({
      id: "agg-winning-attacker",
      name: "Agg Winning Attacker",
      cost: 2,
      strength: 3,
      willpower: 3,
      lore: 0,
    });
    const defender = createMockCharacter({
      id: "agg-winning-defender",
      name: "Agg Winning Defender",
      cost: 6,
      strength: 3,
      willpower: 3,
      lore: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: winningQuester, isDrying: false },
          { card: attacker, isDrying: false },
        ],
        deck: 1,
        lore: 19,
      },
      {
        play: [{ card: defender, exerted: true, isDrying: false }],
        deck: 1,
        lore: 12,
      },
    );

    const result = engine.asPlayerOne().takeAutomatedAction({
      strategy: aggressiveBoardControlLoreRaceAutomatedActionStrategy,
    });

    expect(result.selectedCandidate).toMatchObject({
      family: "quest",
      cardId: engine.asPlayerOne().getCard(winningQuester).id,
    });
    expect(result.finalResult.success).toBe(true);
    expect(engine.asServer().getWinner()).toBe(PLAYER_ONE);
  });

  it("lets deck-aware-lore-race take a partial mulligan on a clunky but technically keepable opener", () => {
    const keeperOne = createMockCharacter({
      id: "deck-aware-mulligan-keeper-one",
      name: "Deck-Aware Mulligan Keeper One",
      cost: 1,
      inkType: ["sapphire"],
    });
    const keeperTwo = createMockCharacter({
      id: "deck-aware-mulligan-keeper-two",
      name: "Deck-Aware Mulligan Keeper Two",
      cost: 2,
      inkType: ["steel"],
    });
    const bombOne = createMockCharacter({
      id: "deck-aware-mulligan-bomb-one",
      name: "Deck-Aware Mulligan Bomb One",
      cost: 6,
      inkType: ["steel"],
    });
    const bombTwo = createMockCharacter({
      id: "deck-aware-mulligan-bomb-two",
      name: "Deck-Aware Mulligan Bomb Two",
      cost: 6,
      inkType: ["sapphire"],
    });
    const bombThree = createMockCharacter({
      id: "deck-aware-mulligan-bomb-three",
      name: "Deck-Aware Mulligan Bomb Three",
      cost: 7,
      inkType: ["steel"],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [keeperOne, keeperTwo, bombOne, bombTwo, bombThree],
        deck: [keeperOne, keeperTwo, bombOne, bombTwo, bombThree],
      },
      {
        deck: [keeperOne, keeperTwo, bombOne, bombTwo, bombThree],
      },
      { skipPreGame: false },
    );

    loadMutatedState(engine, (state) => {
      state.ctx.status.choosingFirstPlayer = undefined;
      state.ctx.status.pendingMulligan = [PLAYER_ONE, PLAYER_TWO];
      state.ctx.status.phase = "alterHand";
      state.ctx.status.step = "";
    });

    const baselineState = structuredClone(engine.asServer().getState()) as LorcanaMatchState;
    const defaultResult = engine.asPlayerOne().takeAutomatedAction();

    expect(defaultResult.selectedCandidate).toMatchObject({
      family: "alterHand",
      plan: "structural-mulligan",
    });

    engine.loadState(baselineState);

    const result = engine.asPlayerOne().takeAutomatedAction({
      strategy: deckAwareLoreRaceAutomatedActionStrategy,
    });

    expect(result.selectedCandidate).toMatchObject({
      family: "alterHand",
      plan: "structural-mulligan",
    });
    if (result.selectedCandidate?.family !== "alterHand") {
      throw new Error("Expected deck-aware strategy to select an alterHand candidate.");
    }

    const mulliganDefinitionIds = result.selectedCandidate.cardsToMulligan
      .map((cardId) => getDefinitionByInstanceId(engine, cardId)?.id)
      .filter((definitionId): definitionId is string => Boolean(definitionId));

    expect(mulliganDefinitionIds).toHaveLength(3);
    expect(mulliganDefinitionIds).toContain(bombOne.id);
    expect(mulliganDefinitionIds).toContain(bombTwo.id);
    expect(mulliganDefinitionIds).toContain(bombThree.id);
  });

  it("changes sapphire-steel mulligan priorities based on the opposing color pair", () => {
    const rampScout = createMockCharacter({
      id: "gPY",
      name: "Matchup Ramp Scout",
      cost: 1,
      inkType: ["sapphire"],
      abilities: [
        {
          id: "matchup-ramp-scout-ramp",
          name: "RAMP",
          type: "activated",
          cost: {},
          effect: { type: "additional-inkwell" },
          text: "RAMP - Put an additional card into your inkwell.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const drawEngine = createMockCharacter({
      id: "0RS",
      name: "Matchup Draw Engine",
      cost: 5,
      inkType: ["steel"],
      abilities: [
        {
          id: "matchup-draw-engine-draw",
          name: "DRAW",
          type: "activated",
          cost: {},
          effect: { amount: 1, target: "CONTROLLER", type: "draw" },
          text: "DRAW - Draw a card.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const earlySupport = createMockCharacter({
      id: "matchup-early-support",
      name: "Matchup Early Support",
      cost: 2,
      inkType: ["steel"],
    });
    const lateFinisher = createMockCharacter({
      id: "matchup-mid-support",
      name: "Matchup Mid Support",
      cost: 4,
      inkType: ["sapphire"],
    });
    const mirrorSupport = createMockCharacter({
      id: "matchup-mirror-support",
      name: "Matchup Mirror Support",
      cost: 2,
      inkType: ["steel"],
    });
    const aggressiveAmber = createMockCharacter({
      id: "matchup-amber-opener",
      name: "Matchup Amber Opener",
      cost: 1,
      inkType: ["amber"],
    });

    function createOpeningMulliganEngine(opponentDeck: LorcanaCardDefinition[]) {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rampScout, drawEngine, earlySupport, lateFinisher],
          deck: [rampScout, drawEngine, earlySupport, lateFinisher, mirrorSupport],
        },
        {
          deck: opponentDeck,
        },
        { skipPreGame: false },
      );

      loadMutatedState(engine, (state) => {
        state.ctx.status.choosingFirstPlayer = undefined;
        state.ctx.status.pendingMulligan = [PLAYER_ONE, PLAYER_TWO];
        state.ctx.status.phase = "alterHand";
        state.ctx.status.step = "";
      });

      return engine;
    }

    const mirrorEngine = createOpeningMulliganEngine([
      rampScout,
      mirrorSupport,
      drawEngine,
      earlySupport,
    ]);
    const mirrorTraces: AutomatedActionDecisionTrace[] = [];
    const mirrorResult = mirrorEngine.asPlayerOne().takeAutomatedAction({
      strategy: deckAwareLoreRaceAutomatedActionStrategy,
      traceSink: {
        push(trace) {
          mirrorTraces.push(trace);
        },
      },
    });

    expect(mirrorResult.selectedCandidate).toMatchObject({
      family: "alterHand",
      cardsToMulligan: [],
      plan: "keep-all",
    });

    const aggressiveEngine = createOpeningMulliganEngine([
      aggressiveAmber,
      earlySupport,
      drawEngine,
      mirrorSupport,
    ]);
    const aggressiveTraces: AutomatedActionDecisionTrace[] = [];
    const aggressiveResult = aggressiveEngine.asPlayerOne().takeAutomatedAction({
      strategy: deckAwareLoreRaceAutomatedActionStrategy,
      traceSink: {
        push(trace) {
          aggressiveTraces.push(trace);
        },
      },
    });

    expect(aggressiveResult.selectedCandidate).toMatchObject({
      family: "alterHand",
      plan: "structural-mulligan",
    });

    const mirrorExecutionTrace = getExecutionTrace(mirrorTraces);
    const aggressiveExecutionTrace = getExecutionTrace(aggressiveTraces);

    expect(getSelectedHeuristicValue(mirrorExecutionTrace, "profileName")).toBe("sapphire-steel");
    expect(getSelectedHeuristicValue(mirrorExecutionTrace, "matchupPair")).toBe(
      "sapphire-steel__vs__sapphire-steel",
    );
    expect(getSelectedHeuristicValue(aggressiveExecutionTrace, "matchupPair")).toBe(
      "sapphire-steel__vs__amber-steel",
    );
    expect(
      getSelectedHeuristicValue(mirrorExecutionTrace, "matchupCardAdjustment"),
    ).toBeGreaterThan(0);
    expect(getSelectedHeuristicValue(aggressiveExecutionTrace, "matchupCardAdjustment")).toBe(0);
  });

  it("lets deck-aware-lore-race protect ramp and draw engines when choosing ink", () => {
    const rampScout = createMockCharacter({
      id: "deck-aware-ramp-scout",
      name: "Deck-Aware Ramp Scout",
      cost: 1,
      inkType: ["sapphire"],
      abilities: [
        {
          id: "deck-aware-ramp-scout-ramp",
          name: "RAMP",
          type: "activated",
          cost: {},
          effect: { type: "additional-inkwell" },
          text: "RAMP - Put an additional card into your inkwell.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const drawEngine = createMockCharacter({
      id: "deck-aware-draw-engine",
      name: "Deck-Aware Draw Engine",
      cost: 3,
      inkType: ["steel"],
      abilities: [
        {
          id: "deck-aware-draw-engine-draw",
          name: "DRAW",
          type: "activated",
          cost: {},
          effect: { amount: 1, target: "CONTROLLER", type: "draw" },
          text: "DRAW - Draw a card.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const lateFinisher = createMockCharacter({
      id: "deck-aware-late-finisher",
      name: "Deck-Aware Late Finisher",
      cost: 6,
      lore: 2,
      inkType: ["steel"],
    });
    const support = createMockCharacter({
      id: "deck-aware-support",
      name: "Deck-Aware Support",
      cost: 2,
      inkType: ["sapphire"],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [rampScout, drawEngine, lateFinisher],
        deck: [rampScout, drawEngine, lateFinisher, support, support],
      },
      {
        deck: [support, support, lateFinisher, drawEngine],
      },
    );

    const baselineState = structuredClone(engine.asServer().getState()) as LorcanaMatchState;
    const defaultResult = engine.asPlayerOne().takeAutomatedAction();

    expect(defaultResult.selectedCandidate).toMatchObject({
      family: "putCardIntoInkwell",
      cardId: engine.asPlayerOne().getCard(lateFinisher).id,
    });

    engine.loadState(baselineState);

    const traces: AutomatedActionDecisionTrace[] = [];
    const result = engine.asPlayerOne().takeAutomatedAction({
      strategy: deckAwareLoreRaceAutomatedActionStrategy,
      traceSink: {
        push(trace) {
          traces.push(trace);
        },
      },
    });

    expect(result.selectedCandidate).toMatchObject({
      family: "putCardIntoInkwell",
      cardId: engine.asPlayerOne().getCard(lateFinisher).id,
    });

    const executionTrace = traces.find((trace) => trace.kind === "execution");
    const heuristicKeys =
      executionTrace?.selectedCandidate?.heuristics.map((heuristic) => heuristic.key) ?? [];
    const profileHeuristic = executionTrace?.selectedCandidate?.heuristics.find(
      (heuristic) => heuristic.key === "profileName",
    );
    const matchupHeuristic = executionTrace?.selectedCandidate?.heuristics.find(
      (heuristic) => heuristic.key === "matchupPair",
    );
    const turnBucketHeuristic = executionTrace?.selectedCandidate?.heuristics.find(
      (heuristic) => heuristic.key === "turnBucket",
    );
    const topWeightHeuristic = executionTrace?.selectedCandidate?.heuristics.find(
      (heuristic) => heuristic.key === "topWeightContributors",
    );

    expect(heuristicKeys).toEqual(
      expect.arrayContaining([
        "profileName",
        "matchupPair",
        "turnBucket",
        "deckAwareTotalScore",
        "matchupCardAdjustment",
        "openingInkablesDelta",
        "openingEarlyPlayDelta",
        "openingLateCardDelta",
        "openingUninkableDelta",
        "openingTwoDropDelta",
        "topWeightContributors",
      ]),
    );
    expect(profileHeuristic?.value).toBe("sapphire-steel");
    expect(matchupHeuristic?.value).toBe("sapphire-steel__vs__sapphire-steel");
    expect(turnBucketHeuristic?.value).toBe("opening");
    expect(topWeightHeuristic?.value).toContain("inkAvoid");
  });

  it("plays affordable cards before inking unplayable ones", () => {
    const cheapPlayable = createMockCharacter({
      id: "ink-order-cheap-playable",
      name: "Ink Order Cheap Playable",
      cost: 3,
      strength: 2,
      willpower: 2,
      lore: 1,
    });
    const expensivePlayable = createMockCharacter({
      id: "ink-order-expensive-playable",
      name: "Ink Order Expensive Playable",
      cost: 4,
      strength: 3,
      willpower: 3,
      lore: 2,
    });
    const inkFodder = createMockCharacter({
      id: "ink-order-ink-fodder",
      name: "Ink Order Ink Fodder",
      cost: 7,
      strength: 4,
      willpower: 5,
      lore: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cheapPlayable, expensivePlayable, inkFodder],
      inkwell: 3,
      deck: 1,
    });

    // Play-before-ink ordering: play the affordable card first, then ink the unplayable one
    const playResult = engine.asPlayerOne().takeAutomatedAction();

    expect(playResult.selectedCandidate).toMatchObject({
      family: "playCard",
      cardId: engine.asPlayerOne().getCard(cheapPlayable).id,
    });
    expect(playResult.finalResult.success).toBe(true);

    const inkResult = engine.asPlayerOne().takeAutomatedAction();

    expect(inkResult.selectedCandidate).toMatchObject({
      family: "putCardIntoInkwell",
      cardId: engine.asPlayerOne().getCard(inkFodder).id,
    });
    expect(inkResult.finalResult.success).toBe(true);
  });

  it("plays playable cards and inks unplayable ones", () => {
    const playable = createMockCharacter({
      id: "ink-unplayable-two-drop",
      name: "Ink Unplayable Two Drop",
      cost: 2,
      strength: 2,
      willpower: 2,
      lore: 1,
    });
    const unplayable = createMockCharacter({
      id: "ink-unplayable-expensive",
      name: "Ink Unplayable Expensive Card",
      cost: 6,
      strength: 3,
      willpower: 5,
      lore: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [playable, unplayable],
      inkwell: 2,
      deck: 1,
    });

    // Play-before-ink: play the affordable card first, then ink the unplayable one
    const playResult = engine.asPlayerOne().takeAutomatedAction();

    expect(playResult.selectedCandidate).toMatchObject({
      family: "playCard",
      cardId: engine.asPlayerOne().getCard(playable).id,
    });
    expect(playResult.finalResult.success).toBe(true);

    const inkResult = engine.asPlayerOne().takeAutomatedAction();

    expect(inkResult.selectedCandidate).toMatchObject({
      family: "putCardIntoInkwell",
      cardId: engine.asPlayerOne().getCard(unplayable).id,
    });
    expect(inkResult.finalResult.success).toBe(true);
  });

  it("changes sapphire-steel opening ink choices based on the opposing color pair", () => {
    const rampScout = createMockCharacter({
      id: "gPY",
      name: "Matchup Ink Ramp Scout",
      cost: 1,
      inkType: ["sapphire"],
      abilities: [
        {
          id: "matchup-ink-ramp-scout-ramp",
          name: "RAMP",
          type: "activated",
          cost: {},
          effect: { type: "additional-inkwell" },
          text: "RAMP - Put an additional card into your inkwell.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const drawEngine = createMockCharacter({
      id: "0RS",
      name: "Matchup Ink Draw Engine",
      cost: 5,
      inkType: ["steel"],
      abilities: [
        {
          id: "matchup-ink-draw-engine-draw",
          name: "DRAW",
          type: "activated",
          cost: {},
          effect: { amount: 1, target: "CONTROLLER", type: "draw" },
          text: "DRAW - Draw a card.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const supportTwoDrop = createMockCharacter({
      id: "matchup-ink-two-drop",
      name: "Matchup Ink Two Drop",
      cost: 2,
      inkType: ["steel"],
    });
    const aggressiveAmber = createMockCharacter({
      id: "matchup-ink-amber-opener",
      name: "Matchup Ink Amber Opener",
      cost: 1,
      inkType: ["amber"],
    });

    function createOpeningInkEngine(opponentDeck: LorcanaCardDefinition[]) {
      return LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rampScout, supportTwoDrop, drawEngine],
          deck: [rampScout, supportTwoDrop, drawEngine, supportTwoDrop],
        },
        {
          deck: opponentDeck,
        },
      );
    }

    const mirrorEngine = createOpeningInkEngine([rampScout, supportTwoDrop, drawEngine]);
    const mirrorTraces: AutomatedActionDecisionTrace[] = [];
    const mirrorResult = mirrorEngine.asPlayerOne().takeAutomatedAction({
      strategy: deckAwareLoreRaceAutomatedActionStrategy,
      traceSink: {
        push(trace) {
          mirrorTraces.push(trace);
        },
      },
    });

    expect(mirrorResult.selectedCandidate).toMatchObject({
      family: "putCardIntoInkwell",
      cardId: mirrorEngine.asPlayerOne().getCard(supportTwoDrop).id,
    });

    const aggressiveEngine = createOpeningInkEngine([aggressiveAmber, supportTwoDrop, drawEngine]);
    const aggressiveTraces: AutomatedActionDecisionTrace[] = [];
    const aggressiveResult = aggressiveEngine.asPlayerOne().takeAutomatedAction({
      strategy: deckAwareLoreRaceAutomatedActionStrategy,
      traceSink: {
        push(trace) {
          aggressiveTraces.push(trace);
        },
      },
    });

    expect(aggressiveResult.selectedCandidate).toMatchObject({
      family: "putCardIntoInkwell",
      cardId: aggressiveEngine.asPlayerOne().getCard(drawEngine).id,
    });

    const mirrorExecutionTrace = getExecutionTrace(mirrorTraces);
    const aggressiveExecutionTrace = getExecutionTrace(aggressiveTraces);

    expect(getSelectedHeuristicValue(mirrorExecutionTrace, "matchupPair")).toBe(
      "sapphire-steel__vs__sapphire-steel",
    );
    expect(getSelectedHeuristicValue(aggressiveExecutionTrace, "matchupPair")).toBe(
      "sapphire-steel__vs__amber-steel",
    );
    expect(getSelectedHeuristicValue(mirrorExecutionTrace, "openingEarlyPlayDelta")).toBe(0);
    expect(getSelectedHeuristicValue(aggressiveExecutionTrace, "openingEarlyPlayDelta")).toBe(0);
    expect(getSelectedHeuristicValue(mirrorExecutionTrace, "openingTwoDropDelta")).toBe(-1);
    expect(getSelectedHeuristicValue(aggressiveExecutionTrace, "openingTwoDropDelta")).toBe(0);
  });

  it("lets opening family bias favor inking before low-impact development into amber-steel", () => {
    const lowImpactPlay = createMockCharacter({
      id: "matchup-opening-low-impact",
      name: "Matchup Opening Low Impact",
      cost: 1,
      inkType: ["sapphire"],
    });
    const lateFinisher = createMockCharacter({
      id: "matchup-opening-expensive-finisher",
      name: "Matchup Opening Expensive Finisher",
      cost: 6,
      lore: 2,
      inkType: ["steel"],
    });
    const steelSupport = createMockCharacter({
      id: "matchup-opening-steel-support",
      name: "Matchup Opening Steel Support",
      cost: 2,
      inkType: ["steel"],
    });
    const aggressiveAmber = createMockCharacter({
      id: "matchup-opening-amber-opener",
      name: "Matchup Opening Amber Opener",
      cost: 1,
      inkType: ["amber"],
    });

    function createSequencingEngine(opponentDeck: LorcanaCardDefinition[]) {
      return LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [lowImpactPlay, lateFinisher],
          inkwell: 2,
          deck: [lowImpactPlay, steelSupport, lateFinisher],
        },
        {
          deck: opponentDeck,
        },
      );
    }

    const mirrorEngine = createSequencingEngine([lowImpactPlay, steelSupport, lateFinisher]);
    const mirrorTraces: AutomatedActionDecisionTrace[] = [];
    const mirrorResult = mirrorEngine.asPlayerOne().takeAutomatedAction({
      strategy: deckAwareLoreRaceAutomatedActionStrategy,
      traceSink: {
        push(trace) {
          mirrorTraces.push(trace);
        },
      },
    });

    expect(mirrorResult.selectedCandidate).toMatchObject({
      family: "playCard",
      cardId: mirrorEngine.asPlayerOne().getCard(lowImpactPlay).id,
    });

    const aggressiveEngine = createSequencingEngine([aggressiveAmber, steelSupport, lateFinisher]);
    const aggressiveTraces: AutomatedActionDecisionTrace[] = [];
    const aggressiveResult = aggressiveEngine.asPlayerOne().takeAutomatedAction({
      strategy: deckAwareLoreRaceAutomatedActionStrategy,
      traceSink: {
        push(trace) {
          aggressiveTraces.push(trace);
        },
      },
    });

    expect(aggressiveResult.selectedCandidate).toMatchObject({
      family: "putCardIntoInkwell",
      cardId: aggressiveEngine.asPlayerOne().getCard(lateFinisher).id,
    });

    const mirrorExecutionTrace = getExecutionTrace(mirrorTraces);
    const aggressiveExecutionTrace = getExecutionTrace(aggressiveTraces);

    expect(getSelectedHeuristicValue(mirrorExecutionTrace, "matchupPair")).toBe(
      "sapphire-steel__vs__sapphire-steel",
    );
    expect(getSelectedHeuristicValue(aggressiveExecutionTrace, "matchupPair")).toBe(
      "sapphire-steel__vs__amber-steel",
    );
    expect(getSelectedHeuristicValue(mirrorExecutionTrace, "openingFamilyBias")).toBe(2);
    expect(getSelectedHeuristicValue(aggressiveExecutionTrace, "openingFamilyBias")).toBe(1);
  });

  it("lets matchup-specific mulligan adjustments keep mirror engines that structural heuristics would otherwise toss", () => {
    const rampScout = createMockCharacter({
      id: "gPY",
      name: "Mirror Mulligan Ramp Scout",
      cost: 1,
      inkType: ["sapphire"],
      abilities: [
        {
          id: "mirror-mulligan-ramp-scout-ramp",
          name: "RAMP",
          type: "activated",
          cost: {},
          effect: { type: "additional-inkwell" },
          text: "RAMP - Put an additional card into your inkwell.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const drawEngine = createMockCharacter({
      id: "0RS",
      name: "Mirror Mulligan Draw Engine",
      cost: 5,
      inkType: ["steel"],
      abilities: [
        {
          id: "mirror-mulligan-draw-engine-draw",
          name: "DRAW",
          type: "activated",
          cost: {},
          effect: { amount: 1, target: "CONTROLLER", type: "draw" },
          text: "DRAW - Draw a card.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const earlySupport = createMockCharacter({
      id: "mirror-mulligan-early-support",
      name: "Mirror Mulligan Early Support",
      cost: 2,
      inkType: ["steel"],
    });
    const lateFinisher = createMockCharacter({
      id: "mirror-mulligan-mid-support",
      name: "Mirror Mulligan Mid Support",
      cost: 4,
      inkType: ["sapphire"],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [rampScout, drawEngine, earlySupport, lateFinisher],
        deck: [rampScout, drawEngine, earlySupport, lateFinisher],
      },
      {
        deck: [rampScout, drawEngine, earlySupport, lateFinisher],
      },
      { skipPreGame: false },
    );

    loadMutatedState(engine, (state) => {
      state.ctx.status.choosingFirstPlayer = undefined;
      state.ctx.status.pendingMulligan = [PLAYER_ONE, PLAYER_TWO];
      state.ctx.status.phase = "alterHand";
      state.ctx.status.step = "";
    });

    const traces: AutomatedActionDecisionTrace[] = [];
    const result = engine.asPlayerOne().takeAutomatedAction({
      strategy: deckAwareLoreRaceAutomatedActionStrategy,
      traceSink: {
        push(trace) {
          traces.push(trace);
        },
      },
    });

    expect(result.selectedCandidate).toMatchObject({
      family: "alterHand",
      cardsToMulligan: [],
      plan: "keep-all",
    });

    const executionTrace = getExecutionTrace(traces);

    expect(getSelectedHeuristicValue(executionTrace, "matchupCardAdjustment")).toBeGreaterThan(0);
  });

  it("lets deck-aware-lore-race target the higher-value opposing threat with removal", () => {
    const removalSource = createMockItem({
      id: "deck-aware-removal-source",
      name: "Deck-Aware Removal Source",
      cost: 3,
      abilities: [
        {
          id: "deck-aware-removal-source-shoot",
          name: "SHOOT",
          type: "activated",
          cost: {},
          effect: { amount: 2, target: "CHOSEN_CHARACTER", type: "deal-damage" },
          text: "SHOOT - Deal 2 damage to chosen character.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const steelSupport = createMockCharacter({
      id: "deck-aware-removal-steel-support",
      name: "Deck-Aware Removal Steel Support",
      cost: 1,
      inkType: ["steel"],
    });
    const threat = createMockCharacter({
      id: "deck-aware-removal-threat",
      name: "Deck-Aware Removal Threat",
      cost: 2,
      lore: 2,
      strength: 2,
      willpower: 2,
      inkType: ["emerald"],
      abilities: [
        {
          id: "deck-aware-removal-threat-draw",
          name: "THREAT DRAW",
          type: "activated",
          cost: {},
          effect: { amount: 1, target: "CONTROLLER", type: "draw" },
          text: "THREAT DRAW - Draw a card.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const bystander = createMockCharacter({
      id: "deck-aware-removal-bystander",
      name: "Deck-Aware Removal Bystander",
      cost: 3,
      lore: 1,
      strength: 2,
      willpower: 2,
      inkType: ["amber"],
    });
    const opponentSupport = createMockCharacter({
      id: "deck-aware-removal-opponent-support",
      name: "Deck-Aware Removal Opponent Support",
      cost: 1,
      inkType: ["amber"],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: removalSource, isDrying: false }],
        deck: [removalSource, steelSupport, steelSupport],
      },
      {
        play: [
          { card: threat, isDrying: false },
          { card: bystander, isDrying: false },
        ],
        deck: [threat, bystander, opponentSupport],
      },
    );

    const result = engine.asPlayerOne().takeAutomatedAction({
      strategy: deckAwareLoreRaceAutomatedActionStrategy,
    });

    expect(result.selectedCandidate).toMatchObject({
      family: "activateAbility",
      cardId: engine.asPlayerOne().getCard(removalSource).id,
      targets: [engine.asPlayerTwo().getCard(threat).id],
    });
    expect(result.finalResult.success).toBe(true);
    expect(engine.asPlayerTwo().getCardZone(threat)).toBe("discard");
  });

  it("keeps fair-mode matchup rules from reading hidden opponent deck data during the opening", () => {
    const silverBullet = createMockCharacter({
      id: "DI6",
      name: "Best AI Silver Bullet",
      cost: 4,
      inkType: ["emerald"],
    });
    const amberOpener = createMockCharacter({
      id: "best-ai-hidden-amber-opener",
      name: "Best AI Hidden Amber Opener",
      cost: 1,
      inkType: ["amber"],
      lore: 1,
    });
    const emeraldTwoDrop = createMockCharacter({
      id: "best-ai-hidden-emerald-two-drop",
      name: "Best AI Hidden Emerald Two Drop",
      cost: 2,
      inkType: ["emerald"],
      lore: 1,
    });
    const filler = createMockCharacter({
      id: "best-ai-hidden-filler",
      name: "Best AI Hidden Filler",
      cost: 5,
      inkType: ["amber"],
      lore: 2,
    });
    const sapphireCard = createMockCharacter({
      id: "best-ai-hidden-sapphire-card",
      name: "Best AI Hidden Sapphire Card",
      cost: 2,
      inkType: ["sapphire"],
    });
    const steelCard = createMockCharacter({
      id: "best-ai-hidden-steel-card",
      name: "Best AI Hidden Steel Card",
      cost: 2,
      inkType: ["steel"],
    });

    function createOpeningMulliganEngine() {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [silverBullet, amberOpener, emeraldTwoDrop, filler],
          deck: [silverBullet, amberOpener, emeraldTwoDrop, filler],
        },
        {
          deck: [sapphireCard, steelCard, sapphireCard, steelCard],
        },
        { skipPreGame: false },
      );

      loadMutatedState(engine, (state) => {
        state.ctx.status.choosingFirstPlayer = undefined;
        state.ctx.status.pendingMulligan = [PLAYER_ONE, PLAYER_TWO];
        state.ctx.status.phase = "alterHand";
        state.ctx.status.step = "";
      });

      return engine;
    }

    const fairTraces: AutomatedActionDecisionTrace[] = [];
    createOpeningMulliganEngine()
      .asPlayerOne()
      .takeAutomatedAction({
        strategy: bestDeckAwareLoreRaceAutomatedActionStrategy,
        traceSink: {
          push(trace) {
            fairTraces.push(trace);
          },
        },
      });
    const fairTrace = getExecutionTrace(fairTraces);
    const fairKeepAll = findTraceCandidate(
      fairTrace,
      (summary) =>
        summary.candidate.family === "alterHand" && summary.candidate.plan === "keep-all",
    );

    expect(getSelectedHeuristicValue(fairTrace, "informationPolicy")).toBe("fair");
    expect(getSelectedHeuristicValue(fairTrace, "opponentKnowledgeSource")).toBe("none");
    expect(fairKeepAll?.matchedRuleIds ?? []).not.toContain("di6-anti-sapphire-bullet");

    const oracleTraces: AutomatedActionDecisionTrace[] = [];
    createOpeningMulliganEngine()
      .asPlayerOne()
      .takeAutomatedAction({
        strategy: bestDeckAwareOracleLoreRaceAutomatedActionStrategy,
        traceSink: {
          push(trace) {
            oracleTraces.push(trace);
          },
        },
      });
    const oracleTrace = getExecutionTrace(oracleTraces);
    const oracleKeepAll = findTraceCandidate(
      oracleTrace,
      (summary) =>
        summary.candidate.family === "alterHand" && summary.candidate.plan === "keep-all",
    );

    expect(getSelectedHeuristicValue(oracleTrace, "informationPolicy")).toBe("oracle");
    expect(getSelectedHeuristicValue(oracleTrace, "opponentKnowledgeSource")).toBe("full-deck");
    expect(oracleKeepAll?.matchedRuleIds ?? []).toContain("di6-anti-sapphire-bullet");
  });

  it("treats a silver-bullet card as matchup-specific ink with the oracle strategy", () => {
    const silverBullet = createMockCharacter({
      id: "DI6",
      name: "Best AI Ink Silver Bullet",
      cost: 4,
      inkType: ["emerald"],
    });
    const amberOpener = createMockCharacter({
      id: "best-ai-ink-amber-opener",
      name: "Best AI Ink Amber Opener",
      cost: 1,
      inkType: ["amber"],
      lore: 1,
    });
    const emeraldSupport = createMockCharacter({
      id: "best-ai-ink-emerald-support",
      name: "Best AI Ink Emerald Support",
      cost: 2,
      inkType: ["emerald"],
      lore: 1,
    });
    const sapphireCard = createMockCharacter({
      id: "best-ai-ink-sapphire-card",
      name: "Best AI Ink Sapphire Card",
      cost: 2,
      inkType: ["sapphire"],
    });
    const steelCard = createMockCharacter({
      id: "best-ai-ink-steel-card",
      name: "Best AI Ink Steel Card",
      cost: 2,
      inkType: ["steel"],
    });
    const amberCard = createMockCharacter({
      id: "best-ai-ink-amber-card",
      name: "Best AI Ink Amber Card",
      cost: 2,
      inkType: ["amber"],
    });

    function createInkEngine(opponentDeck: LorcanaCardDefinition[]) {
      return LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [silverBullet, amberOpener, emeraldSupport],
          deck: [silverBullet, amberOpener, emeraldSupport, amberOpener],
        },
        {
          deck: opponentDeck,
        },
      );
    }

    const sapphireEngine = createInkEngine([sapphireCard, steelCard, sapphireCard]);
    const amberEngine = createInkEngine([amberCard, steelCard, amberCard]);
    const sapphireSilverBulletId = sapphireEngine.asPlayerOne().getCard(silverBullet).id;
    const amberSilverBulletId = amberEngine.asPlayerOne().getCard(silverBullet).id;
    const sapphireResult = sapphireEngine.asPlayerOne().takeAutomatedAction({
      strategy: bestDeckAwareOracleLoreRaceAutomatedActionStrategy,
    });
    const amberResult = amberEngine.asPlayerOne().takeAutomatedAction({
      strategy: bestDeckAwareOracleLoreRaceAutomatedActionStrategy,
    });

    expect(sapphireResult.selectedCandidate).toMatchObject({
      family: "putCardIntoInkwell",
    });
    expect(amberResult.selectedCandidate).toMatchObject({
      family: "putCardIntoInkwell",
      cardId: amberSilverBulletId,
    });
    expect(sapphireResult.selectedCandidate?.family).toBe("putCardIntoInkwell");
    if (sapphireResult.selectedCandidate?.family !== "putCardIntoInkwell") {
      throw new Error("Expected oracle sapphire result to select an ink candidate.");
    }

    expect(sapphireResult.selectedCandidate.cardId).not.toBe(sapphireSilverBulletId);
  });

  it("uses matchup-specific play weights to fire Grab Your Bow before a generic five-drop", () => {
    const grabYourBow = createMockActionCard({
      id: "EtL",
      name: "Best AI Grab Your Bow",
      cost: 5,
      text: "Deal 2 damage to chosen character.",
      abilities: [
        {
          id: "best-ai-etl-damage",
          name: "SHOOT",
          type: "action",
          effect: { amount: 2, target: "CHOSEN_CHARACTER", type: "deal-damage" },
          text: "Deal 2 damage to chosen character.",
        },
      ],
    });
    const genericFiveDrop = createMockCharacter({
      id: "best-ai-play-generic-five-drop",
      name: "Best AI Generic Five Drop",
      cost: 5,
      lore: 2,
      inkType: ["amethyst"],
    });
    const threat = createMockCharacter({
      id: "best-ai-play-threat",
      name: "Best AI Play Threat",
      cost: 2,
      lore: 1,
      strength: 2,
      willpower: 2,
      inkType: ["amber"],
    });
    const amberSupport = createMockCharacter({
      id: "best-ai-play-amber-support",
      name: "Best AI Play Amber Support",
      cost: 1,
      inkType: ["amber"],
    });
    const steelSupport = createMockCharacter({
      id: "best-ai-play-steel-support",
      name: "Best AI Play Steel Support",
      cost: 1,
      inkType: ["steel"],
    });
    const amethystSupport = createMockCharacter({
      id: "best-ai-play-amethyst-support",
      name: "Best AI Play Amethyst Support",
      cost: 1,
      inkType: ["amethyst"],
    });
    const rubySupport = createMockCharacter({
      id: "best-ai-play-ruby-support",
      name: "Best AI Play Ruby Support",
      cost: 1,
      inkType: ["ruby"],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [grabYourBow, genericFiveDrop],
        inkwell: 5,
        deck: [grabYourBow, genericFiveDrop, amethystSupport, rubySupport],
      },
      {
        play: [{ card: threat, exerted: true, isDrying: false }],
        deck: [threat, amberSupport, steelSupport],
      },
    );

    // Play-before-ink: the AI fires Grab Your Bow directly (play outranks ink)
    const playResult = engine.asPlayerOne().takeAutomatedAction({
      strategy: bestDeckAwareOracleLoreRaceAutomatedActionStrategy,
    });

    expect(playResult.selectedCandidate).toMatchObject({
      family: "playCard",
      cardId: engine.asPlayerOne().getCard(grabYourBow).id,
      targets: [engine.asPlayerTwo().getCard(threat).id],
    });

    // Then inks the generic five-drop
    const inkResult = engine.asPlayerOne().takeAutomatedAction({
      strategy: bestDeckAwareOracleLoreRaceAutomatedActionStrategy,
    });

    expect(inkResult.selectedCandidate).toMatchObject({
      family: "putCardIntoInkwell",
      cardId: engine.asPlayerOne().getCard(genericFiveDrop).id,
    });
  });

  it("uses matchup-specific challenge weights to send Daisy Duck into control boards", () => {
    const daisyDuck = createMockCharacter({
      id: "lih",
      name: "Best AI Daisy Duck",
      cost: 1,
      lore: 2,
      strength: 2,
      willpower: 2,
      inkType: ["amber"],
    });
    const genericAttacker = createMockCharacter({
      id: "best-ai-challenge-generic-attacker",
      name: "Best AI Challenge Generic Attacker",
      cost: 2,
      lore: 0,
      strength: 2,
      willpower: 2,
      inkType: ["steel"],
    });
    const defender = createMockCharacter({
      id: "best-ai-challenge-defender",
      name: "Best AI Challenge Defender",
      cost: 2,
      lore: 1,
      strength: 2,
      willpower: 2,
      inkType: ["ruby"],
    });
    const amethystSupport = createMockCharacter({
      id: "best-ai-challenge-amethyst-support",
      name: "Best AI Challenge Amethyst Support",
      cost: 1,
      inkType: ["amethyst"],
    });
    const rubySupport = createMockCharacter({
      id: "best-ai-challenge-ruby-support",
      name: "Best AI Challenge Ruby Support",
      cost: 1,
      inkType: ["ruby"],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: daisyDuck, isDrying: false },
          { card: genericAttacker, isDrying: false },
        ],
        deck: [daisyDuck, genericAttacker],
        lore: 10,
      },
      {
        play: [{ card: defender, exerted: true, isDrying: false }],
        deck: [defender, amethystSupport, rubySupport],
        lore: 10,
      },
    );

    const result = engine.asPlayerOne().takeAutomatedAction({
      strategy: bestDeckAwareOracleLoreRaceAutomatedActionStrategy,
    });

    expect(result.selectedCandidate).toMatchObject({
      family: "challenge",
      attackerId: engine.asPlayerOne().getCard(daisyDuck).id,
      defenderId: engine.asPlayerTwo().getCard(defender).id,
    });
  });

  it("emits structured contributors and matched rule ids for matchup-specific target choices", () => {
    const removalSource = createMockItem({
      id: "sQ9",
      name: "Best AI Removal Source",
      cost: 3,
      abilities: [
        {
          id: "best-ai-removal-source-shoot",
          name: "SHOOT",
          type: "activated",
          cost: {},
          effect: { amount: 2, target: "CHOSEN_CHARACTER", type: "deal-damage" },
          text: "SHOOT - Deal 2 damage to chosen character.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const threat = createMockCharacter({
      id: "best-ai-target-threat",
      name: "Best AI Target Threat",
      cost: 2,
      lore: 1,
      strength: 2,
      willpower: 2,
      inkType: ["sapphire"],
      abilities: [
        {
          id: "best-ai-target-threat-draw",
          name: "THREAT DRAW",
          type: "activated",
          cost: {},
          effect: { amount: 1, target: "CONTROLLER", type: "draw" },
          text: "THREAT DRAW - Draw a card.",
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const bystander = createMockCharacter({
      id: "best-ai-target-bystander",
      name: "Best AI Target Bystander",
      cost: 2,
      lore: 1,
      strength: 2,
      willpower: 2,
      inkType: ["steel"],
    });
    const amberSupport = createMockCharacter({
      id: "best-ai-target-amber-support",
      name: "Best AI Target Amber Support",
      cost: 1,
      inkType: ["amber"],
    });
    const steelSupport = createMockCharacter({
      id: "best-ai-target-steel-support",
      name: "Best AI Target Steel Support",
      cost: 1,
      inkType: ["steel"],
    });
    const traces: AutomatedActionDecisionTrace[] = [];
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: removalSource, isDrying: false }],
        deck: [removalSource, amberSupport, steelSupport],
      },
      {
        play: [
          { card: threat, isDrying: false },
          { card: bystander, isDrying: false },
        ],
        deck: [threat, bystander, steelSupport],
      },
    );

    const result = engine.asPlayerOne().takeAutomatedAction({
      strategy: bestDeckAwareOracleLoreRaceAutomatedActionStrategy,
      traceSink: {
        push(trace) {
          traces.push(trace);
        },
      },
    });

    expect(result.selectedCandidate).toMatchObject({
      family: "activateAbility",
      cardId: engine.asPlayerOne().getCard(removalSource).id,
      targets: [engine.asPlayerTwo().getCard(threat).id],
    });

    const executionTrace = getExecutionTrace(traces);

    expect(executionTrace?.selectedCandidate?.matchedRuleIds ?? []).toContain(
      "sq9-midrange-removal",
    );
    expect(
      executionTrace?.selectedCandidate?.contributors?.some(
        (contributor) =>
          contributor.source === "card-rule" && contributor.ruleId === "sq9-midrange-removal",
      ),
    ).toBe(true);
  });

  it("takes automated actions through the server current-actor surface", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
      },
      {
        deck: 1,
      },
      { skipPreGame: false },
    );

    const result = engine.asServer().takeAutomatedActionForCurrentActor();

    expect(result.selectedCandidate).toMatchObject({
      family: "chooseWhoGoesFirst",
      firstPlayerId: PLAYER_ONE,
    });
    expect(result.finalResult.success).toBe(true);
  });

  it("resolves look-at-the-top prompts instead of conceding", () => {
    const source = createMockCharacter({
      id: "stuck-scry-source",
      name: "Stuck Scry Source",
      cost: 2,
    });
    const princessMatch = createMockCharacter({
      id: "stuck-princess-match",
      name: "Stuck Princess Match",
      cost: 5,
      lore: 2,
      classifications: ["Storyborn", "Princess"],
    });
    const fillerA = createMockCharacter({ id: "stuck-filler-a", name: "Stuck Filler A", cost: 1 });
    const fillerB = createMockCharacter({ id: "stuck-filler-b", name: "Stuck Filler B", cost: 2 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
      },
      {
        play: [{ card: source, isDrying: false }],
        deck: [fillerA, princessMatch, fillerB],
      },
    );
    const sourceId = engine.asPlayerTwo().getCard(source).id as CardInstanceId;
    const revealedCardIds = [fillerA, princessMatch, fillerB].map((card) =>
      engine.findCardInstanceId(card, "deck", PLAYER_TWO),
    );
    const princessMatchId = engine.findCardInstanceId(princessMatch, "deck", PLAYER_TWO);
    const fillerAId = engine.findCardInstanceId(fillerA, "deck", PLAYER_TWO);
    const fillerBId = engine.findCardInstanceId(fillerB, "deck", PLAYER_TWO);

    loadMutatedState(engine, (state) => {
      state.ctx.priority.holder = PLAYER_ONE;
      state.G.pendingEffects = [
        {
          id: "pending:stuck-scry:1",
          type: "action-effect",
          kind: "scry-selection",
          sourceId,
          sourceCardId: sourceId,
          controllerId: PLAYER_ONE,
          chooserId: PLAYER_TWO,
          cardPlayed: getCardPlayedPayload({
            playerId: PLAYER_TWO,
            cardId: sourceId,
            cardType: "character",
          }),
          effect: {
            type: "scry",
            amount: 3,
            destinations: [
              {
                zone: "hand",
                min: 0,
                max: 1,
                filters: [
                  { type: "card-type", cardType: "character" },
                  { type: "classification", classification: "Princess" },
                ],
              },
              {
                zone: "deck-bottom",
                remainder: true,
                ordering: "player-choice",
              },
            ],
          } satisfies Effect,
          resolutionInput: {
            eventSnapshot: {
              revealedCardIds,
            },
          },
          selectionContext: {
            amount: 3,
            chooserId: PLAYER_TWO,
            currentSelection: {},
            destinationRules: [
              {
                id: "hand",
                max: 1,
                min: 0,
                remainder: false,
                zone: "hand",
              },
              {
                id: "deck-bottom",
                max: null,
                min: 0,
                remainder: true,
                zone: "deck-bottom",
              },
            ],
            kind: "scry-selection",
            origin: "pending-effect",
            requestId: "pending:stuck-scry:1",
            revealedCardIds,
            revealedCards: [
              {
                cardId: fillerAId,
                label: "Stuck Filler A",
                cardType: "character",
                cost: 1,
              },
              {
                cardId: princessMatchId,
                label: "Stuck Princess Match",
                cardType: "character",
                cost: 5,
                classifications: ["Storyborn", "Princess"],
              },
              {
                cardId: fillerBId,
                label: "Stuck Filler B",
                cardType: "character",
                cost: 2,
              },
            ],
            sourceCardId: sourceId,
            submitField: "destinations",
          },
        } satisfies PendingActionEffect,
      ];
      setPendingActionChoice(state, "pending:stuck-scry:1", PLAYER_TWO);
    });

    const result = engine.asServer().takeAutomatedActionForCurrentActor();

    expect(result.actorId).toBe(PLAYER_TWO);
    expect(result.selectedCandidate).toEqual({
      family: "resolveEffect",
      effectId: "pending:stuck-scry:1",
      destinations: [
        { zone: "hand", cards: [princessMatchId] },
        { zone: "deck-bottom", cards: [fillerBId, fillerAId] },
      ],
    });
    expect(result.fallbackTaken).toBeUndefined();
    expect(result.finalResult.success).toBe(true);
    expect(engine.asServer().isGameOver()).toBe(false);
    expect(engine.asPlayerTwo().getCardZone(princessMatch)).toBe("hand");
  });

  it("resolves ordered put-on-bottom target prompts without conceding", () => {
    const source = createMockActionCard({
      id: "ordered-bottom-source",
      name: "Ordered Bottom Source",
      cost: 5,
      text: "Put all opposing characters with 4 Strength or less on the bottom of their players' decks in any order.",
      abilities: [],
    });
    const eligibleA = createMockCharacter({
      id: "ordered-bottom-eligible-a",
      name: "Ordered Bottom Eligible A",
      cost: 2,
      strength: 2,
      willpower: 3,
    });
    const eligibleB = createMockCharacter({
      id: "ordered-bottom-eligible-b",
      name: "Ordered Bottom Eligible B",
      cost: 3,
      strength: 4,
      willpower: 4,
    });
    const ineligible = createMockCharacter({
      id: "ordered-bottom-ineligible",
      name: "Ordered Bottom Ineligible",
      cost: 4,
      strength: 5,
      willpower: 5,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [source],
        deck: 1,
      },
      {
        play: [
          { card: eligibleA, isDrying: false },
          { card: eligibleB, isDrying: false },
          { card: ineligible, isDrying: false },
        ],
        deck: 1,
      },
    );
    const sourceId = engine.asPlayerOne().getCard(source).id as CardInstanceId;
    const eligibleAId = engine.asPlayerTwo().getCard(eligibleA).id as CardInstanceId;
    const eligibleBId = engine.asPlayerTwo().getCard(eligibleB).id as CardInstanceId;
    const ineligibleId = engine.asPlayerTwo().getCard(ineligible).id as CardInstanceId;

    loadMutatedState(engine, (state) => {
      state.ctx.priority.holder = PLAYER_ONE;
      state.G.pendingEffects = [
        {
          id: "pending:ordered-bottom:1",
          type: "action-effect",
          kind: "target-selection",
          sourceId,
          sourceCardId: sourceId,
          controllerId: PLAYER_ONE,
          chooserId: PLAYER_TWO,
          cardPlayed: getCardPlayedPayload({
            playerId: PLAYER_ONE,
            cardId: sourceId,
            cardType: "action",
          }),
          effect: {
            type: "put-on-bottom",
            ordering: "player-choice",
            orderBy: "owner",
            target: {
              selector: "all",
              count: "all",
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "strength-comparison",
                  comparison: "less-or-equal",
                  value: 4,
                },
              ],
            },
          } satisfies Effect,
          resolutionInput: {},
          selectionContext: {
            origin: "pending-effect",
            requestId: "pending:ordered-bottom:1",
            kind: "target-selection",
            sourceCardId: sourceId,
            chooserId: PLAYER_TWO,
            currentSelection: {},
            submitField: "targets",
            targetDsl: [],
            cardCandidateIds: [eligibleAId, eligibleBId],
            playerCandidateIds: [],
            allowedZones: ["play"],
            minSelections: 2,
            maxSelections: 2,
            ordered: true,
            autoRejected: false,
          },
        } satisfies PendingActionEffect,
      ];
      setPendingActionChoice(state, "pending:ordered-bottom:1", PLAYER_TWO);
    });

    const result = engine.asServer().takeAutomatedActionForCurrentActor();

    expect(result.actorId).toBe(PLAYER_TWO);
    expect(result.selectedCandidate?.family).toBe("resolveEffect");
    if (result.selectedCandidate?.family === "resolveEffect") {
      expect(result.selectedCandidate.effectId).toBe("pending:ordered-bottom:1");
      expect(result.selectedCandidate.targets).toHaveLength(2);
      expect(result.selectedCandidate.targets).toEqual(
        expect.arrayContaining([eligibleAId, eligibleBId]),
      );
      expect(result.selectedCandidate.targets).not.toContain(ineligibleId);
    }
    expect(result.fallbackTaken).toBeUndefined();
    expect(result.finalResult.success).toBe(true);
    expect(engine.asServer().isGameOver()).toBe(false);
    expect(engine.asServer().getState().G.pendingEffects).toHaveLength(0);
    expect(engine.asPlayerTwo().getCardZone(eligibleA)).toBe("deck");
    expect(engine.asPlayerTwo().getCardZone(eligibleB)).toBe("deck");
    expect(engine.asPlayerTwo().getCardZone(ineligible)).toBe("play");
  });

  it("resolves name-card prompts without conceding", () => {
    const source = createMockCharacter({
      id: "stuck-name-source",
      name: "Stuck Name Source",
      cost: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
      },
      {
        play: [{ card: source, isDrying: false }],
        deck: 1,
      },
    );
    const sourceId = engine.asPlayerTwo().getCard(source).id as CardInstanceId;

    loadMutatedState(engine, (state) => {
      state.ctx.priority.holder = PLAYER_ONE;
      state.G.pendingEffects = [
        {
          id: "pending:stuck-name:1",
          type: "action-effect",
          kind: "name-card-selection",
          sourceId,
          sourceCardId: sourceId,
          controllerId: PLAYER_ONE,
          chooserId: PLAYER_TWO,
          cardPlayed: getCardPlayedPayload({
            playerId: PLAYER_TWO,
            cardId: sourceId,
            cardType: "character",
          }),
          effect: {
            type: "name-a-card",
          } satisfies Effect,
          resolutionInput: {},
        } satisfies PendingActionEffect,
      ];
      setPendingActionChoice(state, "pending:stuck-name:1", PLAYER_TWO);
    });

    const result = engine.asServer().takeAutomatedActionForCurrentActor();

    expect(result.actorId).toBe(PLAYER_TWO);
    expect(result.selectedCandidate).toMatchObject({
      family: "resolveEffect",
      effectId: "pending:stuck-name:1",
      namedCard: expect.stringMatching(/\S/),
    });
    expect(result.fallbackTaken).toBeUndefined();
    expect(result.finalResult.success).toBe(true);
    expect(engine.asServer().isGameOver()).toBe(false);
    expect(engine.asServer().getState().G.pendingEffects).toHaveLength(0);
  });

  it("concedes only after the same blocked prompt repeats three times", () => {
    const source = createMockCharacter({
      id: "stuck-choice-source",
      name: "Stuck Choice Source",
      cost: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
      },
      {
        play: [{ card: source, isDrying: false }],
        deck: 1,
      },
    );
    const sourceId = engine.asPlayerTwo().getCard(source).id as CardInstanceId;

    loadMutatedState(engine, (state) => {
      state.ctx.priority.holder = PLAYER_ONE;
      state.G.pendingEffects = [
        {
          id: "pending:stuck-choice:1",
          type: "action-effect",
          kind: "choice-selection",
          sourceId,
          sourceCardId: sourceId,
          controllerId: PLAYER_ONE,
          chooserId: PLAYER_TWO,
          cardPlayed: getCardPlayedPayload({
            playerId: PLAYER_TWO,
            cardId: sourceId,
            cardType: "character",
          }),
          effect: {
            type: "or",
            options: [
              {
                type: "or",
                options: [
                  {
                    amount: 1,
                    target: "CONTROLLER",
                    type: "draw",
                  },
                  {
                    target: "SELF",
                    type: "banish",
                  },
                ],
              },
              {
                amount: 1,
                target: "CONTROLLER",
                type: "draw",
              },
            ],
          } satisfies Effect,
          resolutionInput: {},
        } satisfies PendingActionEffect,
      ];
      setPendingActionChoice(state, "pending:stuck-choice:1", PLAYER_TWO);
    });

    const first = engine.asServer().takeAutomatedActionForCurrentActor();
    const second = engine.asServer().takeAutomatedActionForCurrentActor();
    const third = engine.asServer().takeAutomatedActionForCurrentActor();

    expect(first.blocked).toMatchObject({
      reason: "no-candidates",
      passTurnErrorCode: expect.any(String),
    });
    expect(first.fallbackTaken).toBeUndefined();
    expect(first.finalResult.success).toBe(true);
    expect(second.fallbackTaken).toBeUndefined();
    expect(second.finalResult.success).toBe(true);
    expect(third.fallbackTaken).toBe("concede");
    expect(third.finalResult.success).toBe(true);
    expect(engine.asServer().isGameOver()).toBe(true);
    expect(engine.asServer().getWinner()).toBe(PLAYER_ONE);
  });

  it("emits ordered candidate heuristics, selection, and execution attempts to the trace sink", () => {
    const adapter = createQuestAdapter({
      executionResults: [
        createFailureResult("First quest failed", "FIRST_FAILURE"),
        createSuccessResult(),
      ],
    });
    const traces: ReturnType<typeof takeAutomatedActionWithAdapter>["executionAttempts"] = [];
    const decisionTraces: AutomatedActionDecisionTrace[] = [];

    const result = takeAutomatedActionWithAdapter(
      adapter,
      {
        traceSink: {
          push(trace) {
            decisionTraces.push(trace);
          },
        },
      },
      [
        {
          kind: "actor-resolution",
          source: "scoped-player",
          actorId: PLAYER_ONE,
          reason: "Resolved trace test actor",
        },
      ],
    );

    traces.push(...result.executionAttempts);

    expect(traces).toHaveLength(2);
    expect(decisionTraces).toHaveLength(1);
    expect(decisionTraces[0]?.orderedCandidates[0]?.heuristics).toContainEqual({
      direction: "asc",
      key: "familyOrder",
      value: 4.5,
    });
    expect(decisionTraces[0]?.orderedCandidates[0]?.heuristics).toContainEqual({
      direction: "desc",
      key: "printedLore",
      value: 2,
    });
    expect(decisionTraces[0]?.selectedCandidate).toMatchObject({
      family: "quest",
    });
    expect(decisionTraces[0]?.executionAttempts).toEqual([
      expect.objectContaining({
        errorCode: "FIRST_FAILURE",
        success: false,
      }),
      expect.objectContaining({
        success: true,
      }),
    ]);
    expect(decisionTraces[0]?.diagnostics).toContainEqual(
      expect.objectContaining({
        kind: "actor-resolution",
      }),
    );
  });

  it("emits fallback decisions to the trace sink when no candidate succeeds", () => {
    const decisionTraces: Array<{
      fallbackTaken?: string;
      selectedCandidate?: { family: string };
    }> = [];

    takeAutomatedActionWithAdapter(
      createQuestAdapter({
        executionResults: [
          createFailureResult("Quest failed", "FAIL_ONE"),
          createFailureResult("Quest failed", "FAIL_TWO"),
          createFailureResult("Quest failed", "FAIL_THREE"),
        ],
      }),
      {
        traceSink: {
          push(trace) {
            decisionTraces.push(trace);
          },
        },
      },
    );

    expect(decisionTraces).toHaveLength(1);
    expect(decisionTraces[0]?.fallbackTaken).toBe("passTurn");
    expect(decisionTraces[0]?.selectedCandidate).toBeUndefined();
  });
});

describe("automated action actor resolution", () => {
  it("prefers choosing-first-player before pending mulligan and priority", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 1 },
      { deck: 1 },
      { skipPreGame: false },
    );
    const state = engine.asServer().getState();

    const result = resolveServerCurrentActor({
      state,
      staticResources: engine.asServer().staticResources,
    });

    expect(result).toMatchObject({
      kind: "actor-resolution",
      source: "choosing-first-player",
      actorId: PLAYER_ONE,
    });
  });

  it("falls back to pending mulligan before priority when no earlier actor exists", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({ deck: 1 }, { deck: 1 });
    loadMutatedState(engine, (state) => {
      state.ctx.status.choosingFirstPlayer = undefined;
      state.ctx.status.pendingMulligan = [PLAYER_TWO, PLAYER_ONE];
      state.ctx.priority.holder = PLAYER_ONE;
    });

    const result = resolveServerCurrentActor({
      state: engine.asServer().getState(),
      staticResources: engine.asServer().staticResources,
    });

    expect(result).toMatchObject({
      kind: "actor-resolution",
      source: "pending-mulligan",
      actorId: PLAYER_TWO,
    });
  });

  it("prefers the next pending mulligan player once setup has advanced into mulligan", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 1 },
      { deck: 1 },
      { skipPreGame: false },
    );

    engine.asServer().takeAutomatedActionForCurrentActor();
    engine.asServer().takeAutomatedActionForCurrentActor();

    const result = resolveServerCurrentActor({
      state: engine.asServer().getState(),
      staticResources: engine.asServer().staticResources,
    });

    expect(result).toMatchObject({
      kind: "actor-resolution",
      source: "pending-mulligan",
      actorId: PLAYER_TWO,
    });
  });

  it("ignores a malformed active pending effect that has no chooser", () => {
    const source = createMockCharacter({
      id: "malformed-pending-source",
      name: "Malformed Pending Source",
      cost: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
      },
      {
        play: [{ card: source, isDrying: false }],
        deck: 2,
      },
    );
    const sourceId = engine.asPlayerTwo().getCard(source).id as CardInstanceId;

    loadMutatedState(engine, (state) => {
      state.ctx.priority.holder = PLAYER_ONE;
      state.ctx.priority.pendingChoice = {
        type: "action-effect",
        playerID: PLAYER_TWO,
        requestID: "pending:malformed:1",
      };
      state.G.pendingEffects = [
        {
          id: "pending:malformed:1",
          type: "action-effect",
          kind: "optional-selection",
          sourceId,
          sourceCardId: sourceId,
          controllerId: PLAYER_TWO,
          chooserId: undefined as never,
          cardPlayed: getCardPlayedPayload({
            playerId: PLAYER_TWO,
            cardId: sourceId,
            cardType: "character",
          }),
          effect: {
            chooser: "CONTROLLER",
            effect: {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            type: "optional",
          } satisfies Effect,
          resolutionInput: {},
        } as PendingActionEffect,
      ];
    });

    const result = resolveServerCurrentActor({
      state: engine.asServer().getState(),
      staticResources: engine.asServer().staticResources,
    });

    expect(result).toMatchObject({
      kind: "actor-resolution",
      source: "priority-holder",
      actorId: PLAYER_ONE,
    });
  });
});

describe("automated action execution", () => {
  it("returns the first successful candidate", () => {
    const result = takeAutomatedActionWithAdapter(
      createQuestAdapter({
        executionResults: [createSuccessResult()],
      }),
    );

    expect(result.selectedCandidate).toMatchObject({ family: "quest" });
    expect(result.executionAttempts).toHaveLength(1);
    expect(result.finalResult.success).toBe(true);
    expect(result.fallbackTaken).toBeUndefined();
  });

  it("retries later candidates after execution failures", () => {
    const result = takeAutomatedActionWithAdapter(
      createQuestAdapter({
        executionResults: [
          createFailureResult("First failed", "FIRST_FAILED"),
          createSuccessResult(),
        ],
      }),
    );

    expect(result.executionAttempts).toHaveLength(2);
    expect(result.selectedCandidate).toMatchObject({ family: "quest" });
    expect(result.finalResult.success).toBe(true);
  });

  it("falls back to passTurn after three execution failures", () => {
    const result = takeAutomatedActionWithAdapter(
      createQuestAdapter({
        executionResults: [
          createFailureResult("First failed", "FIRST_FAILED"),
          createFailureResult("Second failed", "SECOND_FAILED"),
          createFailureResult("Third failed", "THIRD_FAILED"),
        ],
        passTurnResult: createSuccessResult(),
      }),
    );

    expect(result.executionAttempts).toHaveLength(3);
    expect(result.selectedCandidate).toBeUndefined();
    expect(result.fallbackTaken).toBe("passTurn");
    expect(result.finalResult.success).toBe(true);
  });

  it("returns a blocked no-op when passTurn fails", () => {
    const result = takeAutomatedActionWithAdapter(
      createQuestAdapter({
        executionResults: [
          createFailureResult("First failed", "FIRST_FAILED"),
          createFailureResult("Second failed", "SECOND_FAILED"),
          createFailureResult("Third failed", "THIRD_FAILED"),
        ],
        passTurnResult: createFailureResult("Pass failed", "PASS_FAILED"),
        concedeResult: createSuccessResult(),
      }),
    );

    expect(result.blocked).toMatchObject({
      reason: "execution-failures",
      passTurnError: "Pass failed",
      passTurnErrorCode: "PASS_FAILED",
    });
    expect(result.fallbackTaken).toBeUndefined();
    expect(result.finalResult.success).toBe(true);
  });

  // THE-890: AI plays cards with invalid targets or illegal actions

  it("does not enumerate a playCard candidate for an action requiring a chosen target when no valid targets exist", () => {
    // Simulates Grab Your Bow: banish up to 2 chosen characters with strength ≤ 2
    // AI should not play this card if no characters with strength ≤ 2 are on the field
    const grabYourBow = createMockActionCard({
      id: "grab-your-bow-test",
      name: "Grab Your Bow Test",
      cost: 2,
      text: "Banish up to 2 chosen characters with 2 strength or less.",
      abilities: [
        {
          id: "grab-your-bow-test-1",
          type: "action",
          text: "Banish up to 2 chosen characters with 2 strength or less.",
          effect: {
            type: "banish",
            target: {
              selector: "chosen",
              count: { upTo: 2 },
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [{ type: "strength-comparison", comparison: "less-or-equal", value: 2 }],
            },
          } as Effect,
        },
      ],
    });
    const strongEnemy = createMockCharacter({
      id: "strong-enemy-the890",
      name: "Strong Enemy",
      cost: 3,
      strength: 5,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [grabYourBow],
        inkwell: grabYourBow.cost,
        deck: 1,
      },
      {
        play: [{ card: strongEnemy, isDrying: false }],
        deck: 1,
      },
    );

    const grabYourBowId = engine.asPlayerOne().getCard(grabYourBow).id;
    const playCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter(
        (candidate) => candidate.family === "playCard" && candidate.cardId === grabYourBowId,
      );

    // The AI must not play Grab Your Bow when no valid targets (strength ≤ 2) exist
    expect(playCandidates).toHaveLength(0);
  });

  it("does enumerate a playCard candidate for an action requiring a chosen target when valid targets exist", () => {
    // When valid targets exist, the card should still be enumerated
    const grabYourBow = createMockActionCard({
      id: "grab-your-bow-with-target",
      name: "Grab Your Bow With Target",
      cost: 2,
      text: "Banish up to 2 chosen characters with 2 strength or less.",
      abilities: [
        {
          id: "grab-your-bow-with-target-1",
          type: "action",
          text: "Banish up to 2 chosen characters with 2 strength or less.",
          effect: {
            type: "banish",
            target: {
              selector: "chosen",
              count: { upTo: 2 },
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [{ type: "strength-comparison", comparison: "less-or-equal", value: 2 }],
            },
          } as Effect,
        },
      ],
    });
    const weakEnemy = createMockCharacter({
      id: "weak-enemy-the890",
      name: "Weak Enemy",
      cost: 2,
      strength: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [grabYourBow],
        inkwell: grabYourBow.cost,
        deck: 1,
      },
      {
        play: [{ card: weakEnemy, isDrying: false }],
        deck: 1,
      },
    );

    const grabYourBowId = engine.asPlayerOne().getCard(grabYourBow).id;
    const playCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter(
        (candidate) => candidate.family === "playCard" && candidate.cardId === grabYourBowId,
      );

    // Valid target exists — the card should be playable
    expect(playCandidates.length).toBeGreaterThan(0);
  });

  it("does not enumerate an activateAbility candidate when no valid targets exist for the ability", () => {
    // Simulates Cheshire Cat From the Shadows: {E} — Banish chosen damaged character
    // AI should not activate this ability when no damaged characters are on the field
    const cheshireCatMock = createMockCharacter({
      id: "cheshire-cat-the890",
      name: "Cheshire Cat Test",
      cost: 3,
      abilities: [
        {
          id: "cheshire-cat-the890-wicked-smile",
          name: "WICKED SMILE",
          text: "WICKED SMILE {E} — Banish chosen damaged character.",
          type: "activated",
          cost: { exert: true },
          effect: {
            target: "CHOSEN_DAMAGED_CHARACTER",
            type: "banish",
          } as Effect,
        } satisfies ActivatedAbilityDefinition,
      ],
    });
    const healthyEnemy = createMockCharacter({
      id: "healthy-enemy-the890",
      name: "Healthy Enemy",
      cost: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: cheshireCatMock, isDrying: false }],
        deck: 1,
      },
      {
        play: [{ card: healthyEnemy, isDrying: false }],
        deck: 1,
      },
    );

    const abilityCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter((candidate) => candidate.family === "activateAbility");

    // No damaged characters exist — the AI must not generate a WICKED SMILE candidate
    expect(abilityCandidates).toHaveLength(0);
  });

  it("prefers opponent characters over allied characters when playing a harmful action card", () => {
    // Simulates Let The Storm Rage On: deal-damage in a sequence — AI must prefer opponent targets
    const stormRageOn = createMockActionCard({
      id: "storm-rage-on-the890",
      name: "Storm Rage On Test",
      cost: 2,
      text: "Deal 2 damage to chosen character. Draw a card.",
      abilities: [
        {
          id: "storm-rage-on-the890-1",
          type: "action",
          text: "Deal 2 damage to chosen character. Draw a card.",
          effect: {
            type: "sequence",
            steps: [
              { amount: 2, target: "CHOSEN_CHARACTER", type: "deal-damage" },
              { amount: 1, target: "CONTROLLER", type: "draw" },
            ],
          } as Effect,
        },
      ],
    });
    const ownCharacter = createMockCharacter({
      id: "own-character-the890",
      name: "Own Character",
      cost: 3,
      lore: 2,
    });
    const opponentCharacter = createMockCharacter({
      id: "opponent-character-the890",
      name: "Opponent Character",
      cost: 3,
      lore: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [stormRageOn],
        inkwell: stormRageOn.cost,
        play: [{ card: ownCharacter, isDrying: false }],
        deck: 1,
      },
      {
        play: [{ card: opponentCharacter, isDrying: false }],
        deck: 1,
      },
    );

    const ownCharId = engine.asPlayerOne().getCard(ownCharacter).id as CardInstanceId;
    const opponentCharId = engine.asPlayerTwo().getCard(opponentCharacter).id as CardInstanceId;
    const stormRageOnId = engine.asPlayerOne().getCard(stormRageOn).id;

    const stormCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter(
        (candidate) => candidate.family === "playCard" && candidate.cardId === stormRageOnId,
      );

    // The first enumerated candidate should target the opponent character, not the player's own
    expect(stormCandidates.length).toBeGreaterThan(0);
    const firstCandidate = stormCandidates[0];
    if (firstCandidate?.family === "playCard") {
      expect(firstCandidate.targets).toContain(opponentCharId);
      expect(firstCandidate.targets).not.toContain(ownCharId);
    }
  });

  it("does not enumerate warded opponent characters as valid targets for harmful actions", () => {
    const harmfulAction = createMockActionCard({
      id: "harmful-action-ward-test",
      name: "Harmful Action Ward Test",
      cost: 2,
      text: "Deal 1 damage to chosen character.",
      abilities: [
        {
          id: "harmful-action-ward-test-1",
          type: "action",
          text: "Deal 1 damage to chosen character.",
          effect: {
            amount: 1,
            target: "CHOSEN_CHARACTER",
            type: "deal-damage",
          } as Effect,
        },
      ],
    });
    const wardedEnemy = createMockCharacter({
      id: "warded-enemy-the890",
      name: "Warded Enemy",
      cost: 3,
      abilities: [{ id: "warded-enemy-ward", type: "keyword", keyword: "Ward", text: "Ward" }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [harmfulAction],
        inkwell: harmfulAction.cost,
        deck: 1,
      },
      {
        play: [{ card: wardedEnemy, isDrying: false }],
        deck: 1,
      },
    );

    const harmfulActionId = engine.asPlayerOne().getCard(harmfulAction).id;
    const wardedEnemyId = engine.asPlayerTwo().getCard(wardedEnemy).id as CardInstanceId;
    const playCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter(
        (candidate) => candidate.family === "playCard" && candidate.cardId === harmfulActionId,
      );

    // Only warded enemy on the field — no valid targets, so no candidate generated
    expect(playCandidates).toHaveLength(0);

    // Also verify the warded card is not referenced as a target in any candidate
    for (const candidate of playCandidates) {
      if (candidate.family === "playCard") {
        expect(candidate.targets ?? []).not.toContain(wardedEnemyId);
      }
    }
  });

  it("keeps a resolveBag candidate with empty targets even for families that skip empty playCard", () => {
    // Regression: the fix for THE-890 must not break the resolveBag fizzle path
    const source = createMockCharacter({
      id: "bag-empty-regression-source",
      name: "Bag Empty Regression Source",
      cost: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: source, isDrying: false }],
      deck: 1,
    });
    const sourceId = engine.asPlayerOne().getCard(source).id as CardInstanceId;

    loadMutatedState(engine, (state) => {
      state.G.triggeredAbilities.bag.items = [
        {
          id: "bag:regression:the890",
          type: "bag-effect",
          kind: "triggered-ability",
          abilityId: "bag-regression-ability",
          abilityKey: "bag-regression-ability",
          controllerId: PLAYER_ONE,
          chooserId: PLAYER_ONE,
          sourceId,
          cardPlayed: getCardPlayedPayload({
            playerId: PLAYER_ONE,
            cardId: sourceId,
            cardType: "character",
          }),
          effect: {
            type: "ready",
            target: "CHOSEN_EXERTED_CHARACTER",
          } satisfies Effect,
          occurrenceIndex: 0,
          resolutionInput: {},
        } satisfies BagEffectEntry,
      ];
    });

    const bagCandidates = engine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter((candidate) => candidate.family === "resolveBag");

    // resolveBag with no valid targets still emits an empty-target candidate for fizzle
    expect(bagCandidates).toHaveLength(1);
    expect(bagCandidates[0]).toMatchObject({
      family: "resolveBag",
      bagId: "bag:regression:the890",
    });
  });

  describe("choice-selection with discard options (Lucifer pattern)", () => {
    it("enumerates resolveEffect candidates for a choice-selection pending effect with discard options", () => {
      const source = createMockCharacter({
        id: "lucifer-test-source",
        name: "Lucifer Test",
        cost: 5,
      });
      const handCard1 = createMockActionCard({
        id: "hand-action-1",
        name: "Hand Action 1",
        cost: 2,
        text: "Test action",
        abilities: [],
      });
      const handCard2 = createMockCharacter({
        id: "hand-char-1",
        name: "Hand Char 1",
        cost: 3,
      });
      const handCard3 = createMockActionCard({
        id: "hand-action-2",
        name: "Hand Action 2",
        cost: 1,
        text: "Test action 2",
        abilities: [],
      });

      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: source, isDrying: false }],
          deck: 1,
        },
        {
          hand: [handCard1, handCard2, handCard3],
          deck: 1,
        },
      );
      const sourceId = engine.asPlayerOne().getCard(source).id as CardInstanceId;

      loadMutatedState(engine, (state) => {
        state.ctx.priority.holder = PLAYER_TWO;
        state.G.pendingEffects = [
          {
            id: "pending:lucifer-choice:1",
            type: "action-effect",
            kind: "choice-selection",
            sourceId,
            sourceCardId: sourceId,
            controllerId: PLAYER_ONE,
            chooserId: PLAYER_TWO,
            cardPlayed: getCardPlayedPayload({
              playerId: PLAYER_ONE,
              cardId: sourceId,
              cardType: "character",
            }),
            effect: {
              type: "choice",
              chooser: "OPPONENT",
              optionLabels: ["discard 2 cards", "discard 1 action card"],
              options: [
                {
                  amount: 2,
                  chosen: true,
                  target: "OPPONENT",
                  type: "discard",
                },
                {
                  amount: 1,
                  chosen: true,
                  target: "OPPONENT",
                  type: "discard",
                  filter: {
                    cardType: "action",
                  },
                },
              ],
            } satisfies Effect,
            resolutionInput: {},
          } satisfies PendingActionEffect,
        ];
        setPendingActionChoice(state, "pending:lucifer-choice:1", PLAYER_TWO);
      });

      const result = engine.asPlayerTwo().enumerateAutomatedActions();
      const resolveEffectCandidates = result.candidates.filter(
        (candidate) => candidate.family === "resolveEffect",
      );
      const validationDiagnostics = result.diagnostics.filter(
        (d) => d.kind === "validation-reject" && d.family === "resolveEffect",
      );

      expect(validationDiagnostics).toHaveLength(0);
      expect(resolveEffectCandidates.length).toBeGreaterThan(0);

      const choiceIndices = resolveEffectCandidates
        .map((c) => c.choiceIndex)
        .filter((i): i is number => typeof i === "number");
      expect(new Set(choiceIndices)).toContain(0);
      expect(new Set(choiceIndices)).toContain(1);
    });

    it("resolves resolveBag -> choice-selection -> discard-choice in full flow", () => {
      const source = createMockCharacter({
        id: "lucifer-bag-source",
        name: "Lucifer Bag",
        cost: 5,
      });
      const handCard1 = createMockActionCard({
        id: "bag-action-1",
        name: "Bag Action 1",
        cost: 2,
        text: "Test",
        abilities: [],
      });
      const handCard2 = createMockCharacter({
        id: "bag-char-1",
        name: "Bag Char 1",
        cost: 3,
      });
      const handCard3 = createMockActionCard({
        id: "bag-action-2",
        name: "Bag Action 2",
        cost: 1,
        text: "Test 2",
        abilities: [],
      });

      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: source, isDrying: false }],
          deck: 1,
        },
        {
          hand: [handCard1, handCard2, handCard3],
          deck: 1,
        },
      );
      const sourceId = engine.asPlayerOne().getCard(source).id as CardInstanceId;

      loadMutatedState(engine, (state) => {
        state.ctx.priority.holder = PLAYER_ONE;
        state.G.triggeredAbilities.bag = {
          nextSeq: 0,
          items: [
            {
              id: "bag:lucifer:1",
              type: "bag-effect",
              kind: "triggered-ability",
              abilityId: "lucifer-mouse-catcher",
              abilityKey: "lucifer-mouse-catcher",
              occurrenceIndex: 0,
              abilityName: "MOUSE CATCHER",
              controllerId: PLAYER_ONE,
              chooserId: PLAYER_TWO,
              sourceId,
              cardPlayed: getCardPlayedPayload({
                playerId: PLAYER_ONE,
                cardId: sourceId,
                cardType: "character",
              }),
              effect: {
                type: "choice",
                chooser: "OPPONENT",
                optionLabels: ["discard 2 cards", "discard 1 action card"],
                options: [
                  {
                    amount: 2,
                    chosen: true,
                    target: "OPPONENT",
                    type: "discard",
                  },
                  {
                    amount: 1,
                    chosen: true,
                    target: "OPPONENT",
                    type: "discard",
                    filter: {
                      cardType: "action",
                    },
                  },
                ],
              } satisfies Effect,
              resolutionInput: {},
            } satisfies BagEffectEntry,
          ],
          lastResolvedPlayerId: undefined,
        };
      });

      const initialHandSize = engine.asPlayerTwo().getBoard().players[PLAYER_TWO].hand.length;

      const step1 = engine.asServer().takeAutomatedActionForCurrentActor();
      expect(step1.finalResult.success).toBe(true);
      expect(step1.fallbackTaken).toBeUndefined();

      const afterStep1 = engine.asServer().getState();
      const pendingAfterStep1 = afterStep1.G.pendingEffects;
      const hasChoiceSelection = pendingAfterStep1.some((p) => p.kind === "choice-selection");
      expect(hasChoiceSelection).toBe(true);

      const step2 = engine.asServer().takeAutomatedActionForCurrentActor();
      expect(step2.finalResult.success).toBe(true);
      expect(step2.fallbackTaken).toBeUndefined();

      const afterStep2 = engine.asServer().getState();
      const pendingAfterStep2 = afterStep2.G.pendingEffects;
      const hasDiscardChoice = pendingAfterStep2.some((p) => p.kind === "discard-choice");
      if (hasDiscardChoice) {
        const step3 = engine.asServer().takeAutomatedActionForCurrentActor();
        expect(step3.finalResult.success).toBe(true);
        expect(step3.fallbackTaken).toBeUndefined();
      }

      const finalHandSize = engine.asPlayerTwo().getBoard().players[PLAYER_TWO].hand.length;
      expect(finalHandSize).toBeLessThan(initialHandSize);
      expect(engine.asServer().getState().G.pendingEffects).toHaveLength(0);
    });

    it("resolves choice-selection and then discard-choice in sequence", () => {
      const source = createMockCharacter({
        id: "lucifer-test-source-2",
        name: "Lucifer Test 2",
        cost: 5,
      });
      const handCard1 = createMockActionCard({
        id: "hand-action-3",
        name: "Hand Action 3",
        cost: 2,
        text: "Test action",
        abilities: [],
      });
      const handCard2 = createMockCharacter({
        id: "hand-char-2",
        name: "Hand Char 2",
        cost: 3,
      });
      const handCard3 = createMockActionCard({
        id: "hand-action-4",
        name: "Hand Action 4",
        cost: 1,
        text: "Test action 2",
        abilities: [],
      });

      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: source, isDrying: false }],
          deck: 1,
        },
        {
          hand: [handCard1, handCard2, handCard3],
          deck: 1,
        },
      );
      const sourceId = engine.asPlayerOne().getCard(source).id as CardInstanceId;

      loadMutatedState(engine, (state) => {
        state.ctx.priority.holder = PLAYER_TWO;
        state.G.pendingEffects = [
          {
            id: "pending:lucifer-choice:2",
            type: "action-effect",
            kind: "choice-selection",
            sourceId,
            sourceCardId: sourceId,
            controllerId: PLAYER_ONE,
            chooserId: PLAYER_TWO,
            cardPlayed: getCardPlayedPayload({
              playerId: PLAYER_ONE,
              cardId: sourceId,
              cardType: "character",
            }),
            effect: {
              type: "choice",
              chooser: "OPPONENT",
              optionLabels: ["discard 2 cards", "discard 1 action card"],
              options: [
                {
                  amount: 2,
                  chosen: true,
                  target: "OPPONENT",
                  type: "discard",
                },
                {
                  amount: 1,
                  chosen: true,
                  target: "OPPONENT",
                  type: "discard",
                  filter: {
                    cardType: "action",
                  },
                },
              ],
            } satisfies Effect,
            resolutionInput: {},
          } satisfies PendingActionEffect,
        ];
        setPendingActionChoice(state, "pending:lucifer-choice:2", PLAYER_TWO);
      });

      const initialHandSize = engine.asPlayerTwo().getBoard().players[PLAYER_TWO].hand.length;

      const step1 = engine.asServer().takeAutomatedActionForCurrentActor();
      expect(step1.finalResult.success).toBe(true);
      expect(step1.fallbackTaken).toBeUndefined();

      const afterChoice = engine.asServer().getState();
      const pendingAfterChoice = afterChoice.G.pendingEffects;
      if (pendingAfterChoice.length > 0) {
        const discardPending = pendingAfterChoice.find(
          (p) => p.kind === "discard-choice" || p.kind === "choice-selection",
        );
        if (discardPending?.kind === "discard-choice") {
          const step2 = engine.asServer().takeAutomatedActionForCurrentActor();
          expect(step2.finalResult.success).toBe(true);
          expect(step2.fallbackTaken).toBeUndefined();
        }
      }

      const finalHandSize = engine.asPlayerTwo().getBoard().players[PLAYER_TWO].hand.length;
      expect(finalHandSize).toBeLessThan(initialHandSize);
      expect(engine.asServer().getState().G.pendingEffects).toHaveLength(0);
    });
  });
});
