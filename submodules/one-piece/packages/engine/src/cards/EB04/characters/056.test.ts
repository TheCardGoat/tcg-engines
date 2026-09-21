import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-056", () => {
  test("with [Jewelry Bonney] and 0 Life it gains [Blocker] and intercepts", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: ["EB04-056", "OP13-109"],
        life: [],
        activeDon: 5,
      },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "EB04-056");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.asSouth().chooseBlocker(selfId);

    // The 1000-power blocker dies to the 10000 attacker but the Leader is safe.
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(selfId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without [Jewelry Bonney] no [Blocker] is offered even at 0 Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["EB04-056"], life: [], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());

    // The attack resolves against the Leader: no blocker prompt existed.
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
