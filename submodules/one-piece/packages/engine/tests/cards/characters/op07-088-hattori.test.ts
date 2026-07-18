import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Mr1DazBonez075,
  op07Hattori088,
  op07RobLucci079,
  op07RobLucci093,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-088 Hattori", () => {
  test("on its turn gives an own Rob Lucci Leader or Character +2000 for the turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op07RobLucci079,
      hand: [op07Hattori088],
      character: [op07RobLucci093],
      activeDon: op07Hattori088.cost,
    });
    const lucciId = engine.findCardInZone("south", "character", op07RobLucci093);
    const basePower = op07RobLucci093.power ?? 0;

    engine.playCard(op07Hattori088, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Hattori's Rob Lucci target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), lucciId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lucciId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === lucciId)
        ?.power,
    ).toBe(basePower + 2000);

    engine.endTurn("south");
    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === lucciId)?.power).toBe(
      basePower,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("has no target when its controller has no Rob Lucci card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07Hattori088],
      character: [eb01Doma005],
      activeDon: op07Hattori088.cost,
    });
    const otherId = engine.findCardInZone("south", "character", eb01Doma005);
    const basePower = eb01Doma005.power ?? 0;

    engine.playCard(op07Hattori088, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === otherId)?.power).toBe(
      basePower,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not boost Rob Lucci when played during the opponent's turn", () => {
    const originalTraits = op07Hattori088.traits;
    op07Hattori088.traits = [...(originalTraits ?? []), "Baroque Works"];
    try {
      const engine = OnePieceTestEngine.create(
        {
          leaderCardId: op07RobLucci079,
          hand: [op07Hattori088],
          character: [op05Mr1DazBonez075],
          activeDon: 1,
        },
        { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
        { firstPlayer: "south", activeSeat: "north" },
      );
      const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
      const hattoriId = engine.findCardInZone("south", "hand", op07Hattori088);
      const leaderPower = engine.getView("south").players.south.leader.power;

      engine.declareAttack(attackerId, engine.leader("south"), "north");
      engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
      if (play?.kind !== "selectEntity") throw new Error("Expected Daz Bonez's play choice.");
      expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(hattoriId);
      engine.resolveDecision("effectPlaySelection", { selectedIds: [hattoriId] }, "south");

      const view = engine.getView("south");
      expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(hattoriId);
      expect(view.players.south.leader.power).toBe(leaderPower);
      expect(() => engine.pendingDecision("effectTargetSelection", "south")).toThrow();
    } finally {
      op07Hattori088.traits = originalTraits;
    }
  });
});
