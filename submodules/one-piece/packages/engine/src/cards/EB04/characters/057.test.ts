import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-057", () => {
  test("[DON!! x1] grants [Blocker] to intercept an attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-057", attachedDon: 1 }], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "EB04-057");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.asSouth().chooseBlocker(selfId);

    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(selfId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without a DON!! attached no [Blocker] is offered", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-057", attachedDon: 0 }], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );

    engine.endTurn("south");
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());

    // Without the blocker the Leader takes the damage directly.
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
