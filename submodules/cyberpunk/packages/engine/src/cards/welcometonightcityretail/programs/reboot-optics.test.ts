import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailRebootOptics,
} from "@tcg/cyberpunk-cards";
import {
  clearDefinitionOverride,
  getDefinition,
  overrideDefinition,
} from "../../../state/card-registry.ts";
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
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailRebootOptics, { as: P1 });
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P2,
      },
    );
    engine.resolveFullFight({ as: P2 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(
      engine
        .getState()
        .G.activeEffects.some((effect) => effect.kind === "preventNextRivalFightDefeat"),
    ).toBe(false);
    expect(engine.getLastActionLog()).toMatchObject({
      messageKey: "move.resolveAttack.fight.attackerWins.prevented",
      params: {
        sourceCardName: "Reboot Optics",
      },
    });
  });

  it("does not protect or consume the effect during the caster's own attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRebootOptics],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: true, hasLag: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailRebootOptics, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailOffdutyMalfini,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(
      engine
        .getState()
        .G.activeEffects.some((effect) => effect.kind === "preventNextRivalFightDefeat"),
    ).toBe(true);
  });

  it("reports the protected defender when a fight ends in a tie", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRebootOptics],
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailRebootOptics, { as: P1 });
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P2 },
    );
    engine.resolveFullFight({ as: P2 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getLastActionLog()).toMatchObject({
      messageKey: "move.resolveAttack.fight.mutual.prevented",
      params: {
        sourceCardName: "Reboot Optics",
      },
    });
  });
  it("falls back to the source definition name when it has no display name", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRebootOptics],
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
      },
    );
    const definitionWithoutDisplayName = {
      ...getDefinition(welcomeToNightCityRetailRebootOptics.id),
      name: "Fallback source",
    };
    Reflect.deleteProperty(definitionWithoutDisplayName, "displayName");
    overrideDefinition(definitionWithoutDisplayName);

    try {
      engine.playCard(welcomeToNightCityRetailRebootOptics, { as: P1 });
      engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
      engine.attackUnit(
        welcomeToNightCityRetailOffdutyMalfini,
        welcomeToNightCityRetailCorpoSecurity,
        { as: P2 },
      );
      engine.resolveFullFight({ as: P2 });

      expect(engine.getLastActionLog()).toMatchObject({
        messageKey: "move.resolveAttack.fight.attackerWins.prevented",
        params: { sourceCardName: "Fallback source" },
      });
    } finally {
      clearDefinitionOverride(welcomeToNightCityRetailRebootOptics.id);
    }
  });
});
