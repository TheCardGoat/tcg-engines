import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02Uta120, op06TotMusica011, op06Uta001 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-011 Tot Musica", () => {
  test("rests an Uta card to gain +5000 power once per turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06Uta001,
      character: [op06TotMusica011, op02Uta120, eb01Doma005],
    });
    const musicaId = engine.findCardInZone("south", "character", op06TotMusica011);
    const utaId = engine.findCardInZone("south", "character", op02Uta120);
    const unrelatedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(musicaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    if (payment?.kind !== "payCost") throw new Error("Expected Tot Musica's Uta-rest cost.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), utaId]),
    );
    expect(payment.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    engine.resolveDecision("effectCostRestCards", { selectedIds: [utaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === utaId)?.rested).toBe(
      true,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === musicaId)?.power).toBe(
      11000,
    );
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: musicaId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
