import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op10DonquixoteDoflamingo071,
  op10Sugar065,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-065 Sugar", () => {
  test("rests itself and DON!! to find an included Donquixote Pirates card and bottom-order the rest", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10Sugar065],
      deck: [
        op10DonquixoteDoflamingo071,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: 1,
    });
    const sugarId = engine.findCardInZone("south", "character", op10Sugar065);
    const doflamingoId = engine.findCardInZone("south", "deck", op10DonquixoteDoflamingo071);

    engine.activateEffect(sugarId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Sugar's search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === doflamingoId)?.legal).toBe(
      true,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [doflamingoId] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Sugar's bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === sugarId)?.rested).toBe(
      true,
    );
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(doflamingoId);
    expect(view.prompts).toHaveLength(0);
  });
});
