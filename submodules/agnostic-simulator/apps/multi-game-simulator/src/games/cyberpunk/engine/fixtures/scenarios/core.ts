import type { Scenario } from "./types";
import {
  c,
  CyberpunkTestEngine,
  endGameOpponent,
  endGamePlayer,
  opponentBase,
  P1,
  P2,
  playerBase,
  scenarioSeed,
  skipGainGig,
  startBase,
  type PlayerFixture,
} from "./shared";

const mobileLedgerFriendlyLegends = [
  c.theHeistRetailStarterDeckVCorporateExile,
  c.welcomeToNightCityRetailVStreetkid,
  c.welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
] as const;

const mobileLedgerRivalLegends = [
  c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe,
  c.welcomeToNightCityRetailRoycePsychoOnTheEdge,
  c.welcomeToNightCityRetailPanamPalmerNomadCavalry,
] as const;

function mobileLedgerPlayer(legendCount: 0 | 1 | 2 | 3, opponent = false): PlayerFixture {
  const legends = opponent ? mobileLedgerRivalLegends : mobileLedgerFriendlyLegends;

  return {
    hand: opponent
      ? [c.welcomeToNightCityRetailHanakoArasakaInAGildedCage]
      : [c.welcomeToNightCityRetailFloorIt, c.welcomeToNightCityRetailMoxInciters],
    field: opponent
      ? [
          { card: c.welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false },
          { card: c.embracingPowerRetailStarterDeckMinotaur, spent: true, hasLag: false },
        ]
      : [
          { card: c.welcomeToNightCityRetailSketchyRipper, spent: false, hasLag: false },
          {
            card: c.welcomeToNightCityRetailElSombreronLaVenganzaLenta,
            spent: false,
            hasLag: false,
          },
        ],
    legendArea: legends.slice(0, legendCount).map((card, index) => ({
      card,
      faceDown: legendCount === 3 ? false : index !== 0,
    })),
    eddies: opponent ? 5 : 9,
    gigArea: opponent
      ? [
          { dieType: "d6", faceValue: 3 },
          { dieType: "d4", faceValue: 1 },
          { dieType: "d12", faceValue: 3 },
        ]
      : [
          { dieType: "d4", faceValue: 4 },
          { dieType: "d12", faceValue: 12 },
        ],
  };
}

function mobileLedgerScenario(legendCount: 0 | 1 | 2 | 3) {
  if (legendCount === 0) {
    return mobileLedgerMixedScenario(0, 0, "mobileLedgerZeroLegends");
  }
  if (legendCount === 1) {
    return mobileLedgerMixedScenario(1, 1, "mobileLedgerOneLegend");
  }
  if (legendCount === 2) {
    return mobileLedgerMixedScenario(2, 2, "mobileLedgerTwoLegends");
  }
  return mobileLedgerMixedScenario(3, 3, "mobileLedgerThreeLegends");
}

function mobileLedgerMixedScenario(
  friendlyLegendCount: 0 | 1 | 2 | 3,
  rivalLegendCount: 0 | 1 | 2 | 3,
  seedId:
    | "mobileLedgerZeroLegends"
    | "mobileLedgerOneLegend"
    | "mobileLedgerTwoLegends"
    | "mobileLedgerThreeLegends"
    | "mobileLedgerFriendlyOneRivalThree"
    | "mobileLedgerFriendlyZeroRivalTwo",
) {
  return CyberpunkTestEngine.createWithFixture(
    mobileLedgerPlayer(friendlyLegendCount),
    mobileLedgerPlayer(rivalLegendCount, true),
    {
      seed: scenarioSeed(seedId),
      autoGainGig: false,
    },
  );
}

