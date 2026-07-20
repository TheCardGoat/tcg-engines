import {
  eb01Doma005,
  eb03Alvida021,
  op09Cabaji045,
  op09Richie054,
  op12Alvida042,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02DraculeMihawkP081PirateFoil081 } from "../../../../../cards/src/cards/PRB02/characters/081-dracule-mihawk-p-081-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-081 Dracule Mihawk - P-081 (Pirate Foil)", () => {
  test("after returning itself, three other blue Cross Guild Characters enable only a cost-5 Cross Guild play", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02DraculeMihawkP081PirateFoil081, eb03Alvida021, op12Alvida042, op09Richie054],
      hand: [op09Cabaji045, op09Richie054, eb01Doma005],
    });
    const mihawkId = engine.findCardInZone(
      "south",
      "character",
      prb02DraculeMihawkP081PirateFoil081,
    );
    const cabajiId = engine.findCardInZone("south", "hand", op09Cabaji045);
    const wrongCostId = engine.findCardInZone("south", "hand", op09Richie054);
    const wrongTraitId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.activateEffect(mihawkId, "activateMain", "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Mihawk's hand play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([cabajiId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongCostId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      mihawkId,
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [cabajiId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(cabajiId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(mihawkId);
    expect(view.prompts).toHaveLength(0);
  });

  test("checks the three-Character condition after paying the self-return cost", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02DraculeMihawkP081PirateFoil081, eb03Alvida021, op09Richie054],
      hand: [op09Cabaji045],
    });
    const mihawkId = engine.findCardInZone(
      "south",
      "character",
      prb02DraculeMihawkP081PirateFoil081,
    );
    const cabajiId = engine.findCardInZone("south", "hand", op09Cabaji045);

    engine.activateEffect(mihawkId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([mihawkId, cabajiId]),
    );
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(mihawkId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning itself or playing a hand card", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02DraculeMihawkP081PirateFoil081, eb03Alvida021, op12Alvida042, op09Richie054],
      hand: [op09Cabaji045],
    });
    const mihawkId = engine.findCardInZone(
      "south",
      "character",
      prb02DraculeMihawkP081PirateFoil081,
    );
    const cabajiId = engine.findCardInZone("south", "hand", op09Cabaji045);

    engine.activateEffect(mihawkId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(mihawkId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(cabajiId);
    expect(view.prompts).toHaveLength(0);
  });
});
