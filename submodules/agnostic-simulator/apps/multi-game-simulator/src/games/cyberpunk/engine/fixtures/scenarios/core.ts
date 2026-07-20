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
            card: c.welcomeToNightCityRetailElSombreroNLaVenganzaLenta,
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
  // ── Core scenarios ──────────────────────────────────────────────────────
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
    id: "retailCardCatalog",
    group: "core",
    label: "Retail · official card catalog",
    description:
      "P1 trash contains every official retail Cyberpunk card currently returned by the card scraper. Used to prove the simulator can hydrate the new card definitions.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          trash: [
            ...c.boxToppersRetailCards,
            ...c.theHeistRetailStarterDeckCards,
            ...c.welcomeToNightCityRetailCards,
          ].filter((card) => card.type !== "legend"),
          legendArea: [
            ...c.boxToppersRetailCards,
            ...c.theHeistRetailStarterDeckCards,
            ...c.welcomeToNightCityRetailCards,
          ]
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
      "Visual fixture for the mobile center ledger with no Legends on either side. Gig dice and Street Cred should take the recovered vertical space.",
    build: () => mobileLedgerScenario(0),
  },
  {
    id: "mobileLedgerOneLegend",
    group: "core",
    label: "Mobile ledger · one Legend",
    description:
      "Visual fixture for the mobile center ledger with one Legend on each side. The single Legend should read as a wide slot without crowding the Gig lane.",
    build: () => mobileLedgerScenario(1),
  },
  {
    id: "mobileLedgerTwoLegends",
    group: "core",
    label: "Mobile ledger · two Legends",
    description:
      "Visual fixture for the mobile center ledger with two Legends on each side. It uses the stacked ledger so Street Cred and both Gig lanes remain readable.",
    build: () => mobileLedgerScenario(2),
  },
  {
    id: "mobileLedgerThreeLegends",
    group: "core",
    label: "Mobile ledger · three Legends",
    description:
      "Visual fixture for the mobile center ledger with three Legends on each side. The full Legend row should stay compact enough to keep Gig dice visible.",
    build: () => mobileLedgerScenario(3),
  },
  {
    id: "mobileLedgerFriendlyOneRivalThree",
    group: "core",
    label: "Mobile ledger · friendly one, rival three Legends",
    description:
      "Mixed-count visual fixture for validating side-specific ledger layouts when the rival side requires the stacked Legend row.",
    build: () => mobileLedgerMixedScenario(1, 3, "mobileLedgerFriendlyOneRivalThree"),
  },
  {
    id: "mobileLedgerFriendlyZeroRivalTwo",
    group: "core",
    label: "Mobile ledger · friendly zero, rival two Legends",
    description:
      "Mixed-count visual fixture for validating a score-only friendly lane beside a two-Legend rival lane.",
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
      const engine = CyberpunkTestEngine.createWithFixture(playerBase, opponentBase, {
        seed: scenarioSeed("reactStep"),
        autoGainGig: false,
      });
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
