import type { Scenario } from "./types";
import { c, CyberpunkTestEngine, scenarioSeed } from "./shared";

export const programScenarios: Scenario[] = [
  // ── Program: Spend (Corporate Surveillance) ─────────────────────────────
  {
    id: "progCorporateSurveillance",
    group: "program-spend",
    label: "Corporate Surveillance · rival field has targets",
    description:
      "P1 holds Corporate Surveillance (cost 2, green). Rival field includes Corpo Security (cost 2) and a spent Jackie Welles (cost 6). Only Corpo Security is a valid target (cost ≤ 3).",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaCorporateSurveillance],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: false },
            { card: c.alphaCorpoSecurity, spent: false },
            { card: c.alphaJackieWellesRideOrDieChoom, spent: true },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("progCorporateSurveillance"), autoGainGig: false },
      ),
  },
  {
    id: "progCorporateSurveillanceNoTargets",
    group: "program-spend",
    label: "Corporate Surveillance · no valid targets",
    description:
      "P1 holds Corporate Surveillance (cost 2). Rival field only has Armored Minotaur (cost 6) — exceeds the cost-3 threshold. Tests fizzle / no-valid-target behaviour.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaCorporateSurveillance],
          field: [{ card: c.alphaSecondhandBombus, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
        {
          field: [{ card: c.alphaArmoredMinotaur, spent: false }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 4 }],
        },
        { seed: scenarioSeed("progCorporateSurveillanceNoTargets"), autoGainGig: false },
      ),
  },

  // ── Program: Bounce (Floor It) ──────────────────────────────────────────
  {
    id: "progFloorIt",
    group: "program-bounce",
    label: "Floor It · spent units to bounce",
    description:
      "P1 holds Floor It (cost 3, blue). Both fields have spent units with cost ≤ 4: opponent has a spent Corpo Security (cost 2). Tests target selection for bouncing a spent unit.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaFloorIt],
          field: [
            { card: c.alphaSwordwiseHuscle, spent: true },
            { card: c.alphaSecondhandBombus, spent: false },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 4,
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
        { seed: scenarioSeed("progFloorIt"), autoGainGig: false },
      ),
  },
  {
    id: "progFloorItNoTargets",
    group: "program-bounce",
    label: "Floor It · no spent low-cost units",
    description:
      "P1 holds Floor It. All units on both fields are either ready or cost > 4 (spent Jackie Welles at cost 6). Tests no-valid-target edge case.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaFloorIt],
          field: [{ card: c.alphaSecondhandBombus, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 4,
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
        {
          field: [{ card: c.alphaJackieWellesRideOrDieChoom, spent: true }],
          legendArea: [c.alphaSaburoArasakaStubbornPatriach],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 4 }],
        },
        { seed: scenarioSeed("progFloorItNoTargets"), autoGainGig: false },
      ),
  },

  // ── Program: Gig manipulation (Industrial Assembly) ─────────────────────
  {
    id: "progIndustrialAssembly",
    group: "program-gig",
    label: "Industrial Assembly · low Street Cred",
    description:
      "P1 holds Industrial Assembly (cost 2, red). P1 has 1 Gig (face value 3) for Street Cred 3 — below the 7 threshold. Tests gig increase without the bonus draw.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaIndustrialAssembly],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 3 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: false }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 2 }],
        },
        { seed: scenarioSeed("progIndustrialAssembly"), autoGainGig: true },
      ),
  },
  {
    id: "progIndustrialAssemblyHighCred",
    group: "program-gig",
    label: "Industrial Assembly · 7+ Street Cred triggers draw",
    description:
      "P1 holds Industrial Assembly. P1 has 3 Gigs (face values 4+4+1 = 9 Street Cred). After the +4 gig increase, the Street Cred condition is met and a bonus card is drawn.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaIndustrialAssembly],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [
            { dieType: "d4", faceValue: 4 },
            { dieType: "d6", faceValue: 4 },
            { dieType: "d8", faceValue: 1 },
          ],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: false }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [
            { dieType: "d10", faceValue: 5 },
            { dieType: "d6", faceValue: 2 },
            { dieType: "d4", faceValue: 1 },
          ],
        },
        { seed: scenarioSeed("progIndustrialAssemblyHighCred"), autoGainGig: false },
      ),
  },

  // ── Program: Power buff (Reboot Optics) ─────────────────────────────────
  {
    id: "progRebootOptics",
    group: "program-power",
    label: "Reboot Optics · friendly units on field",
    description:
      "P1 holds Reboot Optics (cost 2, yellow). P1 has Swordwise Huscle (ready) on the field. Tests +4 power buff with end-of-turn defeat.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaRebootOptics],
          field: [
            { card: c.alphaSwordwiseHuscle, spent: false },
            { card: c.alphaSecondhandBombus, spent: true },
          ],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: false }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("progRebootOptics"), autoGainGig: false },
      ),
  },
  {
    id: "progRebootOpticsEmptyField",
    group: "program-power",
    label: "Reboot Optics · no friendly units",
    description:
      "P1 holds Reboot Optics but has no units on the field. Tests the no-valid-target edge case for the power buff.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaRebootOptics],
          field: [],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: false }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 2 }],
        },
        { seed: scenarioSeed("progRebootOpticsEmptyField"), autoGainGig: false },
      ),
  },

  // ── Program: Rival gig manipulation (Afterparty at Lizzie's) ────────────
  {
    id: "progAfterpartyAtLizzies",
    group: "program-gig-manipulation",
    label: "Afterparty at Lizzie's · rival gig to adjust",
    description:
      "P1 holds Afterparty at Lizzie's (cost 2, yellow). Rival has a d6 at face 4 and a d12 at face 10. P1 has a d6 at face 4 — matching the rival's d6 allows the bonus draw. Tests gig adjustment and value-matching draw.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.spoilerAfterpartyAtLizzieS],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [
            { dieType: "d6", faceValue: 4 },
            { dieType: "d4", faceValue: 2 },
          ],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: false }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [
            { dieType: "d6", faceValue: 4 },
            { dieType: "d12", faceValue: 10 },
          ],
        },
        { seed: scenarioSeed("progAfterpartyAtLizzies"), autoGainGig: false },
      ),
  },

  // ── Program: Attack-triggered buff (Cyberpsychosis) ─────────────────────
  {
    id: "progCyberpsychosis",
    group: "program-power",
    label: "Cyberpsychosis · equipped unit on field",
    description:
      "P1 holds Cyberpsychosis (cost 2, yellow). P1 has T-Bug (equipped with 2 gear cards) on the field. Tests +2 power per gear (total +4) with end-of-turn defeat. Also requires a friendly unit or face-up Legend to spend as additional cost.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.spoilerCyberpsychosis],
          field: [
            {
              card: c.alphaTBugAmateurPhilosopher,
              spent: false,
              attachedGears: [c.alphaKiroshiOptics, c.alphaDyingNightVSPistol],
            },
            { card: c.alphaSecondhandBombus, spent: false },
          ],
          legendArea: [{ card: c.alphaVCorporateExile, faceDown: false }],
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
        { seed: scenarioSeed("progCyberpsychosis"), autoGainGig: false },
      ),
  },
  {
    id: "progChromeReverie",
    group: "program-legend-call",
    label: "Chrome Reverie · min Gig can call a Legend for free",
    description:
      "P1 holds Chrome Reverie (blue, cost 3). P1 controls a min-value d4 and has a face-down Legend. Rival has a ready Unit that can be targeted with can't-attack. Visual fixture for the release card's two-step targeting state.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.spoilerChromeReverie],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [
            { card: c.spoilerRiverWardDetectiveOnTheHunt, faceDown: true },
            { card: c.alphaVCorporateExile, faceDown: false },
          ],
          eddies: 4,
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 3 },
          ],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: false },
            { card: c.alphaSwordwiseHuscle, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 4,
          gigArea: [{ dieType: "d8", faceValue: 5 }],
        },
        { seed: scenarioSeed("progChromeReverie"), autoGainGig: false },
      ),
  },
  {
    id: "progPeaceOffering",
    group: "program-gig-manipulation",
    label: "Peace Offering · copy Gig value and draw from a pair",
    description:
      "P1 holds Peace Offering and has two friendly Gigs. Tests the two-Gig choice that can create a value-pair and draw a card.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.spoilerPeaceOffering],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 2,
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 6 },
          ],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: false }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [],
        },
        { seed: scenarioSeed("progPeaceOffering"), autoGainGig: false },
      ),
  },
  {
    id: "progCarnageAtTheColosseum",
    group: "program-cost-modifier",
    label: "Carnage At The Colosseum · defeat weaker rival Unit",
    description:
      "P1 holds Carnage At The Colosseum with enough eddies and a stronger friendly Unit. Rival has one weak and one strong Unit; only the weaker Unit is a valid defeat target.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.spoilerCarnageAtTheColosseum],
          field: [{ card: c.alphaArmoredMinotaur, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 4,
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d10", faceValue: 8 },
            { dieType: "d6", faceValue: 5 },
          ],
        },
        {
          field: [
            { card: c.alphaRuthlessLowlife, spent: false },
            { card: c.alphaArmoredMinotaur, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("progCarnageAtTheColosseum"), autoGainGig: false },
      ),
  },

  // ── Program: Carnage At The Colosseum (Retail) ───────────────────────────
  {
    id: "progCarnageAtTheColosseumRetail",
    group: "program-cost-modifier",
    label: "Carnage At The Colosseum (Retail) · defeat weaker rival Unit",
    description:
      "P1 holds Carnage At The Colosseum retail with enough eddies and a stronger friendly Unit. Rival has one weak and one strong Unit; only the weaker Unit is a valid defeat target.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailCarnageAtTheColosseum],
          field: [{ card: c.alphaArmoredMinotaur, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 4,
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d10", faceValue: 8 },
            { dieType: "d6", faceValue: 5 },
          ],
        },
        {
          field: [
            { card: c.alphaRuthlessLowlife, spent: false },
            { card: c.alphaArmoredMinotaur, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("progCarnageAtTheColosseumRetail"), autoGainGig: false },
      ),
  },

  // ── Program: Chrome Reverie (Retail) ─────────────────────────────────────
  {
    id: "progChromeReverieRetail",
    group: "program-legend-call",
    label: "Chrome Reverie (Retail) · min Gig can call a Legend for free",
    description:
      "P1 holds Chrome Reverie retail (blue, cost 3). P1 controls a min-value d4 and has a face-down Legend. Rival has a ready Unit that can be targeted with can't-attack.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailChromeReverie],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [
            { card: c.spoilerRiverWardDetectiveOnTheHunt, faceDown: true },
            { card: c.alphaVCorporateExile, faceDown: false },
          ],
          eddies: 4,
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 3 },
          ],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: false },
            { card: c.alphaSwordwiseHuscle, spent: false },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 4,
          gigArea: [{ dieType: "d8", faceValue: 5 }],
        },
        { seed: scenarioSeed("progChromeReverieRetail"), autoGainGig: false },
      ),
  },

  // ── Program: Cyberpsychosis (Retail) ─────────────────────────────────────
  {
    id: "progCyberpsychosisRetail",
    group: "program-power",
    label: "Cyberpsychosis (Retail) · equipped unit on field",
    description:
      "P1 holds Cyberpsychosis retail (cost 3, yellow). P1 has Swordwise Huscle (equipped with 2 gear cards) on the field. Tests structural setup for the quick-cast buff.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailCyberpsychosis],
          field: [
            {
              card: c.alphaSwordwiseHuscle,
              spent: false,
              attachedGears: [c.alphaKiroshiOptics, c.alphaMantisBlades],
            },
            { card: c.alphaSecondhandBombus, spent: false },
          ],
          legendArea: [{ card: c.alphaVCorporateExile, faceDown: false }],
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
        { seed: scenarioSeed("progCyberpsychosisRetail"), autoGainGig: false },
      ),
  },

  // ── Program: Peace Offering (Retail) ─────────────────────────────────────
  {
    id: "progPeaceOfferingRetail",
    group: "program-gig-manipulation",
    label: "Peace Offering (Retail) · copy Gig value and draw from a pair",
    description:
      "P1 holds Peace Offering retail and has two friendly Gigs. Tests the two-Gig choice that can create a value-pair and draw a card.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailPeaceOffering],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 2,
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 6 },
          ],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: false }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [],
        },
        {
          seed: scenarioSeed("progPeaceOfferingRetail"),
          autoGainGig: false,
          preserveDeckOrder: true,
        },
      ),
  },
];
