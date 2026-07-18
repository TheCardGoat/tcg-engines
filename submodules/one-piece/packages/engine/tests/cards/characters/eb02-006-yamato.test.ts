import { describe, expect, test } from "vite-plus/test";
import { eb02Yamato006, op03PortgasDAce001 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-006 Yamato", () => {
  test("gives rested DON!! and gains Rush with Portgas.D.Ace", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03PortgasDAce001,
        hand: [eb02Yamato006],
        activeDon: 6,
        restedDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(eb02Yamato006, "south");
    const yamatoId = engine.findCardInZone("south", "character", eb02Yamato006);
    engine.activateEffect(yamatoId, "activateMain", "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Yamato's DON!! count choice.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south.leader.attachedDon).toBe(1);
    engine.declareAttack(yamatoId, engine.leader("north"), "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === yamatoId)
        ?.rested,
    ).toBe(true);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not gain Rush when the Leader matches neither printed condition", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [eb02Yamato006], activeDon: 6, restedDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(eb02Yamato006, "south");
    const yamatoId = engine.findCardInZone("south", "character", eb02Yamato006);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: yamatoId,
        trigger: "activateMain",
      }).reason,
    ).toBe("The activation conditions are not met.");

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: yamatoId,
        targetId: engine.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
    expect(engine.getView("south").players.south.restedDon).toBe(7);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
