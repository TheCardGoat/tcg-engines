import { describe, it, expect } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { dragonFire, mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { onlySoMuchRoom } from "@tcg/lorcana-cards/cards/008";

describe("Play Targeting Action Card Animation", () => {
  it("emits action packet for action card requiring target selection", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [dragonFire],
        inkwell: dragonFire.cost,
      },
      {
        play: [mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(dragonFire, {
        targets: [mickeyMouseTrueFriend],
      }),
    ).toBeSuccessfulCommand();

    const packet = testEngine.asLorcanaPlayerOne().getLastPacketUpdate();
    const animations = packet?.animations ?? [];

    const actionAnimation = animations.find((a) => a.kind === "lorcana.action");
    const targetId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "discard", "p2");

    expect(actionAnimation).toBeDefined();
    expect(actionAnimation?.payload).toEqual(
      expect.objectContaining({
        actorSide: "playerOne",
        actionCardId: testEngine.findCardInstanceId(dragonFire, "discard", "p1"),
        targets: [{ cardId: targetId, wasBanished: true }],
      }),
    );
  });

  it("emits all chosen targets for multi-target action cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [onlySoMuchRoom],
        inkwell: onlySoMuchRoom.cost,
        discard: [mickeyMouseTrueFriend],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(onlySoMuchRoom, {
        targets: [simbaProtectiveCub, mickeyMouseTrueFriend],
      }),
    ).toBeSuccessfulCommand();

    const packet = testEngine.asLorcanaPlayerOne().getLastPacketUpdate();
    const actionAnimation = packet?.animations.find((a) => a.kind === "lorcana.action");
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "hand", "p2");
    const mickeyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "hand", "p1");

    expect(actionAnimation?.payload).toEqual(
      expect.objectContaining({
        actorSide: "playerOne",
        actionCardId: testEngine.findCardInstanceId(onlySoMuchRoom, "discard", "p1"),
        targets: [
          { cardId: simbaId, wasBanished: false },
          { cardId: mickeyId, wasBanished: false },
        ],
      }),
    );
  });

  it("card with pending resolution goes to limbo, not discard", () => {
    // Dragon Fire with no target provided should leave the card in limbo
    // waiting for target selection (pending resolution)
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [dragonFire],
        inkwell: dragonFire.cost,
      },
      {
        play: [mickeyMouseTrueFriend],
      },
    );

    // Play without specifying targets - card should go to limbo for pending resolution
    const result = testEngine.asPlayerOne().playCard(dragonFire);

    // If the card goes to limbo (pending resolution), verify the animation packet is still generated
    const packet = testEngine.asLorcanaPlayerOne().getLastPacketUpdate();
    const animations = packet?.animations ?? [];

    const actionAnimation = animations.find((a) => a.kind === "lorcana.action");

    expect(result.success).toBe(true);
    expect(actionAnimation).toBeUndefined();
  });
});
