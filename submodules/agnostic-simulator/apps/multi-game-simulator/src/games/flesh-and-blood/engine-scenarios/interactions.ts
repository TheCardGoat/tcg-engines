import type {
  FabCardDefinitionInput,
  FabPracticeMatch,
} from "@tcg/flesh-and-blood-engine/simulator";
import { FabTestEngine, fabToken } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { viserai as viseraiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai";
import { riftSkitterRed } from "@tcg/flesh-and-blood-cards/cards/actions/rift-skitter";
import { vantomBansheeRed } from "@tcg/flesh-and-blood-cards/cards/actions/vantom-banshee";
import { vantomWraithRed } from "@tcg/flesh-and-blood-cards/cards/actions/vantom-wraith";
import {
  CATALOG_TEST_DEFINITIONS,
  catalogIds,
  alphaInstinctBlue,
  alphaRampageRed,
  azaleaAceInTheHole,
  becomeTheBottleRed,
  crouchingTiger,
  surgingStrikeRed,
  dash,
  gustwaveOfTheSecondWindRed,
  iraCrimsonHaze,
  katsu,
  mightyWindupRed,
  hulkUpBlue,
  ripOffTheTopYellow,
  retraceThePastBlue,
  skullboneCrosswrap,
  talismanicLens,
  optekalMonocleBlue,
  songOfSinewYellow,
  rok,
  brutalAssaultBlue,
  tuffnut,
  tigrineReflexRed,
  boltyn,
  boltOfCourageRed,
  nimblismBlue,
  spireSnipingRed,
  snatchRed,
  spearsOfSurrealityRed,
  sutcliffeSResearchNotesRed,
  whisperOfTheOracleRed,
  windUpTheCrowdBlue,
  wreckerRompBlue,
  zeroToSixtyRed,
  RAVENOUS_RABBLE_RED_ID,
  COSMIC_DUALITY_BLUE_ID,
  ZYGGY_STARLIGHT_ID,
  AGILE_WINDUP_RED_ID,
  MIGHTY_WINDUP_RED_ID,
  VIGOROUS_WINDUP_RED_ID,
  STARTING_STAKE_YELLOW_ID,
  PILFER_THE_TOMB_BLUE_ID,
  SIGIL_OF_SOLACE_RED_ID,
  CRACKED_BAUBLE_YELLOW_ID,
  SONG_OF_SINEW_YELLOW_ID,
  realCardDefinition,
  toFabCardDefinition,
} from "./cards";
import { matchFromEngine, createEngine, rhinarBravoBase } from "./runtime";
import type { FabScenarioCollection } from "./types";

function integrationSnatchDefinition(): FabCardDefinitionInput {
  const base = CATALOG_TEST_DEFINITIONS[catalogIds.snatch];
  if (!base) throw new Error("Missing catalog Snatch in CATALOG_TEST_DEFINITIONS");
  const catalogDefinition = toFabCardDefinition(base);
  return {
    ...catalogDefinition,
    name: "Snatch",
    base: {
      ...catalogDefinition.base,
      abilities: [
        {
          id: "practice-snatch-hit-draw",
          kind: "static",
          staticKind: "triggered",
          text: "When this hits, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: { kind: "player", player: "ability-controller" },
              observes: { kind: "source", selector: "attack" },
            },
          },
          resolution: {
            kind: "effect",
            effect: { type: "draw", count: 1, player: "controller" },
          },
        },
      ],
    },
  };
}

