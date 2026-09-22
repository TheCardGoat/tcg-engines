import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-097 I'll Feed on This Rage and Use It to Bring the World to Ruin", () => {
  test("[Main] gives all opposing Characters -1 cost; [Counter] Leader +3000", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-097", "EB01-005"], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const bennId = engine.findCardInZone("north", "character", "OP16-012");

    engine.playCard("OP17-097");
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === bennId)?.cost,
    ).toBe(4);

    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.endTurn("south");
    engine.asNorth().attack("OP16-012", engine.asSouth().leader());
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    // Damage lands: the event was spent on the -1 cost.
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore - 1);
  });

  test("[Counter] resolves as a battle counter", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-097"], activeDon: 5 },
      { activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack(engine.leader("north"), engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP17-097");
    const boost = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    if (boost?.extensions?.resolutionIntent === "effectTargetSelection") {
      engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    }

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP17-097");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
