import { describe, expect, test } from "vite-plus/test";
import {
  eb01Blueno017,
  eb01Doma005,
  eb01MountainGod018,
  eb01PrinceBellett026,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-026 Prince Bellett", () => {
  test("can return an eligible Character owned by either player when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01PrinceBellett026, attachedDon: 1, playedOnTurn: 0 }, eb01Doma005],
      },
      { character: [eb01Blueno017, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const princeId = engine.findCardInZone("south", "character", eb01PrinceBellett026);
    const ownTargetId = engine.findCardInZone("south", "character", eb01Doma005);
    const opponentTargetId = engine.findCardInZone("north", "character", eb01Blueno017);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(princeId, engine.leader("north"), "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected Prince Bellett's Character return choice.");
    }
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      princeId,
      ownTargetId,
      opponentTargetId,
    ]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);

    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownTargetId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      ownTargetId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
