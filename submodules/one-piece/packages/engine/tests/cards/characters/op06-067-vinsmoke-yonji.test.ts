import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op06VinsmokeYonji067 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-067 Vinsmoke Yonji", () => {
  test("gains +1000 power only while its DON!! field count is not greater", () => {
    const equal = OnePieceTestEngine.create(
      { character: [op06VinsmokeYonji067], activeDon: 2 },
      { activeDon: 2 },
    );
    const equalId = equal.findCardInZone("south", "character", op06VinsmokeYonji067);
    equal.attachDon(equalId, 1, "south");
    expect(
      equal.getView("south").players.south.characters.find((card) => card?.instanceId === equalId)
        ?.power,
    ).toBe(7000);

    const greater = OnePieceTestEngine.create(
      { character: [op06VinsmokeYonji067], activeDon: 3 },
      { activeDon: 2 },
    );
    const greaterId = greater.findCardInZone("south", "character", op06VinsmokeYonji067);
    expect(
      greater
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === greaterId)?.power,
    ).toBe(5000);
  });

  test("uses Blocker through the public battle decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06VinsmokeYonji067] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const yonjiId = engine.findCardInZone("south", "character", op06VinsmokeYonji067);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Yonji's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(yonjiId);
    engine.resolveDecision("battleBlocker", { selectedIds: [yonjiId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(yonjiId);
    expect(view.prompts).toHaveLength(0);
  });
});
