import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailEmergencyAtlus,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMantisBlades,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, expectAttachTarget } from "../../../testing/index.ts";

describe("Mantis Blades", () => {
  function getAttachTargets(engine: CyberpunkTestEngine): string[] {
    const gearId = engine.getCard(welcomeToNightCityRetailMantisBlades, "hand", P1).instanceId;
    const playMove = engine.getPrompt(P1).availableMoves.find((move) => move.moveId === "playCard");
    if (!playMove || playMove.inputSpec.type !== "playCard") return [];
    return (
      playMove.inputSpec.candidates.find((candidate) => candidate.cardId === gearId)
        ?.attachTargets ?? []
    );
  }

  it("is the exact 1-cost 2-power red Cyberware Gear", () => {
    expect(welcomeToNightCityRetailMantisBlades).toMatchObject({
      canonicalId: "mantis-blades",
      slug: "mantis-blades",
      name: "Mantis Blades",
      displayName: "Mantis Blades",
      type: "gear",
      color: "red",
      classifications: ["Cyberware"],
      cost: 1,
      power: 2,
      ram: 1,
      hasSellTag: true,
      printNumber: "025",
      rulesText: '(Equip to a friendly Unit or face-up Legend.)\n"One cut, one kill."',
      attachment: {
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["field", "legendArea"],
          cardTypes: ["unit", "legend"],
          face: "faceUp",
        },
      },
    });
  });

  it("offers only a friendly Unit and friendly face-up Legend as attachment hosts", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMantisBlades],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        legendArea: [
          { card: theHeistRetailStarterDeckVCorporateExile, faceDown: false },
          { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: true },
        ],
        eddies: 1,
      },
      { field: [{ card: welcomeToNightCityRetailEmergencyAtlus, spent: false }] },
    );

    expectAttachTarget(
      engine,
      welcomeToNightCityRetailMantisBlades,
      welcomeToNightCityRetailFieldOperator,
    );
    const attachTargets = getAttachTargets(engine);
    expect(attachTargets).toContain(
      engine.getCard(theHeistRetailStarterDeckVCorporateExile, "legendArea", P1).instanceId,
    );
    expect(attachTargets).not.toContain(
      engine.getCard(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, "legendArea", P1)
        .instanceId,
    );
    expect(attachTargets).not.toContain(
      engine.getCard(welcomeToNightCityRetailEmergencyAtlus, "field", P2).instanceId,
    );
  });

  it("pays one Eddie, records the attachment, and adds 2 power in a public fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMantisBlades],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        eddies: 1,
      },
      { field: [{ card: welcomeToNightCityRetailEmergencyAtlus, spent: true }] },
    );

    engine.attachGear(welcomeToNightCityRetailMantisBlades, welcomeToNightCityRetailFieldOperator, {
      as: P1,
    });

    const host = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    const gear = engine.getCard(welcomeToNightCityRetailMantisBlades, "field", P1);
    expect(engine.getEddies(P1)).toBe(0);
    expect(host.meta.attachedGearIds).toContain(gear.instanceId);
    expect(gear.meta.attachedToId).toBe(host.instanceId);

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailEmergencyAtlus,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailEmergencyAtlus.id,
    );
  });

  it("has no attachment target when the only friendly Legend is face-down", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailMantisBlades],
      legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: true }],
      eddies: 1,
    });

    expect(getAttachTargets(engine)).toEqual([]);
  });

  it("rejects a face-down friendly Legend and rival Unit without paying or moving the Gear", () => {
    const faceDownEngine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailMantisBlades],
      legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: true }],
      eddies: 1,
    });
    const faceDownFailure = faceDownEngine.expectFailure(() =>
      faceDownEngine.attachGear(
        welcomeToNightCityRetailMantisBlades,
        theHeistRetailStarterDeckVCorporateExile,
        { as: P1 },
      ),
    );
    expect(faceDownFailure.errorCode).toBe("INVALID_CHOICE");
    expect(faceDownEngine.getEddies(P1)).toBe(1);
    expect(faceDownEngine.getCard(welcomeToNightCityRetailMantisBlades, "hand", P1)).toBeDefined();

    const rivalEngine = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailMantisBlades], eddies: 1 },
      { field: [{ card: welcomeToNightCityRetailEmergencyAtlus, spent: false }] },
    );
    const rivalFailure = rivalEngine.expectFailure(() =>
      rivalEngine.attachGear(
        welcomeToNightCityRetailMantisBlades,
        welcomeToNightCityRetailEmergencyAtlus,
        { as: P1 },
      ),
    );
    expect(rivalFailure.errorCode).toBe("INVALID_CHOICE");
    expect(rivalEngine.getEddies(P1)).toBe(1);
    expect(rivalEngine.getCard(welcomeToNightCityRetailMantisBlades, "hand", P1)).toBeDefined();
  });
});
