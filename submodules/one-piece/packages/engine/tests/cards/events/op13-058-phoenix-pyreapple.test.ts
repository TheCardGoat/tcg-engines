import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op13Higuma013, op13PhoenixPyreapple058 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP13-058 Phoenix Pyreapple", () => {
  test("Main pays one DON!! and returns an opposing 3000-power Character to deck bottom", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13PhoenixPyreapple058], activeDon: 2 },
      { character: [op13Higuma013] },
    );
    const targetId = engine.findCardInZone("north", "character", op13Higuma013);

    engine.playCard(op13PhoenixPyreapple058);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getState().players.north.deck.at(-1)).toBe(targetId);
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Counter gives the defending Leader +3000 for the battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op13PhoenixPyreapple058], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op13PhoenixPyreapple058);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
