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
});
