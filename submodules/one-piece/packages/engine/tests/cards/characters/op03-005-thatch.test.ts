import { describe, expect, test } from "vite-plus/test";
import { eb01Chambres020, op01TrafalgarLaw002, op03Thatch005 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-005 Thatch", () => {
  test("gains power once per turn, stays in play, then trashes itself at end of turn", () => {
    const engine = OnePieceTestEngine.create({ character: [op03Thatch005] });
    const thatchId = engine.findCardInZone("south", "character", op03Thatch005);

    engine.activateEffect(thatchId, "activateMain", "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === thatchId)?.power).toBe(
      4000,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(thatchId);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: thatchId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    engine.endTurn("south");

    view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === thatchId)).toBe(false);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(thatchId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not follow the physical card after it leaves the Character area", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01TrafalgarLaw002,
      hand: [eb01Chambres020],
      character: [op03Thatch005],
      activeDon: eb01Chambres020.cost,
    });
    const thatchId = engine.findCardInZone("south", "character", op03Thatch005);

    engine.activateEffect(thatchId, "activateMain", "south");
    engine.playCard(eb01Chambres020, "south");
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      thatchId,
    );
    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(thatchId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(thatchId);
    expect(view.prompts).toHaveLength(0);
  });
});
