import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Yosaku035 } from "../../../../../cards/src/cards/OP14EB04/characters/035-yosaku.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-035 Yosaku", () => {
  test("only its own rest on its turn freezes one rested cost-4-or-less opponent through the next Refresh", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op14eb04Yosaku035, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      {
        character: [
          { card: eb01Doma005, rested: true, playedOnTurn: 0 },
          { card: eb01MountainGod018, rested: true, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const yosakuId = engine.findCardInZone("south", "character", op14eb04Yosaku035);
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(allyId, engine.leader("north"), "south");
    expect(() => engine.pendingDecision("effectTargetSelection", "south")).toThrow();

    engine.declareAttack(yosakuId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Yosaku's freeze target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    engine.endTurn("south");
    const view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === expensiveId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
