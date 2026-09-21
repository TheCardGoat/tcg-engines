import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-061", () => {
  test("[On Play] trashing a hand card boosts the Leader and grants [Blocker]", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      {
        hand: ["EB04-061", "EB01-005"],
        life: ["OP12-013"],
        deck: ["OP12-017", "OP13-013"],
        activeDon: 10,
      },
      { character: ["EB04-048"], activeDon: 5 },
    );
    const trashId = engine.findCardInZone("south", "hand", "EB01-005");
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard("EB04-061");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // The trash cost consumed the only other hand card automatically.
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(trashId);
    engine.endTurn("south");

    // The boosted 7000 Leader shrugs off the 6000 attacker; the new [Blocker]
    // is not needed for the save.
    engine.asNorth().attack("EB04-048", engine.asSouth().leader());
    // The freshly granted [Blocker] opens a blocker window: decline it.
    engine.asSouth().chooseBlocker(null);

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(trashId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] declined leaves the Leader's power untouched", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["EB04-061", "EB01-005"],
        life: ["OP12-013"],
        deck: ["OP12-017", "OP13-013"],
        activeDon: 10,
      },
      { character: ["EB04-048"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard("EB04-061");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    engine.endTurn("south");
    engine.asNorth().attack("EB04-048", engine.asSouth().leader());
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] decline path (subject-bound)", () => {
    const monkey = "EB04-061";
    const engine = OnePieceTestEngine.create(
      { hand: [monkey], activeDon: 12 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(monkey);
    const gate = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    const gateIntent = gate?.extensions?.resolutionIntent;
    if (gateIntent === "effectOptional") {
      engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    } else if (gateIntent) {
      const gateStep = engine.pendingDecision(gateIntent as never, "south").steps[0];
      if (gateStep?.kind === "selectEntity" || gateStep?.kind === "orderItems") {
        engine.resolveDecision(gateIntent as never, { selectedIds: [] }, "south");
      } else if (gateStep?.kind === "chooseOption") {
        engine.resolveDecision(gateIntent as never, { optionId: "0" }, "south");
      }
    }

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      monkey,
    );
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
