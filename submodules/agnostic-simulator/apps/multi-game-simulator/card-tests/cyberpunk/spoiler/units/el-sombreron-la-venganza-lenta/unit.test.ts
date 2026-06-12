import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  registerMatchers,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import {
  spoilerElSombreronLaVenganzaLenta,
  alphaCorpoSecurity,
  alphaSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";

registerMatchers();

const elSombreron = spoilerElSombreronLaVenganzaLenta; // unit, cost 4, power 4 — ATTACK: while fighting a rival Unit, double power
const huscle = alphaSwordwiseHuscle; // unit, power 5 — fight target
const corpoSecurity = alphaCorpoSecurity; // unit, power 2 — lower-power fight target

describe("El Sombrerón - La Venganza Lenta", () => {
  describe("UI prompt", () => {
    it("shows the unit as an attack candidate when ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: elSombreron, spent: false }],
      });
      expectAttackCandidate(engine, elSombreron);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: elSombreron, spent: true }],
      });
      expectNotAttackCandidate(engine, elSombreron);
    });
  });

  it("definition matches expected stats", () => {
    expect(elSombreron.type).toBe("unit");
    expect(elSombreron.cost).toBe(4);
    expect(elSombreron.power).toBe(4);
    expect(elSombreron.abilities).toHaveLength(1);
    expect(elSombreron.abilities[0]?.kind).toBe("triggered");
    expect(elSombreron.abilities[0]?.trigger?.trigger).toBe("attack");
  });

  it("doubles power when attacking a rival Unit (fightKind: fight)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: elSombreron, spent: false }],
      },
      { field: [{ card: huscle, spent: true }] },
    );

    engine.attackUnit(elSombreron, huscle);

    // After ATTACK trigger fires (doubles power for the turn), El Sombrerón's
    // effective power should be 4 * 2 = 8.
    const instance = engine.getCard(elSombreron, "field", P1);
    expect(engine.getState()).toHaveEffectivePower({
      card: instance.instanceId as string,
      value: 8,
    });
  });

  it("does not double power when attacking the rival directly", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: elSombreron, spent: false }],
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
    );

    engine.attackRival(elSombreron);

    const instance = engine.getCard(elSombreron, "field", P1);
    expect(engine.getState()).toHaveEffectivePower({
      card: instance.instanceId as string,
      value: 4,
    });
  });

  it("uses doubled power to win the fight and defeat the rival unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: elSombreron, spent: false }],
      },
      {
        field: [{ card: corpoSecurity, spent: true }],
      },
    );

    engine.attackUnit(elSombreron, corpoSecurity);
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P1 });

    expect(engine.getCard(elSombreron, "field", P1).zone).toBe("field");
    expect(engine.getCard(corpoSecurity, "trash", P2).zone).toBe("trash");
  });
});
