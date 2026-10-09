import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb02MonkeyDLuffy010,
  eb02MonkeyDLuffy061,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-061 Monkey.D.Luffy", () => {
  test("gains conditional Rush, returns only active DON!!, restands, and takes top Life once", () => {
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

    let view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === luffyId)?.rested).toBe(
      false,
    );
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(topLifeId);
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 6 });
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

  test("cannot substitute rested or attached DON!! when only one active DON!! remains", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb02MonkeyDLuffy061, playedOnTurn: 0 }],
        activeDon: 2,
        restedDon: 6,
        life: 2,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.attachDon(engine.leader("south"), 1, "south");
    const id = engine.findCardInZone("south", "character", eb02MonkeyDLuffy061);
    engine.declareAttack(id, engine.leader("north"), "south");
    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === id)?.rested).toBe(
      true,
    );
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 6, lifeCount: 2 });
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
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

  test("may decline the when-attacking DON!! return without restanding or taking Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: eb02MonkeyDLuffy010,
        hand: [eb02MonkeyDLuffy061],
        life: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01Doma005, eb01Doma005],
        activeDon: 9,
      },
      { activeDon: 5, deck: [eb01Doma005, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const topLifeId = engine.findCardInZone("south", "life", eb01Doma005);
    engine.attachDon(engine.leader("south"), 1, "south");
    engine.playCard(eb02MonkeyDLuffy061, "south");
    const luffyId = engine.findCardInZone("south", "character", eb02MonkeyDLuffy061);
    const beforeAttack = engine.getView("south").players.south;
    const donPoolBefore = beforeAttack.activeDon + beforeAttack.restedDon;
    const donDeckBefore = beforeAttack.donDeckCount;
    const lifeBefore = beforeAttack.lifeCount;

    engine.declareAttack(luffyId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === luffyId)?.rested).toBe(
      true,
    );
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(topLifeId);
    expect(view.players.south.activeDon + view.players.south.restedDon).toBe(donPoolBefore);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
  });
  test("loses new-turn Rush eligibility when the opponent returns their fifth DON", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: eb02MonkeyDLuffy010, hand: [eb02MonkeyDLuffy061], activeDon: 6 },
      { hand: ["ST04-016"], activeDon: 5 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.playCard(eb02MonkeyDLuffy061);
    const luffy = e.findCardInZone("south", "character", eb02MonkeyDLuffy061);
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    const event = e.findCardInZone("north", "hand", "ST04-016");
    e.resolveDecision("battleCounter", { selectedIds: [event] }, "north");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    const pay = e.pendingDecision("effectCostReturnDon", "north").steps[0];
    if (pay?.kind !== "payCost") throw Error("DON cost");
    e.resolveDecision("effectCostReturnDon", { selectedIds: [pay.candidates[0]!.ref.id] }, "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("north")] }, "north");
    expect(
      e.getView("north").players.north.activeDon + e.getView("north").players.north.restedDon,
    ).toBe(4);
    expect(
      e.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: luffy,
        targetId: e.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
  });
});
