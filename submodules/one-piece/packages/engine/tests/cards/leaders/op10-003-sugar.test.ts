import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10Buffalo073, op10DivineDeparture019, op10Sugar003 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-003 Sugar", () => {
  test("readies one DON!! at end of turn with a 6000-power Donquixote Pirates Character", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op10Sugar003,
      character: [op10Buffalo073],
      restedDon: 1,
    });

    engine.endTurn("south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 0 });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("adds one active DON!! after the first Counter Event activated on the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Sugar003,
        hand: [op10DivineDeparture019, op10DivineDeparture019],
        deck: [eb01Doma005],
        activeDon: 1,
        donDeckCount: 2,
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const eventIds = engine
      .getView("south")
      .players.south.hand.filter((card) => card.cardId === op10DivineDeparture019.id)
      .map((card) => card.instanceId);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("battleCounter", { selectedIds: [eventIds[0]!] }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleCounter", { selectedIds: [eventIds[1]!] }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("declining a Counter Event's optional discard still activates Sugar's Event reaction", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP10-003", hand: ["OP04-016", "EB01-005"], donDeckCount: 2 },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kept = e.findCardInZone("south", "hand", "EB01-005");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseCounter("OP04-016");
    e.asSouth().declineOptional();
    e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.donDeckCount).toBe(1);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(kept);
  });
  test("an Event's Life Trigger does not activate Sugar's Event reaction", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP10-003", life: ["OP04-016"], donDeckCount: 2 },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    e.asSouth().chooseTargets(e.leader("north"));
    expect(e.getView("south").players.north.leader.power).toBe(2000);
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.donDeckCount).toBe(2);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
