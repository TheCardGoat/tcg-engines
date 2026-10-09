import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-049 Finger Pistol Yellow Lotus", () => {
  test("K.O. uses base cost, excluding a cost-eight Character reduced below five", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP02-117", "EB04-049"], activeDon: 5, deck: ["ST01-002", "ST01-003", "ST01-004"] },
      { character: ["P-040", "OP16-012"] },
    );
    const high = e.findCardInZone("north", "character", "P-040");
    const low = e.findCardInZone("north", "character", "OP16-012");
    e.playCard("OP02-117");
    e.resolveDecision("effectTargetSelection", { selectedIds: [high] }, "south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === high)?.cost,
    ).toBe(3);
    e.playCard("EB04-049");
    e.asSouth().acceptOptional();
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected base-cost KO selection.");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([low]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [low] }, "south");
    expect(e.getView("south").players.north.characters.filter(Boolean)).toMatchObject([
      { instanceId: high },
    ]);
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(low);
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });

  test("Life Trigger invokes Main and pays the two-card deck cost before K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { life: ["EB04-049", "ST01-002"], deck: ["ST01-003", "ST01-004", "ST01-005"] },
      { character: ["EB01-005"] },
    );
    const target = engine.findCardInZone("north", "character", "EB01-005");
    engine.endTurn("south");
    engine.asNorth().attack(engine.leader("north"), engine.leader("south"));
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    engine.acceptLeadingOptional("south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(engine.getView("south").players.south.deckCount).toBe(1);
    expect(engine.getView("south").players.south.trash.map((card) => card.cardId)).toEqual(
      expect.arrayContaining(["ST01-003", "ST01-004"]),
    );
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      target,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Main] trashing 2 deck cards K.O.s a base-cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-049"], deck: ["OP13-013", "OP16-012", "ST01-002"], activeDon: 4 },
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
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-049"], activeDon: 4, deck: ["ST01-002", "ST01-003", "ST01-004"] },
      { character: ["EB01-005"] },
    );
    const target = engine.findCardInZone("north", "character", "EB01-005");

    engine.playCard("EB04-049");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("EB04-049");
    expect(engine.getView("south").players.south.deckCount).toBe(3);
    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toEqual(["EB04-049"]);
    expect(engine.getView("south").players.north.characters[0]).toMatchObject({
      instanceId: target,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
