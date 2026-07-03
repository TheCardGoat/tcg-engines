import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaRuthlessLowlife,
  theHeistRetailStarterDeckDexterDeshawnOneLastChance,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Dexter DeShawn - One Last Chance", () => {
  it("adjusts a friendly Gig on play", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [theHeistRetailStarterDeckDexterDeshawnOneLastChance],
      eddies: 3,
      gigArea: [{ dieType: "d6", faceValue: 2 }],
    });

    engine.playCard(theHeistRetailStarterDeckDexterDeshawnOneLastChance, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d6")], { as: P1 });
    engine.resolveAdjustGig(3, { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d6")?.faceValue).toBe(3);
  });

  it("adjusts a rival Gig when attacking", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: theHeistRetailStarterDeckDexterDeshawnOneLastChance,
            spent: false,
            playedThisTurn: false,
          },
        ],
      },
      {
        gigArea: [{ dieType: "d8", faceValue: 4 }],
      },
    );

    engine.attackRival(theHeistRetailStarterDeckDexterDeshawnOneLastChance, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P2, "d8")], { as: P1 });
    engine.resolveAdjustGig(5, { as: P1 });

    expect(engine.getGigDice(P2).find((die) => die.dieType === "d8")?.faceValue).toBe(5);
  });

  it("draws 2 when defeated with a 10+ Street Cred difference", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [alphaRuthlessLowlife, alphaRuthlessLowlife],
        field: [
          {
            card: theHeistRetailStarterDeckDexterDeshawnOneLastChance,
            spent: false,
            playedThisTurn: false,
          },
        ],
        gigArea: [
          { dieType: "d6", faceValue: 6 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true, powerModifier: 4 }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(theHeistRetailStarterDeckDexterDeshawnOneLastChance, alphaCorpoSecurity, {
      as: P1,
    });
    engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(2);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      theHeistRetailStarterDeckDexterDeshawnOneLastChance.id,
    );
  });
});
