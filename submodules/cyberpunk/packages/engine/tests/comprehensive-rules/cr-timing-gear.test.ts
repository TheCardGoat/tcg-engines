import { beforeAll, describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  theHeistRetailStarterDeckViktorVektorSitDownAndRelax,
  welcomeToNightCityRetailArasakaEmergencyRadioport,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDexterDeshawnOffTheGrid,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailGunpointDiplomacy,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailModdedKusanagi,
  welcomeToNightCityRetailPanamPalmerNomadCavalry,
  welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
  welcomeToNightCityRetailSecondhandBombus,
  welcomeToNightCityRetailSketchyRipper,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailTBugAmateurPhilosopher,
  welcomeToNightCityRetailZetatechFaceplate,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../src/active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2, registerMatchers } from "../../src/testing/index.ts";
import "../../src/testing/matchers.d.ts";
import { cover } from "./covered-rules.ts";
import { passTurn } from "./helpers.ts";

beforeAll(() => {
  registerMatchers();
});

describe("CR real-card: timing, gear, free play, defeat", () => {
  it("returns Modded Kusanagi to hand at end of turn", () => {
    cover("8.16", "8.16.1", "8.16.2", "8.1.1", "8.5");
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: welcomeToNightCityRetailModdedKusanagi, hasLag: false }],
    });
    passTurn(engine, P1);
    expect(
      engine
        .getCardsInZone("field", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailModdedKusanagi.id),
    ).toBe(false);
    expect(
      engine
        .getCardsInZone("hand", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailModdedKusanagi.id),
    ).toBe(true);
  });

  it("strips modifiers when a Unit enters a hidden area", () => {
    cover("5.3.2.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailGunpointDiplomacy],
        field: [{ card: welcomeToNightCityRetailModdedKusanagi, hasLag: false }],
        eddies: 4,
        gigArea: [{ dieType: "d10", faceValue: 8 }],
      },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );
    const kusanagiId = engine.findCardId(welcomeToNightCityRetailModdedKusanagi, "field", P1);
    engine.playCard(welcomeToNightCityRetailGunpointDiplomacy, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailModdedKusanagi, { as: P1 });
    expect(getEffectivePower(engine.getState(), kusanagiId as string)).toBe(
      (welcomeToNightCityRetailModdedKusanagi.power ?? 0) + 3,
    );
    passTurn(engine, P1);
    const inHand = engine.getCard(welcomeToNightCityRetailModdedKusanagi, "hand", P1);
    expect(inHand.meta.powerModifier).toBe(0);
    expect(
      engine.getState().G.activeEffects.some((effect) => effect.targetCardId === inHand.instanceId),
    ).toBe(false);
  });

  it("lets only the effect controller look at a face-down Legend, then hides it again", () => {
    cover("11.14.4", "5.7.4.3");
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [welcomeToNightCityRetailArasakaEmergencyRadioport],
        },
      ],
      legendArea: [{ card: welcomeToNightCityRetailDexterDeshawnOffTheGrid, faceDown: true }],
    });
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailDexterDeshawnOffTheGrid, { as: P1 });
    const looked = engine.getCard(
      welcomeToNightCityRetailDexterDeshawnOffTheGrid,
      "legendArea",
      P1,
    );
    expect(looked.meta.faceDown).toBe(true);
    expect(looked.meta.revealed).toBe(false);
    const p2View = engine.getFilteredView(P2);
    const rivalLegends = p2View.players[P1 as string]!.zones.legendArea as {
      cardName: string | null;
      revealed: boolean;
    }[];
    expect(rivalLegends.every((c) => !c.revealed && c.cardName === null)).toBe(true);
    const lookEvents = engine.getEvents("cardsRevealed");
    expect(lookEvents).toContainEqual(
      expect.objectContaining({ playerId: P1, cardIds: [looked.instanceId] }),
    );
    expect(lookEvents.some((event) => event.playerId === P2)).toBe(false);
  });

  it("does not treat Null Street Cred as even or odd", () => {
    cover("2.10.2", "5.11.4.1", "5.11.4.2", "10.3", "10.3.1", "10.3.3");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFieldOperator],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 3,
      },
      {},
      { preserveDeckOrder: true },
    );
    expect(engine.getGigCount(P1)).toBe(0);
    engine.playCard(welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(
      engine
        .getCardsInZone("hand", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailCorpoSecurity.id),
    ).toBe(false);
  });

  it("still draws when Floor It has no rival Unit to weaken", () => {
    cover("2.4", "10.2.1", "10.6", "10.6.2", "11.5.2", "11.5.2.1", "3.18.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFloorIt],
        deck: [welcomeToNightCityRetailSketchyRipper],
        eddies: 1,
      },
      {},
      { preserveDeckOrder: true },
    );
    engine.spendAllLegends();
    engine.playCard(welcomeToNightCityRetailFloorIt, { as: P1 });
    expect(
      engine
        .getCardsInZone("hand", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailSketchyRipper.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailFloorIt.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("hand", P2)
        .some((c) => c.definitionId === welcomeToNightCityRetailSketchyRipper.id),
    ).toBe(false);
  });

  it("fires DEFEATED when T-Bug loses a fight and lets you Call a Legend for free", () => {
    cover("11.19", "11.19.1", "11.19.2", "9.18", "9.20", "5.7.4.3", "11.8.4");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailTBugAmateurPhilosopher, hasLag: false }],
        legendArea: [
          { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: true },
        ],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 3 }] },
    );
    const eddiesBefore = engine.getEddies(P1);
    engine.attackUnit(
      welcomeToNightCityRetailTBugAmateurPhilosopher,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });
    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailTBugAmateurPhilosopher.id),
    ).toBe(true);
    expect(engine.getPrompt(P1).choice?.type).toBe("chooseTarget");
    engine.resolveEffectTarget(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, { as: P1 });
    expect(
      engine.getCard(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, "legendArea", P1).meta
        .faceDown,
    ).toBe(false);
    expect(engine.getEddies(P1)).toBe(eddiesBefore);
  });

  it("does not let a 0-power Unit defeat another Unit in a fight", () => {
    cover("9.19.2", "9.17.3", "9.19", "9.20");
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: welcomeToNightCityRetailSecondhandBombus, hasLag: false }] },
      { field: [{ card: welcomeToNightCityRetailSketchyRipper, spent: true }] },
    );
    engine.attackUnit(
      welcomeToNightCityRetailSecondhandBombus,
      welcomeToNightCityRetailSketchyRipper,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });
    expect(
      engine
        .getCardsInZone("field", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailSecondhandBombus.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("field", P2)
        .some((c) => c.definitionId === welcomeToNightCityRetailSketchyRipper.id),
    ).toBe(true);
  });

  it("plays a Gear for free from River Ward's Spend ability", () => {
    cover("11.8.4", "11.8.4.1", "11.1", "11.1.1", "11.1.1.1", "4.11", "4.11.1");
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailZetatechFaceplate],
      legendArea: [
        {
          card: welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
          faceDown: false,
          spent: false,
        },
      ],
    });
    engine.activateAbility(welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, 1, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailZetatechFaceplate, {
      as: P1,
      allowPendingChoice: true,
      reason: "River Ward still needs an attachment host",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
    expect(
      engine.getCard(welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, "legendArea", P1).meta
        .attachedGearIds,
    ).toHaveLength(1);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
  });

  it("moves Gear from a Legend onto a Unit", () => {
    cover("11.6.6", "4.12", "4.11.3", "4.11.3.1", "3.18.3");
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: true }],
      legendArea: [
        {
          card: welcomeToNightCityRetailPanamPalmerNomadCavalry,
          faceDown: false,
          spent: false,
          attachedGears: [welcomeToNightCityRetailKiroshiOptics],
        },
      ],
      eddies: 2,
    });
    engine.activateAbility(welcomeToNightCityRetailPanamPalmerNomadCavalry, 0, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailKiroshiOptics, { as: P1 });
    expect(
      engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.attachedGearIds,
    ).toHaveLength(1);
    expect(
      engine.getCard(welcomeToNightCityRetailPanamPalmerNomadCavalry, "legendArea", P1).meta
        .attachedGearIds,
    ).toHaveLength(0);
    expect(engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.spent).toBe(
      false,
    );
  });

  it("inherits equipped Gear ATTACK text on the host Unit", () => {
    cover(
      "4.11.2",
      "4.11.3",
      "4.11.3.1",
      "4.11.3.2",
      "3.18.3",
      "11.6.1.2",
      "11.6.3",
      "10.12",
      "10.16.2",
      "11.21.2",
      "11.21.2.1",
      "11.21.2.2",
      "11.17",
      "10.17",
    );
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailSwordwiseHuscle,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
          },
        ],
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );
    engine.attackUnit(
      welcomeToNightCityRetailSwordwiseHuscle,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTrigger");
  });

  it("bottom-decks unchosen search cards", () => {
    cover("11.12", "11.12.1", "11.12.1.1", "11.12.1.3", "11.13.3", "5.5.7");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          { card: theHeistRetailStarterDeckViktorVektorSitDownAndRelax, faceDown: true },
        ],
        deck: [
          welcomeToNightCityRetailDyingNightVSPistol,
          welcomeToNightCityRetailMantisBlades,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );
    engine.spendAllLegends();
    const deckBefore = engine.getCardsInZone("deck", P1).length;
    engine.callLegend(theHeistRetailStarterDeckViktorVektorSitDownAndRelax, { as: P1 });
    engine.resolveScryTo("hand", [welcomeToNightCityRetailDyingNightVSPistol], { as: P1 });
    expect(engine.getCardsInZone("deck", P1).length).toBe(deckBefore - 1);
    expect(
      engine
        .getCardsInZone("hand", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailDyingNightVSPistol.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("deck", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailMantisBlades.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("deck", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailCorpoSecurity.id),
    ).toBe(true);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("lets the attacker choose which Gig to steal", () => {
    cover("9.23.3", "9.23.3.1", "9.23.3.2", "6.7.2.1", "6.7.2.3", "5.12.1", "5.12.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, hasLag: false }] },
      {
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d12", faceValue: 12 },
        ],
      },
    );
    const d12 = engine.findGigIdByType(P2, "d12");
    engine.attackRival(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1, gigIdsToSteal: [d12] });
    expect(engine.getGigDice(P1).map((die) => die.id)).toContain(d12);
    expect(engine.getGigDice(P2).map((die) => die.dieType)).toContain("d4");
  });
});
