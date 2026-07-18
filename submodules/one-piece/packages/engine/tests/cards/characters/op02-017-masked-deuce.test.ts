import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02Magura016, op02MaskedDeuce017 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-017 Masked Deuce", () => {
  test("with DON!! x2, K.O.s only an opposing Character at the 2000-power boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op02MaskedDeuce017, playedOnTurn: 0 }],
        activeDon: 2,
      },
      {
        character: [op02Magura016, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const deuceId = engine.findCardInZone("south", "character", op02MaskedDeuce017);
    const eligibleId = engine.findCardInZone("north", "character", op02Magura016);
    const ineligibleId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.attachDon(deuceId, 2, "south");
    engine.declareAttack(deuceId, engine.leader("north"), "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Masked Deuce's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === ineligibleId)).toBe(
      true,
    );
  });

  test("without DON!! x2, attacking does not offer the K.O. effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op02MaskedDeuce017, playedOnTurn: 0 }],
      },
      {
        character: [op02Magura016],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const deuceId = engine.findCardInZone("south", "character", op02MaskedDeuce017);
    const targetId = engine.findCardInZone("north", "character", op02Magura016);

    engine.declareAttack(deuceId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
