import type { Scenario } from "./types";
import {
  c,
  CyberpunkTestEngine,
  P1,
  P2,
  powerThreeMockUnit,
  scenarioSeed,
  skipGainGig,
} from "./shared";

export const unitScenarios: Scenario[] = [
  // ── Unit: BLOCKER + can't attack (Secondhand Bombus, Corpo Security) ────
  {
    id: "unitSecondhandBombus",
    group: "unit-blocker",
    label: "Secondhand Bombus · BLOCKER, can't attack",
    description:
      "P1 has Secondhand Bombus (yellow, cost 2, power 2) on the field. It has BLOCKER but can't attack. Rival is attacking with Armored Minotaur — Bombus should be available to redirect the attack. Tests BLOCKER keyword + cantAttack static rule.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            { card: c.alphaSecondhandBombus, spent: false },
            { card: c.alphaSwordwiseHuscle, spent: false },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaArmoredMinotaur, spent: false },
            { card: c.alphaCorpoSecurity, spent: true },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitSecondhandBombus"), autoGainGig: false },
      );
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
    id: "unitCorpoSecurity",
    group: "unit-blocker",
    label: "Corpo Security · BLOCKER, can't attack",
    description:
      "P2 has Corpo Security (green, cost 2, power 2) on the field. It has BLOCKER but can't attack. Tests the same BLOCKER + cantAttack pattern from the opposing side perspective.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [
            { card: c.alphaSwordwiseHuscle, spent: false },
            { card: c.alphaArmoredMinotaur, spent: false },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 4,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: false },
            { card: c.alphaSecondhandBombus, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitCorpoSecurity"), autoGainGig: false },
      ),
  },

  // ── Unit: Vanilla attackers (Delamain, Emergency Atlus, Swordwise, T-Bug)
  {
    id: "unitDelamainCab",
    group: "unit-vanilla",
    label: "Delamain Cab · 7-power vanilla Vehicle",
    description:
      "P1 has Delamain Cab ready and lag-free on the field. Tests that the vanilla Vehicle renders at printed power and can start a direct attack.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: c.alphaDelamainCab, spent: false, playedThisTurn: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitDelamainCab"), autoGainGig: false },
      ),
  },
  {
    id: "unitEmergencyAtlus",
    group: "unit-vanilla",
    label: "Emergency Atlus · 7-power vanilla Vehicle Corpo",
    description:
      "P1 has Emergency Atlus ready and lag-free on the field. Tests that the vanilla Vehicle Corpo renders at printed power and can start a direct attack.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: c.alphaEmergencyAtlus, spent: false, playedThisTurn: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitEmergencyAtlus"), autoGainGig: false },
      ),
  },
  {
    id: "unitSwordwiseHuscle",
    group: "unit-vanilla",
    label: "Swordwise Huscle · 5-power vanilla Arasaka Merc",
    description:
      "P1 has Swordwise Huscle ready and lag-free on the field. Tests that the vanilla Arasaka Merc renders at printed power and can start a direct attack.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: c.alphaSwordwiseHuscle, spent: false, playedThisTurn: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitSwordwiseHuscle"), autoGainGig: false },
      ),
  },
  {
    id: "unitTBugAmateurPhilosopher",
    group: "unit-vanilla",
    label: "T-Bug · Amateur Philosopher · 5-power vanilla Netrunner Merc",
    description:
      "P1 has T-Bug - Amateur Philosopher ready and lag-free on the field. Tests that the vanilla Netrunner Merc renders at printed power and can start a direct attack.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: c.alphaTBugAmateurPhilosopher, spent: false, playedThisTurn: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitTBugAmateurPhilosopher"), autoGainGig: false },
      ),
  },

  // ── Unit: Gig stolen triggers (Ruthless Lowlife, Evelyn Parker) ─────────
  {
    id: "unitRuthlessLowlife",
    group: "unit-gig-stolen",
    label: "Ruthless Lowlife · sets stolen gigs to value 1",
    description:
      "P1 has Ruthless Lowlife (red, cost 2, power 1) spent on the field. When a rival steals friendly gigs, the stolen gigs' values become 1. Tests the onGigStolen trigger with cardState condition (spent).",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [
            { card: c.alphaRuthlessLowlife, spent: true },
            { card: c.alphaSwordwiseHuscle, spent: false },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [
            { dieType: "d4", faceValue: 4 },
            { dieType: "d8", faceValue: 7 },
          ],
        },
        {
          field: [{ card: c.alphaArmoredMinotaur, spent: false }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitRuthlessLowlife"), autoGainGig: false },
      );
      engine.completeTurn({ as: P1 });
      skipGainGig(engine);
      engine.passPhase({ as: P2 });
      return engine;
    },
  },
  {
    id: "unitEvelynParkerSchemingSiren",
    group: "unit-gig-stolen",
    label: "Evelyn Parker · Scheming Siren · draw when gigs stolen while spent",
    description:
      "P1 has Evelyn Parker - Scheming Siren (blue, cost 2, power 1) spent on the field. When a rival steals friendly gigs while she is spent, draw 1 card. Tests onGigStolen trigger with cardState condition.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaRuthlessLowlife],
          field: [
            { card: c.alphaEvelynParkerSchemingSiren, spent: true },
            { card: c.alphaSwordwiseHuscle, spent: false },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [
            { dieType: "d4", faceValue: 4 },
            { dieType: "d8", faceValue: 7 },
          ],
        },
        {
          field: [{ card: c.alphaArmoredMinotaur, spent: false }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitEvelynParkerSchemingSiren"), autoGainGig: false },
      );
      engine.completeTurn({ as: P1 });
      skipGainGig(engine);
      engine.passPhase({ as: P2 });
      return engine;
    },
  },

  // ── Unit: Static power scaling (Jackie Welles, Goro Takemura) ───────────
  {
    id: "unitJackieWellesRideOrDieChoom",
    group: "unit-power-scaling",
    label: "Jackie Welles · +2 power per friendly gig",
    description:
      "P1 has Jackie Welles - Ride Or Die Choom (yellow, cost 6, power 6). P1 has 3 gigs — Jackie gets +6 power (total 12). Tests the perCount power scaling based on gig count.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [{ card: c.alphaJackieWellesRideOrDieChoom, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 5 },
            { dieType: "d8", faceValue: 2 },
          ],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: true },
            { card: c.alphaArmoredMinotaur, spent: true },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitJackieWellesRideOrDieChoom"), autoGainGig: false },
      );
      return engine;
    },
  },
  {
    id: "unitGoroTakemuraLosingHisWay",
    group: "unit-power-scaling",
    label: "Goro Takemura · +1 power per face-up legend on your turn",
    description:
      "P1 has Goro Takemura - Losing His Way (green, cost 4, power 5). P1 has 2 face-up legends — Goro gets +2 during P1's turn (total 7). Tests perCount power scaling with face-up legend condition + friendly turn condition.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [{ card: c.alphaGoroTakemuraLosingHisWay, spent: false }],
          legendArea: [
            { card: c.alphaVCorporateExile, faceDown: false },
            { card: c.alphaSaburoArasakaStubbornPatriach, faceDown: false },
          ],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: true },
            { card: c.alphaArmoredMinotaur, spent: true },
          ],
          legendArea: [],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitGoroTakemuraLosingHisWay"), autoGainGig: false },
      );
      return engine;
    },
  },

  // ── Unit: Street Cred conditions (MT0D12 Flathead, Armored Minotaur) ────
  {
    id: "unitMt0d12Flathead",
    group: "unit-street-cred",
    label: "MT0D12 Flathead · 7+ Street Cred → can't be blocked",
    description:
      "P1 has MT0D12 Flathead (blue, cost 5, power 5). P1 has 8 Street Cred (d4=3 + d6=5) — above the 7 threshold. Tests the cantBeBlocked static rule conditioned on Street Cred.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [{ card: c.alphaMt0d12Flathead, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 5 },
          ],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: false },
            { card: c.alphaArmoredMinotaur, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d8", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitMt0d12Flathead"), autoGainGig: false },
      ),
  },
  {
    id: "unitArmoredMinotaur",
    group: "unit-street-cred",
    label: "Armored Minotaur · 12+ Street Cred → defeat rival on play",
    description:
      "P1 holds Armored Minotaur (red, cost 6, power 9). P1 has 14 Street Cred (d4=4 + d6=6 + d8=4) — above the 12 threshold. Rival has Corpo Security (power 2) and Swordwise Huscle (power 5). PLAY trigger should let P1 defeat a rival unit with power ≤ 5.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaArmoredMinotaur],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 7,
          gigArea: [
            { dieType: "d4", faceValue: 4 },
            { dieType: "d6", faceValue: 6 },
            { dieType: "d8", faceValue: 4 },
          ],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: true },
            { card: c.alphaSecondhandBombus, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d10", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitArmoredMinotaur"), autoGainGig: false },
      ),
  },

  // ── Unit: On Play triggers (Hanako Arasaka, Placide, Adam Smasher) ──────
  {
    id: "unitHanakoArasakaInAGildedCage",
    group: "unit-play-trigger",
    label: "Hanako Arasaka · PLAY reveals top 4, adds matching cost to hand",
    description:
      "P1 holds Hanako Arasaka (yellow, cost 3, power 0). P1 has a gig d4 at face value 3. PLAY trigger: reveal top 4 cards of deck, add cards with cost equal to gig value (3) to hand, trash the rest. Tests cost-matching deck search bound to gig value.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.spoilerHanakoArasakaInAGildedCage],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 4,
          deck: [
            c.alphaSwordwiseHuscle,
            c.alphaCorpoSecurity,
            c.alphaFloorIt,
            c.alphaRuthlessLowlife,
            c.alphaSecondhandBombus,
          ],
          gigArea: [{ dieType: "d4", faceValue: 3 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        {
          seed: scenarioSeed("unitHanakoArasakaInAGildedCage"),
          autoGainGig: false,
          preserveDeckOrder: true,
        },
      );
      return engine;
    },
  },
  {
    id: "unitGildedMaton",
    group: "unit-play-trigger",
    label: "Gilded Maton · defeat friendly Gear to defeat low-cost rival Unit",
    description:
      "P1 holds Gilded Maton (yellow, cost 4, power 3). P1 has a friendly Gear attached to Swordwise Huscle, and rival has both low-cost and high-cost Units. Visual fixture for the release card's if-you-do play trigger.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.spoilerGildedMaton],
          field: [
            {
              card: c.alphaSwordwiseHuscle,
              spent: false,
              attachedGears: [c.alphaKiroshiOptics],
            },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 5,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: false },
            { card: c.alphaArmoredMinotaur, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 4,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitGildedMaton"), autoGainGig: false },
      ),
  },
  {
    id: "unitMamanBrigitte",
    group: "unit-play-trigger",
    label: "Maman Brigitte · discard two Programs to bottom-deck unequipped Unit",
    description:
      "P1 holds Maman Brigitte (blue, cost 5, power 3) plus two Programs and a non-Program card. Rival has one unequipped Unit and one equipped Unit. Visual fixture for the release card's filtered discard and target-selection flow.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [
            c.spoilerMamanBrigitte,
            c.alphaRebootOptics,
            c.alphaCorporateSurveillance,
            c.alphaKiroshiOptics,
          ],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 6,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaRuthlessLowlife, spent: false },
            { card: c.alphaSwordwiseHuscle, spent: false, attachedGears: [c.alphaKiroshiOptics] },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 4,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitMamanBrigitte"), autoGainGig: false },
      ),
  },
  {
    id: "unitPlacideVoodooSentinel",
    group: "unit-play-trigger",
    label: "Placide · PLAY discard program → bottom-deck rival unit",
    description:
      "P1 holds Placide - Voodoo Sentinel (blue, cost 8, power 10). P1 hand also has Corporate Surveillance (program). PLAY: may discard a program to bottom-deck a rival unit. Same ability also triggers on ATTACK. Tests the ifYouDo pattern on both timings.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.spoilerPlacideVoodooSentinel, c.alphaCorporateSurveillance],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 9,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: true },
            { card: c.alphaArmoredMinotaur, spent: true },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitPlacideVoodooSentinel"), autoGainGig: false },
      ),
  },
  {
    id: "unitAdamSmasherMetalOverMeat",
    group: "unit-play-trigger",
    label: "Adam Smasher · PLAY defeats all other units",
    description:
      "P1 holds Adam Smasher - Metal Over Meat (yellow, cost 9, power 15). Both fields have multiple units. PLAY trigger defeats ALL other units on both sides. Tests the board-wipe effect with excludeSelf.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.spoilerAdamSmasherMetalOverMeat],
          field: [
            { card: c.alphaSwordwiseHuscle, spent: false },
            { card: c.alphaSecondhandBombus, spent: false },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 10,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: true },
            { card: c.alphaArmoredMinotaur, spent: true },
            { card: c.alphaJackieWellesRideOrDieChoom, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitAdamSmasherMetalOverMeat"), autoGainGig: false },
      ),
  },

  // ── Unit: Attack triggers (El Sombreron) ────────────────────────────────
  {
    id: "unitElSombreronLaVenganzaLenta",
    group: "unit-attack-trigger",
    label: "El Sombreron · ATTACK doubles power in a fight",
    description:
      "P1 has El Sombreron - La Venganza Lenta (red, cost 4, power 4). ATTACK trigger while fighting a rival unit: double this unit's power. Rival has Corpo Security (power 2, spent). Tests power multiplication during fight (power goes to 8).",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [{ card: c.spoilerElSombreronLaVenganzaLenta, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: true },
            { card: c.alphaArmoredMinotaur, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitElSombreronLaVenganzaLenta"), autoGainGig: false },
      ),
  },

  // ── Unit: Defeated trigger (Caliber) ────────────────────────────────────
  {
    id: "unitCaliberTotentanzSTopDog",
    group: "unit-defeated",
    label: "Caliber · DEFEATED → rival discards, bonus if cost matches gig",
    description:
      "P1 has Caliber - Totentanz's Top Dog (yellow, cost 5, power 6) on the field. P1 has a d6 gig at face value 5. DEFEATED trigger: rival discards 1. If the discarded card's cost matches a friendly gig value, rival discards 1 more.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [
            { card: c.spoilerCaliberTotentanzSTopDog, spent: false },
            { card: c.alphaSwordwiseHuscle, spent: false },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 5 }],
        },
        {
          hand: [c.alphaMt0d12Flathead, c.alphaCorpoSecurity, c.alphaRuthlessLowlife],
          field: [{ card: c.alphaArmoredMinotaur, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitCaliberTotentanzSTopDog"), autoGainGig: false },
      ),
  },

  // ── Unit: Gig value conditions (Meredith Stout, Kerry Eurodyne) ─────────
  {
    id: "unitMeredithStoutStoneColdCorpo",
    group: "unit-gig-condition",
    label: "Meredith Stout · rival decreases gig → recover card from trash",
    description:
      "P1 has Meredith Stout - Stone Cold Corpo (red, cost 4, power 3) on the field. P1 trash has a card. When a rival decreases the value of a friendly gig, may recover a card from trash. Tests the gigValueChanged event trigger with decrease direction.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [{ card: c.spoilerMeredithStoutStoneColdCorpo, spent: false }],
          trash: [c.alphaKiroshiOptics, c.alphaRuthlessLowlife],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 5 },
          ],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.spoilerEvelynParkerBeautifulEnigma],
          eddies: 5,
          gigArea: [{ dieType: "d8", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitMeredithStoutStoneColdCorpo"), autoGainGig: false },
      );
      if (engine.getState().G.turnMetadata.activePlayerId === P1) {
        engine.completeTurn({ as: P1 });
        skipGainGig(engine);
      }
      return engine;
    },
  },
  {
    id: "unitKerryEurodyneTheLastRockerboy",
    group: "unit-gig-condition",
    label: "Kerry Eurodyne · spend to draw 2 if gig at max value",
    description:
      "P1 has Kerry Eurodyne - The Last Rockerboy (red, cost 4, power 3) on the field. P1 has a d4 gig at face value 4 (max). Spend Kerry: if you have a gig at max value, draw 2 cards. Tests activated ability with hasGigAtMaxValue condition.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaRuthlessLowlife],
          field: [{ card: c.spoilerKerryEurodyneTheLastRockerboy, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [
            { dieType: "d4", faceValue: 4 },
            { dieType: "d6", faceValue: 2 },
          ],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d8", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitKerryEurodyneTheLastRockerboy"), autoGainGig: false },
      ),
  },

  // ── Unit: Rush / can attack on played turn (Riding Nomad) ───────────────
  {
    id: "unitRidingNomad",
    group: "unit-rush",
    label: "Riding Nomad · can attack spent units the turn it's played",
    description:
      "P1 holds Riding Nomad (green, cost 6, power 6). When played, it can attack spent rival units that same turn (overrides normal summoning sickness). Rival has Corpo Security (spent). Tests the canAttackOnPlayedTurnAgainstUnits rule.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.spoilerRidingNomad],
          field: [],
          legendArea: [c.alphaVCorporateExile],
          eddies: 7,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: true },
            { card: c.alphaArmoredMinotaur, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitRidingNomad"), autoGainGig: false },
      ),
  },

  // ── Unit: Street-Cred-gated defeat (Royce, Don't Call Me Simon) ─────────
  {
    id: "unitRoyceDonTCallMeSimonHighCred",
    group: "unit-street-cred",
    label: "Royce DCMS · Street Cred > rival's (defeat ≤ 3 power)",
    description:
      "P1 holds Royce - Don't Call Me Simon (red, cost 5, power 4). P1 Street Cred = 10 (d10=10); P2 Street Cred = 1. PLAY lets P1 defeat a rival unit with power ≤ 3 (the higher-threshold branch). Rival field includes Corpo Security (power 2, eligible), a scenario-only Power-3 Mock Unit (eligible), and Armored Minotaur (power 9, not eligible).",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.spoilerRoyceDonTCallMeSimon],
          field: [],
          legendArea: [c.alphaVCorporateExile],
          eddies: 6,
          gigArea: [{ dieType: "d10", faceValue: 10 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: false },
            { card: powerThreeMockUnit, spent: false },
            { card: c.alphaArmoredMinotaur, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 4,
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
        { seed: scenarioSeed("unitRoyceDonTCallMeSimonHighCred"), autoGainGig: false },
      ),
  },
  {
    id: "unitRoyceDonTCallMeSimonLowCred",
    group: "unit-street-cred",
    label: "Royce DCMS · Street Cred ≤ rival's (defeat ≤ 2 power only)",
    description:
      "P1 holds Royce - Don't Call Me Simon. P1 Street Cred = 2 (d4=2); P2 Street Cred = 6 (d6=6). PLAY falls back to the lower-threshold branch — only rival units with power ≤ 2 are eligible. Rival has Ruthless Lowlife (power 1, eligible) and Swordwise Huscle (power 5, not eligible).",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.spoilerRoyceDonTCallMeSimon],
          field: [],
          legendArea: [c.alphaVCorporateExile],
          eddies: 6,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaRuthlessLowlife, spent: false },
            { card: c.alphaSwordwiseHuscle, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 4,
          gigArea: [{ dieType: "d6", faceValue: 6 }],
        },
        { seed: scenarioSeed("unitRoyceDonTCallMeSimonLowCred"), autoGainGig: false },
      ),
  },

  // ── Unit: Gig-pair-scaled spend + rush (Sandayu Oda) ────────────────────
  {
    id: "unitSandayuOdaHanakoSGuardian",
    group: "unit-rush",
    label:
      "Sandayu Oda · spend per friendly value-pair + can attack rival units the turn it's played",
    description:
      "P1 holds Sandayu Oda - Hanako's Guardian (green, cost 7, power 8). P1 has d6/d8 at face 5 and d4/d10 at face 3 — two value-pairs. PLAY: spend a rival unit per friendly value-pair. Static: this unit can attack rival units on the played turn. Rival has Corpo Security and Armored Minotaur both ready as spend candidates.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.spoilerSandayuOdaHanakoSGuardian, c.spoilerPeaceOffering],
          field: [],
          legendArea: [c.alphaVCorporateExile],
          eddies: 8,
          gigArea: [
            { dieType: "d6", faceValue: 5 },
            { dieType: "d8", faceValue: 5 },
            { dieType: "d4", faceValue: 3 },
            { dieType: "d10", faceValue: 3 },
          ],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: false },
            { card: c.alphaArmoredMinotaur, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitSandayuOdaHanakoSGuardian"), autoGainGig: false },
      ),
  },

  // ── Program: Cost reducer + cross-power defeat (Carnage At The Colosseum)
  {
    id: "progCarnageAtTheColosseum",
    group: "program-cost-modifier",
    label: "Carnage At The Colosseum · -1 €$ per friendly Gig at 8+ value",
    description:
      "P1 holds Carnage At The Colosseum (red, cost 6, Braindance/Extreme). P1 has two friendly Gigs at value 8+ (d10=10, d12=8) — cost reduces from 6 to 4 €$, floored at 1. P1 also has Armored Minotaur (power 9) on field. Rival has Ruthless Lowlife (power 1, eligible) and Swordwise Huscle (power 5, eligible) — both weaker than Minotaur. Tests perTargetCount cost modifier and powerLessThanAnyOf defeat targeting.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.spoilerCarnageAtTheColosseum],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 4,
          gigArea: [
            { dieType: "d10", faceValue: 10 },
            { dieType: "d12", faceValue: 8 },
            { dieType: "d4", faceValue: 3, source: "rival" },
          ],
        },
        {
          field: [
            { card: c.alphaRuthlessLowlife, spent: false },
            { card: c.alphaArmoredMinotaur, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 4,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("progCarnageAtTheColosseum"), autoGainGig: false, activePlayerId: P1 },
      ),
  },

  // ── Retail Unit: On Play triggers (Hanako Arasaka, Gilded Maton, Maman Brigitte, Placide, Adam Smasher) ──
  {
    id: "unitHanakoArasakaInAGildedCageRetail",
    group: "unit-play-trigger",
    label: "Hanako Arasaka (Retail) · PLAY reveals top 4, adds matching cost to hand",
    description:
      "P1 holds Hanako Arasaka - In A Gilded Cage (Retail) (yellow, cost 3, power 0). P1 has a gig d4 at face value 3. PLAY trigger: reveal top 4 cards of deck, add cards with cost equal to gig value (3) to hand, trash the rest.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailHanakoArasakaInAGildedCage],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 4,
          deck: [
            c.alphaSwordwiseHuscle,
            c.alphaCorpoSecurity,
            c.alphaFloorIt,
            c.alphaRuthlessLowlife,
            c.alphaSecondhandBombus,
          ],
          gigArea: [{ dieType: "d4", faceValue: 3 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        {
          seed: scenarioSeed("unitHanakoArasakaInAGildedCageRetail"),
          autoGainGig: false,
          preserveDeckOrder: true,
        },
      );
      return engine;
    },
  },
  {
    id: "unitGildedMatonRetail",
    group: "unit-play-trigger",
    label: "Gilded Maton (Retail) · defeat friendly Gear to defeat low-cost rival Unit",
    description:
      "P1 holds Gilded Maton (Retail) (yellow, cost 4, power 3). P1 has a friendly Gear attached to Swordwise Huscle, and rival has both low-cost and high-cost Units.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailGildedMatoN],
          field: [
            {
              card: c.alphaSwordwiseHuscle,
              spent: false,
              attachedGears: [c.alphaKiroshiOptics],
            },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 5,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: false },
            { card: c.alphaArmoredMinotaur, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 4,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitGildedMatonRetail"), autoGainGig: false },
      ),
  },
  {
    id: "unitMamanBrigitteRetail",
    group: "unit-play-trigger",
    label: "Maman Brigitte (Retail) · discard two Programs to bottom-deck unequipped Unit",
    description:
      "P1 holds Maman Brigitte - Spirit Of Death (Retail) (blue, cost 5, power 3) plus two Programs and a non-Program card. Rival has one unequipped Unit and one equipped Unit.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [
            c.welcomeToNightCityRetailMamanBrigitteSpiritOfDeath,
            c.alphaRebootOptics,
            c.alphaCorporateSurveillance,
            c.alphaKiroshiOptics,
          ],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 6,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaRuthlessLowlife, spent: false },
            { card: c.alphaSwordwiseHuscle, spent: false, attachedGears: [c.alphaKiroshiOptics] },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 4,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitMamanBrigitteRetail"), autoGainGig: false },
      ),
  },
  {
    id: "unitPlacideVoodooSentinelRetail",
    group: "unit-play-trigger",
    label: "Placide (Retail) · PLAY discard program → bottom-deck rival unit",
    description:
      "P1 holds Placide - Voodoo Sentinel (Retail) (blue, cost 8, power 10). P1 hand also has Corporate Surveillance (program). PLAY: may discard a program to bottom-deck a rival unit.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailPlacideVoodooSentinel, c.alphaCorporateSurveillance],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 9,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: true },
            { card: c.alphaArmoredMinotaur, spent: true },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitPlacideVoodooSentinelRetail"), autoGainGig: false },
      ),
  },
  {
    id: "unitAdamSmasherMetalOverMeatRetail",
    group: "unit-play-trigger",
    label: "Adam Smasher (Retail) · PLAY defeats all other units",
    description:
      "P1 holds Adam Smasher - Metal Over Meat (Retail) (yellow, cost 9, power 15). Both fields have multiple units. PLAY trigger defeats ALL other units on both sides.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailAdamSmasherMetalOverMeat],
          field: [
            { card: c.alphaSwordwiseHuscle, spent: false },
            { card: c.alphaSecondhandBombus, spent: false },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 10,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: true },
            { card: c.alphaArmoredMinotaur, spent: true },
            { card: c.alphaJackieWellesRideOrDieChoom, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitAdamSmasherMetalOverMeatRetail"), autoGainGig: false },
      ),
  },

  // ── Retail Unit: Attack triggers (El Sombreron) ──────────────────────────
  {
    id: "unitElSombreronLaVenganzaLentaRetail",
    group: "unit-attack-trigger",
    label: "El Sombreron (Retail) · ATTACK doubles power in a fight",
    description:
      "P1 has El Sombreron - La Venganza Lenta (Retail) (red, cost 4, power 4). ATTACK trigger while fighting a rival unit: double this unit's power.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [{ card: c.welcomeToNightCityRetailElSombreroNLaVenganzaLenta, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: true },
            { card: c.alphaArmoredMinotaur, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitElSombreronLaVenganzaLentaRetail"), autoGainGig: false },
      ),
  },

  // ── Retail Unit: Defeated trigger (Caliber) ──────────────────────────────
  {
    id: "unitCaliberTotentanzSTopDogRetail",
    group: "unit-defeated",
    label: "Caliber (Retail) · DEFEATED → rival discards, bonus if cost matches gig",
    description:
      "P1 has Caliber - Totentanz's Top Dog (Retail) (yellow, cost 5, power 6) on the field. P1 has a d6 gig at face value 5. DEFEATED trigger: rival discards 1. If the discarded card's cost matches a friendly gig value, rival discards 1 more.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [
            { card: c.welcomeToNightCityRetailCaliberTotentanzSTopDog, spent: false },
            { card: c.alphaSwordwiseHuscle, spent: false },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 5 }],
        },
        {
          hand: [c.alphaMt0d12Flathead, c.alphaCorpoSecurity, c.alphaRuthlessLowlife],
          field: [{ card: c.alphaArmoredMinotaur, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitCaliberTotentanzSTopDogRetail"), autoGainGig: false },
      ),
  },

  // ── Retail Unit: Gig value conditions (Meredith Stout, Kerry Eurodyne) ──
  {
    id: "unitMeredithStoutStoneColdCorpoRetail",
    group: "unit-gig-condition",
    label: "Meredith Stout (Retail) · rival decreases gig → recover card from trash",
    description:
      "P1 has Meredith Stout - Stone Cold Corpo (Retail) (red, cost 4, power 3) on the field. P1 trash has a card. When a rival decreases the value of a friendly gig, may recover a card from trash.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [{ card: c.welcomeToNightCityRetailMeredithStoutStoneColdCorpo, spent: false }],
          trash: [c.alphaKiroshiOptics, c.alphaRuthlessLowlife],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 5 },
          ],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.welcomeToNightCityRetailEvelynParkerBeautifulEnigma],
          eddies: 5,
          gigArea: [{ dieType: "d8", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitMeredithStoutStoneColdCorpoRetail"), autoGainGig: false },
      );
      if (engine.getState().G.turnMetadata.activePlayerId === P1) {
        engine.completeTurn({ as: P1 });
        skipGainGig(engine);
      }
      return engine;
    },
  },
  {
    id: "unitKerryEurodyneTheLastRockerboyRetail",
    group: "unit-gig-condition",
    label: "Kerry Eurodyne (Retail) · spend to draw 2 if gig at max value",
    description:
      "P1 has Kerry Eurodyne - The Last Rockerboy (Retail) (red, cost 4, power 5) on the field. P1 has a d8 gig at face value 8. Spend Kerry: if you have a Gig with 8+ value, draw 2 cards.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaRuthlessLowlife],
          field: [{ card: c.welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d6", faceValue: 2 },
          ],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d8", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitKerryEurodyneTheLastRockerboyRetail"), autoGainGig: false },
      ),
  },

  // ── Retail Unit: Rush / can attack on played turn (Riding Nomad, Modded Kusanagi) ──
  {
    id: "unitRidingNomadRetail",
    group: "unit-rush",
    label: "Riding Nomad (Retail) · can attack spent units the turn it's played",
    description:
      "P1 holds Riding Nomad (Retail) (green, cost 6, power 6). When played, it can attack spent rival units that same turn.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailRidingNomad],
          field: [],
          legendArea: [c.alphaVCorporateExile],
          eddies: 7,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: true },
            { card: c.alphaArmoredMinotaur, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitRidingNomadRetail"), autoGainGig: false },
      ),
  },
  {
    id: "unitModdedKusanagiRetail",
    group: "unit-rush",
    label: "Modded Kusanagi (Retail) · ADRENALINE, returns to hand at end of turn",
    description:
      "P1 holds Modded Kusanagi (Retail) (green, cost 6, power 6 Vehicle). ADRENALINE: can attack on the played turn. At end of its controller's turn, returns to hand.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailModdedKusanagi],
          field: [],
          legendArea: [c.alphaVCorporateExile],
          eddies: 7,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitModdedKusanagiRetail"), autoGainGig: false },
      ),
  },

  // ── Retail Unit: Street-Cred-gated defeat (Royce) ────────────────────────
  {
    id: "unitRoyceDonTCallMeSimonHighCredRetail",
    group: "unit-street-cred",
    label: "Royce DCMS (Retail) · Street Cred > rival's (defeat ≤ 3 power)",
    description:
      "P1 holds Royce - Don't Call Me Simon (Retail) (red, cost 5, power 4). P1 Street Cred = 10 (d10=10); P2 Street Cred = 1. PLAY lets P1 defeat a rival unit with power ≤ 3.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailRoyceDonTCallMeSimon],
          field: [],
          legendArea: [c.alphaVCorporateExile],
          eddies: 6,
          gigArea: [{ dieType: "d10", faceValue: 10 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: false },
            { card: powerThreeMockUnit, spent: false },
            { card: c.alphaArmoredMinotaur, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 4,
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
        { seed: scenarioSeed("unitRoyceDonTCallMeSimonHighCredRetail"), autoGainGig: false },
      ),
  },
  {
    id: "unitRoyceDonTCallMeSimonLowCredRetail",
    group: "unit-street-cred",
    label: "Royce DCMS (Retail) · Street Cred ≤ rival's (defeat ≤ 2 power only)",
    description:
      "P1 holds Royce - Don't Call Me Simon (Retail). P1 Street Cred = 2 (d4=2); P2 Street Cred = 6 (d6=6). PLAY falls back to the lower-threshold branch.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailRoyceDonTCallMeSimon],
          field: [],
          legendArea: [c.alphaVCorporateExile],
          eddies: 6,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaRuthlessLowlife, spent: false },
            { card: c.alphaSwordwiseHuscle, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 4,
          gigArea: [{ dieType: "d6", faceValue: 6 }],
        },
        { seed: scenarioSeed("unitRoyceDonTCallMeSimonLowCredRetail"), autoGainGig: false },
      ),
  },

  // ── Retail Unit: Gig-pair-scaled spend + rush (Sandayu Oda) ──────────────
  {
    id: "unitSandayuOdaHanakoSGuardianRetail",
    group: "unit-rush",
    label:
      "Sandayu Oda (Retail) · spend per friendly value-pair + can attack rival units the turn it's played",
    description:
      "P1 holds Sandayu Oda - Hanako's Guardian (Retail) (green, cost 7, power 8). P1 has d6/d8 at face 5 and d4/d10 at face 3 — two value-pairs. PLAY: spend a rival unit per friendly value-pair.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [
            c.welcomeToNightCityRetailSandayuOdaHanakoSGuardian,
            c.welcomeToNightCityRetailPeaceOffering,
          ],
          field: [],
          legendArea: [c.alphaVCorporateExile],
          eddies: 8,
          gigArea: [
            { dieType: "d6", faceValue: 5 },
            { dieType: "d8", faceValue: 5 },
            { dieType: "d4", faceValue: 3 },
            { dieType: "d10", faceValue: 3 },
          ],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: false },
            { card: c.alphaArmoredMinotaur, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("unitSandayuOdaHanakoSGuardianRetail"), autoGainGig: false },
      ),
  },

  // ── Retail Unit: Gig steal + ready (Wraith Marauders) ────────────────────
  {
    id: "unitWraithMaraudersRetail",
    group: "unit-gig-stolen",
    label: "Wraith Marauders (Retail) · steal gig then ready matching-power unit",
    description:
      "P1 has Wraith Marauders (Retail) (red, cost 4, power 4) on the field with two friendly spent units. When it attacks and steals a gig, may ready a friendly spent unit whose power equals the stolen gig's value.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          field: [
            {
              card: c.welcomeToNightCityRetailWraithMarauders,
              spent: false,
              playedThisTurn: false,
            },
            { card: c.alphaSwordwiseHuscle, spent: true, playedThisTurn: false },
            { card: c.alphaArmoredMinotaur, spent: true, playedThisTurn: false },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 5 }],
        },
        { seed: scenarioSeed("unitWraithMaraudersRetail"), autoGainGig: false },
      ),
  },
];
