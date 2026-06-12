import { describe, expect, it, mock } from "bun:test";
import type {
  AvailableMovesSelectionState,
  ExecutableMovePresentationCategoryId,
  LorcanaCardSnapshot,
} from "@/features/simulator/model/contracts.js";
import { buildSimulatorHotkeyDescriptors } from "./simulator-hotkey-registry.js";

function createCard(
  cardId: string,
  label: string,
  zoneId: LorcanaCardSnapshot["zoneId"],
  ownerSide: LorcanaCardSnapshot["ownerSide"],
): LorcanaCardSnapshot {
  return {
    cardId,
    definitionId: `def-${cardId}`,
    isMasked: false,
    label,
    ownerId: ownerSide === "playerOne" ? "player-one" : "player-two",
    ownerSide,
    zoneId,
    cardType: zoneId === "hand" ? "action" : "character",
    facePresentation: "faceUp",
  };
}

function createActionSelectionState(cardId: string): AvailableMovesSelectionState {
  return {
    mode: "action",
    phase: "choose-target",
    categoryId: "challenge",
    categoryLabel: "Challenge",
    title: "Challenge",
    message: "Choose a target.",
    canBack: true,
    canCancel: true,
    canConfirm: false,
    sourceCardId: null,
    sourceLabel: null,
    targetCardId: null,
    targetLabel: null,
    selectedMoveId: null,
    selectedMoveLabel: null,
    entries: [
      {
        id: `card:${cardId}`,
        kind: "card",
        cardId,
        label: "Selectable card",
        selected: false,
      },
    ],
  };
}

const baseArgs = {
  moveCategorySummaries: [],
  selectionState: null,
  pendingDirectMove: null,
  armedCardId: null,
  opponentPlayCards: [],
  ownedPlayCards: [],
  ownedHandCards: [],
  opponentHandCards: [],
  canBack: false,
  canCancel: false,
  canConfirm: false,
  openCommandPalette: () => {},
  cancel: () => {},
  back: () => {},
  confirm: () => {},
  runMoveCategory: (_categoryId: ExecutableMovePresentationCategoryId) => {},
  inspectCard: (_card: LorcanaCardSnapshot) => {},
  selectCard: (_cardId: string) => {},
} as const;

