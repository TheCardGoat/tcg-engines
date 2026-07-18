import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op09Sabo027, prb02SaboSt13007PirateFoil007 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST13-007 Sabo", () => {
  test("trashes itself to play a revealed cost-5 Sabo from Life and powers its Leader through the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02SaboSt13007PirateFoil007],
      life: [op09Sabo027, eb01Doma005],
    });
    const sourceId = engine.findCardInZone("south", "character", prb02SaboSt13007PirateFoil007);
    const lifeSaboId = engine.findCardInZone("south", "life", op09Sabo027);
    const leaderId = engine.leader("south");

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const play = engine.pendingDecision("effectRevealFromLifePlay", "south").steps[0];
    expect(play?.kind).toBe("confirm");
    if (play?.kind !== "confirm") throw new Error("Expected Sabo's revealed-Life play choice.");
    expect(play.options.map((option) => option.id)).toEqual(["play", "keep"]);
    engine.resolveDecision("effectRevealFromLifePlay", { optionId: "play" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Sabo's Leader power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([leaderId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.players.south.characters.some((card) => card?.instanceId === lifeSaboId)).toBe(
      true,
    );
    expect(view.players.south.leader.power).toBe(7000);

    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(7000);
    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.prompts).toHaveLength(0);
  });
});
