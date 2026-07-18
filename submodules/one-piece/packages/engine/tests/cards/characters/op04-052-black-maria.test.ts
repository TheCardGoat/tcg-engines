import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op04BlackMaria052 } from "@tcg/op-cards";

import { getLegalCommands, OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-052 Black Maria", () => {
  test("rests 2 DON!! and itself before drawing", () => {
    const engine = OnePieceTestEngine.create({
      character: [op04BlackMaria052],
      deck: [eb01Doma005, eb01MountainGod018],
      activeDon: 2,
    });
    const blackMariaId = engine.findCardInZone("south", "character", op04BlackMaria052);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.activateEffect(blackMariaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === blackMariaId)?.rested,
    ).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([drawnId]);
    expect(view.players.south.deckCount).toBe(deckBefore - 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without resting DON!! or itself and without drawing", () => {
    const engine = OnePieceTestEngine.create({
      character: [op04BlackMaria052],
      deck: [eb01Doma005, eb01MountainGod018],
      activeDon: 2,
    });
    const blackMariaId = engine.findCardInZone("south", "character", op04BlackMaria052);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.activateEffect(blackMariaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 0 });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === blackMariaId)?.rested,
    ).toBe(false);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("cannot activate without 2 active DON!!", () => {
    const insufficientDon = OnePieceTestEngine.create({
      character: [op04BlackMaria052],
      deck: [eb01Doma005, eb01MountainGod018],
      activeDon: 1,
    });
    const insufficientDonId = insufficientDon.findCardInZone(
      "south",
      "character",
      op04BlackMaria052,
    );
    expect(
      getLegalCommands(insufficientDon.getState(), "south").some(
        (command) => command.type === "activateEffect" && command.sourceId === insufficientDonId,
      ),
    ).toBe(false);
    expect(
      insufficientDon.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: insufficientDonId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
    expect(insufficientDon.getView("south").prompts).toHaveLength(0);
  });

  test("plays the resolving physical card from its Life Trigger", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04BlackMaria052] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const blackMariaId = engine.findCardInZone("north", "life", op04BlackMaria052);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === blackMariaId)).toBe(
      true,
    );
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(blackMariaId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(blackMariaId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline its Life Trigger and take the physical card into hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04BlackMaria052] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const blackMariaId = engine.findCardInZone("north", "life", op04BlackMaria052);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "decline" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(blackMariaId);
    expect(view.players.north.characters.some((card) => card?.instanceId === blackMariaId)).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
