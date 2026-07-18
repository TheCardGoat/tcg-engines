import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, st01TonyTonyChopper006 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST01-006 Tony Tony.Chopper", () => {
  test("can block an attack on its Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [st01TonyTonyChopper006] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const chopperId = engine.findCardInZone("south", "character", st01TonyTonyChopper006);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [chopperId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(chopperId);
    expect(view.prompts).toHaveLength(0);
  });
});
