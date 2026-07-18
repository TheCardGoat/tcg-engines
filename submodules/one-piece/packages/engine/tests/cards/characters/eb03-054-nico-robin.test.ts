import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03NicoRobin054,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-054 Nico Robin", () => {
  test("trashes the top Life card before optionally replacing it with the deck top", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03NicoRobin054],
      life: [eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018],
      activeDon: eb03NicoRobin054.cost,
    });
    const trashedLifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const deckTopId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(eb03NicoRobin054, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const addLife = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
    expect(addLife?.kind).toBe("chooseOption");
    if (addLife?.kind !== "chooseOption") throw new Error("Expected Robin's Life choice.");
    expect(addLife.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(trashedLifeId);
    expect(engine.getState().players.south.life).toEqual([deckTopId]);
    expect(view.prompts).toHaveLength(0);
  });

  test("uses its Life Trigger to trash a hand card and play that physical Robin", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [eb03NicoRobin054],
        hand: [eb01Doma005],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", eb03NicoRobin054);
    const paymentId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const trigger = engine.pendingDecision("lifeTrigger", "north");
    expect(trigger).toMatchObject({ actorId: "north", kind: "confirm" });
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const payment = engine.pendingDecision("effectCostTrashFromHand", "north").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected Robin's hand-trash cost.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toContain(paymentId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === triggerId)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.prompts).toHaveLength(0);
  });
});
