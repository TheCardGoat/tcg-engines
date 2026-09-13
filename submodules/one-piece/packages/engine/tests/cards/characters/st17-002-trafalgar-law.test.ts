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

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01DonquixoteDoflamingo060,
        hand: [prb02TrafalgarLawSt17002Reprint002],
        character: [eb01Doma005],
        activeDon: prb02TrafalgarLawSt17002Reprint002.cost,
      },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
    );
    engine.playCard(prb02TrafalgarLawSt17002Reprint002, "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
