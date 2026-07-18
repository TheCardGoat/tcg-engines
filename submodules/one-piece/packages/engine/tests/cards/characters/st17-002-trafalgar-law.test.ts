import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01DonquixoteDoflamingo060,
  prb02TrafalgarLawSt17002Reprint002,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST17-002 Trafalgar Law", () => {
  test("returns one of its Characters as cost before a composite Warlords Leader may return either player's cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01DonquixoteDoflamingo060,
        hand: [prb02TrafalgarLawSt17002Reprint002],
        character: [eb01Doma005],
        activeDon: prb02TrafalgarLawSt17002Reprint002.cost,
      },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
    );
    const paymentId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingEligibleId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const opposingExpensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(prb02TrafalgarLawSt17002Reprint002, "south");
    const lawId = engine.findCardInZone("south", "character", prb02TrafalgarLawSt17002Reprint002);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnCharacter", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    if (cost?.kind !== "payCost") throw new Error("Expected Law's return payment.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([paymentId, lawId]),
    );
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [paymentId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Law's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([lawId, opposingEligibleId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      opposingExpensiveId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingEligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(paymentId);
    expect(engine.getState().players.north.hand).toContain(opposingEligibleId);
    expect(
      view.players.north.characters.some((card) => card?.instanceId === opposingExpensiveId),
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
