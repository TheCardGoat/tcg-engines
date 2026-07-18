import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02Enel052,
  op05Enel098,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-052 Enel", () => {
  test("gains Rush from a compound Sky Island Leader, pays its attack cost, and adds top deck to Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op05Enel098,
        hand: [eb02Enel052, eb01Doma005, eb01Fourtricks025],
        life: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
        activeDon: 10,
      },
      { deck: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const topDeckId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(eb02Enel052, "south");
    const enelId = engine.findCardInZone("south", "character", eb02Enel052);
    engine.declareAttack(enelId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Enel's attack hand cost.");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardedId] }, "south");

    const addLife = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
    expect(addLife?.kind).toBe("chooseOption");
    if (addLife?.kind !== "chooseOption") throw new Error("Expected Enel's Life count choice.");
    expect(addLife.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(2);
    expect(engine.getState().players.south.life[0]).toBe(topDeckId);
    expect(view.players.south.characters.find((card) => card?.instanceId === enelId)?.power).toBe(
      12000,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("can pay above one Life and still gains the post-condition power without adding Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb02Enel052, playedOnTurn: 0 }],
        hand: [eb01Doma005, eb01Fourtricks025],
        life: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005],
      },
      { deck: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const enelId = engine.findCardInZone("south", "character", eb02Enel052);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.declareAttack(enelId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(2);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.players.south.characters.find((card) => card?.instanceId === enelId)?.power).toBe(
      12000,
    );
    expect(view.decisions.some((decision) => decision.kind === "chooseOption")).toBe(false);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
