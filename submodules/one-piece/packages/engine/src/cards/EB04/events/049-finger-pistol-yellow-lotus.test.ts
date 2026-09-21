import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-049 Finger Pistol Yellow Lotus", () => {
  test("[Main] trashing 2 deck cards K.O.s a base-cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-049"], deck: ["OP13-013", "OP16-012"], activeDon: 4 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const bennId = engine.findCardInZone("north", "character", "OP16-012");

    engine.playCard("EB04-049");
    engine.acceptLeadingOptional("south");
    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (ko?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [bennId] }, "south");

    expect(engine.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(bennId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Optional] declined leaves the board unchanged", () => {
    const engine = OnePieceTestEngine.create({ hand: ["EB04-049"], activeDon: 6 }, {});

    engine.playCard("EB04-049");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("EB04-049");
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
