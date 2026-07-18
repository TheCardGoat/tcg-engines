import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03CharlotteLinlin077,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-077 Charlotte Linlin", () => {
  test("pays both attack costs and chooses to add the top deck card at one Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03CharlotteLinlin077,
        hand: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005],
        life: [eb01Fourtricks025],
        activeDon: 4,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const trashId = engine.findCardInZone("south", "hand", eb01Doma005);
    const topDeckId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.attachDon(engine.leader("south"), 2, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostTrashFromHand", "south");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected Charlotte Linlin's controller to choose the hand-trash cost.");
    }
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [trashId] }, "south");

    const lifeDecision = engine.pendingDecision("effectAddToLifeFromDeck", "south");
    const lifeStep = lifeDecision.steps[0];
    expect(lifeStep?.kind).toBe("chooseOption");
    if (lifeStep?.kind !== "chooseOption") {
      throw new Error("Expected Charlotte Linlin's controller to choose a deck-to-Life count.");
    }
    expect(lifeStep.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(2);
    expect(engine.getState().players.south.life[0]).toBe(topDeckId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(trashId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("allows costs to be paid before the post-colon Life condition fails", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03CharlotteLinlin077,
        hand: [eb01Doma005],
        deck: [eb01MountainGod018, eb01Doma005],
        life: [eb01Doma005, eb01Fourtricks025],
        activeDon: 4,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.attachDon(engine.leader("south"), 2, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(2);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.trash).toHaveLength(1);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
