import { describe, expect, test } from "vite-plus/test";
import { eb01Blueno017, op01Pacifista075, op03Adio002 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-002 Adio", () => {
  test("with DON!! attached, prevents only power-2000-or-less Characters from blocking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03Adio002, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { character: [eb01Blueno017, op01Pacifista075] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const adioId = engine.findCardInZone("south", "character", op03Adio002);
    const lowPowerBlockerId = engine.findCardInZone("north", "character", eb01Blueno017);
    const highPowerBlockerId = engine.findCardInZone("north", "character", op01Pacifista075);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.attachDon(adioId, 1, "south");
    engine.declareAttack(adioId, engine.leader("north"), "south");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Adio's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(highPowerBlockerId);
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      lowPowerBlockerId,
    );
    engine.resolveDecision("battleBlocker", { selectedIds: [highPowerBlockerId] }, "north");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(highPowerBlockerId);
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("without DON!! attached, permits both low- and high-power Blockers", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op03Adio002, playedOnTurn: 0 }] },
      { character: [eb01Blueno017, op01Pacifista075] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const adioId = engine.findCardInZone("south", "character", op03Adio002);
    const lowPowerBlockerId = engine.findCardInZone("north", "character", eb01Blueno017);
    const highPowerBlockerId = engine.findCardInZone("north", "character", op01Pacifista075);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.declareAttack(adioId, engine.leader("north"), "south");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected ordinary Blocker choices.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(lowPowerBlockerId);
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(highPowerBlockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [lowPowerBlockerId] }, "north");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(lowPowerBlockerId);
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
