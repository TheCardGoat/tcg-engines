import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op15Morgan017 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-017 Morgan", () => {
  test("pays by clogging an opposing Character, then clogs the opposing Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Morgan017], activeDon: 2 },
      { character: [{ card: eb01Doma005 }], activeDon: 2, restedDon: 2 },
    );
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);
    const leaderId = engine.leader("north");

    engine.activateEffect(
      engine.findCardInZone("south", "character", op15Morgan017),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectCostGiveDon", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected the clog cost.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual([leaderId, domaId]);
    engine.resolveDecision("effectCostGiveDon", { selectedIds: [domaId] }, "south");

    expect(engine.getView("south").players.north.restedDon).toBe(1);
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === domaId)
        ?.attachedDon,
    ).toBe(1);

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the give count.");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the clog target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(leaderId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");

    const north = engine.getView("south").players.north;
    expect(north.restedDon).toBe(0);
    expect(north.activeDon).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the cost leaves the opponent's DON!! untouched", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Morgan017], activeDon: 2 },
      { character: [{ card: eb01Doma005 }], activeDon: 2, restedDon: 2 },
    );

    engine.activateEffect(
      engine.findCardInZone("south", "character", op15Morgan017),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const north = engine.getView("south").players.north;
    expect(north.restedDon).toBe(2);
    expect(north.activeDon).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
