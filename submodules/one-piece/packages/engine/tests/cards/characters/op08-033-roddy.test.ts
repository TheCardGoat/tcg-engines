import { describe, expect, test } from "vite-plus/test";
import type { LeaderCard } from "@tcg/op-types";
import { eb01MountainGod018, op01Nekomamushi048, op08Carrot021, op08Roddy033 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const compoundMinksLeader: LeaderCard = {
  ...op08Carrot021,
  id: "TEST-OP08-033-COMPOUND-MINKS-LEADER",
  canonicalId: "TEST-OP08-033-COMPOUND-MINKS-LEADER",
  slug: "test-op08-033-compound-minks-leader",
  name: "Compound Minks Leader",
  printings: [],
  traits: ["Heart Pirates Minks"],
  effect: undefined,
  effects: undefined,
  i18n: { en: { name: "Compound Minks Leader" } },
};

registerCards([compoundMinksLeader]);

function createRoddyEngine(restedDon: number) {
  return OnePieceTestEngine.create(
    {
      leaderCardId: compoundMinksLeader,
      hand: [op08Roddy033],
      activeDon: op08Roddy033.cost,
    },
    {
      character: [
        { card: op01Nekomamushi048, rested: true },
        { card: eb01MountainGod018, rested: true },
      ],
      restedDon,
    },
  );
}

describe("OP08-033 Roddy", () => {
  test("with a type including Minks and exactly 7 opposing rested cards, K.O.s cost 2 or less", () => {
    const engine = createRoddyEngine(5);
    const eligibleId = engine.findCardInZone("north", "character", op01Nekomamushi048);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op08Roddy033, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Roddy's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
  });

  test("does not K.O. with only 6 opposing rested cards", () => {
    const engine = createRoddyEngine(4);
    const eligibleId = engine.findCardInZone("north", "character", op01Nekomamushi048);

    engine.playCard(op08Roddy033, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(
      engine.getView("south").players.north.characters.map((card) => card?.instanceId),
    ).toContain(eligibleId);
  });
});
