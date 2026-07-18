import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01Funkfreed044,
  eb01MountainGod018,
  op03Jerry084,
  op03Kumadori082,
  op05XDrake055,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

const LOOKED_CARDS = [
  eb01Doma005,
  eb01Fourtricks025,
  eb01Funkfreed044,
  eb01MountainGod018,
  op03Kumadori082,
] as const;

describe("OP05-055 X.Drake", () => {
  test("privately orders the top five cards and may place all of them at the bottom", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05XDrake055],
      deck: [...LOOKED_CARDS, op03Jerry084],
      activeDon: op05XDrake055.cost,
    });
    const untouchedId = engine.findCardInZone("south", "deck", op03Jerry084);

    engine.playCard(op05XDrake055, "south");
    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected X.Drake's deck order.");
    expect(order.candidates).toHaveLength(5);
    const chosenOrder = order.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: chosenOrder }, "south");

    const position = engine.pendingDecision("effectRearrangeDeckPosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    if (position?.kind !== "chooseOption") throw new Error("Expected X.Drake's deck position.");
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...chosenOrder]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may rest to become the target of an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05XDrake055, playedOnTurn: 0 }] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const drakeId = engine.findCardInZone("south", "character", op05XDrake055);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected X.Drake as a Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(drakeId);
    engine.resolveDecision("battleBlocker", { selectedIds: [drakeId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === drakeId)
        ?.rested,
    ).toBe(true);
  });
});
