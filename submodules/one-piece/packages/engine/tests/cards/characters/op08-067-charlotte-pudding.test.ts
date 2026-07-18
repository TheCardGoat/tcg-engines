import { describe, expect, test } from "vite-plus/test";
import { op01PageOne112, op02Magellan085, op08CharlottePudding067 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-067 Charlotte Pudding", () => {
  test("during its turn replaces one returned DON!! as rested only once", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02Magellan085],
      character: [op08CharlottePudding067, op01PageOne112],
      activeDon: 8,
      donDeckCount: 2,
    });
    const pageOneId = engine.findCardInZone("south", "character", op01PageOne112);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(pageOneId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Pudding's rested DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 7,
      restedDon: 1,
      donDeckCount: donDeckBefore,
    });

    engine.playCard(op02Magellan085, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({
      activeDon: 1,
      restedDon: 6,
      donDeckCount: donDeckBefore + 1,
    });
    expect(view.prompts).toHaveLength(0);
  });
});
