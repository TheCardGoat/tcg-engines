import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op14eb04INeverBotherToRememberTheFacesOfTrash038,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-038 I Never Bother to Remember the Faces of Trash", () => {
  test("Main rests two chosen own cards, draws one, then rests an eligible opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04INeverBotherToRememberTheFacesOfTrash038],
        character: [eb01Doma005, eb01Fourtricks025],
        activeDon: 1,
      },
      { character: [eb01MountainGod018] },
    );
    const costId = engine.findCardInZone("south", "character", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.playCard(op14eb04INeverBotherToRememberTheFacesOfTrash038);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectCostRestCards",
      { selectedIds: [engine.leader("south"), costId] },
      "south",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(1);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("Counter gives the defending Leader +3000", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op14eb04INeverBotherToRememberTheFacesOfTrash038], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      op14eb04INeverBotherToRememberTheFacesOfTrash038,
    );
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
  });
});
