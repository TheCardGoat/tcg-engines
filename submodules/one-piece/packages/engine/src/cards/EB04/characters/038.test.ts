import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-038", () => {
  test("Blocker intercepts an attack instead of the Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["EB04-038"], life: 2 },
      { character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const defender = engine.findCardInZone("south", "character", "EB04-038");
    engine.asNorth().attack("EB01-018", engine.leader("south"));
    engine.asSouth().chooseBlocker(defender);
    expect(engine.getView("south").players.south.lifeCount).toBe(2);
    expect(
      engine.getView("south").players.south.characters.some((c) => c?.instanceId === defender),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("both printed alternate names apply to real Law and Rosinante name filters", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["EB04-038", "EB01-005"], hand: ["OP12-105", "OP12-073"], activeDon: 8 },
      { activeDon: 8 },
    );
    const duo = engine.findCardInZone("south", "character", "EB04-038");
    const other = engine.findCardInZone("south", "character", "EB01-005");
    engine.asSouth().play("OP12-105");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw Error("Expected Law name selection");
    expect(target.candidates.map((c) => c.ref.id)).toEqual([duo]);
    engine.asSouth().chooseTargets(duo);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === duo)?.power,
    ).toBe(10000);
    engine.asSouth().play("OP12-073");
    engine.asSouth().chooseAddDon(0);
    const field = engine.getView("south").players.south.characters;
    expect(field.find((c) => c?.instanceId === duo)?.power).toBe(11000);
    expect(field.find((c) => c?.instanceId === other)?.power).toBe(3000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] with equal DON!! draws 1 and adds up to 1 active DON!! from the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-038"], activeDon: 6 },
      { character: ["OP13-013"], activeDon: 6 },
    );

    engine.playCard("EB04-038");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected the DON!! count choice.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south.handCount).toBe(1);
    expect(engine.getView("south").players.south.activeDon).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] draws nothing when your DON!! count is higher, and does not add DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-038"], activeDon: 6 },
      { character: ["OP13-013"], activeDon: 1 },
    );

    engine.playCard("EB04-038");
    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").players.south.activeDon).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
