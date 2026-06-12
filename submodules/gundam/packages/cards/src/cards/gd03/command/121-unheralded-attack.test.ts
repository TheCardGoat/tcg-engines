import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03UnheraldedAttack121 } from "./121-unheralded-attack.ts";

describe("Unheralded Attack (GD03-121)", () => {
  it("【Action】 rests a friendly Base and an enemy Unit with 3 or less HP", () => {
    const base = createMockBase();
    const enemy = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03UnheraldedAttack121],
        baseSection: [base],
        resourceArea: activeResources(1),
      },
      { play: [enemy] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03UnheraldedAttack121, { targets: [baseId, enemyId] }));

    expect(engine.getG().exhausted[baseId]).toBe(true);
    expect(engine.getG().exhausted[enemyId]).toBe(true);
  });

  it("cannot target an enemy Unit with more than 3 HP", () => {
    const base = createMockBase();
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03UnheraldedAttack121],
        baseSection: [base],
        resourceArea: activeResources(1),
      },
      { play: [enemy] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd03UnheraldedAttack121, { targets: [baseId, enemyId] }),
      "INVALID_TARGET",
    );
  });
});
