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
  it("has the exact printed identity and one-turn fight prevention", () => {
    expect(welcomeToNightCityRetailRebootOptics).toMatchObject({
      canonicalId: "reboot-optics",
      slug: "reboot-optics",
      name: "Reboot Optics",
      displayName: "Reboot Optics",
      type: "program",
      color: "blue",
      classifications: ["Quickhack"],
      cost: 2,
      power: null,
      ram: 2,
      hasSellTag: true,
      printNumber: "136",
      rarity: "Common",
      keywords: ["quick"],
      timingTriggers: ["play"],
      rulesText:
        "{Quick} The next time a rival Unit fights this turn, it doesn't defeat the opposing friendly Unit.",
      reminderText: ["Discard programs after they resolve."],
      abilities: [
        { kind: "keyword", keyword: "quick" },
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [{ effect: "preventNextRivalFightDefeat", duration: "turn" }],
        },
      ],
    });
  });

  it("pays exactly 2 Eddies and moves to trash", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailRebootOptics],
      eddies: 2,
    });
    for (const legend of engine.getCardsInZone("legendArea", P1)) {
      engine.judgeSpendCard(legend, { as: P1 });
    }

    engine.playCard(welcomeToNightCityRetailRebootOptics, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailRebootOptics.id,
    );
  });

  it("can be played during the React Step and protects that fight", () => {
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
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P2,
      },
    );
    engine.resolveAttack({ as: P2 });

    engine.playCard(welcomeToNightCityRetailRebootOptics, { as: P1 });
    engine.resolveAttack({ as: P1, pass: true });
    engine.resolveAttack({ as: P2 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
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

  it("is consumed by the next rival fight even when that rival Unit loses naturally", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRebootOptics],
        field: [
          { card: welcomeToNightCityRetailOffdutyMalfini, spent: true, hasLag: false },
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false },
        ],
        eddies: 2,
      },
      {
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false },
        ],
      },
    );
    engine.playCard(welcomeToNightCityRetailRebootOptics, { as: P1 });
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailOffdutyMalfini,
      {
        as: P2,
      },
    );
    engine.resolveFullFight({ as: P2 });
    expect(
      engine
        .getState()
        .G.activeEffects.some((effect) => effect.kind === "preventNextRivalFightDefeat"),
    ).toBe(false);

    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P2,
      },
    );
    engine.resolveFullFight({ as: P2 });
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("expires at the end of the turn if no rival Unit fights", () => {
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
    for (let guard = 0; guard < 8 && engine.getActivePlayerId() !== P2; guard += 1) {
      engine.passPhase({ as: engine.getActivePlayerId() });
    }

    expect(engine.getActivePlayerId()).toBe(P2);
    expect(
      engine
        .getState()
        .G.activeEffects.some((effect) => effect.kind === "preventNextRivalFightDefeat"),
    ).toBe(false);
    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P2,
      },
    );
    engine.resolveFullFight({ as: P2 });
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
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
