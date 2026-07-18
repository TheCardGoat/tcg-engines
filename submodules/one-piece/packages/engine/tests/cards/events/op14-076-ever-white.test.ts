import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op01DonquixoteDoflamingo060,
  op14eb04EverWhite076,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-076 Ever White", () => {
  test("Main rests two DON!! before a Donquixote Pirates Leader adds one rested DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01DonquixoteDoflamingo060,
      hand: [op14eb04EverWhite076],
      activeDon: 3,
      donDeckCount: 5,
    });
    engine.playCard(op14eb04EverWhite076);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 0,
      restedDon: 4,
      donDeckCount: 4,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Counter gives the defending Leader +3000", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op14eb04EverWhite076], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op14eb04EverWhite076);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
  });
});
