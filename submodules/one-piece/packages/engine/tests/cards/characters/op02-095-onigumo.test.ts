import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op02Kuzan096,
  op02Minokoala086,
  op02Onigumo095,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-095 Onigumo", () => {
  test("gains Banish while any Character has cost 0", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op02Kuzan096, playedOnTurn: 0 },
          { card: op02Onigumo095, playedOnTurn: 0 },
        ],
      },
      {
        character: [op02Minokoala086],
        life: [eb01Doma005, eb01Fourtricks025],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kuzanId = engine.findCardInZone("south", "character", op02Kuzan096);
    const onigumoId = engine.findCardInZone("south", "character", op02Onigumo095);
    const costTargetId = engine.findCardInZone("north", "character", op02Minokoala086);

    engine.declareAttack(kuzanId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costTargetId] }, "south");
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");
    expect(engine.getView("south").players.north.hand).toHaveLength(1);
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === costTargetId)?.cost,
    ).toBe(0);

    engine.declareAttack(onigumoId, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const view = engine.getView("south");
    expect(view.players.north.lifeCount).toBe(0);
    expect(view.players.north.hand).toHaveLength(1);
    expect(view.players.north.trash).toHaveLength(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("deals ordinary Life damage when no Character has cost 0", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Onigumo095, playedOnTurn: 0 }] },
      { life: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const onigumoId = engine.findCardInZone("south", "character", op02Onigumo095);

    engine.declareAttack(onigumoId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.hand).toHaveLength(1);
    expect(view.players.north.trash).toHaveLength(0);
  });
});
