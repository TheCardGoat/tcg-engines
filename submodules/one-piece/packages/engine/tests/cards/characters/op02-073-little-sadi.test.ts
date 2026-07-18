import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02LittleSadi073, op02Minotaur087 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-073 Little Sadi", () => {
  test("plays a compound Jailer Beast Character from hand and excludes nonmatching cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02LittleSadi073, op02Minotaur087, eb01Doma005],
      activeDon: op02LittleSadi073.cost,
    });
    const minotaurus = engine.findCardInZone("south", "hand", op02Minotaur087);
    const doma = engine.findCardInZone("south", "hand", eb01Doma005);
    engine.playCard(op02LittleSadi073, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Jailer Beast selection.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(minotaurus);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(doma);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [minotaurus] }, "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === minotaurus),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
