import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op12RoronoaZoro020 } from "@tcg/op-cards";

import { getLegalCommands, OnePieceTestEngine } from "../../../src/index.ts";

describe("OP12-020 Roronoa Zoro", () => {
  test("reactivates after battling a Character and excludes only low-cost Character targets", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op12RoronoaZoro020, activeDon: 3 },
      {
        character: [
          { card: eb01Doma005, rested: true, playedOnTurn: 0 },
          { card: eb01Doma005, rested: true, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targets = engine
      .getState()
      .players.north.characterArea.filter((id): id is string => Boolean(id));

    engine.attachDon(engine.leader("south"), 3, "south");
    engine.declareAttack(engine.leader("south"), targets[0]!, "south");
    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    const attack = getLegalCommands(engine.getState(), "south").find(
      (command) => command.type === "declareAttack" && command.sourceId === engine.leader("south"),
    );
    expect(attack?.type).toBe("declareAttack");
    if (attack?.type !== "declareAttack") throw new Error("Expected Zoro to be active again.");
    expect(attack.targetIds).toContain(engine.leader("north"));
    expect(attack.targetIds).not.toContain(targets[1]);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("can attach the third DON after the Character battle, but cannot use the effect twice", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op12RoronoaZoro020, activeDon: 3 },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.attachDon(engine.leader("south"), 2, "south");
    engine.declareAttack(
      engine.leader("south"),
      engine.findCardInZone("north", "character", eb01Doma005),
      "south",
    );
    expect(() => engine.activateEffect(engine.leader("south"), "activateMain", "south")).toThrow();
    engine.attachDon(engine.leader("south"), 1, "south");
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    expect(engine.getView("south").players.south.leader.rested).toBe(false);
    expect(() => engine.activateEffect(engine.leader("south"), "activateMain", "south")).toThrow();
  });
  test("counts the Character Blocker actually battled instead of the initially attacked Leader", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op12RoronoaZoro020, activeDon: 3 },
      { character: ["ST02-004"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.attachDon(engine.leader("south"), 3, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision(
      "battleBlocker",
      { selectedIds: [engine.findCardInZone("north", "character", "ST02-004")] },
      "north",
    );
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    expect(engine.getView("south").players.south.leader.rested).toBe(false);
  });

  test("does not count an attacked Character when Rosinante Leader blocks the battle", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op12RoronoaZoro020, activeDon: 3 },
      { leaderCardId: "OP05-022", character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.attachDon(engine.leader("south"), 3, "south");
    engine.declareAttack(
      engine.leader("south"),
      engine.findCardInZone("north", "character", eb01Doma005),
      "south",
    );
    engine.resolveDecision("battleBlocker", { selectedIds: [engine.leader("north")] }, "north");
    expect(() => engine.activateEffect(engine.leader("south"), "activateMain", "south")).toThrow();
    expect(engine.getView("south").players.south.leader.rested).toBe(true);
  });
});
