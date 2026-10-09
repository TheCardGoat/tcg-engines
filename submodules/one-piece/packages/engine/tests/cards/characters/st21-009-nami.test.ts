import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST21-009 Nami", () => {
  test.each(["leader", "character"])(
    "gives two rested DON to one Straw Hat %s only",
    (recipient) => {
      const e = OnePieceTestEngine.create({
        leaderCardId: "ST21-001",
        character: ["ST21-009", "ST21-005", "ST12-004"],
        restedDon: 2,
      });
      const source = e.findCardInZone("south", "character", "ST21-009"),
        target =
          recipient === "leader"
            ? e.leader("south")
            : e.findCardInZone("south", "character", "ST21-005");
      e.activateEffect(source, "activateMain");
      e.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");
      const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("DON");
      expect(p.candidates.map((c) => c.ref.id)).not.toContain(
        e.findCardInZone("south", "character", "ST12-004"),
      );
      e.asSouth().chooseTargets(target);
      expect(
        recipient === "leader"
          ? e.getView("south").players.south.leader.attachedDon
          : e.getView("south").players.south.characters[1]?.attachedDon,
      ).toBe(2);
      expect(e.getView("south").players.south.restedDon).toBe(0);
      expect(
        e.expectFailure({
          type: "activateEffect",
          seat: "south",
          sourceInstanceId: source,
          trigger: "activateMain",
        }).reason,
      ).toBe("This effect has already been used this turn.");
    },
  );
  test("declines optional grant and retains rested DON", () => {
    const e = OnePieceTestEngine.create({ character: ["ST21-009"], restedDon: 2 });
    e.activateEffect(e.findCardInZone("south", "character", "ST21-009"), "activateMain");
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(2);
    expect(e.getView("south").players.south.characters[0]?.attachedDon).toBe(0);
  });
});
