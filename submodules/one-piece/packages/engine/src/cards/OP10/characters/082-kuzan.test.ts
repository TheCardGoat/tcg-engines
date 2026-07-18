import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op02Sakazuki099,
  op09AvaloPizarro082,
  op09MarshallDTeach093,
  op09Peachbeard094,
  op10Kuzan082,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-082 Kuzan", () => {
  test("is excluded from an opponent effect's field-removal candidates", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02Sakazuki099, eb01Doma005], activeDon: op02Sakazuki099.cost },
      { character: [op10Kuzan082, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kuzanId = engine.findCardInZone("north", "character", op10Kuzan082);
    const otherId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op02Sakazuki099, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Sakazuki's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([otherId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(kuzanId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [otherId] }, "south");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(kuzanId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(otherId);
    expect(view.prompts).toHaveLength(0);
  });

  test("trashes itself, draws, then plays an included cost-5 Blackbeard Character from trash", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10Kuzan082],
      deck: [eb01Fourtricks025, eb01Doma005],
      trash: [op09Peachbeard094, op09AvaloPizarro082, op09MarshallDTeach093, eb01Doma005],
    });
    const kuzanId = engine.findCardInZone("south", "character", op10Kuzan082);
    const compoundTraitId = engine.findCardInZone("south", "trash", op09Peachbeard094);
    const exactTraitId = engine.findCardInZone("south", "trash", op09AvaloPizarro082);
    const tooExpensiveId = engine.findCardInZone("south", "trash", op09MarshallDTeach093);
    const wrongTraitId = engine.findCardInZone("south", "trash", eb01Doma005);
    const drawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.activateEffect(kuzanId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Kuzan's trash play.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([
      compoundTraitId,
      exactTraitId,
    ]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toEqual(
      expect.arrayContaining([kuzanId, tooExpensiveId, wrongTraitId]),
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [compoundTraitId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(kuzanId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(
      compoundTraitId,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
