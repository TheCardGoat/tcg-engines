import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, eb01MountainGod018, op07Fuza106 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-106 Fuza", () => {
  test("with DON!! x1 at 1 Life, K.O.s an opposing cost-3-or-less Character when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: 1,
        character: [{ card: op07Fuza106, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const fuzaId = engine.findCardInZone("south", "character", op07Fuza106);
    const eligibleId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.attachDon(fuzaId, 1, "south");

    engine.declareAttack(fuzaId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Fuza's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
  });

  test("does not K.O. when either DON!! x1 or the 1-Life condition is missing", () => {
    for (const fixture of [
      { life: 1, activeDon: 0, attach: false },
      { life: 2, activeDon: 1, attach: true },
    ]) {
      const engine = OnePieceTestEngine.create(
        {
          life: fixture.life,
          character: [{ card: op07Fuza106, playedOnTurn: 0 }],
          activeDon: fixture.activeDon,
        },
        { character: [eb01Fourtricks025] },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const fuzaId = engine.findCardInZone("south", "character", op07Fuza106);
      const targetId = engine.findCardInZone("north", "character", eb01Fourtricks025);
      if (fixture.attach) engine.attachDon(fuzaId, 1, "south");

      engine.declareAttack(fuzaId, engine.leader("north"), "south");

      expect(
        engine.getView("south").players.north.characters.map((card) => card?.instanceId),
      ).toContain(targetId);
      expect(() => engine.pendingDecision("effectTargetSelection", "south")).toThrow();
    }
  });
});
