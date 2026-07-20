import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Crocodile062,
  op01MsAllSunday079,
  op09Mr1DazBonez055,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04MissValentineMikitaDashPack087 } from "../../../../../cards/src/cards/OP14EB04/characters/087-miss-valentine-mikita-dash-pack.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-087 Miss.Valentine(Mikita)", () => {
  test("with an included Baroque Works Leader reveals an eligible physical card and trashes the other looked cards", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01Crocodile062,
      hand: [op14eb04MissValentineMikitaDashPack087],
      deck: [
        op09Mr1DazBonez055,
        op01MsAllSunday079,
        op14eb04MissValentineMikitaDashPack087,
        eb01Doma005,
        eb01MountainGod018,
      ],
      activeDon: op14eb04MissValentineMikitaDashPack087.cost,
    });
    const includedTraitId = engine.findCardInZone("south", "deck", op09Mr1DazBonez055);
    const exactTraitId = engine.findCardInZone("south", "deck", op01MsAllSunday079);
    const excludedNameId = engine.findCardInZone(
      "south",
      "deck",
      op14eb04MissValentineMikitaDashPack087,
    );
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op14eb04MissValentineMikitaDashPack087, "south");
    const decision = engine.pendingDecision("effectSearchSelection", "south");
    expect(decision.actorId).toBe("south");
    const search = decision.steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Mikita's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === includedTraitId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === exactTraitId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedNameId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [includedTraitId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(includedTraitId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([exactTraitId, excludedNameId, wrongTraitId]),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may reveal no card and trashes all four looked physical cards", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01Crocodile062,
      hand: [op14eb04MissValentineMikitaDashPack087],
      deck: [
        op09Mr1DazBonez055,
        op01MsAllSunday079,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
      ],
      activeDon: op14eb04MissValentineMikitaDashPack087.cost,
    });
    const lookedIds = [
      engine.findCardInZone("south", "deck", op09Mr1DazBonez055),
      engine.findCardInZone("south", "deck", op01MsAllSunday079),
      engine.findCardInZone("south", "deck", eb01Doma005),
      engine.findCardInZone("south", "deck", eb01Fourtricks025),
    ];

    engine.playCard(op14eb04MissValentineMikitaDashPack087, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.handCount).toBe(0);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(lookedIds),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("a Leader without Baroque Works does not look at or move the deck", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04MissValentineMikitaDashPack087],
      deck: [op09Mr1DazBonez055, op01MsAllSunday079, eb01Doma005, eb01Fourtricks025],
      activeDon: op14eb04MissValentineMikitaDashPack087.cost,
    });
    const deckCountBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op14eb04MissValentineMikitaDashPack087, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckCountBefore);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
