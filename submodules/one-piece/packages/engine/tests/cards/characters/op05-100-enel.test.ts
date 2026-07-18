import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import { eb01Doma005, op01TrafalgarLaw047, op02MonkeyDLuffy041, op05Enel100 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const returner: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP05-100-RETURNER",
  canonicalId: "TEST-OP05-100-RETURNER",
  name: "Test Returner",
  cost: 0,
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "any",
              zones: ["character"],
              count: { amount: 1 },
            },
          },
        ],
      },
    ],
  },
};
registerCards([returner]);

function returnEnelToHand(engine: OnePieceTestEngine, enelId: string, seat: "south" | "north") {
  engine.playCard(returner, seat);
  engine.resolveDecision("effectTargetSelection", { selectedIds: [enelId] }, seat);
}

describe("OP05-100 Enel", () => {
  test("trashes top Life instead of leaving once per turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05Enel100], life: [eb01Doma005] },
      { hand: [returner, returner] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const enelId = engine.findCardInZone("south", "character", op05Enel100);
    const lifeId = engine.getState().players.south.life[0]!;

    returnEnelToHand(engine, enelId, "north");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");
    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(enelId);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      lifeId,
    );

    returnEnelToHand(engine, enelId, "north");
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      enelId,
    );
  });

  test("a Monkey.D.Luffy on either field negates only the replacement, not Rush", () => {
    for (const luffySide of ["south", "north"] as const) {
      const rushEngine = OnePieceTestEngine.create(
        {
          activeDon: 7,
          ...(luffySide === "south" && { character: [op02MonkeyDLuffy041] }),
          hand: [op05Enel100],
        },
        luffySide === "north" ? { character: [op02MonkeyDLuffy041] } : {},
        { firstPlayer: "north", activeSeat: "south" },
      );
      rushEngine.playCard(op05Enel100, "south");
      const rushEnelId = rushEngine.findCardInZone("south", "character", op05Enel100);
      expect(() =>
        rushEngine.declareAttack(rushEnelId, rushEngine.leader("north"), "south"),
      ).not.toThrow();

      const engine = OnePieceTestEngine.create(
        {
          life: [eb01Doma005],
          character: [...(luffySide === "south" ? [op02MonkeyDLuffy041] : []), op05Enel100],
          hand: [returner],
        },
        luffySide === "north" ? { character: [op02MonkeyDLuffy041] } : {},
        { firstPlayer: "north", activeSeat: "south" },
      );
      const enelId = engine.findCardInZone("south", "character", op05Enel100);

      returnEnelToHand(engine, enelId, "south");
      expect(
        engine
          .getState()
          .promptQueue.some(
            (prompt) =>
              prompt.status === "pending" &&
              prompt.resolutionContext?.intent === "effectRemovalReplacement",
          ),
      ).toBe(false);
      expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
        enelId,
      );
    }
  });

  test("cannot replace leaving without a Life card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05Enel100], life: [] },
      { hand: [returner] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const enelId = engine.findCardInZone("south", "character", op05Enel100);
    returnEnelToHand(engine, enelId, "north");
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      enelId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("replacing Trafalgar Law's return cost prevents Law's dependent play", () => {
    const engine = OnePieceTestEngine.create({
      character: [op05Enel100],
      hand: [op01TrafalgarLaw047, eb01Doma005],
      life: [eb01Doma005],
      activeDon: 5,
    });
    const enelId = engine.findCardInZone("south", "character", op05Enel100);
    engine.playCard(op01TrafalgarLaw047, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnCharacter", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Law's Character return cost.");
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [enelId] }, "south");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");

    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(enelId);
    expect(
      engine
        .getState()
        .promptQueue.some(
          (prompt) =>
            prompt.status === "pending" &&
            prompt.resolutionContext?.intent === "effectPlaySelection",
        ),
    ).toBe(false);
    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toContain(
      eb01Doma005.id,
    );
  });
});
