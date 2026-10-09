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
  test("FAQ: opponent-turn Life Trigger plays this card without its Your Turn On Play", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST07-001", life: ["OP17-114", "EB01-025"], deck: 5, activeDon: 2 },
      { hand: ["EB01-005"] },
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    const view = e.getView("south");
    expect(view.players.south.characters.map((c) => c?.cardId)).toContain("OP17-114");
    expect(view.players.south.deckCount).toBe(5);
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.south.activeDon).toBe(2);
    expect(view.players.north.handCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
  test("choosing zero Life still reduces two Characters' power until turn end", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST07-001",
        hand: ["OP17-114"],
        activeDon: 8,
        deck: ["OP17-107", "OP17-108", "OP17-109"],
      },
      { leaderCardId: "ST02-001", character: ["EB01-005", "ST02-006"] },
    );
    const before = e.getView("south");
    const targets = before.players.north.characters.flatMap((c) =>
      c?.instanceId ? [c.instanceId] : [],
    );
    const powers = before.players.north.characters.flatMap((c) =>
      c?.power != null ? [c.power] : [],
    );
    e.asSouth().play("OP17-114");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "0" }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: targets }, "south");
    const after = e.getView("south");
    expect(after.players.south.hand.map((c) => c.cardId)).toEqual(["OP17-107"]);
    expect(after.players.south.lifeCount).toBe(before.players.south.lifeCount);
    expect(after.players.south.deckCount).toBe(2);
    expect(after.players.south.activeDon).toBe(0);
    expect(after.players.south.restedDon).toBe(8);
    expect(
      after.players.north.characters.flatMap((c) => (c?.power != null ? [c.power] : [])),
    ).toEqual(powers.map((power) => power - 3000));
    e.endTurn("south");
    expect(
      e
        .getView("south")
        .players.north.characters.flatMap((c) => (c?.power != null ? [c.power] : [])),
    ).toEqual(powers);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
