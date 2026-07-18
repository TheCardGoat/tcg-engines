import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op07DonquixoteDoflamingo048,
  op07EdwardWeevil039,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-048 Donquixote Doflamingo", () => {
  test("rests 2 DON!! to reveal and optionally play the eligible top card rested once per turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op07DonquixoteDoflamingo048],
      deck: [op07EdwardWeevil039, eb01Doma005],
      activeDon: 2,
    });
    const doflamingoId = engine.findCardInZone("south", "character", op07DonquixoteDoflamingo048);
    const revealedId = engine.findCardInZone("south", "deck", op07EdwardWeevil039);

    engine.activateEffect(doflamingoId, "activateMain", "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Doflamingo's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([revealedId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [revealedId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === revealedId),
    ).toMatchObject({ rested: true });
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(
      engine.getView("north").logs.some((entry) => entry.message.includes("reveals Edward Weevil")),
    ).toBe(true);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: doflamingoId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("places an ineligible revealed top card at the bottom of the deck", () => {
    const engine = OnePieceTestEngine.create({
      character: [op07DonquixoteDoflamingo048],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: 2,
    });
    const doflamingoId = engine.findCardInZone("south", "character", op07DonquixoteDoflamingo048);
    const revealedId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.activateEffect(doflamingoId, "activateMain", "south");

    expect(engine.getState().players.south.deck.at(-1)).toBe(revealedId);
    expect(
      engine.getView("north").logs.some((entry) => entry.message.includes("reveals Doma")),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
