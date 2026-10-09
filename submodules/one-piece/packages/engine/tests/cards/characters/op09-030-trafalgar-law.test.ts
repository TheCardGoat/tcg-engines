import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op09TonyTonyChopper029, op09TrafalgarLaw030 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-030 Trafalgar Law", () => {
  test("returns a Character as payment, clears its DON!!, then plays a different eligible ODYSSEY Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09TrafalgarLaw030, op09TrafalgarLaw030, op09TonyTonyChopper029, eb01Doma005],
      character: [{ card: eb01Doma005, attachedDon: 2 }],
      activeDon: op09TrafalgarLaw030.cost,
    });
    const paymentId = engine.findCardInZone("south", "character", eb01Doma005);
    const chopperId = engine.findCardInZone("south", "hand", op09TonyTonyChopper029);
    const otherLawId = engine.findCardInZone("south", "hand", op09TrafalgarLaw030);

    engine.playCard(op09TrafalgarLaw030, "south");
    const playedLawId = engine.findCardInZone("south", "character", op09TrafalgarLaw030);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnCharacter", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    if (cost?.kind !== "payCost") throw new Error("Expected Law's return payment.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([paymentId, playedLawId]),
    );
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [paymentId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Law's hand play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([chopperId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(otherLawId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [chopperId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 5 });
    expect(view.players.south.characters.some((card) => card?.instanceId === chopperId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning or playing a Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09TrafalgarLaw030, op09TonyTonyChopper029],
      character: [eb01Doma005],
      activeDon: op09TrafalgarLaw030.cost,
    });
    const paymentId = engine.findCardInZone("south", "character", eb01Doma005);
    const candidateId = engine.findCardInZone("south", "hand", op09TonyTonyChopper029);

    engine.playCard(op09TrafalgarLaw030, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === paymentId)).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(candidateId);
    expect(view.prompts).toHaveLength(0);
  });
  test("FAQ: returns this Law itself and still plays another eligible Odyssey Character", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP09-030", "OP09-029"], activeDon: 3 });
    const law = e.findCardInZone("south", "hand", "OP09-030");
    const chopper = e.findCardInZone("south", "hand", "OP09-029");
    e.asSouth().play("OP09-030");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(law);
    const play = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw Error("play");
    expect(play.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([chopper]);
    e.asSouth().choosePlay(chopper);
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === chopper)).toBe(
      true,
    );
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === law)).toBe(
      false,
    );
  });
});
