import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";

import { pongoDearOldDadFixture } from "@/features/simulator-devtools/fixtures/pongo-dear-old-dad.js";
import { LorcanaMultiplayerSimulatorAdapter } from "@/features/simulator-devtools/harness/lorcana-multiplayer-simulator-adapter.js";
import { buildCardSnapshotMap } from "@/features/simulator/model/board-utils.js";

describe("Pongo - Dear Old Dad | inkwell play UI", () => {
  it("reveals the chooser's inkwell card faces through the reveal window while the Puppy play prompt is active", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      pongoDearOldDadFixture.playerOne,
      pongoDearOldDadFixture.playerTwo,
      {
        seed: "simulator-default",
        skipPreGame: true,
        validateSync: false,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    expect(testEngine.asPlayerOne().resolveBag(bagEffect!.id)).toBeSuccessfulCommand();

    const board = testEngine.asPlayerOne().getBoard();
    const pendingEffect = board.pendingEffects[0];
    expect(pendingEffect?.selectionContext).toMatchObject({
      kind: "target-selection",
      allowedZones: ["inkwell"],
      chooserId: PLAYER_ONE,
    });

    const revealWindow = testEngine.asServer().getState().ctx.zones.reveals.active[0];
    expect(revealWindow).toMatchObject({
      cardIDs: board.players[PLAYER_ONE]?.inkwell,
      visibleTo: [PLAYER_ONE],
    });

    const baseSnapshots = buildCardSnapshotMap(board, testEngine.asServer().staticResources);

    const inkwellCards = board.players[PLAYER_ONE]?.inkwell ?? [];
    expect(inkwellCards).toHaveLength(5);
    expect(inkwellCards.every((cardId) => baseSnapshots[String(cardId)]?.isMasked === false)).toBe(
      true,
    );

    const puppyCandidates =
      pendingEffect?.selectionContext?.kind === "target-selection"
        ? pendingEffect.selectionContext.cardCandidateIds
        : [];
    expect(puppyCandidates).toHaveLength(2);
    expect(
      puppyCandidates.every((cardId) => {
        const snapshot = baseSnapshots[cardId];
        return (
          snapshot?.isMasked === false &&
          snapshot.cardType === "character" &&
          snapshot.classifications?.includes("Puppy") === true &&
          snapshot.label !== "Hidden card"
        );
      }),
    ).toBe(true);

    const opponentBoard = testEngine.asPlayerTwo().getBoard();
    expect(
      inkwellCards.every((cardId) => opponentBoard.cards[String(cardId)]?.hidden === true),
    ).toBe(true);

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asServer().getState().ctx.zones.reveals.active).toHaveLength(1);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asServer().getState().ctx.zones.reveals.active).toHaveLength(0);
  });

  it("formats the revealed inkwell Puppy by name in the simulator move log", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      pongoDearOldDadFixture.playerOne,
      pongoDearOldDadFixture.playerTwo,
      {
        seed: "simulator-default",
        skipPreGame: true,
        validateSync: false,
      },
    );
    const adapter = new LorcanaMultiplayerSimulatorAdapter(testEngine);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    expect(testEngine.asPlayerOne().resolveBag(bagEffect!.id)).toBeSuccessfulCommand();

    const pendingEffect = testEngine.asPlayerOne().getPendingEffects()[0];
    const frecklesCandidate =
      pendingEffect?.selectionContext?.kind === "target-selection"
        ? pendingEffect.selectionContext.cardCandidateIds[0]
        : undefined;
    expect(frecklesCandidate).toBeDefined();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [frecklesCandidate!],
      }),
    ).toBeSuccessfulCommand();

    const titles = adapter.getMoveLog(20, "playerOne").map((entry) => entry.title);
    expect(titles.slice(-3)).toEqual([
      "Started resolving FOUND YOU, YOU LITTLE RASCAL from Pongo - Dear Old Dad. More input is required. Looked at their inkwell (5 cards): Freckles - Good Boy, Lucky - Runt of the Litter, Perdita - Playful Mother, Reflection, Dragon Fire.",
      "Resolved FOUND YOU, YOU LITTLE RASCAL from Pongo - Dear Old Dad, targeting Freckles - Good Boy.",
      "JUST SO CUTE! from Freckles - Good Boy cancelled (no-valid-targets).",
    ]);
  });
});
