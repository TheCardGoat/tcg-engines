import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03BolinoakSammahn008 } from "./008-bolinoak-sammahn.ts";

describe("Bolinoak Sammahn (GD03-008)", () => {
  it("【During Pair】 repairs 2 damage at the end of its controller's turn", () => {
    const pilot = createMockPilot();
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [{ card: gd03BolinoakSammahn008, damage: 3 }],
        resourceArea: activeResources(4),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));

    expectSuccess(p1.passPhase());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getDamage(unitId)).toBe(1);
  });

  it("does not repair while it is not paired", () => {
    const engine = GundamTestEngine.create({
      play: [{ card: gd03BolinoakSammahn008, damage: 3 }],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getDamage(unitId)).toBe(3);
  });
});
