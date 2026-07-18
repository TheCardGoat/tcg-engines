import { describe, expect, test } from "vite-plus/test";
import { op04Kaido044, op04Queen040, op14eb04King031 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-031 King", () => {
  test("once per turn adds one active and one rested DON!! with the Leader gate and no other King", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op04Queen040,
      character: [op14eb04King031],
      donDeckCount: 2,
    });
    const kingId = engine.findCardInZone("south", "character", op14eb04King031);

    engine.activateEffect(kingId, "activateMain", "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({
      activeDon: 1,
      restedDon: 1,
      donDeckCount: 0,
    });
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: kingId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("cannot activate while another King Character is present", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op04Queen040,
      character: [op14eb04King031, op14eb04King031],
      donDeckCount: 2,
    });
    const kingId = engine.findCardInZone("south", "character", op14eb04King031);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: kingId,
        trigger: "activateMain",
      }).reason,
    ).toBe("The activation conditions are not met.");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 0,
      restedDon: 0,
      donDeckCount: 2,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may return a DON!! card instead of being K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04King031, rested: true }],
        activeDon: 1,
      },
      { character: [{ card: op04Kaido044, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const defenderId = engine.findCardInZone("south", "character", op14eb04King031);
    const attackerId = engine.findCardInZone("north", "character", op04Kaido044);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(attackerId, defenderId, "north");
    engine.resolveDecision("battleKoReplacement", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === defenderId),
    ).toBeDefined();
    expect(view.players.south).toMatchObject({
      activeDon: 0,
      donDeckCount: donDeckBefore + 1,
    });
    expect(view.prompts).toHaveLength(0);
  });
});
