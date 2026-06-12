import { describe, expect, it } from "bun:test";
import {
  type AvailableMove,
  type CardInstanceId,
  type LorcanaEngineBase,
  type MoveOption,
} from "@tcg/lorcana-engine";

import {
  buildExecutableMoves,
  buildMoveCategorySummaries,
  buildPendingResolutionMoves,
  buildPlayableHandCardIds,
  expandCardActionCategoryMoves,
  expandCardMoves,
  expandCategoryMoves,
} from "./derived-state.js";
import type { CardSnapshotMap } from "./board-utils.js";

type ProjectedBoardForPendingMoves = Parameters<typeof buildPendingResolutionMoves>[1];

function createBoard(
  overrides: Partial<ProjectedBoardForPendingMoves> = {},
): ProjectedBoardForPendingMoves {
  return {
    bagEffects: [],
    ...overrides,
  } as ProjectedBoardForPendingMoves;
}

function createStubEngine(options: {
  moveOptions?: Record<string, MoveOption[]>;
  callLog?: string[];
}): LorcanaEngineBase {
  const moveOptions = options.moveOptions ?? {};
  const callLog = options.callLog;

  return {
    getMoveOptions: (moveId: string, cardId: string | number) => {
      const key = `${moveId}:${String(cardId)}`;
      callLog?.push(key);
      return moveOptions[key] ?? moveOptions[String(cardId)] ?? [];
    },
    getBoard: () =>
      ({
        playerOrder: [],
      }) as unknown as ReturnType<LorcanaEngineBase["getBoard"]>,
    getClientPlayerId: () => "player_one",
    canUndo: () => false,
  } as unknown as LorcanaEngineBase;
}

function createAvailableMove(
  moveId: AvailableMove["moveId"],
  selectableCardIds: string[],
): AvailableMove {
  return {
    moveId,
    selectableCardIds,
  } as AvailableMove;
}

function toCardInstanceId(cardId: string): CardInstanceId {
  return cardId as unknown as CardInstanceId;
}

const cards = {
  smash: {
    cardId: "smash",
    definitionId: "def-smash",
    isMasked: false,
    label: "Smash",
    ownerId: "player_one",
    ownerSide: "playerOne",
    zoneId: "hand",
    cardType: "action",
    facePresentation: "faceUp",
  },
  targetA: {
    cardId: "targetA",
    definitionId: "def-targetA",
    isMasked: false,
    label: "Target A",
    ownerId: "player_two",
    ownerSide: "playerTwo",
    zoneId: "play",
    cardType: "character",
    facePresentation: "faceUp",
  },
  targetB: {
    cardId: "targetB",
    definitionId: "def-targetB",
    isMasked: false,
    label: "Target B",
    ownerId: "player_two",
    ownerSide: "playerTwo",
    zoneId: "play",
    cardType: "character",
    facePresentation: "faceUp",
  },
  singerA: {
    cardId: "singerA",
    definitionId: "def-singerA",
    isMasked: false,
    label: "Singer A",
    ownerId: "player_one",
    ownerSide: "playerOne",
    zoneId: "play",
    cardType: "character",
    facePresentation: "faceUp",
  },
  singerB: {
    cardId: "singerB",
    definitionId: "def-singerB",
    isMasked: false,
    label: "Singer B",
    ownerId: "player_one",
    ownerSide: "playerOne",
    zoneId: "play",
    cardType: "character",
    facePresentation: "faceUp",
  },
  bodyguard: {
    cardId: "bodyguard",
    definitionId: "def-bodyguard",
    isMasked: false,
    label: "Bodyguard Ally",
    ownerId: "player_one",
    ownerSide: "playerOne",
    zoneId: "hand",
    cardType: "character",
    keywords: ["Bodyguard"],
    facePresentation: "faceUp",
  },
  mayEnterExerted: {
    cardId: "mayEnterExerted",
    definitionId: "def-may-enter-exerted",
    isMasked: false,
    label: "Mickey Mouse - Expedition Leader",
    ownerId: "player_one",
    ownerSide: "playerOne",
    zoneId: "hand",
    cardType: "character",
    mayEnterPlayExertedOption: true,
    facePresentation: "faceUp",
  },
  forcedBodyguard: {
    cardId: "forcedBodyguard",
    definitionId: "def-forced-bodyguard",
    isMasked: false,
    label: "Forced Bodyguard",
    ownerId: "player_one",
    ownerSide: "playerOne",
    zoneId: "hand",
    cardType: "character",
    keywords: ["Bodyguard"],
    text: "This character enters play exerted.",
    facePresentation: "faceUp",
  },
} satisfies CardSnapshotMap;

