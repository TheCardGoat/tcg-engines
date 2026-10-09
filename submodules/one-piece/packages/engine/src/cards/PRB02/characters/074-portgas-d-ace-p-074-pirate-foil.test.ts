import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02PortgasDAceP074PirateFoil074 } from "../../../../../cards/src/cards/characters/p-074-portgas-d-ace-p-074-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-074 Portgas.D.Ace - P-074 (Pirate Foil)", () => {
  test("places the whole looked group at the top in its selected physical order", () => {
    const engine = OnePieceTestEngine.create({
      character: ["P-074"],
      deck: [
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
      ],
    });
    const source = engine.findCardInZone("south", "character", "P-074");
    const deck = [...engine.getState().players.south.deck];
    engine.asSouth().activateMain(source);
    engine.asSouth().acceptOptional();
    const order = [deck[2]!, deck[4]!, deck[0]!, deck[3]!, deck[1]!];
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: order }, "south");
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "top" }, "south");
    expect(engine.getState().players.south.deck).toEqual([...order, deck[5]!]);
    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(source);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("returns its physical card to hand, then orders the looked cards at the chosen deck end", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02PortgasDAceP074PirateFoil074],
      deck: [
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
      ],
    });
    const aceId = engine.findCardInZone("south", "character", prb02PortgasDAceP074PirateFoil074);
    const lookedIds = engine.getState().players.south.deck.slice(0, 5);
    const submittedOrder = [...lookedIds].reverse();

    engine.activateEffect(aceId, "activateMain", "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected Ace's five-card order.");
    expect(order).toMatchObject({ min: 5, max: 5 });
    expect(order.candidates.map((candidate) => candidate.ref.id)).toEqual(lookedIds);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      aceId,
    );
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: submittedOrder }, "south");
    const position = engine.pendingDecision("effectRearrangeDeckPosition", "south").steps[0];
    if (position?.kind !== "chooseOption") throw new Error("Expected Ace's deck-end choice.");
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "bottom" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(aceId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(aceId);
    expect(engine.getState().players.south.deck.slice(-5)).toEqual(submittedOrder);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning itself or changing the deck", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02PortgasDAceP074PirateFoil074],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
    });
    const aceId = engine.findCardInZone("south", "character", prb02PortgasDAceP074PirateFoil074);
    const deckBefore = [...engine.getState().players.south.deck];

    engine.activateEffect(aceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(aceId);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(aceId);
    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
