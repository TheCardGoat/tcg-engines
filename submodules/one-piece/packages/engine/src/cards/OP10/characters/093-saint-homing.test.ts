import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10Franky090, op10SaintHoming093 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-093 Saint Homing", () => {
  test("trashes itself to give a black Character +3 cost through the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op10SaintHoming093, op10Franky090],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { deck: [eb01Doma005, eb01Doma005, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const homingId = engine.findCardInZone("south", "character", op10SaintHoming093);
    const targetId = engine.findCardInZone("south", "character", op10Franky090);

    engine.activateEffect(homingId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const cost = () =>
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.cost;
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      homingId,
    );
    expect(cost()).toBe(7);
    engine.endTurn("south");
    expect(cost()).toBe(7);
    engine.endTurn("north");
    expect(cost()).toBe(4);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op10SaintHoming093, op10Franky090],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { deck: [eb01Doma005, eb01Doma005, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const homingId = engine.findCardInZone("south", "character", op10SaintHoming093);
    engine.activateEffect(homingId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
