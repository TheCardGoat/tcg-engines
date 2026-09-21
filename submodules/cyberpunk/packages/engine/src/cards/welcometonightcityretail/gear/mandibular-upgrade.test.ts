import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  theHeistRetailStarterDeckVCorporateExile,
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMandibularUpgrade,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, expectAttachTarget } from "../../../testing/index.ts";

describe("Mandibular Upgrade", () => {
  function getAttachTargets(engine: CyberpunkTestEngine): string[] {
    const gearId = engine.getCard(welcomeToNightCityRetailMandibularUpgrade, "hand", P1).instanceId;
    const playMove = engine.getPrompt(P1).availableMoves.find((move) => move.moveId === "playCard");
    if (!playMove || playMove.inputSpec.type !== "playCard") return [];
    return (
      playMove.inputSpec.candidates.find((candidate) => candidate.cardId === gearId)
        ?.attachTargets ?? []
    );
  }

  it("is the exact 1-cost yellow Cyberware Gear that grants Blocker to its host", () => {
    expect(welcomeToNightCityRetailMandibularUpgrade).toMatchObject({
      canonicalId: "mandibular-upgrade",
      slug: "mandibular-upgrade",
      name: "Mandibular Upgrade",
      displayName: "Mandibular Upgrade",
      type: "gear",
      color: "yellow",
      classifications: ["Cyberware"],
      cost: 1,
      power: 0,
      ram: 2,
      hasSellTag: true,
      printNumber: "062",
      keywords: ["blocker"],
      rulesText:
        "(Equip to a friendly Unit or face-up Legend.)\n{Blocker} (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
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
    expect(welcomeToNightCityRetailMandibularUpgrade.abilities).toEqual([
      expect.objectContaining({
        keyword: "blocker",
        source: { selector: "host" },
      }),
    ]);
  });

  it("offers only a friendly Unit and friendly face-up Legend as attachment hosts", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMandibularUpgrade],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        legendArea: [
          { card: theHeistRetailStarterDeckVCorporateExile, faceDown: false },
          { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: true },
        ],
        eddies: 1,
      },
      { field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false }] },
    );

    expectAttachTarget(
      engine,
      welcomeToNightCityRetailMandibularUpgrade,
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
      engine.getCard(embracingPowerRetailStarterDeckMinotaur, "field", P2).instanceId,
    );
  });

  it("pays one Eddie and records both sides of the attachment graph", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailMandibularUpgrade],
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      eddies: 1,
    });

    engine.attachGear(
      welcomeToNightCityRetailMandibularUpgrade,
      welcomeToNightCityRetailFieldOperator,
      { as: P1 },
    );

    const host = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    const gear = engine.getCard(welcomeToNightCityRetailMandibularUpgrade, "field", P1);
    expect(engine.getEddies(P1)).toBe(0);
    expect(host.meta.attachedGearIds).toContain(gear.instanceId);
    expect(gear.meta.attachedToId).toBe(host.instanceId);
  });

  it("has no attach targets when there is no friendly Unit or face-up Legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailMandibularUpgrade],
      legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: true }],
      eddies: 1,
    });

    expect(getAttachTargets(engine)).toEqual([]);
  });

  it("rejects a face-down friendly Legend and rival Unit without paying or moving the Gear", () => {
    const faceDownEngine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailMandibularUpgrade],
      legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: true }],
      eddies: 1,
    });
    const faceDownFailure = faceDownEngine.expectFailure(() =>
      faceDownEngine.attachGear(
        welcomeToNightCityRetailMandibularUpgrade,
        theHeistRetailStarterDeckVCorporateExile,
        { as: P1 },
      ),
    );
    expect(faceDownFailure.errorCode).toBe("INVALID_CHOICE");
    expect(faceDownEngine.getEddies(P1)).toBe(1);
    expect(
      faceDownEngine.getCard(welcomeToNightCityRetailMandibularUpgrade, "hand", P1),
    ).toBeDefined();

    const rivalEngine = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailMandibularUpgrade], eddies: 1 },
      { field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false }] },
    );
    const rivalFailure = rivalEngine.expectFailure(() =>
      rivalEngine.attachGear(
        welcomeToNightCityRetailMandibularUpgrade,
        embracingPowerRetailStarterDeckMinotaur,
        { as: P1 },
      ),
    );
    expect(rivalFailure.errorCode).toBe("INVALID_CHOICE");
    expect(rivalEngine.getEddies(P1)).toBe(1);
    expect(
      rivalEngine.getCard(welcomeToNightCityRetailMandibularUpgrade, "hand", P1),
    ).toBeDefined();
  });

  it("grants BLOCKER to the attached host", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMandibularUpgrade],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        eddies: 1,
      },
      {
        field: [
          {
            card: embracingPowerRetailStarterDeckMinotaur,
            spent: false,
            hasLag: false,
          },
        ],
      },
    );

    engine.attachGear(
      welcomeToNightCityRetailMandibularUpgrade,
      welcomeToNightCityRetailFieldOperator,
      {
        as: P1,
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(embracingPowerRetailStarterDeckMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1).meta.spent).toBe(
      true,
    );
    expect(engine.getState().G.attackState).toMatchObject({ kind: "fight" });
  });
});
