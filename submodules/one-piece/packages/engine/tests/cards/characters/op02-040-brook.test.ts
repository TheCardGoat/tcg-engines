import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op01Nami016,
  op02Brook040,
  op13Gordon024,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-040 Brook", () => {
  test("plays a cost-3-or-less FILM or Straw Hat Crew Character from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02Brook040, op13Gordon024, op01Nami016, eb01Doma005, eb01Fourtricks025],
      activeDon: op02Brook040.cost,
    });
    const filmId = engine.findCardInZone("south", "hand", op13Gordon024);
    const strawHatId = engine.findCardInZone("south", "hand", op01Nami016);
    const unrelatedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const wrongCostId = engine.findCardInZone("south", "hand", eb01Fourtricks025);

    engine.playCard(op02Brook040, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Brook's play choice.");
    const candidateIds = play.candidates.map((candidate) => candidate.ref.id);
    expect(candidateIds).toContain(filmId);
    expect(candidateIds).toContain(strawHatId);
    expect(candidateIds).not.toContain(unrelatedId);
    expect(candidateIds).not.toContain(wrongCostId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [filmId] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === filmId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
