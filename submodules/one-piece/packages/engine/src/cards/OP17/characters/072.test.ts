import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Black Maria (OP17-072) cost=2 power=1000 counter=1000
describe("OP17-072 Black Maria", () => {
  test("[On Opponent's Attack] resolves its trigger during an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP17-072"], hand: ["EB01-005"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const cardId = engine.findCardInZone("south", "character", "OP17-072");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.acceptLeadingOptional("south");

    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      cardId,
    );
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-072", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-072",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
