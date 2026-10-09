import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST21-001 Monkey.D.Luffy", () => {
  test.each([1, 2])("gives %s rested DON to one Character and spends once-per-turn", (amount) => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST21-001",
      character: ["ST21-005", "ST21-006"],
      activeDon: 1,
      restedDon: 2,
    });
    e.attachDon(e.leader("south"), 1);
    e.activateEffect(e.leader("south"), "activateMain");
    e.resolveDecision("effectGiveDonCount", { optionId: String(amount) }, "south");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("DON target");
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(e.leader("south"));
    e.asSouth().chooseTargets(e.findCardInZone("south", "character", "ST21-005"));
    expect(e.getView("south").players.south.characters[0]?.attachedDon).toBe(amount);
    expect(e.getView("south").players.south.restedDon).toBe(2 - amount);
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.leader("south"),
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
  });
  test("declines optional rested DON grant with legal Character", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST21-001",
      character: ["ST21-005"],
      activeDon: 1,
      restedDon: 2,
    });
    e.attachDon(e.leader("south"), 1);
    e.activateEffect(e.leader("south"), "activateMain");
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.characters[0]?.attachedDon).toBe(0);
    expect(e.getView("south").players.south.restedDon).toBe(2);
  });
  test("without attached DON activation is illegal", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST21-001",
      character: ["ST21-005"],
      restedDon: 2,
    });
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.leader("south"),
        trigger: "activateMain",
      }).reason,
    ).toBeTruthy();
    expect(e.getView("south").players.south.restedDon).toBe(2);
  });
});
