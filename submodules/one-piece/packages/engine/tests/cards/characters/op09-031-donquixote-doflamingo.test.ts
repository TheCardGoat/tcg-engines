import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op09DonquixoteDoflamingo031 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-031 Donquixote Doflamingo", () => {
  test("at end of turn becomes active when its controller has two rested Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op09DonquixoteDoflamingo031, rested: true },
          { card: eb01Doma005, rested: true },
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const doflamingoId = engine.findCardInZone("south", "character", op09DonquixoteDoflamingo031);

    engine.endTurn("south");

    const view = engine.getView("north");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === doflamingoId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("can block and become the attack target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { character: [op09DonquixoteDoflamingo031] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const doflamingoId = engine.findCardInZone("north", "character", op09DonquixoteDoflamingo031);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Doflamingo's Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(doflamingoId);
    engine.resolveDecision("battleBlocker", { selectedIds: [doflamingoId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === doflamingoId)?.rested,
    ).toBe(true);
  });
  test("FAQ: only one of two rested copies becomes active after chosen first source", () => {
    const e = OnePieceTestEngine.create({
      character: [
        { cardId: "OP09-031", rested: true },
        { cardId: "OP09-031", rested: true },
      ],
    });
    const ids = e
      .getView("south")
      .players.south.characters.filter((c) => c !== null)
      .map((c) => c.instanceId);
    e.asSouth().endTurn();
    const order = e.pendingDecision("readyEffectOrder", "south").steps[0];
    if (order?.kind !== "chooseOption") throw Error("order");
    const selected = order.options.find((o) => o.targetId === ids[1]);
    if (!selected) throw Error("secondsource");
    e.resolveDecision("readyEffectOrder", { optionId: selected.id }, "south");
    expect(
      e
        .getView("south")
        .players.south.characters.filter((c) => c !== null)
        .map((c) => c.rested),
    ).toEqual([true, false]);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
