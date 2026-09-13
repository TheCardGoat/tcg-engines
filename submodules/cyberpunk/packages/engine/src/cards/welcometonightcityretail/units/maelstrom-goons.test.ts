import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailMaelstromGoons,
  welcomeToNightCityRetailMandibularUpgrade,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const goons = welcomeToNightCityRetailMaelstromGoons;

describe("Maelstrom Goons", () => {
  it("is a yellow Ganger/Maelstrom unit", () => {
    expect(goons).toMatchObject({
      type: "unit",
      color: "yellow",
      classifications: ["Ganger", "Maelstrom"],
      cost: 3,
      power: 3,
      printNumber: "049",
    });
  });

  it("makes a Rival discard 1 when it steals a Gig while equipped", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: goons,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
          },
        ],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        hand: [welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.attackRival(goons, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getCardsInZone("hand", P2)).toHaveLength(0);
  });

  it("does not discard when it steals a Gig unequipped", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: goons, spent: false, hasLag: false }],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        hand: [welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.attackRival(goons, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getCardsInZone("hand", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });
});
