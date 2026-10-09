import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-026 Fugar", () => {
  test("plays for the printed cost of one DON!!", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP17-026"], activeDon: 1 });
    engine.playCard("OP17-026");
    expect(engine.getView("south").players.south.activeDon).toBe(0);
    expect(
      engine
        .getView("south")
        .players.south.characters.filter(Boolean)
        .map((c) => c?.cardId),
    ).toEqual(["OP17-026"]);
  });
  test("[When Attacking] rests cost2 but excludes cost3 under a Red-Haired Leader", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP17-020", character: [{ cardId: "OP17-026", playedOnTurn: 0 }] },
      { character: ["OP17-012", "OP17-052"] },
    );
    const legal = e.findCardInZone("north", "character", "OP17-012"),
      wrong = e.findCardInZone("north", "character", "OP17-052");
    e.declareAttack(e.findCardInZone("south", "character", "OP17-026"), e.leader("north"), "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected rest selection");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([legal]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [legal] }, "south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === legal)?.rested,
    ).toBe(true);
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === wrong)?.rested,
    ).toBe(false);
  });

  test("[On K.O.] resolves when K.O.'d by an attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-026", rested: true }], deck: ["OP17-002", "OP17-006"] },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const cardId = engine.findCardInZone("south", "character", "OP17-026");

    const drawn = engine.getView("south").players.south.handCount;
    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP17-026");

    expect(engine.getView("south").players.south.handCount).toBe(drawn + 1);
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(cardId);
  });
});
