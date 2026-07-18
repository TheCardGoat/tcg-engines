import { describe, expect, test } from "vite-plus/test";
import { eb02TonyTonyChopper001, eb02TonyTonyChopper003 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-003 Tony Tony.Chopper", () => {
  test("gives a rested DON!! on play, then gains opponent-turn power with two attached DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: eb02TonyTonyChopper001,
        hand: [eb02TonyTonyChopper003],
        activeDon: 6,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(eb02TonyTonyChopper003);
    const chopperId = engine.findCardInZone("south", "character", eb02TonyTonyChopper003);
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") {
      throw new Error("Expected Chopper's rested DON!! count choice.");
    }
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity") {
      throw new Error("Expected Chopper's Leader-or-Character DON!! recipient.");
    }
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      chopperId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    engine.attachDon(chopperId, 2, "south");
    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === chopperId)?.power,
    ).toBe(5000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
