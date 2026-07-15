import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockBase,
  createMockPilot,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02ZetaGundam069 } from "./069-zeta-gundam.ts";

describe("Zeta Gundam (GD02-069)", () => {
  it("rests an active friendly Base to set linked Zeta active", () => {
    const kamille = createMockPilot({ name: "Kamille Bidan", level: 1, cost: 1 });
    const base = createMockBase();
    const engine = GundamTestEngine.create({
      hand: [kamille],
      play: [{ card: gd02ZetaGundam069, exhausted: true }],
      baseSection: [base],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const zetaId = p1.getCardsInZone("battleArea")[0]!;
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    expectSuccess(p1.assignPilot(kamille, zetaId));

    expectSuccess(p1.activateAbility(zetaId, 0, { targets: [baseId] }));

    expect(p1.isExhausted(baseId)).toBe(true);
    expect(p1.isExhausted(zetaId)).toBe(false);
  });
});
