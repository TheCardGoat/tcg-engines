import { describe, expect, test } from "vite-plus/test";
import { eb01Brook045, eb01Brook046, eb01Doma005 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-045 Brook", () => {
  test("sees an opponent's effective cost 0 and gains Rush for a public attack", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [eb01Brook046, eb01Brook045], activeDon: 6 },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(eb01Brook046);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    engine.playCard(eb01Brook045);

    const brookId = engine.findCardInZone("south", "character", eb01Brook045);
    engine.declareAttack(brookId, engine.leader("north"), "south");

    expect(engine.getView("south").players.north.characters[0]?.cost).toBe(0);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === brookId)
        ?.rested,
    ).toBe(true);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
