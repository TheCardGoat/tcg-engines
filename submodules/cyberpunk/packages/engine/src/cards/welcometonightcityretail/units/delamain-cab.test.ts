import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailDelamainCab } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Delamain Cab", () => {
  it("readies 1 Eddie at end of turn after stealing a Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailDelamainCab,
            spent: false,
            hasLag: false,
          },
        ],
        eddies: 4,
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
    );
    engine.getState().G.players[P1]!.eddies = 3;
    engine.getState().G.players[P1]!.spentEddies = 1;

    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getEvents("gigStolen")).toHaveLength(1);
    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d6");
    expect(engine.getEddies(P1)).toBe(3);

    engine.completeTurn({ as: P1 });

    expect(engine.getEddies(P1)).toBe(4);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(0);
  });

  it("does not ready an Eddie when it did not steal a Gig this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailDelamainCab,
          spent: false,
          hasLag: false,
        },
      ],
      eddies: 4,
    });
    engine.getState().G.players[P1]!.eddies = 3;
    engine.getState().G.players[P1]!.spentEddies = 1;

    engine.completeTurn({ as: P1 });

    expect(engine.getEddies(P1)).toBe(3);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(1);
  });
});
