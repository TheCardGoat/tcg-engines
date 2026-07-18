import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op02Daifugo078,
  op02Koby098,
  op02Minokoala086,
  op02Saldeath074,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-098 Koby", () => {
  test("may trash a chosen hand card to K.O. only an opposing cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02Koby098, eb01Doma005, eb01Fourtricks025], activeDon: op02Koby098.cost },
      { character: [op02Daifugo078, op02Minokoala086] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const keptId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const eligibleId = engine.findCardInZone("north", "character", op02Daifugo078);
    const excludedId = engine.findCardInZone("north", "character", op02Minokoala086);

    engine.playCard(op02Koby098, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Koby's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([discardedId, keptId]),
    );
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardedId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Koby's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(keptId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing a card or K.O.ing an opponent's Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02Koby098, eb01Doma005, eb01Fourtricks025],
        activeDon: op02Koby098.cost,
      },
      { character: [op02Saldeath074] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const retainedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", op02Saldeath074);

    engine.playCard(op02Koby098, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(retainedId);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("still pays the hand-trash cost when declining the up-to-one K.O. target", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02Koby098, eb01Doma005, eb01Fourtricks025],
        activeDon: op02Koby098.cost,
      },
      { character: [op02Saldeath074] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", op02Saldeath074);

    engine.playCard(op02Koby098, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardedId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
