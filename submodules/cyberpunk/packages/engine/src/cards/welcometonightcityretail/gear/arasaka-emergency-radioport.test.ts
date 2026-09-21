import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  embracingPowerRetailStarterDeckMinotaur,
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailAdamSmasherEnderOfLegends,
  welcomeToNightCityRetailArasakaEmergencyRadioport,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailDexterDeshawnOffTheGrid,
  welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailOffdutyMalfini,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";
import { getEffectivePower } from "../../../active-effects/index.ts";

const radioport = welcomeToNightCityRetailArasakaEmergencyRadioport;

describe("Arasaka Emergency Radioport", () => {
  it("is a red Arasaka/Cyberware gear", () => {
    expect(radioport).toMatchObject({
      type: "gear",
      color: "red",
      classifications: ["Arasaka", "Cyberware"],
      cost: 2,
      power: 2,
      ram: 2,
      hasSellTag: true,
      printNumber: "023",
      reminderText: ["You may only Call a Legend once per turn."],
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
    expect(radioport.abilities).toHaveLength(1);
  });

  it("costs 2 and equips a friendly Unit or face-up Legend, but not a face-down Legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [radioport],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        legendArea: [
          { card: theHeistRetailStarterDeckVCorporateExile, faceDown: false },
          { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: true },
        ],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false }],
      },
    );
    const prompt = engine.getPrompt(P1);
    const gearId = engine.getCard(radioport, "hand", P1).instanceId;
    const playMove = prompt.availableMoves.find((move) => move.moveId === "playCard");
    if (!playMove || playMove.inputSpec.type !== "playCard") {
      throw new Error("Expected the public play-card command to be available");
    }
    const candidate = playMove.inputSpec.candidates.find((entry) => entry.cardId === gearId);
    const friendlyUnitId = engine.getCard(
      welcomeToNightCityRetailFieldOperator,
      "field",
      P1,
    ).instanceId;
    const faceUpLegendId = engine.getCard(
      theHeistRetailStarterDeckVCorporateExile,
      "legendArea",
      P1,
    ).instanceId;
    const faceDownLegendId = engine.getCard(
      embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
      "legendArea",
      P1,
    ).instanceId;
    const rivalUnitId = engine.getCard(
      welcomeToNightCityRetailOffdutyMalfini,
      "field",
      P2,
    ).instanceId;

    expect(candidate?.attachTargets).toEqual(
      expect.arrayContaining([friendlyUnitId, faceUpLegendId]),
    );
    expect(candidate?.attachTargets).not.toEqual(
      expect.arrayContaining([faceDownLegendId, rivalUnitId]),
    );

    engine.attachGear(radioport, welcomeToNightCityRetailFieldOperator, { as: P1 });

    const host = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(engine.getEddies(P1)).toBe(0);
    expect(host.meta.attachedGearIds).toContain(gearId);
    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(
      welcomeToNightCityRetailFieldOperator.power + 2,
    );
  });

  it("when the host is spent, can look at and free-call a face-down GO SOLO Legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [radioport],
        },
      ],
      legendArea: [
        { card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: true },
        { card: theHeistRetailStarterDeckVCorporateExile, faceDown: false },
      ],
      eddies: 0,
    });

    const eddiesBefore = engine.getEddies(P1);
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    const lookChoice = engine.getPrompt(P1).choice;
    const jackieId = engine.getCard(
      welcomeToNightCityRetailJackieWellesMamaSFavorite,
      "legendArea",
      P1,
    ).instanceId;
    expect(lookChoice).toMatchObject({
      type: "chooseTarget",
      payload: { eligibleIds: [jackieId], min: 0, max: 1 },
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailJackieWellesMamaSFavorite, {
      as: P1,
      allowPendingChoice: true,
      reason: "the independent optional Call decision follows the look decision",
    });

    expect(engine.getPrompt(P1).choice).toMatchObject({
      type: "chooseTarget",
      payload: {
        min: 1,
        max: 1,
        canDecline: true,
      },
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailJackieWellesMamaSFavorite, { as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailJackieWellesMamaSFavorite, "legendArea", P1).meta
        .faceDown,
    ).toBe(false);
    expect(engine.getEddies(P1)).toBe(eddiesBefore);
    expect(engine.getEvents("actionLog")).toContainEqual(
      expect.objectContaining({ messageKey: "effect.callLegend.free", playerId: P1 }),
    );
    expect(engine.getEvents("legendCalled")).toEqual([
      expect.objectContaining({
        cardId: engine.getCard(welcomeToNightCityRetailJackieWellesMamaSFavorite, "legendArea", P1)
          .instanceId,
        playerId: P1,
      }),
    ]);
  });

  it("may decline to look at a Legend and does not offer a Call", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [radioport],
        },
      ],
      legendArea: [{ card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: true }],
    });

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);

    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(engine.getEvents("cardsRevealed")).toHaveLength(0);
    expect(engine.getEvents("legendCalled")).toHaveLength(0);
  });

  it("can free-call a face-down ARASAKA Legend without GO SOLO", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [radioport],
        },
      ],
      legendArea: [
        { card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor, faceDown: true },
      ],
      eddies: 0,
    });

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor, {
      as: P1,
      allowPendingChoice: true,
      reason: "the independent optional Call decision follows the look decision",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor, {
      as: P1,
    });

    expect(
      engine.getCard(welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor, "legendArea", P1)
        .meta.faceDown,
    ).toBe(false);
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("may look at a qualifying Legend and decline to Call it", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [radioport],
        },
      ],
      legendArea: [{ card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: true }],
      eddies: 0,
    });

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailJackieWellesMamaSFavorite, {
      as: P1,
      allowPendingChoice: true,
      reason: "the independent optional Call decision follows the look decision",
    });

    const selectedLegendId = engine.getCard(
      welcomeToNightCityRetailJackieWellesMamaSFavorite,
      "legendArea",
      P1,
    ).instanceId;
    expect(engine.getEvents("cardsRevealed")).toEqual([
      expect.objectContaining({ cardIds: [selectedLegendId], playerId: P1 }),
    ]);
    engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);

    expect(
      engine.getCard(welcomeToNightCityRetailJackieWellesMamaSFavorite, "legendArea", P1).meta
        .faceDown,
    ).toBe(true);
    expect(engine.getEvents("legendCalled")).toHaveLength(0);
  });

  it("offers only one Call choice when the looked-at Legend is both ARASAKA and GO SOLO", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [radioport],
        },
      ],
      legendArea: [{ card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: true }],
    });

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailAdamSmasherEnderOfLegends, {
      as: P1,
      allowPendingChoice: true,
      reason: "the independent optional Call decision follows the look decision",
    });
    engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);

    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(
      engine.getCard(welcomeToNightCityRetailAdamSmasherEnderOfLegends, "legendArea", P1).meta
        .faceDown,
    ).toBe(true);
  });

  it("does not free-call a face-down Legend that is neither ARASAKA nor GO SOLO", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [radioport],
        },
      ],
      legendArea: [{ card: welcomeToNightCityRetailDexterDeshawnOffTheGrid, faceDown: true }],
    });

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailDexterDeshawnOffTheGrid, { as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailDexterDeshawnOffTheGrid, "legendArea", P1).meta
        .faceDown,
    ).toBe(true);
  });

  it("does not trigger when a different friendly Unit is spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [radioport],
        },
        { card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false },
      ],
      legendArea: [{ card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: true }],
    });

    engine.attackRival(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });

    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(engine.getEvents("cardsRevealed")).toHaveLength(0);
  });

  it("does not bypass the once-per-rival-turn defensive Call limit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailCorpoSecurity,
            spent: false,
            attachedGears: [radioport],
          },
        ],
        legendArea: [
          { card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: true },
          { card: theHeistRetailStarterDeckVCorporateExile, faceDown: true },
        ],
        eddies: 1,
      },
      {
        field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false }],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(embracingPowerRetailStarterDeckMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.callLegend(theHeistRetailStarterDeckVCorporateExile, { as: P1 });
    engine.useBlocker(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailJackieWellesMamaSFavorite, {
      as: P1,
    });

    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(
      engine.getCard(welcomeToNightCityRetailJackieWellesMamaSFavorite, "legendArea", P1).meta
        .faceDown,
    ).toBe(true);
  });
});
