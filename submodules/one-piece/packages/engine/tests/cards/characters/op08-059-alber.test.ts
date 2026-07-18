import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op04King045, op08Alber059, op08King057 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-059 Alber", () => {
  test("trashes itself to play a cost-7 King with the required Leader and 10 field DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op08King057,
      hand: [op04King045],
      character: [op08Alber059],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: 10,
    });
    const alberId = engine.findCardInZone("south", "character", op08Alber059);
    const kingId = engine.findCardInZone("south", "hand", op04King045);

    engine.activateEffect(alberId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Alber's King choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([kingId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [kingId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(alberId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(kingId);
    expect(view.prompts).toHaveLength(0);
  });

  test("still pays the trash cost when the post-colon Leader condition is false", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04King045],
      character: [op08Alber059],
      activeDon: 10,
    });
    const alberId = engine.findCardInZone("south", "character", op08Alber059);
    const kingId = engine.findCardInZone("south", "hand", op04King045);

    engine.activateEffect(alberId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(alberId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(kingId);
    expect(view.prompts).toHaveLength(0);
  });
});
