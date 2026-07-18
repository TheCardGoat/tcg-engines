import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01TonyTonyChopper006,
  op03Krieg025,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-025 Krieg", () => {
  test("may trash a hand card to K.O. up to two rested cost-4-or-less Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03Krieg025, eb01Doma005, eb01Fourtricks025],
        activeDon: op03Krieg025.cost,
      },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Fourtricks025, rested: true },
          { card: eb01MountainGod018, rested: true },
          eb01TonyTonyChopper006,
        ],
      },
    );
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const otherHandId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const lowCostOneId = engine.findCardInZone("north", "character", eb01Doma005);
    const lowCostThreeId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const activeLowCostId = engine.findCardInZone("north", "character", eb01TonyTonyChopper006);

    engine.playCard(op03Krieg025, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Krieg's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([discardId, otherHandId]),
    );
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Krieg's K.O. targets.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([lowCostOneId, lowCostThreeId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeLowCostId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [lowCostOneId, lowCostThreeId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([lowCostOneId, lowCostThreeId]),
    );
    expect(view.players.north.characters.some((card) => card?.instanceId === highCostId)).toBe(
      true,
    );
    expect(view.players.north.characters.some((card) => card?.instanceId === activeLowCostId)).toBe(
      true,
    );
  });

  test("with DON!! attached, deals 2 Life damage through Double Attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op03Krieg025, playedOnTurn: 0, attachedDon: 1 }] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kriegId = engine.findCardInZone("south", "character", op03Krieg025);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.declareAttack(kriegId, engine.leader("north"), "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 2);
  });

  test("may decline without discarding or K.O.'ing a rested Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03Krieg025, eb01Doma005],
        activeDon: op03Krieg025.cost,
      },
      { character: [{ card: eb01Fourtricks025, rested: true }] },
    );
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op03Krieg025, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("deals only 1 Life damage without DON!! attached", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op03Krieg025, playedOnTurn: 0 }] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kriegId = engine.findCardInZone("south", "character", op03Krieg025);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.declareAttack(kriegId, engine.leader("north"), "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
  });
});
