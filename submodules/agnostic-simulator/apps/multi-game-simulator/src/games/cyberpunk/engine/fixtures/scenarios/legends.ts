import type { Scenario } from "./types";
import {
  c,
  CyberpunkTestEngine,
  P1,
  P2,
  scenarioSeed,
  setPlayerDeckToDefinitions,
  skipGainGig,
} from "./shared";

export const legendScenarios: Scenario[] = [
  // ── Legend: GO SOLO (V - Corporate Exile) ────────────────────────────────
  {
    id: "legendVCorporateExile",
    group: "legend-go-solo",
    label: "V · Corporate Exile · revealed, can Go Solo",
    description:
      "P1 has V - Corporate Exile (blue, cost 5, power 8, GO SOLO) revealed face-up in legend area with 6 eddies. Tests the Go Solo action to play V as a ready unit with 8 power that can attack this turn.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaRuthlessLowlife],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [
            { card: c.alphaVCorporateExile, faceDown: false },
            { card: c.alphaYorinobuArasakaEmbracingDestruction, faceDown: false },
            { card: c.alphaGoroTakemuraHandsUnclean, faceDown: false },
          ],
          eddies: 6,
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
        { seed: scenarioSeed("legendVCorporateExile"), autoGainGig: false },
      ),
  },

  // ── Legend: GO SOLO + BLOCKER (Goro Takemura - Hands Unclean) ───────────
  {
    id: "legendGoroTakemuraHandsUnclean",
    group: "legend-go-solo",
    label: "Goro Takemura · Hands Unclean · GO SOLO + BLOCKER",
    description:
      "P1 has Goro Takemura (green, cost 5, power 7, GO SOLO + BLOCKER) revealed. With 6 eddies, can Go Solo as a 7-power unit with BLOCKER. Rival is attacking — tests both Go Solo and subsequent BLOCKER capability.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [
            { card: c.alphaGoroTakemuraHandsUnclean, faceDown: false },
            { card: c.alphaVCorporateExile, faceDown: false },
            { card: c.alphaYorinobuArasakaEmbracingDestruction, faceDown: false },
          ],
          eddies: 6,
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
        { seed: scenarioSeed("legendGoroTakemuraHandsUnclean"), autoGainGig: false },
      ),
  },

  // ── Legend: GO SOLO + DEFEATED trigger (V - Streetkid) ──────────────────
  {
    id: "legendVStreetkid",
    group: "legend-defeated",
    label: "V · Streetkid · GO SOLO with defeated trigger",
    description:
      "P1 has V - Streetkid (red, cost 4, power 3, GO SOLO) revealed. Trash has a Braindance program (Afterparty at Lizzie's). Tests Go Solo play and the defeated trigger: mill 3, then recover a Braindance program from trash.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [
            { card: c.spoilerVStreetkid, faceDown: false },
            { card: c.alphaVCorporateExile, faceDown: false },
          ],
          trash: [c.spoilerAfterpartyAtLizzieS, c.alphaCorporateSurveillance],
          eddies: 5,
          deck: 8,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.alphaSwordwiseHuscle, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("legendVStreetkid"), autoGainGig: false },
      ),
  },

  // ── Legend: GO SOLO + gear-scaling power (Royce - Psycho on the Edge) ───
  {
    id: "legendRoycePsychoOnTheEdge",
    group: "legend-go-solo",
    label: "Royce · Psycho on the Edge · gear-scaled power",
    description:
      "P1 has Royce (red, cost 6, power 6, GO SOLO) revealed. Royce has +2 power per equipped gear. Tests static power boost during friendly turn. With 8 eddies, can Go Solo as a unit.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [
            {
              card: c.spoilerRoycePsychoOnTheEdge,
              faceDown: false,
              attachedGears: [c.alphaMantisBlades, c.alphaKiroshiOptics],
            },
            { card: c.alphaVCorporateExile, faceDown: false },
          ],
          eddies: 8,
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
        { seed: scenarioSeed("legendRoycePsychoOnTheEdge"), autoGainGig: false },
      ),
  },

  // ── Legend: GO SOLO + gig steal removal (Alt Cunningham) ─────────────────
  {
    id: "legendAltCunninghamSoulkillerArchitect",
    group: "legend-go-solo",
    label: "Alt Cunningham · gig steal → remove + replay program",
    description:
      "P1 has Alt Cunningham (blue, cost 6, power 4, GO SOLO) on the field. Trash has Corporate Surveillance. When Alt steals a Gig, she may be removed from game to replay that program from trash for free against the rival Corpo Security.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [
            {
              card: c.spoilerAltCunninghamSoulkillerArchitect,
              spent: false,
              faceDown: false,
              attachedGears: [],
            },
          ],
          legendArea: [
            { card: c.spoilerAltCunninghamSoulkillerArchitect, faceDown: false },
            { card: c.alphaVCorporateExile, faceDown: false },
          ],
          trash: [c.alphaCorporateSurveillance],
          eddies: 8,
          gigArea: [
            { dieType: "d4", faceValue: 2 },
            { dieType: "d8", faceValue: 4 },
          ],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: false }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 2 }],
        },
        { seed: scenarioSeed("legendAltCunninghamSoulkillerArchitect"), autoGainGig: false },
      ),
  },

  // ── Legend: Passive +1 power to Arasaka attackers (Saburo Arasaka) ──────
  {
    id: "legendSaburoArasakaStubbornPatriach",
    group: "legend-passive",
    label: "Saburo Arasaka · Arasaka units gain +1 power attacking",
    description:
      "P1 has Saburo Arasaka (green) revealed. P1 field has Armored Minotaur (Arasaka, base power 9) and Ruthless Lowlife. Tests passive +1 power while an Arasaka unit attacks.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaRuthlessLowlife],
          field: [
            { card: c.alphaArmoredMinotaur, spent: false },
            { card: c.alphaRuthlessLowlife, spent: false },
          ],
          legendArea: [
            { card: c.alphaSaburoArasakaStubbornPatriach, faceDown: false },
            { card: c.alphaVCorporateExile, faceDown: false },
          ],
          eddies: 4,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [
            { card: c.alphaCorpoSecurity, spent: true },
            { card: c.alphaSecondhandBombus, spent: true },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("legendSaburoArasakaStubbornPatriach"), autoGainGig: false },
      ),
  },

  // ── Legend: Attack trigger draw + conditional discard (Yorinobu Arasaka) ─
  {
    id: "legendYorinobuArasakaEmbracingDestruction",
    group: "legend-attack-trigger",
    label: "Yorinobu · first Arasaka attack draws, then conditional discard",
    description:
      "P1 has Yorinobu (red) revealed. P1 has Armored Minotaur (Arasaka) ready. Street Cred is 4 (below 20). First Arasaka attack each turn draws 1 card, then discards 1 if Street Cred < 20.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaRuthlessLowlife, c.alphaFloorIt],
          field: [
            { card: c.alphaArmoredMinotaur, spent: false },
            { card: c.alphaRuthlessLowlife, spent: false },
          ],
          legendArea: [
            { card: c.alphaYorinobuArasakaEmbracingDestruction, faceDown: false },
            { card: c.alphaSaburoArasakaStubbornPatriach, faceDown: false },
          ],
          eddies: 4,
          gigArea: [{ dieType: "d4", faceValue: 4 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("legendYorinobuArasakaEmbracingDestruction"), autoGainGig: false },
      ),
  },

  // ── Legend: Blue card played → gig increase (Jackie Welles) ─────────────
  {
    id: "legendJackieWellesPourOneOutForMe",
    group: "legend-attack-trigger",
    label: "Jackie Welles · blue card triggers gig increase",
    description:
      "P1 has Jackie Welles (blue) revealed. P1 holds Dying Night - V's Pistol (blue gear) and has a gig at face value 2 (d4 max=4). First blue unit or gear played each turn: may increase a friendly gig by 2. If it hits max value, draw a card.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaFloorIt, c.alphaDyingNightVSPistol],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [
            { card: c.alphaJackieWellesPourOneOutForMe, faceDown: false },
            { card: c.alphaVCorporateExile, faceDown: false },
          ],
          eddies: 4,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaSaburoArasakaStubbornPatriach],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("legendJackieWellesPourOneOutForMe"), autoGainGig: false },
      ),
  },

  // ── Legend: FLIP search deck for gear (Viktor Vektor) ────────────────────
  {
    id: "legendViktorVektorSitDownAndRelax",
    group: "legend-call-trigger",
    label: "Viktor Vektor · FLIP searches deck for low-cost gear",
    description:
      "P1 can call Viktor Vektor (yellow). On FLIP (call), searches top 5 cards for up to 2 gear with cost ≤ 2. The top deck contains Kiroshi Optics and Mantis Blades as valid low-cost Gear hits.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaRuthlessLowlife],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [
            { card: c.alphaViktorVektorSitDownAndRelax, faceDown: true },
            { card: c.alphaVCorporateExile, faceDown: false },
          ],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("legendViktorVektorSitDownAndRelax"), autoGainGig: false },
      );
      setPlayerDeckToDefinitions(engine, P1, [
        c.alphaKiroshiOptics,
        c.alphaMantisBlades,
        c.alphaSandevistan,
        c.alphaFloorIt,
        c.alphaDyingNightVSPistol,
      ]);
      return engine;
    },
  },
  {
    id: "legendViktorOpponentPrivateSearch",
    group: "legend-call-trigger",
    label: "Viktor Vektor · opponent private deck search",
    description:
      "P2 has called Viktor Vektor and is choosing from the top 5 cards of their deck. P1 should only see that the opponent is choosing, not the revealed search candidates.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaRuthlessLowlife],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [c.alphaVCorporateExile],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          hand: [c.alphaCorpoSecurity],
          field: [{ card: c.alphaArmoredMinotaur, spent: false }],
          legendArea: [
            { card: c.alphaViktorVektorSitDownAndRelax, faceDown: true },
            { card: c.alphaJackieWellesPourOneOutForMe, faceDown: false },
          ],
          eddies: 3,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        {
          seed: scenarioSeed("legendViktorOpponentPrivateSearch"),
          activePlayerId: P2,
          autoGainGig: false,
        },
      );
      setPlayerDeckToDefinitions(engine, P2, [
        c.alphaKiroshiOptics,
        c.alphaMantisBlades,
        c.alphaSandevistan,
        c.alphaFloorIt,
        c.alphaDyingNightVSPistol,
      ]);
      engine.callLegend(c.alphaViktorVektorSitDownAndRelax, { as: P2 });
      return engine;
    },
  },

  // ── Legend: CALL decrease rival gig + spend search (Evelyn Parker) ───────
  {
    id: "legendEvelynParkerBeautifulEnigma",
    group: "legend-call-trigger",
    label: "Evelyn Parker · CALL decreases rival gig, spend searches",
    description:
      "P1 has Evelyn Parker (blue) revealed. CALL: decrease a rival gig by 3. Spend-activated: search top 3 for a Braindance program. The top deck contains Afterparty at Lizzie's as a valid Braindance hit.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaRuthlessLowlife],
          field: [{ card: c.alphaSwordwiseHuscle, spent: false }],
          legendArea: [
            { card: c.spoilerEvelynParkerBeautifulEnigma, faceDown: false },
            { card: c.alphaVCorporateExile, faceDown: false },
          ],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 5 }],
        },
        { seed: scenarioSeed("legendEvelynParkerBeautifulEnigma"), autoGainGig: false },
      );
      setPlayerDeckToDefinitions(engine, P1, [
        c.spoilerAfterpartyAtLizzieS,
        c.alphaFloorIt,
        c.alphaDyingNightVSPistol,
      ]);
      return engine;
    },
  },

  // ── Legend: CALL draw + spend to free-equip gear (River Ward) ────────────
  {
    id: "legendRiverWardDetectiveOnTheHunt",
    group: "legend-call-trigger",
    label: "River Ward · CALL draws, spend equips gear for free",
    description:
      "P1 has River Ward (yellow) revealed. CALL: draw 1. When a unit attacks, may spend River to equip a gear (cost ≤ 2) from hand to a yellow unit with no gear. P1 has T-Bug (yellow) and holds Kiroshi Optics (cost 1).",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaKiroshiOptics, c.alphaMantisBlades],
          field: [
            { card: c.alphaTBugAmateurPhilosopher, spent: false },
            { card: c.alphaSecondhandBombus, spent: false },
          ],
          legendArea: [
            { card: c.spoilerRiverWardDetectiveOnTheHunt, faceDown: false },
            { card: c.alphaVCorporateExile, faceDown: false },
          ],
          eddies: 4,
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
        { seed: scenarioSeed("legendRiverWardDetectiveOnTheHunt"), autoGainGig: false },
      ),
  },

  // ── Legend: CALL defeat gear for draw (Dum Dum) ─────────────────────────
  {
    id: "legendDumDumMaelstromTriggerman",
    group: "legend-call-trigger",
    label: "Dum Dum · CALL defeat gear → draw 4, else draw 1",
    description:
      "P1 can call Dum Dum (yellow). P1 has T-Bug equipped with Kiroshi Optics and Mantis Blades. CALL: may defeat a friendly Gear to draw 4, or draw 1. Tests the ifYouDo branching.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.alphaRuthlessLowlife],
          field: [
            {
              card: c.alphaTBugAmateurPhilosopher,
              spent: false,
              attachedGears: [c.alphaKiroshiOptics, c.alphaMantisBlades],
            },
          ],
          legendArea: [
            { card: c.spoilerDumDumMaelstromTriggerman, faceDown: true },
            { card: c.alphaVCorporateExile, faceDown: false },
          ],
          eddies: 3,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          field: [{ card: c.alphaCorpoSecurity, spent: true }],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { seed: scenarioSeed("legendDumDumMaelstromTriggerman"), autoGainGig: false },
      ),
  },

  // ── Legend: CALL ready + spend to transfer gear & ready (Panam Palmer) ───
  {
    id: "legendPanamPalmerNomadCavalry",
    group: "legend-call-trigger",
    label: "Panam Palmer · CALL ready, spend transfers gear + readies unit",
    description:
      "P1 has Panam Palmer (green) revealed with Mantis Blades attached. Field has Swordwise Huscle ready to attack. CALL: ready Panam. When a friendly unit attacks, spend Panam to move her gear to the attacker and ready it.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [
            { card: c.alphaSwordwiseHuscle, spent: false },
            { card: c.alphaSecondhandBombus, spent: false },
          ],
          legendArea: [
            {
              card: c.spoilerPanamPalmerNomadCavalry,
              faceDown: false,
              attachedGears: [c.alphaMantisBlades],
            },
            { card: c.alphaVCorporateExile, faceDown: false },
          ],
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
        { seed: scenarioSeed("legendPanamPalmerNomadCavalry"), autoGainGig: false },
      ),
  },

  // ── Legend: CALL ready + spend grants BLOCKER (Goro Takemura - Vengeful) ─
  {
    id: "legendGoroTakemuraVengefulBodyguard",
    group: "legend-call-trigger",
    label: "Goro Takemura · Vengeful Bodyguard · grants BLOCKER",
    description:
      "P1 has Goro Takemura - Vengeful Bodyguard (green) revealed. CALL: ready this Legend. When a rival unit attacks, spend to give a friendly unit (cost ≤ 4) +1 power and BLOCKER if you have a sided-pair of Gigs. P1 has d6=3 and d8=3. Rival is attacking with Armored Minotaur.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [
            { card: c.alphaSwordwiseHuscle, spent: false },
            { card: c.alphaCorpoSecurity, spent: false },
          ],
          legendArea: [
            { card: c.spoilerGoroTakemuraVengefulBodyguard, faceDown: false },
            { card: c.alphaVCorporateExile, faceDown: false },
          ],
          eddies: 3,
          gigArea: [
            { dieType: "d6", faceValue: 3 },
            { dieType: "d8", faceValue: 3 },
          ],
        },
        {
          field: [
            { card: c.alphaArmoredMinotaur, spent: false },
            { card: c.alphaJackieWellesRideOrDieChoom, spent: true },
          ],
          legendArea: [c.alphaJackieWellesPourOneOutForMe],
          eddies: 5,
          gigArea: [{ dieType: "d8", faceValue: 3 }],
        },
        { seed: scenarioSeed("legendGoroTakemuraVengefulBodyguard"), autoGainGig: false },
      );
      if (engine.getState().G.turnMetadata.activePlayerId === P1) {
        engine.completeTurn({ as: P1 });
        skipGainGig(engine);
      }
      engine.attackRival(c.alphaArmoredMinotaur, { as: P2 });
      return engine;
    },
  },
];
