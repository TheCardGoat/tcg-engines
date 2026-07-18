import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op12Mizerka092,
  op12Sakazuki044,
  op13IKnowYouReStrongSoILlGoAllOutFromTheVeryStart040,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP13-040 I Know You're Strong...", () => {
  test("Main pays two DON!! and freezes two rested cost-7 Characters through Refresh", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13IKnowYouReStrongSoILlGoAllOutFromTheVeryStart040], activeDon: 3 },
      {
        character: [
          { card: op12Mizerka092, rested: true },
          { card: op12Sakazuki044, rested: true },
        ],
      },
    );
    const cost6Id = engine.findCardInZone("north", "character", op12Mizerka092);
    const cost7Id = engine.findCardInZone("north", "character", op12Sakazuki044);

    engine.playCard(op13IKnowYouReStrongSoILlGoAllOutFromTheVeryStart040);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [cost6Id, cost7Id] }, "south");
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 3 });
    engine.endTurn("south");

    const characters = engine.getView("south").players.north.characters;
    expect(characters.find((card) => card?.instanceId === cost6Id)?.rested).toBe(true);
    expect(characters.find((card) => card?.instanceId === cost7Id)?.rested).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Counter gives the defending Leader +3000 for the battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op13IKnowYouReStrongSoILlGoAllOutFromTheVeryStart040], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      op13IKnowYouReStrongSoILlGoAllOutFromTheVeryStart040,
    );
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
