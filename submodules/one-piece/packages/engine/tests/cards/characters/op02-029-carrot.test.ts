import { describe, expect, test } from "vite-plus/test";
import { op02Carrot029 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-029 Carrot", () => {
  test("at end of its controller's turn, sets up to one rested DON!! active", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op02Carrot029, playedOnTurn: 0 }],
      restedDon: 2,
    });

    engine.endTurn("south");

    const decision = engine.pendingDecision("effectSetActiveDon", "south");
    const choice = decision.steps[0];
    expect(decision.actorId).toBe("south");
    expect(choice?.kind).toBe("chooseOption");
    if (choice?.kind !== "chooseOption") throw new Error("Expected Carrot's DON!! count choice.");
    expect(choice.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(view.activeSeat).toBe("north");
    expect(view.prompts).toHaveLength(0);
  });
});
