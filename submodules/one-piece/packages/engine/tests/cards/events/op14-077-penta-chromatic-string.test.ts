import { describe, expect, test } from "vite-plus/test";
import { op14eb04PentaChromaticString077, op14eb04ScaledNeptunian011 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-077 Penta-Chromatic String", () => {
  test("Counter grants +4000, then adds rested DON!! when the opponent has a 6000-power Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op14eb04ScaledNeptunian011, playedOnTurn: 0 }] },
      { hand: [op14eb04PentaChromaticString077], activeDon: 2, donDeckCount: 5 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op14eb04ScaledNeptunian011);
    const eventId = engine.findCardInZone("north", "hand", op14eb04PentaChromaticString077);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");
    expect(engine.getView("north").players.north).toMatchObject({
      lifeCount: lifeBefore,
      restedDon: 3,
      donDeckCount: 4,
    });
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
