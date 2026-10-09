import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-056 Roronoa Zoro", () => {
  test.each(["south", "north"] as const)("pays two active DON and returns %s Character", (seat) => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-056"], activeDon: 6, character: ["ST02-002"] },
      { character: ["ST01-012", "ST32-003"] },
    );
    const c = e.findCardInZone(seat, "character", seat === "south" ? "ST02-002" : "ST01-012"),
      excluded = e.findCardInZone("north", "character", "ST32-003");
    e.asSouth().play("P-056");
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("target");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toContain(c);
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(excluded);
    e.asSouth().chooseTargets(c);
    expect(e.getView(seat).players[seat].hand.map((c) => c.instanceId)).toContain(c);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
  test.each(["decline", "zero", "unpaid"])("handles %s optional result", (mode) => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-056"], activeDon: mode === "unpaid" ? 5 : 6 },
      { character: ["ST02-002"] },
    );
    e.asSouth().play("P-056");
    if (mode === "decline") e.asSouth().declineOptional();
    if (mode === "zero") {
      e.asSouth().acceptOptional();
      e.asSouth().chooseTargets();
    }
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").players.south.activeDon).toBe(
      mode === "zero" ? 0 : mode === "decline" ? 2 : 1,
    );
  });
});
