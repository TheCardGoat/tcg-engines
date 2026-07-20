import { describe, expect, test } from "vite-plus/test";
import { op13TonyTonyChopper030 } from "../../../../../cards/src/cards/OP13/characters/030-tony-tony-chopper.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-030 Tony Tony.Chopper", () => {
  test("on play lets its controller set zero, one, or two rested DON!! active", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13TonyTonyChopper030],
      activeDon: op13TonyTonyChopper030.cost,
      restedDon: 3,
    });

    engine.playCard(op13TonyTonyChopper030, "south");
    const decision = engine.pendingDecision("effectSetActiveDon", "south");
    expect(decision.actorId).toBe("south");
    expect(decision.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }, { id: "2" }],
    });
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 6 });
    expect(view.prompts).toHaveLength(0);
  });
});
