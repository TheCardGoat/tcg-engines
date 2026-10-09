import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-021 Just Watch Me, Ace!!", () => {
  test("costs -3 in hand with 4 or more Events in trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP15-021"],
        trash: ["EB01-010", "EB01-039", "EB01-050", "OP15-019"],
        activeDon: 1,
      },
      { character: ["OP13-013"] },
    );

    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    // Cost 4, reduced to 1 with four Events in the trash.
    engine.playCard("OP15-021");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the power target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.power,
    ).toBe(0);
  });

  test("without 4 Events in trash the full cost is due", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-021"], trash: ["EB01-010", "EB01-039"], activeDon: 1 },
      {},
    );

    expect(() => engine.playCard("OP15-021")).toThrow();
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
  });
  test("discounted Counter reduces the attacker for the rest of its turn", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP15-021", "ST02-002"], trash: Array(4).fill("OP15-019"), activeDon: 1 },
      { character: ["EB01-018"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const attacker = e.findCardInZone("north", "character", "EB01-018");
    e.asNorth().attack(attacker, e.leader("south"));
    e.asSouth().chooseCounter("OP15-021");
    e.asSouth().chooseTargets(attacker);
    expect(e.getView("south").players.north.characters[0]?.power).toBe(4000);
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.north.characters[0]?.power).toBe(4000);
    e.endTurn("north");
    expect(e.getView("south").players.north.characters[0]?.power).toBe(7000);
  });
});
