import { describe, expect, it } from "vite-plus/test";
import {
  alphaRuthlessLowlife,
  welcomeToNightCityRetailEvelynParkerSchemingSiren,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Evelyn Parker — Scheming Siren (retail)", () => {
  it("ATTACK draws 1, then discards 1 when friendly Street Cred is greater", () => {
    // P1 has 7 Street Cred (d8=7) > P2 has 1 (d4=1) → discard clause fires.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        // Two cards in hand: after draw, hand grows to 3; after discard, back to 2.
        hand: [alphaRuthlessLowlife, alphaRuthlessLowlife],
        deck: [alphaRuthlessLowlife],
        field: [
          {
            card: welcomeToNightCityRetailEvelynParkerSchemingSiren,
            spent: false,
            playedThisTurn: false,
          },
        ],
        gigArea: [{ dieType: "d8", faceValue: 7 }],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    const handBefore = engine.getCardsInZone("hand", P1).length; // 2
    engine.attackRival(welcomeToNightCityRetailEvelynParkerSchemingSiren, { as: P1 });

    // The discard is a player choice (no target filter → defaults to any card
    // in hand). Resolve it by discarding the first eligible card.
    engine.resolveDiscardFromHand([alphaRuthlessLowlife], { as: P1 });

    // Drew 1, then discarded 1 → net 0 change.
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      alphaRuthlessLowlife.id,
    );
  });

  it("ATTACK draws 1 and skips the discard when Street Cred is not greater", () => {
    // P1 has 1 Street Cred (d4=1), P2 has 7 (d8=7) → discard clause does not fire.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [],
        deck: [alphaRuthlessLowlife],
        field: [
          {
            card: welcomeToNightCityRetailEvelynParkerSchemingSiren,
            spent: false,
            playedThisTurn: false,
          },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        gigArea: [{ dieType: "d8", faceValue: 7 }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailEvelynParkerSchemingSiren, { as: P1 });

    // No discard prompt should suspend; attacker simply drew 1.
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(1);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    // P2 still holds all their gigs (power 0 → no steal).
    expect(engine.getGigCount(P2)).toBe(1);
  });

  it("a fully resolved direct attack with 0 power steals 0 Gigs", () => {
    // Reminder text: "(Units with power 0 don't steal Gigs.)" Drive the attack
    // all the way through the steal step to prove the rule end-to-end.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [],
        deck: [alphaRuthlessLowlife],
        field: [
          {
            card: welcomeToNightCityRetailEvelynParkerSchemingSiren,
            spent: false,
            playedThisTurn: false,
          },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 4 },
        ],
      },
    );

    expect(engine.getGigCount(P1)).toBe(1);
    expect(engine.getGigCount(P2)).toBe(2);

    engine.attackRival(welcomeToNightCityRetailEvelynParkerSchemingSiren, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    // 0 power → base steal of 0 (Cap A: 0-power direct attacks steal nothing).
    expect(engine.getGigCount(P1)).toBe(1);
    expect(engine.getGigCount(P2)).toBe(2);
  });
});
