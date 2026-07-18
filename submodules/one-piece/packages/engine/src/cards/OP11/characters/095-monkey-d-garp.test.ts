import { describe, expect, test } from "vite-plus/test";
import {
  op01Shanks120,
  op11Bogard093,
  op11MonkeyDGarp095,
  op11Morgan094,
  op11Ripper096,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-095 Monkey.D.Garp", () => {
  test("bottom-orders three Navy cards, gives rested DON!!, then K.O.s a cost-7 target when a cost-9 Character exists", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11MonkeyDGarp095],
        character: [op01Shanks120],
        trash: [op11Bogard093, op11Morgan094, op11Ripper096],
        activeDon: op11MonkeyDGarp095.cost,
        restedDon: 1,
      },
      { character: [op11Bogard093, op11MonkeyDGarp095] },
    );
    const paymentIds = [...engine.getState().players.south.trash].reverse();
    const eligibleId = engine.findCardInZone("north", "character", op11Bogard093);
    const expensiveId = engine.findCardInZone("north", "character", op11MonkeyDGarp095);

    engine.playCard(op11MonkeyDGarp095, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 3, max: 3, ordered: true });
    if (cost?.kind !== "payCost") throw new Error("Expected Garp's Navy trash payment.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining(paymentIds),
    );
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: paymentIds }, "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected Garp's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Garp's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(engine.getState().players.south.deck.slice(-3)).toEqual(paymentIds);
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(expensiveId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer the conditional K.O. when no cost-9 Character exists", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11MonkeyDGarp095],
        trash: [op11Bogard093, op11Morgan094, op11Ripper096],
        activeDon: op11MonkeyDGarp095.cost,
      },
      { character: [op11Bogard093] },
    );
    const paymentIds = [...engine.getState().players.south.trash];
    const targetId = engine.findCardInZone("north", "character", op11Bogard093);

    engine.playCard(op11MonkeyDGarp095, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: paymentIds }, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