function bootMultiplePlayableBanishedCards(): FabPracticeMatch {
  const runechant = fabToken("runechant");
  const engine = FabTestEngine.start(
    {
      hero: viseraiRules,
      hand: [],
      banished: [riftSkitterRed, vantomBansheeRed, vantomWraithRed],
      arena: [runechant, runechant, runechant],
      resourcePoints: 0,
      actionPoints: 1,
      deck: 6,
    },
    { hero: dashRules, hand: [], life: 20, deck: 6 },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
  return matchFromEngine(engine, "fab-scenario-multiple-playable-banished-cards");
}

function bootPitchStackFourCards(): FabPracticeMatch {
  const engine = createEngine(
    rhinarBravoBase("fab-scenario-pitch-stack-four-cards", {
      player1: {
        hand: [],
        pitch: [
          catalogIds.disable,
          catalogIds.snatch,
          catalogIds.nimblismBlue,
          catalogIds.sinkBelow,
        ],
        deck: 12,
      },
      player2: { hand: [], deck: 12 },
    }),
  );
  engine.as(catalogIds.rhinar).endTurn();
  const wait = engine.getRuntime().waitState();
  if (wait.kind !== "decision" || wait.decision.kind !== "ordering") {
    throw new Error("Pitch-stack fixture did not reach its ordering decision.");
  }
  return matchFromEngine(engine, "fab-scenario-pitch-stack-four-cards");
}

function bootSongOfSinewReorder(): FabPracticeMatch {
  const cardIds = [
    SONG_OF_SINEW_YELLOW_ID,
    alphaRampageRed.canonicalId,
    mightyWindupRed.canonicalId,
    spearsOfSurrealityRed.canonicalId,
    zeroToSixtyRed.canonicalId,
  ] as const;
  const engine = createEngine({
    seed: "fab-scenario-song-of-sinew-reorder",
    cardDefinitions: Object.fromEntries(
      cardIds.map((canonicalId) => [canonicalId, realCardDefinition(canonicalId)]),
    ),
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      hand: [SONG_OF_SINEW_YELLOW_ID],
      deck: [
        catalogIds.snatch,
        catalogIds.snatch,
        spearsOfSurrealityRed.canonicalId,
        mightyWindupRed.canonicalId,
        alphaRampageRed.canonicalId,
        zeroToSixtyRed.canonicalId,
      ],
      resourcePoints: 0,
      actionPoints: 1,
    },
    player2: { heroCardId: catalogIds.bravo, life: 20, hand: [], deck: 6 },
  });
  return matchFromEngine(engine, "fab-scenario-song-of-sinew-reorder");
}

function bootTuffnutSongRipRok(): FabPracticeMatch {
  const cardIds = [
    tuffnut.canonicalId,
    rok.canonicalId,
    songOfSinewYellow.canonicalId,
    ripOffTheTopYellow.canonicalId,
    brutalAssaultBlue.canonicalId,
    alphaInstinctBlue.canonicalId,
    windUpTheCrowdBlue.canonicalId,
    hulkUpBlue.canonicalId,
    wreckerRompBlue.canonicalId,
  ] as const;
  const engine = createEngine({
    seed: "fab-scenario-tuffnut-song-rip-rok",
    cardDefinitions: Object.fromEntries(
      cardIds.map((canonicalId) => [canonicalId, realCardDefinition(canonicalId)]),
    ),
    player1: {
      heroCardId: tuffnut.canonicalId,
      life: 20,
      weapon1: [rok.canonicalId],
      hand: [
        songOfSinewYellow.canonicalId,
        ripOffTheTopYellow.canonicalId,
        wreckerRompBlue.canonicalId,
        brutalAssaultBlue.canonicalId,
      ],
      // Song reveals all four. After reordering, Rip draws and random-pitches a
      // 6{p} card. Keep Brutal Assault for the attack-action route, or pitch both blue
      // hand cards to pay for Rip so Rok's empty-hand restriction is met.
      deck: [
        alphaInstinctBlue.canonicalId,
        windUpTheCrowdBlue.canonicalId,
        hulkUpBlue.canonicalId,
        wreckerRompBlue.canonicalId,
      ],
      resourcePoints: 0,
      actionPoints: 1,
    },
    player2: { heroCardId: catalogIds.bravo, life: 20, hand: [], deck: 6 },
  });
  return matchFromEngine(engine, "fab-scenario-tuffnut-song-rip-rok");
}

function bootBoltynHeroSignal(): FabPracticeMatch {
  const cardIds = [
    boltyn.canonicalId,
    boltOfCourageRed.canonicalId,
    nimblismBlue.canonicalId,
    dash.canonicalId,
  ] as const;
  const engine = createEngine({
    seed: "fab-scenario-boltyn-hero-signal",
    cardDefinitions: Object.fromEntries(
      cardIds.map((canonicalId) => [canonicalId, realCardDefinition(canonicalId)]),
    ),
    player1: {
      heroCardId: boltyn.canonicalId,
      life: 20,
      hand: [boltOfCourageRed.canonicalId, nimblismBlue.canonicalId],
      deck: 8,
      actionPoints: 1,
    },
    player2: {
      heroCardId: dash.canonicalId,
      life: 20,
      hand: [catalogIds.nimblismBlue],
      deck: 8,
    },
  });
  engine.as(boltyn.canonicalId).attackWith(boltOfCourageRed.canonicalId, {
    charge: true,
    chargeCard: nimblismBlue.canonicalId,
  });
  return matchFromEngine(engine, "fab-scenario-boltyn-hero-signal");
}

