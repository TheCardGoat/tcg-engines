import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01RoronoaZoro001,
  op03Krieg025,
  op03Nami040,
  op03Nojiko048,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-048 Nojiko", () => {
  test("with Nami, returns only an opponent cost-5-or-less Character to its owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Nami040,
        hand: [op03Nojiko048],
        character: [eb01Doma005],
        activeDon: op03Nojiko048.cost,
      },
      { character: [eb01Fourtricks025, eb01MountainGod018, op03Krieg025] },
    );
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const costThreeId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const costFiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const costSixId = engine.findCardInZone("north", "character", op03Krieg025);

    engine.playCard(op03Nojiko048, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Nojiko's return target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([costThreeId, costFiveId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(costSixId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costFiveId] }, "south");

    const northView = engine.getView("north");
    expect(northView.players.north.hand.map((card) => card.instanceId)).toContain(costFiveId);
    expect(northView.players.north.characters.some((card) => card?.instanceId === costFiveId)).toBe(
      false,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("with Nami, may choose no opponent Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Nami040,
        hand: [op03Nojiko048],
        activeDon: op03Nojiko048.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op03Nojiko048, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer a return without Nami as Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01RoronoaZoro001,
        hand: [op03Nojiko048],
        activeDon: op03Nojiko048.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op03Nojiko048, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
