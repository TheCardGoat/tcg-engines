import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op07Franky107 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function resolveFrankyTrigger(startingLife: number) {
  const fillerLife = Array.from({ length: startingLife - 1 }, () => eb01Doma005);
  const engine = OnePieceTestEngine.create(
    { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
    {
      life: [op07Franky107, ...fillerLife],
      deck: [eb01MountainGod018, eb01Doma005],
    },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
  const frankyId = engine.findCardInZone("north", "life", op07Franky107);
  const drawnId = engine.getState().players.north.deck[0]!;

  engine.declareAttack(attackerId, engine.leader("north"), "south");
  engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

  return { engine, frankyId, drawnId };
}

describe("OP07-107 Franky", () => {
  test("Life Trigger draws, then plays the physical card at one remaining Life", () => {
    const { engine, frankyId, drawnId } = resolveFrankyTrigger(2);
    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(frankyId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(frankyId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger still draws but trashes the card with two remaining Life", () => {
    const { engine, frankyId, drawnId } = resolveFrankyTrigger(3);
    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(frankyId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(frankyId);
    expect(view.prompts).toHaveLength(0);
  });
});
