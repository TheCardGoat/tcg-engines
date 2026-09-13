import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
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
  it("is a red Ganger/Valentino unit with cost 3 and power 4", () => {
    const card = welcomeToNightCityRetailValentinoGuerrera;
    expect(card.type).toBe("unit");
    expect(card.color).toBe("red");
    expect(card.classifications).toEqual(["Ganger", "Valentino"]);
    expect(card.cost).toBe(3);
    expect(card.power).toBe(4);
    expect(card.printNumber).toBe("021");
  });

  it("plays to the field, pays cost, and enters with lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailValentinoGuerrera],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailValentinoGuerrera, { as: P1 });

    const unit = engine.getCard(welcomeToNightCityRetailValentinoGuerrera, "field", P1);
    expect(unit.meta.hasLag).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
    expectNotAttackCandidate(engine, welcomeToNightCityRetailValentinoGuerrera, { as: P1 });
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
});
