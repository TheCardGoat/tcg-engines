import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01EustassCaptainKid051,
  op08Kaido079,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-079 Kaido", () => {
  test("pays its hand cost, trashes a cost-7-or-less Character when newly played, then makes the opponent discard", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08Kaido079, eb01Doma005],
        activeDon: op08Kaido079.cost,
      },
      {
        hand: [eb01Fourtricks025, eb01MountainGod018],
        character: [eb01MountainGod018, op01EustassCaptainKid051],
      },
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const expensiveId = engine.findCardInZone("north", "character", op01EustassCaptainKid051);

    engine.playCard(op08Kaido079, "south");
    const kaidoId = engine.findCardInZone("south", "character", op08Kaido079);
    engine.activateEffect(kaidoId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Kaido's trash target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const discard = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(discard).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    if (discard?.kind !== "selectEntity") throw new Error("Expected Kaido's opponent discard.");
    const discardedId = discard.candidates[0]!.ref.id;
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eligibleId, discardedId]),
    );
    expect(view.players.north.characters.some((card) => card?.instanceId === expensiveId)).toBe(
      true,
    );
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: kaidoId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
    expect(view.prompts).toHaveLength(0);
  });

  test("can pay while not newly played and still makes the opponent discard", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op08Kaido079, playedOnTurn: 0 }],
        hand: [eb01Doma005],
      },
      { hand: [eb01Fourtricks025] },
    );
    const kaidoId = engine.findCardInZone("south", "character", op08Kaido079);
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const opponentCardId = engine.findCardInZone("north", "hand", eb01Fourtricks025);

    engine.activateEffect(kaidoId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(opponentCardId);
    expect(view.prompts).toHaveLength(0);
  });
});
