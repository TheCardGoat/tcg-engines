import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op08Chess005, op08Kuromarimo004 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-005 Chess", () => {
  test("reduces an opponent by 2000, then plays Kuromarimo only while none is on its field", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08Chess005, op08Kuromarimo004],
        activeDon: op08Chess005.cost,
      },
      { character: [eb01Doma005] },
    );
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);
    const kuromarimoId = engine.findCardInZone("south", "hand", op08Kuromarimo004);
    const basePower = eb01Doma005.power ?? 0;

    engine.playCard(op08Chess005, "south");

    const powerTarget = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(powerTarget).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (powerTarget?.kind !== "selectEntity") throw new Error("Expected Chess's power target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Chess's Kuromarimo play.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([kuromarimoId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [kuromarimoId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    let view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingId)?.power,
    ).toBe(basePower - 2000);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(kuromarimoId);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingId)?.power,
    ).toBe(basePower);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not play another Kuromarimo while one is already on its field", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08Chess005, op08Kuromarimo004],
      character: [op08Kuromarimo004],
      activeDon: op08Chess005.cost,
    });
    const retainedId = engine.findCardInZone("south", "hand", op08Kuromarimo004);

    engine.playCard(op08Chess005, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(retainedId);
    expect(
      view.players.south.characters.filter((card) => card?.cardId === op08Kuromarimo004.id),
    ).toHaveLength(1);
    expect(view.prompts).toHaveLength(0);
  });
});
