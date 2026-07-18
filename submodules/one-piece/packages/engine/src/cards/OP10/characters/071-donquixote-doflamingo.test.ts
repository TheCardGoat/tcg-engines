import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import { eb01Doma005, op10DonquixoteDoflamingo071 } from "@tcg/op-cards";

import { registerCards } from "../../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../index.ts";

const compoundDonquixote: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP10-071-DONQUIXOTE",
  canonicalId: "TEST-OP10-071-DONQUIXOTE",
  name: "Donquixote Compound Trait Test",
  cost: 5,
  traits: ["Donquixote Pirates Navy"],
};
registerCards([compoundDonquixote]);

describe("OP10-071 Donquixote Doflamingo", () => {
  test("may return DON!! to play an included Donquixote cost-5 Character from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10DonquixoteDoflamingo071, compoundDonquixote, compoundDonquixote, eb01Doma005],
      activeDon: 9,
    });
    const targetId = engine.findCardInZone("south", "hand", compoundDonquixote);
    const ineligibleId = engine.findCardInZone("south", "hand", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op10DonquixoteDoflamingo071, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    if (payment?.kind !== "payCost") throw new Error("Expected Doflamingo's DON!! cost.");
    const activeDon = payment.candidates.find((candidate) =>
      candidate.ref.id.startsWith("active-don:"),
    );
    expect(activeDon).toBeDefined();
    engine.resolveDecision("effectCostReturnDon", { selectedIds: [activeDon!.ref.id] }, "south");
    const target = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Doflamingo's play choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("once per turn may rest 1 DON!! on an opponent attack to add 1 active DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10DonquixoteDoflamingo071], activeDon: 1, donDeckCount: 1 },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackers = engine
      .getView("north")
      .players.north.characters.filter((card) => card?.cardId === eb01Doma005.id)
      .map((card) => card!.instanceId);

    engine.declareAttack(attackers[0]!, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 1,
      restedDon: 1,
      donDeckCount: 0,
    });

    engine.declareAttack(attackers[1]!, engine.leader("south"), "north");
    expect(
      engine.getView("south").prompts.some((prompt) => prompt.label.includes("optional effect")),
    ).toBe(false);
  });
});
