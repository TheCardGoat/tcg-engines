import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P030 Jinbe", () => {
  test.each(["south", "north"] as const)("OnKO may bottom cost3 Character owned by%s", (owner) => {
    const e = OnePieceTestEngine.create(
      { character: ["ST29-002", "ST29-003"] },
      { character: [{ cardId: "P-030", rested: true }, "ST29-002", "ST29-003"] },
    );
    const dead = e.findCardInZone("north", "character", "P-030"),
      target = e.findCardInZone(owner, "character", "ST29-002");
    e.asSouth().attack(e.leader("south"), dead);
    const p = e.pendingDecision("effectTargetSelection", "north").steps[0];
    if (p?.kind !== "selectEntity") throw Error("target");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual(
      expect.arrayContaining([target]),
    );
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).not.toContain(
      e.findCardInZone(owner, "character", "ST29-003"),
    );
    e.asNorth().chooseTargets(target);
    expect(e.getState().players[owner].deck.at(-1)).toBe(target);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(dead);
  });
  test("declines optional OnKO bottom with target available", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST29-002"] },
      { character: [{ cardId: "P-030", rested: true }] },
    );
    e.asSouth().attack(e.leader("south"), e.findCardInZone("north", "character", "P-030"));
    e.asNorth().chooseTargets();
    expect(e.getView("south").players.south.characters[0]?.cardId).toBe("ST29-002");
  });
});
