import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04DonquixoteFamily036,
  op05Baby5034,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const compoundDonquixoteCard: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP05-034-COMPOUND-DONQUIXOTE",
  canonicalId: "TEST-OP05-034-COMPOUND-DONQUIXOTE",
  name: "Compound Donquixote Search Card",
  traits: ["Test Fleet/Donquixote Pirates"],
};

registerCards([compoundDonquixoteCard]);

describe("OP05-034 Baby 5", () => {
  test("pays both costs, finds any included Donquixote card, and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      character: [op05Baby5034],
      deck: [
        compoundDonquixoteCard,
        op04DonquixoteFamily036,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: 1,
    });
    const babyId = engine.findCardInZone("south", "character", op05Baby5034);
    const compoundId = engine.findCardInZone("south", "deck", compoundDonquixoteCard);
    const eventId = engine.findCardInZone("south", "deck", op04DonquixoteFamily036);
    const untouchedId = engine.getState().players.south.deck[5]!;

    engine.activateEffect(babyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Baby 5's search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === compoundId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === eventId)?.legal).toBe(true);
    expect(search.candidates.filter((candidate) => candidate.legal)).toHaveLength(2);
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === babyId)
        ?.rested,
    ).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eventId] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Baby 5's bottom order.");
    const bottomOrder = order.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      eventId,
    );
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...bottomOrder]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may reveal nothing and orders all five looked cards on the bottom", () => {
    const engine = OnePieceTestEngine.create({
      character: [op05Baby5034],
      deck: [compoundDonquixoteCard, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: 1,
    });
    const babyId = engine.findCardInZone("south", "character", op05Baby5034);

    engine.activateEffect(babyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Baby 5's bottom order.");
    const bottomOrder = order.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    expect(engine.getState().players.south.deck).toEqual(bottomOrder);
    expect(engine.getView("south").players.south.hand).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
