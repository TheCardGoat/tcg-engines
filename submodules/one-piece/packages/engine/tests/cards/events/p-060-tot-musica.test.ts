import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-060 Tot Musica", () => {
  test.each(["leader", "character"])("rests the Uta %s as cost then two opposing DON", (zone) => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST11-001",
        character: ["ST05-004", "ST02-002"],
        hand: ["P-060"],
        activeDon: 2,
      },
      { activeDon: 3, restedDon: 1 },
    );
    const uta = e.findCardInZone("south", "character", "ST05-004");
    e.asSouth().play("P-060");
    e.asSouth().acceptOptional();
    const cost = e.pendingDecision("effectCostRestCards", "south").steps[0];
    if (cost?.kind !== "payCost") throw Error("cost");
    expect(cost.candidates.map((c) => c.ref.id)).toEqual([e.leader("south"), uta]);
    e.resolveDecision(
      "effectCostRestCards",
      { selectedIds: [zone === "leader" ? e.leader("south") : uta] },
      "south",
    );
    e.resolveDecision(
      "effectMixedRestSelection",
      { selectedIds: ["active-don:north:0", "active-don:north:2"] },
      "south",
    );
    expect(e.getView("north").players.north.activeDon).toBe(1);
    expect(e.getView("north").players.north.restedDon).toBe(3);
    expect(
      zone === "leader"
        ? e.getView("south").players.south.leader.rested
        : e.getView("south").players.south.characters[0]?.rested,
    ).toBe(true);
  });
  test.each(["decline", "zero", "rested"])("allows %s optional selection", (mode) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST11-001", hand: ["P-060"], activeDon: 2 },
      { activeDon: 2, restedDon: 1 },
    );
    e.asSouth().play("P-060");
    if (mode === "decline") e.asSouth().declineOptional();
    else {
      e.asSouth().acceptOptional();
      e.resolveDecision(
        "effectMixedRestSelection",
        { selectedIds: mode === "rested" ? ["rested-don:north:0"] : [] },
        "south",
      );
    }
    expect(e.getView("north").players.north.activeDon).toBe(2);
    expect(e.getView("south").players.south.leader.rested).toBe(mode !== "decline");
  });
  test("already-rested Uta cannot pay", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST01-001",
        character: [{ cardId: "ST05-004", rested: true }],
        hand: ["P-060"],
        activeDon: 2,
      },
      { activeDon: 2 },
    );
    e.asSouth().play("P-060");
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("north").players.north.activeDon).toBe(2);
  });
});
