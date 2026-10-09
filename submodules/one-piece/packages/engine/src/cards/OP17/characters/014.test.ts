import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-014 Whitey Bay", () => {
  test("[On Play] K.O.s a 2000-base-power-or-less opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-014"], activeDon: 3 },
      { character: [{ cardId: "OP17-023", rested: true }], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP17-023");

    engine.playCard("OP17-014");
    const koTarget = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (koTarget?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(engine.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(
      higumaId,
    );
  });

  test.each([true, false])(
    "opponent attack self-trash accepted=%s changes this battle only",
    (accept) => {
      const e = OnePieceTestEngine.create(
        { character: ["OP17-014"], hand: [] },
        {},
        { activeSeat: "north", firstPlayer: "south" },
      );
      const bay = e.findCardInZone("south", "character", "OP17-014");
      const life = e.getView("south").players.south.lifeCount;
      e.asNorth().attack(e.leader("north"), e.leader("south"));
      if (accept) e.asSouth().acceptOptional();
      else e.asSouth().declineOptional();
      const after = e.getView("south").players.south;
      expect(after.lifeCount).toBe(life - (accept ? 0 : 1));
      expect(after.characters.some((c) => c?.instanceId === bay)).toBe(!accept);
      expect(after.trash.some((c) => c.instanceId === bay)).toBe(accept);
      expect(after.leader.power).toBe(5000);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});
