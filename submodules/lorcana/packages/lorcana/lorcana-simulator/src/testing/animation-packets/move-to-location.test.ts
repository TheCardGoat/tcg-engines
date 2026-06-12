import { describe, expect, it } from "bun:test";
import { hiddenCoveTranquilHaven } from "@tcg/lorcana-cards/cards/004";
import { transportPod, galacticCouncilChamberCourtroom } from "@tcg/lorcana-cards/cards/006";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";

const travelingCharacter = createMockCharacter({
  id: "animation-moving-character",
  name: "Animation Moving Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Move to Location Animation Packet", () => {
  it("emits a board move animation for the direct move-to-location action", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [travelingCharacter, hiddenCoveTranquilHaven],
        inkwell: hiddenCoveTranquilHaven.moveCost,
      },
      {
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(travelingCharacter, hiddenCoveTranquilHaven),
    ).toBeSuccessfulCommand();

    const characterId = testEngine.findCardInstanceId(travelingCharacter, "play", "p1");
    const packet = testEngine.asLorcanaPlayerOne().getLastPacketUpdate();
    const moveAnimation = packet?.animations.find(
      (animation) =>
        animation.kind === "lorcana.boardMove" &&
        (animation.payload as { variant?: unknown }).variant === "move-to-location",
    );

    expect(moveAnimation).toBeDefined();
    expect(moveAnimation?.payload).toEqual(
      expect.objectContaining({
        actorPlayerId: "player_one",
        actorSide: "playerOne",
        cardId: characterId,
        destinationZoneId: "play",
        impactAt: "destination",
        phase: "cause",
        playback: "serial",
        renderFace: "faceUp",
        sourceZoneId: "play",
        variant: "move-to-location",
      }),
    );
  });

  it("emits a board move animation when an effect moves a character to a location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
        play: [transportPod, galacticCouncilChamberCourtroom, travelingCharacter],
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolvePendingByCard(transportPod)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [travelingCharacter, galacticCouncilChamberCourtroom],
      }),
    ).toBeSuccessfulCommand();

    const characterId = testEngine.findCardInstanceId(travelingCharacter, "play", "p1");
    const packet = testEngine.asLorcanaPlayerOne().getLastPacketUpdate();
    const moveAnimation = packet?.animations.find(
      (animation) =>
        animation.kind === "lorcana.boardMove" &&
        (animation.payload as { variant?: unknown }).variant === "move-to-location",
    );

    expect(moveAnimation).toBeDefined();
    expect(moveAnimation?.payload).toEqual(
      expect.objectContaining({
        actorPlayerId: "player_one",
        actorSide: "playerOne",
        cardId: characterId,
        destinationZoneId: "play",
        impactAt: "destination",
        phase: "consequence",
        playback: "serial",
        renderFace: "faceUp",
        sourceZoneId: "play",
        variant: "move-to-location",
      }),
    );
  });
});
