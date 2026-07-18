import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op12PortgasDAceSp011,
  prb02PortgasDAceSt13010PirateFoil010,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST13-010 Portgas.D.Ace", () => {
  test("trashes itself to play a revealed cost-5 Ace from Life and powers its Leader through the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02PortgasDAceSt13010PirateFoil010],
      life: [op12PortgasDAceSp011, eb01Doma005],
    });
    const sourceId = engine.findCardInZone(
      "south",
      "character",
      prb02PortgasDAceSt13010PirateFoil010,
    );
    const lifeAceId = engine.findCardInZone("south", "life", op12PortgasDAceSp011);
    const leaderId = engine.leader("south");

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectRevealFromLifePlay", { optionId: "play" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Ace's Leader power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([leaderId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.players.south.characters.some((card) => card?.instanceId === lifeAceId)).toBe(true);
    expect(view.players.south.leader.power).toBe(7000);

    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(7000);
    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.prompts).toHaveLength(0);
  });
});