describe("buildExecutableMoves", () => {
  it("expands targeted play-card options into one executable move per target", () => {
    const engine = createStubEngine({
      moveOptions: {
        smash: [
          { kind: "card", cardId: toCardInstanceId("targetA") },
          { kind: "card", cardId: toCardInstanceId("targetB") },
        ],
      },
    });

    const entries = buildExecutableMoves(
      engine,
      cards,
      [createAvailableMove("playCard", ["smash"])],
      [],
    );

    expect(entries).toHaveLength(2);
    expect(entries.map((entry) => entry.params)).toEqual([
      { cardId: "smash", cost: "standard", targets: ["targetA"] },
      { cardId: "smash", cost: "standard", targets: ["targetB"] },
    ]);
    expect(entries.map((entry) => entry.label)).toEqual(["Smash -> Target A", "Smash -> Target B"]);
  });

  it("falls back to the base play-card move when no preplay targets are available", () => {
    const engine = createStubEngine({
      moveOptions: {
        smash: [],
      },
    });

    const entries = buildExecutableMoves(
      engine,
      cards,
      [createAvailableMove("playCard", ["smash"])],
      [],
    );

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      id: "playCard:smash",
      moveId: "playCard",
      params: {
        cardId: "smash",
      },
      label: "Smash",
    });
  });

  it("builds a sing-together selection move from singCard options", () => {
    const engine = createStubEngine({
      moveOptions: {
        smash: [
          {
            kind: "singTogether",
            requiredTotal: 8,
            singers: [
              { cardId: toCardInstanceId("singerA"), value: 5 },
              { cardId: toCardInstanceId("singerB"), value: 3 },
            ],
          },
        ],
      },
    });

    const entries = buildExecutableMoves(
      engine,
      cards,
      [createAvailableMove("singCard", ["smash"])],
      [],
    );

    expect(entries).toEqual([
      expect.objectContaining({
        id: "singCard:smash:singTogether",
        moveId: "playCard",
        params: { cardId: "smash", cost: "singTogether" },
        presentation: expect.objectContaining({
          categoryId: "sing-card",
          optionLabel: "Sing Together",
          selectionMode: "singTogether",
          requiredValue: 8,
          candidateCards: [
            { cardId: "singerA", value: 5 },
            { cardId: "singerB", value: 3 },
          ],
        }),
      }),
    ]);
  });

  it("expands bodyguard character play into ready and exerted variants", () => {
    const engine = createStubEngine({ moveOptions: { bodyguard: [] } });

    const entries = buildExecutableMoves(
      engine,
      cards,
      [createAvailableMove("playCard", ["bodyguard"])],
      [],
    );

    expect(entries).toHaveLength(2);
    expect(entries.map((entry) => entry.params)).toEqual([
      { cardId: "bodyguard", cost: "standard" },
      { cardId: "bodyguard", cost: "standard", resolveOptional: true },
    ]);
    expect(entries.map((entry) => entry.presentation)).toEqual([
      expect.objectContaining({
        optionLabel: "Play Ready",
      }),
      expect.objectContaining({
        optionLabel: "Play Exerted",
      }),
    ]);
  });

  it("expands non-Bodyguard may-enter-play-exerted character play into ready and exerted variants", () => {
    const engine = createStubEngine({ moveOptions: { mayEnterExerted: [] } });

    const entries = buildExecutableMoves(
      engine,
      cards,
      [createAvailableMove("playCard", ["mayEnterExerted"])],
      [],
    );

    expect(entries).toHaveLength(2);
    expect(entries.map((entry) => entry.params)).toEqual([
      { cardId: "mayEnterExerted", cost: "standard" },
      { cardId: "mayEnterExerted", cost: "standard", resolveOptional: true },
    ]);
    expect(entries.map((entry) => entry.presentation)).toEqual([
      expect.objectContaining({
        optionLabel: "Play Ready",
      }),
      expect.objectContaining({
        optionLabel: "Play Exerted",
      }),
    ]);
  });

  it("does not add a redundant bodyguard choice when the card already enters play exerted", () => {
    const engine = createStubEngine({ moveOptions: { forcedBodyguard: [] } });

    const entries = buildExecutableMoves(
      engine,
      cards,
      [createAvailableMove("playCard", ["forcedBodyguard"])],
      [],
    );

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      params: { cardId: "forcedBodyguard" },
      label: "Forced Bodyguard",
    });
  });

  it("expands only the selected category instead of rebuilding unrelated categories", () => {
    const callLog: string[] = [];
    const engine = createStubEngine({
      callLog,
      moveOptions: {
        "playCard:smash": [{ kind: "card", cardId: toCardInstanceId("targetA") }],
        "challenge:attacker": [{ kind: "card", cardId: toCardInstanceId("targetB") }],
      },
    });

    const entries = expandCategoryMoves(
      engine,
      cards,
      [
        createAvailableMove("playCard", ["smash"]),
        createAvailableMove("putCardIntoInkwell", ["smash"]),
        createAvailableMove("challenge", ["attacker"]),
      ],
      [],
      "ink-card",
    );

    expect(entries).toEqual([
      expect.objectContaining({
        moveId: "putCardIntoInkwell",
        params: { cardId: "smash" },
      }),
    ]);
    expect(callLog).toEqual([]);
  });

  it("expands only the requested source card for card action views", () => {
    const callLog: string[] = [];
    const engine = createStubEngine({
      callLog,
      moveOptions: {
        "playCard:smash": [{ kind: "card", cardId: toCardInstanceId("targetA") }],
        "playCard:targetB": [{ kind: "card", cardId: toCardInstanceId("targetB") }],
      },
    });

    const entries = expandCardMoves(
      engine,
      cards,
      [createAvailableMove("playCard", ["smash", "targetB"])],
      [],
      "smash",
    );

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      moveId: "playCard",
      params: { cardId: "smash", targets: ["targetA"] },
    });
    expect(callLog).toEqual(["playCard:smash"]);
  });

  it("expands only the requested source card within the requested category", () => {
    const callLog: string[] = [];
    const engine = createStubEngine({
      callLog,
      moveOptions: {
        "challenge:smash": [{ kind: "card", cardId: toCardInstanceId("targetA") }],
        "challenge:targetB": [{ kind: "card", cardId: toCardInstanceId("targetB") }],
      },
    });

    const entries = expandCardActionCategoryMoves(
      engine,
      cards,
      [createAvailableMove("challenge", ["smash", "targetB"])],
      [],
      "smash",
      "challenge",
    );

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      moveId: "challenge",
      params: { attackerId: "smash", defenderId: "targetA" },
    });
    expect(callLog).toEqual(["challenge:smash"]);
  });
});

