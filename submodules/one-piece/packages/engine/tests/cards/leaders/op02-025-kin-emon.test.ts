import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01Urashima092, op02KinEmon025 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-025 Kin'emon", () => {
  test("discounts the next qualifying Wano Character without revealing a hand choice", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02KinEmon025,
      hand: [eb01MountainGod018, op01Urashima092],
      activeDon: 10,
    });
    const mountainGodId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const urashimaId = engine.findCardInZone("south", "hand", op01Urashima092);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    let hand = engine.getView("south").players.south.hand;
    expect(hand.find((card) => card.instanceId === mountainGodId)?.cost).toBe(4);
    expect(hand.find((card) => card.instanceId === urashimaId)?.cost).toBe(6);
    expect(engine.getView("south").prompts).toHaveLength(0);

    engine.playCard(eb01MountainGod018);
    hand = engine.getView("south").players.south.hand;
    expect(hand.find((card) => card.instanceId === urashimaId)?.cost).toBe(7);
    const failure = engine.expectFailure({
      type: "playCard",
      seat: "south",
      instanceId: urashimaId,
    });
    expect(failure.reason).toBe("Not enough active DON!! to pay the cost.");
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 6, restedDon: 4 });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
