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
} from "./shared";

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
      "P1 hand stages the main retail Programs against mixed friendly and rival boards: low-cost, high-cost, ready, spent, equipped, face-up Legend, and matching Gig values. Use this to quickly validate playable prompts, target highlights, no-target edges, and Program discard behavior across many cards.",
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
          ],
          field: [
            {
              card: c.welcomeToNightCityRetailTBugAmateurPhilosopher,
              spent: false,
              playedThisTurn: false,
              attachedGears: [
                c.welcomeToNightCityRetailKiroshiOptics,
                c.welcomeToNightCityRetailDyingNightVSPistol,
              ],
            },
            { card: c.welcomeToNightCityRetailFieldOperator, spent: false, playedThisTurn: false },
            { card: c.welcomeToNightCityRetailMoxInciters, spent: true, playedThisTurn: false },
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
          field: [
            { card: c.welcomeToNightCityRetailCorpoSecurity, spent: false, playedThisTurn: false },
            {
              card: c.welcomeToNightCityRetailSecondhandBombus,
              spent: true,
              playedThisTurn: false,
            },
            { card: c.embracingPowerRetailStarterDeckMinotaur, spent: true, playedThisTurn: false },
            { card: c.welcomeToNightCityRetailDelamainCab, spent: false, playedThisTurn: false },
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
          ],
          field: [
            {
              card: c.welcomeToNightCityRetailJackieWellesRideOrDieChoom,
              spent: false,
              playedThisTurn: false,
            },
            {
              card: c.welcomeToNightCityRetailYorinobuArasakaSteelDragon,
              spent: false,
              playedThisTurn: false,
            },
            {
              card: c.welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
              spent: false,
              playedThisTurn: false,
              attachedGears: [c.welcomeToNightCityRetailSatoriSwordOfSaburo],
            },
            {
              card: c.welcomeToNightCityRetailEvelynParkerSchemingSiren,
              spent: true,
              playedThisTurn: false,
            },
          ],
          legendArea: [
            { card: c.welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
            { card: c.welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: false },
            { card: c.welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience, faceDown: true },
          ],
          eddies: 10,
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
              playedThisTurn: false,
            },
            { card: c.welcomeToNightCityRetailCorpoSecurity, spent: false, playedThisTurn: false },
            {
              card: c.welcomeToNightCityRetailAdamSmasherMetalOverMeat,
              spent: true,
              playedThisTurn: false,
            },
            {
              card: c.welcomeToNightCityRetailSandayuOdaHanakoSGuardian,
              spent: true,
              playedThisTurn: false,
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
              playedThisTurn: false,
              attachedGears: [
                c.welcomeToNightCityRetailMandibularUpgrade,
                c.welcomeToNightCityRetailKiroshiOptics,
              ],
            },
            {
              card: c.welcomeToNightCityRetailModdedKusanagi,
              spent: false,
              playedThisTurn: false,
              attachedGears: [c.welcomeToNightCityRetailDyingNightVSPistol],
            },
            {
              card: c.welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
              spent: true,
              playedThisTurn: false,
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
              playedThisTurn: false,
            },
            { card: c.welcomeToNightCityRetailPsychoSquad, spent: true, playedThisTurn: false },
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
            { card: c.welcomeToNightCityRetailSaulBrightStormrider, spent: false },
          ],
          legendArea: [
            { card: c.welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience, faceDown: false },
          ],
          eddies: 8,
          deck: [c.welcomeToNightCityRetailMoxInciters, c.welcomeToNightCityRetailRebootOptics],
          gigArea: [{ dieType: "d6", faceValue: 2 }],
        },
        {
          field: [{ card: c.welcomeToNightCityRetailCorpoSecurity, spent: true }],
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
