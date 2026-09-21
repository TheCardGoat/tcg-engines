import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-046", () => {
  test("[Blocker] intercepts an opposing attack by resting", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-046", rested: false }], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "EB04-046");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.asSouth().chooseBlocker(selfId);

    // The 1000-power blocker dies to the 10000 attacker but the Leader is safe.
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(selfId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Opponent's Turn] raises a {Navy} Character's cost by 2", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["EB04-046", "OP12-053"], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const borsalinoId = engine.findCardInZone("south", "character", "OP12-053");
    const costBefore = engine
      .getView("south")
      .players.south.characters.find((c) => c?.instanceId === borsalinoId)?.cost;

    engine.endTurn("south");
    const duringOpponentTurn = engine
      .getView("south")
      .players.south.characters.find((c) => c?.instanceId === borsalinoId)?.cost;

    expect(duringOpponentTurn).toBe((costBefore ?? 0) + 2);
  });
});
