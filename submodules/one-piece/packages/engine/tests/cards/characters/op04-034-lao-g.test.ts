import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op04LaoG034 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-034 Lao.G", () => {
  test("with 3 active DON!!, K.O.s only an opposing rested cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04LaoG034], activeDon: 3 },
      {
        character: [
          { card: eb01Fourtricks025, rested: true },
          { card: eb01MountainGod018, rested: true },
          eb01Doma005,
        ],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const activeId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.endTurn("south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Lao.G's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose no rested Character to K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04LaoG034], activeDon: 3 },
      { character: [{ card: eb01Fourtricks025, rested: true }] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.endTurn("south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("rested DON!! do not satisfy the 3-active-DON!! condition", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04LaoG034], activeDon: 2, restedDon: 3 },
      { character: [{ card: eb01Fourtricks025, rested: true }] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.activeSeat).toBe("north");
    expect(view.prompts).toHaveLength(0);
  });
});
