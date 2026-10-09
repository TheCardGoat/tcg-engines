import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-048 Shiki", () => {
  test("attacks a rested opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-048", attachedDon: 1 }], activeDon: 5 },
      { character: [{ cardId: "OP13-013", rested: true }], activeDon: 5 },
    );

    engine.asSouth().attack("OP17-048", "OP13-013");
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.cardId === "OP17-048")
        ?.rested,
    ).toBe(true);
  });

  test("declining On Opponent Attack preserves the eligible hand payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP17-048"], hand: ["OP17-049", "EB01-005"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    const handBefore = engine.getView("south").players.south.hand.map((c) => c.instanceId);
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual(handBefore);
    engine.asSouth().chooseCounter();
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-048",
    );
  });
  test("a newly played Shiki has Character-only Rush and pays only Rocks Pirates for its attack debuff", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-048", "OP17-049", "OP17-049", "EB01-005"], activeDon: 7 },
      { character: [{ cardId: "EB01-025", rested: true }, "OP16-003"] },
    );
    e.playCard("OP17-048");
    const shiki = e.findCardInZone("south", "character", "OP17-048"),
      victim = e.findCardInZone("north", "character", "OP16-003");
    const before = e
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === victim)!.power;
    if (before === null) throw new Error("missing opponent power");
    expect(() => e.declareAttack(shiki, e.leader("north"), "south")).toThrow();
    e.asSouth().attack(shiki, "EB01-025");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = e
      .getView("south")
      .players.south.hand.filter((c) => c.cardId === "OP17-049")
      .map((c) => c.instanceId);
    const step = e.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (step?.kind !== "payCost") throw new Error("hand selection missing");
    expect(new Set(step.candidates.map((c) => c.ref.id))).toEqual(new Set(payment));
    e.resolveDecision("effectCostTrashFromHand", { selectedIds: [payment[0]!] }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [victim] }, "south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === victim)?.power,
    ).toBe(before - 3000);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(payment[0]);
    expect(e.getView("south").players.north.trash.map((c) => c.cardId)).toContain("EB01-025");
    e.endTurn("south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === victim)?.power,
    ).toBe(before);
  });
  test("opponent attack pays the filtered hand cost once and a second attack cannot pay again", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-048"], hand: ["OP17-049", "OP17-049", "EB01-005"] },
      { character: ["OP16-003", "OP13-013"] },
      { activeSeat: "north" },
    );
    const victim = e.findCardInZone("north", "character", "OP16-003"),
      payment = e
        .getView("south")
        .players.south.hand.filter((c) => c.cardId === "OP17-049")
        .map((c) => c.instanceId);
    const before = e
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === victim)!.power;
    if (before === null) throw new Error("missing opponent power");
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectCostTrashFromHand", { selectedIds: [payment[0]!] }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [victim] }, "south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === victim)?.power,
    ).toBe(before - 3000);
    e.asSouth().chooseCounter();
    e.asNorth().attack("OP13-013", e.leader("south"));
    expect(() => e.pendingDecision("effectOptional", "south")).toThrow();
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(payment[1]);
    e.asSouth().chooseCounter();
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
