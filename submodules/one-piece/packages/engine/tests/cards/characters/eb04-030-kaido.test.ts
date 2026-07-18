import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op04Queen040, op14eb04Kaido030 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-030 Kaido", () => {
  test("pays DON!! -2, gains Rush with an Animal Kingdom Pirates Leader, and rests a cost-7-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Queen040,
        hand: [op14eb04Kaido030],
        activeDon: 9,
      },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op14eb04Kaido030, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "active-don:1"] },
      "south",
    );
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Kaido's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const kaidoId = engine.findCardInZone("south", "character", op14eb04Kaido030);
    engine.declareAttack(kaidoId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({
      activeDon: 0,
      donDeckCount: donDeckBefore + 2,
    });
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(true);
  });

  test("still pays DON!! -2 and rests a target without the Leader gate, but does not gain Rush", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op14eb04Kaido030], activeDon: 9 },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const kaidoId = engine.findCardInZone("south", "hand", op14eb04Kaido030);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op14eb04Kaido030, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "active-don:1"] },
      "south",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const attack = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: kaidoId,
      targetId: engine.leader("north"),
    });

    const view = engine.getView("south");
    expect(attack.accepted).toBe(false);
    expect(view.players.south).toMatchObject({
      activeDon: 0,
      donDeckCount: donDeckBefore + 2,
    });
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(true);
  });

  test("may decline the DON!! -2 cost without resting a target or gaining Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Queen040,
        hand: [op14eb04Kaido030],
        activeDon: 9,
      },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op14eb04Kaido030, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const kaidoId = engine.findCardInZone("south", "character", op14eb04Kaido030);
    const attack = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: kaidoId,
      targetId: engine.leader("north"),
    });
    const view = engine.getView("south");
    expect(attack.accepted).toBe(false);
    expect(view.players.south).toMatchObject({
      activeDon: 2,
      donDeckCount: donDeckBefore,
    });
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may return a DON!! card instead of being K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04Kaido030, rested: true }],
        activeDon: 1,
      },
      { character: [{ card: op14eb04Kaido030, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const defenderId = engine.findCardInZone("south", "character", op14eb04Kaido030);
    const attackerId = engine.findCardInZone("north", "character", op14eb04Kaido030);
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
