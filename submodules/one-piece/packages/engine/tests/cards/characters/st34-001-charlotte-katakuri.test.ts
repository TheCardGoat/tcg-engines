import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST34-001 Katakuri", () => {
  test.each([0, 1, 2])(
    "own DON deck return adds %s rested and only once with second return payable",
    (amount) => {
      const e = OnePieceTestEngine.create(
        {
          leaderCardId: "ST07-001",
          character: ["ST34-001", "ST34-005", "ST34-005"],
          restedDon: 2,
          donDeckCount: 8,
        },
        { character: ["ST01-006"] },
      );
      const attackers = e
        .getView("south")
        .players.south.characters.slice(1, 3)
        .map((c) => c!.instanceId!);
      e.asSouth().attack(attackers[0]!, e.leader("north"));
      e.asSouth().acceptOptional();
      e.asSouth().chooseTargets();
      e.resolveDecision("effectAddDon", { optionId: String(amount) }, "south");
      expect(e.getView("south").players.south.restedDon).toBe(1 + amount);
      e.asNorth().chooseBlocker();
      e.asSouth().attack(attackers[1]!, e.leader("north"));
      e.asSouth().acceptOptional();
      e.asSouth().chooseTargets();
      expect(e.getView("south").players.south.restedDon).toBe(amount);
      e.asNorth().chooseBlocker();
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
  test("wrong Leader blocks add after valid return", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST02-001", character: ["ST34-001", "ST34-005"], restedDon: 1 },
      { character: ["ST01-006"] },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST34-005"), e.leader("north"));
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets();
    expect(e.getView("south").players.south.restedDon).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("return to rested cost area from Momonosuke is not DON-deck return", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST07-001",
      character: ["ST34-001", { cardId: "ST28-004", attachedDon: 2 }],
      donDeckCount: 8,
    });
    e.asSouth().activateMain(e.findCardInZone("south", "character", "ST28-004"));
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.restedDon).toBe(2);
    expect(e.getView("south").players.south.donDeckCount).toBe(8);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("opponent turn own DON return does not add", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP02-085"], activeDon: 5 },
      { leaderCardId: "ST07-001", character: ["ST34-001"], activeDon: 1 },
    );
    e.asSouth().play("OP02-085");
    e.asSouth().acceptOptional();
    expect(e.getView("north").players.north.activeDon).toBe(0);
    expect(e.getView("north").players.north.restedDon).toBe(0);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
  test("opponent-owned DON return on our turn does not add", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST07-001", character: ["ST34-001"] },
      { hand: ["OP02-089"], activeDon: 3 },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("north", "hand", "OP02-089")] },
      "north",
    );
    e.asNorth().acceptOptional();
    e.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    e.asNorth().chooseTargets();
    expect(e.getView("south").players.south.restedDon).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("OnKO plays any Character power8000 excluding stronger and Event", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST15-002"] },
      {
        character: [{ cardId: "ST34-001", rested: true }],
        hand: ["OP12-045", "ST26-004", "ST06-016"],
      },
    );
    const target = e.findCardInZone("north", "hand", "OP12-045");
    e.asSouth().attack(
      e.findCardInZone("south", "character", "ST15-002"),
      e.findCardInZone("north", "character", "ST34-001"),
    );
    e.asNorth().chooseCounter();
    const p = e.pendingDecision("effectPlaySelection", "north").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([target]);
    e.asNorth().choosePlay(target);
    expect(e.getView("north").players.north.characters.map((c) => c?.instanceId)).toContain(target);
  });
  test("declines optional OnKO play with eligible card", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST15-002"] },
      { character: [{ cardId: "ST34-001", rested: true }], hand: ["OP12-045"] },
    );
    e.asSouth().attack(
      e.findCardInZone("south", "character", "ST15-002"),
      e.findCardInZone("north", "character", "ST34-001"),
    );
    e.asNorth().chooseCounter();
    e.asNorth().chooseNoPlay();
    expect(e.getView("north").players.north.handCount).toBe(1);
  });
  test.each([false, true])(
    "two copies both spend first-event turn budget, exact10DON=%s",
    (full) => {
      const e = OnePieceTestEngine.create(
        {
          leaderCardId: "ST07-001",
          character: ["ST34-001", "ST34-001", "ST34-005", "ST34-005"],
          restedDon: full ? 10 : 2,
          donDeckCount: full ? 0 : 8,
        },
        { character: ["ST01-006"] },
      );
      const attackers = e
        .getView("south")
        .players.south.characters.slice(2, 4)
        .map((c) => c!.instanceId!);
      e.asSouth().attack(attackers[0]!, e.leader("north"));
      e.asSouth().acceptOptional();
      e.asSouth().chooseTargets();
      const order = e.pendingDecision("readyEffectOrder", "south").steps[0];
      if (order?.kind !== "chooseOption") throw Error("order");
      expect(order.options).toHaveLength(2);
      e.resolveDecision("readyEffectOrder", { optionId: order.options[0]!.id }, "south");
      e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
      if (!full) e.resolveDecision("effectAddDon", { optionId: "0" }, "south");
      e.asNorth().chooseBlocker();
      e.asSouth().attack(attackers[1]!, e.leader("north"));
      e.asSouth().acceptOptional();
      e.asSouth().chooseTargets();
      e.asNorth().chooseBlocker();
      expect(e.getView("south").players.south.restedDon).toBe(full ? 9 : 1);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});
