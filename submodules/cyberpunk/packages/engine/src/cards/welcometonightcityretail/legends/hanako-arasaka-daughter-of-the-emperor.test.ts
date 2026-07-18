import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
  welcomeToNightCityRetailMoxInciters,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Hanako Arasaka - Daughter of the Emperor", () => {
  it("spends to swap a chosen friendly Gig with a chosen rival Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          {
            card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
            faceDown: false,
            spent: false,
          },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 4 },
        ],
      },
      {
        gigArea: [
          { dieType: "d8", faceValue: 6 },
          { dieType: "d10", faceValue: 8 },
        ],
      },
    );
    const friendlyGigId = engine.findGigIdByType(P1, "d4");
    const rivalGigId = engine.findGigIdByType(P2, "d8");

    engine.activateAbility(welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor, 0, {
      as: P1,
    });
    engine.resolveEffectTargetIds([friendlyGigId], {
      as: P1,
      allowPendingChoice: true,
      reason: "Hanako still needs the rival Gig to swap",
    });
    engine.resolveEffectTargetIds([rivalGigId], { as: P1 });

    expect(engine.getGigDice(P1).map((die) => die.id)).toEqual([
      engine.findGigIdByType(P1, "d6"),
      rivalGigId,
    ]);
    expect(engine.getGigDice(P2).map((die) => die.id)).toEqual([
      engine.findGigIdByType(P2, "d10"),
      friendlyGigId,
    ]);
    expect(
      engine.getCard(welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor, "legendArea", P1)
        .meta.spent,
    ).toBe(true);
    expect(engine.getEvents("gigStolen")).toHaveLength(0);
  });

  it("draws once per friendly value-pair at the start of its controller's turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailDelamainCab,
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailMoxInciters,
        ],
        legendArea: [
          {
            card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
            faceDown: false,
          },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      {},
      { activePlayerId: P2, autoGainGig: false, preserveDeckOrder: true },
    );

    engine.completeTurn({ as: P2 });

    // Three equal Gigs make three value-pairs, followed by the normal turn draw.
    expect(engine.getHandCount(P1)).toBe(4);
  });

  it("does not draw before its controller wins for starting the turn with 7 Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          {
            card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
            faceDown: false,
          },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 3 },
          { dieType: "d10", faceValue: 4 },
          { dieType: "d12", faceValue: 5 },
          { dieType: "d20", faceValue: 6 },
        ],
      },
      { gigArea: [{ dieType: "d4", faceValue: 2 }] },
      { activePlayerId: P2, autoGainGig: false },
    );
    engine.judgeMoveGigToPlayer(engine.findGigIdByType(P2, "d4"), P1, { as: P1 });

    engine.completeTurn({ as: P2 });

    expect(engine.isGameOver()).toBe(true);
    expect(engine.getWinnerId()).toBe(P1);
    expect(engine.getWinReason()).toBe("gig_victory");
    expect(engine.getHandCount(P1)).toBe(0);
  });
});
