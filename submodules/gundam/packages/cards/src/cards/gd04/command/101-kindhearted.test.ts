import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockCommand,
  createMockUnit,
  expectCardInTrash,
  expectSuccess,
} from "@tcg/gundam-engine";
import type { CommandCard } from "@tcg/gundam-types";
import { gd04Kindhearted101 } from "./101-kindhearted.ts";

function destroyCommand(
  timing: "main" | "action",
  targetOwner: "friendly" | "opponent",
): CommandCard {
  return createMockCommand({
    level: 1,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: [timing] },
        directives: [
          {
            action: {
              action: "destroy",
              target: { owner: targetOwner, cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `【${timing === "main" ? "Main" : "Action"}】Destroy 1 enemy Unit.`,
      },
    ],
  });
}

describe("Kindhearted (GD04-101)", () => {
  it("【Main】/【Action】draws 1", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04Kindhearted101],
      resourceArea: activeResources(3),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    expectSuccess(p1.playCommand(gd04Kindhearted101));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
  });

  describe("【Main】/【Action】During this turn, friendly Units can't be destroyed by enemy effects. Then, draw 1.", () => {
    it("prevents an enemy destroy effect from moving a friendly Unit to trash this turn", () => {
      const protectedUnit = createMockUnit({ hp: 4 });
      const enemyDestroy = destroyCommand("action", "opponent");
      const engine = GundamTestEngine.create(
        {
          hand: [gd04Kindhearted101],
          play: [protectedUnit],
          resourceArea: activeResources(3),
          deck: 3,
        },
        { hand: [enemyDestroy], resourceArea: activeResources(1) },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd04Kindhearted101));
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_TWO);
      expectSuccess(p2.playCommand(enemyDestroy, { targets: [unitId] }));

      expect(p1.getCardsInZone("battleArea")).toContain(unitId);
    });

    it("does not prevent friendly effects from destroying your own Unit", () => {
      const ownUnit = createMockUnit({ hp: 4 });
      const ownDestroy = destroyCommand("main", "friendly");
      const engine = GundamTestEngine.create({
        hand: [gd04Kindhearted101, ownDestroy],
        play: [ownUnit],
        resourceArea: activeResources(3),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd04Kindhearted101));
      expectSuccess(p1.playCommand(ownDestroy, { targets: [unitId] }));

      expectCardInTrash(engine, unitId, PLAYER_ONE);
    });
  });
});
