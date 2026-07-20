import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01RoronoaZoro001,
  op13Sabo004,
} from "@tcg/op-cards";
import { op13Koala081 } from "../../../../../cards/src/cards/OP13/characters/081-koala.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-081 Koala", () => {
  test("gains three cost only with an included Revolutionary Army Leader trait", () => {
    const matching = OnePieceTestEngine.create({
      leaderCardId: op13Sabo004,
      character: [op13Koala081],
    });
    const matchingId = matching.findCardInZone("south", "character", op13Koala081);
    expect(
      matching
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === matchingId)?.cost,
    ).toBe(op13Koala081.cost + 3);

    const nonmatching = OnePieceTestEngine.create({
      leaderCardId: op01RoronoaZoro001,
      character: [op13Koala081],
    });
    const nonmatchingId = nonmatching.findCardInZone("south", "character", op13Koala081);
    expect(
      nonmatching
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === nonmatchingId)?.cost,
    ).toBe(op13Koala081.cost);
  });

  test("bottom-decks the selected trash card, gives rested DON!! to an own card, and is once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op13Koala081, eb01Doma005],
        trash: [eb01Fourtricks025, eb01MountainGod018],
        deck: [eb01Doma005],
        restedDon: 2,
      },
      { character: [eb01Doma005] },
    );
    const koalaId = engine.findCardInZone("south", "character", op13Koala081);
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);
    const paymentId = engine.findCardInZone("south", "trash", eb01Fourtricks025);
    const unspentId = engine.findCardInZone("south", "trash", eb01MountainGod018);

    engine.activateEffect(koalaId, "activateMain", "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Koala's trash payment.");
    expect(cost).toMatchObject({ min: 1, max: 1, ordered: true });
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([paymentId, unspentId]),
    );
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: [paymentId] }, "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected Koala's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Koala's DON!! recipient.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), koalaId, recipientId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(opposingId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    const view = engine.getView("south");
    expect(engine.getState().players.south.deck.at(-1)).toBe(paymentId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(unspentId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(paymentId);
    expect(view.players.south.restedDon).toBe(1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(1);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: koalaId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without moving trash or DON!!", () => {
    const engine = OnePieceTestEngine.create({
      character: [op13Koala081],
      trash: [eb01Fourtricks025],
      restedDon: 1,
    });
    const koalaId = engine.findCardInZone("south", "character", op13Koala081);
    const trashId = engine.findCardInZone("south", "trash", eb01Fourtricks025);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(koalaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(trashId);
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: donDeckBefore });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === koalaId)?.attachedDon,
    ).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });
});
