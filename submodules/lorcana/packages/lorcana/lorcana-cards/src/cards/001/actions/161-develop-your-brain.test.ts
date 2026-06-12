import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli, tinkerBellPeterPansAlly } from "../characters";
import { healingGlow } from "./028-healing-glow";
import { developYourBrain } from "./161-develop-your-brain";

describe("Develop Your Brain", () => {
  it("creates a pending scry selection that reveals the looked-at cards before the player chooses destinations", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [developYourBrain],
      inkwell: developYourBrain.cost,
      deck: [aladdinPrinceAli, tinkerBellPeterPansAlly, healingGlow],
    });

    const playResult = testEngine.asPlayerOne().playCard(developYourBrain);
    expect(playResult).toBeSuccessfulCommand();

    const projectedPendingEffect = testEngine.asPlayerOne().getPendingEffects()[0];

    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(testEngine.asPlayerOne().getPendingChoice()).toEqual(
      expect.objectContaining({
        type: "action-effect",
        playerID: PLAYER_ONE,
      }),
    );
    expect(projectedPendingEffect).toEqual(
      expect.objectContaining({
        type: "scry-selection",
        payload: expect.objectContaining({
          resolutionInput: expect.objectContaining({
            eventSnapshot: expect.objectContaining({
              revealedCardIds: expect.any(Array),
            }),
          }),
        }),
      }),
    );
    // Scry log entries are now part of the MoveLog system
    // The scry details are emitted during effect resolution

    const pendingEffect = testEngine.asServer().getState().G.pendingEffects[0];
    expect(pendingEffect).toEqual(
      expect.objectContaining({
        kind: "scry-selection",
        chooserId: PLAYER_ONE,
        controllerId: PLAYER_ONE,
      }),
    );

    const revealedCardIds = pendingEffect?.resolutionInput.eventSnapshot?.revealedCardIds as
      | CardInstanceId[]
      | undefined;
    expect(revealedCardIds).toHaveLength(2);

    const [firstRevealedId, secondRevealedId] = revealedCardIds!;
    expect(testEngine.getCardDefinitionId(firstRevealedId)).toEqual(tinkerBellPeterPansAlly.id);
    expect(testEngine.getCardDefinitionId(secondRevealedId)).toEqual(healingGlow.id);

    expect(
      testEngine.asPlayerOne().resolvePendingEffect(developYourBrain, {
        destinations: [
          {
            zone: "hand",
            cards: [secondRevealedId],
          },
          {
            zone: "deck-bottom",
            cards: [firstRevealedId],
          },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerOne().getCardZone(healingGlow)).toEqual("hand");
    const lastDeckCardId = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE).at(-1);

    expect(lastDeckCardId).toBeDefined();
    expect(testEngine.getCardDefinitionId(lastDeckCardId!)).toEqual(aladdinPrinceAli.id);

    const resolveScryLogEntry = [...testEngine.getServerEngine().getRuntime().getMoveLogHistory()]
      .reverse()
      .find((log) => log.moveType === "resolveEffect");

    expect(resolveScryLogEntry).toBeDefined();
    expect(resolveScryLogEntry).toMatchObject({
      moveType: "resolveEffect",
      public: expect.arrayContaining([
        expect.objectContaining({
          key: "lorcana.effect.resolve.scrySelection",
        }),
      ]),
      privateByPlayerId: {
        [PLAYER_ONE]: expect.arrayContaining([
          expect.objectContaining({
            key: "lorcana.private.effect.resolve.scrySelection.detail",
            values: expect.objectContaining({
              destinations: expect.arrayContaining([
                expect.objectContaining({ zone: "hand", cardIds: [secondRevealedId] }),
                expect.objectContaining({ zone: "deck-bottom", cardIds: [firstRevealedId] }),
              ]),
            }),
          }),
        ]),
      },
    });
  });

  it("projects enriched scry destination metadata for the pending selection", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [developYourBrain],
      inkwell: developYourBrain.cost,
      deck: [aladdinPrinceAli, tinkerBellPeterPansAlly],
    });

    expect(testEngine.asPlayerOne().playCard(developYourBrain)).toBeSuccessfulCommand();

    const pendingEffect = testEngine.asServer().getState().G.pendingEffects[0];
    expect(pendingEffect?.selectionContext).toMatchObject({
      kind: "scry-selection",
      destinationRules: [
        {
          zone: "hand",
          min: 1,
          max: 1,
          filters: [],
          playFilters: [],
        },
        {
          zone: "deck-bottom",
          remainder: true,
          filters: [],
          playFilters: [],
        },
      ],
    });
  });
});
