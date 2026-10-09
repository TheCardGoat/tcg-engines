import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

describe("mandatory affected-card replacement priority", () => {
  test("Luffy's compulsory first effect-KO replacement precedes Rosinante, whose choice remains for the next KO", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP04-038", "OP04-038"], activeDon: 10 },
      { character: [{ cardId: "OP10-118", rested: true }, "OP05-030"] },
    );
    const luffyId = engine.findCardInZone("north", "character", "OP10-118");
    const rosinanteId = engine.findCardInZone("north", "character", "OP05-030");
    const attemptKo = () => {
      engine.playCard("OP04-038", "south");
      engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
      engine.resolveDecision("effectTargetSelection", { selectedIds: [luffyId] }, "south");
    };
    attemptKo();
    let view = engine.getView("north");
    expect(view.prompts).toHaveLength(0);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toEqual(
      expect.arrayContaining([luffyId, rosinanteId]),
    );
    expect(view.players.north.trash).toHaveLength(0);

    attemptKo();
    engine.pendingDecision("effectKoReplacement", "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(luffyId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(rosinanteId);
    expect(view.prompts).toHaveLength(0);
  });
});
