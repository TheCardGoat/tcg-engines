import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST34-002 Cracker", () => {
  test.each([0, 1])("adds%s then KO cost2 regardless zero add", (amount) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST07-001", hand: ["ST34-002"], activeDon: 4, donDeckCount: 6 },
      { character: ["ST33-001", "ST29-002"] },
    );
    const target = e.findCardInZone("north", "character", "ST33-001");
    e.asSouth().play("ST34-002");
    e.resolveDecision("effectAddDon", { optionId: String(amount) }, "south");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("target");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([target]);
    e.asSouth().chooseTargets(target);
    expect(e.getView("south").players.south.restedDon).toBe(4 + amount);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
  });
  test("wrong Leader blocks both clauses", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST02-001", hand: ["ST34-002"], activeDon: 4 },
      { character: ["ST33-001"] },
    );
    e.asSouth().play("ST34-002");
    expect(e.getView("south").players.south.restedDon).toBe(4);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines optional KO after accepting DON", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST07-001", hand: ["ST34-002"], activeDon: 4 },
      { character: ["ST33-001"] },
    );
    e.asSouth().play("ST34-002");
    e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    e.asSouth().chooseTargets();
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").players.south.restedDon).toBe(5);
  });
});
