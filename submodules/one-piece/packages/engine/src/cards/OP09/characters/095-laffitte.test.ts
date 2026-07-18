import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { op09Laffitte095 } from "../../../../../cards/src/cards/OP09/characters/095-laffitte.ts";
import { op09Peachbeard094 } from "../../../../../cards/src/cards/OP09/characters/094-peachbeard.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-095 Laffitte", () => {
  test("rests one DON!! and itself, finds an included Blackbeard Pirates trait, and orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      character: [op09Laffitte095],
      deck: [
        op09Peachbeard094,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: 1,
    });
    const laffitteId = engine.findCardInZone("south", "character", op09Laffitte095);
    const eligibleId = engine.findCardInZone("south", "deck", op09Peachbeard094);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.activateEffect(laffitteId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Laffitte's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Laffitte's remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.restedDon).toBe(1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === laffitteId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
