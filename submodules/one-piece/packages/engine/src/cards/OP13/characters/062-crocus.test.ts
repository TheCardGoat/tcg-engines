import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Crocus062 } from "../../../../../cards/src/cards/OP13/characters/062-crocus.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-062 Crocus", () => {
  test("with a given DON!! may add one active DON!! on play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Crocus062],
      character: [{ card: eb01Doma005, attachedDon: 1 }],
      activeDon: op13Crocus062.cost,
    });

    engine.playCard(op13Crocus062, "south");
    const choice = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(choice).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.south.restedDon).toBe(5);
    expect(view.prompts).toHaveLength(0);
  });

  test("without a given DON!! skips the on-play DON!! action", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Crocus062],
      activeDon: op13Crocus062.cost,
    });

    engine.playCard(op13Crocus062, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(op13Crocus062.cost);
    expect(view.prompts).toHaveLength(0);
  });

  test("when attacking returns an opponent's base-3000 Character despite attached DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op13Crocus062, playedOnTurn: 0 }] },
      {
        character: [{ card: eb01Doma005, attachedDon: 1 }, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const crocusId = engine.findCardInZone("south", "character", op13Crocus062);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const ineligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(crocusId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Crocus's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const northView = engine.getView("north");
    expect(northView.players.north.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(northView.players.north.characters.map((card) => card?.instanceId)).toContain(
      ineligibleId,
    );
  });
});
