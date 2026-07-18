import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Sakazuki099,
  op02Shiki075,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-099 Sakazuki", () => {
  test("may trash a hand card to K.O. only an opposing cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02Sakazuki099, eb01Doma005, eb01Fourtricks025],
        activeDon: op02Sakazuki099.cost,
      },
      { character: [eb01MountainGod018, op02Sakazuki099] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const keptId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const excludedId = engine.findCardInZone("north", "character", op02Sakazuki099);

    engine.playCard(op02Sakazuki099, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardedId] }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Sakazuki's K.O. target.");
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

  test("may decline without trashing a hand card or K.O.ing a Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02Sakazuki099, eb01Doma005],
        activeDon: op02Sakazuki099.cost,
      },
      { character: [op02Shiki075] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const handId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", op02Shiki075);

    engine.playCard(op02Sakazuki099, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handId);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("keeps the paid hand-trash cost when choosing no K.O. target", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02Sakazuki099, eb01Doma005],
        activeDon: op02Sakazuki099.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op02Sakazuki099, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.prompts).toHaveLength(0);
  });
});