function bootSutcliffeResearchNotesReorder(): FabPracticeMatch {
  const cardIds = [
    sutcliffeSResearchNotesRed.canonicalId,
    mightyWindupRed.canonicalId,
    alphaRampageRed.canonicalId,
    zeroToSixtyRed.canonicalId,
  ] as const;
  const engine = createEngine({
    seed: "fab-scenario-sutcliffe-research-notes-reorder",
    cardDefinitions: Object.fromEntries(
      cardIds.map((canonicalId) => [canonicalId, realCardDefinition(canonicalId)]),
    ),
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      hand: [sutcliffeSResearchNotesRed.canonicalId],
      deck: [
        catalogIds.snatch,
        catalogIds.snatch,
        mightyWindupRed.canonicalId,
        alphaRampageRed.canonicalId,
        zeroToSixtyRed.canonicalId,
      ],
      resourcePoints: 1,
      actionPoints: 1,
    },
    player2: { heroCardId: catalogIds.bravo, life: 20, hand: [], deck: 6 },
  });
  return matchFromEngine(engine, "fab-scenario-sutcliffe-research-notes-reorder");
}

function bootSpireSnipingReorder(): FabPracticeMatch {
  const cardIds = [
    spireSnipingRed.canonicalId,
    azaleaAceInTheHole.canonicalId,
    skullboneCrosswrap.canonicalId,
    mightyWindupRed.canonicalId,
    zeroToSixtyRed.canonicalId,
  ] as const;
  const engine = createEngine({
    seed: "fab-scenario-spire-sniping-reorder",
    cardDefinitions: Object.fromEntries(
      cardIds.map((canonicalId) => [canonicalId, realCardDefinition(canonicalId)]),
    ),
    player1: {
      heroCardId: azaleaAceInTheHole.canonicalId,
      head: [skullboneCrosswrap.canonicalId],
      life: 20,
      hand: [],
      arsenal: [spireSnipingRed.canonicalId],
      deck: [
        catalogIds.snatch,
        catalogIds.snatch,
        mightyWindupRed.canonicalId,
        zeroToSixtyRed.canonicalId,
      ],
      resourcePoints: 0,
      actionPoints: 1,
    },
    player2: { heroCardId: catalogIds.bravo, life: 20, hand: [], deck: 6 },
  });
  return matchFromEngine(engine, "fab-scenario-spire-sniping-reorder");
}

function bootOptAbilityLab(): FabPracticeMatch {
  const cardIds = [
    dash.canonicalId,
    whisperOfTheOracleRed.canonicalId,
    optekalMonocleBlue.canonicalId,
    talismanicLens.canonicalId,
    mightyWindupRed.canonicalId,
    alphaRampageRed.canonicalId,
    zeroToSixtyRed.canonicalId,
  ] as const;
  const engine = createEngine({
    seed: "fab-scenario-opt-ability-lab",
    cardDefinitions: Object.fromEntries(
      cardIds.map((canonicalId) => [canonicalId, realCardDefinition(canonicalId)]),
    ),
    player1: {
      heroCardId: dash.canonicalId,
      head: [talismanicLens.canonicalId],
      life: 20,
      hand: [
        whisperOfTheOracleRed.canonicalId,
        optekalMonocleBlue.canonicalId,
        mightyWindupRed.canonicalId,
        alphaRampageRed.canonicalId,
      ],
      deck: [
        catalogIds.snatch,
        catalogIds.snatch,
        mightyWindupRed.canonicalId,
        alphaRampageRed.canonicalId,
        zeroToSixtyRed.canonicalId,
      ],
      resourcePoints: 0,
      // Two AP keeps both action-card Opt sources independently explorable;
      // Talismanic Lens remains available at any priority window as an instant.
      actionPoints: 2,
    },
    player2: { heroCardId: catalogIds.bravo, life: 20, hand: [], deck: 6 },
  });
  return matchFromEngine(engine, "fab-scenario-opt-ability-lab");
}

