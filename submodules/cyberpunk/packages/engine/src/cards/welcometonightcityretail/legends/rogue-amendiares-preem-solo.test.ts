import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailRogueAmendiaresPreemSolo,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, expectAttackCandidate } from "../../../testing/index.ts";

const rogue = welcomeToNightCityRetailRogueAmendiaresPreemSolo;

describe("Rogue Amendiares — Preem Solo", () => {
  it("is a yellow Merc GO SOLO legend", () => {
    expect(rogue).toMatchObject({
      type: "legend",
      color: "yellow",
      classifications: ["Merc"],
      printNumber: "040",
      cost: 7,
      power: 7,
    });
    expect(rogue.keywords).toContain("goSolo");
  });

  it("goes solo as a ready Unit that can attack this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: rogue, faceDown: false }],
      eddies: 7,
    });
    const id = engine.findCardId(rogue, "legendArea", P1);
    expect(engine.executeMove("goSolo", { args: { cardId: id as string } }, P1).success).toBe(true);
    expectAttackCandidate(engine, rogue, { as: P1 });
  });

  it("draws 1 when a friendly Legend steals an even Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: rogue, faceDown: false }],
        field: [
          {
            card: welcomeToNightCityRetailJackieWellesMamaSFavorite,
            spent: false,
            hasLag: false,
            faceDown: false,
          },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 7,
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
    );
    const handBefore = engine.getHandCount(P1);
    engine.attackRival(welcomeToNightCityRetailJackieWellesMamaSFavorite, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    expect(engine.getHandCount(P1)).toBe(handBefore + 1);
  });

  it("makes a Rival discard 1 when a friendly Legend steals an odd Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: rogue, faceDown: false }],
        field: [
          {
            card: welcomeToNightCityRetailJackieWellesMamaSFavorite,
            spent: false,
            hasLag: false,
            faceDown: false,
          },
        ],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        hand: [welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.attackRival(welcomeToNightCityRetailJackieWellesMamaSFavorite, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    expect(engine.getCardsInZone("hand", P2)).toHaveLength(0);
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("does not trigger when a friendly Unit that is not a Legend steals a Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: rogue, faceDown: false }],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        deck: [welcomeToNightCityRetailCorpoSecurity],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
    );
    const handBefore = engine.getHandCount(P1);
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    expect(engine.getHandCount(P1)).toBe(handBefore);
  });
});
