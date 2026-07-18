import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op09DonquixoteDoflamingo031,
  op10Sugar065,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-065 Sugar", () => {
  test("rests one DON!! and itself to find an included Donquixote Pirates trait", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10Sugar065],
      deck: [
        op09DonquixoteDoflamingo031,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: 1,
    });
    const sugarId = engine.findCardInZone("south", "character", op10Sugar065);
    const eligibleId = engine.findCardInZone("south", "deck", op09DonquixoteDoflamingo031);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.activateEffect(sugarId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Sugar's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Sugar's remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.characters.find((card) => card?.instanceId === sugarId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
