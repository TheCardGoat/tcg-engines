import { describe, expect, test } from "vite-plus/test";
import { eb01Sanji014, eb02MonkeyDLuffy010 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-010 Monkey.D.Luffy", () => {
  test("returns chosen DON, reactivates up to two, and keeps +1000 through the opponent turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb02MonkeyDLuffy010,
      character: [eb01Sanji014],
      activeDon: 1,
      restedDon: 3,
    });
    const leaderId = engine.leader("south");

    engine.activateEffect(leaderId, "activateMain", "south");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "rested-don:0"] },
      "south",
    );
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    let view = engine.getView("south").players.south;
    expect(view).toMatchObject({ activeDon: 2, restedDon: 0 });
    expect(view.leader.power).toBe(6000);
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(6000);
    engine.endTurn("north");
    view = engine.getView("south").players.south;
    expect(view.leader.power).toBe(5000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
