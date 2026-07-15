import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailJackieWellesRideOrDieChoom,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailSketchyRipper,
  welcomeToNightCityRetailTBugAmateurPhilosopher,
  theHeistRetailStarterDeckVCorporateExile,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, registerMatchers } from "../src/testing/index.ts";

registerMatchers();

const highCredGigs: { dieType: "d6" | "d8"; faceValue: number }[] = [
  { dieType: "d8", faceValue: 4 },
  { dieType: "d6", faceValue: 3 },
];

describe("manual trigger resolution", () => {
  it("prompts the controller to choose among multiple ATTACK triggers", () => {
    // Satori intentionally omitted — its trigger fires on `fightResolved`
    // (post-fight), not on attack declaration. See packages/types/src/index.ts
    // FightResolvedEvent.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailTBugAmateurPhilosopher,
            spent: false,
            attachedGears: [
              welcomeToNightCityRetailKiroshiOptics,
              welcomeToNightCityRetailDyingNightVSPistol,
            ],
          },
        ],
        legendArea: [theHeistRetailStarterDeckVCorporateExile],
        gigArea: highCredGigs,
      },
      {
        field: [
          { card: welcomeToNightCityRetailJackieWellesRideOrDieChoom, spent: true },
          {
            card: welcomeToNightCityRetailSketchyRipper,
            spent: false,
            attachedGears: [welcomeToNightCityRetailKiroshiOptics],
          },
        ],
      },
    );

    engine.attackUnit(
      welcomeToNightCityRetailTBugAmateurPhilosopher,
      welcomeToNightCityRetailJackieWellesRideOrDieChoom,
    );

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTrigger") {
      throw new Error("Expected chooseTrigger");
    }
    expect(choice.payload.options.map((option) => option.cardName).sort()).toEqual([
      "Dying Night — V's Pistol",
      "Kiroshi Optics",
    ]);
    expect(engine.getState().G.attackState?.step).toBe("attack");
  });
});
