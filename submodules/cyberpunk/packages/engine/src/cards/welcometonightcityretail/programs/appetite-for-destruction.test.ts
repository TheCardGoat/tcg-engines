import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAppetiteForDestruction,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailOffdutyMalfini,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Appetite for Destruction", () => {
  it("lets the next friendly Unit that wins by 3 power steal a chosen Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAppetiteForDestruction],
        field: [
          {
            card: welcomeToNightCityRetailOffdutyMalfini,
            spent: false,
            hasLag: false,
          },
        ],
        eddies: 3,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
    );
    const selectedGigId = engine.findGigIdByType(P2, "d8");
    const appetiteId = engine.findCardId(
      welcomeToNightCityRetailAppetiteForDestruction,
      "hand",
      P1,
    );
    const attackerId = engine.findCardId(welcomeToNightCityRetailOffdutyMalfini, "field", P1);

    engine.playCard(welcomeToNightCityRetailAppetiteForDestruction, { as: P1 });
    expect(engine.getState().G.activeEffects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "nextFightWinGigSteal", minPowerMargin: 3 }),
      ]),
    );

    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({
      type: "chooseTarget",
      chooserId: P1,
      payload: { targetKind: "gig", eligibleIds: expect.arrayContaining([selectedGigId]) },
    });
    engine.resolveEffectTargetIds([selectedGigId], { as: P1 });

    expect(engine.getGigDice(P1).map((die) => die.id)).toContain(selectedGigId);
    expect(engine.getEvents("gigStolen")).toContainEqual(
      expect.objectContaining({ dieId: selectedGigId, sourceCardId: attackerId }),
    );
    expect(engine.getEvents("actionLog")).toContainEqual(
      expect.objectContaining({
        messageKey: "trigger.stealGig",
        params: expect.objectContaining({ cardName: "Appetite for Destruction" }),
        cardIds: [appetiteId],
      }),
    );
    expect(engine.getState().G.activeEffects).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: "nextFightWinGigSteal" })]),
    );
  });

  it("does not consume the effect when a friendly Unit wins by less than 3 power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAppetiteForDestruction],
        field: [
          {
            card: welcomeToNightCityRetailOffdutyMalfini,
            spent: false,
            hasLag: false,
            powerModifier: -1,
          },
        ],
        eddies: 3,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
    );

    engine.playCard(welcomeToNightCityRetailAppetiteForDestruction, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getGigDice(P1)).toHaveLength(0);
    expect(engine.getState().G.activeEffects).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: "nextFightWinGigSteal" })]),
    );
  });

  it("expires at the end of the turn if no fight qualifies", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailAppetiteForDestruction],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailAppetiteForDestruction, { as: P1 });
    engine.completeTurn({ as: P1 });

    expect(engine.getState().G.activeEffects).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: "nextFightWinGigSteal" })]),
    );
  });
});
