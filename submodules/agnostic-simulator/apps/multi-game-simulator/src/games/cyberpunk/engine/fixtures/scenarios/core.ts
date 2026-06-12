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
    id: "defensiveStep",
    group: "core",
    label: "Defensive · Block decision",
    description:
      "P2 attacks; P1 is in the defensive step with `useBlocker` + resolve available. select-action mode with constrained verbs.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(playerBase, opponentBase, {
        seed: scenarioSeed("defensiveStep"),
        autoGainGig: false,
      });
      if (engine.getState().G.turnMetadata.activePlayerId === P1) {
        engine.completeTurn({ as: P1 });
        skipGainGig(engine);
      }
      engine.attackRival(c.alphaArmoredMinotaur, { as: P2 });
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
          payload: { cardIds: handIds, free: true },
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
            { card: c.alphaSecondhandBombus, spent: false },
            { card: c.alphaSwordwiseHuscle, spent: false },
            {
              card: c.alphaTBugAmateurPhilosopher,
              spent: false,
              attachedGears: [
                c.alphaSatoriSwordOfSaburo,
                c.alphaKiroshiOptics,
                c.alphaDyingNightVSPistol,
              ],
            },
            { card: c.alphaArmoredMinotaur, spent: false },
            { card: c.alphaJackieWellesRideOrDieChoom, spent: false },
          ],
          legendArea: [
            { card: c.alphaVCorporateExile, faceDown: true },
            { card: c.alphaGoroTakemuraHandsUnclean, faceDown: true },
            { card: c.alphaYorinobuArasakaEmbracingDestruction, faceDown: true },
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
