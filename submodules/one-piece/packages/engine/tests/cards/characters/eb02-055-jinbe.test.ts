import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb02Jinbe055,
  op14eb04JinbeOp14040040,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-055 Jinbe", () => {
  test("plays its resolving physical card from Life for an included Fish-Man Leader at two Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Doma005],
      },
      {
        leaderCardId: op14eb04JinbeOp14040040,
        life: [eb02Jinbe055, eb01Doma005],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const jinbeId = engine.findCardInZone("north", "life", eb02Jinbe055);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(1);
    expect(view.players.north.characters.some((card) => card?.instanceId === jinbeId)).toBe(true);
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(jinbeId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(jinbeId);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
