import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op13PaperArtAfterimage115 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP13-115 Paper Art Afterimage", () => {
  test("Counter gives +3000 for battle, then a separate +1000 target when the opponent has 2 Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        life: 2,
      },
      {
        hand: [op13PaperArtAfterimage115],
        character: [eb01Doma005],
        activeDon: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op13PaperArtAfterimage115);
    const characterId = engine.findCardInZone("north", "character", eb01Doma005);
    const powerBefore = engine
      .getView("north")
      .players.north.characters.find((card) => card?.instanceId === characterId)?.power;
    if (powerBefore == null) throw new Error("Expected the Character power.");
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === characterId)?.power,
    ).toBe(powerBefore + 1000);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws one card without paying the Event cost", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op13PaperArtAfterimage115],
        deck: [
          eb01Doma005,
          eb01MountainGod018,
          eb01Doma005,
          eb01MountainGod018,
          eb01Doma005,
          eb01MountainGod018,
        ],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const drawId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(drawId);
    expect(view.players.north.activeDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
