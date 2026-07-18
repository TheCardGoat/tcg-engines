import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op11Nami041 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP11-041 Nami", () => {
  test("draws after Life is removed on her turn only while her hand is at seven or less", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op11Nami041, deck: [eb01Doma005] },
      { life: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("maps the opponent-attack hand cost and keeps the power bonus for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op11Nami041, hand: [eb01Doma005], activeDon: 1 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.endTurn("south");
    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01MountainGod018),
      engine.leader("south"),
      "north",
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south.leader.power).toBe(7000);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      paymentId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
