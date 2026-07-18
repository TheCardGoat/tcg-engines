import { describe, expect, test } from "vite-plus/test";
import { op01Komurasaki042, op01KouzukiMomonosuke041, op01KouzukiOden031 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-042 Komurasaki", () => {
  test("with Kouzuki Oden, rests 3 DON!! on play to ready a compound Land of Wano Character", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01KouzukiOden031,
      hand: [op01Komurasaki042],
      character: [{ card: op01KouzukiMomonosuke041, rested: true }],
      activeDon: 4,
    });
    const momonosukeId = engine.findCardInZone("south", "character", op01KouzukiMomonosuke041);

    engine.playCard(op01Komurasaki042, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const ready = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ready?.kind).toBe("selectEntity");
    if (ready?.kind !== "selectEntity") throw new Error("Expected Komurasaki's ready target.");
    expect(ready.candidates.find((candidate) => candidate.ref.id === momonosukeId)?.legal).toBe(
      true,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [momonosukeId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === momonosukeId)?.rested,
    ).toBe(false);
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(4);
    expect(view.prompts).toHaveLength(0);
  });

  test("pays its On Play cost before the Kouzuki Oden condition prevents the ready effect", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01Komurasaki042],
      character: [{ card: op01KouzukiMomonosuke041, rested: true }],
      activeDon: 4,
    });
    const momonosukeId = engine.findCardInZone("south", "character", op01KouzukiMomonosuke041);

    engine.playCard(op01Komurasaki042, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === momonosukeId)?.rested,
    ).toBe(true);
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(4);
    expect(view.prompts).toHaveLength(0);
  });
});
