import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01Kaido061 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-061 Kaido", () => {
  test("adds one active DON!! after its DON-attached controller K.O.s an opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01Kaido061,
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.declareAttack(attackerId, targetId, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore - 1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
