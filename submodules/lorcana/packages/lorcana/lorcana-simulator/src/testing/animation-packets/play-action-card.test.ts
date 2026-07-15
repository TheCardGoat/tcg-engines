import { describe, it, expect } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  developYourBrain,
  mickeyMouseTrueFriend,
  minnieMouseAlwaysClassy,
} from "@tcg/lorcana-cards/cards/001";

describe("Play Action Card Animation", () => {
  it("emits boardMove and play.action packets for action cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [developYourBrain],
      inkwell: developYourBrain.cost,
      deck: [minnieMouseAlwaysClassy, mickeyMouseTrueFriend],
    });

    const card = testEngine.asServer().getCard(developYourBrain);
    testEngine.asLorcanaPlayerOne().playCard(developYourBrain);
    const packet = testEngine.asLorcanaPlayerOne().getLastPacketUpdate();
    const animations = packet?.animations ?? [];

    const boardMoveAnimation = animations.find((a) => a.kind === "lorcana.boardMove");
    expect(boardMoveAnimation).toBeDefined();
    expect(boardMoveAnimation?.payload).toEqual(
      expect.objectContaining({
        variant: "play-action",
        sourceZoneId: "hand",
        destinationZoneId: "discard",
        impactAt: "via",
        renderFace: "faceUp",
        actorSide: "playerOne",
      }),
    );

    const playActionAnimation = animations.find((a) => a.kind === "play.action");
    expect(playActionAnimation).toBeDefined();
    expect(playActionAnimation?.payload).toEqual(
      expect.objectContaining({
        cardId: card.definitionId,
        player: card.ownerId,
      }),
    );
  });
});
