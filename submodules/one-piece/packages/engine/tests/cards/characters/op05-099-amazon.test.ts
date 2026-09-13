import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05Amazon099 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

/**
 * OP05-099 Amazon: [On Your Opponent's Attack] optional rest this Character → opponent
 * chooses trash top Life or −2000 power. Decline opens on opponent attack, not own attack.
 */
describe("OP05-099 Amazon", () => {
  test("rests on the opponent's attack and gives that opponent the Life-or-power choice", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05Amazon099] },
      {
        life: [eb01Doma005],
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const amazonId = engine.findCardInZone("south", "character", op05Amazon099);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const topLifeId = engine.findCardInZone("north", "life", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const choice = engine.pendingDecision("effectActionChoice", "north").steps[0];
    expect(choice?.kind).toBe("chooseOption");
    if (choice?.kind !== "chooseOption") throw new Error("Expected Amazon's opponent choice.");
    expect(choice.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "north");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === amazonId)?.rested,
    ).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(topLifeId);
  });

  test("may decline on opponent's attack so Amazon stays active and Life is untouched", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05Amazon099] },
      {
        life: [eb01Doma005],
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const amazonId = engine.findCardInZone("south", "character", op05Amazon099);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const topLifeId = engine.findCardInZone("north", "life", eb01Doma005);
    const northLifeBefore = engine.getView("north").players.north.lifeCount;
    const attackerPowerBefore = engine
      .getView("north")
      .players.north.characters.find((card) => card?.instanceId === attackerId)?.power;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === amazonId)?.rested,
    ).toBe(false);
    expect(view.players.north.lifeCount).toBe(northLifeBefore);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(topLifeId);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === attackerId)?.power,
    ).toBe(attackerPowerBefore);
  });
});
