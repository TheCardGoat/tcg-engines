import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb02MonkeyDLuffy010,
  eb02MonkeyDLuffy061,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-061 Monkey.D.Luffy", () => {
  test("gains conditional Rush, maps DON!! from two sources, restands, and takes top Life once", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: eb02MonkeyDLuffy010,
        hand: [eb02MonkeyDLuffy061],
        life: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01Doma005, eb01Doma005],
        activeDon: 9,
      },
      {
        activeDon: 5,
        deck: [eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const leaderId = engine.leader("south");
    const topLifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.attachDon(leaderId, 1, "south");
    engine.playCard(eb02MonkeyDLuffy061, "south");
    const luffyId = engine.findCardInZone("south", "character", eb02MonkeyDLuffy061);
    engine.declareAttack(luffyId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Luffy's DON!! return choice.");
    const attachedDonId = `attached-don:${leaderId}:0`;
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining(["active-don:0", attachedDonId]),
    );
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", attachedDonId] },
      "south",
    );

    let view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === luffyId)?.rested).toBe(
      false,
    );
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(topLifeId);
    expect(view.players.south.leader.attachedDon).toBe(0);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 2);
    const opposingLifeMove = engine
      .getView("north")
      .logs.find((entry) => entry.message.includes("from Life to Hand"));
    expect(opposingLifeMove).toMatchObject({
      sourceCardId: null,
      sourceInstanceId: null,
      targetIds: [],
    });
    expect(opposingLifeMove?.message).not.toContain(eb01Doma005.name);

    engine.declareAttack(luffyId, engine.leader("north"), "south");
    view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.decisions.some((decision) => decision.title.includes("Monkey.D.Luffy"))).toBe(
      false,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not gain Rush below the opponent five-DON!! boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: eb02MonkeyDLuffy010,
        hand: [eb02MonkeyDLuffy061],
        deck: [eb01Doma005, eb01Doma005],
        activeDon: 6,
      },
      {
        activeDon: 4,
        deck: [eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(eb02MonkeyDLuffy061, "south");
    const luffyId = engine.findCardInZone("south", "character", eb02MonkeyDLuffy061);
    const failure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: luffyId,
      targetId: engine.leader("north"),
    });
    expect(failure.reason).toBe("The selected attacker cannot attack.");
  });
});
