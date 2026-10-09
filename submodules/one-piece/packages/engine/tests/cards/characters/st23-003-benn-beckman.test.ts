import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st23-003-benn-beckman", () => {
  test("pays discard and KOs only opposing base power4000 or less", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP09-001", hand: ["ST23-003", "ST21-005", "ST21-006"], activeDon: 4 },
      { character: ["ST21-005", "ST21-006"] },
    );
    e.playCard("ST23-003");
    e.asSouth().acceptOptional();
    e.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [e.findCardInZone("south", "hand", "ST21-005")] },
      "south",
    );
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("KO");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("north", "character", "ST21-005"),
    ]);
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST21-005"));
    expect(e.getView("north").players.north.trash[0]?.cardId).toBe("ST21-005");
  });
  test("wrong Leader can pay discard but does not KO", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST23-003", "ST21-005", "ST21-006"], activeDon: 4 },
      { character: ["ST21-005"] },
    );
    e.playCard("ST23-003");
    e.asSouth().acceptOptional();
    e.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [e.findCardInZone("south", "hand", "ST21-005")] },
      "south",
    );
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("ST21-005");
  });
  test("declines optional discard with payable hand and legal KO", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP09-001", hand: ["ST23-003", "ST21-005", "ST21-006"], activeDon: 4 },
      { character: ["ST21-005"] },
    );
    e.playCard("ST23-003");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(2);
    expect(e.getView("north").players.north.trash).toHaveLength(0);
  });
  test("base-power KO includes buffed low-base and excludes reduced high-base", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP09-001",
        hand: ["ST23-003", "ST21-017", "ST21-013", "ST21-006"],
        activeDon: 8,
      },
      { character: [{ cardId: "ST21-011", attachedDon: 2 }, "ST21-005", "ST21-008"] },
    );
    e.playCard("ST21-017");
    const high = e.findCardInZone("north", "character", "ST21-008");
    e.asSouth().chooseTargets(high);
    expect(e.getView("north").players.north.characters[2]?.power).toBe(1000);
    expect(e.getView("north").players.north.characters[1]?.power).toBe(5000);
    e.playCard("ST23-003");
    e.asSouth().acceptOptional();
    e.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [e.findCardInZone("south", "hand", "ST21-013")] },
      "south",
    );
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("KO");
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(high);
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST21-005"));
    expect(e.getView("north").players.north.trash[0]?.cardId).toBe("ST21-005");
    expect(e.getView("north").players.north.characters[2]?.power).toBe(1000);
  });
});
