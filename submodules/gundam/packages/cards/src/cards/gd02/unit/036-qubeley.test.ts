import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  hasKeywordGrant,
} from "@tcg/gundam-engine";
import { gd02Qubeley036 } from "./036-qubeley.ts";

describe("Qubeley (GD02-036)", () => {
  it("gains Suppression this turn when linked", () => {
    const haman = createMockPilot({ name: "Haman Karn", traits: ["neo zeon"], level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [haman],
      play: [gd02Qubeley036],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [qubeleyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(haman, gd02Qubeley036));

    expect(hasKeywordGrant(engine, qubeleyId!, "Suppression")).toBe(true);
  });

  it("deals 2 damage to a damaged enemy Unit on attack while paired with a Neo Zeon pilot", () => {
    const haman = createMockPilot({ name: "Haman Karn", traits: ["neo zeon"], level: 1, cost: 1 });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [haman],
        play: [gd02Qubeley036],
        resourceArea: activeResources(7),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer("player_two").getCardsInZone("battleArea")[0]!;
    const [qubeleyId] = p1.getCardsInZone("battleArea");
    engine.getG().damage[enemyId] = 1;
    expectSuccess(p1.assignPilot(haman, gd02Qubeley036));

    expectSuccess(p1.enterBattle(qubeleyId!, "direct"));
    if (engine.getPendingChoice()) expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(getDamageCounter(engine, enemyId)).toBe(3);
  });
});
