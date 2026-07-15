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
          hand: [
            c.welcomeToNightCityRetailCorporateSurveillance,
            c.welcomeToNightCityRetailCorporateSurveillance,
            c.welcomeToNightCityRetailAllIsLost,
            c.welcomeToNightCityRetailIndustrialAssembly,
            c.welcomeToNightCityRetailOverTheEdge,
          ],
          field: [{ card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 3,
          gigArea: [
            { dieType: "d4", faceValue: 2 },
            { dieType: "d20", faceValue: 8 },
          ],
        },
        {
          field: [
            { card: c.welcomeToNightCityRetailCorpoSecurity, spent: false },
            { card: c.welcomeToNightCityRetailCorpoSecurity, spent: false },
            { card: c.welcomeToNightCityRetailJackieWellesRideOrDieChoom, spent: true },
          ],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [
            { dieType: "d6", faceValue: 3 },
            { dieType: "d20", faceValue: 7 },
          ],
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
          hand: [c.welcomeToNightCityRetailCorporateSurveillance],
          field: [{ card: c.welcomeToNightCityRetailSecondhandBombus, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
        {
          field: [{ card: c.embracingPowerRetailStarterDeckMinotaur, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
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
          hand: [c.welcomeToNightCityRetailFloorIt],
          field: [
            { card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: true },
            { card: c.welcomeToNightCityRetailSecondhandBombus, spent: false },
          ],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 4,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.welcomeToNightCityRetailCorpoSecurity, spent: true },
            { card: c.embracingPowerRetailStarterDeckMinotaur, spent: false },
          ],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
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
          hand: [c.welcomeToNightCityRetailFloorIt],
          field: [{ card: c.welcomeToNightCityRetailSecondhandBombus, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 4,
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
        {
          field: [{ card: c.welcomeToNightCityRetailJackieWellesRideOrDieChoom, spent: true }],
          legendArea: [c.embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch],
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
          hand: [c.welcomeToNightCityRetailIndustrialAssembly],
          field: [{ card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 3 }],
        },
        {
          field: [{ card: c.welcomeToNightCityRetailCorpoSecurity, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
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
          hand: [c.welcomeToNightCityRetailIndustrialAssembly],
          field: [{ card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 3,
          gigArea: [
            { dieType: "d4", faceValue: 4 },
            { dieType: "d6", faceValue: 4 },
            { dieType: "d8", faceValue: 1 },
          ],
        },
        {
          field: [{ card: c.welcomeToNightCityRetailCorpoSecurity, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
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
          hand: [c.welcomeToNightCityRetailRebootOptics],
          field: [
            { card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false },
            { card: c.welcomeToNightCityRetailSecondhandBombus, spent: true },
          ],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.welcomeToNightCityRetailCorpoSecurity, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
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
          hand: [c.welcomeToNightCityRetailRebootOptics],
          field: [],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
        {
          field: [{ card: c.welcomeToNightCityRetailCorpoSecurity, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
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
          hand: [c.welcomeToNightCityRetailAfterpartyAtLizzieS],
          field: [{ card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 3,
          gigArea: [
            { dieType: "d6", faceValue: 4 },
            { dieType: "d4", faceValue: 2 },
          ],
        },
        {
          field: [{ card: c.welcomeToNightCityRetailCorpoSecurity, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [
            { dieType: "d6", faceValue: 4 },
            { dieType: "d12", faceValue: 10 },
          ],
        },
        { seed: scenarioSeed("progAfterpartyAtLizzies"), autoGainGig: false },
      ),
  },
  {
    id: "progFoolOnTheHill",
    group: "program-gig-manipulation",
    label: "Fool on the Hill · rival reveal destination choice",
    description:
      "P1 holds Fool on the Hill with two known cards on top of deck. Rival chooses whether the revealed cards go to hand or trash; trashing them draws 2.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailFoolOnTheHill],
          deck: [
            c.welcomeToNightCityRetailFieldOperator,
            c.welcomeToNightCityRetailDelamainCab,
            c.welcomeToNightCityRetailCorpoSecurity,
            c.welcomeToNightCityRetailSecondhandBombus,
          ],
          field: [{ card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.welcomeToNightCityRetailCorpoSecurity, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("progFoolOnTheHill"), preserveDeckOrder: true, autoGainGig: false },
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
          hand: [c.welcomeToNightCityRetailCyberpsychosis],
          field: [
            {
              card: c.welcomeToNightCityRetailTBugAmateurPhilosopher,
              spent: false,
              attachedGears: [
                c.welcomeToNightCityRetailKiroshiOptics,
                c.welcomeToNightCityRetailDyingNightVSPistol,
              ],
            },
            { card: c.welcomeToNightCityRetailSecondhandBombus, spent: false },
          ],
          legendArea: [{ card: c.theHeistRetailStarterDeckVCorporateExile, faceDown: false }],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.welcomeToNightCityRetailCorpoSecurity, spent: true },
            { card: c.embracingPowerRetailStarterDeckMinotaur, spent: true },
          ],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
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
          hand: [c.welcomeToNightCityRetailChromeReverie],
          field: [{ card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false }],
          legendArea: [
            { card: c.welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, faceDown: true },
            { card: c.theHeistRetailStarterDeckVCorporateExile, faceDown: false },
          ],
          eddies: 4,
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 3 },
          ],
        },
        {
          field: [
            { card: c.welcomeToNightCityRetailCorpoSecurity, spent: false },
            { card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false },
          ],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
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
          hand: [c.welcomeToNightCityRetailPeaceOffering],
          field: [{ card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 2,
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 6 },
          ],
        },
        {
          field: [{ card: c.welcomeToNightCityRetailCorpoSecurity, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
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
          hand: [c.welcomeToNightCityRetailCarnageAtTheColosseum],
          field: [{ card: c.embracingPowerRetailStarterDeckMinotaur, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 4,
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d10", faceValue: 8 },
            { dieType: "d6", faceValue: 5 },
          ],
        },
        {
          field: [
            { card: c.welcomeToNightCityRetailMoxInciters, spent: false },
            { card: c.embracingPowerRetailStarterDeckMinotaur, spent: false },
          ],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("progCarnageAtTheColosseum"), autoGainGig: false },
      ),
  },

  // ── Program: Bootleg Black Sapphire Show (Retail) ───────────────────────
  {
    id: "progBootlegBlackSapphireShowRetail",
    group: "program-gig-manipulation",
    label: "Bootleg Black Sapphire Show (Retail) · sells deck and draws from odd/even Gigs",
    description:
      "P1 holds Bootleg Black Sapphire Show retail and controls one even-value Gig plus one odd-value Gig. Tests selling the top deck card before drawing two from the conditional bonus.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailBootlegBlackSapphireShow],
          deck: [
            c.welcomeToNightCityRetailCorpoSecurity,
            c.welcomeToNightCityRetailMoxInciters,
            c.welcomeToNightCityRetailSwordwiseHuscle,
          ],
          field: [{ card: c.welcomeToNightCityRetailSecondhandBombus, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 5,
          gigArea: [
            { dieType: "d4", faceValue: 2 },
            { dieType: "d6", faceValue: 3 },
          ],
        },
        {
          field: [{ card: c.welcomeToNightCityRetailCorpoSecurity, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [],
        },
        {
          seed: scenarioSeed("progBootlegBlackSapphireShowRetail"),
          autoGainGig: false,
          preserveDeckOrder: true,
        },
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
          field: [{ card: c.embracingPowerRetailStarterDeckMinotaur, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 4,
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d10", faceValue: 8 },
            { dieType: "d6", faceValue: 5 },
          ],
        },
        {
          field: [
            { card: c.welcomeToNightCityRetailMoxInciters, spent: false },
            { card: c.embracingPowerRetailStarterDeckMinotaur, spent: false },
          ],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
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
          field: [{ card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false }],
          legendArea: [
            { card: c.welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, faceDown: true },
            { card: c.theHeistRetailStarterDeckVCorporateExile, faceDown: false },
          ],
          eddies: 4,
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 3 },
          ],
        },
        {
          field: [
            { card: c.welcomeToNightCityRetailCorpoSecurity, spent: false },
            { card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false },
          ],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
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
              card: c.welcomeToNightCityRetailSwordwiseHuscle,
              spent: false,
              attachedGears: [
                c.welcomeToNightCityRetailKiroshiOptics,
                c.welcomeToNightCityRetailMantisBlades,
              ],
            },
            { card: c.welcomeToNightCityRetailSecondhandBombus, spent: false },
          ],
          legendArea: [{ card: c.theHeistRetailStarterDeckVCorporateExile, faceDown: false }],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.welcomeToNightCityRetailCorpoSecurity, spent: true },
            { card: c.embracingPowerRetailStarterDeckMinotaur, spent: true },
          ],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
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
          field: [{ card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 2,
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 6 },
          ],
        },
        {
          field: [{ card: c.welcomeToNightCityRetailCorpoSecurity, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
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
  {
    id: "progAllIsLostRetail",
    group: "program-spend",
    label: "All is Lost · trash 3 and recover Unit",
    description:
      "P1 holds All is Lost with an ordered top deck containing Units and non-Units so the trash-3 recovery choice is visible.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailAllIsLost],
          deck: [
            c.welcomeToNightCityRetailMoxInciters,
            c.welcomeToNightCityRetailRebootOptics,
            c.welcomeToNightCityRetailMantisBlades,
            c.welcomeToNightCityRetailSwordwiseHuscle,
          ],
          field: [{ card: c.welcomeToNightCityRetailSecondhandBombus, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 2,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.welcomeToNightCityRetailCorpoSecurity, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
          eddies: 4,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        {
          seed: scenarioSeed("progAllIsLostRetail"),
          autoGainGig: false,
          preserveDeckOrder: true,
        },
      ),
  },
  {
    id: "progOverTheEdgeRetail",
    group: "program-spend",
    label: "Over the Edge · friendly d20 power threshold",
    description:
      "P1 holds Over the Edge and controls a d20 showing 7. Field has Units above and below that power threshold for the defeat target picker.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailOverTheEdge],
          field: [{ card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 4,
          gigArea: [{ dieType: "d20", faceValue: 7 }],
        },
        {
          field: [
            { card: c.welcomeToNightCityRetailCorpoSecurity, spent: false },
            { card: c.embracingPowerRetailStarterDeckMinotaur, spent: false },
          ],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("progOverTheEdgeRetail"), autoGainGig: false },
      ),
  },
  {
    id: "progTakeControlRetail",
    group: "program-spend",
    label: "Take Control · Quick attacker mitigation",
    description:
      "P1 holds Take Control while rival has Vehicle/Drone-style attackers. Use this board to validate the quick play reaction, steals-one-fewer-Gig rule, and AI/Drone/Vehicle draw condition.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailTakeControl],
          field: [{ card: c.welcomeToNightCityRetailCorpoSecurity, spent: false }],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.welcomeToNightCityRetailDelamainCab, spent: false },
            { card: c.welcomeToNightCityRetailEmergencyAtlus, spent: false },
          ],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
          eddies: 4,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("progTakeControlRetail"), autoGainGig: false },
      ),
  },
];
