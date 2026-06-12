import { afterEach, describe, expect, it } from "bun:test";
import {
  createPlayerId,
  type CardInstanceId,
  type LorcanaProjectedBoardView,
} from "@tcg/lorcana-engine";
import "../../testing/public-env";
import { m } from "$lib/i18n/messages.js";

import { LorcanaSidebarPresenter } from "@/features/simulator/presenters/sidebar-presenter.svelte.js";
import type { LorcanaGameContextValue } from "@/features/simulator/context/game-context.svelte.js";
import { DEFAULT_LORCANA_PLAYER_VISUAL_SETTINGS } from "@/features/simulator/model/player-visual-settings.js";
import { createLogEntry } from "@/features/simulator-devtools/test-data/factories.js";
import { createCardSnapshot } from "@/features/simulator-devtools/test-data/factories.js";
import type {
  CardActionView,
  ExecutableMoveEntry,
  LorcanaSimulatorMoveParams,
} from "@/features/simulator/model/contracts.js";
import type { CardSnapshotMap } from "@/features/simulator/model/board-utils.js";

class MemoryStorage implements Storage {
  #entries = new Map<string, string>();

  get length(): number {
    return this.#entries.size;
  }

  clear(): void {
    this.#entries.clear();
  }

  getItem(key: string): string | null {
    return this.#entries.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.#entries.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.#entries.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#entries.set(key, value);
  }
}

function getStubSourceCardId(move: ExecutableMoveEntry): string | null {
  const params = move.params as Record<string, unknown>;
  if (typeof params.cardId === "string") return params.cardId;
  if (typeof params.attackerId === "string") return params.attackerId;
  if (typeof params.characterId === "string") return params.characterId;
  return null;
}

function createGameContextStub(
  overrides: Partial<LorcanaGameContextValue> = {},
): LorcanaGameContextValue {
  const executableMovesFn = overrides.executableMoves ?? (() => []);
  const cardSnapshotsByIdFn = overrides.cardSnapshotsById ?? (() => ({}));
  return {
    boardSnapshot: () => null,
    cardSnapshotsById: cardSnapshotsByIdFn,
    resolveCardSnapshot:
      overrides.resolveCardSnapshot ??
      ((cardId: string) => (cardSnapshotsByIdFn() as CardSnapshotMap)[cardId] ?? null),
    resolveCardName: overrides.resolveCardName ?? (() => null),
    resolveCardInkable: overrides.resolveCardInkable ?? (() => null),
    resolvePlayerName: () => null,
    isPlayerMobile: () => false,
    getPlayerSummary: () => null,
    executableMoves: executableMovesFn,
    moveCategorySummaries: () => [],
    moveCategoryCount: () => 0,
    expandCardMoves: (cardId: string) =>
      executableMovesFn().filter((move) => getStubSourceCardId(move) === cardId),
    expandCardActionCategoryMoves: (cardId: string, categoryId: string) =>
      executableMovesFn().filter(
        (move) =>
          getStubSourceCardId(move) === cardId && move.presentation.categoryId === categoryId,
      ),
    expandCategoryMoves: (categoryId: string) =>
      executableMovesFn().filter((move) => move.presentation.categoryId === categoryId),
    challengeReadyCardIds: () => [],
    moveLogEntries: () => [],
    pendingResolutionMoves: () => [],
    playableHandCardIds: () => [],
    validChallengeTargetIds: () => [],
    invalidChallengeTargetReasons: () => ({}),
    ownerSide: () => null,
    pregameActiveSide: () => null,
    pregamePhase: () => null,
    canActInPregame: () => false,
    statusMessage: () => "",
    selectedCardId: () => null,
    selectedMulliganCardIds: () => [],
    pendingErrorReason: () => null,
    pendingMoveError: () => null,
    pendingResolutionAutoOpenStateId: () => null,
    isOptimisticMovePending: () => false,
    challengeSourceCardId: () => null,
    challengeMode: () => false,
    animations: () => [],
    questAnimations: () => [],
    challengeAnimations: () => [],
    overlayAnnouncements: () => [],
    cardEffectAnimations: () => [],
    animationSpeed: () => "normal" as const,
    setAnimationSpeed: () => {},
    soundVolume: () => 50,
    setSoundVolume: () => {},
    showZoneCounters: () => false,
    setShowZoneCounters: () => {},
    previewChallenge: () => null,
    executeMove: () => false,
    playCard: () => false,
    ink: () => false,
    canMoveCharacterToLocation: () => false,
    canDropHandCardIntoZone: () => false,
    handleBoardAnchorsChange: () => {},
    getOwnerIdForSide: () => null,
    getPlayerVisualSettings: () => DEFAULT_LORCANA_PLAYER_VISUAL_SETTINGS,
    getPlayerVisualSettingsByOwnerId: () => DEFAULT_LORCANA_PLAYER_VISUAL_SETTINGS,
    getOwnPlayerVisualSettings: () => undefined,
    setOwnPlayerVisualSettings: () => {},
    setSelectedCardId: () => {},
    setSelectedMulliganCardIds: () => {},
    setChallengeSourceCardId: () => {},
    setPendingError: () => {},
    setStatusMessage: () => {},
    handleLocaleChanged: () => {},
    runAnimation: () => false,
    runQuestAnimation: () => false,
    runChallengeAnimation: () => false,
    ...overrides,
  } as LorcanaGameContextValue;
}

const originalLocalStorage = globalThis.localStorage;

afterEach(() => {
  if (originalLocalStorage) {
    globalThis.localStorage = originalLocalStorage;
    return;
  }

  Reflect.deleteProperty(globalThis, "localStorage");
});

