import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-011-uta", () => {
  test("pays one DON for a no-base-effect Character, expires and rejects repeat with cost available", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "P-011",
      character: ["P-012", "P-018"],
      activeDon: 2,
    });
    e.activateEffect(e.leader("south"), "activateMain");
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("target");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("south", "character", "P-012"),
    ]);
    e.asSouth().chooseTargets("P-012");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.leader("south"),
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
  });
  test("declines optional DON cost without spending DON or increasing power", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "P-011",
      character: ["P-012"],
      activeDon: 1,
    });
    e.activateEffect(e.leader("south"), "activateMain");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
  });
  test("cannot activate with no active DON", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "P-011",
      character: ["P-012"],
      restedDon: 1,
    });
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.leader("south"),
        trigger: "activateMain",
      }).reason,
    ).toBeTruthy();
    expect(e.getView("south").players.south.restedDon).toBe(1);
  });
  test("FAQ Counter-only vanilla remains eligible after an acquired power effect but Trigger-only card is excluded", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "P-011",
      character: ["P-012", "ST36-003"],
      hand: ["P-020"],
      activeDon: 2,
    });
    e.playCard("P-020");
    e.asSouth().chooseTargets("P-012");
    e.activateEffect(e.leader("south"), "activateMain");
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("target");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("south", "character", "P-012"),
    ]);
    e.asSouth().chooseTargets("P-012");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(8000);
    expect(e.getView("south").players.south.characters[1]?.power).toBe(4000);
  });
});
