import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op15Alvida003,
  op15Arlong023,
  op15Morgan017,
  op15Buggy012,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../src/index.ts";

describe("OP15 DON!! ownership", () => {
  test.each([op15Alvida003, op15Morgan017, op15Arlong023])(
    "$id pays opponent DON!! then gives own DON!!",
    (card) => {
      const engine = OnePieceTestEngine.create(
        { character: [card], restedDon: 1 },
        { character: [eb01Doma005], restedDon: 1 },
      );
      engine.activateEffect(engine.findCardInZone("south", "character", card), "activateMain");
      engine.resolveDecision("effectOptional", { optionId: "yes" });
      engine.resolveDecision("effectGiveDonCount", { optionId: "1" });
      engine.resolveDecision("effectTargetSelection", { selectedIds: [engine.leader("south")] });
      const view = engine.getView("south");
      expect(view.players.south.restedDon).toBe(0);
      expect(view.players.south.leader.attachedDon).toBe(1);
      expect(view.players.north.restedDon).toBe(0);
      expect(view.players.north.characters[0]?.attachedDon).toBe(1);
      expect(view.prompts).toHaveLength(0);
    },
  );

  test("Buggy may give the attacking player's own DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Buggy012], restedDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.declareAttack(
      engine.findCardInZone("south", "character", op15Buggy012),
      engine.leader("north"),
    );
    engine.acceptLeadingOptional("south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" });
    engine.resolveDecision("effectTargetSelection", { selectedIds: [engine.leader("south")] });
    expect(engine.getView("south").players.south.leader.attachedDon).toBe(1);
    expect(engine.getView("south").players.south.restedDon).toBe(0);
  });

  test.each(["0", "1"])(
    "Arlong's controller chooses %s active DON!! from a mixed cost area",
    (optionId) => {
      const engine = OnePieceTestEngine.create(
        { character: [op15Arlong023], activeDon: 1, restedDon: 1 },
        { character: [eb01Doma005], restedDon: 1 },
      );
      engine.activateEffect(
        engine.findCardInZone("south", "character", op15Arlong023),
        "activateMain",
      );
      engine.resolveDecision("effectOptional", { optionId: "yes" });
      engine.resolveDecision("effectGiveDonCount", { optionId: "1" });
      engine.resolveDecision("effectTargetSelection", { selectedIds: [engine.leader("south")] });
      engine.pendingDecision("effectGiveDonSource", "south");
      engine.resolveDecision("effectGiveDonSource", { optionId });
      const view = engine.getView("south");
      expect(view.players.south.activeDon).toBe(optionId === "1" ? 0 : 1);
      expect(view.players.south.restedDon).toBe(optionId === "0" ? 0 : 1);
      expect(view.players.south.leader.attachedDon).toBe(1);
      expect(view.players.north.restedDon).toBe(0);
      expect(view.prompts).toHaveLength(0);
    },
  );
});
