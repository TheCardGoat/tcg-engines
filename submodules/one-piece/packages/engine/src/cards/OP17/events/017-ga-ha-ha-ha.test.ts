import { describe, expect, test } from "vite-plus/test";

import { op17EdwardNewgate001 } from "../../../../../cards/src/cards/leaders/op17-001-edward-newgate.ts";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-017 Ga Ha Ha Ha Ha", () => {
  test("[Counter] boosts the Whitebeard Leader and drops the attacker by 2000", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op17EdwardNewgate001, hand: ["OP17-017"], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const base = engine.getView("south").players.south.leader?.power ?? 0;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-012", engine.asSouth().leader());
    // Decline the Leader's own optional to reach the counter step.
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    engine.asSouth().chooseCounter("OP17-017");
    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (boost?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    const leaderId = engine.getView("south").players.south.leader!.instanceId!;
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");
    expect(engine.getView("south").players.south.leader?.power).toBe(base + 2000);

    const drop = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (drop?.kind !== "selectEntity") throw new Error("Expected the drop target.");
    const bennId = engine.findCardInZone("north", "character", "OP16-012");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [bennId] }, "south");
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === bennId)?.power,
    ).toBe(4000);

    // The Leader survives the attacker that would otherwise tie or exceed.
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("[Counter] resolves as a battle counter", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-017"], activeDon: 5 },
      { activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack(engine.leader("north"), engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP17-017");
    const boost = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    if (boost?.extensions?.resolutionIntent === "effectTargetSelection") {
      engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    }

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP17-017");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
