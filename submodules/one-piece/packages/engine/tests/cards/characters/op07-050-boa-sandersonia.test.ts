import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op07BoaSandersonia050,
  op07GloriosaGrandmaNyon041,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-050 Boa Sandersonia", () => {
  test("counts mixed Amazon Lily and Kuja Pirates Characters before returning an eligible opponent", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07BoaSandersonia050],
        character: [op07GloriosaGrandmaNyon041],
        activeDon: op07BoaSandersonia050.cost,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op07BoaSandersonia050, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Sandersonia's return choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const ownerView = engine.getView("north");
    expect(ownerView.players.north.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(ownerView.players.north.characters.map((card) => card?.instanceId)).toContain(
      expensiveId,
    );
    expect(ownerView.prompts).toHaveLength(0);
  });

  test("does not offer a target with fewer than two matching Characters", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op07BoaSandersonia050], activeDon: op07BoaSandersonia050.cost },
      { character: [eb01Doma005] },
    );
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op07BoaSandersonia050, "south");

    expect(
      engine.getView("south").players.north.characters.map((card) => card?.instanceId),
    ).toContain(opposingId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
