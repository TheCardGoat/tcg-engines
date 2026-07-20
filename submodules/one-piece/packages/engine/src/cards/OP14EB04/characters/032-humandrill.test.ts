import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Humandrill032 } from "../../../../../cards/src/cards/OP14EB04/characters/032-humandrill.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-032 Humandrill", () => {
  test("only its own rest on its turn offers one cost-4-or-less opposing Character to rest", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op14eb04Humandrill032, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { character: [eb01Doma005, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const humandrillId = engine.findCardInZone("south", "character", op14eb04Humandrill032);
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(allyId, engine.leader("north"), "south");
    expect(() => engine.pendingDecision("effectTargetSelection", "south")).toThrow();

    engine.declareAttack(humandrillId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Humandrill's rest target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
