import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op07Atlas098, op07Vegapunk097 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function battleAtlas(selfLife: number, opponentLife: number) {
  const engine = OnePieceTestEngine.create(
    {
      character: [{ card: op07Atlas098, rested: true }],
      life: Array.from({ length: selfLife }, () => eb01Doma005),
    },
    {
      character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      life: Array.from({ length: opponentLife }, () => eb01Doma005),
    },
    { firstPlayer: "south", activeSeat: "north" },
  );
  const atlasId = engine.findCardInZone("south", "character", op07Atlas098);
  const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
  engine.declareAttack(attackerId, atlasId, "north");
  return { engine, atlasId };
}

describe("OP07-098 Atlas", () => {
  test("cannot be K.O.'d in battle while its controller has less Life", () => {
    const { engine, atlasId } = battleAtlas(1, 2);
    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(atlasId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(atlasId);
  });

  test("is K.O.'d in battle when the players have equal Life", () => {
    const { engine, atlasId } = battleAtlas(2, 2);
    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(atlasId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(atlasId);
  });

  test("Life Trigger plays the resolving physical card with a Vegapunk Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op07Vegapunk097,
        life: [op07Atlas098],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const atlasId = engine.findCardInZone("north", "life", op07Atlas098);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(atlasId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(atlasId);
    expect(view.prompts).toHaveLength(0);
  });
});
