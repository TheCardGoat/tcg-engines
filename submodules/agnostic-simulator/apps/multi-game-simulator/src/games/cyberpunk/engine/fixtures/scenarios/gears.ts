import type { Scenario } from "./types";
import { c, CyberpunkTestEngine, P1, P2, scenarioSeed, skipGainGig } from "./shared";

export const gearScenarios: Scenario[] = [
  // ── Gear: Attack-triggered gear removal (Dying Night, V's Pistol) ───────
  {
    id: "gearDyingNightHighCred",
    group: "gear-attack-trigger",
    label: "Dying Night · 7+ Street Cred, rival has gear",
    description:
      "P1 has T-Bug equipped with Dying Night (cost 2, blue, power 2). P1 Street Cred is 8 (d4=3 + d6=5). Rival has Corpo Security equipped with Kiroshi Optics (cost 1). On attack, should be able to defeat a rival gear with cost ≤ 2.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [
            {
              card: c.alphaTBugAmateurPhilosopher,
              spent: false,
              attachedGears: [c.alphaDyingNightVSPistol],
            },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 5 },
          ],
        },
        {
          hand: [],
          field: [
            {
              card: c.alphaCorpoSecurity,
              spent: true,
              attachedGears: [c.alphaKiroshiOptics],
            },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        { seed: scenarioSeed("gearDyingNightHighCred"), autoGainGig: false },
      ),
  },
  {
    id: "gearDyingNightLowCred",
    group: "gear-attack-trigger",
    label: "Dying Night · below 7 Street Cred",
    description:
      "P1 has T-Bug equipped with Dying Night. P1 Street Cred is only 4 (d4=4). Rival has Corpo Security with Kiroshi Optics. The defeat-gear effect should NOT trigger because Street Cred < 7.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [
            {
              card: c.alphaTBugAmateurPhilosopher,
              spent: false,
              attachedGears: [c.alphaDyingNightVSPistol],
            },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 4 }],
        },
        {
          field: [
            {
              card: c.alphaCorpoSecurity,
              spent: true,
              attachedGears: [c.alphaKiroshiOptics],
            },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("gearDyingNightLowCred"), autoGainGig: false },
      ),
  },

  // ── Gear: Peek at face-down legend (Kiroshi Optics) ─────────────────────
  {
    id: "gearKiroshiOptics",
    group: "gear-attack-trigger",
    label: "Kiroshi Optics · face-down legend to peek",
    description:
      "P1 has Swordwise Huscle equipped with Kiroshi Optics (cost 1, yellow, power 1). P1 has 2 face-down legends. On attack, should be able to look at a friendly face-down legend without revealing it to the opponent.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [
            {
              card: c.alphaSwordwiseHuscle,
              spent: false,
              attachedGears: [c.alphaKiroshiOptics],
            },
          ],
          legendArea: [
            { card: c.alphaVCorporateExile, faceDown: true },
            { card: c.alphaYorinobuArasakaEmbracingDestruction, faceDown: true },
            { card: c.alphaGoroTakemuraHandsUnclean, faceDown: false },
          ],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("gearKiroshiOptics"), autoGainGig: false },
      ),
  },
  {
    id: "gearKiroshiOpticsNoFaceDown",
    group: "gear-attack-trigger",
    label: "Kiroshi Optics · no face-down legends",
    description:
      "P1 has a unit equipped with Kiroshi Optics. All 3 friendly legends are already face-up. Tests that the look-at effect has no valid targets.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [
            {
              card: c.alphaSwordwiseHuscle,
              spent: false,
              attachedGears: [c.alphaKiroshiOptics],
            },
          ],
          legendArea: [
            { card: c.alphaVCorporateExile, faceDown: false },
            { card: c.alphaYorinobuArasakaEmbracingDestruction, faceDown: false },
            { card: c.alphaGoroTakemuraHandsUnclean, faceDown: false },
          ],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("gearKiroshiOpticsNoFaceDown"), autoGainGig: false },
      ),
  },

  // ── Gear: BLOCKER keyword (Mandibular Upgrade) ──────────────────────────
  {
    id: "gearMandibularUpgrade",
    group: "gear-blocker",
    label: "Mandibular Upgrade · BLOCKER ready to intercept",
    description:
      "P1 has Swordwise Huscle equipped with Mandibular Upgrade (cost 1, yellow, power 0). Rival is attacking with Armored Minotaur. The equipped unit should be able to spend as a BLOCKER to redirect the attack. Tests that the BLOCKER keyword from gear works on the host unit.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [
            {
              card: c.alphaSecondhandBombus,
              spent: false,
            },
            {
              card: c.alphaSwordwiseHuscle,
              spent: false,
              attachedGears: [c.alphaMandibularUpgrade],
            },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            {
              card: c.alphaArmoredMinotaur,
              spent: false,
              attachedGears: [c.alphaMandibularUpgrade],
            },
            { card: c.alphaArmoredMinotaur, spent: true },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("gearMandibularUpgrade"), autoGainGig: false },
      );
      if (engine.getState().G.turnMetadata.activePlayerId === P1) {
        engine.completeTurn({ as: P1 });
        skipGainGig(engine);
      }
      const attackingMinotaur = engine
        .getCardsInZone("field", P2)
        .filter(
          (card) =>
            card.definitionId === c.alphaArmoredMinotaur.id &&
            card.meta.attachedGearIds.length === 0,
        )[0];
      if (!attackingMinotaur) {
        throw new Error("gearMandibularUpgrade fixture could not find the un-geared Minotaur.");
      }
      engine.attackRival(attackingMinotaur, { as: P2 });
      engine.resolveAttack({ as: P2 });
      return engine;
    },
  },

  // ── Gear: Vanilla stat boost (Mantis Blades) ────────────────────────────
  {
    id: "gearMantisBlades",
    group: "gear-stat-boost",
    label: "Mantis Blades · pure power boost",
    description:
      "P1 has Swordwise Huscle (base power 5) equipped with Mantis Blades (cost 1, red, power 2). Total power should be 7. No triggered abilities — verifies gear power stacking on the unit card.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [
            {
              card: c.alphaSwordwiseHuscle,
              spent: false,
              attachedGears: [c.alphaMantisBlades],
            },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
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
        { seed: scenarioSeed("gearMantisBlades"), autoGainGig: false },
      ),
  },

  // ── Gear: Rush / canAttackOnPlayedTurnAgainstUnits (Sandevistan) ────────
  {
    id: "gearSandevistan",
    group: "gear-rush",
    label: "Sandevistan · grants attack-on-play against units",
    description:
      "P1 has Swordwise Huscle equipped with Sandevistan (cost 3, green, power 3). On equip, grants the host canAttackOnPlayedTurnAgainstUnits for the turn. P1 is in the main phase with spent rival units. Tests that the PLAY trigger enables attacking spent units on the turn the host entered play.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaSandevistan, c.alphaSwordwiseHuscle],
          field: [],
          legendArea: [c.alphaVCorporateExile],
          eddies: c.alphaSandevistan.cost + c.alphaSwordwiseHuscle.cost,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: true },
            { card: c.alphaSecondhandBombus, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("gearSandevistan"), autoGainGig: false },
      ),
  },

  // ── Gear: Fight reward draw (Satori, Sword of Saburo) ───────────────────
  {
    id: "gearSatoriSwordOfSaburo",
    group: "gear-fight-reward",
    label: "Satori · draw on fight win",
    description:
      "P1 has T-Bug (power 5) equipped with Satori (cost 2, red, power 1, total power 6). Rival has Corpo Security (power 2, spent). When T-Bug attacks and wins the fight, should draw 1 card. Tests the onFightResolved trigger.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaRuthlessLowlife],
          field: [
            {
              card: c.alphaTBugAmateurPhilosopher,
              spent: false,
              attachedGears: [c.alphaSatoriSwordOfSaburo],
            },
          ],
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
        { seed: scenarioSeed("gearSatoriSwordOfSaburo"), autoGainGig: false },
      ),
  },

  // ── Gear: Gig steal on gig theft (Gorilla Arms) ─────────────────────────
  {
    id: "gearGorillaArms",
    group: "gear-gig-steal",
    label: "Gorilla Arms · steal matching gig on direct attack",
    description:
      "P1 has T-Bug (power 5) equipped with Gorilla Arms (cost 4, yellow, power 4, total power 9). Rival has 3 Gigs, including two d4s from prior steals (d4=1, d4=2, d12=8). On a successful direct attack, the first d4 stolen triggers Gorilla Arms: may steal the remaining rival d4 with the same number of sides. Tests the gigStolen event trigger with sameSidesAs constraint.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [
            {
              card: c.alphaTBugAmateurPhilosopher,
              spent: false,
              attachedGears: [c.spoilerGorillaArms],
            },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        {
          field: [],
          legendArea: [
            c.alphaJackieWellesPourOneOutForMe,
            c.alphaSaburoArasakaStubbornPatriach,
            c.alphaViktorVektorSitDownAndRelax,
          ],
          eddies: 5,
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d4", faceValue: 2, source: "rival" },
            { dieType: "d12", faceValue: 8 },
          ],
        },
        { seed: scenarioSeed("gearGorillaArms"), autoGainGig: false, activePlayerId: P1 },
      ),
  },
  {
    id: "gearZetatechFaceplate",
    group: "gear-spent-trigger",
    label: "Zetatech Faceplate · attached to a face-up Legend",
    description:
      "P1 has Zetatech Faceplate attached to a face-up Legend with three friendly Gigs at distinct values. Visual fixture for release-card gear attached to a Legend instead of a Unit.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaRebootOptics],
          field: [
            {
              card: c.alphaSwordwiseHuscle,
              spent: false,
              attachedGears: [c.spoilerZetatechFaceplate],
            },
          ],
          legendArea: [
            {
              card: c.alphaVCorporateExile,
              faceDown: false,
            },
            { card: c.spoilerRiverWardDetectiveOnTheHunt, faceDown: true },
          ],
          eddies: 4,
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 2 },
            { dieType: "d8", faceValue: 3 },
          ],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 4,
          gigArea: [{ dieType: "d10", faceValue: 4 }],
        },
        { seed: scenarioSeed("gearZetatechFaceplate"), autoGainGig: false },
      ),
  },

  // ── Gear: Attach to go-solo Legend on field ──────────────────────────────
  {
    id: "gearAttachToGoSoloLegend",
    group: "gear-stat-boost",
    label: "Mantis Blades · attach to a go-solo Legend on the field",
    description:
      "P1 has V - Corporate Exile on the field (as a unit from GO SOLO). P1 has Mantis Blades in hand. Tests that gear can be attached to a go-solo legend that's currently a unit on the field.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaMantisBlades],
          field: [
            {
              card: c.alphaVCorporateExile,
              spent: false,
              faceDown: false,
            },
          ],
          legendArea: [{ card: c.alphaGoroTakemuraHandsUnclean, faceDown: false }],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("gearAttachToGoSoloLegend"), autoGainGig: false },
      ),
  },
];
