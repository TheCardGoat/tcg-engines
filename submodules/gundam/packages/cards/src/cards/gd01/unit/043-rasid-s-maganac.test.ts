import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  hasGrantAttackTargetOption,
} from "@tcg/gundam-engine";
import { gd01RasidSMaganac043 } from "./043-rasid-s-maganac.ts";

describe("Rasid's Maganac (GD01-043)", () => {
  it("【Deploy】grants a friendly green Unit the option to attack an active enemy Unit with AP ≤ 4", () => {
    const greenTarget = createMockUnit({ ap: 3, hp: 3, color: "green" });
    const enemyUnit = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01RasidSMaganac043],
        play: [greenTarget],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [enemyUnit] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const targetId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd01RasidSMaganac043, { targets: [targetId] }));

    expect(hasGrantAttackTargetOption(engine, targetId)).toBe(true);
  });
});
