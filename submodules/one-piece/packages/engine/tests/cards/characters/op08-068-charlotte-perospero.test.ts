import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op08CharlottePerospero068 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-068 Charlotte Perospero", () => {
  test("adds up to 1 rested DON!! when K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op08CharlottePerospero068, rested: true, playedOnTurn: 0 }],
        donDeckCount: 1,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const perosperoId = engine.findCardInZone("south", "character", op08CharlottePerospero068);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, perosperoId, "north");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption")
      throw new Error("Expected Perospero's rested DON!! choice.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(perosperoId);
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("its Life Trigger returns 1 DON!! and plays that physical card", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: [op08CharlottePerospero068],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: 1,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const perosperoId = engine.findCardInZone("south", "life", op08CharlottePerospero068);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === perosperoId)).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(perosperoId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });
});
