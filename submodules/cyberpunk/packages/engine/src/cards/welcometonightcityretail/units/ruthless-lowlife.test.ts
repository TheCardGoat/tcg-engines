import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailRuthlessLowlife,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Ruthless Lowlife", () => {
  it("can attack rival Units but cannot attack the rival Gig area", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailRuthlessLowlife, spent: false, hasLag: false }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    expect(
      engine.attackUnit(
        welcomeToNightCityRetailRuthlessLowlife,
        welcomeToNightCityRetailCorpoSecurity,
        { as: P1 },
      ).success,
    ).toBe(true);

    const directEngine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: welcomeToNightCityRetailRuthlessLowlife, spent: false, hasLag: false }],
    });
    const failure = directEngine.expectFailure(() =>
      directEngine.attackRival(welcomeToNightCityRetailRuthlessLowlife, { as: P1 }),
    );
    expect(failure.errorCode).toBe("CANT_ATTACK_RIVAL");
  });
});
