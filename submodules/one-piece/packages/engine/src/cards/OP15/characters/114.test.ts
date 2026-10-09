import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-114 Wyper", () => {
  test.each([true, false])(
    "On Play flips top Life and applies the entire power/KO sequence: pay=%s",
    (pay) => {
      const e = OnePieceTestEngine.create(
        {
          leaderCardId: "OP05-098",
          hand: ["OP15-114"],
          activeDon: 5,
          life: ["ST07-003", "ST07-004"],
        },
        { leaderCardId: "ST01-001", character: ["ST01-006", "ST01-002", "EB01-005"], hand: [] },
      );
      const top = e.findCardInZone("south", "life", "ST07-003");
      const low = ["ST01-006", "ST01-002"].map((id) => e.findCardInZone("north", "character", id));
      const survivor = e.findCardInZone("north", "character", "EB01-005");
      e.asSouth().play("OP15-114");
      e.resolveDecision("effectOptional", { optionId: pay ? "yes" : "no" }, "south");
      const view = e.getView("south");
      expect(view.players.south.lifeCount).toBe(2);
      expect(e.getView("judge").players.south.life[0]?.instanceId).toBe(top);
      expect(view.players.south.life[0]?.hidden).toBe(!pay);
      expect(e.getView("north").players.south.life[0]?.cardId).toBe(pay ? "ST07-003" : null);
      expect(view.players.north.trash.map((c) => c.instanceId)).toEqual(pay ? low : []);
      expect(view.players.north.characters.find((c) => c?.instanceId === survivor)?.power).toBe(
        pay ? 1000 : 3000,
      );
      expect(view.players.south.characters[0]?.power).toBe(6000);
      expect(view.prompts).toHaveLength(0);
      e.endTurn("south");
      expect(
        e.getView("south").players.north.characters.find((c) => c?.instanceId === survivor)?.power,
      ).toBe(3000);
    },
  );

  test.each(["leader", "character"] as const)(
    "gives one rested DON to a Sky Island %s, excludes unrelated cards, and is once per turn",
    (recipient) => {
      let e = OnePieceTestEngine.create(
        {
          leaderCardId: "OP05-098",
          character: ["OP15-114", "ST07-003"],
          activeDon: 1,
          restedDon: 2,
        },
        {},
      );
      const source = e.findCardInZone("south", "character", "OP15-114");
      const target = recipient === "leader" ? e.leader("south") : source;
      e.asSouth().activateMain(source);
      e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
      const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (step.kind !== "selectEntity") throw new Error("Expected Sky Island recipient");
      expect(new Set(step.candidates.map((c) => c.ref.id))).toEqual(
        new Set([e.leader("south"), source]),
      );
      e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
      const before = e.getView("south").players;
      expect(before.south.restedDon).toBe(1);
      expect(before.south.activeDon).toBe(1);
      expect(
        recipient === "leader"
          ? before.south.leader.attachedDon
          : before.south.characters[0]?.attachedDon,
      ).toBe(1);
      const failed = e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: source,
        trigger: "activateMain",
      });
      expect(failed.reason).toBe("This effect has already been used this turn.");
      e = OnePieceTestEngine.fromState(failed.state);
      expect(e.getView("south").players).toEqual(before);
    },
  );
});
