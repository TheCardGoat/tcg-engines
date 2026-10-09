import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-101 Kuzan", () => {
  test("pays an opposing cost-three Character face-up into the chosen Life endpoint before opponent discard", () => {
    for (const position of ["top", "bottom"] as const) {
      const engine = OnePieceTestEngine.create(
        { hand: ["OP09-101"], activeDon: 5 },
        { character: ["ST09-007", "OP09-108"], life: ["EB01-025"], hand: ["EB01-005", "EB01-018"] },
      );
      const paid = engine.findCardInZone("north", "character", "ST09-007");
      const tooLarge = engine.findCardInZone("north", "character", "OP09-108");
      const discarded = engine.findCardInZone("north", "hand", "EB01-018");
      engine.asSouth().play("OP09-101");
      // One eligible payment automatically selects the physical Character.
      engine.resolveDecision("effectLifePosition", { optionId: position }, "south");
      expect(
        engine.getView("north").players.north.characters.map((c) => c?.instanceId),
      ).not.toContain(paid);
      expect(engine.getView("north").players.north.characters.map((c) => c?.instanceId)).toContain(
        tooLarge,
      );
      const life = engine.getView("south").players.north.life;
      expect(life[position === "top" ? 0 : life.length - 1]).toMatchObject({
        instanceId: paid,
        cardId: "ST09-007",
      });
      engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discarded] }, "north");
      expect(engine.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(
        discarded,
      );
      expect(engine.getView("north").players.north.hand).toHaveLength(1);
      expect(engine.getView("south").prompts).toHaveLength(0);
    }
  });

  test("cannot charge the discard when no opposing Character can pay the cost", () => {
    for (const character of [[], ["OP09-108"]]) {
      const engine = OnePieceTestEngine.create(
        { hand: ["OP09-101"], activeDon: 5 },
        { character, hand: ["EB01-005", "EB01-018"] },
      );
      engine.asSouth().play("OP09-101");
      expect(engine.getView("north").players.north.hand).toHaveLength(2);
      expect(engine.getView("north").players.north.trash).toHaveLength(0);
      expect(engine.getView("south").prompts).toHaveLength(0);
    }
  });
});