describe("buildMoveCategorySummaries", () => {
  it("includes quest-all when exactly one character can quest", () => {
    const engine = createStubEngine({});

    const summaries = buildMoveCategorySummaries(
      engine,
      [createAvailableMove("quest", ["singerA"]), createAvailableMove("questWithAll", [])],
      [],
    );

    expect(summaries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          categoryId: "quest",
          sourceCardIds: ["singerA"],
        }),
        expect.objectContaining({
          categoryId: "quest-all",
          isDirect: true,
        }),
      ]),
    );
  });

  it("includes undo category when engine.canUndo returns true", () => {
    const engine = {
      ...createStubEngine({}),
      canUndo: () => true,
    } as unknown as LorcanaEngineBase;

    const summaries = buildMoveCategorySummaries(engine, [], ["passTurn"]);

    expect(summaries).toEqual(
      expect.arrayContaining([expect.objectContaining({ categoryId: "undo", isDirect: true })]),
    );
  });

  it("omits undo category when engine.canUndo returns false", () => {
    const engine = createStubEngine({});

    const summaries = buildMoveCategorySummaries(engine, [], ["passTurn"]);

    expect(summaries.some((s) => s.categoryId === "undo")).toBe(false);
  });
});

describe("buildPlayableHandCardIds", () => {
  it("merges hand and discard ink sources from putCardIntoInkwell", () => {
    const available: AvailableMove[] = [
      createAvailableMove("putCardIntoInkwell", ["handInk", "discardInk"]),
      createAvailableMove("playCard", ["playMe"]),
    ];

    expect(buildPlayableHandCardIds(available).sort()).toEqual(
      ["discardInk", "handInk", "playMe"].sort(),
    );
  });
});

