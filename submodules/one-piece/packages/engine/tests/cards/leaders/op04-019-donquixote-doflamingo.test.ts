import { describe, expect, test } from "vite-plus/test";
import { op04DonquixoteDoflamingo019 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-019 Donquixote Doflamingo", () => {
  test("lets its controller choose up to 2 rested DON!! to set active at end of turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op04DonquixoteDoflamingo019,
      restedDon: 3,
    });

    engine.endTurn("south");

    const decision = engine.pendingDecision("effectSetActiveDon", "south");
    const step = decision.steps[0];
    expect(decision.actorId).toBe("south");
    expect(step?.kind).toBe("chooseOption");
    if (step?.kind !== "chooseOption") {
      throw new Error("Expected Doflamingo's controller to choose a DON!! count.");
    }
    expect(step.options.map((option) => option.id)).toEqual(["0", "1", "2"]);

    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 1 });
    expect(view.activeSeat).toBe("north");
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("cannot ready attached DON and may decline to ready the sole cost-area DON", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op04DonquixoteDoflamingo019,
      activeDon: 2,
      restedDon: 1,
    });
    engine.attachDon(engine.leader("south"), 2, "south");
    engine.endTurn("south");
    const step = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    if (step?.kind !== "chooseOption") throw new Error("Expected DON count.");
    expect(step.options.map((o) => o.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectSetActiveDon", { optionId: "0" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 0,
      restedDon: 1,
      leader: { attachedDon: 2 },
    });
  });
});
