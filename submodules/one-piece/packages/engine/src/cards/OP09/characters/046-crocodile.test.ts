import { describe, expect, test } from "vite-plus/test";
import { eb01MsWednesday034, op09Alvida043, op09Crocodile046 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-046 Crocodile", () => {
  test("may play either a Cross Guild Character or one including Baroque Works", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Crocodile046, op09Alvida043, eb01MsWednesday034],
      activeDon: op09Crocodile046.cost,
    });
    const crossGuildId = engine.findCardInZone("south", "hand", op09Alvida043);
    const baroqueWorksId = engine.findCardInZone("south", "hand", eb01MsWednesday034);

    engine.playCard(op09Crocodile046, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Crocodile's play selection.");
    expect(play.candidates.find((candidate) => candidate.ref.id === crossGuildId)?.legal).toBe(
      true,
    );
    expect(play.candidates.find((candidate) => candidate.ref.id === baroqueWorksId)?.legal).toBe(
      true,
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [baroqueWorksId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(baroqueWorksId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(crossGuildId);
    expect(view.prompts).toHaveLength(0);
  });
});
