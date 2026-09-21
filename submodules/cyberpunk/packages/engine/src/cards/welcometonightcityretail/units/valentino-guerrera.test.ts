import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailValentinoGuerrera,
} from "@tcg/cyberpunk-cards";
import {
  CyberpunkTestEngine,
  P1,
  expectAttackCandidate,
  expectAttackPair,
  expectNotAttackCandidate,
  expectNotAttackPair,
} from "../../../testing/index.ts";

describe("Valentino Guerrera", () => {
  it("has the exact red Ganger/Valentino identity and conditional rule DSL", () => {
    const card = welcomeToNightCityRetailValentinoGuerrera;
    expect(card).toMatchObject({
      canonicalId: "valentino-guerrera",
      slug: "valentino-guerrera",
      name: "Valentino Guerrera",
      displayName: "Valentino Guerrera",
      type: "unit",
      color: "red",
      classifications: ["Ganger", "Valentino"],
      cost: 3,
      power: 4,
      ram: 2,
      hasSellTag: false,
      rarity: "Common",
      printNumber: "021",
      rulesText:
        "If you have more ☆ (Street Cred) than a Rival, this Unit can attack ready Units with {Blocker}.",
      abilities: [
        {
          kind: "static",
          text: "If you have more ☆ (Street Cred) than a Rival, this Unit can attack ready Units with {Blocker}.",
          conditions: [
            {
              condition: "streetCredComparison",
              controller: "friendly",
              comparison: "gt",
              other: "rival",
            },
          ],
          effects: [
            {
              effect: "grantRule",
              target: { selector: "self" },
              rule: "canAttackReadyBlockers",
              duration: "continuous",
            },
          ],
        },
      ],
    });
  });

  it("plays to the field, pays cost, and enters with lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailValentinoGuerrera],
      eddies: 3,
    });
    for (const legend of engine.getCardsInZone("legendArea", P1)) {
      engine.judgeSpendCard(legend, { as: P1 });
    }

    engine.playCard(welcomeToNightCityRetailValentinoGuerrera, { as: P1 });

    const unit = engine.getCard(welcomeToNightCityRetailValentinoGuerrera, "field", P1);
    expect(unit.meta.hasLag).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
    expectNotAttackCandidate(engine, welcomeToNightCityRetailValentinoGuerrera, { as: P1 });

    const short = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailValentinoGuerrera],
      eddies: 2,
    });
    for (const legend of short.getCardsInZone("legendArea", P1)) {
      short.judgeSpendCard(legend, { as: P1 });
    }
    expect(
      short.expectFailure(() =>
        short.playCard(welcomeToNightCityRetailValentinoGuerrera, { as: P1 }),
      ).errorCode,
    ).toBe("INSUFFICIENT_EDDIES");
  });

  it("can attack normally after lag clears", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailValentinoGuerrera, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d8", faceValue: 5 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    expectAttackCandidate(engine, welcomeToNightCityRetailValentinoGuerrera, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailValentinoGuerrera,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    expect(engine.getState().G.attackState?.kind).toBe("fight");
  });

  it("can attack a ready rival Blocker while ahead on Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailValentinoGuerrera, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d8", faceValue: 5 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    expectAttackPair(
      engine,
      welcomeToNightCityRetailValentinoGuerrera,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.attackUnit(
      welcomeToNightCityRetailValentinoGuerrera,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    expect(engine.getState().G.attackState?.kind).toBe("fight");
  });

  it("cannot attack a ready rival Blocker while not ahead on Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailValentinoGuerrera, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
        gigArea: [{ dieType: "d8", faceValue: 5 }],
      },
    );

    expectNotAttackPair(
      engine,
      welcomeToNightCityRetailValentinoGuerrera,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    const failure = engine.expectFailure(() =>
      engine.attackUnit(
        welcomeToNightCityRetailValentinoGuerrera,
        welcomeToNightCityRetailCorpoSecurity,
        { as: P1 },
      ),
    );
    expect(failure.errorCode).toBe("TARGET_READY");
  });

  it("cannot attack a ready rival Blocker while Street Cred is equal", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailValentinoGuerrera, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d8", faceValue: 5 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
        gigArea: [{ dieType: "d10", faceValue: 5 }],
      },
    );
    expectNotAttackPair(
      engine,
      welcomeToNightCityRetailValentinoGuerrera,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    expect(
      engine.expectFailure(() =>
        engine.attackUnit(
          welcomeToNightCityRetailValentinoGuerrera,
          welcomeToNightCityRetailCorpoSecurity,
          { as: P1 },
        ),
      ).errorCode,
    ).toBe("TARGET_READY");
  });

  it("cannot attack a ready non-Blocker even while ahead on Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailValentinoGuerrera, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d8", faceValue: 5 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );
    expectNotAttackPair(
      engine,
      welcomeToNightCityRetailValentinoGuerrera,
      welcomeToNightCityRetailFieldOperator,
      { as: P1 },
    );
    expect(
      engine.expectFailure(() =>
        engine.attackUnit(
          welcomeToNightCityRetailValentinoGuerrera,
          welcomeToNightCityRetailFieldOperator,
          { as: P1 },
        ),
      ).errorCode,
    ).toBe("TARGET_READY");
  });
});
