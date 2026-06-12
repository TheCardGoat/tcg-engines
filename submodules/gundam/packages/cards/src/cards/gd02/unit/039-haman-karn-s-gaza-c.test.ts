import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd02HamanKarnSGazaC039 } from "./039-haman-karn-s-gaza-c.ts";

describe("Haman Karn's Gaza C (GD02-039)", () => {
  it("【When Paired】Choose 1 enemy Unit that is Lv.3 or lower. Deal 1 damage to it.", () => {
    const pilot = createMockPilot();
    const enemy = createMockUnit({ ap: 2, hp: 5, level: 3 });

    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd02HamanKarnSGazaC039],
        resourceArea: activeResources(5),
        deck: 5,
      },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, hostId));

    if (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    }

    expect(getDamageCounter(engine, enemyId)).toBe(1);
  });
});