describe("put-toy-character-on-deck-bottom alternative cost", () => {
  const handCard: CardSnapshotMap[string] = {
    cardId: "hand-in-the-box",
    definitionId: "def-hitb",
    isMasked: false,
    label: "Hand-in-the-Box - Sid's Toy",
    ownerId: "player_one",
    ownerSide: "playerOne",
    zoneId: "hand",
    cardType: "character",
    facePresentation: "faceUp",
  };

  const toyInDiscard: CardSnapshotMap[string] = {
    cardId: "toy-discard",
    definitionId: "def-toy",
    isMasked: false,
    label: "Some Toy",
    ownerId: "player_one",
    ownerSide: "playerOne",
    zoneId: "discard",
    cardType: "character",
    facePresentation: "faceUp",
  };

  const nonToyInDiscard: CardSnapshotMap[string] = {
    cardId: "non-toy-discard",
    definitionId: "def-non-toy",
    isMasked: false,
    label: "Some Non-Toy",
    ownerId: "player_one",
    ownerSide: "playerOne",
    zoneId: "discard",
    cardType: "character",
    facePresentation: "faceUp",
  };

  const cardsMap: CardSnapshotMap = {
    "hand-in-the-box": handCard,
    "toy-discard": toyInDiscard,
    "non-toy-discard": nonToyInDiscard,
  };

  function createEngineWithToyInDiscard(toyDiscardIds: string[]): LorcanaEngineBase {
    return {
      getMoveOptions: () => [],
      getBoard: () =>
        ({
          playerOrder: [],
          players: {
            player_one: {
              play: [],
              discard: toyDiscardIds,
            },
          },
          cards: {},
        }) as unknown as ReturnType<LorcanaEngineBase["getBoard"]>,
      getClientPlayerId: () => "player_one",
      canUndo: () => false,
      getCardDefinitionByInstanceId: (id: string) => {
        if (id === "hand-in-the-box") {
          return {
            cardType: "character",
            abilities: [
              {
                type: "action",
                alternativeCost: "put-toy-character-on-deck-bottom",
              },
            ],
          };
        }
        if (id === "toy-discard") {
          return {
            cardType: "character",
            classifications: ["Toy"],
          };
        }
        if (id === "non-toy-discard") {
          return {
            cardType: "character",
            classifications: ["Hero"],
          };
        }
        return undefined;
      },
    } as unknown as LorcanaEngineBase;
  }

  it("generates a put-on-deck-bottom move entry with Toy character candidates from discard", () => {
    const engine = createEngineWithToyInDiscard(["toy-discard"]);

    const entries = buildExecutableMoves(
      engine,
      cardsMap,
      [createAvailableMove("playCard", ["hand-in-the-box"])],
      [],
    );

    const putOnDeckBottomEntry = entries.find(
      (e) => (e.params as { cost?: string }).cost === "put-on-deck-bottom",
    );

    expect(putOnDeckBottomEntry).toBeDefined();
    expect(putOnDeckBottomEntry?.id).toBe("playCard:hand-in-the-box:put-on-deck-bottom");
    expect(putOnDeckBottomEntry?.presentation).toMatchObject({
      categoryId: "play-card",
      selectableCosts: [
        {
          kind: "putOnDeckBottom",
          count: 1,
          candidateCardIds: ["toy-discard"],
          zone: "discard",
        },
      ],
    });
  });

  it("does not generate a put-on-deck-bottom move entry when no Toy character is in discard", () => {
    const engine = createEngineWithToyInDiscard(["non-toy-discard"]);

    const entries = buildExecutableMoves(
      engine,
      cardsMap,
      [createAvailableMove("playCard", ["hand-in-the-box"])],
      [],
    );

    const putOnDeckBottomEntry = entries.find(
      (e) => (e.params as { cost?: string }).cost === "put-on-deck-bottom",
    );
    expect(putOnDeckBottomEntry).toBeUndefined();
  });

  it("does not generate a put-on-deck-bottom move entry when discard is empty", () => {
    const engine = createEngineWithToyInDiscard([]);

    const entries = buildExecutableMoves(
      engine,
      cardsMap,
      [createAvailableMove("playCard", ["hand-in-the-box"])],
      [],
    );

    const putOnDeckBottomEntry = entries.find(
      (e) => (e.params as { cost?: string }).cost === "put-on-deck-bottom",
    );
    expect(putOnDeckBottomEntry).toBeUndefined();
  });
});

