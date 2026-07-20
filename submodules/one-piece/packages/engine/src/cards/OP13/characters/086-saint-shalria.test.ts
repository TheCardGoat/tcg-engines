import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op13SaintCharlos087,
  op13StShepherdJuPeter084,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13SaintShalria086 } from "../../../../../cards/src/cards/OP13/characters/086-saint-shalria.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-086 Saint Shalria", () => {
  test("searches an included Celestial Dragons card, trashes the rest, then trashes the selected hand card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13SaintShalria086, eb01Doma005],
      deck: [op13StShepherdJuPeter084, op13SaintShalria086, eb01Fourtricks025, eb01MountainGod018],
      activeDon: op13SaintShalria086.cost,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op13StShepherdJuPeter084);
    const excludedNameId = engine.findCardInZone("south", "deck", op13SaintShalria086);
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op13SaintShalria086, "south");
    const decision = engine.pendingDecision("effectSearchSelection", "south");
    expect(decision.actorId).toBe("south");
    const search = decision.steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Shalria's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedNameId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Shalria's hand-trash choice.");
    expect(trash).toMatchObject({ min: 1, max: 1 });
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([eligibleId, discardedId]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([excludedNameId, wrongTraitId, discardedId]),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may reveal no card but still trashes all looked cards and one card from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13SaintShalria086, eb01Doma005],
      deck: [op13StShepherdJuPeter084, op13SaintCharlos087, eb01Fourtricks025, eb01MountainGod018],
      activeDon: op13SaintShalria086.cost,
    });
    const lookedIds = [
      engine.findCardInZone("south", "deck", op13StShepherdJuPeter084),
      engine.findCardInZone("south", "deck", op13SaintCharlos087),
      engine.findCardInZone("south", "deck", eb01Fourtricks025),
    ];
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op13SaintShalria086, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([...lookedIds, discardedId]),
    );
    expect(view.players.south).toMatchObject({ handCount: 0, deckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
