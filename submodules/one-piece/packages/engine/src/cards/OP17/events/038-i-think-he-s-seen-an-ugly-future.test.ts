import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-038 I Think He's Seen an Ugly Future", () => {
  test("[Main] resting 4 cards rests an opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP17-038", "EB01-005"],
        character: ["EB01-005", "OP16-004", "OP13-013"],
        activeDon: 5,
        restedDon: 2,
      },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const bennId = engine.findCardInZone("north", "character", "OP16-012");

    engine.playCard("OP17-038");
    engine.acceptLeadingOptional("south");
    engine.resolveDecision(
      "effectCostRestCards",
      {
        selectedIds: [
          engine.leader("south"),
          ...["EB01-005", "OP16-004", "OP13-013"].map((id) =>
            engine.findCardInZone("south", "character", id),
          ),
        ],
      },
      "south",
    );
    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (rest?.kind !== "selectEntity") throw new Error("Expected the rest target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [bennId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === bennId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Optional] declined leaves the board unchanged", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP17-038"], activeDon: 5 }, {});
    engine.playCard("OP17-038");
    engine.asSouth().declineOptional();
    expect(engine.getView("south").players.south.activeDon).toBe(5);
    expect(engine.getView("south").players.south.restedDon).toBe(0);

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP17-038");
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("Counter pays the hand cost and saves Leader with3000 power", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-038", "EB01-005"], activeDon: 3 },
      { activeDon: 2 },
      { activeSeat: "north" },
    );
    e.attachDon(e.leader("north"), 2, "north");
    const life = e.getView("south").players.south.lifeCount;
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.asSouth().chooseCounter("OP17-038");
    e.acceptLeadingOptional("south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(life);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toEqual(
      expect.arrayContaining(["OP17-038", "EB01-005"]),
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declining Counter discard preserves the hand card and grants no boost", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-038", "EB01-005"], activeDon: 3 },
      {},
      { activeSeat: "north" },
    );
    const life = e.getView("south").players.south.lifeCount;
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.asSouth().chooseCounter("OP17-038");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(life - 1);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toContain("EB01-005");
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
