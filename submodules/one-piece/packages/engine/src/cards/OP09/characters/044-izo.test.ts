import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03Otama012,
  op09Crocodile046,
  op09Izo044,
  op13Vista046,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-044 Izo", () => {
  test("search accepts either a Land of Wano card or a card including Whitebeard Pirates", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op09Izo044, playedOnTurn: 0 }],
        hand: [op13Vista046],
        deck: [
          eb03Otama012,
          eb01Doma005,
          eb01MountainGod018,
          eb01Fourtricks025,
          op09Crocodile046,
          op13Vista046,
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const izoId = engine.findCardInZone("south", "character", op09Izo044);
    const wanoId = engine.findCardInZone("south", "deck", eb03Otama012);
    const includedWhitebeardId = engine.findCardInZone("south", "deck", eb01Doma005);
    const ineligibleId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const untouchedId = engine.findCardInZone("south", "deck", op13Vista046);
    const discardId = engine.findCardInZone("south", "hand", op13Vista046);

    expect(engine.getView("south").prompts).toHaveLength(0);
    engine.declareAttack(izoId, engine.leader("north"), "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Izo's search selection.");
    expect(search.candidates.find((candidate) => candidate.ref.id === wanoId)?.legal).toBe(true);
    expect(
      search.candidates.find((candidate) => candidate.ref.id === includedWhitebeardId)?.legal,
    ).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === ineligibleId)?.legal).toBe(
      false,
    );
    engine.resolveDecision(
      "effectSearchSelection",
      { selectedIds: [includedWhitebeardId] },
      "south",
    );

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Izo's remainder order.");
    const submittedOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    expect(submittedOrder).toEqual(expect.arrayContaining([wanoId, ineligibleId]));
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: submittedOrder }, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Izo's hand-trash selection.");
    expect(trash).toMatchObject({ min: 1, max: 1 });
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toContain(includedWhitebeardId);
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toContain(discardId);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(includedWhitebeardId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...submittedOrder]);
    expect(view.prompts).toHaveLength(0);
  });
});
