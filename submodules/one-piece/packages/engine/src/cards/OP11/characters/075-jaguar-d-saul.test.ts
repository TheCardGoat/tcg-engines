import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op09NicoRobin062 } from "@tcg/op-cards";
import { op11JaguarDSaul075 } from "../../../../../cards/src/cards/OP11/characters/075-jaguar-d-saul.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-075 Jaguar.D.Saul", () => {
  test("on play draws two with Nico Robin and at least seven DON!! on the field", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09NicoRobin062,
      hand: [op11JaguarDSaul075],
      deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      activeDon: 7,
    });
    const handBefore = engine.getView("south").players.south.handCount;

    engine.playCard(op11JaguarDSaul075, "south");

    expect(engine.getView("south").players.south.handCount).toBe(handBefore + 1);
  });

  test("Life Trigger activates the On Play draw without playing the physical card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op09NicoRobin062,
        life: [op11JaguarDSaul075],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
        activeDon: 7,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const saulId = engine.findCardInZone("north", "life", op11JaguarDSaul075);
    const handBefore = engine.getView("north").players.north.handCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.handCount).toBe(handBefore + 2);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(saulId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(saulId);
  });
});