describe("simulator-hotkey-registry", () => {
  it("emits global descriptors with stable bindings and pass-turn on Space", () => {
    const runMoveCategory = mock((_categoryId: ExecutableMovePresentationCategoryId) => {});

    const descriptors = buildSimulatorHotkeyDescriptors({
      ...baseArgs,
      moveCategorySummaries: [
        { categoryId: "pass-turn", categoryLabel: "Pass Turn" },
        { categoryId: "play-card", categoryLabel: "Play" },
      ],
      canCancel: true,
      runMoveCategory,
    });

    expect(descriptors.find((descriptor) => descriptor.id === "global-cancel")?.hotkey).toBe(
      "Escape",
    );
    expect(descriptors.find((descriptor) => descriptor.id === "global-confirm")?.hotkey).toBe(
      "Enter",
    );

    const passTurn = descriptors.find((descriptor) => descriptor.id === "move:pass-turn");
    expect(passTurn?.hotkey).toBe("Space");
    expect(passTurn?.layer).toBe("global");

    // Number row 1-0 is reserved for hand cards now — categories must not
    // claim digits at the registry level.
    expect(descriptors.find((descriptor) => descriptor.id === "move:play-card")).toBeUndefined();

    passTurn?.execute();
    expect(runMoveCategory).toHaveBeenCalledWith("pass-turn");
  });

  it("maps each zone to its keyboard row in idle-browse and inspects on press", () => {
    const inspectCard = mock((_card: LorcanaCardSnapshot) => {});
    const opponentPlayCard = createCard("opp-1", "Aladdin", "play", "playerTwo");
    const ownedPlayCard = createCard("play-1", "Mickey", "play", "playerOne");
    const ownedHandCard = createCard("hand-1", "Elsa", "hand", "playerOne");

    const descriptors = buildSimulatorHotkeyDescriptors({
      ...baseArgs,
      opponentPlayCards: [opponentPlayCard],
      ownedPlayCards: [ownedPlayCard],
      ownedHandCards: [ownedHandCard],
      inspectCard,
    });

    const handDescriptor = descriptors.find((descriptor) => descriptor.id === "card:hand:hand-1");
    const playDescriptor = descriptors.find((descriptor) => descriptor.id === "card:play:play-1");
    const opponentDescriptor = descriptors.find(
      (descriptor) => descriptor.id === "card:opponent:opp-1",
    );

    expect(handDescriptor?.hotkey).toBe("1");
    expect(handDescriptor?.cardZone).toBe("your-hand");
    expect(handDescriptor?.layer).toBe("idle-browse");
    expect(handDescriptor?.enabled).toBe(true);

    expect(playDescriptor?.hotkey).toBe("q");
    expect(playDescriptor?.cardZone).toBe("your-play");
    expect(playDescriptor?.enabled).toBe(true);

    expect(opponentDescriptor?.hotkey).toBe("a");
    expect(opponentDescriptor?.cardZone).toBe("opponent-play");
    expect(opponentDescriptor?.enabled).toBe(true);

    handDescriptor?.execute();
    playDescriptor?.execute();
    opponentDescriptor?.execute();

    expect(inspectCard).toHaveBeenCalledTimes(3);
    expect(inspectCard).toHaveBeenNthCalledWith(1, ownedHandCard);
    expect(inspectCard).toHaveBeenNthCalledWith(2, ownedPlayCard);
    expect(inspectCard).toHaveBeenNthCalledWith(3, opponentPlayCard);
  });

  it("disables card descriptors and silences off-zone rows during selecting layer", () => {
    const selectCard = mock((_cardId: string) => {});
    const inspectCard = mock((_card: LorcanaCardSnapshot) => {});
    const opponentPlayCard = createCard("opp-1", "Aladdin", "play", "playerTwo");
    const ownedPlayCard = createCard("play-1", "Mickey", "play", "playerOne");
    const ownedHandCard = createCard("hand-1", "Elsa", "hand", "playerOne");

    const descriptors = buildSimulatorHotkeyDescriptors({
      ...baseArgs,
      selectionState: createActionSelectionState("opp-1"),
      opponentPlayCards: [opponentPlayCard],
      ownedPlayCards: [ownedPlayCard],
      ownedHandCards: [ownedHandCard],
      canBack: true,
      canCancel: true,
      inspectCard,
      selectCard,
    });

    const opponentDescriptor = descriptors.find(
      (descriptor) => descriptor.id === "card:opponent:opp-1",
    );
    const ownedPlayDescriptor = descriptors.find(
      (descriptor) => descriptor.id === "card:play:play-1",
    );
    const handDescriptor = descriptors.find((descriptor) => descriptor.id === "card:hand:hand-1");

    expect(opponentDescriptor?.enabled).toBe(true);
    expect(opponentDescriptor?.layer).toBe("selecting");
    expect(ownedPlayDescriptor?.enabled).toBe(false);
    expect(handDescriptor?.enabled).toBe(false);

    opponentDescriptor?.execute();
    ownedPlayDescriptor?.execute();
    handDescriptor?.execute();

    // Pressing during selection picks the target — never inspects.
    expect(selectCard).toHaveBeenCalledTimes(3);
    expect(selectCard).toHaveBeenNthCalledWith(1, "opp-1");
    expect(inspectCard).not.toHaveBeenCalled();
  });

  it("activates the opponent-hand row only when those cards are surfaced as targets", () => {
    const idleDescriptors = buildSimulatorHotkeyDescriptors({
      ...baseArgs,
      ownedHandCards: [createCard("hand-1", "Elsa", "hand", "playerOne")],
    });
    expect(idleDescriptors.some((descriptor) => descriptor.cardZone === "opponent-hand")).toBe(
      false,
    );

    const oppHandCard = createCard("opp-hand-1", "Hidden", "hand", "playerTwo");
    const targetingDescriptors = buildSimulatorHotkeyDescriptors({
      ...baseArgs,
      selectionState: createActionSelectionState("opp-hand-1"),
      opponentHandCards: [oppHandCard],
      canBack: true,
      canCancel: true,
    });

    const opponentHandDescriptor = targetingDescriptors.find(
      (descriptor) => descriptor.id === "card:opponent-hand:opp-hand-1",
    );
    expect(opponentHandDescriptor?.hotkey).toBe("z");
    expect(opponentHandDescriptor?.cardZone).toBe("opponent-hand");
    expect(opponentHandDescriptor?.enabled).toBe(true);
  });

  it("resolves the selecting zone even when the leading entry isn't in any hotkey-bound slice", () => {
    // The shell slices each zone array to row length, so selection entries can
    // point to cards outside those slices. Picking only the first selectable
    // entry would mis-detect the zone and disable every card row.
    const oppHotkeyCard = createCard("opp-1", "Aladdin", "play", "playerTwo");
    const offSliceEntryId = "opp-out-of-slice";
    const selectionState: AvailableMovesSelectionState = {
      ...createActionSelectionState(offSliceEntryId),
      entries: [
        {
          id: `card:${offSliceEntryId}`,
          kind: "card",
          cardId: offSliceEntryId,
          label: "Off-slice card",
          selected: false,
        },
        {
          id: "card:opp-1",
          kind: "card",
          cardId: "opp-1",
          label: "In-slice card",
          selected: false,
        },
      ],
    };

    const descriptors = buildSimulatorHotkeyDescriptors({
      ...baseArgs,
      selectionState,
      opponentPlayCards: [oppHotkeyCard],
      canBack: true,
      canCancel: true,
    });

    expect(descriptors.find((descriptor) => descriptor.id === "card:opponent:opp-1")?.enabled).toBe(
      true,
    );
  });

  it("disables every card row when a card is armed (action-menu layer)", () => {
    const ownedHandCard = createCard("hand-1", "Elsa", "hand", "playerOne");
    const ownedPlayCard = createCard("play-1", "Mickey", "play", "playerOne");

    const descriptors = buildSimulatorHotkeyDescriptors({
      ...baseArgs,
      armedCardId: "hand-1",
      ownedHandCards: [ownedHandCard],
      ownedPlayCards: [ownedPlayCard],
    });

    expect(descriptors.find((descriptor) => descriptor.id === "card:hand:hand-1")?.enabled).toBe(
      false,
    );
    expect(descriptors.find((descriptor) => descriptor.id === "card:play:play-1")?.enabled).toBe(
      false,
    );
  });

  it("keeps globals available in every layer", () => {
    const descriptors = buildSimulatorHotkeyDescriptors({
      ...baseArgs,
      armedCardId: "hand-1",
      moveCategorySummaries: [{ categoryId: "pass-turn", categoryLabel: "Pass Turn" }],
      canCancel: true,
    });

    const globals = descriptors.filter((descriptor) => descriptor.layer === "global");
    expect(globals.map((d) => d.id).sort()).toEqual(
      [
        "global-back",
        "global-cancel",
        "global-confirm",
        "global-open-command-palette",
        "move:pass-turn",
      ].sort(),
    );
  });

  it("shows pending direct move label on confirm", () => {
    const descriptors = buildSimulatorHotkeyDescriptors({
      ...baseArgs,
      moveCategorySummaries: [],
      pendingDirectMove: {
        id: "undo:1",
        label: "Undo last move",
        categoryId: "undo",
        execute: () => {},
      },
      canCancel: true,
      canConfirm: true,
    });

    expect(descriptors.find((descriptor) => descriptor.id === "global-confirm")?.label).toContain(
      "Undo last move",
    );
  });
});
