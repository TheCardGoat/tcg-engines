import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st28-001-ashura-doji", () => {
  test("Wano Leader with opponent three Life KOs by base cost despite Hina's raised cost", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST09-001", hand: ["ST28-001"], activeDon: 3 },
      { life: 3, character: [{ cardId: "ST19-004", attachedDon: 1 }, "ST15-002"] },
    );
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(8);
    e.playCard("ST28-001");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("KO");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("north", "character", "ST19-004"),
    ]);
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST19-004"));
    expect(e.getView("north").players.north.trash[0]?.cardId).toBe("ST19-004");
  });
  test.each([
    ["ST09-001", 2],
    ["ST05-001", 3],
  ])("independent Leader/Life negative %s/%s", (leader, life) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: leader, hand: ["ST28-001"], activeDon: 3 },
      { life, character: ["ST21-005"] },
    );
    e.playCard("ST28-001");
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("ST21-005");
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines optional KO with both gates met", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST09-001", hand: ["ST28-001"], activeDon: 3 },
      { life: 3, character: ["ST21-005"] },
    );
    e.playCard("ST28-001");
    e.asSouth().chooseNoTargets();
    expect(e.getView("north").players.north.trash).toHaveLength(0);
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("ST21-005");
  });
});
