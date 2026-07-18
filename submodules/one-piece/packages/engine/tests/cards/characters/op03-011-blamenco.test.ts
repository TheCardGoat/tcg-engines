import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op03Blamenco011 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-011 Blamenco", () => {
  test("with DON!! attached, reduces an opposing Character until turn end", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op03Blamenco011, playedOnTurn: 0, attachedDon: 1 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const blamencoId = engine.findCardInZone("south", "character", op03Blamenco011);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(blamencoId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Blamenco's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      1000,
    );
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      3000,
    );
  });

  test("without DON!! attached, does not publish a power target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op03Blamenco011, playedOnTurn: 0 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const blamencoId = engine.findCardInZone("south", "character", op03Blamenco011);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(blamencoId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      3000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
