import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  bePrepared,
  maleficentSorceress,
  mickeyMouseTrueFriend,
} from "@tcg/lorcana-cards/cards/001";
import { mufasaBetrayedLeader } from "@tcg/lorcana-cards/cards/002";

describe("Play Board Wipe Action Card Animation", () => {
  it("emits banish boardMove packets for characters removed by Be Prepared", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [bePrepared],
        inkwell: bePrepared.cost,
        play: [mickeyMouseTrueFriend, maleficentSorceress],
      },
      {
        play: [mufasaBetrayedLeader],
        deck: 1,
      },
    );

    testEngine.asLorcanaPlayerOne().playCard(bePrepared);
    const packet = testEngine.asLorcanaPlayerOne().getLastPacketUpdate();
    const animations = packet?.animations ?? [];

    const banishAnimations = animations.filter(
      (animation) =>
        animation.kind === "lorcana.boardMove" &&
        (animation.payload as { variant?: string }).variant === "banish",
    );

    expect(banishAnimations).toHaveLength(3);
    expect(banishAnimations.map((animation) => animation.payload)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actorSide: "playerOne",
          destinationZoneId: "discard",
          sourceZoneId: "play",
          variant: "banish",
        }),
        expect.objectContaining({
          actorSide: "playerTwo",
          destinationZoneId: "discard",
          sourceZoneId: "play",
          variant: "banish",
        }),
      ]),
    );
  });
});
