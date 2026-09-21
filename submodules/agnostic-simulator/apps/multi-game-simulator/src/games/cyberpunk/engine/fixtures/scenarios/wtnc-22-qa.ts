import type { Scenario } from "./types";
import { c, CyberpunkTestEngine, scenarioSeed } from "./shared";

/**
 * Human QA boards for the 22-card Welcome to Night City wave.
 * Open with `?ai=off&auto-advance-attack=off`. Refresh the page to reset,
 * then try a different card on the same board.
 */
export const wtnc22QaScenarios: Scenario[] = [
  {
    id: "retailWtnc22FixerCallQa",
    group: "release-qa",
    label: "WTNC 22 · Fixer Call / Spend",
    description:
      "Dexter, Muamar, and Padre start face-down. Call costs 1 Eddie and can be done once per turn — refresh to try the next Legend. Positive: pick the printed Call mode (buff / protect / spend a rival), or Draw 1. After a Call, Spend that Legend to adjust or copy a Gig. Negative: Call a second Legend the same turn; Spend before calling; choose Spend-a-rival when you already spent the only ready rival Unit.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailFloorIt, c.welcomeToNightCityRetailMoxInciters],
          deck: 16,
          field: [
            {
              card: c.welcomeToNightCityRetailFieldOperator,
              spent: false,
              hasLag: false,
            },
          ],
          legendArea: [
            { card: c.welcomeToNightCityRetailDexterDeshawnOffTheGrid, faceDown: true },
            { card: c.welcomeToNightCityRetailMuamarReyesElCapitan, faceDown: true },
            { card: c.welcomeToNightCityRetailPadreManOfTheCross, faceDown: true },
          ],
          eddies: 6,
          gigArea: [
            { dieType: "d6", faceValue: 3 },
            { dieType: "d10", faceValue: 8 },
          ],
        },
        {
          hand: [c.welcomeToNightCityRetailRebootOptics, c.welcomeToNightCityRetailPeaceOffering],
          field: [
            {
              card: c.embracingPowerRetailStarterDeckMinotaur,
              spent: false,
              hasLag: false,
            },
            {
              card: c.welcomeToNightCityRetailSwordwiseHuscle,
              spent: true,
              hasLag: false,
            },
          ],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
          eddies: 4,
          gigArea: [
            { dieType: "d8", faceValue: 5 },
            { dieType: "d12", faceValue: 10 },
          ],
        },
        { seed: scenarioSeed("retailWtnc22FixerCallQa"), autoGainGig: false },
      ),
  },
  {
    id: "retailWtnc22CombatStealQa",
    group: "release-qa",
    label: "WTNC 22 · Combat / steal / programs",
    description:
      "Hand: Chrome Fang, Gunpoint Diplomacy, (Don't Fear) The Reaper, Delamain. Field: equipped Maelstrom Goons and Ruthless Lowlife (ready). Rogue is face-down for GO SOLO. P1 Street Cred is 5 vs P2 18, so Gunpoint lets the Rival choose; steal first if you want both effects instead. Positive: Chrome Fang then a low-power rival steal of the d10; Goons steal while equipped; Reaper spends then defeats; Delamain draws 2; Ruthless can hit spent Units only. Negative: skip Chrome Fang and let a low-power Unit steal the 9-value Gig; attack the rival with Ruthless; GO SOLO Rogue into an odd Gig for a discard instead of an even draw.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [
            c.welcomeToNightCityRetailChromeFang,
            c.welcomeToNightCityRetailGunpointDiplomacy,
            c.welcomeToNightCityRetailDonTFearTheReaper,
            c.welcomeToNightCityRetailDelamainRideshareAi,
          ],
          deck: 16,
          field: [
            {
              card: c.welcomeToNightCityRetailMaelstromGoons,
              spent: false,
              hasLag: false,
              attachedGears: [c.welcomeToNightCityRetailZetatechFaceplate],
            },
            {
              card: c.welcomeToNightCityRetailRuthlessLowlife,
              spent: false,
              hasLag: false,
            },
          ],
          legendArea: [
            { card: c.welcomeToNightCityRetailRogueAmendiaresPreemSolo, faceDown: true },
          ],
          eddies: 18,
          gigArea: [
            { dieType: "d6", faceValue: 2 },
            { dieType: "d10", faceValue: 3 },
          ],
        },
        {
          hand: [
            c.welcomeToNightCityRetailFoolOnTheHill,
            c.welcomeToNightCityRetailTrustNoOne,
            c.welcomeToNightCityRetailSafetyOverride,
          ],
          field: [
            {
              card: c.welcomeToNightCityRetailEmergencyAtlus,
              spent: true,
              hasLag: false,
            },
            {
              card: c.welcomeToNightCityRetailSecondhandBombus,
              spent: true,
              hasLag: false,
            },
            {
              card: c.welcomeToNightCityRetailCorpoSecurity,
              spent: false,
              hasLag: false,
            },
            {
              card: c.welcomeToNightCityRetailTBugAmateurPhilosopher,
              spent: false,
              hasLag: false,
            },
          ],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 5,
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d12", faceValue: 10 },
          ],
        },
        { seed: scenarioSeed("retailWtnc22CombatStealQa"), autoGainGig: false },
      ),
  },
  {
    id: "retailWtnc22CostGearQa",
    group: "release-qa",
    label: "WTNC 22 · Costs / Gear / Heywood",
    description:
      "Viktor is ready (first Cyberware −3). Trash has 3 Units so Trauma Team is 3 €$ not 6. Two face-up Legends so Zetatech Berserk is 4 €$ not 6. P2 has 3 Gigs vs P1's 1, so Adrenaline Converter grants Adrenaline. Deadman Transmitter is on Swordwise; T-Bug has none. Positive: play Adrenaline first (1 €$), Trauma Team at 3, Zetatech at 4, Heywood optional-defeat the 2-cost Deadman against the d8=2 for a draw, then fight Swordwise so Deadman dies instead. Negative: play Kiroshi as the second Cyberware (no Viktor discount); decline Heywood's defeat; fight T-Bug so the host actually dies; steal Gigs until Adrenaline turns off.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [
            c.welcomeToNightCityRetailHeywoodRipperdoc,
            c.welcomeToNightCityRetailTraumaTeamOperatives,
            c.welcomeToNightCityRetailZetatechBerserk,
            c.welcomeToNightCityRetailAdrenalineConverter,
            c.welcomeToNightCityRetailKiroshiOptics,
          ],
          deck: 14,
          field: [
            {
              card: c.welcomeToNightCityRetailViktorVektorDropYourIllusions,
              spent: false,
              hasLag: false,
            },
            {
              card: c.welcomeToNightCityRetailSwordwiseHuscle,
              spent: false,
              hasLag: false,
              attachedGears: [c.welcomeToNightCityRetailDeadmanTransmitter],
            },
            {
              card: c.welcomeToNightCityRetailTBugAmateurPhilosopher,
              spent: false,
              hasLag: false,
            },
          ],
          trash: [
            c.welcomeToNightCityRetailMoxInciters,
            c.welcomeToNightCityRetailEmergencyAtlus,
            c.welcomeToNightCityRetailRidingNomad,
          ],
          legendArea: [
            {
              card: c.welcomeToNightCityRetailJohnnySilverhandRockingRenegade,
              faceDown: false,
              spent: false,
            },
            {
              card: c.welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
              faceDown: false,
              spent: false,
            },
            { card: c.welcomeToNightCityRetailVStreetkid, faceDown: true },
          ],
          eddies: 16,
          gigArea: [{ dieType: "d8", faceValue: 2 }],
        },
        {
          hand: [c.welcomeToNightCityRetailRebootOptics],
          field: [
            {
              card: c.welcomeToNightCityRetailDelamainCab,
              spent: true,
              hasLag: false,
            },
            {
              card: c.welcomeToNightCityRetailJackieWellesRideOrDieChoom,
              spent: false,
              hasLag: false,
            },
          ],
          legendArea: [c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe],
          eddies: 4,
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 3 },
            { dieType: "d10", faceValue: 5 },
          ],
        },
        { seed: scenarioSeed("retailWtnc22CostGearQa"), autoGainGig: false },
      ),
  },
  {
    id: "retailWtnc22TurnTriggerQa",
    group: "release-qa",
    label: "WTNC 22 · Turn triggers / Radioport / Wakako",
    description:
      "Panam is ready (free Call on your turn; Attack discard-then-draw). Modded Muramasa is spent and P1 has less Street Cred, so it should ready at end of turn. Hand: MaxTac AV, Shattered Memories, Arasaka Emergency Radioport, Tetratronic Rippler. Goro (Arasaka) and River Ward are face-down; Wakako is face-up. Discarded-hand total starts at 6 to match the d6=6 bonus draw. Positive: Radioport on a Unit, spend it, Call Goro for free; Tetratronic trash on spend; MaxTac swap; Shattered Memories extra draw; Wakako −2 or Spend decrease; pass turn to ready Muramasa. Negative: Radioport peek on River Ward (not Arasaka / GO SOLO) and decline; pass on MaxTac swap; empty a hand before Shattered so the count no longer matches 6; end the turn after stealing enough Gigs that Muramasa no longer has less Street Cred.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [
            c.welcomeToNightCityRetailMaxtacAv,
            c.welcomeToNightCityRetailShatteredMemories,
            c.welcomeToNightCityRetailArasakaEmergencyRadioport,
            c.welcomeToNightCityRetailTetratronicRippler,
          ],
          deck: [
            c.welcomeToNightCityRetailFloorIt,
            c.welcomeToNightCityRetailFoolOnTheHill,
            c.welcomeToNightCityRetailPeaceOffering,
            c.welcomeToNightCityRetailMoxInciters,
            c.welcomeToNightCityRetailSketchyRipper,
            c.welcomeToNightCityRetailOffdutyMalfini,
            c.welcomeToNightCityRetailNadiaFightingThroughGrief,
            c.welcomeToNightCityRetailSaulBrightStormrider,
          ],
          field: [
            {
              card: c.welcomeToNightCityRetailPanamPalmerStrengthThroughFamily,
              spent: false,
              hasLag: false,
            },
            {
              card: c.welcomeToNightCityRetailModdedMuramasa,
              spent: true,
              hasLag: false,
            },
          ],
          legendArea: [
            {
              card: c.welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
              faceDown: true,
            },
            { card: c.welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, faceDown: true },
            {
              card: c.welcomeToNightCityRetailWakakoOkadaPeaceAndHarmony,
              faceDown: false,
              spent: false,
            },
          ],
          eddies: 16,
          gigArea: [{ dieType: "d6", faceValue: 6 }],
        },
        {
          hand: [c.welcomeToNightCityRetailTrustNoOne, c.welcomeToNightCityRetailSafetyOverride],
          field: [
            {
              card: c.welcomeToNightCityRetailCorpoSecurity,
              spent: false,
              hasLag: false,
            },
            {
              card: c.welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
              spent: true,
              hasLag: false,
            },
          ],
          legendArea: [c.theHeistRetailStarterDeckViktorVektorSitDownAndRelax],
          eddies: 4,
          gigArea: [
            { dieType: "d10", faceValue: 9 },
            { dieType: "d8", faceValue: 8 },
          ],
        },
        {
          seed: scenarioSeed("retailWtnc22TurnTriggerQa"),
          autoGainGig: false,
          preserveDeckOrder: true,
        },
      ),
  },
];
