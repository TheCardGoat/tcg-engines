import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Shanks120 } from "@tcg/op-cards";
import { op10BasilHawkins109 } from "../../../../../cards/src/cards/characters/op10-109-basil-hawkins.ts";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-109 Basil Hawkins", () => {
  test("on K.O. trashes the opponent's top Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10BasilHawkins109, rested: true }] },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }], life: [eb01Doma005] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hawkinsId = engine.findCardInZone("south", "character", op10BasilHawkins109);
    const lifeId = engine.findCardInZone("north", "life", eb01Doma005);
    engine.declareAttack(
      engine.findCardInZone("north", "character", op01Shanks120),
      hawkinsId,
      "north",
    );
    engine.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      lifeId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
    expect(engine.getView("south").players.south.lifeCount).toBeGreaterThanOrEqual(0);
  });
  test("Life Trigger draws two before the owner selects one hand card to trash", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
      { life: ["OP10-109"], deck: ["EB01-005", "EB01-025", "EB01-018"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const chosen = e.findCardInZone("north", "deck", "EB01-025");
    e.asSouth().attack(e.findCardInZone("south", "character", "EB01-018"), e.leader("north"));
    e.asNorth().activateLifeTrigger();
    expect(e.getView("north").players.north.hand).toHaveLength(2);
    e.asNorth().trashFromHand(chosen);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(chosen);
    expect(e.getView("north").players.north.hand).toHaveLength(1);
    expect(e.getView("north").players.north.deckCount).toBe(1);
  });
});