describe("buildPendingResolutionMoves", () => {
  it("returns an empty list when no legal pending moves are available", () => {
    const board = createBoard();
    expect(buildPendingResolutionMoves([], board)).toEqual([]);
  });

  it("surfaces a resolveEffect entry only when both the move is legal and pendingChoice has a requestID", () => {
    const boardWithChoice = createBoard({
      pendingChoice: {
        type: "target-selection",
        playerID: "p1",
        requestID: "req-123",
      } as ProjectedBoardForPendingMoves["pendingChoice"],
    });

    expect(buildPendingResolutionMoves(["resolveEffect"], boardWithChoice)).toEqual([
      {
        id: "resolveEffect:req-123",
        moveId: "resolveEffect",
        params: { effectId: "req-123", params: {} },
      },
    ]);

    // Legal but no pending choice → no entry.
    expect(buildPendingResolutionMoves(["resolveEffect"], createBoard())).toEqual([]);

    // Pending choice but move not legal → no entry.
    expect(buildPendingResolutionMoves([], boardWithChoice)).toEqual([]);
  });

  it("produces one resolveBag entry per bag effect when resolveBag is legal", () => {
    const board = createBoard({
      bagEffects: [{ id: "bag-1" }, { id: "bag-2" }] as ProjectedBoardForPendingMoves["bagEffects"],
    });

    const entries = buildPendingResolutionMoves(["resolveBag"], board);

    expect(entries.map((entry) => entry.id)).toEqual(["resolveBag:bag-1", "resolveBag:bag-2"]);
    expect(entries.every((entry) => entry.moveId === "resolveBag")).toBe(true);
    expect(entries.map((entry) => entry.params)).toEqual([{ bagId: "bag-1" }, { bagId: "bag-2" }]);
  });

  it("sorts mixed resolveBag and resolveEffect entries deterministically by id", () => {
    const board = createBoard({
      bagEffects: [{ id: "bag-z" }, { id: "bag-a" }] as ProjectedBoardForPendingMoves["bagEffects"],
      pendingChoice: {
        type: "target-selection",
        playerID: "p1",
        requestID: "req-m",
      } as ProjectedBoardForPendingMoves["pendingChoice"],
    });

    const entries = buildPendingResolutionMoves(["resolveBag", "resolveEffect"], board);

    expect(entries.map((entry) => entry.id)).toEqual([
      "resolveBag:bag-a",
      "resolveBag:bag-z",
      "resolveEffect:req-m",
    ]);
  });
});
