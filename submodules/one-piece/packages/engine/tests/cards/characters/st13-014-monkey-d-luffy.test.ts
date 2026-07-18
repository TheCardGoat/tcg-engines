import { describe, expect, test } from "vite-plus/test";
import { op09MonkeyDLuffy036, prb02MonkeyDLuffySt13014PirateFoil014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST13-014 Monkey.D.Luffy", () => {
  test("trashes itself, plays a physical cost-5 Luffy from top Life, and boosts its Leader", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02MonkeyDLuffySt13014PirateFoil014],
      life: [op09MonkeyDLuffy036],
    });
    const sourceId = engine.findCardInZone(
      "south",
      "character",
      prb02MonkeyDLuffySt13014PirateFoil014,
    );
    const lifeId = engine.findCardInZone("south", "life", op09MonkeyDLuffy036);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectRevealFromLifePlay", "south").steps[0];
    if (play?.kind !== "confirm") throw new Error("Expected Luffy's revealed-Life choice.");
    expect(play.options.map((option) => option.id)).toEqual(["play", "keep"]);
    engine.resolveDecision("effectRevealFromLifePlay", { optionId: "play" }, "south");
    const leader = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (leader?.kind !== "selectEntity") throw new Error("Expected Luffy's Leader boost choice.");
    expect(leader.candidates.map((candidate) => candidate.ref.id)).toContain(
      engine.leader("south"),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(lifeId);
    expect(view.players.south.lifeCount).toBe(0);
    expect(view.players.south.leader.power).toBe(7000);

    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(7000);
    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.prompts).toHaveLength(0);
  });
});
