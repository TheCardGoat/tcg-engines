import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op09Buggy042,
  op13MonkeyDDragon017,
  op13MonkeyDLuffy001,
  op13PortgasDAce002,
  op13Sabo004,
  op13Uta023,
} from "@tcg/op-cards";
import { op13MonkeyDGarp016 } from "../../../../../cards/src/cards/OP13/characters/016-monkey-d-garp.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-016 Monkey.D.Garp", () => {
  test.each([
    ["Sabo", op13Sabo004],
    ["Portgas.D.Ace", op13PortgasDAce002],
    ["Monkey.D.Luffy", op13MonkeyDLuffy001],
  ])("with a %s Leader searches top four for a cost-3-or-more card", (_name, leader) => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: leader,
      hand: [op13MonkeyDGarp016],
      activeDon: op13MonkeyDGarp016.cost,
      deck: [op13Uta023, op13MonkeyDDragon017, eb01Doma005, eb01MountainGod018, eb01Doma005],
    });
    const selectedId = engine.findCardInZone("south", "deck", op13Uta023);
    const otherEligibleId = engine.findCardInZone("south", "deck", op13MonkeyDDragon017);
    const ineligibleId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op13MonkeyDGarp016, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Garp's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === otherEligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === ineligibleId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Garp's remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.prompts).toHaveLength(0);
  });

  test("with another Leader does not inspect or move the deck", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Buggy042,
      hand: [op13MonkeyDGarp016],
      activeDon: op13MonkeyDGarp016.cost,
      deck: [op13Uta023, op13MonkeyDDragon017, eb01Doma005, eb01MountainGod018],
    });
    const eligibleId = engine.findCardInZone("south", "deck", op13Uta023);

    engine.playCard(op13MonkeyDGarp016, "south");

    expect(engine.findCardInZone("south", "deck", op13Uta023)).toBe(eligibleId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
