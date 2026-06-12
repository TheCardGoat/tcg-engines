import { describe, it, expect } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  friendsOnTheOtherSide,
  arielSpectacularSinger,
  mickeyMouseTrueFriend,
} from "@tcg/lorcana-cards/cards/001";

describe("Play Song Action Card Animation", () => {
  it("emits boardMove and play.action packets for song played via ink (playCard)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [friendsOnTheOtherSide],
      inkwell: friendsOnTheOtherSide.cost,
      deck: [mickeyMouseTrueFriend, mickeyMouseTrueFriend],
    });

    const card = testEngine.asServer().getCard(friendsOnTheOtherSide);
    testEngine.asLorcanaPlayerOne().playCard(friendsOnTheOtherSide);
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

  it("emits boardMove with play-action-sing variant for song played via sing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [friendsOnTheOtherSide],
      play: [arielSpectacularSinger],
      deck: [mickeyMouseTrueFriend, mickeyMouseTrueFriend],
    });

    expect(
      testEngine.asPlayerOne().singSong(friendsOnTheOtherSide, arielSpectacularSinger),
    ).toBeSuccessfulCommand();

    const packet = testEngine.asLorcanaPlayerOne().getLastPacketUpdate();
    const animations = packet?.animations ?? [];

    // Sung songs use the "play-action-sing" variant (distinct from ink-played "play-action")
    const boardMoveAnimation = animations.find((a) => a.kind === "lorcana.boardMove");
    expect(boardMoveAnimation).toBeDefined();
    expect(boardMoveAnimation?.payload).toEqual(
      expect.objectContaining({
        variant: "play-action-sing",
        sourceZoneId: "hand",
        destinationZoneId: "discard",
        impactAt: "via",
        renderFace: "faceUp",
      }),
    );
  });
});
