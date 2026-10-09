import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST14-014 Gum-Gum Giant Rifle", () => {
  test.each(["leader", "character"])("cost-eight gate permits Counter power for %s", (kind) => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST14-014"],
        character: [{ cardId: "ST14-005", rested: true }, "ST14-012"],
        activeDon: 1,
        life: 2,
      },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const target =
      kind === "leader" ? e.leader("south") : e.findCardInZone("south", "character", "ST14-005");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), target);
    e.asSouth().chooseCounter(e.findCardInZone("south", "hand", "ST14-014"));
    e.asSouth().chooseTargets(target);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.characters[0]?.cardId).toBe("ST14-005");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("declines optional Counter power with valid recipient", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST14-014"], character: ["ST14-012"], activeDon: 1, life: 2 },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), e.leader("south"));
    e.asSouth().chooseCounter(e.findCardInZone("south", "hand", "ST14-014"));
    e.asSouth().chooseNoTargets();
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.restedDon).toBe(1);
  });
  test("Counter without cost eight gives no power", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST14-014"], character: ["ST14-005"], activeDon: 1, life: 2 },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), e.leader("south"));
    e.asSouth().chooseCounter(e.findCardInZone("south", "hand", "ST14-014"));
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.restedDon).toBe(1);
  });
  test("Life Trigger returns only cost-two-or-less Characters", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST14-014"], trash: ["ST12-015", "ST12-004", "ST14-015"] },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const id = e.findCardInZone("south", "trash", "ST12-015");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("recover");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([id]);
    e.asSouth().chooseTargets(id);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(id);
  });
});
