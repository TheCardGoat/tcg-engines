import { describe, expect, test } from "vite-plus/test";
import { op04Dellinger029 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-029 Dellinger", () => {
  test("sets one rested DON!! active at end of turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op04Dellinger029],
      restedDon: 2,
    });

    engine.endTurn("south");
    const count = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    expect(count).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may set zero DON!! active", () => {
    const engine = OnePieceTestEngine.create({
      character: [op04Dellinger029],
      restedDon: 1,
    });

    engine.endTurn("south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