export const coreScenarios: Scenario[] = [
  {
    id: "gigWinThreatHud",
    group: "core",
    label: "Gig win threat · HUD",
    description:
      "V2 visual fixture with eight rival Gigs, including two stolen dice, before the rival turn-start win check.",
    build: () => {
      const gigs: NonNullable<PlayerFixture["gigArea"]> = [
        { dieType: "d4", faceValue: 1 },
        { dieType: "d6", faceValue: 2 },
        { dieType: "d8", faceValue: 3 },
        { dieType: "d10", faceValue: 4 },
        { dieType: "d12", faceValue: 5 },
        { dieType: "d20", faceValue: 6 },
        { dieType: "d4", faceValue: 2, source: "rival" },
        { dieType: "d6", faceValue: 3, source: "rival" },
      ];
      return CyberpunkTestEngine.createWithFixture(
        {
          ...mobileLedgerPlayer(3),
          gigArea: [
            { dieType: "d8", faceValue: 3 },
            { dieType: "d10", faceValue: 4 },
            { dieType: "d12", faceValue: 5 },
            { dieType: "d20", faceValue: 6 },
          ],
        },
        { ...mobileLedgerPlayer(3, true), gigArea: gigs },
        { seed: scenarioSeed("gigWinThreatHud"), autoGainGig: false },
      );
    },
  },
  // ── Core scenarios ──────────────────────────────────────────────────────
  {
    id: "paymentQuickAbilityQa",
    group: "core",
    label: "Payment · QUICK ability",
    description: "Dum Dum can spend itself and pay one Eddie for its QUICK ability.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          field: [
            {
              card: c.welcomeToNightCityRetailTBugAmateurPhilosopher,
              spent: false,
              attachedGears: [c.welcomeToNightCityRetailKiroshiOptics],
            },
          ],
          legendArea: [
            { card: c.welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: false },
          ],
          eddies: 2,
        },
        { eddies: 0 },
        { seed: scenarioSeed("paymentQuickAbilityQa"), autoGainGig: false },
      ),
  },
  {
    id: "paymentAllResourcesQa",
    group: "core",
    label: "Payment · Full resource pool",
    description: "A 3 €$ card with two ready Eddies and one spendable Legend.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailMoxInciters],
          legendArea: [{ card: c.welcomeToNightCityRetailVStreetkid, faceDown: true }],
          eddies: 2,
        },
        { eddies: 0 },
        { seed: scenarioSeed("paymentAllResourcesQa"), autoGainGig: false },
      ),
  },
  {
    id: "paymentFullEddiesQa",
    group: "core",
    label: "Payment · Eddies with Legends available",
    description: "A 5 €$ card with five ready Eddies and three spendable Legends.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailMaxtacSuppressionTeam],
          legendArea: [
            { card: c.welcomeToNightCityRetailVStreetkid, faceDown: true },
            { card: c.welcomeToNightCityRetailJackieWellesRideOrDieChoom, faceDown: true },
            { card: c.welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: true },
          ],
          eddies: 5,
        },
        { eddies: 0 },
        { seed: scenarioSeed("paymentFullEddiesQa"), autoGainGig: false },
      ),
  },
  {
    id: "paymentOnlyEddiesQa",
    group: "core",
    label: "Payment · Spent Legends",
    description: "A 3 €$ card, four ready Eddies, and a spent Legend.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailMoxInciters],
          legendArea: [{ card: c.welcomeToNightCityRetailVStreetkid, faceDown: true }],
          eddies: 4,
        },
        { eddies: 0 },
        { seed: scenarioSeed("paymentOnlyEddiesQa"), autoGainGig: false },
      );
      engine.judgeSpendCard(c.welcomeToNightCityRetailVStreetkid, { as: P1 });
      return engine;
    },
  },
  {
    id: "paymentPhysicalEddiesQa",
    group: "core",
    label: "Payment · Physical Eddie pool",
    description:
      "A 3 €$ card, one sold Eddie card in a shallow pool, and three spendable Legends — like a real game, every pool Eddie has a card.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [
            c.welcomeToNightCityRetailMoxInciters,
            c.welcomeToNightCityRetailAfterpartyAtLizzieS,
          ],
          legendArea: [
            { card: c.welcomeToNightCityRetailVStreetkid, faceDown: true },
            { card: c.welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: true },
            { card: c.theHeistRetailStarterDeckVCorporateExile, faceDown: true },
          ],
          eddies: 0,
        },
        { eddies: 0 },
        { seed: scenarioSeed("paymentPhysicalEddiesQa"), autoGainGig: false },
      );
      // Selling turns the card into a physical, ready Eddie and bumps the
      // pool to 1 — the real-game shape where automatic payment must remain
      // available even though no pool Eddie is "virtual".
      engine.sellCard(c.welcomeToNightCityRetailAfterpartyAtLizzieS, { as: P1 });
      return engine;
    },
  },
  {
    id: "boardTappedResourcesQa",
    group: "core",
    label: "Setup · tapped (spent) legends and eddies",
    description:
      "P1 has one spent face-up Legend, one ready face-up Legend, one face-down Legend, plus ready and spent Eddies. Visual QA for the tapped (rotated) rendering of spent resources.",
    build: () => {
      // Fixture application resets legendArea cards to ready, so the spent
      // Legend is applied afterwards via the judge move.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailAfterpartyAtLizzieS],
          field: [
            { card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false },
            { card: c.welcomeToNightCityRetailCorpoSecurity, spent: true },
          ],
          legendArea: [
            { card: c.theHeistRetailStarterDeckVCorporateExile, faceDown: false },
            { card: c.welcomeToNightCityRetailVStreetkid, faceDown: false, spent: false },
            { card: c.promoLucynaKushinada, faceDown: true },
          ],
          eddies: 4,
          spentEddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.welcomeToNightCityRetailCorpoSecurity, spent: true }],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
          eddies: 2,
          spentEddies: 2,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("boardTappedResourcesQa"), autoGainGig: false },
      );
      engine.judgeSpendCard(c.theHeistRetailStarterDeckVCorporateExile, { as: P1 });
      engine.sellCard(c.welcomeToNightCityRetailAfterpartyAtLizzieS, { as: P1 });
      return engine;
    },
  },
  {
    id: "gameStart",
    group: "core",
    label: "Setup · Very beginning",
    description:
      "Engine paused in the setup phase: 3 face-down legends per side, all 6 gig dice in the fixer, a 6-card opening hand, mulligan still available, eddies at 0. Validates the game-start state.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(startBase, startBase, {
        skipSetup: false,
        autoGainGig: false,
        seed: scenarioSeed("gameStart"),
      }),
  },
  {
    id: "firstPlayerChoice",
    group: "core",
    label: "Setup · Choose first player",
    description:
      "Engine paused before the first-player choice, with both players' presented Legends visible.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(startBase, startBase, {
        skipSetup: false,
        autoChooseFirstPlayer: false,
        autoGainGig: false,
        seed: scenarioSeed("firstPlayerChoice"),
      }),
  },
  {
    id: "retailCardCatalog",
    group: "core",
    label: "Retail · official card catalog",
    description:
      "P1 trash contains every official retail Cyberpunk card currently returned by the card scraper. Used to prove the simulator can hydrate the new card definitions.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          trash: [...c.structuredCards].filter((card) => card.type !== "legend"),
          legendArea: [...c.structuredCards]
            .filter((card) => card.type === "legend")
            .slice(0, 3)
            .map((card) => ({ card, faceDown: false })),
        },
        opponentBase,
        {
          seed: scenarioSeed("retailCardCatalog"),
          autoGainGig: false,
        },
      ),
  },
  {
    id: "trashProgramPreview",
    group: "core",
    label: "Trash · consecutive Programs",
    description:
      "Both Trash piles end with All is Lost and Over the Edge. Their previews must retain card size without power badges.",
    build: () => {
      const trash = [
        c.welcomeToNightCityRetailLaLloronaGhostOfThePast,
        c.welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
        c.welcomeToNightCityRetailAllIsLost,
        c.welcomeToNightCityRetailOverTheEdge,
      ];
      return CyberpunkTestEngine.createWithFixture(
        { ...playerBase, trash },
        { ...opponentBase, trash },
        { seed: "trash-program-preview", autoGainGig: false },
      );
    },
  },
  {
    id: "retailProgramTargetBench",
    group: "core",
    label: "Retail bench · programs and target checks",
    description:
      "P1 hand stages the main retail Programs against mixed friendly and rival boards: low-cost, high-cost, ready, spent, equipped, face-up Legend, and matching Gig values. The rival Corpo Security is an oversized spent fake defender so T-Bug can attack, be defeated, and exercise her private Legend-look trigger. Use this to quickly validate playable prompts, target highlights, no-target edges, Program discard behavior, and face-down Legend peeks across many cards.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [
            c.welcomeToNightCityRetailCorporateSurveillance,
            c.welcomeToNightCityRetailFloorIt,
            c.welcomeToNightCityRetailRebootOptics,
            c.welcomeToNightCityRetailAfterpartyAtLizzieS,
            c.welcomeToNightCityRetailChromeReverie,
            c.welcomeToNightCityRetailCyberpsychosis,
            c.welcomeToNightCityRetailTakeControl,
            c.welcomeToNightCityRetailFoolOnTheHill,
          ],
          field: [
            c.welcomeToNightCityRetailJackedInVoodooBoy,
            {
              card: c.welcomeToNightCityRetailTBugAmateurPhilosopher,
              spent: false,
              hasLag: false,
              attachedGears: [
                c.welcomeToNightCityRetailKiroshiOptics,
                c.welcomeToNightCityRetailDyingNightVSPistol,
              ],
            },
            { card: c.welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
            { card: c.welcomeToNightCityRetailMoxInciters, spent: true, hasLag: false },
          ],
          legendArea: [
            { card: c.welcomeToNightCityRetailVStreetkid, faceDown: false },
            { card: c.welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, faceDown: true },
            { card: c.welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, faceDown: true },
          ],
          eddies: 12,
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 4 },
            { dieType: "d8", faceValue: 5 },
          ],
          deck: [
            c.welcomeToNightCityRetailSketchyRipper,
            c.welcomeToNightCityRetailIndustrialAssembly,
            c.welcomeToNightCityRetailPeaceOffering,
          ],
        },
        {
          hand: [c.welcomeToNightCityRetailFoolOnTheHill],
          field: [
            {
              card: c.welcomeToNightCityRetailCorpoSecurity,
              spent: true,
              hasLag: false,
              powerModifier: 10,
            },
            {
              card: c.welcomeToNightCityRetailSecondhandBombus,
              spent: true,
              hasLag: false,
            },
            { card: c.embracingPowerRetailStarterDeckMinotaur, spent: true, hasLag: false },
            { card: c.welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false },
            c.welcomeToNightCityRetailAugmentedNegotiators,
          ],
          legendArea: [
            { card: c.welcomeToNightCityRetailPanamPalmerNomadCavalry, faceDown: false },
            { card: c.welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: true },
          ],
          eddies: 6,
          gigArea: [
            { dieType: "d4", faceValue: 4 },
            { dieType: "d10", faceValue: 9 },
          ],
        },
        {
          seed: scenarioSeed("retailProgramTargetBench"),
          preserveDeckOrder: true,
          autoGainGig: false,
        },
      ),
  },
  {
    id: "retailCombatGigBench",
    group: "core",
    label: "Retail bench · combat and Gig pressure",
    description:
      "Dense combat board with ready attackers, spent defenders, BLOCKER units, large power scaling, and uneven Gig areas. Use this to validate direct attacks, blocker reactions, stolen-Gig choices, Street Cred math, and attack-trigger cards in one place.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [
            c.welcomeToNightCityRetailCarnageAtTheColosseum,
            c.welcomeToNightCityRetailBootlegBlackSapphireShow,
            c.welcomeToNightCityRetailPeaceOffering,
            c.welcomeToNightCityRetailYorinobuArasakaSteelDragon,
            c.welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
          ],
          field: [
            {
              card: c.welcomeToNightCityRetailJackieWellesRideOrDieChoom,
              spent: false,
              hasLag: false,
            },
            {
              card: c.welcomeToNightCityRetailYorinobuArasakaSteelDragon,
              spent: false,
              hasLag: false,
            },
            {
              card: c.welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
              spent: false,
              hasLag: false,
              attachedGears: [c.welcomeToNightCityRetailSatoriSwordOfSaburo],
            },
            {
              card: c.welcomeToNightCityRetailEvelynParkerSchemingSiren,
              spent: false,
              hasLag: false,
            },
          ],
          legendArea: [
            { card: c.welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
            { card: c.welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: false },
            { card: c.welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience, faceDown: true },
          ],
          eddies: 10,
          trash: [c.welcomeToNightCityRetailHanakoArasakaInAGildedCage],
          gigArea: [
            { dieType: "d4", faceValue: 4 },
            { dieType: "d6", faceValue: 5 },
            { dieType: "d8", faceValue: 8 },
            { dieType: "d10", faceValue: 6 },
          ],
        },
        {
          field: [
            {
              card: c.welcomeToNightCityRetailSecondhandBombus,
              spent: false,
              hasLag: false,
            },
            { card: c.welcomeToNightCityRetailCorpoSecurity, spent: false, hasLag: false },
            {
              card: c.welcomeToNightCityRetailAdamSmasherMetalOverMeat,
              spent: true,
              hasLag: false,
            },
            {
              card: c.welcomeToNightCityRetailSandayuOdaHanakoSGuardian,
              spent: true,
              hasLag: false,
            },
          ],
          legendArea: [
            { card: c.welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false },
            { card: c.welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown, faceDown: true },
          ],
          eddies: 7,
          gigArea: [
            { dieType: "d4", faceValue: 2 },
            { dieType: "d6", faceValue: 6 },
            { dieType: "d12", faceValue: 11 },
          ],
        },
        { seed: scenarioSeed("retailCombatGigBench"), autoGainGig: false },
      ),
  },
  {
    id: "retailGearLegendBench",
    group: "core",
    label: "Retail bench · Gear and Legends",
    description:
      "Board focused on attachment density, face-up and face-down Legends, Cyberware in trash, and Gear in hand. Use it to validate equip targets, Legend call state, Gear movement/readiness, and text/image rendering for the retail Cyberware package.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [
            c.welcomeToNightCityRetailMantisBlades,
            c.welcomeToNightCityRetailGorillaArms,
            c.welcomeToNightCityRetailSandevistan,
            c.welcomeToNightCityRetailOverwatchPanamSGift,
            c.welcomeToNightCityRetailZetatechFaceplate,
            c.welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch,
          ],
          field: [
            {
              card: c.welcomeToNightCityRetailPlacideVoodooSentinel,
              spent: false,
              hasLag: false,
              attachedGears: [
                c.welcomeToNightCityRetailMandibularUpgrade,
                c.welcomeToNightCityRetailKiroshiOptics,
              ],
            },
            {
              card: c.welcomeToNightCityRetailModdedKusanagi,
              spent: false,
              hasLag: false,
              attachedGears: [c.welcomeToNightCityRetailDyingNightVSPistol],
            },
            {
              card: c.welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
              spent: true,
              hasLag: false,
            },
          ],
          trash: [
            c.welcomeToNightCityRetailSatoriSwordOfSaburo,
            c.welcomeToNightCityRetailGorillaArms,
          ],
          legendArea: [
            { card: c.welcomeToNightCityRetailEvelynParkerBeautifulEnigma, faceDown: false },
            { card: c.welcomeToNightCityRetailVStreetkid, faceDown: false },
            { card: c.welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, faceDown: true },
          ],
          eddies: 11,
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d8", faceValue: 7 },
          ],
        },
        {
          hand: [c.welcomeToNightCityRetailAllIsLost, c.welcomeToNightCityRetailOverTheEdge],
          field: [
            {
              card: c.welcomeToNightCityRetailWraithMarauders,
              spent: false,
              hasLag: false,
            },
            { card: c.welcomeToNightCityRetailPsychoSquad, spent: true, hasLag: false },
          ],
          legendArea: [
            { card: c.welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, faceDown: false },
            { card: c.welcomeToNightCityRetailPanamPalmerNomadCavalry, faceDown: true },
            { card: c.welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: true },
          ],
          eddies: 5,
          gigArea: [
            { dieType: "d6", faceValue: 2 },
            { dieType: "d10", faceValue: 10 },
          ],
        },
        { seed: scenarioSeed("retailGearLegendBench"), autoGainGig: false },
      ),
  },
  {
    id: "mobileLedgerZeroLegends",
    group: "core",
    label: "Mobile ledger · zero Legends",
    description:
      "Visual fixture for the invariant mobile center ledger with no Legends on either side. Both empty Legend areas remain reserved between the two Gig rows.",
    build: () => mobileLedgerScenario(0),
  },
  {
    id: "mobileLedgerOneLegend",
    group: "core",
    label: "Mobile ledger · one Legend",
    description:
      "Visual fixture for the invariant mobile center ledger with one Legend on each side. Both Legends remain visible between the two Gig rows.",
    build: () => mobileLedgerScenario(1),
  },
  {
    id: "mobileLedgerTwoLegends",
    group: "core",
    label: "Mobile ledger · two Legends",
    description:
      "Visual fixture for the invariant mobile center ledger with two Legends on each side. Street Cred and both full-width Gig rows remain readable.",
    build: () => mobileLedgerScenario(2),
  },
  {
    id: "mobileLedgerThreeLegends",
    group: "core",
    label: "Mobile ledger · three Legends",
    description:
      "Visual fixture for the invariant mobile center ledger with three Legends on each side. All six Legends remain visible in the shared middle row.",
    build: () => mobileLedgerScenario(3),
  },
  {
    id: "overtimeCountdown",
    group: "core",
    label: "Overtime · countdown",
    description: "Both Fixer areas are empty; overtime begins after two qualifying turns.",
    build: () => {
      const gigs: NonNullable<PlayerFixture["gigArea"]> = [
        { dieType: "d4", faceValue: 1 },
        { dieType: "d6", faceValue: 2 },
        { dieType: "d8", faceValue: 3 },
        { dieType: "d10", faceValue: 4 },
        { dieType: "d12", faceValue: 5 },
        { dieType: "d20", faceValue: 6 },
      ];
      return CyberpunkTestEngine.createWithFixture(
        { ...mobileLedgerPlayer(3), gigArea: gigs },
        { ...mobileLedgerPlayer(3, true), gigArea: gigs },
        { seed: scenarioSeed("overtimeCountdown"), autoGainGig: false },
      );
    },
  },
  {
    id: "overtimeCenterRow",
    group: "core",
    label: "Overtime · center row",
    description:
      "Visual fixture for the overtime cue across desktop and mobile Gig lanes before either side reaches seven Gigs.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(mobileLedgerPlayer(3), mobileLedgerPlayer(3, true), {
        seed: scenarioSeed("overtimeCenterRow"),
        autoGainGig: false,
        overtime: true,
      }),
  },
  {
    id: "mobileLedgerFriendlyOneRivalThree",
    group: "core",
    label: "Mobile ledger · friendly one, rival three Legends",
    description:
      "Mixed-count visual fixture proving both Legend areas remain visible without changing the center-row structure or height.",
    build: () => mobileLedgerMixedScenario(1, 3, "mobileLedgerFriendlyOneRivalThree"),
  },
  {
    id: "mobileLedgerFriendlyZeroRivalTwo",
    group: "core",
    label: "Mobile ledger · friendly zero, rival two Legends",
    description:
      "Mixed-count visual fixture proving Rival Legends remain visible when the friendly Legend area is empty.",
    build: () => mobileLedgerMixedScenario(0, 2, "mobileLedgerFriendlyZeroRivalTwo"),
  },
  {
    id: "retailPr2295Cards",
    group: "core",
    label: "Retail · PR 2295 cards",
    description:
      "Visible board fixture containing the seven Cyberpunk retail cards added in PR #2295 for human validation.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [
            c.welcomeToNightCityRetailMoxInciters,
            c.welcomeToNightCityRetailYorinobuArasakaSteelDragon,
            c.welcomeToNightCityRetailOverwatchPanamSGift,
          ],
          field: [
            { card: c.welcomeToNightCityRetailLaLloronaGhostOfThePast, spent: false },
            { card: c.welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpirits, spent: false },
            {
              card: c.welcomeToNightCityRetailSaulBrightStormrider,
              spent: false,
              attachedGears: [c.welcomeToNightCityRetailOverwatchPanamSGift],
            },
            {
              card: c.welcomeToNightCityRetailWraithMarauders,
              spent: true,
              hasLag: false,
            },
          ],
          legendArea: [
            { card: c.welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience, faceDown: false },
          ],
          eddies: 8,
          deck: [c.welcomeToNightCityRetailMoxInciters, c.welcomeToNightCityRetailRebootOptics],
          gigArea: [{ dieType: "d6", faceValue: 2 }],
        },
        {
          field: [
            { card: c.welcomeToNightCityRetailCorpoSecurity, spent: true },
            { card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: true },
          ],
          legendArea: [
            { card: c.welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience, faceDown: false },
          ],
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
        {
          seed: scenarioSeed("retailPr2295Cards"),
          preserveDeckOrder: true,
          autoGainGig: false,
        },
      ),
  },
  {
    id: "openingMain",
    group: "core",
    label: "Opening · Your turn",
    description:
      "P1 in MAIN with hand cards to play. Verifies select-action mode for player + view mode for opponent.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(playerBase, opponentBase, {
        seed: scenarioSeed("openingMain"),
        autoGainGig: false,
      }),
  },
  {
    id: "openingMainNoSellable",
    group: "core",
    label: "Opening · No Sell-tag card",
    description: "P1 has not sold this turn, but currently has no Sell-tag card in hand.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          ...playerBase,
          hand: [c.welcomeToNightCityRetailMoxInciters, c.welcomeToNightCityRetailSwordwiseHuscle],
        },
        opponentBase,
        { seed: scenarioSeed("openingMainNoSellable"), autoGainGig: false },
      ),
  },
  {
    id: "combatPriorityHold",
    group: "core",
    label: "Combat · Empty held React window",
    description:
      "Your hold is armed. Pass or switch Hold combat priority off to finish the rival's attack without another combat click.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: c.welcomeToNightCityRetailCorpoSecurity, spent: true }],
          hand: [],
          legendArea: [],
          eddies: 0,
        },
        {
          field: [{ card: c.welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
          hand: [],
          legendArea: [],
          eddies: 0,
        },
        {
          activePlayerId: P2,
          combatProgression: "automatic",
          seed: scenarioSeed("combatPriorityHold"),
        },
      );
      engine.executeMove("setCombatPriority", { args: { mode: "hold" } }, P1);
      engine.attackUnit(
        c.welcomeToNightCityRetailOffdutyMalfini,
        c.welcomeToNightCityRetailCorpoSecurity,
        { as: P2 },
      );
      return engine;
    },
  },
  {
    id: "attackStep",
    group: "core",
    label: "Main phase · Attackers ready",
    description:
      "P1 in MAIN with ready attackers and spent defenders. Verifies selectPair input on attackUnit.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(playerBase, opponentBase, {
        seed: scenarioSeed("attackStep"),
        autoGainGig: false,
      }),
  },
  {
    id: "reactStep",
    group: "core",
    label: "React · Block decision",
    description:
      "P2 attacks; P1 is in the React step with `useBlocker` + resolve available. select-action mode with constrained verbs.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          ...playerBase,
          field: [
            ...(Array.isArray(playerBase.field) ? playerBase.field : []),
            { card: c.welcomeToNightCityRetailCorpoSecurity, spent: false },
          ],
        },
        opponentBase,
        {
          seed: scenarioSeed("reactStep"),
          autoGainGig: false,
        },
      );
      if (engine.getState().G.turnMetadata.activePlayerId === P1) {
        engine.completeTurn({ as: P1 });
        skipGainGig(engine);
      }
      engine.attackRival(c.embracingPowerRetailStarterDeckMinotaur, { as: P2 });
      engine.resolveAttack({ as: P2 });
      return engine;
    },
  },
  {
    id: "chooseCardTarget",
    group: "core",
    label: "Choice · pick a card to play",
    description:
      "Engine paused on a chooseCardToPlay choice for P1 — hand cards pulse as targets. Verifies select-target mode.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(playerBase, opponentBase, {
        seed: scenarioSeed("chooseCardTarget"),
        autoGainGig: false,
      });
      const handIds = engine.getCardsInZone("hand", P1).map((c) => c.instanceId);
      engine.judgeSetPendingChoice(
        {
          type: "chooseCardToPlay",
          chooserId: P1,
          effectId: "demo-choose-card",
          payload: {
            cardIds: handIds,
            free: true,
            boundTargets: {},
            sourceCardId: handIds[0]!,
            sourcePlayerId: P1,
            abilityIndex: 0,
            ifEffects: [],
          },
        },
        { as: P1 },
      );
      return engine;
    },
  },
  {
    id: "chooseDiscardFromHand",
    group: "core",
    label: "Choice · discard a card from hand",
    description:
      "Panam's attack requires the player to choose one of several hand cards to discard.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            {
              card: c.welcomeToNightCityRetailPanamPalmerStrengthThroughFamily,
              spent: false,
              hasLag: false,
            },
          ],
          hand: [
            c.welcomeToNightCityRetailCorpoSecurity,
            c.welcomeToNightCityRetailFieldOperator,
            c.welcomeToNightCityRetailMoxInciters,
          ],
          legendArea: [{ card: c.welcomeToNightCityRetailVStreetkid, faceDown: false }],
        },
        { legendArea: [{ card: c.welcomeToNightCityRetailVStreetkid, faceDown: false }] },
        { seed: scenarioSeed("chooseDiscardFromHand"), autoGainGig: false },
      );
      engine.attackRival(c.welcomeToNightCityRetailPanamPalmerStrengthThroughFamily, { as: P1 });
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      if (choice?.type !== "chooseTarget" || choice.payload.type !== "discardFromHand") {
        throw new Error("Discard fixture must offer a hand-card choice.");
      }
      return engine;
    },
  },
  {
    id: "handFanOverflow",
    group: "core",
    label: "Hand · crowded fan and next page",
    description:
      "Thirteen hand cards exercise dense fan spacing, card input, and access to the next page.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          ...playerBase,
          hand: Array.from(
            { length: 13 },
            (_, index) =>
              [
                c.welcomeToNightCityRetailCorpoSecurity,
                c.welcomeToNightCityRetailFieldOperator,
                c.welcomeToNightCityRetailMoxInciters,
                c.welcomeToNightCityRetailFloorIt,
              ][index % 4]!,
          ),
          eddies: 8,
        },
        opponentBase,
        { seed: scenarioSeed("handFanOverflow"), autoGainGig: false },
      ),
  },
  {
    id: "opponentTurn",
    group: "core",
    label: "Observing · Opponent's turn",
    description:
      "P2 active, P1 has nothing meaningful to do. Verifies view mode for P1 with the 'opponent is choosing' ribbon.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(playerBase, opponentBase, {
        seed: scenarioSeed("opponentTurn"),
        autoGainGig: false,
      });
      if (engine.getState().G.turnMetadata.activePlayerId === P1) {
        engine.completeTurn({ as: P1 });
        skipGainGig(engine);
      }
      return engine;
    },
  },
  {
    id: "stealGigTest",
    group: "core",
    label: "Validate Steal Gig",
    description: "",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          field: [
            { card: c.welcomeToNightCityRetailSecondhandBombus, spent: false },
            { card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false },
            {
              card: c.welcomeToNightCityRetailTBugAmateurPhilosopher,
              spent: false,
              attachedGears: [
                c.welcomeToNightCityRetailSatoriSwordOfSaburo,
                c.welcomeToNightCityRetailKiroshiOptics,
                c.welcomeToNightCityRetailDyingNightVSPistol,
              ],
            },
            { card: c.embracingPowerRetailStarterDeckMinotaur, spent: false },
            { card: c.welcomeToNightCityRetailJackieWellesRideOrDieChoom, spent: false },
          ],
          legendArea: [
            { card: c.theHeistRetailStarterDeckVCorporateExile, faceDown: true },
            { card: c.embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: true },
            {
              card: c.embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction,
              faceDown: true,
            },
          ],
          eddies: 8,
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d8", faceValue: 1 },
            { dieType: "d10", faceValue: 1 },
            { dieType: "d12", faceValue: 1 },
          ],
        },
        {
          gigArea: [
            { dieType: "d4", faceValue: 4 },
            { dieType: "d6", faceValue: 1 },
            { dieType: "d12", faceValue: 10 },
          ],
        },
        {
          seed: scenarioSeed("endGame"),
          autoGainGig: false,
        },
      ),
  },
  {
    id: "endGame",
    group: "core",
    label: "End game · Fully revealed",
    description:
      "P1 in MAIN on turn 7 with P1 at 4 Gig Dice, P2 at 3 Gig Dice, revealed Legends, and 3-4 Units on each field. Verifies the dense late-board layout.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(endGamePlayer, endGameOpponent, {
        seed: scenarioSeed("endGame"),
        autoGainGig: false,
      });
      return engine;
    },
  },
];
