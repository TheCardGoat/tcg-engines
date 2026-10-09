import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST14-015 Gum-Gum Diable Three-Swords Style Mouten Jet Six Hundred Pound Phoenix Cannon", () => {
  test("Main turn power then cost-eight-gated opposing cost-two KO", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST14-015"], character: ["ST14-012"], activeDon: 2 },
      { character: ["ST12-015", "ST12-004"] },
    );
    const target = e.findCardInZone("north", "character", "ST12-015");
    e.playCard("ST14-015");
    e.asSouth().chooseTargets(e.leader("south"));
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("KO");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.asSouth().chooseTargets(target);
    expect(e.getView("south").players.south.leader.power).toBe(8000);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
    e.endTurn("south");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("declines optional power but still performs independent KO", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST14-015"], character: ["ST14-012"], activeDon: 2 },
      { character: ["ST12-015"] },
    );
    e.playCard("ST14-015");
    e.asSouth().chooseNoTargets();
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST12-015"));
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("north").players.north.trash[0]?.cardId).toBe("ST12-015");
  });
  test("Main power still applies without cost eight", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST14-015"], activeDon: 2 },
      { character: ["ST12-015"] },
    );
    e.playCard("ST14-015");
    e.asSouth().chooseTargets(e.leader("south"));
    expect(e.getView("south").players.south.leader.power).toBe(8000);
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("ST12-015");
  });
  test.each(["ST14-012", "ST14-005"])("Trigger uses current cost-eight gate with %s", (card) => {
    const e = OnePieceTestEngine.create(
      { life: ["ST14-015"], character: [card] },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }, "ST12-013", "ST04-004"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    if (card === "ST14-012") {
      const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("KO");
      expect(p.candidates.map((c) => c.ref.id)).not.toContain(
        e.findCardInZone("north", "character", "ST04-004"),
      );
      e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST12-013"));
    }
    expect(e.getView("north").players.north.trash.length).toBe(card === "ST14-012" ? 1 : 0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
