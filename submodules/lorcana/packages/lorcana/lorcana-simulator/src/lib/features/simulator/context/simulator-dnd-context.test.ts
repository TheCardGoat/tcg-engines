import { describe, expect, it } from "bun:test";

import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";
import { canDragHandCard } from "./simulator-dnd-context.svelte.js";
import { dispatchDropIntent } from "./simulator-dnd-dispatch.js";

function createDropActionGame(
  overrides: Partial<Parameters<typeof dispatchDropIntent>[0]["game"]> = {},
) {
  return {
    openPlayCardSelection: () => false,
    playCard: () => false,
    ink: () => false,
    shouldOpenPlayCardSelectionOnDrop: () => false,
    canDropHandCardIntoZone: () => false,
    questCard: () => false,
    executeChallengeDrop: () => false,
    executeMoveToLocationDrop: () => false,
    executeShiftDrop: () => false,
    executeSingDrop: () => false,
    ...overrides,
  };
}

describe("dispatchDropIntent", () => {
  it("classifies playable discard cards as hand-style play drags", () => {
    const card: LorcanaCardSnapshot = {
      cardId: "playable-discard",
      definitionId: "look-what-youve-done",
      facePresentation: "faceUp",
      isMasked: false,
      label: "Look What You've Done",
      ownerId: "player_one",
      ownerSide: "playerOne",
      zoneId: "discard",
    };

    expect(
      canDragHandCard({
        card,
        playableCardIds: ["playable-discard"],
        ownerSide: "playerOne",
        turnSide: "playerOne",
      }),
    ).toBe(true);
  });

  it("auto-plays a hand card dropped on play when only one variant exists", () => {
    const calls: string[] = [];

    const result = dispatchDropIntent({
      cardId: "vanilla",
      dropIntent: {
        kind: "zone",
        playerSide: "playerOne",
        zoneId: "play",
      },
      draggedCardKind: "hand",
      ownerSide: "playerOne",
      game: createDropActionGame({
        canDropHandCardIntoZone: () => true,
        playCard: () => {
          calls.push("playCard");
          return true;
        },
      }),
    });

    expect(result).toBe(true);
    expect(calls).toEqual(["playCard"]);
  });

  it("opens play selection when a hand card dropped on play has multiple variants", () => {
    const calls: string[] = [];

    const result = dispatchDropIntent({
      cardId: "bodyguard",
      dropIntent: {
        kind: "zone",
        playerSide: "playerOne",
        zoneId: "play",
      },
      draggedCardKind: "hand",
      ownerSide: "playerOne",
      game: createDropActionGame({
        canDropHandCardIntoZone: () => true,
        shouldOpenPlayCardSelectionOnDrop: () => true,
        openPlayCardSelection: () => {
          calls.push("openPlayCardSelection");
          return true;
        },
        playCard: () => {
          calls.push("playCard");
          return true;
        },
      }),
    });

    expect(result).toBe(true);
    expect(calls).toEqual(["openPlayCardSelection"]);
  });

  it("inks a hand card dropped on inkwell when legal", () => {
    const calls: string[] = [];

    const result = dispatchDropIntent({
      cardId: "inkable",
      dropIntent: {
        kind: "zone",
        playerSide: "playerOne",
        zoneId: "inkwell",
      },
      draggedCardKind: "hand",
      ownerSide: "playerOne",
      game: createDropActionGame({
        canDropHandCardIntoZone: () => true,
        ink: () => {
          calls.push("ink");
          return true;
        },
      }),
    });

    expect(result).toBe(true);
    expect(calls).toEqual(["ink"]);
  });

  it("rejects dropping a hand card on play when canDropHandCardIntoZone returns false", () => {
    const calls: string[] = [];

    const result = dispatchDropIntent({
      cardId: "song-without-ink",
      dropIntent: {
        kind: "zone",
        playerSide: "playerOne",
        zoneId: "play",
      },
      draggedCardKind: "hand",
      ownerSide: "playerOne",
      game: createDropActionGame({
        canDropHandCardIntoZone: (_cardId, zoneId) => zoneId !== "play",
        playCard: () => {
          calls.push("playCard");
          return true;
        },
      }),
    });

    expect(result).toBe(false);
    expect(calls).toEqual([]);
  });

  it("treats hand as a no-op cancel target while dragging a hand card", () => {
    const calls: string[] = [];

    const result = dispatchDropIntent({
      cardId: "cancel-me",
      dropIntent: {
        kind: "zone",
        playerSide: "playerOne",
        zoneId: "hand",
      },
      draggedCardKind: "hand",
      ownerSide: "playerOne",
      game: createDropActionGame({
        openPlayCardSelection: () => {
          calls.push("openPlayCardSelection");
          return true;
        },
        playCard: () => {
          calls.push("playCard");
          return true;
        },
        ink: () => {
          calls.push("ink");
          return true;
        },
      }),
    });

    expect(result).toBe(false);
    expect(calls).toEqual([]);
  });
});
