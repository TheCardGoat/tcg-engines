import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01RadicalBeam029 } from "@tcg/op-cards";
import { op12Jinbe009 } from "../../../../../cards/src/cards/OP12/characters/009-jinbe.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-009 Jinbe", () => {
  test("reveals two Events for Rush and power lasting through the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op12Jinbe009, op01RadicalBeam029, op01RadicalBeam029, op01RadicalBeam029],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: op12Jinbe009.cost,
      },
      { deck: [eb01Doma005, eb01Doma005, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op12Jinbe009, "south");
    const jinbeId = engine.findCardInZone("south", "character", op12Jinbe009);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const reveal = engine.pendingDecision("effectCostRevealFromHand", "south").steps[0];
    if (reveal?.kind !== "payCost") throw new Error("Expected Jinbe's reveal cost.");
    expect(reveal).toMatchObject({ min: 2, max: 2 });
    engine.resolveDecision(
      "effectCostRevealFromHand",
      { selectedIds: reveal.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === jinbeId)
        ?.power,
    ).toBe((op12Jinbe009.power ?? 0) + 1000);
    engine.declareAttack(jinbeId, engine.leader("north"), "south");
    engine.endTurn("south");
    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === jinbeId)
        ?.power,
    ).toBe((op12Jinbe009.power ?? 0) + 1000);
    engine.endTurn("north");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === jinbeId)
        ?.power,
    ).toBe(op12Jinbe009.power);
  });
});
