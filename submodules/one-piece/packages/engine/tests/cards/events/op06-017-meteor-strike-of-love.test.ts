import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Sabo007,
  op06MeteorStrikeOfLove017,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP06-017 Meteor-Strike of Love", () => {
  test("Main confirms and pays top Life before granting turn-scoped power", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06MeteorStrikeOfLove017],
      life: [eb01Doma005],
      character: [eb01MountainGod018],
      activeDon: 2,
    });
    const targetId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const lifeCardId = engine.findCardInZone("south", "life", eb01Doma005);
    const powerBefore = engine.getView("south").players.south.characters[0]?.power ?? 0;

    engine.playCard(op06MeteorStrikeOfLove017);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lifeCardId);
    expect(view.players.south.lifeCount).toBe(0);
    expect(view.players.south.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      powerBefore + 3000,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Counter pays top Life before protecting the chosen combat recipient for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05Sabo007, playedOnTurn: 0 }],
      },
      {
        hand: [op06MeteorStrikeOfLove017],
        life: [eb01Doma005],
        activeDon: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op05Sabo007);
    const eventId = engine.findCardInZone("north", "hand", op06MeteorStrikeOfLove017);
    const lifeCardId = engine.findCardInZone("north", "life", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(lifeCardId);
    expect(view.players.north.lifeCount).toBe(0);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06MeteorStrikeOfLove017],
      life: [eb01Doma005],
      character: [eb01MountainGod018],
      activeDon: 2,
    });
    engine.playCard(op06MeteorStrikeOfLove017, "south");
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
