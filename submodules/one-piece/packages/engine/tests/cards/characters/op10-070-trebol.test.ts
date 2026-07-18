import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import { eb01MountainGod018, eb01OffWhite019, op10Sugar065, op10Trebol070 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const koOpponentCharacter: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP10-070-OPPONENT-KO",
  canonicalId: "TEST-OP10-070-OPPONENT-KO",
  name: "Trebol Opponent Effect Review",
  cost: 0,
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
};

const koOwnCharacter: EventCard = {
  ...koOpponentCharacter,
  id: "TEST-OP10-070-OWN-KO",
  canonicalId: "TEST-OP10-070-OWN-KO",
  name: "Trebol Own Effect Review",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
};
registerCards([koOpponentCharacter, koOwnCharacter]);

describe("OP10-070 Trebol", () => {
  test("protects low-base-power Characters from opposing effect K.O. through the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op10Trebol070],
        character: [op10Sugar065],
        activeDon: op10Trebol070.cost,
      },
      { hand: [koOpponentCharacter, koOpponentCharacter] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const protectedId = engine.findCardInZone("south", "character", op10Sugar065);

    engine.playCard(op10Trebol070, "south");
    engine.endTurn("south");
    engine.playCard(koOpponentCharacter, "north");
    const protectedTarget = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (protectedTarget?.kind !== "selectEntity") {
      throw new Error("Expected the protected K.O. target choice.");
    }
    expect(protectedTarget.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      protectedId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");

    engine.endTurn("north");
    engine.endTurn("south");
    engine.playCard(koOpponentCharacter, "north");
    const expiredTarget = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (expiredTarget?.kind !== "selectEntity") {
      throw new Error("Expected the K.O. target after protection expired.");
    }
    expect(expiredTarget.candidates.map((candidate) => candidate.ref.id)).toContain(protectedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "north");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      protectedId,
    );
  });

  test("does not prevent its controller's own effect from K.O.ing a protected Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Trebol070, koOwnCharacter],
      character: [op10Sugar065],
      activeDon: op10Trebol070.cost,
    });
    const targetId = engine.findCardInZone("south", "character", op10Sugar065);

    engine.playCard(op10Trebol070, "south");
    engine.playCard(koOwnCharacter, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the own-effect K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });

  test("blocks an attack aimed at its Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Trebol070] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const trebolId = engine.findCardInZone("south", "character", op10Trebol070);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Trebol's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(trebolId);
    engine.resolveDecision("battleBlocker", { selectedIds: [trebolId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(trebolId);
  });
});
