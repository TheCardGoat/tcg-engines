import { describe, expect, test, vi } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05Maynard052,
  op05RobLucci093,
} from "@tcg/op-cards";

import * as targeting from "../../../src/effects/targeting.ts";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-093 Rob Lucci", () => {
  test("orders three trash cards and selects both K.O. groups before removing either", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05RobLucci093],
        trash: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
        activeDon: 4,
      },
      { character: [op05Maynard052, eb01Doma005, eb01Fourtricks025] },
    );
    const cost2Id = engine.findCardInZone("north", "character", op05Maynard052);
    const cost1Id = engine.findCardInZone("north", "character", eb01Doma005);
    const cost3Id = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op05RobLucci093, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected Lucci's ordered trash cost.");
    const paymentOrder = payment.candidates.slice(0, 3).map((candidate) => candidate.ref.id);
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: paymentOrder }, "south");

    const first = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(first?.kind).toBe("selectEntity");
    if (first?.kind !== "selectEntity") throw new Error("Expected Lucci's cost-2 K.O.");
    expect(first.candidates.map((candidate) => candidate.ref.id)).toEqual([cost2Id, cost1Id]);
    expect(first.candidates.map((candidate) => candidate.ref.id)).not.toContain(cost3Id);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [cost2Id] }, "south");

    expect(
      engine.getView("south").players.north.characters.some((card) => card?.instanceId === cost2Id),
    ).toBe(true);

    const second = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(second?.kind).toBe("selectEntity");
    if (second?.kind !== "selectEntity") throw new Error("Expected Lucci's cost-1 K.O.");
    expect(second.candidates.map((candidate) => candidate.ref.id)).toEqual([cost1Id]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [cost1Id] }, "south");

    expect(engine.getState().players.south.deck.slice(-3)).toEqual(paymentOrder);
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([cost2Id, cost1Id]),
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test.each(["yes", "no"])("offers one replacement for both selected groups: %s", (optionId) => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05RobLucci093], trash: [eb01Doma005, eb01Doma005, eb01Doma005], activeDon: 4 },
      {
        character: ["OP17-095", op05Maynard052, eb01Doma005],
        trash: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
    );
    const first = engine.findCardInZone("north", "character", op05Maynard052);
    const second = engine.findCardInZone("north", "character", eb01Doma005);
    const protectionPayment = [...engine.getState().players.north.trash].reverse();
    engine.playCard(op05RobLucci093);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectCostReturnTrashToDeck",
      { selectedIds: [...engine.getState().players.south.trash] },
      "south",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [first] }, "south");
    expect(engine.getView("north").prompts).toHaveLength(0);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [second] }, "south");
    engine.resolveDecision("effectKoReplacement", { optionId }, "north");
    if (optionId === "yes") {
      engine.resolveDecision(
        "effectReturnToDeckOwnerOrder",
        { selectedIds: protectionPayment },
        "north",
      );
      expect(engine.getState().players.north.deck.slice(-3)).toEqual(protectionPayment);
    }
    const remaining = engine
      .getView("north")
      .players.north.characters.flatMap((card) => (card ? [card.instanceId] : []));
    expect(remaining.includes(first)).toBe(optionId === "yes");
    expect(remaining.includes(second)).toBe(optionId === "yes");
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("a physical card cannot occupy both groups and rejected selection stays pending", () => {
    let engine = OnePieceTestEngine.create(
      { hand: [op05RobLucci093], trash: [eb01Doma005, eb01Doma005, eb01Doma005], activeDon: 4 },
      { character: [eb01Doma005, eb01Doma005] },
    );
    const ids = engine
      .getView("north")
      .players.north.characters.flatMap((card) => (card ? [card.instanceId] : []));
    engine.playCard(op05RobLucci093);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectCostReturnTrashToDeck",
      { selectedIds: [...engine.getState().players.south.trash] },
      "south",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ids[0]!] }, "south");
    const prompt = engine.pendingDecision("effectTargetSelection", "south");
    const beforeInvalid = engine.getView("south");
    const failed = engine.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: prompt.id,
      selectedIds: [ids[0]!],
    });
    engine = OnePieceTestEngine.fromState(failed.state);
    const rejected = engine.getView("south");
    expect(rejected.logs).toHaveLength(beforeInvalid.logs.length + 1);
    expect(rejected.logs.at(-1)?.message).toBe("Prompt resolution could not be applied.");
    expect({ ...rejected, logs: rejected.logs.slice(0, -1) }).toEqual(beforeInvalid);
    expect(engine.pendingDecision("effectTargetSelection", "south")).toEqual(prompt);
    expect(engine.getView("north").players.north.characters.filter(Boolean)).toHaveLength(2);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ids[1]!] }, "south");
    expect(engine.getView("north").players.north.characters.filter(Boolean)).toHaveLength(0);
  });

  test.each(["initial", "final"] as const)(
    "reports an unsupported target pool at the %s check without removing cards",
    (boundary) => {
      const engine = OnePieceTestEngine.create(
        { hand: [op05RobLucci093], trash: [eb01Doma005, eb01Doma005, eb01Doma005], activeDon: 4 },
        { character: [op05Maynard052, eb01Doma005] },
      );
      const first = engine.findCardInZone("north", "character", op05Maynard052);
      const second = engine.findCardInZone("north", "character", eb01Doma005);
      // Typed fault injection exercises a capability boundary; no current catalog
      // group has an unsupported filter. All game changes use public commands.
      let unsupported = boundary === "initial";
      const original = targeting.candidatePoolForTarget;
      const spy = vi.spyOn(targeting, "candidatePoolForTarget").mockImplementation((...args) => {
        if (
          unsupported &&
          args[3].filters?.some((filter) => filter.filter === "cost" && filter.value === 2)
        ) {
          return { supported: false, candidateIds: [] };
        }
        return original(...args);
      });
      try {
        engine.playCard(op05RobLucci093);
        engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
        engine.resolveDecision(
          "effectCostReturnTrashToDeck",
          { selectedIds: [...engine.getState().players.south.trash] },
          "south",
        );
        if (boundary === "final") {
          engine.resolveDecision("effectTargetSelection", { selectedIds: [first] }, "south");
          unsupported = true;
          engine.resolveDecision("effectTargetSelection", { selectedIds: [second] }, "south");
        }
        expect(
          engine
            .getView("north")
            .players.north.characters.flatMap((card) => (card ? [card.instanceId] : [])),
        ).toEqual([first, second]);
        expect(engine.getState().capabilityHistory).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ kind: "unsupportedTarget", code: "action-target-group:ko" }),
          ]),
        );
        expect(
          engine
            .getState()
            .promptQueue.some((prompt) => prompt.status === "pending" && prompt.kind === "judge"),
        ).toBe(true);
      } finally {
        spy.mockRestore();
      }
    },
  );

  test("may decline the cost or choose zero independently", () => {
    const declined = OnePieceTestEngine.create({
      hand: [op05RobLucci093],
      trash: [eb01Doma005, eb01Doma005, eb01Doma005],
      activeDon: 4,
    });
    const trashBefore = [...declined.getState().players.south.trash];
    declined.playCard(op05RobLucci093, "south");
    declined.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(declined.getState().players.south.trash).toEqual(trashBefore);

    const zero = OnePieceTestEngine.create(
      {
        hand: [op05RobLucci093],
        trash: [eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: 4,
      },
      { character: [eb01Doma005] },
    );
    zero.playCard(op05RobLucci093, "south");
    zero.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    zero.resolveDecision(
      "effectCostReturnTrashToDeck",
      { selectedIds: [...zero.getState().players.south.trash] },
      "south",
    );
    zero.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    zero.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(zero.getView("south").players.north.characters.filter(Boolean)).toHaveLength(1);
  });

  test("does not offer the effect with fewer than three trash cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05RobLucci093],
      trash: [eb01Doma005, eb01Doma005],
      activeDon: 4,
    });
    engine.playCard(op05RobLucci093, "south");
    expect(
      engine
        .getState()
        .promptQueue.some(
          (prompt) =>
            prompt.status === "pending" && prompt.resolutionContext?.intent === "effectOptional",
        ),
    ).toBe(false);
  });
});
