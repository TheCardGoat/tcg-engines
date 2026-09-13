import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op13GoAllTheWayToTheTop077,
  op13Higuma013,
  op13SaintJalmac085,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP13-077 Go All the Way to the Top!!", () => {
  test("Main pays three DON!! and K.O.s separate base-4000 and base-3000 Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13GoAllTheWayToTheTop077],
        character: [{ card: eb01Doma005, attachedDon: 1 }],
        activeDon: 4,
      },
      { character: [op13SaintJalmac085, op13Higuma013] },
    );
    const power4kId = engine.findCardInZone("north", "character", op13SaintJalmac085);
    const power3kId = engine.findCardInZone("north", "character", op13Higuma013);

    engine.playCard(op13GoAllTheWayToTheTop077);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [power4kId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [power3kId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([power4kId, power3kId]),
    );
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 4 });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Counter leaves the defending Leader at +3000 for the rest of the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op13GoAllTheWayToTheTop077], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op13GoAllTheWayToTheTop077);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    expect(engine.getView("north").players.north.leader.power).toBe(8000);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13GoAllTheWayToTheTop077],
        character: [{ card: eb01Doma005, attachedDon: 1 }],
        activeDon: 4,
      },
      { character: [op13SaintJalmac085, op13Higuma013] },
    );
    engine.playCard(op13GoAllTheWayToTheTop077, "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
