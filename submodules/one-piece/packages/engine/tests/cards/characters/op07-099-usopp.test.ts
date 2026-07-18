import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op07Atlas098,
  op07Usopp099,
  op07Vegapunk097,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-099 Usopp", () => {
  test("Life Trigger boosts only an own Egghead card through the end of its controller's next turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op07Vegapunk097,
        character: [op07Atlas098, eb01Doma005],
        life: [op07Usopp099],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const atlasId = engine.findCardInZone("north", "character", op07Atlas098);
    const nonEggheadId = engine.findCardInZone("north", "character", eb01Doma005);
    const basePower = op07Atlas098.power ?? 0;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Usopp's Egghead target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("north"), atlasId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonEggheadId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [atlasId] }, "north");

    expect(
      engine.getView("north").players.north.characters.find((card) => card?.instanceId === atlasId)
        ?.power,
    ).toBe(basePower + 2000);

    engine.endTurn("south");
    expect(
      engine.getView("north").players.north.characters.find((card) => card?.instanceId === atlasId)
        ?.power,
    ).toBe(basePower + 2000);

    engine.endTurn("north");
    const view = engine.getView("north");
    expect(view.players.north.characters.find((card) => card?.instanceId === atlasId)?.power).toBe(
      basePower,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
