import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-038 Trafalgar Law", () => {
  test("rests the Leader as payment and KOs cost 1, excluding cost 2", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-038"], activeDon: 4 },
      { character: ["EB01-005", "ST01-009"] },
    );
    const id = e.findCardInZone("north", "character", "EB01-005");
    e.asSouth().play("P-038");
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("target");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([id]);
    e.asSouth().chooseTargets(id);
    expect(e.getView("south").players.south.leader.rested).toBe(true);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(id);
  });
  test("declines optional Leader rest with an eligible target", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-038"], activeDon: 4 },
      { character: ["EB01-005"] },
    );
    e.asSouth().play("P-038");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.leader.rested).toBe(false);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("a rested Leader cannot pay the optional On Play cost", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-038"], activeDon: 4 },
      { character: ["EB01-005"] },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().play("P-038");
    expect(e.getView("south").players.south.leader.rested).toBe(true);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
