import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST16-002 Gordon", () => {
  test("FAQ two Music discards give one recipient two thousand battle power", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST16-002", "ST12-004"], hand: ["ST11-003", "ST11-004", "ST12-009"], life: 2 },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), e.leader("south"));
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("music");
    const ids = ["ST11-003", "ST11-004"].map((c) => e.findCardInZone("south", "hand", c));
    expect(p.candidates.map((c) => c.ref.id)).toEqual(ids);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: ids }, "south");
    e.asSouth().chooseTargets(e.leader("south"));
    expect(e.getView("south").players.south.leader.power).toBe(7000);
    expect(e.getView("south").players.south.characters[1]?.power).toBe(5000);
    e.asSouth().chooseBlocker();
    e.asSouth().chooseCounter();
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.trash).toHaveLength(2);
  });
  test("declines optional Music trash then uses Blocker", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST16-002"], hand: ["ST11-003"], life: 2 },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), e.leader("south"));
    e.asSouth().declineOptional();
    e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST16-002"));
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST16-002");
  });
  test("accepts zero Music cards with no power increase", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST16-002"], hand: ["ST11-003"], life: 2 },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), e.leader("south"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [] }, "south");
    e.asSouth().chooseTargets(e.leader("south"));
    e.asSouth().chooseBlocker();
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(e.getView("south").players.south.handCount).toBe(2);
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
});
