import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb02Gaimon012, eb02Sarfunkel014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-014 Sarfunkel", () => {
  test("maps and plays only Gaimon from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb02Sarfunkel014, eb02Gaimon012, eb01Doma005],
      activeDon: 2,
    });
    const gaimonId = engine.findCardInZone("south", "hand", eb02Gaimon012);
    const excludedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(eb02Sarfunkel014, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Sarfunkel's Gaimon choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([gaimonId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [gaimonId] }, "south");

    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toEqual(expect.arrayContaining([gaimonId]));
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