function bootDeckSearch(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-deck-search",
    player1: {
      heroCardId: catalogIds.rhinar,
      hand: [catalogIds.sandSketched],
      deck: [
        catalogIds.alphaRampage,
        catalogIds.alphaRampage,
        catalogIds.snatch,
        catalogIds.snatch,
        catalogIds.nimblismBlue,
      ],
      actionPoints: 1,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      hand: [],
      deck: 6,
    },
  });
  return matchFromEngine(engine, "fab-scenario-deck-search");
}

function bootPermanentTokenGeneration(): FabPracticeMatch {
  const cardIds = [
    AGILE_WINDUP_RED_ID,
    AGILE_WINDUP_RED_ID,
    AGILE_WINDUP_RED_ID,
    MIGHTY_WINDUP_RED_ID,
    MIGHTY_WINDUP_RED_ID,
    VIGOROUS_WINDUP_RED_ID,
    VIGOROUS_WINDUP_RED_ID,
    STARTING_STAKE_YELLOW_ID,
  ] as const;
  const engine = createEngine({
    seed: "fab-scenario-permanent-token-generation",
    cardDefinitions: Object.fromEntries(
      cardIds.map((canonicalId) => [canonicalId, realCardDefinition(canonicalId)]),
    ),
    player1: {
      heroCardId: catalogIds.bravo,
      life: 20,
      hand: [...cardIds],
      deck: 8,
      actionPoints: 1,
    },
    player2: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      hand: [],
      deck: 8,
    },
  });
  return matchFromEngine(engine, "fab-scenario-permanent-token-generation");
}

function bootDualTargetOpen(): FabPracticeMatch {
  const snatch = integrationSnatchDefinition();
  const ravenousRabble = realCardDefinition(RAVENOUS_RABBLE_RED_ID);
  const engine = createEngine({
    seed: "fab-scenario-dual-target-open",
    cardDefinitions: {
      [snatch.canonicalId]: snatch,
      [RAVENOUS_RABBLE_RED_ID]: ravenousRabble,
    },
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      weapon1: [catalogIds.rompingClub],
      hand: [
        snatch.canonicalId,
        RAVENOUS_RABBLE_RED_ID,
        RAVENOUS_RABBLE_RED_ID,
        RAVENOUS_RABBLE_RED_ID,
      ],
      deck: 8,
      actionPoints: 1,
      resourcePoints: 0,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      weapon1: [catalogIds.anothos],
      hand: [],
      deck: 8,
    },
  });
  return matchFromEngine(engine, "fab-scenario-dual-target-open");
}

function bootHandPlayOrActivate(): FabPracticeMatch {
  const cosmicDuality = realCardDefinition(COSMIC_DUALITY_BLUE_ID);
  const zyggy = realCardDefinition(ZYGGY_STARLIGHT_ID);
  const engine = createEngine({
    seed: "fab-scenario-hand-play-or-activate",
    cardDefinitions: {
      [cosmicDuality.canonicalId]: cosmicDuality,
      [zyggy.canonicalId]: zyggy,
    },
    player1: {
      heroCardId: zyggy.canonicalId,
      life: 20,
      hand: [cosmicDuality.canonicalId],
      deck: 8,
      actionPoints: 1,
      resourcePoints: 2,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      hand: [],
      deck: 8,
    },
  });
  return matchFromEngine(engine, "fab-scenario-hand-play-or-activate");
}

function bootNinjaBecomeTheBottleName(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-ninja-become-the-bottle-name",
    cardDefinitions: {
      [katsu.canonicalId]: realCardDefinition(katsu.canonicalId),
      [crouchingTiger.canonicalId]: realCardDefinition(crouchingTiger.canonicalId),
      [becomeTheBottleRed.canonicalId]: realCardDefinition(becomeTheBottleRed.canonicalId),
      [dash.canonicalId]: realCardDefinition(dash.canonicalId),
    },
    player1: {
      heroCardId: katsu.canonicalId,
      life: 20,
      hand: [crouchingTiger.canonicalId, becomeTheBottleRed.canonicalId],
      deck: 8,
      actionPoints: 1,
    },
    player2: {
      heroCardId: dash.canonicalId,
      life: 20,
      hand: [],
      deck: 8,
    },
  });
  return matchFromEngine(engine, "fab-scenario-ninja-become-the-bottle-name");
}

