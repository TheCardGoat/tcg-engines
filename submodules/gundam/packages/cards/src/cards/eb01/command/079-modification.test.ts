import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01Modification079 } from "./079-modification.ts";

describe("Modification (EB01-079)", () => {
  it("prevents battle damage from an enemy Unit at Lv.3 or lower this turn", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [eb01Modification079],
        play: [createMockUnit({ ap: 3, hp: 6, traits: ["g generation"] })],
        resourceArea: activeResources(3),
      },
      { play: [{ card: createMockUnit({ level: 3, ap: 4, hp: 6 }), exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(eb01Modification079));
    expectSuccess(p1.resolveEffect({ targets: [friendlyId] }));
    expectSuccess(p1.enterBattle(friendlyId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getDamage(friendlyId)).toBe(0);
    expect(p2.getDamage(enemyId)).toBe(3);
  });

  it("does not prevent battle damage from an enemy Unit at Lv.4 or higher", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [eb01Modification079],
        play: [createMockUnit({ ap: 3, hp: 6, traits: ["g generation"] })],
        resourceArea: activeResources(3),
      },
      { play: [{ card: createMockUnit({ level: 4, ap: 4, hp: 6 }), exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(eb01Modification079));
    expectSuccess(p1.resolveEffect({ targets: [friendlyId] }));
    expectSuccess(p1.enterBattle(friendlyId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getDamage(friendlyId)).toBe(4);
  });
});
