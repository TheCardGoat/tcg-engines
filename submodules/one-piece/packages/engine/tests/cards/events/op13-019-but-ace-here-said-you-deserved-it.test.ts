import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op12Karasu085,
  op13ButAceHereSaidYouDeservedIt019,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP13-019 But Ace Here Said You Deserved It!!", () => {
  test("Main pays four DON!!, gives -3000, then K.O.s the now-3000-power Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13ButAceHereSaidYouDeservedIt019], activeDon: 5 },
      { character: [op12Karasu085] },
    );
    const targetId = engine.findCardInZone("north", "character", op12Karasu085);

    engine.playCard(op13ButAceHereSaidYouDeservedIt019);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 5 });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Counter gives the defending Leader +3000 for the battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op13ButAceHereSaidYouDeservedIt019], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op13ButAceHereSaidYouDeservedIt019);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
