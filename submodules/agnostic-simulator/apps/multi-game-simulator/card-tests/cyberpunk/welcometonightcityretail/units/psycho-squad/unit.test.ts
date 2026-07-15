import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import { createMockUnit } from "@cyberpunk-engine/testing/index.ts";
import {
  welcomeToNightCityRetailPsychoSquad,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";

// Psycho Squad is a vanilla Unit (flavor text only, no card-specific ability).
// Its tests exercise the core combat rules every plain Unit must obey, using
// Psycho Squad as the vehicle.
const psychoSquad = welcomeToNightCityRetailPsychoSquad; // vanilla unit, power 6
const rivalUnit = welcomeToNightCityRetailCorpoSecurity; // a rival Unit
const readyRival = createMockUnit({ id: "ps-ready-rival", name: "Ready Rival", power: 1 });

describe("Psycho Squad (vanilla Unit — core combat rules)", () => {
  it("enters the field with Lag and cannot attack the turn it is played", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [psychoSquad],
      eddies: psychoSquad.cost,
    });

    engine.playCard(psychoSquad, { as: P1 });
    expect(engine.getCard(psychoSquad, "field", P1).meta.hasLag).toBe(true);

    const failure = engine.expectFailure(() => engine.attackRival(psychoSquad, { as: P1 }));
    expect(failure.errorCode).toBe("LAG");
  });

  it("a ready, Lag-free Psycho Squad is an attack candidate; a spent one is not", () => {
    const readyEngine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: psychoSquad, spent: false }],
    });
    expectAttackCandidate(readyEngine, psychoSquad);

    const spentEngine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: psychoSquad, spent: true }],
    });
    expectNotAttackCandidate(spentEngine, psychoSquad);
  });

  it("cannot attack a READY rival Unit (only spent Units or the rival directly)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: psychoSquad, spent: false, hasLag: false }] },
      { field: [{ card: readyRival, spent: false }] },
    );
    const failure = engine.expectFailure(() =>
      engine.attackUnit(psychoSquad, readyRival, { as: P1 }),
    );
    expect(failure.errorCode).toBe("TARGET_READY");
  });

  it("defeats a weaker spent rival Unit in a fight (higher power wins)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: psychoSquad, spent: false, hasLag: false }] },
      { field: [{ card: rivalUnit, spent: true }] },
    );

    engine.attackUnit(psychoSquad, rivalUnit, { as: P1 });
    engine.resolveFullFight({ as: P1 });

    // Psycho Squad (power 6) beats Corpo Security (power 2) → rival defeated.
    const p2Field = engine.getCardsInZone("field", P2).map((c) => c.definitionId);
    const p2Trash = engine.getCardsInZone("trash", P2).map((c) => c.definitionId);
    expect(p2Field).not.toContain(rivalUnit.id);
    expect(p2Trash).toContain(rivalUnit.id);
    // Psycho Squad survives on P1's field.
    const p1Field = engine.getCardsInZone("field", P1).map((c) => c.definitionId);
    expect(p1Field).toContain(psychoSquad.id);
  });
});
