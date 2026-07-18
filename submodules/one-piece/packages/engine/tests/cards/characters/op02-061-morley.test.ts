import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op02Inazuma050,
  op02MonkeyDLuffy041,
  op02Morley061,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-061 Morley", () => {
  test("at 1 hand, prevents only cost-5-or-less Blockers during its battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005],
        character: [{ card: op02Morley061, playedOnTurn: 0 }],
      },
      {
        character: [op02Inazuma050, op02MonkeyDLuffy041],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const morleyId = engine.findCardInZone("south", "character", op02Morley061);
    const lowCostBlockerId = engine.findCardInZone("north", "character", op02Inazuma050);
    const highCostBlockerId = engine.findCardInZone("north", "character", op02MonkeyDLuffy041);

    engine.declareAttack(morleyId, engine.leader("north"), "south");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Morley's Blocker restriction.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(highCostBlockerId);
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).not.toContain(lowCostBlockerId);
  });

  test("above the hand threshold, permits both Blockers", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005, eb01MountainGod018],
        character: [{ card: op02Morley061, playedOnTurn: 0 }],
      },
      {
        character: [op02Inazuma050, op02MonkeyDLuffy041],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const morleyId = engine.findCardInZone("south", "character", op02Morley061);
    const lowCostBlockerId = engine.findCardInZone("north", "character", op02Inazuma050);
    const highCostBlockerId = engine.findCardInZone("north", "character", op02MonkeyDLuffy041);

    engine.declareAttack(morleyId, engine.leader("north"), "south");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected both Blockers.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([lowCostBlockerId, highCostBlockerId]),
    );
  });

  test("is not itself offered as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        character: [
          { card: op02Morley061, playedOnTurn: 0 },
          { card: op02MonkeyDLuffy041, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const morleyId = engine.findCardInZone("north", "character", op02Morley061);
    const actualBlockerId = engine.findCardInZone("north", "character", op02MonkeyDLuffy041);

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected a Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(actualBlockerId);
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).not.toContain(morleyId);
  });
});
