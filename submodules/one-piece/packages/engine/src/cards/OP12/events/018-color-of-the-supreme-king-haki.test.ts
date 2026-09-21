import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-018 Color of the Supreme King Haki", () => {
  test("[Counter] boosts a Character and the optional rest-DON drops the opponent's board", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP12-018"], character: ["OP13-066"], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const rayleighId = engine.findCardInZone("south", "character", "OP13-066");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-012", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP12-018");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [rayleighId] }, "south");
    const restCount = engine.pendingDecision("effectRestDonCount", "south").steps[0];
    if (restCount?.kind !== "chooseOption") throw new Error("Expected the rest count.");
    engine.resolveDecision("effectRestDonCount", { optionId: "1" }, "south");

    const north = engine.getView("south").players.north;
    // Opponent Leader and Characters each dropped by 1000 (6000 and 6000 base).
    expect(north.leader?.power).toBe(4000);
    expect(north.characters.find((c) => c?.cardId === "OP16-012")?.power).toBe(5000);
    expect(engine.getView("south").players.south.lifeCount).toBe(3);
  });

  test("[Counter] with the boost target declined, only the counter value applies", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP13-066"], hand: ["OP12-018"], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );

    engine.endTurn("south");
    const northLeaderPower = engine.getView("south").players.north.leader.power;
    if (northLeaderPower === null) throw new Error("Expected the north Leader.");
    engine.asNorth().attack("OP16-012", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP12-018");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    const restCount = engine.pendingDecision("effectRestDonCount", "south").steps[0];
    if (restCount?.kind !== "chooseOption") throw new Error("Expected the rest count.");
    engine.resolveDecision("effectRestDonCount", { optionId: "1" }, "south");

    // No boost target selected; the optional rest still dropped the
    // opponent's Leader by 1000. The 9000 attacker still overpowers the
    // 5000 Leader + 2000 counter, so 1 damage lands.
    expect(engine.getView("south").players.north.leader.power).toBe(northLeaderPower - 1000);
    expect(engine.getView("south").players.south.lifeCount).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
