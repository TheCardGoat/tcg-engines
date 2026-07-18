import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04Cavendish081,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-081 Cavendish", () => {
  test("with DON!! attached, rests its Leader and mills two even when choosing no K.O. target", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op04Cavendish081, attachedDon: 1, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    expect(op04Cavendish081.traits).toEqual(["Beautiful Pirates", "Dressrosa"]);
    const cavendishId = engine.findCardInZone("south", "character", op04Cavendish081);
    const activeTargetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lowCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const milledIds = engine.getState().players.south.deck.slice(0, 2);

    engine.declareAttack(cavendishId, activeTargetId, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Cavendish's K.O. choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(lowCostId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeTargetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.rested).toBe(true);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(milledIds),
    );
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(lowCostId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("cannot attack an active Character without DON!! and may decline without paying or milling", () => {
    const noDon = OnePieceTestEngine.create(
      { character: [{ card: op04Cavendish081, playedOnTurn: 0 }] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const noDonId = noDon.findCardInZone("south", "character", op04Cavendish081);
    const activeTargetId = noDon.findCardInZone("north", "character", eb01MountainGod018);
    expect(
      noDon.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: noDonId,
        targetId: activeTargetId,
      }).accepted,
    ).toBe(false);

    const declined = OnePieceTestEngine.create(
      {
        character: [{ card: op04Cavendish081, attachedDon: 1, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Fourtricks025],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const cavendishId = declined.findCardInZone("south", "character", op04Cavendish081);
    const deckBefore = [...declined.getState().players.south.deck];
    declined.declareAttack(cavendishId, declined.leader("north"), "south");
    declined.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(declined.getView("south").players.south.leader.rested).toBe(false);
    expect(declined.getState().players.south.deck).toEqual(deckBefore);
    expect(declined.getView("south").prompts).toHaveLength(0);
  });
});
