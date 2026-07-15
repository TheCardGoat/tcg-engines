import { describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckJackieWellesPourOneOutForMe,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

function expectPendingTargetPayloadType(
  engine: CyberpunkTestEngine,
  payloadType: "adjustGig" | "effectTarget",
): void {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("chooseTarget");
  if (!choice || choice.type !== "chooseTarget") {
    throw new Error("Expected a chooseTarget pending choice.");
  }
  expect(choice.payload.type).toBe(payloadType);
}

describe("Jackie Welles - Pour One Out For Me (The Heist retail starter)", () => {
  it("decreases a friendly Gig after the first blue Unit play and draws when it becomes min", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailDelamainCab],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        legendArea: [
          { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 3 }],
        eddies: 4,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveAdjustGig(1, { as: P1 });

    expect(engine.getGigValue(P1)).toBe(1);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("does not open a target choice when a blue card is played with no friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailDelamainCab],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      legendArea: [{ card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: false }],
      eddies: 4,
    });

    engine.playCard(welcomeToNightCityRetailDelamainCab, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("does not trigger again when a blue Program is played after the first blue Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailDelamainCab, welcomeToNightCityRetailFloorIt],
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailMoxInciters],
        legendArea: [
          { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 3 }],
        eddies: 5,
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, hasLag: false }],
      },
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveAdjustGig(1, { as: P1 });
    expect(engine.getGigValue(P1)).toBe(1);

    engine.playCard(welcomeToNightCityRetailFloorIt, { as: P1 });
    expectPendingTargetPayloadType(engine, "effectTarget");
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getGigValue(P1)).toBe(1);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFloorIt.id,
    );
  });

  it("still triggers on the first blue Unit when a blue Program was played first", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailDelamainCab],
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailMoxInciters],
        legendArea: [
          { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 3 }],
        eddies: 5,
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, hasLag: false }],
      },
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailFloorIt, { as: P1 });
    expectPendingTargetPayloadType(engine, "effectTarget");
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });
    expect(engine.getGigValue(P1)).toBe(3);

    engine.playCard(welcomeToNightCityRetailDelamainCab, { as: P1 });
    expectPendingTargetPayloadType(engine, "adjustGig");
    engine.resolveAdjustGig(1, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getGigValue(P1)).toBe(1);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
  });
});
