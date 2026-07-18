import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op12JewelryBonney101, op12RoronoaZoro020 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-101 Jewelry Bonney", () => {
  test("rests itself and boosts an included Supernovas Leader through the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12RoronoaZoro020,
      character: [op12JewelryBonney101],
      deck: [eb01Doma005, eb01Doma005, eb01Doma005],
    });
    const bonneyId = engine.findCardInZone("south", "character", op12JewelryBonney101);
    engine.activateEffect(bonneyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.leader.power).toBe(6000);
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(6000);
    engine.endTurn("north");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
  });
});