function bootNinjaRetraceThePastName(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-ninja-retrace-the-past-name",
    cardDefinitions: {
      [katsu.canonicalId]: realCardDefinition(katsu.canonicalId),
      [gustwaveOfTheSecondWindRed.canonicalId]: realCardDefinition(
        gustwaveOfTheSecondWindRed.canonicalId,
      ),
      [retraceThePastBlue.canonicalId]: realCardDefinition(retraceThePastBlue.canonicalId),
      [surgingStrikeRed.canonicalId]: realCardDefinition(surgingStrikeRed.canonicalId),
      [dash.canonicalId]: realCardDefinition(dash.canonicalId),
      [snatchRed.canonicalId]: realCardDefinition(snatchRed.canonicalId),
    },
    player1: {
      heroCardId: katsu.canonicalId,
      life: 20,
      hand: [
        surgingStrikeRed.canonicalId,
        gustwaveOfTheSecondWindRed.canonicalId,
        retraceThePastBlue.canonicalId,
        snatchRed.canonicalId,
      ],
      deck: 8,
      actionPoints: 1,
      resourcePoints: 2,
    },
    player2: {
      heroCardId: dash.canonicalId,
      life: 20,
      hand: [],
      deck: 8,
    },
  });
  return matchFromEngine(engine, "fab-scenario-ninja-retrace-the-past-name");
}

function bootNinjaTigrineReflexReaction(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-ninja-tigrine-reflex-reaction",
    cardDefinitions: {
      [iraCrimsonHaze.canonicalId]: realCardDefinition(iraCrimsonHaze.canonicalId),
      [surgingStrikeRed.canonicalId]: realCardDefinition(surgingStrikeRed.canonicalId),
      [crouchingTiger.canonicalId]: realCardDefinition(crouchingTiger.canonicalId),
      [tigrineReflexRed.canonicalId]: realCardDefinition(tigrineReflexRed.canonicalId),
      [dash.canonicalId]: realCardDefinition(dash.canonicalId),
    },
    player1: {
      heroCardId: iraCrimsonHaze.canonicalId,
      life: 20,
      hand: [
        surgingStrikeRed.canonicalId,
        crouchingTiger.canonicalId,
        tigrineReflexRed.canonicalId,
      ],
      deck: 8,
      actionPoints: 1,
    },
    player2: {
      heroCardId: dash.canonicalId,
      life: 20,
      hand: [],
      deck: 8,
    },
  });
  return matchFromEngine(engine, "fab-scenario-ninja-tigrine-reflex-reaction");
}

function bootPilferTargets(kind: "legal" | "invalid"): FabPracticeMatch {
  const cardDefinitions = {
    [PILFER_THE_TOMB_BLUE_ID]: realCardDefinition(PILFER_THE_TOMB_BLUE_ID),
    [SIGIL_OF_SOLACE_RED_ID]: realCardDefinition(SIGIL_OF_SOLACE_RED_ID),
    [CRACKED_BAUBLE_YELLOW_ID]: realCardDefinition(CRACKED_BAUBLE_YELLOW_ID),
  };
  const seed = `fab-scenario-pilfer-${kind}-targets`;
  const engine = createEngine({
    seed,
    cardDefinitions,
    player1: {
      heroCardId: catalogIds.rhinar,
      hand: [PILFER_THE_TOMB_BLUE_ID],
      deck: 8,
      actionPoints: 1,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      graveyard:
        kind === "legal"
          ? [SIGIL_OF_SOLACE_RED_ID, CRACKED_BAUBLE_YELLOW_ID]
          : [SIGIL_OF_SOLACE_RED_ID],
      deck: 8,
    },
  });
  return matchFromEngine(engine, seed);
}

