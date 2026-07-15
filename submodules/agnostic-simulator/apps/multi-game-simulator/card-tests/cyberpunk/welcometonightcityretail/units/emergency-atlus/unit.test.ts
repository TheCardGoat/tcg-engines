import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import {
  welcomeToNightCityRetailEmergencyAtlus,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";

// Emergency Atlus is a vanilla Unit (flavor text only, no card-specific
// ability). Its tests therefore exercise the core combat rules every plain
// Unit must obey, using Atlus as the vehicle.
const atlus = welcomeToNightCityRetailEmergencyAtlus; // vanilla unit, power 4
const rivalUnit = welcomeToNightCityRetailCorpoSecurity; // a rival Unit

describe("Emergency Atlus (vanilla Unit — core combat rules)", () => {
  it("enters the field with Lag and cannot attack the turn it is played", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [atlus],
      eddies: atlus.cost,
    });

    engine.playCard(atlus, { as: P1 });
    expect(engine.getCard(atlus, "field", P1).meta.hasLag).toBe(true);

    // Lag forbids attacking until the Unit's controller's next turn.
    const failure = engine.expectFailure(() => engine.attackRival(atlus, { as: P1 }));
    expect(failure.errorCode).toBe("LAG");
  });

  it("a ready, Lag-free Atlus is an attack candidate; a spent one is not", () => {
    const readyEngine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: atlus, spent: false }],
    });
    expectAttackCandidate(readyEngine, atlus);

    const spentEngine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: atlus, spent: true }],
    });
    expectNotAttackCandidate(spentEngine, atlus);
  });

  it("steals 1 Gig on a direct attack (power below the first 10-power bonus tier)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: atlus, spent: false, hasLag: false }],
      },
      { gigArea: [{ dieType: "d6", faceValue: 3 }] },
    );
    expect(engine.getGigCount(P1)).toBe(0);
    expect(engine.getGigCount(P2)).toBe(1);

    engine.attackRival(atlus, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    // Power 4 → base steal of 1 Gig (no full-10 bonus tier).
    expect(engine.getGigCount(P1)).toBe(1);
    expect(engine.getGigCount(P2)).toBe(0);
  });

  it("can attack a spent rival Unit and resolves the fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: atlus, spent: false, hasLag: false }],
      },
      { field: [{ card: rivalUnit, spent: true }] },
    );

    engine.attackUnit(atlus, rivalUnit, { as: P1 });
    // The attack is live against the spent rival Unit.
    const attack = engine.getAttackState();
    expect(attack?.defenderId).toBe(engine.findCardId(rivalUnit, "field", P2));
  });
});
