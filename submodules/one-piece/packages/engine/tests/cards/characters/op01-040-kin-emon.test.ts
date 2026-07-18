import { describe, expect, test } from "vite-plus/test";
import { op01Kawamatsu037, op01KinEmon040, op01KouzukiOden031, op01Okiku035 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-040 Kin'emon", () => {
  test("with Kouzuki Oden plays a cost-3-or-less Akazaya Nine from hand", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01KouzukiOden031,
      hand: [op01KinEmon040, op01Kawamatsu037],
      activeDon: 6,
    });
    const kawamatsuId = engine.findCardInZone("south", "hand", op01Kawamatsu037);

    engine.playCard(op01KinEmon040, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Kin'emon's hand-play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([kawamatsuId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [kawamatsuId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === kawamatsuId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("with DON!! attached, readies a cost-3-or-less Akazaya Nine when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op01KinEmon040, attachedDon: 1, playedOnTurn: 0 },
          { card: op01Okiku035, rested: true, playedOnTurn: 0 },
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kinEmonId = engine.findCardInZone("south", "character", op01KinEmon040);
    const okikuId = engine.findCardInZone("south", "character", op01Okiku035);

    engine.declareAttack(kinEmonId, engine.leader("north"), "south");
    const ready = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ready?.kind).toBe("selectEntity");
    if (ready?.kind !== "selectEntity") throw new Error("Expected Kin'emon's ready target.");
    expect(ready.candidates.map((candidate) => candidate.ref.id)).toContain(okikuId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [okikuId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === okikuId)?.rested).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
