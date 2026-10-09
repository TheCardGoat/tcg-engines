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
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("FAQ: Rush remains after the opponent's only cost-zero Character is K.O.'d", () => {
    const e = OnePieceTestEngine.create(
      { character: ["EB01-046"], hand: ["EB01-045", "EB01-049"], activeDon: 8 },
      { character: ["EB01-005"] },
    );
    const target = e.findCardInZone("north", "character", "EB01-005");
    e.asSouth().attack("EB01-046", e.leader("north"));
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    e.playCard("EB01-045");
    // A separate real On Play removes the qualifying Character after Rush was granted.
    e.playCard("EB01-049");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.north.characters.filter(Boolean)).toHaveLength(0);
    e.asSouth().attack("EB01-045", e.leader("north"));
    expect(
      e.getView("south").players.south.characters.find((c) => c?.cardId === "EB01-045")?.rested,
    ).toBe(true);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
