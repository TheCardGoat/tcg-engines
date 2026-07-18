import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02BoaHancock059,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-059 Boa Hancock", () => {
  test("draws 1, trashes exactly 1, then may trash up to 3 more cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        character: [{ card: op02BoaHancock059, playedOnTurn: 0 }],
        deck: [eb01Doma005],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const boaId = engine.findCardInZone("south", "character", op02BoaHancock059);
    const mandatoryId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const firstOptionalId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondOptionalId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.declareAttack(boaId, engine.leader("north"), "south");

    const mandatory = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(mandatory?.kind).toBe("selectEntity");
    if (mandatory?.kind !== "selectEntity") throw new Error("Expected Boa's mandatory trash.");
    expect(mandatory).toMatchObject({ min: 1, max: 1 });
    expect(mandatory.candidates.map((candidate) => candidate.ref.id)).toContain(drawnId);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [mandatoryId] }, "south");

    const optional = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(optional?.kind).toBe("selectEntity");
    if (optional?.kind !== "selectEntity") throw new Error("Expected Boa's optional trash.");
    expect(optional).toMatchObject({ min: 0, max: 3 });
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [firstOptionalId, secondOptionalId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([drawnId]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([mandatoryId, firstOptionalId, secondOptionalId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose zero cards for the final up-to-3 trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005],
        character: [{ card: op02BoaHancock059, playedOnTurn: 0 }],
        deck: [eb01Fourtricks025],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const boaId = engine.findCardInZone("south", "character", op02BoaHancock059);
    const mandatoryId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.declareAttack(boaId, engine.leader("north"), "south");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [mandatoryId] }, "south");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([drawnId]);
    expect(view.prompts).toHaveLength(0);
  });
});
