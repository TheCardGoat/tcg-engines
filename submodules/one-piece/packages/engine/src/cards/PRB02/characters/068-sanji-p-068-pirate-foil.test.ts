import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02SanjiP068PirateFoil068 } from "../../../../../cards/src/cards/characters/p-068-sanji-p-068-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-068 Sanji", () => {
  test("places the whole looked group at the top in its selected physical order", () => {
    const engine = OnePieceTestEngine.create({
      character: ["P-068"],
      deck: [
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
      ],
    });
    const source = engine.findCardInZone("south", "character", "P-068");
    const deck = [...engine.getState().players.south.deck];
    engine.asSouth().activateMain(source);
    engine.asSouth().acceptOptional();
    const order = [deck[2]!, deck[4]!, deck[0]!, deck[3]!, deck[1]!];
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: order }, "south");
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "top" }, "south");
    expect(engine.getState().players.south.deck).toEqual([...order, deck[5]!]);
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(source);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may trash itself to reorder the exact top five at the chosen end of the deck", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02SanjiP068PirateFoil068],
      deck: [
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
      ],
    });
    const sanjiId = engine.findCardInZone("south", "character", prb02SanjiP068PirateFoil068);
    const topFive = engine.getState().players.south.deck.slice(0, 5);

    engine.activateEffect(sanjiId, "activateMain", "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected Sanji's top-five order.");
    expect(order.candidates.map((candidate) => candidate.ref.id)).toEqual(topFive);
    const submittedOrder = [...topFive].reverse();
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: submittedOrder }, "south");
    const position = engine.pendingDecision("effectRearrangeDeckPosition", "south").steps[0];
    if (position?.kind !== "chooseOption") throw new Error("Expected Sanji's deck position.");
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "bottom" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sanjiId);
    expect(engine.getState().players.south.deck.slice(-5)).toEqual(submittedOrder);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing itself or changing deck order", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02SanjiP068PirateFoil068],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
    });
    const sanjiId = engine.findCardInZone("south", "character", prb02SanjiP068PirateFoil068);
    const deckBefore = [...engine.getState().players.south.deck];

    engine.activateEffect(sanjiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(sanjiId);
    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