describe("LorcanaSidebarPresenter", () => {
  const playerOneId = createPlayerId("player_one");
  const playerTwoId = createPlayerId("player_two");

  function createExecutableMove(move: ExecutableMoveEntry): ExecutableMoveEntry {
    return move;
  }

  function createBoardWithBagEffect(payload: unknown): LorcanaProjectedBoardView {
    return {
      gameID: "game-1",
      matchID: "match-1",
      stateID: 1,
      playerOrder: [playerOneId, playerTwoId],
      turnPlayer: playerOneId,
      priorityPlayer: playerOneId,
      turnNumber: 1,
      phase: "mainPhase",
      gameSegment: "main",
      pendingMulligan: [],
      choosingFirstPlayer: null,
      status: "playing",
      winner: null,
      reason: null,
      timerView: {
        serverTimestamp: 0,
        players: {},
      },
      activeEffects: [],
      pendingEffects: [],
      bagEffects: [
        {
          id: "bag-1",
          type: "triggered",
          controllerId: playerOneId,
          chooserId: playerOneId,
          sourceId: "card-1",
          payload,
        },
      ],
      cards: {},
      players: {
        player_one: {
          canAddCardToInkwell: false,
          lore: 0,
          deckCount: 50,
          handCount: 0,
          hand: [],
          play: [],
          inkwell: [],
          discard: [],
        },
        player_two: {
          canAddCardToInkwell: false,
          lore: 0,
          deckCount: 50,
          handCount: 0,
          hand: [],
          play: [],
          inkwell: [],
          discard: [],
        },
      },
    };
  }

  function createBoardWithPendingEffect(payload: unknown): LorcanaProjectedBoardView {
    return {
      gameID: "game-1",
      matchID: "match-1",
      stateID: 1,
      playerOrder: [playerOneId, playerTwoId],
      turnPlayer: playerOneId,
      priorityPlayer: playerOneId,
      turnNumber: 1,
      phase: "mainPhase",
      gameSegment: "main",
      pendingMulligan: [],
      choosingFirstPlayer: null,
      status: "playing",
      winner: null,
      reason: null,
      timerView: {
        serverTimestamp: 0,
        players: {},
      },
      activeEffects: [],
      pendingChoice: {
        type: "action-effect",
        playerID: playerOneId,
        requestID: "pending-1",
      },
      pendingEffects: [
        {
          id: "pending-1",
          type: "action-effect",
          sourceId: "card-1",
          payload,
        },
      ],
      bagEffects: [],
      cards: {},
      players: {
        player_one: {
          canAddCardToInkwell: false,
          lore: 0,
          deckCount: 50,
          handCount: 0,
          hand: [],
          play: [],
          inkwell: [],
          discard: [],
        },
        player_two: {
          canAddCardToInkwell: false,
          lore: 0,
          deckCount: 50,
          handCount: 0,
          hand: [],
          play: [],
          inkwell: [],
          discard: [],
        },
      },
    };
  }

  it("exposes move log entries from the game context", () => {
    const entries = [createLogEntry("Played Stitch")];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        moveLogEntries: () => entries,
      }),
    );

    expect(presenter.moveLogEntries).toEqual(entries);
  });

  it("initializes the raw-log toggle from localStorage", () => {
    const storage = new MemoryStorage();
    storage.setItem("lorcana.simulator.rawLogRegistryJson", "true");
    globalThis.localStorage = storage;

    const presenter = new LorcanaSidebarPresenter(createGameContextStub());
    presenter.initializeLocale();

    expect(presenter.showRawLogRegistryJson).toBe(true);
  });

  it("defaults skip action confirmation to disabled when no value is stored", () => {
    const storage = new MemoryStorage();
    globalThis.localStorage = storage;

    const presenter = new LorcanaSidebarPresenter(createGameContextStub());
    presenter.initializeLocale();

    expect(presenter.skipActionConfirmation).toBe(true);
  });

  it("persists raw-log toggle changes back to localStorage", () => {
    const storage = new MemoryStorage();
    globalThis.localStorage = storage;

    const presenter = new LorcanaSidebarPresenter(createGameContextStub());
    presenter.handleRawLogRegistryToggle(true);

    expect(presenter.showRawLogRegistryJson).toBe(true);
    expect(storage.getItem("lorcana.simulator.rawLogRegistryJson")).toBe("true");
  });

  it("initializes sound volume from localStorage", () => {
    const storage = new MemoryStorage();
    storage.setItem("lorcana.simulator.soundVolume", "75");
    globalThis.localStorage = storage;

    const forwarded: number[] = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        setSoundVolume: (v: number) => {
          forwarded.push(v);
        },
      }),
    );
    presenter.initializeLocale();

    expect(presenter.soundVolume).toBe(75);
    expect(forwarded).toEqual([75]);
  });

  it("clamps and persists sound volume changes to localStorage", () => {
    const storage = new MemoryStorage();
    globalThis.localStorage = storage;

    const forwarded: number[] = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        setSoundVolume: (v: number) => {
          forwarded.push(v);
        },
      }),
    );

    presenter.handleSoundVolumeChange(120);
    expect(presenter.soundVolume).toBe(100);
    expect(forwarded).toEqual([100]);
    expect(storage.getItem("lorcana.simulator.soundVolume")).toBe("100");

    presenter.handleSoundVolumeChange(-10);
    expect(presenter.soundVolume).toBe(0);
    expect(forwarded).toEqual([100, 0]);
    expect(storage.getItem("lorcana.simulator.soundVolume")).toBe("0");
  });

  it("ignores invalid stored sound volume values", () => {
    const storage = new MemoryStorage();
    storage.setItem("lorcana.simulator.soundVolume", "notanumber");
    globalThis.localStorage = storage;

    const presenter = new LorcanaSidebarPresenter(createGameContextStub());
    presenter.initializeLocale();

    expect(presenter.soundVolume).toBe(50);
  });

  it("updates selected card back locally and forwards it to the board context", () => {
    const storage = new MemoryStorage();
    globalThis.localStorage = storage;
    const visualUpdates: Array<{ cardBack?: string; playmat?: string }> = [];
    let ownVisualSettings: { cardBack?: string; playmat?: string } = {
      cardBack: "default",
      playmat: "default",
    };

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        getOwnPlayerVisualSettings: () => ownVisualSettings,
        setOwnPlayerVisualSettings: (settings) => {
          ownVisualSettings = { ...ownVisualSettings, ...settings };
          visualUpdates.push(settings);
        },
      }),
    );

    presenter.handleCardBackChange("cosmos");

    expect(presenter.selectedCardBack).toBe("cosmos");
    expect(storage.getItem("lorcana.simulator.selectedCardBack")).toBe("cosmos");
    expect(ownVisualSettings).toEqual({ cardBack: "cosmos", playmat: "default" });
    expect(visualUpdates).toEqual([{ cardBack: "cosmos" }]);
  });

  it("updates selected playmat locally and forwards it to the board context", () => {
    const storage = new MemoryStorage();
    globalThis.localStorage = storage;
    const visualUpdates: Array<{ cardBack?: string; playmat?: string }> = [];
    let ownVisualSettings: { cardBack?: string; playmat?: string } = {
      cardBack: "default",
      playmat: "default",
    };

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        getOwnPlayerVisualSettings: () => ownVisualSettings,
        setOwnPlayerVisualSettings: (settings) => {
          ownVisualSettings = { ...ownVisualSettings, ...settings };
          visualUpdates.push(settings);
        },
      }),
    );

    presenter.handlePlaymatChange("pooh");

    expect(presenter.selectedPlaymat).toBe("pooh");
    expect(storage.getItem("lorcana.simulator.selectedPlaymat")).toBe("pooh");
    expect(ownVisualSettings).toEqual({ cardBack: "default", playmat: "pooh" });
    expect(visualUpdates).toEqual([{ playmat: "pooh" }]);
  });

  it("opens optional bag effects in the sidebar and submits the selected branch", () => {
    const executedMoves: Array<{
      moveId: string;
      params: Record<string, unknown>;
      options: { clearChallengeMode?: boolean; clearSelection?: boolean; status?: string };
    }> = [];
    const card = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Maleficent - Sorceress",
      type: "character",
    });
    card.textEntries = [
      {
        title: "POWER FROM DARKNESS",
        description: "When you play this character, you may draw a card.",
      },
    ];
    const board = createBoardWithBagEffect({
      id: "bag-1",
      sourceId: "card-1",
      sourceCardId: "card-1",
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "triggered-ability",
      effect: {
        type: "draw",
        target: "CONTROLLER",
        amount: 1,
      },
    });
    board.bagEffects = [
      {
        ...board.bagEffects[0]!,
        selectionContext: {
          origin: "bag",
          requestId: "bag-1",
          kind: "optional-selection",
          sourceCardId: "card-1" as CardInstanceId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "resolveOptional",
          acceptLabel: "Accept",
          rejectLabel: "Decline",
        },
      },
    ];

    const presenterWithSelection = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne" as const,
        getOwnerIdForSide: (side) => (side === "playerOne" ? playerOneId : playerTwoId),
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [card.cardId]: card,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveBag:bag-1",
            moveId: "resolveBag",
            params: { bagId: "bag-1" },
          },
        ],
        executeMove: (moveId, params, options) => {
          executedMoves.push({
            moveId,
            params: params as Record<string, unknown>,
            options: {
              clearChallengeMode: options?.clearChallengeMode,
              clearSelection: options?.clearSelection,
              status: options?.status,
            },
          });
          return true;
        },
      }),
    );

    const [item] = presenterWithSelection.pendingEffectsPopoverItems;
    expect(item).toMatchObject({
      canResolve: false,
      canAccept: true,
      canReject: true,
    });
    expect(item?.detail).toBe(
      "Resolve optional effect from Maleficent - Sorceress: POWER FROM DARKNESS. When you play this character, you may draw a card.",
    );

    item?.onAccept?.();

    expect(executedMoves).toEqual([
      {
        moveId: "resolveBag",
        params: {
          bagId: "bag-1",
          params: {
            resolveOptional: true,
          },
        },
        options: {
          clearChallengeMode: false,
          clearSelection: false,
          status: "Accepted bag effect",
        },
      },
    ]);
  });

  it("shows inline accept and decline actions for auto-opened optional pending effects", () => {
    const executedMoves: Array<Record<string, unknown>> = [];
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Maleficent - Sorceress",
      type: "character",
    });
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCard.cardId as CardInstanceId,
      sourceCardId: sourceCard.cardId as CardInstanceId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "optional-selection",
      effect: {
        type: "draw",
        target: "CONTROLLER",
        amount: 1,
      },
    });
    board.stateID = 12;
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "optional-selection",
          sourceCardId: sourceCard.cardId as CardInstanceId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "resolveOptional",
          acceptLabel: "Accept",
          rejectLabel: "Decline",
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
        pendingResolutionAutoOpenStateId: () => 12,
        executeMove: (_moveId, params) => {
          executedMoves.push(params as Record<string, unknown>);
          return true;
        },
      }),
    );

    presenter.syncAutoOpenPendingResolution();

    const [item] = presenter.pendingEffectsPopoverItems;
    expect(item?.statusMessage).toBe("Deciding whether to resolve...");
    expect(item?.inlineActions?.map((action) => action.label)).toEqual(["Accept", "Decline"]);

    item?.inlineActions?.[0]?.onClick();

    expect(presenter.resolutionSelectionSession).toBeNull();
    expect(executedMoves).toEqual([
      {
        effectId: "pending-1",
        params: {
          resolveOptional: true,
        },
      },
    ]);
  });

  it("starts an inline resolution session for bag target selection and submits the chosen target", () => {
    const executedMoves: Array<{
      moveId: string;
      params: Record<string, unknown>;
      options: { clearChallengeMode?: boolean; clearSelection?: boolean; status?: string };
    }> = [];
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Rapunzel - Gifted with Healing",
      type: "character",
    });
    const targetCard = createCardSnapshot("playerTwo", "play", {
      id: "target-1",
      name: "Isabela Madrigal - Golden Child",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const targetCardId = targetCard.cardId as CardInstanceId;
    const board = createBoardWithBagEffect({
      id: "bag-1",
      sourceId: sourceCardId,
      sourceCardId: sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "triggered",
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
    });
    board.bagEffects = [
      {
        ...board.bagEffects[0]!,
        selectionContext: {
          origin: "bag",
          requestId: "bag-1",
          kind: "target-selection",
          sourceCardId: sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "targets",
          targetDsl: [
            {
              selector: "chosen",
              count: 1,
              zones: ["play"],
              cardTypes: ["character"],
            },
          ],
          cardCandidateIds: [targetCardId],
          playerCandidateIds: [],
          allowedZones: ["play"],
          minSelections: 1,
          maxSelections: 1,
          ordered: false,
          autoRejected: false,
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne" as const,
        getOwnerIdForSide: (side) => (side === "playerOne" ? playerOneId : playerTwoId),
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveBag:bag-1",
            moveId: "resolveBag",
            params: { bagId: "bag-1" },
          },
        ],
        executeMove: (moveId, params, options) => {
          executedMoves.push({
            moveId,
            params: params as Record<string, unknown>,
            options: {
              clearChallengeMode: options?.clearChallengeMode,
              clearSelection: options?.clearSelection,
              status: options?.status,
            },
          });
          return true;
        },
      }),
    );
    presenter.skipActionConfirmation = false;

    const [item] = presenter.pendingEffectsPopoverItems;
    item?.onResolve?.();

    expect(executedMoves).toEqual([]);
    expect(presenter.resolutionSelectionSession?.context.kind).toBe("target-selection");
    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-target",
      candidateEntries: [
        {
          cardId: targetCard.cardId,
          label: targetCard.label,
          selected: false,
        },
      ],
    });
    expect(presenter.selectableActionSessionCardIds).toEqual([targetCard.cardId]);

    expect(presenter.handleActionSessionCardSelection(targetCard)).toBe(true);
    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-target",
      candidateEntries: [
        {
          cardId: targetCard.cardId,
          selected: true,
        },
      ],
    });
    expect(presenter.canConfirmResolutionSelection).toBe(true);
    expect(presenter.confirmActionSelection()).toBe(true);

    expect(executedMoves).toEqual([
      {
        moveId: "resolveBag",
        params: {
          bagId: "bag-1",
          params: {
            targets: [targetCard.cardId],
          },
        },
        options: {
          clearChallengeMode: false,
          clearSelection: true,
          status: "Resolved effect input",
        },
      },
    ]);
  });

  it("confirms an up-to discard target selection for bag resolutions", () => {
    const executedMoves: Array<{
      moveId: string;
      params: Record<string, unknown>;
      options: { clearChallengeMode?: boolean; clearSelection?: boolean; status?: string };
    }> = [];
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Taran - Magically Armed",
      type: "character",
    });
    const firstDiscardCard = createCardSnapshot("playerOne", "discard", {
      id: "discard-1",
      name: "Scroop - Odious Mutineer",
      type: "character",
    });
    const secondDiscardCard = createCardSnapshot("playerTwo", "discard", {
      id: "discard-2",
      name: "Captain Hook - Forceful Duelist",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const firstDiscardCardId = firstDiscardCard.cardId as CardInstanceId;
    const secondDiscardCardId = secondDiscardCard.cardId as CardInstanceId;
    const board = createBoardWithBagEffect({
      id: "bag-1",
      sourceId: sourceCardId,
      sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "triggered",
      effect: {
        type: "put-on-bottom",
        target: "CHOSEN_CARD",
      },
    });
    board.bagEffects = [
      {
        ...board.bagEffects[0]!,
        selectionContext: {
          origin: "bag",
          requestId: "bag-1",
          kind: "target-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "targets",
          targetDsl: [
            {
              selector: "chosen",
              count: { upTo: 2 },
              owner: "any",
              zones: ["discard"],
            },
          ],
          cardCandidateIds: [firstDiscardCardId, secondDiscardCardId],
          playerCandidateIds: [],
          allowedZones: ["discard"],
          minSelections: 0,
          maxSelections: 2,
          ordered: false,
          autoRejected: false,
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne" as const,
        getOwnerIdForSide: (side) => (side === "playerOne" ? playerOneId : playerTwoId),
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [firstDiscardCard.cardId]: firstDiscardCard,
          [secondDiscardCard.cardId]: secondDiscardCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveBag:bag-1",
            moveId: "resolveBag",
            params: { bagId: "bag-1" },
          },
        ],
        executeMove: (moveId, params, options) => {
          executedMoves.push({
            moveId,
            params: params as Record<string, unknown>,
            options: {
              clearChallengeMode: options?.clearChallengeMode,
              clearSelection: options?.clearSelection,
              status: options?.status,
            },
          });
          return true;
        },
      }),
    );
    presenter.skipActionConfirmation = false;

    const [item] = presenter.pendingEffectsPopoverItems;
    item?.onResolve?.();

    expect(executedMoves).toEqual([]);
    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-target",
      candidateEntries: [
        {
          cardId: firstDiscardCard.cardId,
          label: firstDiscardCard.label,
          selected: false,
        },
        {
          cardId: secondDiscardCard.cardId,
          label: secondDiscardCard.label,
          selected: false,
        },
      ],
      minimumSelections: 0,
      maximumSelections: 2,
      canConfirm: true,
    });
    expect(presenter.selectableActionSessionCardIds).toEqual([
      firstDiscardCard.cardId,
      secondDiscardCard.cardId,
    ]);

    expect(presenter.handleActionSessionCardSelection(firstDiscardCard)).toBe(true);
    expect(presenter.handleActionSessionCardSelection(secondDiscardCard)).toBe(true);
    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-target",
      candidateEntries: [
        {
          cardId: firstDiscardCard.cardId,
          selected: true,
        },
        {
          cardId: secondDiscardCard.cardId,
          selected: true,
        },
      ],
      canConfirm: true,
    });
    expect(presenter.canConfirmResolutionSelection).toBe(true);
    expect(presenter.confirmActionSelection()).toBe(true);

    expect(executedMoves).toEqual([
      {
        moveId: "resolveBag",
        params: {
          bagId: "bag-1",
          params: {
            targets: [firstDiscardCard.cardId, secondDiscardCard.cardId],
          },
        },
        options: {
          clearChallengeMode: false,
          clearSelection: true,
          status: "Resolved effect input",
        },
      },
    ]);
  });

  it("shows 'Arrange cards' as primary action for scry-selection pending effects", () => {
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Merlin - Goat",
      type: "character",
    });
    const revealedCard = createCardSnapshot("playerOne", "deck", {
      id: "revealed-1",
      name: "Mickey Mouse - Brave Little Tailor",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const revealedCardId = revealedCard.cardId as CardInstanceId;
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCardId,
      sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "scry-selection",
      effect: {
        type: "scry",
        amount: 1,
      },
    });
    board.stateID = 12;
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "scry-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "destinations",
          amount: 1,
          revealedCardIds: [revealedCardId],
          revealedCards: [
            {
              cardId: revealedCardId,
              label: revealedCard.label,
              cardType: "character",
              cost: 8,
              classifications: ["Hero"],
            },
          ],
          destinationRules: [
            { id: "top", zone: "deck-top", min: 0, max: null, remainder: true },
            { id: "bottom", zone: "deck-bottom", min: 0, max: null, remainder: false },
          ],
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne" as const,
        getOwnerIdForSide: (side) => (side === "playerOne" ? playerOneId : playerTwoId),
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [revealedCard.cardId]: revealedCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
      }),
    );

    const [item] = presenter.pendingEffectsPopoverItems;
    expect(item).toBeDefined();
    expect(item?.primaryActionLabel).toBe(m["sim.actions.label.arrangeCards"]({}));
    expect(item?.onPrimaryAction).toBeDefined();
    // Scry effects should NOT have onResolve (they use onPrimaryAction instead)
    expect(item?.onResolve).toBeUndefined();
  });

  it("auto-opens the single pending resolution selection after a card play", () => {
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Rapunzel - Gifted with Healing",
      type: "character",
    });
    const targetCard = createCardSnapshot("playerTwo", "play", {
      id: "target-1",
      name: "Isabela Madrigal - Golden Child",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const targetCardId = targetCard.cardId as CardInstanceId;
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCardId,
      sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "target-selection",
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
    });
    board.stateID = 12;
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "target-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "targets",
          targetDsl: [
            {
              selector: "chosen",
              count: 1,
              zones: ["play"],
              cardTypes: ["character"],
            },
          ],
          cardCandidateIds: [targetCardId],
          playerCandidateIds: [],
          allowedZones: ["play"],
          minSelections: 1,
          maxSelections: 1,
          ordered: false,
          autoRejected: false,
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
        pendingResolutionAutoOpenStateId: () => 12,
      }),
    );

    expect(presenter.resolutionSelectionSession).toBeNull();

    presenter.syncAutoOpenPendingResolution();

    expect(presenter.resolutionSelectionSession?.context.kind).toBe("target-selection");
    expect(presenter.selectableActionSessionCardIds).toEqual([targetCard.cardId]);
  });

  it("auto-opens the single optional pending resolution into the sidebar", () => {
    const executedMoves: Array<Record<string, unknown>> = [];
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Maleficent - Sorceress",
      type: "character",
    });
    sourceCard.textEntries = [
      {
        title: "POWER FROM DARKNESS",
        description: "When you play this character, you may draw a card.",
      },
    ];
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCard.cardId as CardInstanceId,
      sourceCardId: sourceCard.cardId as CardInstanceId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "optional-selection",
      effect: {
        type: "draw",
        target: "CONTROLLER",
        amount: 1,
      },
    });
    board.stateID = 12;
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "optional-selection",
          sourceCardId: sourceCard.cardId as CardInstanceId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "resolveOptional",
          acceptLabel: "Accept",
          rejectLabel: "Decline",
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
        pendingResolutionAutoOpenStateId: () => 12,
        executeMove: (_moveId, params) => {
          executedMoves.push(params as Record<string, unknown>);
          return true;
        },
      }),
    );

    presenter.syncAutoOpenPendingResolution();

    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-optional",
      message:
        "Resolve optional effect from Maleficent - Sorceress: POWER FROM DARKNESS. When you play this character, you may draw a card.",
      entries: [
        { moveId: "accept", label: "Accept" },
        { moveId: "reject", label: "Decline" },
      ],
      canCancel: false,
      canConfirm: false,
    });
    expect(presenter.activePlayerGuidance[0]?.message).toBe(
      "Resolve optional effect from Maleficent - Sorceress: POWER FROM DARKNESS. When you play this character, you may draw a card.",
    );
    expect(presenter.activePlayerGuidance[0]?.actions.map((action) => action.label)).toEqual([
      "Accept",
      "Decline",
    ]);
    expect(presenter.pendingEffectsPopoverItems[0]?.onCancel).toBeUndefined();

    expect(presenter.handleAvailableMovesSelectionOption("accept")).toBe(true);
    expect(presenter.resolutionSelectionSession).toBeNull();
    expect(executedMoves).toEqual([
      {
        effectId: "pending-1",
        params: {
          resolveOptional: true,
        },
      },
    ]);
  });

  it("does not show decline for auto-opened follow-up target selection from an accepted optional effect", () => {
    const executedMoves: Array<Record<string, unknown>> = [];
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Pride Lands - Jungle Oasis",
      type: "location",
    });
    const targetCard = createCardSnapshot("playerOne", "discard", {
      id: "target-1",
      name: "Donald Duck - Pie Slinger",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const targetCardId = targetCard.cardId as CardInstanceId;
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCardId,
      sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "target-selection",
      effect: {
        type: "play",
        target: "CHOSEN_CHARACTER",
      },
    });
    board.stateID = 13;
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "target-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: { resolveOptional: true },
          submitField: "targets",
          targetDsl: [
            {
              selector: "chosen",
              count: 1,
              zones: ["discard"],
              cardTypes: ["character"],
            },
          ],
          cardCandidateIds: [targetCardId],
          playerCandidateIds: [],
          allowedZones: ["discard"],
          minSelections: 1,
          maxSelections: 1,
          ordered: false,
          autoRejected: false,
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
        pendingResolutionAutoOpenStateId: () => 13,
        executeMove: (_moveId, params) => {
          executedMoves.push(params as Record<string, unknown>);
          return true;
        },
      }),
    );

    presenter.syncAutoOpenPendingResolution();

    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-target",
      canDecline: false,
      declineLabel: undefined,
    });

    expect(presenter.handleAvailableMovesSelectionOption("reject")).toBe(false);
    expect(presenter.resolutionSelectionSession).not.toBeNull();
    expect(executedMoves).toEqual([]);
  });

  it("auto-opens immediate optional target selection before the yes-no step", () => {
    const executedMoves: Array<Record<string, unknown>> = [];
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Jasmine - Resourceful Infiltrator",
      type: "character",
    });
    const targetCard = createCardSnapshot("playerOne", "play", {
      id: "target-1",
      name: "Mulan - Disguised Soldier",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const targetCardId = targetCard.cardId as CardInstanceId;
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCardId,
      sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "target-selection",
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
    });
    board.stateID = 14;
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "target-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "targets",
          originatesFromOptional: true,
          targetDsl: [
            {
              selector: "chosen",
              count: 1,
              zones: ["play"],
              cardTypes: ["character"],
            },
          ],
          cardCandidateIds: [targetCardId],
          playerCandidateIds: [],
          allowedZones: ["play"],
          minSelections: 1,
          maxSelections: 1,
          ordered: false,
          autoRejected: false,
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
        pendingResolutionAutoOpenStateId: () => 14,
        executeMove: (_moveId, params) => {
          executedMoves.push(params as Record<string, unknown>);
          return true;
        },
      }),
    );
    presenter.skipActionConfirmation = false;

    presenter.syncAutoOpenPendingResolution();

    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-target",
      canCancel: true,
      canDecline: true,
      declineLabel: "Skip effect",
      canConfirm: false,
      title: "Resolve optional effect from Jasmine - Resourceful Infiltrator",
    });

    expect(presenter.handleAvailableMovesSelectionCard(targetCard.cardId)).toBe(true);
    expect(presenter.confirmResolutionSelection()).toBe(true);
    expect(executedMoves).toEqual([
      {
        effectId: "pending-1",
        params: {
          resolveOptional: true,
          targets: [targetCardId],
        },
      },
    ]);
  });

  it("replaces 'this effect' with the action card name in resolution guidance", () => {
    const sourceCard = createCardSnapshot("playerOne", "hand", {
      id: "card-1",
      name: "Dragon Fire",
      type: "action",
    });
    const targetCard = createCardSnapshot("playerTwo", "play", {
      id: "target-1",
      name: "Maui - Hero to All",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const targetCardId = targetCard.cardId as CardInstanceId;
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCardId,
      sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "target-selection",
      cardPlayed: {
        playerId: playerOneId,
        cardId: sourceCardId,
        cardType: "action",
        costType: "standard",
      },
      effect: {
        type: "banish",
        target: "CHOSEN_CHARACTER",
      },
    });
    board.stateID = 15;
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "target-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "targets",
          targetDsl: [
            {
              selector: "chosen",
              count: 1,
              zones: ["play"],
              cardTypes: ["character"],
            },
          ],
          cardCandidateIds: [targetCardId],
          playerCandidateIds: [],
          allowedZones: ["play"],
          minSelections: 1,
          maxSelections: 1,
          ordered: false,
          autoRejected: false,
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
        pendingResolutionAutoOpenStateId: () => 15,
      }),
    );

    presenter.syncAutoOpenPendingResolution();

    expect(presenter.activePlayerGuidance[0]).toMatchObject({
      message: "Select the required target or player for Dragon Fire.",
      inlineReference: {
        label: "Dragon Fire",
        card: { cardId: sourceCardId },
        prefix: "Select the required target or player for ",
        suffix: ".",
      },
    });
  });

  it("replaces 'this effect' with the activated ability title in resolution guidance", () => {
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Goofy - Musketeer",
      type: "character",
    });
    sourceCard.textEntries = [
      { title: "{E} Bodyguard Orders", description: "Ready chosen character." },
    ];
    const targetCard = createCardSnapshot("playerOne", "play", {
      id: "target-1",
      name: "Mickey Mouse - Brave Little Tailor",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const targetCardId = targetCard.cardId as CardInstanceId;
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCardId,
      sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "target-selection",
      cardPlayed: {
        playerId: playerOneId,
        cardId: sourceCardId,
        cardType: "character",
        costType: "free",
      },
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
    });
    board.stateID = 16;
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "target-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "targets",
          targetDsl: [
            {
              selector: "chosen",
              count: 1,
              zones: ["play"],
              cardTypes: ["character"],
            },
          ],
          cardCandidateIds: [targetCardId],
          playerCandidateIds: [],
          allowedZones: ["play"],
          minSelections: 1,
          maxSelections: 1,
          ordered: false,
          autoRejected: false,
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
        pendingResolutionAutoOpenStateId: () => 16,
        executableMoves: () => [
          createExecutableMove({
            id: "activateAbility:card-1:0",
            label: "Activate Bodyguard Orders",
            moveId: "activateAbility",
            params: { cardId: sourceCard.cardId, abilityIndex: 0 },
            presentation: {
              kind: "direct",
              categoryId: "activate-ability",
              categoryLabel: "Activate ability",
            },
          }),
        ],
        executeMove: () => true,
      }),
    );

    presenter.handleCardAbilityByIndex(sourceCard.cardId, 0);
    presenter.syncAutoOpenPendingResolution();

    expect(presenter.activePlayerGuidance[0]).toMatchObject({
      message: "Select the required target or player for Goofy - Musketeer: {E} Bodyguard Orders.",
      inlineReference: {
        label: "Goofy - Musketeer: {E} Bodyguard Orders",
        card: { cardId: sourceCardId },
        prefix: "Select the required target or player for ",
        suffix: ".",
      },
    });
    expect(presenter.pendingEffectsPopoverItems[0]).toMatchObject({
      title: "Goofy - Musketeer",
      secondaryTitle: "{E} Bodyguard Orders",
    });
  });

  it("falls back to the card name when an activated ability title is unavailable", () => {
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Donald Duck - Boisterous Fowl",
      type: "character",
    });
    sourceCard.textEntries = [
      { title: "{E} First Ability", description: "Do a thing." },
      { title: "{E} Second Ability", description: "Do another thing." },
    ];
    const targetCard = createCardSnapshot("playerOne", "play", {
      id: "target-1",
      name: "Pluto - Friendly Pooch",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const targetCardId = targetCard.cardId as CardInstanceId;
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCardId,
      sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "target-selection",
      cardPlayed: {
        playerId: playerOneId,
        cardId: sourceCardId,
        cardType: "character",
        costType: "free",
      },
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
    });
    board.stateID = 17;
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "target-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "targets",
          targetDsl: [
            {
              selector: "chosen",
              count: 1,
              zones: ["play"],
              cardTypes: ["character"],
            },
          ],
          cardCandidateIds: [targetCardId],
          playerCandidateIds: [],
          allowedZones: ["play"],
          minSelections: 1,
          maxSelections: 1,
          ordered: false,
          autoRejected: false,
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
        pendingResolutionAutoOpenStateId: () => 17,
        executableMoves: () => [
          createExecutableMove({
            id: "activateAbility:card-1:2",
            label: "Activate Missing Ability",
            moveId: "activateAbility",
            params: { cardId: sourceCard.cardId, abilityIndex: 2 },
            presentation: {
              kind: "direct",
              categoryId: "activate-ability",
              categoryLabel: "Activate ability",
            },
          }),
        ],
        executeMove: () => true,
      }),
    );

    presenter.handleCardAbilityByIndex(sourceCard.cardId, 2);
    presenter.syncAutoOpenPendingResolution();

    expect(presenter.activePlayerGuidance[0]).toMatchObject({
      message: "Select the required target or player for Donald Duck - Boisterous Fowl.",
      inlineReference: {
        label: "Donald Duck - Boisterous Fowl",
        card: { cardId: sourceCardId },
        prefix: "Select the required target or player for ",
        suffix: ".",
      },
    });
  });

  it("uses source card, ability title, and target card in pending effect guidance summaries", () => {
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Hades - Looking for a Deal",
      type: "character",
    });
    sourceCard.textEntries = [
      {
        title: "WHAT D'YA SAY?",
        description:
          "When you play this character, choose one: Return chosen opposing character to the bottom of their deck or draw 2 cards.",
      },
    ];
    const targetCard = createCardSnapshot("playerTwo", "play", {
      id: "target-1",
      name: "Cinderella - Dream Come True",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const targetCardId = targetCard.cardId as CardInstanceId;
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCardId,
      sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "choice-selection",
      abilityIndex: 0,
      resolutionInput: {
        contextTargets: targetCardId,
      },
      effect: {
        type: "choice",
        chooser: "OPPONENT",
        optionLabels: ["put that character on the bottom of their deck", "you draw 2 cards"],
        options: [
          {
            type: "put-on-bottom",
            target: {
              ref: "previous-target",
            },
          },
          {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
        ],
      },
    });
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        abilityIndex: 0,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "choice-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "choiceIndex",
          options: [
            { index: 0, label: "put that character on the bottom of their deck", legal: true },
            { index: 1, label: "you draw 2 cards", legal: true },
          ],
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne" as const,
        getOwnerIdForSide: (side) => (side === "playerOne" ? playerOneId : playerTwoId),
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
      }),
    );

    const expectedSummary =
      "Resolving Hades - Looking for a Deal: WHAT D'YA SAY? targeting Cinderella - Dream Come True.";

    expect(presenter.pendingEffectsPopoverItems[0]).toMatchObject({
      title: "Hades - Looking for a Deal",
      secondaryTitle: "WHAT D'YA SAY?",
      summaryTitle: expectedSummary,
    });
    expect(presenter.activePlayerGuidance[0]?.message).toBe(expectedSummary);
  });

  it("lists pending choice alternatives in the sidebar and submits the chosen branch", () => {
    const executedMoves: Array<Record<string, unknown>> = [];
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "The Queen - Commanding Presence",
      type: "character",
    });
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCard.cardId as CardInstanceId,
      sourceCardId: sourceCard.cardId as CardInstanceId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "choice-selection",
      effect: {
        type: "custom",
      },
    });
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "choice-selection",
          sourceCardId: sourceCard.cardId as CardInstanceId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "choiceIndex",
          options: [
            { index: 0, label: "Ready chosen character", legal: true },
            { index: 1, label: "Deal 2 damage", legal: false },
          ],
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
        executeMove: (_moveId, params) => {
          executedMoves.push(params as Record<string, unknown>);
          return true;
        },
      }),
    );

    presenter.handleResolvePendingEffect({
      id: "resolveEffect:pending-1",
      moveId: "resolveEffect",
      params: { effectId: "pending-1" },
    });

    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-choice",
      entries: [
        { moveId: "0", label: "Ready chosen character", disabled: false },
        { moveId: "1", label: "Deal 2 damage", disabled: true },
      ],
    });

    expect(presenter.handleAvailableMovesSelectionOption("1")).toBe(false);
    expect(presenter.handleAvailableMovesSelectionOption("0")).toBe(true);
    expect(presenter.confirmActionSelection()).toBe(true);
    expect(executedMoves).toEqual([
      {
        effectId: "pending-1",
        params: {
          choiceIndex: 0,
        },
      },
    ]);
  });

  it("auto-opens a pending choice selection into the resolution-choice session", () => {
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Hades - Looking for a Deal",
      type: "character",
    });
    sourceCard.textEntries = [{ title: "WHAT D'YA SAY?", description: "Choose one." }];
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCardId,
      sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "choice-selection",
      effect: {
        type: "custom",
      },
    });
    board.stateID = 18;
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "choice-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "choiceIndex",
          options: [
            {
              index: 0,
              label: "put that character on the bottom of their deck",
              legal: true,
            },
            {
              index: 1,
              label: "you draw 2 cards",
              legal: true,
            },
          ],
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
        pendingResolutionAutoOpenStateId: () => 18,
      }),
    );

    presenter.syncAutoOpenPendingResolution();

    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-choice",
      title: "Hades - Looking for a Deal",
      message: "Choose an effect for Hades - Looking for a Deal: WHAT D'YA SAY?.",
      entries: [
        { moveId: "0", label: "put that character on the bottom of their deck", disabled: false },
        { moveId: "1", label: "you draw 2 cards", disabled: false },
      ],
    });
  });

  it("updates named-card search and submits the selected card name", () => {
    const executedMoves: Array<Record<string, unknown>> = [];
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Chernabog's Followers - Creatures of Evil",
      type: "character",
    });
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCard.cardId as CardInstanceId,
      sourceCardId: sourceCard.cardId as CardInstanceId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "name-card-selection",
      effect: {
        type: "custom",
      },
    });
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "name-card-selection",
          sourceCardId: sourceCard.cardId as CardInstanceId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "namedCard",
          searchMode: "lorcana-catalog",
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
        executeMove: (_moveId, params) => {
          executedMoves.push(params as Record<string, unknown>);
          return true;
        },
      }),
    );

    presenter.handleResolvePendingEffect({
      id: "resolveEffect:pending-1",
      moveId: "resolveEffect",
      params: { effectId: "pending-1" },
    });
    presenter.handleAvailableMovesNamedCardQueryInput("elsa");

    const selectionState = presenter.availableMovesSelectionState;
    expect(selectionState?.mode).toBe("resolution-name-card");
    expect(selectionState?.entries.length).toBeGreaterThan(0);

    const firstResult =
      selectionState?.mode === "resolution-name-card" ? selectionState.entries[0] : null;
    expect(firstResult?.kind).toBe("named-card");
    expect(firstResult?.moveId).toBeTruthy();

    expect(
      firstResult?.moveId
        ? presenter.handleAvailableMovesNamedCardSelection(firstResult.moveId)
        : false,
    ).toBe(true);
    expect(presenter.confirmActionSelection()).toBe(true);

    expect(executedMoves).toEqual([
      {
        effectId: "pending-1",
        params: {
          namedCard: firstResult?.moveId,
        },
      },
    ]);
  });

  it("keeps board and sidebar target selection in sync", () => {
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Rapunzel - Gifted with Healing",
      type: "character",
    });
    const targetCard = createCardSnapshot("playerTwo", "play", {
      id: "target-1",
      name: "Isabela Madrigal - Golden Child",
      type: "character",
    });
    const board = createBoardWithBagEffect({
      id: "bag-1",
      sourceId: sourceCard.cardId as CardInstanceId,
      sourceCardId: sourceCard.cardId as CardInstanceId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "triggered-ability",
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
    });
    board.bagEffects = [
      {
        ...board.bagEffects[0]!,
        selectionContext: {
          origin: "bag",
          requestId: "bag-1",
          kind: "target-selection",
          sourceCardId: sourceCard.cardId as CardInstanceId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "targets",
          targetDsl: [
            {
              selector: "chosen",
              count: 1,
              zones: ["play"],
              cardTypes: ["character"],
            },
          ],
          cardCandidateIds: [targetCard.cardId as CardInstanceId],
          playerCandidateIds: [],
          allowedZones: ["play"],
          minSelections: 1,
          maxSelections: 1,
          ordered: false,
          autoRejected: false,
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveBag:bag-1",
            moveId: "resolveBag",
            params: { bagId: "bag-1" },
          },
        ],
      }),
    );
    presenter.skipActionConfirmation = false;

    presenter.handleResolveBag({
      id: "resolveBag:bag-1",
      moveId: "resolveBag",
      params: { bagId: "bag-1" },
    });

    expect(presenter.handleAvailableMovesSelectionCard(targetCard.cardId)).toBe(true);
    expect(presenter.selectedActionSessionCardIds).toEqual([targetCard.cardId]);

    // `ready` is now wired into the slot-overlay supported effect types
    // (Phase 1 #5), so re-clicking the same card via the board handler
    // re-assigns the slot rather than toggling the selection off — the
    // slotted UX uses an explicit clear, not double-click. Both state
    // holders still agree, which is the "sync" the test guards.
    expect(presenter.handleActionSessionCardSelection(targetCard)).toBe(true);
    expect(presenter.selectedActionSessionCardIds).toEqual([targetCard.cardId]);
  });

  it("tracks scry assignment and submits ordered destinations", () => {
    const executedMoves: Array<Record<string, unknown>> = [];
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Ariel - Spectacular Singer",
      type: "character",
    });
    const firstCard = createCardSnapshot("playerOne", "deck", {
      id: "reveal-1",
      name: "Elsa - Ice Surfer",
      type: "character",
    });
    const secondCard = createCardSnapshot("playerOne", "deck", {
      id: "reveal-2",
      name: "Anna - Braving the Storm",
      type: "character",
    });
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCard.cardId as CardInstanceId,
      sourceCardId: sourceCard.cardId as CardInstanceId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "scry-selection",
      effect: {
        type: "custom",
      },
    });
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "scry-selection",
          sourceCardId: sourceCard.cardId as CardInstanceId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "destinations",
          amount: 2,
          revealedCardIds: [
            firstCard.cardId as CardInstanceId,
            secondCard.cardId as CardInstanceId,
          ],
          revealedCards: [
            {
              cardId: firstCard.cardId as CardInstanceId,
              label: firstCard.label,
              cardType: "action",
              actionSubtype: "song",
              cost: 2,
            },
            {
              cardId: secondCard.cardId as CardInstanceId,
              label: secondCard.label,
              cardType: "character",
              cost: 4,
              classifications: ["Princess"],
            },
          ],
          destinationRules: [
            { id: "top", zone: "deck-top", min: 0, max: null, remainder: false },
            { id: "bottom", zone: "deck-bottom", min: 0, max: null, remainder: true },
          ],
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [firstCard.cardId]: firstCard,
          [secondCard.cardId]: secondCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
        executeMove: (_moveId, params) => {
          executedMoves.push(params as Record<string, unknown>);
          return true;
        },
      }),
    );

    presenter.handleResolvePendingEffect({
      id: "resolveEffect:pending-1",
      moveId: "resolveEffect",
      params: { effectId: "pending-1" },
    });

    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-scry",
      destinations: [{ zone: "deck-top" }, { zone: "deck-bottom" }],
    });

    expect(presenter.handleAvailableMovesScryAssignment(firstCard.cardId, "bottom")).toBe(true);
    expect(presenter.handleAvailableMovesScryAssignment(secondCard.cardId, "bottom")).toBe(true);
    expect(presenter.handleAvailableMovesScryReorder("bottom", secondCard.cardId, "up")).toBe(true);
    expect(presenter.confirmActionSelection()).toBe(true);

    expect(executedMoves).toEqual([
      {
        effectId: "pending-1",
        params: {
          destinations: [
            { zone: "deck-top", cards: [] },
            { zone: "deck-bottom", cards: [secondCard.cardId, firstCard.cardId] },
          ],
        },
      },
    ]);
  });

  it("surfaces a Bodyguard enter-exerted choice when a Bodyguard card is assigned to a scry play destination and forwards enterPlayExerted on confirm (triage 2026-05-11 #11)", () => {
    const executedMoves: Array<Record<string, unknown>> = [];
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "dino-source",
      name: "Down in New Orleans",
      type: "action",
    });
    const bodyguardCard = createCardSnapshot("playerOne", "deck", {
      id: "thunderbolt",
      name: "Thunderbolt - Wonder Dog",
      type: "character",
      keywords: ["Bodyguard"],
    });
    const filler = createCardSnapshot("playerOne", "deck", {
      id: "filler",
      name: "Filler",
      type: "action",
    });
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCard.cardId as CardInstanceId,
      sourceCardId: sourceCard.cardId as CardInstanceId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "scry-selection",
      effect: { type: "custom" },
    });
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "scry-selection",
          sourceCardId: sourceCard.cardId as CardInstanceId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "destinations",
          amount: 2,
          revealedCardIds: [
            bodyguardCard.cardId as CardInstanceId,
            filler.cardId as CardInstanceId,
          ],
          revealedCards: [
            {
              cardId: bodyguardCard.cardId as CardInstanceId,
              label: bodyguardCard.label,
              cardType: "character",
              cost: 5,
              classifications: ["Hero"],
            },
            {
              cardId: filler.cardId as CardInstanceId,
              label: filler.label,
              cardType: "action",
              cost: 1,
            },
          ],
          destinationRules: [
            { id: "play", zone: "play", min: 0, max: 1, remainder: false },
            { id: "bottom", zone: "deck-bottom", min: 0, max: null, remainder: true },
          ],
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [bodyguardCard.cardId]: bodyguardCard,
          [filler.cardId]: filler,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
        executeMove: (_moveId, params) => {
          executedMoves.push(params as Record<string, unknown>);
          return true;
        },
      }),
    );

    presenter.handleResolvePendingEffect({
      id: "resolveEffect:pending-1",
      moveId: "resolveEffect",
      params: { effectId: "pending-1" },
    });

    // Before any play assignment, no Bodyguard toggle is visible.
    expect(presenter.scryBodyguardEntryMode).toBeNull();

    // Assign Bodyguard to play, filler to bottom.
    expect(presenter.handleAvailableMovesScryAssignment(bodyguardCard.cardId, "play")).toBe(true);
    expect(presenter.handleAvailableMovesScryAssignment(filler.cardId, "bottom")).toBe(true);

    // Now the toggle appears, defaulting to not-yet-chosen.
    expect(presenter.scryBodyguardEntryMode).toEqual({ selected: null });

    // Player opts into Bodyguard exerted entry.
    expect(presenter.selectResolutionEnterPlayExerted(true)).toBe(true);
    expect(presenter.scryBodyguardEntryMode).toEqual({ selected: true });

    expect(presenter.confirmActionSelection()).toBe(true);

    expect(executedMoves).toEqual([
      {
        effectId: "pending-1",
        params: {
          destinations: [
            { zone: "play", cards: [bodyguardCard.cardId] },
            { zone: "deck-bottom", cards: [filler.cardId] },
          ],
          enterPlayExerted: true,
        },
      },
    ]);
  });

  it("auto-opens the single bag resolution selection after a card play", () => {
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Rapunzel - Gifted with Healing",
      type: "character",
    });
    const targetCard = createCardSnapshot("playerTwo", "play", {
      id: "target-1",
      name: "Isabela Madrigal - Golden Child",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const targetCardId = targetCard.cardId as CardInstanceId;
    const board = createBoardWithBagEffect({
      id: "bag-1",
      sourceId: sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "triggered-ability",
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
    });
    board.stateID = 12;
    board.bagEffects = [
      {
        ...board.bagEffects[0]!,
        selectionContext: {
          origin: "bag",
          requestId: "bag-1",
          kind: "target-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "targets",
          targetDsl: [
            {
              selector: "chosen",
              count: 1,
              zones: ["play"],
              cardTypes: ["character"],
            },
          ],
          cardCandidateIds: [targetCardId],
          playerCandidateIds: [],
          allowedZones: ["play"],
          minSelections: 1,
          maxSelections: 1,
          ordered: false,
          autoRejected: false,
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveBag:bag-1",
            moveId: "resolveBag",
            params: { bagId: "bag-1" },
          },
        ],
        pendingResolutionAutoOpenStateId: () => 12,
      }),
    );

    expect(presenter.resolutionSelectionSession).toBeNull();

    presenter.syncAutoOpenPendingResolution();

    expect(presenter.resolutionSelectionSession?.context.kind).toBe("target-selection");
    expect(presenter.selectableActionSessionCardIds).toEqual([targetCard.cardId]);
  });

  it("does not auto-open when multiple queued resolution items exist", () => {
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Rapunzel - Gifted with Healing",
      type: "character",
    });
    const targetCard = createCardSnapshot("playerTwo", "play", {
      id: "target-1",
      name: "Isabela Madrigal - Golden Child",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const targetCardId = targetCard.cardId as CardInstanceId;
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCardId,
      sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "optional-selection",
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
    });
    board.stateID = 12;
    // Remove pendingChoice so the mandatory active-effect path is not triggered
    board.pendingChoice = undefined;
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "optional-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "resolveOptional",
          acceptLabel: "Yes",
          rejectLabel: "No",
        },
      },
    ];
    board.bagEffects = [
      {
        id: "bag-1",
        type: "triggered",
        controllerId: playerOneId,
        chooserId: playerOneId,
        sourceId: sourceCardId,
        payload: {
          id: "bag-1",
          sourceId: sourceCardId,
          controllerId: "player_one",
          chooserId: "player_one",
          kind: "triggered-ability",
          effect: {
            type: "ready",
            target: "CHOSEN_CHARACTER",
          },
        },
        selectionContext: {
          origin: "bag",
          requestId: "bag-1",
          kind: "optional-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "resolveOptional",
          acceptLabel: "Yes",
          rejectLabel: "No",
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
          {
            id: "resolveBag:bag-1",
            moveId: "resolveBag",
            params: { bagId: "bag-1" },
          },
        ],
        pendingResolutionAutoOpenStateId: () => 12,
      }),
    );

    presenter.syncAutoOpenPendingResolution();

    expect(presenter.resolutionSelectionSession).toBeNull();
  });

  it("does not reopen the same auto-opened pending selection after cancel", () => {
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Rapunzel - Gifted with Healing",
      type: "character",
    });
    const targetCard = createCardSnapshot("playerTwo", "play", {
      id: "target-1",
      name: "Isabela Madrigal - Golden Child",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const targetCardId = targetCard.cardId as CardInstanceId;
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCardId,
      sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "target-selection",
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
    });
    board.stateID = 12;
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "target-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "targets",
          targetDsl: [
            {
              selector: "chosen",
              count: 1,
              zones: ["play"],
              cardTypes: ["character"],
            },
          ],
          cardCandidateIds: [targetCardId],
          playerCandidateIds: [],
          allowedZones: ["play"],
          minSelections: 1,
          maxSelections: 1,
          ordered: false,
          autoRejected: false,
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
        pendingResolutionAutoOpenStateId: () => 12,
      }),
    );

    presenter.syncAutoOpenPendingResolution();
    expect(presenter.resolutionSelectionSession?.context.kind).toBe("target-selection");

    presenter.cancelResolutionSelectionSession();
    presenter.syncAutoOpenPendingResolution();

    expect(presenter.resolutionSelectionSession).toBeNull();
  });

  it("auto-opens scry-selection even when multiple effects are queued", () => {
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Merlin - Goat",
      type: "character",
    });
    const revealedCard = createCardSnapshot("playerOne", "deck", {
      id: "revealed-1",
      name: "Mickey Mouse - Brave Little Tailor",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const revealedCardId = revealedCard.cardId as CardInstanceId;
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCardId,
      sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "scry-selection",
      effect: {
        type: "scry",
        amount: 1,
      },
    });
    board.stateID = 12;
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "scry-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "destinations",
          amount: 1,
          revealedCardIds: [revealedCardId],
          revealedCards: [
            {
              cardId: revealedCardId,
              label: revealedCard.label,
              cardType: "character",
              cost: 8,
              classifications: ["Hero"],
            },
          ],
          destinationRules: [
            { id: "top", zone: "deck-top", min: 0, max: null, remainder: true },
            { id: "bottom", zone: "deck-bottom", min: 0, max: null, remainder: false },
          ],
        },
      },
    ];
    // Add a bag effect so queuedResolutionCount > 1
    board.bagEffects = [
      {
        id: "bag-1",
        type: "triggered",
        controllerId: playerOneId,
        chooserId: playerOneId,
        sourceId: sourceCardId,
        payload: {},
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [revealedCard.cardId]: revealedCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
          {
            id: "resolveBag:bag-1",
            moveId: "resolveBag",
            params: { bagId: "bag-1" },
          },
        ],
        pendingResolutionAutoOpenStateId: () => 12,
      }),
    );

    expect(presenter.resolutionSelectionSession).toBeNull();

    presenter.syncAutoOpenPendingResolution();

    expect(presenter.resolutionSelectionSession?.context.kind).toBe("scry-selection");
  });

  it("auto-opens scry-selection even without matching autoOpenStateId", () => {
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Merlin - Goat",
      type: "character",
    });
    const revealedCard = createCardSnapshot("playerOne", "deck", {
      id: "revealed-1",
      name: "Mickey Mouse - Brave Little Tailor",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const revealedCardId = revealedCard.cardId as CardInstanceId;
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCardId,
      sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "scry-selection",
      effect: {
        type: "scry",
        amount: 1,
      },
    });
    board.stateID = 12;
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "scry-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "destinations",
          amount: 1,
          revealedCardIds: [revealedCardId],
          revealedCards: [
            {
              cardId: revealedCardId,
              label: revealedCard.label,
              cardType: "character",
              cost: 8,
              classifications: ["Hero"],
            },
          ],
          destinationRules: [
            { id: "top", zone: "deck-top", min: 0, max: null, remainder: true },
            { id: "bottom", zone: "deck-bottom", min: 0, max: null, remainder: false },
          ],
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [revealedCard.cardId]: revealedCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
        ],
        // autoOpenStateId does NOT match board.stateID
        pendingResolutionAutoOpenStateId: () => 99,
      }),
    );

    expect(presenter.resolutionSelectionSession).toBeNull();

    presenter.syncAutoOpenPendingResolution();

    // Scry-selection should still auto-open regardless of stateID mismatch
    expect(presenter.resolutionSelectionSession?.context.kind).toBe("scry-selection");
  });

  it("guides manual ink selection through card pick and confirm", () => {
    const inkCard = createCardSnapshot("playerOne", "hand", {
      id: "ink-card",
      name: "Develop Your Brain",
      type: "action",
    });
    const selectedCardIds: Array<string | null> = [];
    const executedMoves: Array<{
      moveId: string;
      params: LorcanaSimulatorMoveParams["putCardIntoInkwell"];
      options: { clearChallengeMode?: boolean; clearSelection?: boolean; status?: string };
    }> = [];
    const inkMove: ExecutableMoveEntry = {
      id: "putCardIntoInkwell:ink-card",
      label: inkCard.label,
      moveId: "putCardIntoInkwell",
      params: { cardId: inkCard.cardId },
      presentation: {
        kind: "targeted",
        categoryId: "ink-card",
        categoryLabel: "Ink",
        optionLabel: inkCard.label,
      },
    };

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        cardSnapshotsById: () => ({
          [inkCard.cardId]: inkCard,
        }),
        setSelectedCardId: (nextSelectedCardId) => {
          selectedCardIds.push(nextSelectedCardId);
        },
        executeMove: (moveId, params, options) => {
          if (moveId !== "putCardIntoInkwell") {
            return false;
          }

          executedMoves.push({
            moveId,
            params: params as LorcanaSimulatorMoveParams["putCardIntoInkwell"],
            options: {
              clearChallengeMode: options?.clearChallengeMode,
              clearSelection: options?.clearSelection,
              status: options?.status,
            },
          });
          return true;
        },
      }),
    );
    presenter.skipActionConfirmation = false;

    expect(presenter.startManualCardActionSelection("ink-card", [inkMove])).toBe(true);
    expect(presenter.activePlayerGuidance[0]?.message).toBe("Select a card to ink.");
    expect(presenter.isCardSelectableForManualAction(inkCard)).toBe(true);

    expect(presenter.handleManualCardActionSelection(inkCard)).toBe(true);
    expect(presenter.activePlayerGuidance[0]?.message).toBe("Confirm Ink.");

    expect(presenter.confirmManualCardActionSelection()).toBe(true);
    expect(selectedCardIds.at(-1)).toBeNull();
    expect(selectedCardIds).toContain(inkCard.cardId);
    expect(executedMoves).toEqual([
      {
        moveId: "putCardIntoInkwell",
        params: { cardId: inkCard.cardId },
        options: {
          clearChallengeMode: true,
          clearSelection: true,
          status: inkCard.label,
        },
      },
    ]);
    expect(presenter.actionSelectionSession).toBeNull();
  });

  it("guides challenge through source, target, and confirm phases", () => {
    const attacker = createCardSnapshot("playerOne", "play", {
      id: "attacker-card",
      name: "Maui - Hero to All",
      type: "character",
    });
    const defender = createCardSnapshot("playerTwo", "play", {
      id: "defender-card",
      name: "Elsa - Snow Queen",
      type: "character",
    });
    const executedMoves: Array<LorcanaSimulatorMoveParams["challenge"]> = [];
    const challengeMove: ExecutableMoveEntry = {
      id: "challenge:attacker:defender",
      label: "Challenge",
      moveId: "challenge",
      params: {
        attackerId: attacker.cardId,
        defenderId: defender.cardId,
      },
      presentation: {
        kind: "targeted",
        categoryId: "challenge",
        categoryLabel: "Challenge",
        optionLabel: `${attacker.label} -> ${defender.label}`,
      },
    };

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        cardSnapshotsById: () => ({
          [attacker.cardId]: attacker,
          [defender.cardId]: defender,
        }),
        ownerSide: () => "playerOne",
        boardSnapshot: () =>
          ({
            stateID: 1,
          }) as never,
        executeMove: (moveId, params) => {
          if (moveId !== "challenge") {
            return false;
          }

          executedMoves.push(params as LorcanaSimulatorMoveParams["challenge"]);
          return true;
        },
      }),
    );
    presenter.skipActionConfirmation = false;

    expect(presenter.startActionSelectionSession("challenge", [challengeMove])).toBe(true);
    expect(presenter.activePlayerGuidance[0]?.message).toBe(
      "Select a character to challenge with.",
    );
    expect(presenter.isCardSelectableForActionSession(attacker)).toBe(true);
    expect(presenter.availableMovesSelectionState).toMatchObject({
      categoryId: "challenge",
      phase: "choose-source",
      sourceCardId: null,
      targetCardId: null,
      canBack: false,
      canConfirm: false,
      entries: [
        {
          kind: "card",
          cardId: attacker.cardId,
          label: attacker.label,
        },
      ],
    });

    expect(presenter.handleAvailableMovesSelectionCard(attacker.cardId)).toBe(true);
    expect(presenter.activePlayerGuidance[0]?.message).toBe(
      `Select the opposing character for ${attacker.label} to challenge.`,
    );
    expect(presenter.availableMovesSelectionState).toMatchObject({
      categoryId: "challenge",
      phase: "choose-target",
      sourceCardId: attacker.cardId,
      sourceLabel: attacker.label,
      targetCardId: null,
      canBack: true,
      canConfirm: false,
      entries: [
        {
          kind: "card",
          cardId: defender.cardId,
          label: defender.label,
        },
      ],
    });

    expect(presenter.handleActionSessionCardSelection(defender)).toBe(true);
    expect(presenter.activePlayerGuidance[0]?.message).toBe(
      `Confirm Challenge.\nChallenge ${attacker.label} -> ${defender.label}`,
    );
    expect(presenter.availableMovesSelectionState).toMatchObject({
      categoryId: "challenge",
      phase: "confirm",
      sourceCardId: attacker.cardId,
      sourceLabel: attacker.label,
      targetCardId: defender.cardId,
      targetLabel: defender.label,
      selectedMoveId: challengeMove.id,
      selectedMoveLabel: `${attacker.label} -> ${defender.label}`,
      canBack: true,
      canConfirm: true,
      entries: [],
    });

    expect(presenter.confirmActionSelection()).toBe(true);
    expect(executedMoves).toEqual([
      {
        attackerId: attacker.cardId,
        defenderId: defender.cardId,
      },
    ]);
  });

  it("surfaces lethal challenge preview state for the selected attacker and defender", () => {
    const attacker = createCardSnapshot("playerOne", "play", {
      id: "attacker-card",
      name: "Maui - Hero to All",
      type: "character",
    });
    const defender = createCardSnapshot("playerTwo", "play", {
      id: "defender-card",
      name: "Elsa - Snow Queen",
      type: "character",
    });
    const challengeMove: ExecutableMoveEntry = {
      id: "challenge:attacker:defender",
      label: "Challenge",
      moveId: "challenge",
      params: {
        attackerId: attacker.cardId,
        defenderId: defender.cardId,
      },
      presentation: {
        kind: "targeted",
        categoryId: "challenge",
        categoryLabel: "Challenge",
        optionLabel: `${attacker.label} -> ${defender.label}`,
      },
    };

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        cardSnapshotsById: () => ({
          [attacker.cardId]: attacker,
          [defender.cardId]: defender,
        }),
        ownerSide: () => "playerOne",
        boardSnapshot: () =>
          ({
            stateID: 1,
          }) as never,
        previewChallenge: () => ({
          attackerId: attacker.cardId as never,
          defenderId: defender.cardId as never,
          defenderKind: "character",
          attackerCurrentDamage: 0,
          defenderCurrentDamage: 0,
          attackerNextDamage: 5,
          defenderNextDamage: 4,
          attackerWillpower: 4,
          defenderWillpower: 4,
          attackerDamageDealt: 4,
          defenderDamageDealt: 5,
          attackerWouldBeBanished: true,
          defenderWouldBeBanished: true,
          attackerDamageIsReduced: false,
          defenderDamageIsReduced: false,
        }),
      }),
    );
    presenter.skipActionConfirmation = false;

    expect(presenter.startActionSelectionSession("challenge", [challengeMove])).toBe(true);
    expect(presenter.handleActionSessionCardSelection(attacker)).toBe(true);
    expect(presenter.handleActionSessionCardSelection(defender)).toBe(true);

    expect(presenter.getChallengePreviewCardState(attacker.cardId)).toEqual({
      wouldBeBanished: true,
    });
    expect(presenter.getChallengePreviewCardState(defender.cardId)).toEqual({
      wouldBeBanished: true,
    });
    expect(presenter.getChallengePreviewCardState("other-card")).toEqual({
      wouldBeBanished: false,
    });
  });

  it("surfaces the specific invalid challenge reason for blocked targets", () => {
    const attacker = createCardSnapshot("playerOne", "play", {
      id: "attacker-card",
      name: "Moana - Determined Explorer",
      type: "character",
    });
    const validDefender = createCardSnapshot("playerTwo", "play", {
      id: "valid-defender",
      name: "Camilo Madrigal - Center Stage",
      type: "character",
    });
    const blockedDefender = createCardSnapshot("playerTwo", "play", {
      id: "blocked-defender",
      name: "Alma Madrigal - Accepting Grandmother",
      type: "character",
    });
    const pendingErrors: Array<string | null> = [];
    const challengeMove: ExecutableMoveEntry = {
      id: "challenge:attacker:valid",
      label: "Challenge",
      moveId: "challenge",
      params: {
        attackerId: attacker.cardId,
        defenderId: validDefender.cardId,
      },
      presentation: {
        kind: "targeted",
        categoryId: "challenge",
        categoryLabel: "Challenge",
        optionLabel: `${attacker.label} -> ${validDefender.label}`,
      },
    };

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () =>
          ({
            stateID: 1,
          }) as never,
        cardSnapshotsById: () => ({
          [attacker.cardId]: attacker,
          [validDefender.cardId]: validDefender,
          [blockedDefender.cardId]: blockedDefender,
        }),
        ownerSide: () => "playerOne",
        invalidChallengeTargetReasons: () => ({
          [blockedDefender.cardId]: "Another Bodyguard must be challenged first.",
        }),
        setPendingError: (reason) => {
          pendingErrors.push(reason);
        },
      }),
    );

    expect(presenter.startActionSelectionSession("challenge", [challengeMove])).toBe(true);
    expect(presenter.handleActionSessionCardSelection(attacker)).toBe(true);
    expect(presenter.getActionSessionCardReason(blockedDefender.cardId)).toBe(
      "Another Bodyguard must be challenged first.",
    );
    expect(presenter.handleActionSessionCardSelection(blockedDefender)).toBe(false);
    expect(pendingErrors.at(-1)).toBe("Another Bodyguard must be challenged first.");
  });

  it("routes challenge target selection through handleActionSessionCardSelection for exerted defender", () => {
    const attacker = createCardSnapshot("playerOne", "play", {
      id: "attacker-card",
      name: "Moana - Determined Explorer",
      type: "character",
    });
    const defender = createCardSnapshot("playerTwo", "play", {
      id: "defender-card",
      name: "Camilo Madrigal - Center Stage",
      type: "character",
    });
    const executed: Array<{ moveId: string; params: Record<string, unknown> }> = [];
    const challengeMove: ExecutableMoveEntry = {
      id: `challenge:${attacker.cardId}:${defender.cardId}`,
      label: "Challenge",
      moveId: "challenge",
      params: {
        attackerId: attacker.cardId,
        defenderId: defender.cardId,
      },
      presentation: {
        kind: "targeted",
        categoryId: "challenge",
        categoryLabel: "Challenge",
        optionLabel: `${attacker.label} -> ${defender.label}`,
      },
    };

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        cardSnapshotsById: () => ({
          [attacker.cardId]: attacker,
          [defender.cardId]: defender,
        }),
        ownerSide: () => "playerOne",
        boardSnapshot: () =>
          ({
            stateID: 1,
          }) as never,
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, unknown> });
          return true;
        },
      }),
    );

    const storage = new MemoryStorage();
    globalThis.localStorage = storage;

    presenter.handleSkipActionConfirmationToggle(true);

    expect(presenter.startActionSelectionSession("challenge", [challengeMove])).toBe(true);
    expect(presenter.handleActionSessionCardSelection(attacker)).toBe(true);
    expect(presenter.actionSelectionSession?.phase).toBe("choose-target");
    expect(presenter.handleActionSessionCardSelection(defender)).toBe(true);
    expect(executed).toEqual([
      {
        moveId: "challenge",
        params: {
          attackerId: attacker.cardId,
          defenderId: defender.cardId,
        },
      },
    ]);
  });

  it("executes single-card actions immediately when confirmation is disabled", () => {
    const storage = new MemoryStorage();
    globalThis.localStorage = storage;

    const inkCard = createCardSnapshot("playerOne", "hand", {
      id: "ink-card",
      name: "Develop Your Brain",
      type: "action",
    });
    const executedMoves: Array<LorcanaSimulatorMoveParams["putCardIntoInkwell"]> = [];
    const inkMove: ExecutableMoveEntry = {
      id: "putCardIntoInkwell:ink-card",
      label: inkCard.label,
      moveId: "putCardIntoInkwell",
      params: { cardId: inkCard.cardId },
      presentation: {
        kind: "targeted",
        categoryId: "ink-card",
        categoryLabel: "Ink",
        optionLabel: inkCard.label,
      },
    };

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        cardSnapshotsById: () => ({
          [inkCard.cardId]: inkCard,
        }),
        executeMove: (moveId, params) => {
          if (moveId !== "putCardIntoInkwell") {
            return false;
          }

          executedMoves.push(params as LorcanaSimulatorMoveParams["putCardIntoInkwell"]);
          return true;
        },
      }),
    );

    presenter.handleSkipActionConfirmationToggle(true);

    expect(presenter.skipActionConfirmation).toBe(true);
    expect(presenter.startActionSelectionSession("ink-card", [inkMove])).toBe(true);
    expect(presenter.handleActionSessionCardSelection(inkCard)).toBe(true);
    expect(executedMoves).toEqual([{ cardId: inkCard.cardId }]);
    expect(presenter.actionSelectionSession).toBeNull();
  });

  it("builds card-scoped hover actions with enabled and disabled entries", () => {
    const card = {
      ...createCardSnapshot("playerOne", "play", {
        id: "goofy",
        name: "Goofy - Musketeer",
        type: "character",
        loreValue: 2,
      }),
      textEntries: [{ title: "{E} Pay Attention", description: "Draw a card." }],
    };
    const executableMoves: ExecutableMoveEntry[] = [
      createExecutableMove({
        id: "quest:goofy",
        label: "Goofy - Musketeer",
        moveId: "quest",
        params: { cardId: card.cardId },
        presentation: {
          kind: "targeted",
          categoryId: "quest",
          categoryLabel: "Quest",
          optionLabel: "Goofy - Musketeer",
        },
      }),
      createExecutableMove({
        id: "activateAbility:goofy:0",
        label: "Goofy - Musketeer: {E} Pay Attention",
        moveId: "activateAbility",
        params: { cardId: card.cardId, abilityIndex: 0 },
        presentation: {
          kind: "targeted",
          categoryId: "activate-ability",
          categoryLabel: "Activate Ability",
          optionLabel: "Goofy - Musketeer: {E} Pay Attention",
        },
      }),
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        executableMoves: () => executableMoves,
        challengeReadyCardIds: () => [],
      }),
    );

    expect(presenter.getCardActionViews(card)).toEqual([
      {
        id: `quest:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "quest",
        label: "Quest for 2 lore",
        interaction: "execute-or-select",
        enabled: true,
        moves: [executableMoves[0]!],
      },
      {
        id: `disabled:challenge:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "challenge",
        label: "Challenge",
        interaction: "execute-or-select",
        enabled: false,
        reason: "No legal challenge targets right now.",
        moves: [],
      },
      {
        id: `disabled:move-to-location:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "move-to-location",
        label: "Move to Location",
        interaction: "execute-or-select",
        enabled: false,
        reason: "No legal locations to move to right now.",
        moves: [],
      },
      {
        id: `activate-ability:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "activate-ability",
        label: "Activate Ability",
        interaction: "execute-or-select",
        enabled: true,
        moves: [executableMoves[1]!],
      },
    ]);
  });

  it("groups activated abilities into a single source-first hover action", () => {
    const card = {
      ...createCardSnapshot("playerOne", "play", {
        id: "cinderella",
        name: "Cinderella - Ballroom Sensation",
        type: "character",
      }),
      textEntries: [
        { title: "Singer 6", description: "This character can sing songs with cost 6 or less." },
        { title: "Challenger +2", description: "Gets +2 strength while challenging." },
        { title: "{E} Encore", description: "Draw a card." },
      ],
    };
    const executableMoves: ExecutableMoveEntry[] = [
      createExecutableMove({
        id: "activateAbility:cinderella:2",
        label: "Cinderella - Ballroom Sensation: {E} Encore",
        moveId: "activateAbility",
        params: { cardId: card.cardId, abilityIndex: 2 },
        presentation: {
          kind: "targeted",
          categoryId: "activate-ability",
          categoryLabel: "Activate Ability",
          optionLabel: "Cinderella - Ballroom Sensation: {E} Encore",
        },
      }),
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        executableMoves: () => executableMoves,
      }),
    );

    expect(presenter.getCardActionViews(card)).toEqual([
      {
        id: `disabled:quest:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "quest",
        label: "Quest for 1 lore",
        interaction: "execute-or-select",
        enabled: false,
        reason: "This character cannot quest right now.",
        moves: [],
      },
      {
        id: `disabled:challenge:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "challenge",
        label: "Challenge",
        interaction: "execute-or-select",
        enabled: false,
        reason: "No legal challenge targets right now.",
        moves: [],
      },
      {
        id: `disabled:move-to-location:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "move-to-location",
        label: "Move to Location",
        interaction: "execute-or-select",
        enabled: false,
        reason: "No legal locations to move to right now.",
        moves: [],
      },
      {
        id: `activate-ability:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "activate-ability",
        label: "Activate Ability",
        interaction: "execute-or-select",
        enabled: true,
        moves: [executableMoves[0]!],
      },
    ]);
  });

  it("executes direct hover-card actions through the existing move pipeline", () => {
    const card = createCardSnapshot("playerOne", "play", {
      id: "simba",
      name: "Simba - Returned King",
      type: "character",
      loreValue: 3,
    });
    const executedMoves: Array<{
      moveId: string;
      params: Record<string, unknown>;
      options: { clearChallengeMode?: boolean; clearSelection?: boolean; status?: string };
    }> = [];
    const questMove = createExecutableMove({
      id: "quest:simba",
      label: "Quest with Simba",
      moveId: "quest",
      params: { cardId: card.cardId },
      presentation: {
        kind: "targeted",
        categoryId: "quest",
        categoryLabel: "Quest",
        optionLabel: "Simba - Returned King",
      },
    });

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        executableMoves: () => [questMove],
        challengeReadyCardIds: () => [],
        executeMove: (moveId, params, options) => {
          executedMoves.push({
            moveId,
            params: params as Record<string, unknown>,
            options: {
              clearChallengeMode: options?.clearChallengeMode,
              clearSelection: options?.clearSelection,
              status: options?.status,
            },
          });
          return true;
        },
      }),
    );

    const action = presenter.getCardActionViews(card)[0] as CardActionView;

    expect(presenter.handleCardActionClick(action)).toBe(true);
    expect(executedMoves).toEqual([
      {
        moveId: "quest",
        params: { cardId: card.cardId },
        options: {
          clearChallengeMode: true,
          clearSelection: true,
          status: "Quest with Simba",
        },
      },
    ]);
  });

  it("starts challenge mode from the hover-card action with the source card preselected", () => {
    const attacker = createCardSnapshot("playerOne", "play", {
      id: "attacker-card",
      name: "Maui - Hero to All",
      type: "character",
    });
    const defender = createCardSnapshot("playerTwo", "play", {
      id: "defender-card",
      name: "Elsa - Snow Queen",
      type: "character",
    });
    const selectedCardIds: Array<string | null> = [];
    const statusMessages: string[] = [];
    const challengeMove = createExecutableMove({
      id: "challenge:attacker:defender",
      label: "Challenge",
      moveId: "challenge",
      params: {
        attackerId: attacker.cardId,
        defenderId: defender.cardId,
      },
      presentation: {
        kind: "targeted",
        categoryId: "challenge",
        categoryLabel: "Challenge",
        optionLabel: `${attacker.label} -> ${defender.label}`,
      },
    });

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        executableMoves: () => [challengeMove],
        challengeReadyCardIds: () => [attacker.cardId],
        cardSnapshotsById: () => ({
          [attacker.cardId]: attacker,
          [defender.cardId]: defender,
        }),
        setSelectedCardId: (nextSelectedCardId) => {
          selectedCardIds.push(nextSelectedCardId);
        },
        setChallengeSourceCardId: () => {},
        setPendingError: () => {},
        setStatusMessage: (nextStatusMessage) => {
          statusMessages.push(nextStatusMessage);
        },
      }),
    );

    const action = presenter
      .getCardActionViews(attacker)
      .find((candidate) => candidate.categoryId === "challenge");

    expect(action?.enabled).toBe(true);
    expect(action?.interaction).toBe("expand-on-click");
    expect(action?.moves).toEqual([]);
    expect(action && presenter.handleCardActionClick(action)).toBe(true);
    expect(presenter.actionSelectionSession?.phase).toBe("choose-target");
    expect(presenter.actionSelectionSession?.sourceCardId).toBe(attacker.cardId);
    expect(selectedCardIds).toEqual([attacker.cardId]);
    expect(statusMessages).toEqual([
      `Select the opposing character for ${attacker.label} to challenge.`,
    ]);
  });

  it("starts move-to-location selection from the hover-card action with the source card preselected", () => {
    const character = createCardSnapshot("playerOne", "play", {
      id: "moana",
      name: "Moana - Determined Explorer",
      type: "character",
    });
    const location = createCardSnapshot("playerOne", "play", {
      id: "tians-place",
      name: "Tiana's Place",
      type: "location",
    });
    const selectedCardIds: Array<string | null> = [];
    const statusMessages: string[] = [];
    const moveToLocationMove = createExecutableMove({
      id: "moveCharacterToLocation:moana:tians-place",
      label: "Move to Location",
      moveId: "moveCharacterToLocation",
      params: {
        characterId: character.cardId,
        locationId: location.cardId,
      },
      presentation: {
        kind: "targeted",
        categoryId: "move-to-location",
        categoryLabel: "Move to Location",
        optionLabel: `${character.label} -> ${location.label}`,
      },
    });

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        cardSnapshotsById: () => ({
          [character.cardId]: character,
          [location.cardId]: location,
        }),
        moveCategorySummaries: () => [
          {
            categoryId: "move-to-location",
            categoryLabel: "Move to Location",
            sourceCardIds: [character.cardId],
            isDirect: false,
          },
        ],
        executableMoves: () => [],
        expandCardActionCategoryMoves: () => [moveToLocationMove],
        setSelectedCardId: (nextSelectedCardId) => {
          selectedCardIds.push(nextSelectedCardId);
        },
        setChallengeSourceCardId: () => {},
        setPendingError: () => {},
        setStatusMessage: (nextStatusMessage) => {
          statusMessages.push(nextStatusMessage);
        },
      }),
    );

    const action = presenter
      .getCardActionViews(character)
      .find((candidate) => candidate.categoryId === "move-to-location");

    expect(action?.enabled).toBe(true);
    expect(action?.interaction).toBe("expand-on-click");
    expect(action?.moves).toEqual([]);
    expect(action && presenter.handleCardActionClick(action)).toBe(true);
    expect(presenter.actionSelectionSession?.phase).toBe("choose-target");
    expect(presenter.actionSelectionSession?.sourceCardId).toBe(character.cardId);
    expect(selectedCardIds).toEqual([character.cardId]);
    expect(statusMessages).toEqual([`Select where to move ${character.label}.`]);
  });

  it("starts activate-ability from the hover-card action with the source card preselected", () => {
    const card = {
      ...createCardSnapshot("playerOne", "play", {
        id: "goofy",
        name: "Goofy - Musketeer",
        type: "character",
      }),
      textEntries: [
        { title: "{E} First Ability", description: "Do the first thing." },
        { title: "{E} Second Ability", description: "Do the second thing." },
      ],
    };
    const selectedCardIds: Array<string | null> = [];
    const statusMessages: string[] = [];
    const firstAbilityMove = createExecutableMove({
      id: "activateAbility:goofy:0",
      label: "Goofy - Musketeer: {E} First Ability",
      moveId: "activateAbility",
      params: { cardId: card.cardId, abilityIndex: 0 },
      presentation: {
        kind: "targeted",
        categoryId: "activate-ability",
        categoryLabel: "Activate Ability",
        optionLabel: "Goofy - Musketeer: {E} First Ability",
      },
    });
    const secondAbilityMove = createExecutableMove({
      id: "activateAbility:goofy:1",
      label: "Goofy - Musketeer: {E} Second Ability",
      moveId: "activateAbility",
      params: { cardId: card.cardId, abilityIndex: 1 },
      presentation: {
        kind: "targeted",
        categoryId: "activate-ability",
        categoryLabel: "Activate Ability",
        optionLabel: "Goofy - Musketeer: {E} Second Ability",
      },
    });

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        executableMoves: () => [firstAbilityMove, secondAbilityMove],
        cardSnapshotsById: () => ({
          [card.cardId]: card,
        }),
        setSelectedCardId: (nextSelectedCardId) => {
          selectedCardIds.push(nextSelectedCardId);
        },
        setPendingError: () => {},
        setStatusMessage: (nextStatusMessage) => {
          statusMessages.push(nextStatusMessage);
        },
      }),
    );

    const action = presenter
      .getCardActionViews(card)
      .find((candidate) => candidate.categoryId === "activate-ability");

    expect(action?.enabled).toBe(true);
    expect(action && presenter.handleCardActionClick(action)).toBe(true);
    expect(presenter.actionSelectionSession?.phase).toBe("choose-option");
    expect(presenter.actionSelectionSession?.sourceCardId).toBe(card.cardId);
    expect(selectedCardIds).toEqual([card.cardId]);
    expect(statusMessages).toEqual([`Choose an ability for ${card.label}.`]);
  });

  it("shows activate-ability choices from the action session guidance", () => {
    const storage = new MemoryStorage();
    globalThis.localStorage = storage;

    const card = createCardSnapshot("playerOne", "play", {
      id: "goofy",
      name: "Goofy - Musketeer",
      type: "character",
    });
    const executedMoves: Array<LorcanaSimulatorMoveParams["activateAbility"]> = [];
    const firstAbilityMove = createExecutableMove({
      id: "activateAbility:goofy:0",
      label: "Goofy - Musketeer: {E} First Ability",
      moveId: "activateAbility",
      params: { cardId: card.cardId, abilityIndex: 0 },
      presentation: {
        kind: "targeted",
        categoryId: "activate-ability",
        categoryLabel: "Activate Ability",
        optionLabel: "Goofy - Musketeer: {E} First Ability",
      },
    });
    const secondAbilityMove = createExecutableMove({
      id: "activateAbility:goofy:1",
      label: "Goofy - Musketeer: {E} Second Ability",
      moveId: "activateAbility",
      params: { cardId: card.cardId, abilityIndex: 1 },
      presentation: {
        kind: "targeted",
        categoryId: "activate-ability",
        categoryLabel: "Activate Ability",
        optionLabel: "Goofy - Musketeer: {E} Second Ability",
      },
    });

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        cardSnapshotsById: () => ({
          [card.cardId]: {
            ...card,
            textEntries: [
              { title: "{E} First Ability", description: "Do the first thing." },
              { title: "{E} Second Ability", description: "Do the second thing." },
            ],
          },
        }),
        executeMove: (moveId, params) => {
          if (moveId !== "activateAbility") {
            return false;
          }

          executedMoves.push(params as LorcanaSimulatorMoveParams["activateAbility"]);
          return true;
        },
      }),
    );
    presenter.skipActionConfirmation = false;

    expect(
      presenter.startActionSelectionSession("activate-ability", [
        firstAbilityMove,
        secondAbilityMove,
      ]),
    ).toBe(true);

    let guidance = presenter.activePlayerGuidance[0];
    expect(guidance?.message).toBe("Select a card to activate.");
    expect(guidance?.actions.map((action) => action.label)).toEqual(["Cancel"]);
    expect(presenter.availableMovesSelectionState).toMatchObject({
      categoryId: "activate-ability",
      phase: "choose-source",
      sourceCardId: null,
      entries: [
        {
          kind: "card",
          cardId: card.cardId,
          label: card.label,
        },
      ],
    });

    expect(presenter.handleAvailableMovesSelectionCard(card.cardId)).toBe(true);

    guidance = presenter.activePlayerGuidance[0];
    expect(guidance?.actions.map((action) => action.label)).toEqual([
      "Back",
      "Goofy - Musketeer: {E} First Ability",
      "Goofy - Musketeer: {E} Second Ability",
      "Cancel",
    ]);
    expect(presenter.availableMovesSelectionState).toMatchObject({
      categoryId: "activate-ability",
      phase: "choose-option",
      sourceCardId: card.cardId,
      sourceLabel: card.label,
      entries: [
        {
          kind: "option",
          moveId: firstAbilityMove.id,
          label: "Goofy - Musketeer: {E} First Ability",
        },
        {
          kind: "option",
          moveId: secondAbilityMove.id,
          label: "Goofy - Musketeer: {E} Second Ability",
        },
      ],
    });

    expect(presenter.handleAvailableMovesSelectionOption(secondAbilityMove.id)).toBe(true);
    expect(presenter.activePlayerGuidance[0]?.message).toBe(
      "Confirm Goofy - Musketeer: {E} Second Ability.",
    );
    expect(presenter.availableMovesSelectionState).toMatchObject({
      categoryId: "activate-ability",
      phase: "confirm",
      sourceCardId: card.cardId,
      sourceLabel: card.label,
      selectedMoveId: secondAbilityMove.id,
      selectedMoveLabel: "Goofy - Musketeer: {E} Second Ability",
      canConfirm: true,
    });

    presenter.backActionSelectionSession();
    guidance = presenter.activePlayerGuidance[0];
    expect(guidance?.message).toBe("Choose an ability for Goofy - Musketeer.");
    expect(presenter.activePlayerGuidance[0]?.actions.map((action) => action.label)).toEqual([
      "Back",
      "Goofy - Musketeer: {E} First Ability",
      "Goofy - Musketeer: {E} Second Ability",
      "Cancel",
    ]);

    expect(presenter.handleAvailableMovesSelectionOption(secondAbilityMove.id)).toBe(true);
    expect(presenter.confirmActionSelection()).toBe(true);
    expect(executedMoves).toEqual([{ cardId: card.cardId, abilityIndex: 1 }]);
  });

  it("executes a card ability from card id and ability index only", () => {
    const card = createCardSnapshot("playerOne", "play", {
      id: "goofy",
      name: "Goofy - Musketeer",
      type: "character",
    });
    const executedMoves: Array<LorcanaSimulatorMoveParams["activateAbility"]> = [];
    const firstAbilityMove = createExecutableMove({
      id: "activateAbility:goofy:0",
      label: "Goofy - Musketeer: {E} First Ability",
      moveId: "activateAbility",
      params: { cardId: card.cardId, abilityIndex: 0 },
      presentation: {
        kind: "targeted",
        categoryId: "activate-ability",
        categoryLabel: "Activate Ability",
        optionLabel: "Goofy - Musketeer: {E} First Ability",
      },
    });
    const secondAbilityMove = createExecutableMove({
      id: "activateAbility:goofy:1",
      label: "Goofy - Musketeer: {E} Second Ability",
      moveId: "activateAbility",
      params: { cardId: card.cardId, abilityIndex: 1 },
      presentation: {
        kind: "targeted",
        categoryId: "activate-ability",
        categoryLabel: "Activate Ability",
        optionLabel: "Goofy - Musketeer: {E} Second Ability",
      },
    });

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        cardSnapshotsById: () => ({
          [card.cardId]: {
            ...card,
            textEntries: [
              { title: "{E} First Ability", description: "Do the first thing." },
              { title: "{E} Second Ability", description: "Do the second thing." },
            ],
          },
        }),
        executableMoves: () => [firstAbilityMove, secondAbilityMove],
        executeMove: (moveId, params) => {
          if (moveId !== "activateAbility") {
            return false;
          }

          executedMoves.push(params as LorcanaSimulatorMoveParams["activateAbility"]);
          return true;
        },
      }),
    );

    expect(presenter.handleCardAbilityByIndex(card.cardId, 1)).toBe(true);
    expect(executedMoves).toEqual([{ cardId: card.cardId, abilityIndex: 1 }]);
    expect(presenter.actionSelectionSession).toBeNull();
    expect(presenter.handleCardAbilityByIndex(card.cardId, 2)).toBe(false);
  });

  it("shows statusMessage and onCancel on the matching popover item during an active resolution session", () => {
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Rapunzel - Gifted with Healing",
      type: "character",
    });
    const targetCard = createCardSnapshot("playerTwo", "play", {
      id: "target-1",
      name: "Isabela Madrigal - Golden Child",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const targetCardId = targetCard.cardId as CardInstanceId;
    const board = createBoardWithBagEffect({
      id: "bag-1",
      sourceId: sourceCardId,
      sourceCardId: sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "triggered-ability",
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
    });
    board.bagEffects = [
      {
        ...board.bagEffects[0]!,
        selectionContext: {
          origin: "bag",
          requestId: "bag-1",
          kind: "target-selection",
          sourceCardId: sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "targets",
          targetDsl: [
            {
              selector: "chosen",
              count: 1,
              zones: ["play"],
              cardTypes: ["character"],
            },
          ],
          cardCandidateIds: [targetCardId],
          playerCandidateIds: [],
          allowedZones: ["play"],
          minSelections: 1,
          maxSelections: 1,
          ordered: false,
          autoRejected: false,
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne" as const,
        getOwnerIdForSide: (side) => (side === "playerOne" ? playerOneId : playerTwoId),
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveBag:bag-1",
            moveId: "resolveBag",
            params: { bagId: "bag-1" },
          },
        ],
      }),
    );
    presenter.skipActionConfirmation = false;

    // Before session: item should be resolvable
    const itemBefore = presenter.pendingEffectsPopoverItems[0];
    expect(itemBefore?.canResolve).toBe(true);
    expect(itemBefore?.statusMessage).toBeUndefined();

    // Start session
    itemBefore?.onResolve?.();
    expect(presenter.resolutionSelectionSession?.context.kind).toBe("target-selection");

    // During session (no target selected yet): statusMessage shown, no confirm
    const itemDuring = presenter.pendingEffectsPopoverItems[0];
    expect(itemDuring?.canResolve).toBe(false);
    expect(itemDuring?.statusMessage).toBe("Selecting targets...");
    expect(itemDuring?.onCancel).toBeDefined();
    expect(itemDuring?.onConfirm).toBeUndefined();
    expect(itemDuring?.onResolve).toBeUndefined();

    // Select a target — confirm should now appear
    const targetSnapshot = presenter.pendingEffectsPopoverItems[0]; // re-read to check confirm
    expect(presenter.handleActionSessionCardSelection(targetCard)).toBe(true);
    const itemWithTarget = presenter.pendingEffectsPopoverItems[0];
    expect(itemWithTarget?.statusMessage).toBe("Selecting targets (1 selected)...");
    expect(itemWithTarget?.onConfirm).toBeDefined();

    // Cancel session: item should revert
    itemWithTarget?.onCancel?.();
    expect(presenter.resolutionSelectionSession).toBeNull();

    const itemAfter = presenter.pendingEffectsPopoverItems[0];
    expect(itemAfter?.canResolve).toBe(true);
    expect(itemAfter?.statusMessage).toBeUndefined();
  });

  it("does not affect non-matching popover items during an active resolution session", () => {
    const sourceCard = createCardSnapshot("playerOne", "play", {
      id: "card-1",
      name: "Rapunzel - Gifted with Healing",
      type: "character",
    });
    const targetCard = createCardSnapshot("playerTwo", "play", {
      id: "target-1",
      name: "Isabela Madrigal - Golden Child",
      type: "character",
    });
    const sourceCardId = sourceCard.cardId as CardInstanceId;
    const targetCardId = targetCard.cardId as CardInstanceId;
    const board = createBoardWithPendingEffect({
      id: "pending-1",
      sourceId: sourceCardId,
      sourceCardId,
      controllerId: "player_one",
      chooserId: "player_one",
      kind: "target-selection",
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
    });
    board.stateID = 12;
    board.pendingEffects = [
      {
        ...board.pendingEffects[0]!,
        selectionContext: {
          origin: "pending-effect",
          requestId: "pending-1",
          kind: "target-selection",
          sourceCardId,
          chooserId: playerOneId,
          currentSelection: {},
          submitField: "targets",
          targetDsl: [
            {
              selector: "chosen",
              count: 1,
              zones: ["play"],
              cardTypes: ["character"],
            },
          ],
          cardCandidateIds: [targetCardId],
          playerCandidateIds: [],
          allowedZones: ["play"],
          minSelections: 1,
          maxSelections: 1,
          ordered: false,
          autoRejected: false,
        },
      },
    ];
    // Add a bag effect that should NOT be affected by the pending effect's session
    board.bagEffects = [
      {
        id: "bag-1",
        type: "triggered",
        controllerId: playerOneId,
        chooserId: playerOneId,
        sourceId: sourceCardId,
        payload: {
          id: "bag-1",
          sourceId: sourceCardId,
          controllerId: "player_one",
          chooserId: "player_one",
          kind: "triggered-ability",
          effect: { type: "draw", target: "CONTROLLER", amount: 1 },
        },
      },
    ];

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne" as const,
        getOwnerIdForSide: (side) => (side === "playerOne" ? playerOneId : playerTwoId),
        boardSnapshot: () => board,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveEffect:pending-1",
            moveId: "resolveEffect",
            params: { effectId: "pending-1" },
          },
          {
            id: "resolveBag:bag-1",
            moveId: "resolveBag",
            params: { bagId: "bag-1" },
          },
        ],
      }),
    );

    // Start session on the pending effect
    presenter.handleResolvePendingEffect({
      id: "resolveEffect:pending-1",
      moveId: "resolveEffect",
      params: { effectId: "pending-1" },
    });

    const items = presenter.pendingEffectsPopoverItems;
    const pendingItem = items.find((i) => i.id === "pending:pending-1");
    const bagItem = items.find((i) => i.id === "bag:bag-1");

    // Pending item should be in session state
    expect(pendingItem?.statusMessage).toBe("Selecting targets...");
    expect(pendingItem?.canResolve).toBe(false);

    // Bag item should be unaffected
    expect(bagItem?.statusMessage).toBeUndefined();
    expect(bagItem?.canResolve).toBe(true);
  });

  it("routes discard-cost Shift through choose-cost before choosing a target", () => {
    const shiftCard = createCardSnapshot("playerOne", "hand", {
      id: "shift-card",
      name: "Ursula - Eric's Bride",
      type: "character",
    });
    const discardSong = createCardSnapshot("playerOne", "hand", {
      id: "discard-song",
      name: "Ariel's Song",
      type: "action",
    });
    const alternateDiscardSong = createCardSnapshot("playerOne", "hand", {
      id: "discard-song-2",
      name: "Second Song",
      type: "action",
    });
    const shiftTarget = createCardSnapshot("playerOne", "play", {
      id: "shift-target",
      name: "Ursula - Sea Witch",
      type: "character",
    });
    const executedMoves: Array<LorcanaSimulatorMoveParams["playCard"]> = [];
    const shiftMove = createExecutableMove({
      id: "shiftCard:shift-card:shift-target",
      label: "Shift onto Ursula - Sea Witch",
      moveId: "playCard",
      params: {
        cardId: shiftCard.cardId,
        cost: "shift",
        shiftTarget: shiftTarget.cardId,
        targets: [shiftTarget.cardId],
      },
      presentation: {
        kind: "targeted",
        categoryId: "shift-card",
        categoryLabel: "Shift",
        optionLabel: "Shift onto Ursula - Sea Witch",
        selectableCosts: [
          {
            kind: "discardCards",
            count: 1,
            candidateCardIds: [
              discardSong.cardId as CardInstanceId,
              alternateDiscardSong.cardId as CardInstanceId,
            ],
            zone: "hand",
            cardType: "song",
          },
        ],
      },
    });

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        cardSnapshotsById: () => ({
          [shiftCard.cardId]: shiftCard,
          [discardSong.cardId]: discardSong,
          [alternateDiscardSong.cardId]: alternateDiscardSong,
          [shiftTarget.cardId]: shiftTarget,
        }),
        executeMove: (moveId, params) => {
          if (moveId !== "playCard") {
            return false;
          }

          executedMoves.push(params as LorcanaSimulatorMoveParams["playCard"]);
          return true;
        },
      }),
    );
    presenter.skipActionConfirmation = false;

    expect(presenter.startActionSelectionSession("shift-card", [shiftMove])).toBe(true);
    expect(presenter.handleAvailableMovesSelectionCard(shiftCard.cardId)).toBe(true);
    expect(presenter.activePlayerGuidance[0]?.message).toBe(
      `Choose a card song to discard for ${shiftCard.label}.`,
    );
    expect(presenter.availableMovesSelectionState).toMatchObject({
      categoryId: "shift-card",
      phase: "choose-cost",
      sourceCardId: shiftCard.cardId,
      sourceLabel: shiftCard.label,
      entries: [
        {
          kind: "card",
          cardId: discardSong.cardId,
          label: discardSong.label,
        },
        {
          kind: "card",
          cardId: alternateDiscardSong.cardId,
          label: alternateDiscardSong.label,
        },
      ],
    });

    expect(presenter.handleActionSessionCardSelection(discardSong)).toBe(true);
    expect(presenter.activePlayerGuidance[0]?.message).toBe(
      `Choose a shift target for ${shiftCard.label}.`,
    );
    expect(presenter.availableMovesSelectionState).toMatchObject({
      categoryId: "shift-card",
      phase: "choose-target",
      sourceCardId: shiftCard.cardId,
      sourceLabel: shiftCard.label,
      entries: [
        {
          kind: "card",
          cardId: shiftTarget.cardId,
          label: shiftTarget.label,
        },
      ],
    });

    expect(presenter.handleActionSessionCardSelection(shiftTarget)).toBe(true);
    expect(presenter.confirmActionSelection()).toBe(true);
    expect(executedMoves).toEqual([
      {
        cardId: shiftCard.cardId,
        cost: "shift",
        shiftTarget: shiftTarget.cardId,
        discardCards: [discardSong.cardId],
        targets: [shiftTarget.cardId],
      },
    ]);
  });
});
