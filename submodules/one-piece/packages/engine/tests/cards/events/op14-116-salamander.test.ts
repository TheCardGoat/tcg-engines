import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op13BoaHancock051,
  op14eb04Salamander116,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-116 Salamander", () => {
  test("Counter grants +2000, then plays an eligible Kuja Pirates Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { hand: [op14eb04Salamander116, op13BoaHancock051], activeDon: 4 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", op14eb04Salamander116);
    const playId = engine.findCardInZone("north", "hand", op13BoaHancock051);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playId] }, "north");
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(
      engine.getView("north").players.north.characters.some((card) => card?.instanceId === playId),
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("Life Trigger draws one without Event payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op14eb04Salamander116], deck: 6 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(engine.getView("north").players.north.hand).toHaveLength(1);
  });
});
