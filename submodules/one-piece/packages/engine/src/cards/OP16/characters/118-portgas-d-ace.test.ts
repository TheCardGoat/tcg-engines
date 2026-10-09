import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-118 Portgas.D.Ace", () => {
  test.each([0, 1, 2])(
    "%i Ace copies on field set printed +2000 to +2000 without stacking",
    (copies) => {
      const engine = OnePieceTestEngine.create(
        { character: Array.from({ length: copies }, () => "OP16-118"), hand: ["OP16-004"] },
        { character: ["OP16-065"] },
        { activeSeat: "north" },
      );
      const before = engine.getView("south").players.south.lifeCount;
      engine.asNorth().attack("OP16-065", engine.asSouth().leader());
      engine.asSouth().chooseCounter("OP16-004");
      expect(engine.getView("south").players.south.lifeCount).toBe(before - 1);
    },
  );

  test.each([true, false])("Ace's Counter aura applies only from the field: %s", (onField) => {
    const engine = OnePieceTestEngine.create(
      {
        character: onField ? ["OP16-118"] : [],
        hand: onField ? ["OP16-014"] : ["OP16-118", "OP16-014"],
      },
      {},
      { activeSeat: "north" },
    );
    const target = engine.findCardInZone("south", "hand", "OP16-014");
    engine.asNorth().attack(engine.asNorth().leader(), engine.asSouth().leader());
    const step = engine.pendingDecision("battleCounter", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Counter choice");
    expect(step.candidates.find((c) => c.ref.id === target)?.legal).toBe(onField);
    if (onField) {
      const before = engine.getView("south").players.south.lifeCount;
      engine.asSouth().chooseCounter("OP16-014");
      expect(engine.getView("south").players.south.lifeCount).toBe(before);
    }
  });

  test("[On Play] looks at 5, may take a Whitebeard Pirates card, and orders the rest", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-118"],
        deck: ["OP13-013", "OP16-003", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 5,
      },
      {},
    );

    engine.playCard("OP16-118");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected the search choice.");
    const legal = search.candidates.filter((candidate) => candidate.legal);
    expect(legal.map((candidate) => candidate.publicInfo?.cardId)).toEqual(["OP16-003"]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [legal[0]!.ref.id!] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.hand.map((card) => card.cardId)).toContain("OP16-003");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("FAQ: an 8000-power printed 1000 Counter becomes 2000, and two Aces do not make 4000", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP16-118", "OP16-118"], hand: ["OP16-005"] },
      { activeDon: 1 },
      { activeSeat: "north" },
    );
    e.attachDon(e.leader("north"), 1, "north");
    const life = e.getView("south").players.south.lifeCount;
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.asSouth().chooseCounter("OP16-005");
    expect(e.getView("south").players.south.lifeCount).toBe(life);
    const stronger = OnePieceTestEngine.create(
      { character: ["OP16-118", "OP16-118"], hand: ["OP16-005"] },
      { character: ["OP16-065"] },
      { activeSeat: "north" },
    );
    const before = stronger.getView("south").players.south.lifeCount;
    stronger.asNorth().attack("OP16-065", stronger.leader("south"));
    stronger.asSouth().chooseCounter("OP16-005");
    expect(stronger.getView("south").players.south.lifeCount).toBe(before - 1);
  });
});
