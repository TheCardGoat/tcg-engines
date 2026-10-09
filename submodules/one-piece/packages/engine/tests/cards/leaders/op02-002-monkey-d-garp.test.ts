import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op01Crocodile067,
  op01EustassCaptainKid051,
  op02MonkeyDGarp002,
  st01Brook011,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

function chooseFirstGarpReaction(engine: OnePieceTestEngine) {
  const order = engine.pendingDecision("readyEffectOrder", "south").steps[0];
  if (order?.kind !== "chooseOption") throw new Error("Expected Garp reaction order.");
  expect(order.options).toHaveLength(2);
  expect(order.options.every((option) => option.label.includes("Garp"))).toBe(true);
  engine.resolveDecision("readyEffectOrder", { optionId: order.options[0]!.id }, "south");
}

describe("OP02-002 Monkey.D.Garp", () => {
  test("maps an own DON!! attachment to an opposing cost-7-or-less turn modifier", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02MonkeyDGarp002,
        character: [eb01Doma005],
        activeDon: 1,
      },
      { character: [op01Crocodile067, op01EustassCaptainKid051] },
    );
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);
    const boundaryId = engine.findCardInZone("north", "character", op01Crocodile067);
    const excludedId = engine.findCardInZone("north", "character", op01EustassCaptainKid051);

    engine.attachDon(recipientId, 1, "south");

    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error(
        "Expected the DON!! recipient's controller to choose a cost modifier target.",
      );
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([boundaryId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boundaryId] }, "south");

    expect(engine.getView("south").players.north.characters[0]?.cost).toBe(6);
    engine.endTurn("south");
    expect(engine.getView("south").players.north.characters[0]?.cost).toBe(7);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("giving two DON!! in one command triggers two cost reductions", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op02MonkeyDGarp002, activeDon: 2 },
      { character: [op01Crocodile067] },
    );
    const south = engine.asSouth();
    const target = engine.asNorth().findOnField(op01Crocodile067);

    south.attachDon(south.leader(), 2);
    chooseFirstGarpReaction(engine);
    south.chooseTargets(target);
    expect(south.view().players.north.characters[0]?.cost).toBe(6);
    south.chooseTargets(target);
    expect(south.view().players.north.characters[0]?.cost).toBe(5);
    expect(south.view().prompts).toHaveLength(0);
  });

  test("ST01-011 Brook gives two rested DON!! and triggers twice (OP02 Q270)", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op02MonkeyDGarp002, activeDon: 2, hand: [st01Brook011] },
      { character: [op01Crocodile067] },
    );
    const south = engine.asSouth();
    const target = engine.asNorth().findOnField(op01Crocodile067);

    south.play(st01Brook011);
    south.chooseAmount(2);
    south.chooseTargets(south.leader());
    expect(south.view().players.south.leader.attachedDon).toBe(2);
    chooseFirstGarpReaction(engine);
    south.chooseTargets(target);
    south.chooseTargets(target);
    expect(south.view().players.north.characters[0]?.cost).toBe(5);
    expect(south.view().prompts).toHaveLength(0);
  });

  test("giving zero DON!! with Brook does not trigger Garp", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op02MonkeyDGarp002, activeDon: 2, hand: [st01Brook011] },
      { character: [op01Crocodile067] },
    );
    const south = engine.asSouth();

    south.play(st01Brook011);
    south.chooseAmount(0);
    expect(south.view().players.north.characters[0]?.cost).toBe(7);
    expect(south.view().prompts).toHaveLength(0);
  });
});
