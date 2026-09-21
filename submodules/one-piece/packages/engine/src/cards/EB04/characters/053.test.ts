import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-053", () => {
  test("[On Block] with 2 or less Life draws 1 card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "EB04-053", rested: false }],
        life: ["OP12-013", "OP12-017"],
        activeDon: 5,
      },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "EB04-053");

    engine.endTurn("south");
    const handBefore = engine.getView("south").players.south.handCount;
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.asSouth().chooseBlocker(selfId);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south.handCount).toBe(handBefore + 1);
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(selfId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Block] with 3 Life blocks without drawing", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "EB04-053", rested: false }],
        life: ["OP12-013", "OP12-017", "OP12-018"],
        activeDon: 5,
      },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "EB04-053");

    engine.endTurn("south");
    const handBefore = engine.getView("south").players.south.handCount;
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.asSouth().chooseBlocker(selfId);

    expect(engine.getView("south").players.south.handCount).toBe(handBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
