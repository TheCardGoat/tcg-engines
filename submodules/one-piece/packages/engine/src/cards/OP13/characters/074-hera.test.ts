import { describe, expect, test } from "vite-plus/test";
import { op04Rabiyan113 } from "../../../../../cards/src/cards/OP04/characters/113-rabiyan.ts";
import { op04Randolph114 } from "../../../../../cards/src/cards/OP04/characters/114-randolph.ts";
import { op05Koala006 } from "../../../../../cards/src/cards/OP05/characters/006-koala.ts";
import { op13Hera074 } from "../../../../../cards/src/cards/OP13/characters/074-hera.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-074 Hera", () => {
  test("on play optionally plays only a 3000-power-or-less included Homies Character from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Hera074, op04Rabiyan113, op04Randolph114, op05Koala006],
      activeDon: op13Hera074.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op04Rabiyan113);
    const tooPowerfulId = engine.findCardInZone("south", "hand", op04Randolph114);
    const wrongTraitId = engine.findCardInZone("south", "hand", op05Koala006);

    engine.playCard(op13Hera074, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Hera's hand-play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    const candidates = play.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(eligibleId);
    expect(candidates).not.toContain(tooPowerfulId);
    expect(candidates).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline to play a Homies Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Hera074, op04Rabiyan113],
      activeDon: op13Hera074.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op04Rabiyan113);

    engine.playCard(op13Hera074, "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });
});
