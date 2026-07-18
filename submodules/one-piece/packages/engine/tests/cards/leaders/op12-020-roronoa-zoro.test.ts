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
});
