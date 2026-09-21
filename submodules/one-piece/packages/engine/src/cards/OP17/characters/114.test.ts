import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-114", () => {
  test("[On Play] rests 2 DON!!, draws, adds to Life, and gives -3000 to an opposing Character", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-114"], activeDon: 8, life: ["OP12-013"] },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");
    const higumaPower = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === higumaId)?.power;

    engine.playCard("OP17-114");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const life = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
    if (life?.kind !== "chooseOption") throw new Error("Expected the Life count choice.");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    const debuff = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (debuff?.kind !== "selectEntity") throw new Error("Expected the -3000 target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(engine.getView("south").players.south.handCount).toBe(1);
    expect(engine.getView("south").players.south.lifeCount).toBe(2);
    const debuffed = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === higumaId);
    expect(debuffed?.power).toBe((higumaPower ?? 0) - 3000);
    expect(engine.getView("south").players.south.activeDon).toBe(0);
    expect(engine.getView("south").players.south.restedDon).toBe(8);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] declined skips every part of the effect", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-114"], activeDon: 8, life: ["OP12-013"] },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");
    const higumaPower = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === higumaId)?.power;

    engine.playCard("OP17-114");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").players.south.lifeCount).toBe(1);
    const untouched = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === higumaId);
    expect(untouched?.power).toBe(higumaPower);
    expect(engine.getView("south").players.south.activeDon).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] may be declined", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-114"], activeDon: 8 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP17-114");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-114",
    );
    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const sweet = "OP17-114";
    const engine = OnePieceTestEngine.create(
      { hand: [sweet], activeDon: 8 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(sweet);
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

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(sweet);
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
