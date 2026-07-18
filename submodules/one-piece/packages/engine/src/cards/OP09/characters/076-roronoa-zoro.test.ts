import { describe, expect, test } from "vite-plus/test";
import { op09RoronoaZoro076 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-076 Roronoa Zoro", () => {
  test("returns a chosen variable number of field DON!! before adding one active DON!!", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09RoronoaZoro076],
      activeDon: op09RoronoaZoro076.cost + 3,
      donDeckCount: 1,
    });

    engine.playCard(op09RoronoaZoro076, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 6 });
    if (payment?.kind !== "payCost") throw new Error("Expected Zoro's return-DON!! payment.");
    expect(payment.candidates).toHaveLength(6);
    const returnedIds = payment.candidates.slice(0, 2).map((candidate) => candidate.ref.id);
    engine.resolveDecision("effectCostReturnDon", { selectedIds: returnedIds }, "south");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Zoro's add-DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 2, donDeckCount: 2 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning or adding DON!!", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09RoronoaZoro076],
      activeDon: op09RoronoaZoro076.cost + 1,
      donDeckCount: 1,
    });

    engine.playCard(op09RoronoaZoro076, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
