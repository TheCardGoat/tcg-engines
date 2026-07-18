import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op13DivineDeparture076 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP13-076 Divine Departure", () => {
  test("Main pays five DON!! before a given-DON!! check and gives -8000", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13DivineDeparture076],
        character: [{ card: eb01Doma005, attachedDon: 1 }],
        activeDon: 5,
      },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const powerBefore = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === targetId)?.power;
    if (powerBefore == null) throw new Error("Expected the opposing Character power.");

    engine.playCard(op13DivineDeparture076);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(powerBefore - 8000);
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 5 });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Counter lets the defender choose a hand trash before choosing the +3000 recipient", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op13DivineDeparture076, eb01Doma005, eb01Doma005] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op13DivineDeparture076);
    const paymentId = engine.findCardInZone("north", "hand", eb01Doma005);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
