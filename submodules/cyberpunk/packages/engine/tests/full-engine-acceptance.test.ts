import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAltCunninghamMotherOfDaemons,
  welcomeToNightCityRetailBonnieAndClyde,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailMaxtacAv,
  welcomeToNightCityRetailTakeControl,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../src/testing/index.ts";
import { getProjectedDirectAttackGigStealCount } from "../src/moves/resolve-attack.ts";

describe("full-engine real-card acceptance", () => {
  it("survives rival Gig-steal prevention, completes a turn cycle, then wins at the next start", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
          { dieType: "d10", faceValue: 4 },
          { dieType: "d12", faceValue: 5 },
          { dieType: "d20", faceValue: 6 },
        ],
        fixerDice: [],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailAltCunninghamMotherOfDaemons,
            spent: false,
            hasLag: false,
          },
        ],
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        fixerDice: [],
      },
      { autoGainGig: false },
    );

    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    const prevention = engine.getState().G.turnMetadata.pendingChoice;
    expect(prevention?.type).toBe("preventGigSteal");
    if (!prevention || prevention.type !== "preventGigSteal") {
      throw new Error("Expected Alt Cunningham's prevention choice");
    }
    const entry = prevention.payload.stealEntries[0]!;
    const payment = prevention.payload.handEntries.find((card) => card.cost === entry.value)!;
    engine.resolvePreventGigSteal(
      [{ dieId: entry.dieId as string, cardId: payment.cardId as string }],
      { as: P2 },
    );
    expect(engine.getGigCount(P1)).toBe(6);
    expect(engine.getGigCount(P2)).toBe(1);
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailBonnieAndClyde.id,
    );

    engine.completeTurn({ as: P1 });
    engine.completeTurn({ as: P2 });
    expect(engine.getActivePlayerId()).toBe(P1);
    expect(engine.getCard(welcomeToNightCityRetailDelamainCab, "field", P1).meta.spent).toBe(false);

    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    expect(engine.getGigCount(P1)).toBe(7);
    expect(engine.isGameOver()).toBe(false);

    engine.completeTurn({ as: P1 });
    engine.completeTurn({ as: P2 });
    expect(engine.isGameOver()).toBe(true);
    expect(engine.getWinnerId()).toBe(P1);
    expect(engine.getWinReason()).toBe("gig_victory");
  });

  it("declines a Play choice, counters a rival attack with QUICK, then proves expiry next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMaxtacAv, welcomeToNightCityRetailTakeControl],
        eddies: 7,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        fixerDice: [],
      },
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d8", faceValue: 6 }],
        fixerDice: [],
      },
      { autoGainGig: false },
    );
    const p1Gig = engine.findGigIdByType(P1, "d6");
    const p2Gig = engine.findGigIdByType(P2, "d8");

    engine.playCard(welcomeToNightCityRetailMaxtacAv, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "chooseTrigger",
      payload: { canPass: true },
    });
    engine.executeMove("resolveTrigger", { args: { pass: true } }, P1);
    expect(engine.getGigDice(P1).map((die) => die.id)).toEqual([p1Gig]);
    expect(engine.getGigDice(P2).map((die) => die.id)).toEqual([p2Gig]);

    engine.completeTurn({ as: P1 });
    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P2 });
    engine.resolveAttack({ as: P2 });
    expect(engine.playCard(welcomeToNightCityRetailTakeControl, { as: P1 })).toMatchObject({
      success: true,
    });
    expect(getProjectedDirectAttackGigStealCount(engine.getState())).toBe(0);
    engine.resolveAttack({ as: P1, pass: true });
    engine.resolveAttack({ as: P2, gigIdsToSteal: [] });
    expect(engine.getLastEvent("attackResolved")).toMatchObject({ gigsStolen: 0 });
    expect(engine.getGigDice(P1).map((die) => die.id)).toContain(p1Gig);

    engine.completeTurn({ as: P2 });
    engine.completeTurn({ as: P1 });
    expect(engine.getActivePlayerId()).toBe(P2);
    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P2 });
    engine.resolveFullSteal({ as: P2 });
    expect(engine.getLastEvent("attackResolved")).toMatchObject({ gigsStolen: 1 });
    expect(engine.getGigDice(P2).map((die) => die.id)).toContain(p1Gig);
  });
});
