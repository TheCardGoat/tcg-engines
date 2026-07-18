import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op02Sanji026, op06Nekomamushi110 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-026 Sanji", () => {
  test("reactivates DON!! only for the first no-base-effect Character played at the field limit", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02Sanji026,
      hand: [op06Nekomamushi110, eb01Doma005, eb01Fourtricks025],
      activeDon: 10,
      restedDon: 2,
    });

    engine.playCard(op06Nekomamushi110);
    expect(engine.getView("south").prompts).toHaveLength(0);

    engine.playCard(eb01Doma005);
    const donDecision = engine.pendingDecision("effectSetActiveDon", "south");
    const step = donDecision.steps[0];
    expect(step?.kind).toBe("chooseOption");
    if (step?.kind !== "chooseOption") {
      throw new Error("Expected Sanji's controller to choose how many DON!! cards to reactivate.");
    }
    expect(step.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    engine.playCard(eb01Fourtricks025);
    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 4, restedDon: 8 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
