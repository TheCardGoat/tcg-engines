import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailRebootOptics,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Reboot Optics", () => {
  it("plays through the engine as a QUICK program and moves to trash", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailRebootOptics],
      eddies: 2,
    });

    engine.playCard(welcomeToNightCityRetailRebootOptics, { as: P1 });

    expect(welcomeToNightCityRetailRebootOptics.keywords).toContain("quick");
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailRebootOptics.id,
    );
  });

  it("prevents the next rival fighting unit from defeating the opposing friendly unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRebootOptics],
        field: [{ card: alphaCorpoSecurity, spent: true, playedThisTurn: false }],
        eddies: 2,
      },
      {
        field: [{ card: alphaSwordwiseHuscle, spent: false, playedThisTurn: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailRebootOptics, { as: P1 });
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

    engine.attackUnit(alphaSwordwiseHuscle, alphaCorpoSecurity, { as: P2 });
    engine.resolveFullFight({ as: P2 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      alphaCorpoSecurity.id,
    );
    expect(
      engine
        .getState()
        .G.activeEffects.some((effect) => effect.kind === "preventNextRivalFightDefeat"),
    ).toBe(false);
  });

  it("does not protect or consume the effect during the caster's own attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRebootOptics],
        field: [{ card: alphaRuthlessLowlife, spent: false, playedThisTurn: false }],
        eddies: 2,
      },
      {
        field: [{ card: alphaSwordwiseHuscle, spent: true, playedThisTurn: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailRebootOptics, { as: P1 });
    engine.attackUnit(alphaRuthlessLowlife, alphaSwordwiseHuscle, { as: P1 });
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      alphaRuthlessLowlife.id,
    );
    expect(
      engine
        .getState()
        .G.activeEffects.some((effect) => effect.kind === "preventNextRivalFightDefeat"),
    ).toBe(true);
  });
});
