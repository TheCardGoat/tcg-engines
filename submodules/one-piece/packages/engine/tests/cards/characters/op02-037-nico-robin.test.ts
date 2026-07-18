import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op01Nami016,
  op02NicoRobin037,
  op13Gordon024,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-037 Nico Robin", () => {
  test("plays a cost-2-or-less FILM or Straw Hat Crew Character from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02NicoRobin037, op13Gordon024, op01Nami016, eb01Doma005, eb01Fourtricks025],
      activeDon: op02NicoRobin037.cost,
    });
    const filmId = engine.findCardInZone("south", "hand", op13Gordon024);
    const strawHatId = engine.findCardInZone("south", "hand", op01Nami016);
    const unrelatedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const wrongCostId = engine.findCardInZone("south", "hand", eb01Fourtricks025);

    engine.playCard(op02NicoRobin037, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Nico Robin's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(filmId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(strawHatId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongCostId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [filmId] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === filmId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
