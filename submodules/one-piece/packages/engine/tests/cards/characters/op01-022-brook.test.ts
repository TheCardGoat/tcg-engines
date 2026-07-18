import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01Brook022 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-022 Brook", () => {
  test("with DON!! attached, gives up to two opposing Characters -2000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Brook022, attachedDon: 1, playedOnTurn: 0 }],
      },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const brookId = engine.findCardInZone("south", "character", op01Brook022);
    const firstTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondTargetId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.declareAttack(brookId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Brook's power targets.");
    expect(target.min).toBe(0);
    expect(target.max).toBe(2);
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstTargetId,
      secondTargetId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [firstTargetId, secondTargetId] },
      "south",
    );

    let view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === firstTargetId)?.power,
    ).toBe(1000);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === secondTargetId)?.power,
    ).toBe(3000);

    engine.endTurn("south");

    view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === firstTargetId)?.power,
    ).toBe(3000);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === secondTargetId)?.power,
    ).toBe(5000);
    expect(view.prompts).toHaveLength(0);
  });
});