export const INTERACTIONS_SCENARIOS = {
  "multiple-playable-banished-cards": {
    id: "multiple-playable-banished-cards",
    label: "Banished · multiple playable cards",
    description:
      "Three real Rune Gate attacks are simultaneously playable from banished. Open the zone, compare the highlighted choices, then deliberately select the card to play.",
    group: "opening",
    tags: ["engine", "banished", "rune-gate", "viserai", "multiple-actions", "real-card"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootMultiplePlayableBanishedCards,
  },
  "pitch-stack-four-cards": {
    id: "pitch-stack-four-cards",
    label: "Pitch stack · four cards",
    description:
      "End-turn snapshot with four real cards in pitch and the private pitch-stack ordering decision ready for one-click desktop and mobile review.",
    group: "opening",
    tags: ["engine", "pitch", "end-turn", "ordering", "private", "mobile"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootPitchStackFourCards,
  },
  "song-of-sinew-reorder": {
    id: "song-of-sinew-reorder",
    label: "Song of Sinew · reorder revealed cards",
    description:
      "Play Song of Sinew (SUP134), resolve its reveal, then put all four real revealed cards back on top of the deck in the chosen order.",
    group: "opening",
    tags: ["engine", "song-of-sinew", "reveal", "deck-order", "partition", "real-card"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootSongOfSinewReorder,
  },
  "tuffnut-song-rip-rok": {
    id: "tuffnut-song-rip-rok",
    label: "Tuffnut · Song + Rip · attack or Rok",
    description:
      "Play Song of Sinew and order four distinct blue 6-power cards. Resolve Rip Off the Top and activate Tuffnut, then apply the combined bonus to either Brutal Assault as an attack action or Rok as a weapon attack.",
    group: "opening",
    tags: [
      "engine",
      "tuffnut",
      "song-of-sinew",
      "rip-off-the-top",
      "rok",
      "brutal-assault",
      "attack-action",
      "blue",
      "6-power",
    ],
    viewerId: "player-1",
    botMode: "off",
    boot: bootTuffnutSongRipRok,
  },
  "hero-signal-boltyn-bottom": {
    id: "hero-signal-boltyn-bottom",
    label: "Hero Signal Edge · controlled seat",
    description:
      "Boltyn legally charged Bolt of Courage and is paused at Defend to verify the active-only hero dock without changing combat or zone geometry.",
    group: "opening",
    tags: ["engine", "hero-signal", "boltyn", "charge", "combat", "mobile"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootBoltynHeroSignal,
  },
  "hero-signal-boltyn-top": {
    id: "hero-signal-boltyn-top",
    label: "Hero Signal Edge · opposing seat",
    description:
      "The same legal Boltyn charge viewed from the defending seat, proving the dock remains attached to the opposing hero on desktop and portrait mobile.",
    group: "opening",
    tags: ["engine", "hero-signal", "boltyn", "charge", "opponent", "mobile"],
    viewerId: "player-2",
    botMode: "off",
    boot: bootBoltynHeroSignal,
  },
  "sutcliffe-research-notes-reorder": {
    id: "sutcliffe-research-notes-reorder",
    label: "Sutcliffe's Research Notes · reorder revealed cards",
    description:
      "Play Sutcliffe's Research Notes (CRU154), reveal three real cards, then choose their top-deck order.",
    group: "opening",
    tags: ["engine", "sutcliffe", "reveal", "deck-order", "partition", "real-card"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootSutcliffeResearchNotesReorder,
  },
  "spire-sniping-reorder": {
    id: "spire-sniping-reorder",
    label: "Spire Sniping · reorder looked cards",
    description:
      "Activate Skullbone Crosswrap, turn Spire Sniping (AZL014) face up in arsenal, then complete its two-card look-and-reorder decision.",
    group: "opening",
    tags: ["engine", "spire-sniping", "look", "arsenal", "deck-order", "partition", "real-card"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootSpireSnipingReorder,
  },
  "opt-ability-lab": {
    id: "opt-ability-lab",
    label: "Opt ability lab · three real cards",
    description:
      "Compare Opt 4 on Whisper of the Oracle, Opt 1 from Optekal Monocle's activated ability, and instant Opt 2 from Talismanic Lens on one board.",
    group: "opening",
    tags: ["engine", "opt", "action", "item", "equipment", "instant", "real-card"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootOptAbilityLab,
  },
  "dual-target-open": {
    id: "dual-target-open",
    label: "Dual-target · open action (Snatch)",
    description:
      "Snatch (WTR167 stats + hit→draw) and three Ravenous Rabble in hand at action phase — begin play, resolve its card layer, then attack the sole opposing hero. Opponent pass-only.",
    group: "opening",
    tags: ["engine", "snatch", "dual-target", "integration", "closed"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootDualTargetOpen,
  },
  "hand-play-or-activate": {
    id: "hand-play-or-activate",
    label: "Hand card · play or activate (Cosmic Duality)",
    description:
      "Cosmic Duality is in hand with enough resources to either play its attack or activate its discard-this Instant. Click the card to choose the legal action.",
    group: "opening",
    tags: ["engine", "hand", "play", "activate", "instant", "cosmic-duality"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootHandPlayOrActivate,
  },
  "ninja-become-the-bottle-name": {
    id: "ninja-become-the-bottle-name",
    label: "Ninja · Become the Bottle name",
    description:
      "Crouching Tiger and Become the Bottle begin in hand. Play Crouching Tiger, resolve its chain link, then play Become the Bottle and choose Crouching Tiger to verify the copied name.",
    group: "combat",
    tags: ["engine", "ninja", "name", "target", "become-the-bottle", "real-card"],
    viewerId: "player-1",
    botMode: "hero-profile",
    boot: bootNinjaBecomeTheBottleName,
  },
  "ninja-retrace-the-past-name": {
    id: "ninja-retrace-the-past-name",
    label: "Ninja · Retrace the Past name",
    description:
      "Surging Strike, Gustwave of the Second Wind, Retrace the Past, and Snatch begin in hand. Build the combo naturally with Surging Strike, then Gustwave, then play Retrace and name Snatch to verify the copied name, +2 power, and go again.",
    group: "combat",
    tags: [
      "engine",
      "ninja",
      "combo",
      "name",
      "retrace-the-past",
      "surging-strike",
      "gustwave",
      "real-card",
    ],
    viewerId: "player-1",
    botMode: "hero-profile",
    boot: bootNinjaRetraceThePastName,
  },
  "ninja-tigrine-reflex-reaction": {
    id: "ninja-tigrine-reflex-reaction",
    label: "Ninja · Tigrine Reflex reaction",
    description:
      "Surging Strike, Crouching Tiger, and Tigrine Reflex begin in hand. Attack with Surging Strike, advance to the reaction step, then activate Tigrine Reflex to verify +1 power and the created Crouching Tiger.",
    group: "combat",
    tags: ["engine", "ninja", "attack-reaction", "tigrine-reflex", "real-card"],
    viewerId: "player-1",
    botMode: "hero-profile",
    boot: bootNinjaTigrineReflexReaction,
  },
  "pilfer-legal-targets": {
    id: "pilfer-legal-targets",
    label: "Pilfer · both modes legal",
    description:
      "Play Pilfer the Tomb, select both modes, and target the opposing red instant and yellow card. Both choices remain selected through confirmation.",
    group: "opening",
    tags: ["engine", "pilfer", "modal", "multiple-selection", "targets", "legal"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: () => bootPilferTargets("legal"),
  },
  "pilfer-invalid-targets": {
    id: "pilfer-invalid-targets",
    label: "Pilfer · illegal mode reversal",
    description:
      "The opposing graveyard has an instant but no yellow card. Select both modes to verify authoritative reversal, restored assets, and uninterrupted priority.",
    group: "opening",
    tags: ["engine", "pilfer", "modal", "reversal", "invalid-target", "notice"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: () => bootPilferTargets("invalid"),
  },
  "deck-search": {
    id: "deck-search",
    label: "Deck search · Sand Sketched Plan",
    description:
      "Play Sand Sketched Plan (WTR009), then browse the private deck, choose a card to put into hand, and continue to the random discard and shuffle.",
    group: "opening",
    tags: ["engine", "deck-search", "private-zone", "sand-sketched-plan", "WTR009"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootDeckSearch,
  },
  "permanent-token-generation": {
    id: "permanent-token-generation",
    label: "Permanent tokens · generation lab",
    description:
      "Activate the three Agile, two Mighty, and two Vigorous Windups to validate stacked Agility, Might, and Vigor tokens, then play Starting Stake to create Gold.",
    group: "opening",
    tags: ["engine", "permanent", "tokens", "agility", "might", "vigor", "gold", "create-token"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootPermanentTokenGeneration,
  },
} satisfies FabScenarioCollection;
