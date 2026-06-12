import { describe, expect, it } from "bun:test";
import type {
  CardInstanceId,
  OptionalResolutionSelectionContext,
  PlayerId,
  TargetResolutionSelectionContext,
} from "@tcg/lorcana-engine";
import "../../../../testing/public-env";
import type { LorcanaGameContextValue } from "@/features/simulator/context/game-context.svelte.js";
import { LorcanaSidebarPresenter } from "@/features/simulator/context/game-context.svelte.js";
import { DEFAULT_LORCANA_PLAYER_VISUAL_SETTINGS } from "@/features/simulator/model/player-visual-settings.js";
import type {
  ExecutableMoveEntry,
  LorcanaCardSnapshot,
  LorcanaSimulatorMoveParams,
} from "@/features/simulator/model/contracts.js";
import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import type { CardSnapshotMap } from "@/features/simulator/model/board-utils.js";

function asCardId(value: string): CardInstanceId {
  return value as CardInstanceId;
}

function asPlayerId(value: string): PlayerId {
  return value as PlayerId;
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
    expandCardMoves: () => [],
    expandCardActionCategoryMoves: () => [],
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
    animationSpeed: () => "normal",
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

function createConcedeMove(): ExecutableMoveEntry {
  return {
    id: "concede-1",
    label: "Concede",
    moveId: "concede",
    params: {},
    presentation: {
      kind: "direct",
      categoryId: "concede",
      categoryLabel: "Concede",
    },
  };
}

function createResolveEffectMove(): ExecutableMoveEntry {
  return {
    id: "resolve-effect-1",
    label: "Resolve effect",
    moveId: "resolveEffect",
    params: {
      effectId: "effect-1",
    },
    presentation: {
      kind: "direct",
      categoryId: "unknown",
      categoryLabel: "Resolve effect",
    },
  };
}

function createPendingResolutionMove(overrides: Partial<ExecutableMoveEntry["params"]> = {}): {
  id: string;
  moveId: "resolveEffect";
  params: { effectId: string };
} {
  return {
    id: "resolve-effect-1",
    moveId: "resolveEffect",
    params: {
      effectId: "effect-1",
      ...overrides,
    } as { effectId: string },
  };
}

function createPendingBagResolutionMove(bagId = "bag-1"): {
  id: string;
  moveId: "resolveBag";
  params: { bagId: string };
} {
  return {
    id: `resolveBag:${bagId}`,
    moveId: "resolveBag",
    params: { bagId },
  };
}

type TargetSelectionContextOverrides = Partial<
  Omit<
    TargetResolutionSelectionContext,
    "sourceCardId" | "chooserId" | "cardCandidateIds" | "playerCandidateIds"
  >
> & {
  sourceCardId?: string;
  chooserId?: string;
  cardCandidateIds?: string[];
  playerCandidateIds?: string[];
};

function createTargetSelectionContext(
  overrides: TargetSelectionContextOverrides = {},
): TargetResolutionSelectionContext {
  const { sourceCardId, chooserId, cardCandidateIds, playerCandidateIds, ...rest } = overrides;

  return {
    origin: "pending-effect",
    requestId: "effect-1",
    kind: "target-selection",
    sourceCardId: asCardId(sourceCardId ?? "source-1"),
    chooserId: asPlayerId(chooserId ?? "player-1"),
    currentSelection: {},
    submitField: "targets",
    targetDsl: [],
    cardCandidateIds: (cardCandidateIds ?? ["target-1"]).map(asCardId),
    playerCandidateIds: (playerCandidateIds ?? []).map(asPlayerId),
    allowedZones: ["play"],
    minSelections: 1,
    maxSelections: 1,
    ordered: false,
    autoRejected: false,
    ...rest,
  };
}

type OptionalSelectionContextOverrides = Partial<
  Omit<OptionalResolutionSelectionContext, "sourceCardId" | "chooserId">
> & {
  sourceCardId?: string;
  chooserId?: string;
};

function createOptionalSelectionContext(
  overrides: OptionalSelectionContextOverrides = {},
): OptionalResolutionSelectionContext {
  const { sourceCardId, chooserId, ...rest } = overrides;

  return {
    origin: "bag",
    requestId: "bag-1",
    kind: "optional-selection",
    sourceCardId: asCardId(sourceCardId ?? "source-1"),
    chooserId: asPlayerId(chooserId ?? "player-1"),
    currentSelection: {},
    submitField: "resolveOptional",
    acceptLabel: "Resolve",
    rejectLabel: "Skip",
    ...rest,
  };
}

function createCardSnapshot(overrides: Partial<LorcanaCardSnapshot> = {}): LorcanaCardSnapshot {
  return {
    cardId: overrides.cardId ?? asCardId("card-1"),
    definitionId: overrides.definitionId ?? "card-1",
    ownerId: overrides.ownerId ?? asPlayerId("player-1"),
    ownerSide: overrides.ownerSide ?? "playerOne",
    zoneId: overrides.zoneId ?? "play",
    label: overrides.label ?? "Goofy - Musketeer",
    isMasked: overrides.isMasked ?? false,
    facePresentation: overrides.facePresentation ?? "faceUp",
    cardType: overrides.cardType ?? "character",
    readyState: overrides.readyState ?? "ready",
    isDrying: overrides.isDrying ?? false,
    textEntries: overrides.textEntries ?? [],
    ...overrides,
  } as LorcanaCardSnapshot;
}

function createBoardSnapshot(
  overrides: Partial<LorcanaProjectedBoardView> = {},
): LorcanaProjectedBoardView {
  return {
    gameID: "game-1",
    matchID: "match-1",
    stateID: 1,
    playerOrder: [asPlayerId("player-1"), asPlayerId("player-2")],
    turnPlayer: asPlayerId("player-1"),
    priorityPlayer: asPlayerId("player-1"),
    turnNumber: 1,
    zones: {
      player_one: {
        deck: [],
        hand: [],
        play: [],
        inkwell: [],
        discard: [],
      },
      player_two: {
        deck: [],
        hand: [],
        play: [],
        inkwell: [],
        discard: [],
      },
    },
    cards: {},
    activeEffects: [],
    pendingEffects: [],
    bagEffects: [],
    ...overrides,
  } as unknown as LorcanaProjectedBoardView;
}

describe("LorcanaSidebarPresenter mobile actions", () => {
  it("keeps guidance at the bottom by default and resets it between presenter instances", () => {
    const firstPresenter = new LorcanaSidebarPresenter(createGameContextStub());

    expect(firstPresenter.guidancePosition).toBe("bottom");

    firstPresenter.handleGuidancePositionToggle();
    expect(firstPresenter.guidancePosition).toBe("top");

    const secondPresenter = new LorcanaSidebarPresenter(createGameContextStub());
    expect(secondPresenter.guidancePosition).toBe("bottom");
  });

  it("executes concede through the legal move entry", () => {
    const move = createConcedeMove();
    const executed: Array<{ moveId: string; params: Record<string, never> }> = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        executableMoves: () => [move],
        moveCategorySummaries: () => [
          {
            categoryId: "concede",
            categoryLabel: "Concede",
            sourceCardIds: [],
            isDirect: true,
          },
        ],
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, never> });
          return true;
        },
      }),
    );

    expect(presenter.canConcede).toBe(true);
    expect(presenter.handleMobileConcede()).toBe(true);
    expect(executed).toEqual([{ moveId: "concede", params: {} }]);
  });

  it("publishes a stub notice when reporting a player from mobile", () => {
    const statuses: string[] = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        setStatusMessage: (message) => {
          statuses.push(message);
        },
      }),
    );

    presenter.handleMobileReportPlayer();

    expect(presenter.mobileNotice?.message).toBe("Player reporting is not available yet.");
    expect(statuses.at(-1)).toBe("Player reporting is not available yet.");
  });

  it("returns a single activated item ability as the default click action", () => {
    const itemCard = createCardSnapshot({
      cardId: "item-1",
      label: "Magic Lamp",
      cardType: "item",
      textEntries: [{ title: "{E} Glow", description: "Draw a card." }],
    });
    const abilityMove: ExecutableMoveEntry = {
      id: "activateAbility:item-1:0",
      label: "Magic Lamp: {E} Glow",
      moveId: "activateAbility",
      params: {
        cardId: itemCard.cardId,
        abilityIndex: 0,
      } as LorcanaSimulatorMoveParams["activateAbility"],
      presentation: {
        kind: "targeted",
        categoryId: "activate-ability",
        categoryLabel: "Activate Ability",
        optionLabel: "Magic Lamp: {E} Glow",
      },
    };
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        expandCardMoves: () => [abilityMove],
      }),
    );

    expect(presenter.getSingleClickItemAbilityAction(itemCard)).toEqual({
      id: `activate-ability:${itemCard.cardId}`,
      cardId: itemCard.cardId,
      categoryId: "activate-ability",
      label: "Activate Ability",
      interaction: "execute-or-select",
      enabled: true,
      moves: [abilityMove],
    });
  });

  it("does not return a default click action when an item has multiple activated abilities", () => {
    const itemCard = createCardSnapshot({
      cardId: "item-1",
      label: "Magic Lamp",
      cardType: "item",
    });
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        expandCardMoves: () => [
          {
            id: "activateAbility:item-1:0",
            label: "Magic Lamp: Ability One",
            moveId: "activateAbility",
            params: {
              cardId: itemCard.cardId,
              abilityIndex: 0,
            } as LorcanaSimulatorMoveParams["activateAbility"],
            presentation: {
              kind: "targeted",
              categoryId: "activate-ability",
              categoryLabel: "Activate Ability",
              optionLabel: "Magic Lamp: Ability One",
            },
          },
          {
            id: "activateAbility:item-1:1",
            label: "Magic Lamp: Ability Two",
            moveId: "activateAbility",
            params: {
              cardId: itemCard.cardId,
              abilityIndex: 1,
            } as LorcanaSimulatorMoveParams["activateAbility"],
            presentation: {
              kind: "targeted",
              categoryId: "activate-ability",
              categoryLabel: "Activate Ability",
              optionLabel: "Magic Lamp: Ability Two",
            },
          },
        ],
      }),
    );

    expect(presenter.getSingleClickItemAbilityAction(itemCard)).toBeNull();
  });

  it("advances to the next pending effect action", () => {
    const resolved: string[] = [];
    const resolveMove = createResolveEffectMove();
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne" as const,
        getOwnerIdForSide: (side) => (side === "playerOne" ? "player-1" : "player-2"),
        boardSnapshot: () =>
          ({
            pendingChoice: { requestID: "effect-1" },
            pendingEffects: [
              {
                id: "effect-1",
                payload: { chooserId: "player-1" },
                sourceId: null,
                selectionContext: null,
              },
            ],
            bagEffects: [],
          }) as never,
        pendingResolutionMoves: () => [
          {
            id: "pending-resolution-1",
            moveId: "resolveEffect",
            params: resolveMove.params as { effectId: string },
          },
        ],
        executeMove: (moveId) => {
          resolved.push(moveId);
          return true;
        },
      }),
    );

    expect(presenter.hasPendingEffects).toBe(true);
    expect(presenter.canAdvancePendingEffects).toBe(true);
    expect(presenter.handleAdvancePendingEffects()).toBe(true);
    expect(resolved).toEqual(["resolveEffect"]);
  });

  it("does not expose opponent bag effects as advanceable local actions", () => {
    const resolved: string[] = [];
    const opponentCard = createCardSnapshot({
      cardId: "opponent-card-1",
      ownerId: "player-2",
      ownerSide: "playerTwo",
      label: "Mufasa - Betrayed Leader",
    });

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        getOwnerIdForSide: (side) => (side === "playerOne" ? "player-1" : "player-2"),
        boardSnapshot: () =>
          ({
            pendingChoice: null,
            pendingEffects: [],
            bagEffects: [
              {
                id: "bag-opp-1",
                type: "triggered",
                controllerId: "player-2",
                chooserId: "player-2",
                sourceId: opponentCard.cardId,
                payload: {
                  id: "bag-opp-1",
                  sourceId: opponentCard.cardId,
                  controllerId: "player-2",
                  chooserId: "player-2",
                  kind: "triggered-ability",
                  effect: { type: "draw", target: "CONTROLLER", amount: 1 },
                },
              },
            ],
          }) as never,
        cardSnapshotsById: () => ({
          [opponentCard.cardId]: opponentCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "resolveBag:bag-opp-1",
            moveId: "resolveBag",
            params: { bagId: "bag-opp-1" },
          },
        ],
        executeMove: (moveId) => {
          resolved.push(moveId);
          return true;
        },
      }),
    );

    expect(presenter.pendingEffectsPopoverItems[0]).toMatchObject({
      isLocalPlayer: false,
      canResolve: false,
      onResolve: undefined,
    });
    expect(presenter.canAdvancePendingEffects).toBe(false);
    expect(presenter.handleAdvancePendingEffects()).toBe(false);
    expect(
      presenter.activePlayerGuidance.some((item) =>
        item.message.includes("Mufasa - Betrayed Leader"),
      ),
    ).toBe(false);
    expect(resolved).toEqual([]);
  });

  it("exposes controller-ordered pending effects as local actions even when only opponent cards are selectable", () => {
    const resolved: string[] = [];
    const sourceCard = createCardSnapshot({
      cardId: "under-the-sea",
      ownerId: "player-1",
      ownerSide: "playerOne",
      label: "Under the Sea",
      cardType: "action",
    });
    const opponentTargetA = createCardSnapshot({
      cardId: "opponent-target-a",
      ownerId: "player-2",
      ownerSide: "playerTwo",
      label: "Weak Character A",
    });
    const opponentTargetB = createCardSnapshot({
      cardId: "opponent-target-b",
      ownerId: "player-2",
      ownerSide: "playerTwo",
      label: "Weak Character B",
    });

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        getOwnerIdForSide: (side) => (side === "playerOne" ? "player-1" : "player-2"),
        boardSnapshot: () =>
          ({
            pendingChoice: { requestID: "effect-1" },
            pendingEffects: [
              {
                id: "effect-1",
                type: "action-effect",
                sourceId: sourceCard.cardId,
                payload: {
                  chooserId: "player-1",
                  sourceCardId: sourceCard.cardId,
                  kind: "target-selection",
                },
                selectionContext: createTargetSelectionContext({
                  sourceCardId: sourceCard.cardId,
                  chooserId: "player-1",
                  cardCandidateIds: [opponentTargetA.cardId, opponentTargetB.cardId],
                  ordered: true,
                  minSelections: 2,
                  maxSelections: 2,
                }),
              },
            ],
            bagEffects: [],
          }) as never,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [opponentTargetA.cardId]: opponentTargetA,
          [opponentTargetB.cardId]: opponentTargetB,
        }),
        pendingResolutionMoves: () => [
          {
            id: "pending-resolution-1",
            moveId: "resolveEffect",
            params: { effectId: "effect-1" },
          },
        ],
        executeMove: (moveId) => {
          resolved.push(moveId);
          return true;
        },
      }),
    );

    expect(presenter.pendingEffectsPopoverItems[0]).toMatchObject({
      isLocalPlayer: true,
      canResolve: true,
    });
    expect(presenter.canAdvancePendingEffects).toBe(true);
    expect(presenter.handleAdvancePendingEffects()).toBe(true);
    expect(resolved).toEqual([]);
    expect(presenter.resolutionSelectionSession?.context).toMatchObject({
      chooserId: "player-1",
      ordered: true,
      cardCandidateIds: [opponentTargetA.cardId, opponentTargetB.cardId],
    });
  });

  it("exposes player entries in the selection-state for CHOSEN_PLAYER target prompts", () => {
    const sourceCard = createCardSnapshot({
      cardId: "second-star-1",
      ownerId: "player-1",
      ownerSide: "playerOne",
      label: "Second Star to the Right",
      cardType: "action",
    });

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        getOwnerIdForSide: (side) => (side === "playerOne" ? "player-1" : "player-2"),
        getRelativePlayerLabel: (side) => (side === "playerOne" ? "You" : "Opponent"),
        boardSnapshot: () =>
          ({
            playerOrder: [asPlayerId("player-1"), asPlayerId("player-2")],
            pendingChoice: { requestID: "effect-1" },
            pendingEffects: [
              {
                id: "effect-1",
                type: "action-effect",
                sourceId: sourceCard.cardId,
                payload: {
                  chooserId: "player-1",
                  sourceCardId: sourceCard.cardId,
                  kind: "target-selection",
                },
                selectionContext: createTargetSelectionContext({
                  sourceCardId: sourceCard.cardId,
                  chooserId: "player-1",
                  cardCandidateIds: [],
                  playerCandidateIds: ["player-1", "player-2"],
                  allowedZones: [],
                }),
              },
            ],
            bagEffects: [],
          }) as never,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
        }),
        pendingResolutionMoves: () => [
          {
            id: "pending-resolution-1",
            moveId: "resolveEffect",
            params: { effectId: "effect-1" },
          },
        ],
      }),
    );

    expect(presenter.handleAdvancePendingEffects()).toBe(true);

    const state = presenter.availableMovesSelectionState;
    expect(state?.mode).toBe("resolution-target");
    if (state?.mode !== "resolution-target") {
      throw new Error("expected resolution-target state");
    }

    expect(state.candidatePlayerIds).toEqual(["player-1", "player-2"]);
    const playerEntries = state.entries.filter((entry) => entry.kind === "player");
    expect(playerEntries.map((entry) => entry.playerId)).toEqual(["player-1", "player-2"]);
  });

  it("auto-resolves a single draw-then-optional bag entry into the follow-up prompt", () => {
    const executed: Array<{ moveId: string; params: Record<string, unknown> }> = [];
    const boardSnapshot = createBoardSnapshot({
      players: {
        [asPlayerId("player-1")]: {
          lore: 0,
          canAddCardToInkwell: false,
          handCount: 0,
          deckCount: 1,
          hand: [],
          play: [],
          inkwell: [],
          discard: [],
        },
      } as LorcanaProjectedBoardView["players"],
      bagEffects: [
        {
          id: "bag-1",
          type: "triggered",
          controllerId: asPlayerId("player-1"),
          chooserId: asPlayerId("player-1"),
          sourceId: asCardId("source-1"),
          payload: {
            effect: {
              type: "sequence",
              steps: [
                { type: "draw", amount: 1, target: "CONTROLLER" },
                {
                  type: "optional",
                  chooser: "CONTROLLER",
                  effect: { type: "play-card", from: "hand", cardType: "character", cost: "free" },
                },
              ],
            },
          },
        },
      ],
    });
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => boardSnapshot,
        pendingResolutionMoves: () => [
          {
            id: "resolve-bag-1",
            moveId: "resolveBag",
            params: { bagId: "bag-1" },
          },
        ],
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, unknown> });
          return true;
        },
      }),
    );

    presenter.syncAutoOpenPendingResolution();

    expect(executed).toEqual([
      {
        moveId: "resolveBag",
        params: { bagId: "bag-1" },
      },
    ]);
  });

  it("executes the clicked activated ability index instead of the aggregated category", () => {
    const card = createCardSnapshot({
      cardId: "pawpsicle-1",
      label: "Pawpsicle",
      cardType: "item",
      textEntries: [
        {
          title: "JUMBO POP",
          description: "When you play this item, you may draw a card.",
        },
        {
          title: "THAT'S REDWOOD",
          description: "Banish this item - Remove up to 2 damage from chosen character.",
        },
      ],
    });
    const executed: LorcanaSimulatorMoveParams["activateAbility"][] = [];
    const onlyLegalActivatedAbility: ExecutableMoveEntry = {
      id: "activateAbility:pawpsicle-1:1",
      label: "Pawpsicle: THAT'S REDWOOD",
      moveId: "activateAbility",
      params: { cardId: card.cardId, abilityIndex: 1 },
      presentation: {
        kind: "targeted",
        categoryId: "activate-ability",
        categoryLabel: "Activate Ability",
        optionLabel: "Pawpsicle: THAT'S REDWOOD",
      },
    };

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        cardSnapshotsById: () => ({ [card.cardId]: card }),
        expandCardMoves: () => [onlyLegalActivatedAbility],
        moveCategorySummaries: () => [
          {
            categoryId: "activate-ability",
            categoryLabel: "Activate Ability",
            sourceCardIds: [card.cardId],
            isDirect: false,
          },
        ],
        executeMove: (moveId, params) => {
          if (moveId !== "activateAbility") {
            return false;
          }

          executed.push(params as LorcanaSimulatorMoveParams["activateAbility"]);
          return true;
        },
      }),
    );

    expect(presenter.handleCardAbilityByIndex(card.cardId, 0)).toBe(false);
    expect(presenter.handleCardAbilityByIndex(card.cardId, 1)).toBe(true);
    expect(executed).toEqual([{ cardId: card.cardId, abilityIndex: 1 }]);
  });

  it("supports selecting multiple singers before confirming a Sing Together play", () => {
    const songCard = createCardSnapshot({
      cardId: "song-1",
      zoneId: "hand",
      cardType: "action",
      actionSubtype: "song",
      label: "I2I",
    });
    const singerOne = createCardSnapshot({
      cardId: "singer-1",
      label: "Ariel - Spectacular Singer",
    });
    const singerTwo = createCardSnapshot({
      cardId: "singer-2",
      label: "Shanti - Village Girl",
    });
    const executed: Array<{ moveId: string; params: Record<string, unknown> }> = [];
    const singTogetherMove: ExecutableMoveEntry = {
      id: "playCard:song-1:singTogether",
      label: "I2I (Sing Together)",
      moveId: "playCard",
      params: {
        cardId: songCard.cardId,
        cost: "singTogether",
      } satisfies LorcanaSimulatorMoveParams["playCard"],
      presentation: {
        kind: "targeted",
        categoryId: "sing-card",
        categoryLabel: "Sing",
        optionLabel: "Sing Together",
        selectionMode: "singTogether",
        requiredValue: 9,
        candidateCards: [
          { cardId: singerOne.cardId, value: 5 },
          { cardId: singerTwo.cardId, value: 5 },
        ],
      },
    };

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        cardSnapshotsById: () => ({
          [songCard.cardId]: songCard,
          [singerOne.cardId]: singerOne,
          [singerTwo.cardId]: singerTwo,
        }),
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, unknown> });
          return true;
        },
      }),
    );

    expect(presenter.startManualCardActionSelection("sing-card", [singTogetherMove])).toBe(true);
    expect(presenter.handleActionSessionCardSelection(songCard)).toBe(true);
    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "action",
      phase: "choose-target",
      canConfirm: false,
      sourceCardId: songCard.cardId,
    });

    expect(presenter.handleActionSessionCardSelection(singerOne)).toBe(true);
    expect(presenter.availableMovesSelectionState).toMatchObject({
      canConfirm: false,
      targetLabel: singerOne.label,
    });

    expect(presenter.handleActionSessionCardSelection(singerTwo)).toBe(true);
    expect(presenter.availableMovesSelectionState).toMatchObject({
      canConfirm: true,
      targetLabel: `${singerOne.label}, ${singerTwo.label}`,
    });

    expect(presenter.confirmActionSelection()).toBe(true);
    expect(executed).toEqual([
      {
        moveId: "playCard",
        params: {
          cardId: songCard.cardId,
          cost: "singTogether",
          singers: [singerOne.cardId, singerTwo.cardId],
        },
      },
    ]);
  });

  it("auto-submits deterministic single-target resolution selections when confirmation is skipped", () => {
    const sourceCard = createCardSnapshot({
      cardId: "source-1",
      label: "Dragon Fire",
      cardType: "action",
    });
    const targetCard = createCardSnapshot({
      cardId: "target-1",
      label: "Simba - Future King",
    });
    const executed: Array<{ moveId: string; params: Record<string, unknown> }> = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, unknown> });
          return true;
        },
      }),
    );

    presenter.skipActionConfirmation = true;
    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createTargetSelectionContext({
          sourceCardId: asCardId(sourceCard.cardId),
          cardCandidateIds: [asCardId(targetCard.cardId)],
        }),
      ),
    ).toBe(true);

    expect(presenter.handleAvailableMovesSelectionCard(targetCard.cardId)).toBe(true);
    expect(executed).toEqual([
      {
        moveId: "resolveEffect",
        params: {
          effectId: "effect-1",
          params: {
            targets: [targetCard.cardId],
          },
        },
      },
    ]);
    expect(presenter.availableMovesSelectionState).toBeNull();
  });

  it("keeps up-to single-target amount prompts manual when confirmation is skipped", () => {
    const sourceCard = createCardSnapshot({
      cardId: "source-1",
      label: "Healing Glow",
      cardType: "action",
    });
    const targetCard = createCardSnapshot({
      cardId: "target-1",
      label: "Simba - Future King",
      damage: 2,
    });
    const executed: Array<{ moveId: string; params: Record<string, unknown> }> = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () =>
          ({
            stateID: 1,
            playerOrder: [],
            pendingEffects: [
              {
                id: "effect-1",
                payload: {
                  effect: {
                    type: "remove-damage",
                    amount: { type: "up-to", value: 3 },
                  },
                },
              },
            ],
            bagEffects: [],
          }) as unknown as NonNullable<ReturnType<LorcanaGameContextValue["boardSnapshot"]>>,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, unknown> });
          return true;
        },
      }),
    );

    presenter.skipActionConfirmation = true;
    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createTargetSelectionContext({
          sourceCardId: asCardId(sourceCard.cardId),
          cardCandidateIds: [asCardId(targetCard.cardId)],
        }),
      ),
    ).toBe(true);

    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-target",
      amountSelection: {
        min: 0,
        max: 3,
        value: 3,
      },
    });

    expect(presenter.updateResolutionSelectedAmount(1)).toBe(true);
    expect(presenter.handleAvailableMovesSelectionCard(targetCard.cardId)).toBe(true);
    expect(executed).toEqual([]);
    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-target",
      canConfirm: true,
      amountSelection: {
        min: 0,
        max: 2,
        value: 1,
      },
      selectedTargetLabels: [targetCard.label],
    });

    expect(presenter.confirmActionSelection()).toBe(true);
    expect(executed).toEqual([
      {
        moveId: "resolveEffect",
        params: {
          effectId: "effect-1",
          params: {
            amount: 1,
            targets: [targetCard.cardId],
          },
        },
      },
    ]);
  });

  it("keeps multi-target resolution selections in manual confirm flow", () => {
    const sourceCard = createCardSnapshot({
      cardId: "source-1",
      label: "Twin Fire",
      cardType: "action",
    });
    const firstTarget = createCardSnapshot({
      cardId: "target-1",
      label: "Simba - Future King",
    });
    const secondTarget = createCardSnapshot({
      cardId: "target-2",
      label: "Mickey Mouse - Brave Little Tailor",
    });
    const executed: Array<{ moveId: string; params: Record<string, unknown> }> = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [firstTarget.cardId]: firstTarget,
          [secondTarget.cardId]: secondTarget,
        }),
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, unknown> });
          return true;
        },
      }),
    );

    presenter.skipActionConfirmation = true;
    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createTargetSelectionContext({
          sourceCardId: asCardId(sourceCard.cardId),
          cardCandidateIds: [asCardId(firstTarget.cardId), asCardId(secondTarget.cardId)],
          minSelections: 1,
          maxSelections: 2,
        }),
      ),
    ).toBe(true);

    expect(presenter.handleAvailableMovesSelectionCard(firstTarget.cardId)).toBe(true);
    expect(executed).toEqual([]);
    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-target",
      canConfirm: true,
      selectedTargetLabels: [firstTarget.label],
    });
  });

  it("does not confirm a play-or-shift prompt when only the in-play shift base is selected", () => {
    const sourceCard = createCardSnapshot({
      cardId: "source-1",
      label: "Syndrome - Out for Revenge",
      cardType: "character",
    });
    const handRobot = createCardSnapshot({
      cardId: "hand-robot",
      label: "Omnidroid - V.9",
      zoneId: "hand",
      cardType: "character",
    });
    const shiftBase = createCardSnapshot({
      cardId: "shift-base",
      label: "Omnidroid - V.8",
      zoneId: "play",
      cardType: "character",
    });
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [handRobot.cardId]: handRobot,
          [shiftBase.cardId]: shiftBase,
        }),
      }),
    );

    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createTargetSelectionContext({
          sourceCardId: asCardId(sourceCard.cardId),
          cardCandidateIds: [asCardId(handRobot.cardId), asCardId(shiftBase.cardId)],
          allowedZones: ["hand", "play"],
          minSelections: 1,
          maxSelections: 2,
          targetDsl: [
            {
              selector: "chosen",
              zones: ["hand"],
              count: 1,
            },
            {
              selector: "chosen",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              count: { upTo: 1 },
            },
          ],
        }),
      ),
    ).toBe(true);

    expect(presenter.handleAvailableMovesSelectionCard(shiftBase.cardId)).toBe(true);
    expect(presenter.resolutionSelectionSession?.selectedTargets).toEqual([shiftBase.cardId]);
    expect(presenter.canConfirmResolutionSelection).toBe(false);
    expect(presenter.confirmResolutionSelection()).toBe(false);

    expect(presenter.handleAvailableMovesSelectionCard(shiftBase.cardId)).toBe(true);
    expect(presenter.handleAvailableMovesSelectionCard(handRobot.cardId)).toBe(true);
    expect(presenter.canConfirmResolutionSelection).toBe(true);
  });

  it("keeps optional resolution decisions explicit even when confirmation skipping is enabled", () => {
    const sourceCard = createCardSnapshot({
      cardId: "source-1",
      label: "Bagheera - Cautious Explorer",
    });
    const executed: Array<{ moveId: string; params: Record<string, unknown> }> = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
        }),
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, unknown> });
          return true;
        },
      }),
    );

    presenter.skipActionConfirmation = true;
    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createOptionalSelectionContext({
          sourceCardId: asCardId(sourceCard.cardId),
        }),
      ),
    ).toBe(true);

    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-optional",
      canConfirm: false,
      canCancel: false,
    });
    expect(executed).toEqual([]);

    expect(presenter.handleAvailableMovesSelectionOption("accept")).toBe(true);
    expect(executed).toEqual([
      {
        moveId: "resolveEffect",
        params: {
          effectId: "effect-1",
          params: {
            resolveOptional: true,
          },
        },
      },
    ]);
  });

  it("confirms immediate optional target selections with implicit acceptance", () => {
    const sourceCard = createCardSnapshot({
      cardId: "source-1",
      label: "Jasmine - Resourceful Infiltrator",
    });
    const targetCard = createCardSnapshot({
      cardId: "target-1",
      label: "Donald Duck - Pie Slinger",
    });
    const executed: Array<{ moveId: string; params: Record<string, unknown> }> = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, unknown> });
          return true;
        },
      }),
    );
    presenter.skipActionConfirmation = false;

    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createTargetSelectionContext({
          sourceCardId: asCardId(sourceCard.cardId),
          cardCandidateIds: [asCardId(targetCard.cardId)],
          originatesFromOptional: true,
          canDeclineSelection: true,
        }),
      ),
    ).toBe(true);

    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-target",
      canCancel: true,
      canDecline: true,
      canConfirm: false,
      title: "Resolve optional effect from Jasmine - Resourceful Infiltrator",
    });

    expect(presenter.handleAvailableMovesSelectionCard(targetCard.cardId)).toBe(true);
    expect(presenter.confirmResolutionSelection()).toBe(true);
    expect(executed).toEqual([
      {
        moveId: "resolveEffect",
        params: {
          effectId: "effect-1",
          params: {
            resolveOptional: true,
            targets: [targetCard.cardId],
          },
        },
      },
    ]);
  });

  it("does not allow declining a follow-up target selection after an optional effect was accepted", () => {
    const sourceCard = createCardSnapshot({
      cardId: "source-1",
      label: "Pride Lands - Jungle Oasis",
    });
    const targetCard = createCardSnapshot({
      cardId: "target-1",
      label: "Donald Duck - Pie Slinger",
    });
    const executed: Array<{ moveId: string; params: Record<string, unknown> }> = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, unknown> });
          return true;
        },
      }),
    );

    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createTargetSelectionContext({
          sourceCardId: asCardId(sourceCard.cardId),
          cardCandidateIds: [asCardId(targetCard.cardId)],
          currentSelection: { resolveOptional: true },
        }),
      ),
    ).toBe(true);

    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-target",
      canDecline: false,
      canConfirm: false,
      title: "Resolve optional effect from Pride Lands - Jungle Oasis",
    });

    expect(presenter.handleAvailableMovesSelectionOption("reject")).toBe(false);
    expect(executed).toEqual([]);
    expect(presenter.resolutionSelectionSession).not.toBeNull();
  });

  it("shows the card and effect name in active guidance for target-selection prompts", () => {
    const sourceCard = createCardSnapshot({
      cardId: "source-1",
      label: "Jasmine - Resourceful Infiltrator",
      textEntries: [
        {
          title: "JUST WHAT YOU NEED",
          description:
            "When you play this character, you may give another chosen character Resist +1 until the start of your next turn.",
        },
      ],
    });
    const targetCard = createCardSnapshot({
      cardId: "target-1",
      label: "Donald Duck - Pie Slinger",
    });
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        getOwnerIdForSide: () => asPlayerId("player-1"),
        boardSnapshot: () =>
          createBoardSnapshot({
            pendingEffects: [
              {
                id: "effect-1",
                type: "action-effect",
                payload: {
                  abilityIndex: 0,
                  cardPlayed: {
                    cardType: "character",
                  },
                },
              },
            ],
          }),
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
      }),
    );

    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createTargetSelectionContext({
          sourceCardId: asCardId(sourceCard.cardId),
          cardCandidateIds: [asCardId(targetCard.cardId)],
        }),
      ),
    ).toBe(true);

    expect(presenter.activePlayerGuidance).toContainEqual(
      expect.objectContaining({
        id: "resolution-selection-inline",
        message:
          "Select the required target or player for Jasmine - Resourceful Infiltrator: JUST WHAT YOU NEED.",
        inlineReference: expect.objectContaining({
          label: "Jasmine - Resourceful Infiltrator: JUST WHAT YOU NEED",
          prefix: "Select the required target or player for ",
          suffix: ".",
        }),
      }),
    );
    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-target",
      message:
        "Select the required target or player for Jasmine - Resourceful Infiltrator: JUST WHAT YOU NEED.",
    });
  });

  it("clears stale target-selection guidance when the pending effect disappears", () => {
    const sourceCard = createCardSnapshot({
      cardId: "source-1",
      label: "Jasmine - Resourceful Infiltrator",
      textEntries: [
        {
          title: "JUST WHAT YOU NEED",
          description:
            "When you play this character, you may give another chosen character Resist +1 until the start of your next turn.",
        },
      ],
    });
    const targetCard = createCardSnapshot({
      cardId: "target-1",
      label: "Donald Duck - Pie Slinger",
    });

    let pendingResolutionMoves = [createPendingResolutionMove()];
    let boardSnapshot = {
      ...createBoardSnapshot(),
      pendingChoice: { requestID: "effect-1" },
      pendingEffects: [
        {
          id: "effect-1",
          type: "action-effect",
          sourceId: asCardId(sourceCard.cardId),
          selectionContext: createTargetSelectionContext({
            sourceCardId: asCardId(sourceCard.cardId),
            cardCandidateIds: [asCardId(targetCard.cardId)],
          }),
          payload: {
            abilityIndex: 0,
            cardPlayed: {
              cardType: "character",
            },
          },
        },
      ],
    } as never;

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        pendingResolutionMoves: () => pendingResolutionMoves,
        boardSnapshot: () => boardSnapshot,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
      }),
    );

    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createTargetSelectionContext({
          sourceCardId: asCardId(sourceCard.cardId),
          cardCandidateIds: [asCardId(targetCard.cardId)],
        }),
      ),
    ).toBe(true);
    expect(
      presenter.activePlayerGuidance.some((item) => item.id === "resolution-selection-inline"),
    ).toBe(true);

    pendingResolutionMoves = [];
    boardSnapshot = {
      ...createBoardSnapshot(),
      pendingChoice: null,
      pendingEffects: [],
    } as never;

    presenter.syncAutoOpenPendingResolution();

    expect(presenter.resolutionSelectionSession).toBeNull();
    expect(
      presenter.activePlayerGuidance.some((item) => item.id === "resolution-selection-inline"),
    ).toBe(false);
  });

  it("keeps the localized effect label when a pending trigger carries abilityIndex", () => {
    const sourceCard = createCardSnapshot({
      cardId: "source-1",
      label: "Jasmine - Resourceful Infiltrator",
      textEntries: [
        {
          title: "JUST WHAT YOU NEED",
          description:
            "When you play this character, you may give another chosen character Resist +1 until the start of your next turn.",
        },
        {
          title: "",
          description: "Ward",
        },
      ],
    });
    const targetCard = createCardSnapshot({
      cardId: "target-1",
      label: "Donald Duck - Pie Slinger",
    });
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        getOwnerIdForSide: (side) => (side === "playerOne" ? "player-1" : "player-2"),
        boardSnapshot: () =>
          createBoardSnapshot({
            pendingEffects: [
              {
                id: "effect-1",
                type: "action-effect",
                payload: {
                  abilityIndex: 0,
                  cardPlayed: {
                    cardType: "character",
                  },
                },
              },
            ],
          }),
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
      }),
    );

    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createTargetSelectionContext({
          sourceCardId: asCardId(sourceCard.cardId),
          cardCandidateIds: [asCardId(targetCard.cardId)],
        }),
      ),
    ).toBe(true);

    expect(presenter.activePlayerGuidance).toContainEqual(
      expect.objectContaining({
        id: "resolution-selection-inline",
        message:
          "Select the required target or player for Jasmine - Resourceful Infiltrator: JUST WHAT YOU NEED.",
        inlineReference: expect.objectContaining({
          label: "Jasmine - Resourceful Infiltrator: JUST WHAT YOU NEED",
          prefix: "Select the required target or player for ",
          suffix: ".",
        }),
      }),
    );
  });

  it("defaults up-to damage removal to the chosen target's maximum legal amount", () => {
    const sourceCard = createCardSnapshot({
      cardId: "source-1",
      label: "Healing Glow",
      cardType: "action",
    });
    const targetCard = createCardSnapshot({
      cardId: "target-1",
      label: "Goofy - Musketeer",
      damage: 2,
    });
    const executed: Array<{ moveId: string; params: Record<string, unknown> }> = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () =>
          ({
            stateID: 1,
            playerOrder: [],
            pendingEffects: [
              {
                id: "effect-1",
                payload: {
                  effect: {
                    type: "remove-damage",
                    amount: { type: "up-to", value: 3 },
                  },
                },
              },
            ],
            bagEffects: [],
          }) as unknown as NonNullable<ReturnType<LorcanaGameContextValue["boardSnapshot"]>>,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, unknown> });
          return true;
        },
      }),
    );
    presenter.skipActionConfirmation = false;

    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createTargetSelectionContext({
          sourceCardId: asCardId(sourceCard.cardId),
          cardCandidateIds: [asCardId(targetCard.cardId)],
        }),
      ),
    ).toBe(true);

    expect(presenter.handleAvailableMovesSelectionCard(targetCard.cardId)).toBe(true);
    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-target",
      amountSelection: {
        min: 0,
        max: 2,
        value: 2,
      },
    });

    expect(presenter.confirmActionSelection()).toBe(true);
    expect(executed).toEqual([
      {
        moveId: "resolveEffect",
        params: {
          effectId: "effect-1",
          params: {
            amount: 2,
            targets: [targetCard.cardId],
          },
        },
      },
    ]);
  });

  it("blocks confirmation when an undamaged source is picked but a damaged alternative exists (replay mgGuD8kTITPMhvIEL3wO5ZG turn 22)", () => {
    // Luisa Madrigal — I CAN TAKE IT: "Move up to 1 damage from chosen
    // character of yours to this character." If the player picks an
    // undamaged friendly source while another friendly has damage on it,
    // the up-to cap collapses to 0; the engine would silently advance the
    // prompt with amount=0. With a damaged alternative on the board, the
    // simulator keeps Confirm disabled so the player picks the useful one.
    const sourceCard = createCardSnapshot({
      cardId: "luisa",
      label: "Luisa Madrigal - Confident Climber",
      damage: 0,
    });
    const undamagedFriendly = createCardSnapshot({
      cardId: "friendly-undamaged",
      label: "Undamaged Friendly",
      damage: 0,
    });
    const damagedFriendly = createCardSnapshot({
      cardId: "friendly-damaged",
      label: "Damaged Friendly",
      damage: 2,
    });
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () =>
          ({
            stateID: 1,
            playerOrder: [],
            pendingEffects: [
              {
                id: "effect-1",
                payload: {
                  effect: {
                    type: "move-damage",
                    amount: { type: "up-to", value: 1 },
                    from: "CHOSEN_CHARACTER_OF_YOURS",
                    to: "SELF",
                  },
                },
              },
            ],
            bagEffects: [],
          }) as unknown as NonNullable<ReturnType<LorcanaGameContextValue["boardSnapshot"]>>,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [undamagedFriendly.cardId]: undamagedFriendly,
          [damagedFriendly.cardId]: damagedFriendly,
        }),
      }),
    );

    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createTargetSelectionContext({
          sourceCardId: asCardId(sourceCard.cardId),
          cardCandidateIds: [asCardId(undamagedFriendly.cardId), asCardId(damagedFriendly.cardId)],
        }),
      ),
    ).toBe(true);

    expect(presenter.handleAvailableMovesSelectionCard(undamagedFriendly.cardId)).toBe(true);
    expect(presenter.canConfirmResolutionSelection).toBe(false);
  });

  it("still blocks confirmation when the prompt is optional and only undamaged sources exist", () => {
    // The player can decline the optional via the Skip path — keep Confirm
    // disabled so they don't accidentally submit a 0-damage no-op.
    const sourceCard = createCardSnapshot({
      cardId: "luisa-optional",
      label: "Luisa Madrigal - Confident Climber",
      damage: 0,
    });
    const undamagedFriendly = createCardSnapshot({
      cardId: "friendly-only-undamaged",
      label: "Undamaged Friendly",
      damage: 0,
    });
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () =>
          ({
            stateID: 1,
            playerOrder: [],
            pendingEffects: [
              {
                id: "effect-1",
                payload: {
                  effect: {
                    type: "move-damage",
                    amount: { type: "up-to", value: 1 },
                    from: "CHOSEN_CHARACTER_OF_YOURS",
                    to: "SELF",
                  },
                },
              },
            ],
            bagEffects: [],
          }) as unknown as NonNullable<ReturnType<LorcanaGameContextValue["boardSnapshot"]>>,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [undamagedFriendly.cardId]: undamagedFriendly,
        }),
      }),
    );

    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createTargetSelectionContext({
          sourceCardId: asCardId(sourceCard.cardId),
          cardCandidateIds: [asCardId(undamagedFriendly.cardId)],
          originatesFromOptional: true,
        }),
      ),
    ).toBe(true);

    expect(presenter.handleAvailableMovesSelectionCard(undamagedFriendly.cardId)).toBe(true);
    expect(presenter.canConfirmResolutionSelection).toBe(false);
  });

  it("allows confirmation on a mandatory prompt with no damaged alternative (avoids deadlock)", () => {
    // No damaged candidates and no decline path: rules-wise "up to N" with
    // 0 available damage is a valid 0-damage resolution. The simulator must
    // let the player advance — otherwise the prompt is unresolvable.
    const sourceCard = createCardSnapshot({
      cardId: "mandatory-source",
      label: "Mandatory Source",
      damage: 0,
    });
    const undamagedFriendly = createCardSnapshot({
      cardId: "friendly-only",
      label: "Undamaged Friendly",
      damage: 0,
    });
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () =>
          ({
            stateID: 1,
            playerOrder: [],
            pendingEffects: [
              {
                id: "effect-1",
                payload: {
                  effect: {
                    type: "move-damage",
                    amount: { type: "up-to", value: 1 },
                    from: "CHOSEN_CHARACTER_OF_YOURS",
                    to: "SELF",
                  },
                },
              },
            ],
            bagEffects: [],
          }) as unknown as NonNullable<ReturnType<LorcanaGameContextValue["boardSnapshot"]>>,
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [undamagedFriendly.cardId]: undamagedFriendly,
        }),
      }),
    );

    presenter.skipActionConfirmation = false;
    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createTargetSelectionContext({
          sourceCardId: asCardId(sourceCard.cardId),
          cardCandidateIds: [asCardId(undamagedFriendly.cardId)],
        }),
      ),
    ).toBe(true);

    expect(presenter.handleAvailableMovesSelectionCard(undamagedFriendly.cardId)).toBe(true);
    expect(presenter.canConfirmResolutionSelection).toBe(true);
  });

  it("emits a slotted `move-damage` targets object when the engine asks for it", () => {
    const sourceCard = createCardSnapshot({
      cardId: "source-1",
      label: "Alma Madrigal - Heart of the Family",
    });
    const fromCard = createCardSnapshot({
      cardId: "friendly-1",
      label: "Friendly Character",
    });
    const toCard = createCardSnapshot({
      cardId: "opposing-1",
      label: "Opposing Character",
    });
    const executed: Array<{ moveId: string; params: Record<string, unknown> }> = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [fromCard.cardId]: fromCard,
          [toCard.cardId]: toCard,
        }),
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, unknown> });
          return true;
        },
      }),
    );

    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createTargetSelectionContext({
          sourceCardId: asCardId(sourceCard.cardId),
          cardCandidateIds: [asCardId(fromCard.cardId), asCardId(toCard.cardId)],
          minSelections: 2,
          maxSelections: 2,
          ordered: true,
          expectedSlottedKind: "move-damage",
        }),
      ),
    ).toBe(true);

    expect(presenter.handleAvailableMovesSelectionCard(fromCard.cardId)).toBe(true);
    expect(presenter.handleAvailableMovesSelectionCard(toCard.cardId)).toBe(true);
    expect(presenter.confirmResolutionSelection()).toBe(true);

    expect(executed).toEqual([
      {
        moveId: "resolveEffect",
        params: {
          effectId: "effect-1",
          params: {
            targets: {
              kind: "move-damage",
              from: [fromCard.cardId],
              to: [toCard.cardId],
            },
          },
        },
      },
    ]);
  });

  it("emits fixed-location move-to-location targets from the locked prompt slot", () => {
    const sourceCard = createCardSnapshot({
      cardId: "source-1",
      label: "Goofy - Set for Adventure",
    });
    const subjectCard = createCardSnapshot({
      cardId: "subject-1",
      label: "Vacation Buddy",
    });
    const locationCard = createCardSnapshot({
      cardId: "location-1",
      label: "Flotilla - Coconut Armada",
      cardType: "location",
    });
    const context = createTargetSelectionContext({
      origin: "bag",
      requestId: "bag-1",
      sourceCardId: sourceCard.cardId,
      cardCandidateIds: [subjectCard.cardId],
      minSelections: 1,
      maxSelections: 1,
      declaredMaxSelections: 1,
      expectedSlottedKind: "move-to-location",
      targetDsl: [
        {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
        },
      ],
    });
    const executed: Array<{ moveId: string; params: Record<string, unknown> }> = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        getOwnerIdForSide: (side) => (side === "playerOne" ? "player-1" : "player-2"),
        boardSnapshot: () =>
          createBoardSnapshot({
            pendingChoice: {
              type: "action-effect",
              playerID: context.chooserId,
              requestID: context.requestId,
            },
            cards: {
              [sourceCard.cardId]: {
                id: sourceCard.cardId,
                ownerId: asPlayerId("player-1"),
                controllerId: asPlayerId("player-1"),
                zone: "play",
                cardType: "character",
                atLocationId: asCardId(locationCard.cardId),
              },
              [subjectCard.cardId]: {
                id: subjectCard.cardId,
                ownerId: asPlayerId("player-1"),
                controllerId: asPlayerId("player-1"),
                zone: "play",
                cardType: "character",
              },
              [locationCard.cardId]: {
                id: locationCard.cardId,
                ownerId: asPlayerId("player-1"),
                controllerId: asPlayerId("player-1"),
                zone: "play",
                cardType: "location",
              },
            },
            bagEffects: [
              {
                id: context.requestId,
                type: "triggered",
                controllerId: asPlayerId("player-1"),
                chooserId: context.chooserId,
                sourceId: asCardId(sourceCard.cardId),
                payload: {},
                selectionContext: context,
              },
            ],
          }),
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [subjectCard.cardId]: subjectCard,
          [locationCard.cardId]: locationCard,
        }),
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, unknown> });
          return true;
        },
      }),
    );
    presenter.skipActionConfirmation = false;

    expect(
      presenter.startResolutionSelectionSession(
        createPendingBagResolutionMove(context.requestId),
        context,
      ),
    ).toBe(true);
    expect(presenter.interactionView?.activePrompt?.slots?.[1]).toMatchObject({
      key: "location",
      locked: true,
      targetCardId: locationCard.cardId,
    });
    expect(presenter.handleAvailableMovesSelectionCard(subjectCard.cardId)).toBe(true);
    expect(presenter.resolutionSelectionSession?.selectedTargets).toEqual([subjectCard.cardId]);
    expect(presenter.canConfirmResolutionSelection).toBe(true);
    expect(presenter.confirmResolutionSelection()).toBe(true);

    expect(executed).toEqual([
      {
        moveId: "resolveBag",
        params: {
          bagId: context.requestId,
          params: {
            targets: {
              kind: "move-to-location",
              subject: [subjectCard.cardId],
              location: [locationCard.cardId],
            },
          },
        },
      },
    ]);
  });

  it("confirms one character plus one location for required move-to-location prompts", () => {
    const sourceCard = createCardSnapshot({
      cardId: "source-1",
      label: "Touch the Sky",
      cardType: "action",
    });
    const subjectCard = createCardSnapshot({
      cardId: "subject-1",
      label: "Goofy - Set for Adventure",
      cardType: "character",
    });
    const locationCard = createCardSnapshot({
      cardId: "location-1",
      label: "Flotilla - Coconut Armada",
      cardType: "location",
    });
    const context = createTargetSelectionContext({
      sourceCardId: sourceCard.cardId,
      cardCandidateIds: [subjectCard.cardId, locationCard.cardId],
      minSelections: 2,
      maxSelections: 2,
      declaredMaxSelections: 2,
      expectedSlottedKind: "move-to-location",
      targetDsl: [
        {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
        {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["location"],
        },
      ],
    });
    const executed: Array<{ moveId: string; params: Record<string, unknown> }> = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        ownerSide: () => "playerOne",
        getOwnerIdForSide: (side) => (side === "playerOne" ? "player-1" : "player-2"),
        boardSnapshot: () =>
          createBoardSnapshot({
            pendingChoice: {
              type: "action-effect",
              playerID: context.chooserId,
              requestID: context.requestId,
            },
            cards: {
              [sourceCard.cardId]: {
                id: sourceCard.cardId,
                ownerId: asPlayerId("player-1"),
                controllerId: asPlayerId("player-1"),
                zone: "discard",
                cardType: "action",
              },
              [subjectCard.cardId]: {
                id: subjectCard.cardId,
                ownerId: asPlayerId("player-1"),
                controllerId: asPlayerId("player-1"),
                zone: "play",
                cardType: "character",
              },
              [locationCard.cardId]: {
                id: locationCard.cardId,
                ownerId: asPlayerId("player-1"),
                controllerId: asPlayerId("player-1"),
                zone: "play",
                cardType: "location",
              },
            },
            pendingEffects: [
              {
                id: context.requestId,
                type: "action-effect",
                sourceId: asCardId(sourceCard.cardId),
                payload: {},
                selectionContext: context,
              },
            ],
          }),
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [subjectCard.cardId]: subjectCard,
          [locationCard.cardId]: locationCard,
        }),
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, unknown> });
          return true;
        },
      }),
    );
    presenter.skipActionConfirmation = false;

    expect(presenter.startResolutionSelectionSession(createPendingResolutionMove(), context)).toBe(
      true,
    );
    expect(presenter.handleAvailableMovesSelectionCard(subjectCard.cardId)).toBe(true);
    expect(presenter.handleAvailableMovesSelectionCard(locationCard.cardId)).toBe(true);
    expect(presenter.canConfirmResolutionSelection).toBe(true);
    expect(presenter.confirmResolutionSelection()).toBe(true);

    expect(executed).toEqual([
      {
        moveId: "resolveEffect",
        params: {
          effectId: "effect-1",
          params: {
            targets: {
              kind: "move-to-location",
              subject: [subjectCard.cardId],
              location: [locationCard.cardId],
            },
          },
        },
      },
    ]);
  });

  it("confirms a move-to-location destination prompt when the character is already selected", () => {
    const sourceCard = createCardSnapshot({
      cardId: "source-1",
      label: "Sugar Rush Speedway - Starting Line",
      cardType: "location",
    });
    const subjectCard = createCardSnapshot({
      cardId: "subject-1",
      label: "Vanellope von Schweetz - Random Roster Racer",
      cardType: "character",
    });
    const locationCard = createCardSnapshot({
      cardId: "location-1",
      label: "Sugar Rush Speedway - Finish Line",
      cardType: "location",
    });
    const context = createTargetSelectionContext({
      sourceCardId: sourceCard.cardId,
      currentSelection: { targets: [asCardId(subjectCard.cardId)] },
      cardCandidateIds: [locationCard.cardId],
      minSelections: 1,
      maxSelections: 1,
      declaredMaxSelections: 1,
      expectedSlottedKind: "move-to-location",
      targetDsl: [
        {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["location"],
        },
      ],
    });
    const executed: Array<{ moveId: string; params: Record<string, unknown> }> = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () =>
          createBoardSnapshot({
            pendingChoice: {
              type: "action-effect",
              playerID: context.chooserId,
              requestID: context.requestId,
            },
            cards: {
              [sourceCard.cardId]: {
                id: sourceCard.cardId,
                ownerId: asPlayerId("player-1"),
                controllerId: asPlayerId("player-1"),
                zone: "play",
                cardType: "location",
              },
              [subjectCard.cardId]: {
                id: subjectCard.cardId,
                ownerId: asPlayerId("player-1"),
                controllerId: asPlayerId("player-1"),
                zone: "play",
                cardType: "character",
              },
              [locationCard.cardId]: {
                id: locationCard.cardId,
                ownerId: asPlayerId("player-1"),
                controllerId: asPlayerId("player-1"),
                zone: "play",
                cardType: "location",
              },
            },
            pendingEffects: [
              {
                id: context.requestId,
                type: "action-effect",
                sourceId: asCardId(sourceCard.cardId),
                payload: {},
                selectionContext: context,
              },
            ],
          }),
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [subjectCard.cardId]: subjectCard,
          [locationCard.cardId]: locationCard,
        }),
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, unknown> });
          return true;
        },
      }),
    );
    presenter.skipActionConfirmation = false;

    expect(presenter.startResolutionSelectionSession(createPendingResolutionMove(), context)).toBe(
      true,
    );
    expect(presenter.resolutionSelectionSession?.selectedTargets).toEqual([subjectCard.cardId]);
    expect(presenter.handleAvailableMovesSelectionCard(locationCard.cardId)).toBe(true);
    expect(presenter.resolutionSelectionSession?.selectedTargets).toEqual([
      subjectCard.cardId,
      locationCard.cardId,
    ]);
    expect(presenter.canConfirmResolutionSelection).toBe(true);
    expect(presenter.confirmResolutionSelection()).toBe(true);

    expect(executed).toEqual([
      {
        moveId: "resolveEffect",
        params: {
          effectId: "effect-1",
          params: {
            targets: {
              kind: "move-to-location",
              subject: [subjectCard.cardId],
              location: [locationCard.cardId],
            },
          },
        },
      },
    ]);
  });

  it("falls back to a flat targets array when no expectedSlottedKind is set", () => {
    const sourceCard = createCardSnapshot({
      cardId: "source-1",
      label: "Any Source",
    });
    const targetCard = createCardSnapshot({
      cardId: "target-1",
      label: "Any Target",
    });
    const executed: Array<{ moveId: string; params: Record<string, unknown> }> = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        cardSnapshotsById: () => ({
          [sourceCard.cardId]: sourceCard,
          [targetCard.cardId]: targetCard,
        }),
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, unknown> });
          return true;
        },
      }),
    );
    presenter.skipActionConfirmation = false;

    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createTargetSelectionContext({
          sourceCardId: asCardId(sourceCard.cardId),
          cardCandidateIds: [asCardId(targetCard.cardId)],
        }),
      ),
    ).toBe(true);

    expect(presenter.handleAvailableMovesSelectionCard(targetCard.cardId)).toBe(true);
    expect(presenter.confirmResolutionSelection()).toBe(true);

    expect(executed).toEqual([
      {
        moveId: "resolveEffect",
        params: {
          effectId: "effect-1",
          params: {
            targets: [targetCard.cardId],
          },
        },
      },
    ]);
  });
});
