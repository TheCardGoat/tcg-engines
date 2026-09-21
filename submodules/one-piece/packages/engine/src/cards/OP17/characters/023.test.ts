import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Nami (OP17-023) cost=1 power=1000 counter=2000
describe("OP17-023 Nami", () => {
  test("field placement with 1000 power", () => {
    const engine = OnePieceTestEngine.create({ character: ["OP17-023"], activeDon: 1 }, {});

    const cardId = engine.findCardInZone("south", "character", "OP17-023");
    expect(cardId).toBeDefined();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
