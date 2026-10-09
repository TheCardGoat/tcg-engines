import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST34-005 Tamago and Pekoms", () => {
  test("DON return KO uses printed base<=2000 despite opponent-turn aura", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST34-005"], restedDon: 1 },
      { leaderCardId: "ST30-001", character: ["ST29-012", "ST29-002"] },
    );
    const low = e.findCardInZone("north", "character", "ST29-012"),
      high = e.findCardInZone("north", "character", "ST29-002");
    expect(e.getView("north").players.north.characters[0]?.power).toBe(3000);
    e.asSouth().attack(e.findCardInZone("south", "character", "ST34-005"), e.leader("north"));
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("target");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([low]);
    e.asSouth().chooseTargets(low);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(low);
    expect(e.getView("north").players.north.characters.map((c) => c?.instanceId)).toContain(high);
    expect(e.getView("south").players.south.restedDon).toBe(0);
  });
  test("declines optional DON return with target available", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST34-005"], restedDon: 1 },
      { character: ["ST01-006"] },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST34-005"), e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
  });
  test("can select zero after paying DON", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST34-005"], restedDon: 1 },
      { character: ["ST01-006"] },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST34-005"), e.leader("north"));
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets();
    expect(e.getView("south").players.south.restedDon).toBe(0);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
  });
});
