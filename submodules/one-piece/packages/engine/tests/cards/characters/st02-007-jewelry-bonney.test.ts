import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op08JewelryBonneySp007,
  st01MonkeyDLuffy012,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST02-007 Jewelry Bonney", () => {
  test("rests itself and one DON!! to search five for an included Supernovas trait", () => {
    const engine = OnePieceTestEngine.create({
      character: [op08JewelryBonneySp007],
      deck: [st01MonkeyDLuffy012, eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: 1,
    });
    const bonneyId = engine.findCardInZone("south", "character", op08JewelryBonneySp007);
    const eligibleId = engine.findCardInZone("south", "deck", st01MonkeyDLuffy012);
    const ineligibleId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.activateEffect(bonneyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Bonney's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === ineligibleId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Bonney's bottom order.");
    const bottomOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === bonneyId)?.rested,
    ).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(bottomOrder);
    expect(view.prompts).toHaveLength(0);
  });
});
