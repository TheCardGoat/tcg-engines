import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Urouge002 } from "../../../../../cards/src/cards/OP14EB04/characters/002-urouge.ts";
import { op14eb04BasilHawkins010 } from "../../../../../cards/src/cards/OP14EB04/characters/010-basil-hawkins.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-010 Basil Hawkins", () => {
  test("after battle K.O. plays an included Supernovas power-2000 Character and bottom-orders the rest", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04BasilHawkins010, rested: true, playedOnTurn: 0 }],
        deck: [
          op14eb04Urouge002,
          op14eb04BasilHawkins010,
          eb01Doma005,
          eb01MountainGod018,
          eb01Doma005,
          eb01Fourtricks025,
        ],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hawkinsId = engine.findCardInZone("south", "character", op14eb04BasilHawkins010);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("south", "deck", op14eb04Urouge002);
    const excludedNameId = engine.findCardInZone("south", "deck", op14eb04BasilHawkins010);
    const wrongPowerId = engine.findCardInZone("south", "deck", eb01Doma005);
    const untouchedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.declareAttack(attackerId, hawkinsId, "north");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Hawkins's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedNameId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongPowerId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Hawkins's remainder order.");
    const submittedOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: submittedOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(hawkinsId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...submittedOrder]);
    expect(view.prompts).toHaveLength(0);
  });
});
