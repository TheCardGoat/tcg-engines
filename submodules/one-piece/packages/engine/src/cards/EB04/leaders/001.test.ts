import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-001 Jewelry Bonney", () => {
  test.each([0, 1, 2])("opponent-turn power checks the Life threshold %s", (life) => {
    const engine = OnePieceTestEngine.create({ leaderCardId: "EB04-001", life });
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(life <= 1 ? 7000 : 5000);
    engine.endTurn("north");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
  });

  test.each(["0", "1"])("may choose %s Life cards after declining the power target", (amount) => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "EB04-001", life: ["ST01-002", "ST01-003"] },
      { character: ["EB01-005"] },
    );
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    engine.resolveDecision("effectRemoveFromLifeCount", { optionId: amount }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(2 - Number(amount));
    expect(engine.getView("south").players.south.handCount).toBe(Number(amount));
    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual(
      amount === "1" ? ["ST01-002"] : [],
    );
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: engine.leader("south"),
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate:Main] with low life drops an opposing Character -1000", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "EB04-001",
        life: ["OP13-013"],
      },
      { character: ["OP16-012"] },
    );
    const bonneyId = engine.leader("south");
    engine.activateEffect(bonneyId, "activateMain", "south");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the drop target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [target.candidates[0]!.ref.id] },
      "south",
    );
    expect(engine.getView("south").players.north.characters[0]?.power).toBe(5000);
    expect(engine.getView("south").players.south.lifeCount).toBe(1);
    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate:Main] declined leaves the opposing Character untouched", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "EB04-001",
        life: ["OP13-013"],
      },
      { character: ["OP16-012"] },
    );
    const lawId = engine.findCardInZone("north", "character", "OP16-012");
    const before = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === lawId)?.power;

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    // The "up to 1" target selection IS the decline point.
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const after = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === lawId);
    expect(after?.power).toBe(before);
    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("the first damage reaches one Life and raises defense before the second attack", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "EB04-001", life: ["EB01-005", "EB01-018"] },
      {
        character: [
          { cardId: "EB01-025", playedOnTurn: 0 },
          { cardId: "EB01-025", playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackers = e
      .getView("north")
      .players.north.characters.filter(Boolean)
      .map((card) => card!.instanceId);
    e.declareAttack(attackers[0]!, e.leader("south"), "north");
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.leader.power).toBe(7000);
    e.declareAttack(attackers[1]!, e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
