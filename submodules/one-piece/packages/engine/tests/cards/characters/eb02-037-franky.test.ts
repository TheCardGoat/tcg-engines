import { describe, expect, test } from "vite-plus/test";
import { eb02Franky037, eb02MonkeyDLuffy010 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-037 Franky", () => {
  test("adds rested DON!! on play and when attacking at the shared field-count boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: eb02MonkeyDLuffy010,
        hand: [eb02Franky037],
        character: [{ card: eb02Franky037, playedOnTurn: 0 }],
        activeDon: 3,
        donDeckCount: 2,
      },
      { activeDon: 5 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb02Franky037);

    engine.playCard(eb02Franky037, "south");
    const onPlay = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(onPlay?.kind).toBe("chooseOption");
    if (onPlay?.kind !== "chooseOption") throw new Error("Expected Franky's On Play DON!! choice.");
    expect(onPlay.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    const whenAttacking = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(whenAttacking?.kind).toBe("chooseOption");
    if (whenAttacking?.kind !== "chooseOption") {
      throw new Error("Expected Franky's When Attacking DON!! choice.");
    }
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      restedDon: 5,
      donDeckCount: 0,
    });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test.each(["wrongLeader", "moreDON"])("does not add DON for the %s boundary", (boundary) => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: boundary === "wrongLeader" ? "ST02-001" : eb02MonkeyDLuffy010,
        hand: [eb02Franky037],
        activeDon: 4,
      },
      { activeDon: boundary === "wrongLeader" ? 5 : 3 },
    );
    const before = e.getView("south").players.south.donDeckCount;
    e.playCard(eb02Franky037);
    expect(e.getView("south").players.south.donDeckCount).toBe(before);
    expect(
      e.getView("south").players.south.activeDon + e.getView("south").players.south.restedDon,
    ).toBe(4);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
