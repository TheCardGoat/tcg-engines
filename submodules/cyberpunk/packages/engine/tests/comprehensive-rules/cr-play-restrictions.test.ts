import { beforeAll, describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
  welcomeToNightCityRetailIndustrialAssembly,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailModdedKusanagi,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailPeaceOffering,
  welcomeToNightCityRetailPlacideVoodooSentinel,
  welcomeToNightCityRetailRebootOptics,
  welcomeToNightCityRetailSandevistan,
  welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
  welcomeToNightCityRetailViktorVektorDropYourIllusions,
  welcomeToNightCityRetailWestbrookNetrunner,
  welcomeToNightCityRetailYorinobuArasakaSteelDragon,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../src/active-effects/index.ts";
import { computeEffectiveCost } from "../../src/moves/compute-effective-cost.ts";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectNotAttackCandidate,
  registerMatchers,
} from "../../src/testing/index.ts";
import "../../src/testing/matchers.d.ts";
import { cover } from "./covered-rules.ts";

beforeAll(() => {
  registerMatchers();
});

describe("CR real-card: play restrictions, prevent-defeat, cost min, start of turn", () => {
  it("prevents a fight defeat but still records the protected Unit as the loser", () => {
    cover("9.19.3");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRebootOptics],
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
      },
    );
    engine.playCard(welcomeToNightCityRetailRebootOptics, { as: P1 });
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P2 },
    );
    engine.resolveFullFight({ as: P2 });
    expect(
      engine
        .getCardsInZone("field", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailCorpoSecurity.id),
    ).toBe(true);
    expect(engine.getLastActionLog()).toMatchObject({
      messageKey: "move.resolveAttack.fight.attackerWins.prevented",
      params: { sourceCardName: "Reboot Optics" },
    });
  });

  it("keeps Corpo Security from attacking even after Lag is gone", () => {
    cover("9.3.2.3", "10.22", "10.22.1", "10.22.2", "10.4.3");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false, hasLag: false }],
      },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );
    expectNotAttackCandidate(engine, welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    const failure = engine.expectFailure(() =>
      engine.attackRival(welcomeToNightCityRetailCorpoSecurity, { as: P1 }),
    );
    expect(failure.success).toBe(false);
  });

  it("plays a Unit from trash for free but only grants that attack permission", () => {
    cover("11.4.2", "11.4.3", "9.3.2.3.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailYorinobuArasakaSteelDragon],
        trash: [welcomeToNightCityRetailFieldOperator],
        eddies: 7,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );
    const fromTrash = engine.executeMove(
      "playCard",
      {
        args: {
          cardId: engine.findCardId(welcomeToNightCityRetailFieldOperator, "trash", P1) as string,
        },
      },
      P1,
    );
    expect(fromTrash.success).toBe(false);
    if (fromTrash.success) throw new Error("expected play from trash to fail");
    expect(fromTrash.errorCode).toBe("CARD_NOT_IN_HAND");

    engine.playCard(welcomeToNightCityRetailYorinobuArasakaSteelDragon, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, {
      as: P1,
      zone: "trash",
    });
    expect(
      engine
        .getCardsInZone("field", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailFieldOperator.id),
    ).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
    const operatorId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(getEffectiveRules(engine.getState(), operatorId)).toContain(
      "canAttackOnPlayedTurnAgainstUnits",
    );
    expectNotAttackCandidate(engine, welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(() =>
      engine.attackUnit(
        welcomeToNightCityRetailFieldOperator,
        welcomeToNightCityRetailCorpoSecurity,
        { as: P1 },
      ),
    ).not.toThrow();
  });

  it("resolves start-of-turn value-pair draws before the normal draw", () => {
    cover("8.4.1", "8.6.2", "8.6.2.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailDelamainCab,
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailMoxInciters,
        ],
        legendArea: [
          {
            card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
            faceDown: false,
          },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      {},
      { activePlayerId: P2, autoGainGig: false, preserveDeckOrder: true },
    );
    engine.completeTurn({ as: P2 });
    // CR 6.5.1 prevents reusing one of the three equal Gigs in another pair.
    expect(engine.getHandCount(P1)).toBe(2);
  });

  it("removes until-next-turn effects at the start of the source player's next turn", () => {
    cover("8.6.2.1");
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailWestbrookNetrunner],
      eddies: 4,
    });
    engine.playCard(welcomeToNightCityRetailWestbrookNetrunner, { as: P1 });
    const westbrookId = engine.findCardId(welcomeToNightCityRetailWestbrookNetrunner, "field", P1);
    expect(getEffectiveRules(engine.getState(), westbrookId)).toContain("cantStealGigBelowPower");
    engine.completeTurn({ as: P1 });
    engine.completeTurn({ as: P2 });
    expect(getEffectiveRules(engine.getState(), westbrookId)).not.toContain(
      "cantStealGigBelowPower",
    );
  });

  it("reduces what you pay without changing printed cost, and not below 1 €$", () => {
    cover("11.8.2", "11.8.3", "11.1.2", "11.4.1.1", "3.11.1.2");
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: welcomeToNightCityRetailViktorVektorDropYourIllusions, spent: false }],
      hand: [welcomeToNightCityRetailSandevistan, welcomeToNightCityRetailFloorIt],
      eddies: 1,
    });
    engine.spendAllLegends();
    const gearId = engine.findCardId(welcomeToNightCityRetailSandevistan, "hand", P1);
    expect(welcomeToNightCityRetailSandevistan.cost).toBe(3);
    expect(computeEffectiveCost(engine.getState(), gearId, P1)).toBe(1);
    engine.attachGear(
      welcomeToNightCityRetailSandevistan,
      welcomeToNightCityRetailViktorVektorDropYourIllusions,
      { as: P1 },
    );
    expect(engine.getEddies(P1)).toBe(0);
    expect(welcomeToNightCityRetailSandevistan.cost).toBe(3);
    const unpaid = engine.expectFailure(() =>
      engine.playCard(welcomeToNightCityRetailFloorIt, { as: P1 }),
    );
    expect(unpaid.errorCode).toBe("INSUFFICIENT_EDDIES");
  });

  it("does not let Gig effects target fixer-area dice", () => {
    cover("5.10.4");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailIndustrialAssembly],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [],
        fixerDice: ["d8"],
      },
      {},
      { preserveDeckOrder: true, autoGainGig: false },
    );
    engine.spendAllLegends();
    expect(engine.getGigCount(P1)).toBe(0);
    expect(engine.getFixerDice(P1).some((die) => die.dieType === "d8")).toBe(true);
    engine.playCard(welcomeToNightCityRetailIndustrialAssembly, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice?.type === "chooseTarget") {
      expect(choice.payload.eligibleIds).toEqual([]);
      engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);
    }
    expect(engine.getFixerDice(P1).some((die) => die.dieType === "d8")).toBe(true);
    expect(
      engine
        .getCardsInZone("hand", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailCorpoSecurity.id),
    ).toBe(false);
  });

  it("steals every remaining Gig when the attacker would steal more than are present", () => {
    cover("9.23.3.3", "5.12.4.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailModdedKusanagi,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailMantisBlades],
          },
        ],
      },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );
    const d4 = engine.findGigIdByType(P2, "d4");
    engine.attackRival(welcomeToNightCityRetailModdedKusanagi, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    expect(engine.getGigDice(P1).map((die) => die.id)).toContain(d4);
    expect(engine.getGigCount(P2)).toBe(0);
    expect(engine.getAttackState()).toBeNull();
  });

  it("applies steal restrictions after Gigs are chosen", () => {
    cover("9.23.4");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailWestbrookNetrunner],
        eddies: 4,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailJackieWellesMamaSFavorite,
            spent: false,
            hasLag: false,
          },
        ],
      },
    );
    engine.playCard(welcomeToNightCityRetailWestbrookNetrunner, { as: P1 });
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailJackieWellesMamaSFavorite, { as: P2 });
    engine.resolveFullSteal({ as: P2 });
    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d4");
    expect(engine.getGigDice(P2).map((die) => die.dieType)).not.toContain("d4");
  });

  it("sets a Gig to another Gig's value", () => {
    cover("6.4.3", "10.31.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPeaceOffering],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [
          { dieType: "d4", faceValue: 4 },
          { dieType: "d6", faceValue: 5 },
        ],
      },
      {},
      { preserveDeckOrder: true },
    );
    engine.playCard(welcomeToNightCityRetailPeaceOffering, { as: P1 });
    const d4 = engine.getGigDice(P1).find((die) => die.dieType === "d4");
    const d6 = engine.getGigDice(P1).find((die) => die.dieType === "d6");
    expect(d4).toBeDefined();
    expect(d6).toBeDefined();
    const pending = engine.getState().G.turnMetadata.pendingChoice;
    expect(pending?.type).toBe("chooseTarget");
    if (pending?.type === "chooseTarget") {
      expect(pending.payload.min).toBe(2);
      expect(pending.payload.max).toBe(2);
    }
    const tooFew = engine.expectFailure(() => engine.resolveEffectTargetIds([d4!.id], { as: P1 }));
    expect(tooFew.errorCode).toBe("INVALID_AMOUNT");
    engine.resolveEffectTargetIds([d4!.id, d6!.id], { as: P1 });
    expect(engine.getGigDice(P1).find((die) => die.id === d6!.id)?.faceValue).toBe(4);
    expect(engine.getGigDice(P1).find((die) => die.id === d4!.id)?.faceValue).toBe(4);
  });

  it("removes a GO SOLO Legend from the game instead of leaving it in trash", () => {
    cover("4.4", "4.4.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
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
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 8 }],
      },
    );
    engine.attackUnit(
      welcomeToNightCityRetailJackieWellesMamaSFavorite,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });
    expect(
      engine
        .getCardsInZone("field", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailJackieWellesMamaSFavorite.id),
    ).toBe(false);
    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailJackieWellesMamaSFavorite.id),
    ).toBe(false);
    expect(
      engine
        .getCardsInZone("legendArea", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailJackieWellesMamaSFavorite.id),
    ).toBe(false);
    expect(
      engine
        .getCardsInZone("removedFromGame", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailJackieWellesMamaSFavorite.id),
    ).toBe(true);
  });

  it("keeps a GO SOLO {Defeated} pending after the Legend is already removed", () => {
    cover("4.4.2", "5.13.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        hand: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailIndustrialAssembly],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
            spent: true,
            hasLag: false,
            faceDown: false,
          },
        ],
      },
    );
    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });
    expect(
      engine
        .getCardsInZone("removedFromGame", P2)
        .some((c) => c.definitionId === welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("trash", P2)
        .some((c) => c.definitionId === welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown.id),
    ).toBe(false);
    const p1View = engine.getFilteredView(P1);
    const rfg = p1View.players[P2 as string]?.zones.removedFromGame;
    expect(Array.isArray(rfg)).toBe(true);
    const publicRfg = (rfg as { definitionId: string; cardName: string | null }[]).find(
      (card) => card.definitionId === welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown.id,
    );
    expect(publicRfg).toBeDefined();
    expect(publicRfg?.cardName).toBeTruthy();
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
    engine.resolveDiscardFromHand([welcomeToNightCityRetailFloorIt], { as: P1 });
    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailFloorIt.id),
    ).toBe(true);
  });

  it("continues automatically when an equipped host and its Gear enter trash together", () => {
    // Trash order has no observable effect in the current card pool, and CR
    // 5.9.4.2 lets the owner freely rearrange it afterward. Do not interrupt
    // resolution solely to ask for an equivalent ordering choice.
    cover("4.12");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailSandevistan],
          },
        ],
      },
      {
        field: [
          { card: welcomeToNightCityRetailPlacideVoodooSentinel, spent: true, hasLag: false },
        ],
      },
    );
    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailPlacideVoodooSentinel,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });
    const hostId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "trash", P1);
    const gearId = engine.findCardId(welcomeToNightCityRetailSandevistan, "trash", P1);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.instanceId)).toEqual([
      gearId,
      hostId,
    ]);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("does not put a GO SOLO host back into trash when its attached Gear moves there", () => {
    cover("4.4.1", "5.9.4.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        hand: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailIndustrialAssembly],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
            spent: true,
            hasLag: false,
            faceDown: false,
            attachedGears: [
              welcomeToNightCityRetailSandevistan,
              welcomeToNightCityRetailMantisBlades,
            ],
          },
        ],
      },
    );
    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });
    expect(
      engine
        .getCardsInZone("removedFromGame", P2)
        .some((c) => c.definitionId === welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("trash", P2)
        .some((c) => c.definitionId === welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown.id),
    ).toBe(false);
    expect(
      engine
        .getCardsInZone("removedFromGame", P2)
        .some((c) => c.definitionId === welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("trash", P2)
        .some((c) => c.definitionId === welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown.id),
    ).toBe(false);
    expect(engine.getCardsInZone("trash", P2)).toHaveLength(2);
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
  });
});
