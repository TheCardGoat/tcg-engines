import type { FabPracticeMatch } from "@tcg/flesh-and-blood-engine/simulator";
import {
  catalogIds,
  dash,
  mutatedMassBlue,
  rok,
  rockyardRodeoBlue,
  brutalAssaultBlue,
  tuffnut,
  toughAsARokBlue,
  nimblismBlue,
  spectralProcessionRed,
  spectralShield,
  EVERBLOOM_LIFE_ID,
  INVOKE_YENDURAI_ID,
  YENDURAI_BACK_FACE_ID,
  realCardDefinition,
} from "./cards";
import { matchFromEngine, createEngine } from "./runtime";
import { FIXTURE_BOARD_CARD_DEFINITIONS } from "./fixture-cards";
import { withActiveEffectsLab } from "./presentation";
import type { FabScenarioCollection } from "./types";

function bootOpening(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-opening",
    cardDefinitions: FIXTURE_BOARD_CARD_DEFINITIONS,
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      head: [catalogIds.helmIron],
      chest: [catalogIds.fyendalTunic],
      arms: [catalogIds.braveforgeBracers],
      legs: [catalogIds.scabskin],
      weapon1: [catalogIds.rompingClub],
      hand: [
        catalogIds.alphaRampage,
        catalogIds.nimblismBlue,
        catalogIds.wreckerRomp,
        catalogIds.sinkBelow,
      ],
      graveyard: [catalogIds.snatch],
      banished: [catalogIds.primevalBellow],
      arsenal: [catalogIds.sigilSolace],
      deck: 12,
      actionPoints: 1,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      head: [catalogIds.helmIron],
      chest: [catalogIds.fyendalTunic],
      arms: [catalogIds.braveforgeBracers],
      weapon1: [catalogIds.anothos],
      hand: [
        catalogIds.sinkBelow,
        catalogIds.enlightenedStrike,
        catalogIds.unmovable,
        catalogIds.crackedBauble,
      ],
      graveyard: [catalogIds.disable],
      banished: [catalogIds.nimblismBlue],
      arsenal: [catalogIds.sigilSolace],
      deck: 12,
    },
  });
  return matchFromEngine(engine, "fab-scenario-opening");
}

function bootClosedSparse(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-closed-sparse",
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      weapon1: [catalogIds.rompingClub],
      hand: [catalogIds.snatch, catalogIds.nimblismBlue, catalogIds.sinkBelow],
      deck: 10,
      actionPoints: 1,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      weapon1: [catalogIds.anothos],
      hand: [catalogIds.disable, catalogIds.crackedBauble],
      deck: 10,
    },
  });
  return matchFromEngine(engine, "fab-scenario-closed-sparse");
}

function bootWeaponAndDoubleArsenal(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-weapon-and-double-arsenal",
    cardDefinitions: FIXTURE_BOARD_CARD_DEFINITIONS,
    player1: {
      heroCardId: "fixture-victor-goldmane",
      life: 40,
      head: [catalogIds.helmIron],
      chest: ["fixture-tectonic-plating"],
      arms: ["fixture-crater-fist"],
      legs: ["fixture-craterhoof"],
      weapon1: ["fixture-titans-fist"],
      weapon2: ["fixture-aurum-aegis"],
      arsenal: [catalogIds.pummel],
      hand: [catalogIds.disable, catalogIds.crackedBauble, catalogIds.nimblismBlue],
      deck: 12,
      actionPoints: 1,
    },
    player2: {
      heroCardId: "fixture-azalea-ace-in-the-hole",
      life: 40,
      head: ["fixture-new-horizon"],
      chest: ["fixture-trench-of-sunken-treasure"],
      arms: ["fixture-bulls-eye-bracers"],
      legs: ["fixture-perch-grapplers"],
      weapon1: ["fixture-death-dealer"],
      arsenal: [
        { card: "fixture-red-in-the-ledger", state: { faceUp: true } },
        "fixture-searing-shot",
      ],
      hand: [catalogIds.sinkBelow, catalogIds.nimblismBlue, catalogIds.crackedBauble],
      deck: 12,
    },
  });
  return matchFromEngine(engine, "fab-scenario-weapon-and-double-arsenal");
}

function bootClosedGeared(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-closed-geared",
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 18,
      weapon1: [catalogIds.rompingClub],
      legs: [catalogIds.scabskin],
      hand: [catalogIds.wreckerRomp, catalogIds.primevalBellow, catalogIds.nimblismBlue],
      pitch: [catalogIds.crackedBauble],
      graveyard: [catalogIds.snatch],
      arsenal: [catalogIds.sigilSolace],
      deck: 14,
      actionPoints: 1,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 19,
      weapon1: [catalogIds.anothos],
      head: [catalogIds.helmIron],
      hand: [catalogIds.disable, catalogIds.unmovable, catalogIds.sinkBelow],
      pitch: [catalogIds.nimblismBlue],
      deck: 14,
    },
  });
  return matchFromEngine(engine, "fab-scenario-closed-geared");
}

function bootBothPlayersZones(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-both-players-zones",
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 18,
      weapon1: [catalogIds.rompingClub],
      legs: [catalogIds.scabskin],
      hand: [catalogIds.wreckerRomp, catalogIds.nimblismBlue],
      pitch: [
        catalogIds.nimblismBlue,
        catalogIds.nimblismBlue,
        catalogIds.crackedBauble,
        catalogIds.snatch,
      ],
      graveyard: [catalogIds.alphaRampage, catalogIds.wreckerRomp, catalogIds.wreckerRomp],
      banished: [
        catalogIds.primevalBellow,
        catalogIds.primevalBellow,
        { card: catalogIds.snatch, state: { faceDown: true } },
        { card: catalogIds.snatch, state: { faceDown: true } },
      ],
      deck: 12,
      actionPoints: 1,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 19,
      weapon1: [catalogIds.anothos],
      head: [catalogIds.helmIron],
      hand: [catalogIds.disable, catalogIds.sinkBelow],
      pitch: [
        catalogIds.disable,
        catalogIds.disable,
        catalogIds.nimblismBlue,
        catalogIds.crackedBauble,
      ],
      graveyard: [catalogIds.unmovable, catalogIds.enlightenedStrike, catalogIds.unmovable],
      banished: [
        catalogIds.sigilSolace,
        catalogIds.sigilSolace,
        { card: catalogIds.disable, state: { faceDown: true } },
        { card: catalogIds.disable, state: { faceDown: true } },
      ],
      deck: 12,
    },
  });
  return matchFromEngine(engine, "fab-scenario-both-players-zones");
}

function bootClosedArena(): FabPracticeMatch {
  // Dense arena rows exercise the mobile permanent scrollers. Practice
  // generics remain visual stand-ins until the item/token fixture catalog grows.
  const engine = createEngine({
    seed: "fab-scenario-closed-arena",
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      weapon1: [catalogIds.rompingClub],
      legs: [catalogIds.scabskin],
      arena: [
        catalogIds.sigilSolace,
        catalogIds.crackedBauble,
        catalogIds.sigilSolace,
        catalogIds.crackedBauble,
        catalogIds.sigilSolace,
        catalogIds.crackedBauble,
        catalogIds.sigilSolace,
        catalogIds.crackedBauble,
      ],
      hand: [catalogIds.alphaRampage, catalogIds.nimblismBlue, catalogIds.nimblismBlue],
      pitch: [catalogIds.nimblismBlue, catalogIds.crackedBauble],
      graveyard: [catalogIds.snatch],
      banished: [catalogIds.wreckerRomp],
      arsenal: [catalogIds.sigilSolace],
      deck: 12,
      actionPoints: 1,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      weapon1: [catalogIds.anothos],
      head: [catalogIds.helmIron],
      arena: [
        catalogIds.crackedBauble,
        catalogIds.sigilSolace,
        catalogIds.crackedBauble,
        catalogIds.sigilSolace,
        catalogIds.crackedBauble,
        catalogIds.sigilSolace,
        catalogIds.crackedBauble,
        catalogIds.sigilSolace,
      ],
      hand: [catalogIds.disable, catalogIds.sinkBelow],
      pitch: [catalogIds.nimblismBlue, catalogIds.nimblismBlue, catalogIds.crackedBauble],
      graveyard: [catalogIds.unmovable, catalogIds.enlightenedStrike],
      banished: [catalogIds.disable],
      arsenal: [catalogIds.sinkBelow],
      deck: 12,
    },
  });
  return matchFromEngine(engine, "fab-scenario-closed-arena");
}

function bootLandscapeMeldPreview(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-landscape-meld-preview",
    cardDefinitions: { [EVERBLOOM_LIFE_ID]: realCardDefinition(EVERBLOOM_LIFE_ID) },
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      weapon1: [catalogIds.rompingClub],
      hand: [EVERBLOOM_LIFE_ID, catalogIds.nimblismBlue],
      deck: 10,
      actionPoints: 1,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      weapon1: [catalogIds.anothos],
      hand: [catalogIds.sinkBelow],
      deck: 10,
    },
  });
  return matchFromEngine(engine, "fab-scenario-landscape-meld-preview");
}

function bootDoubleFacedCardPreview(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-double-faced-card-preview",
    cardDefinitions: { [INVOKE_YENDURAI_ID]: realCardDefinition(INVOKE_YENDURAI_ID) },
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      weapon1: [catalogIds.rompingClub],
      hand: [INVOKE_YENDURAI_ID, catalogIds.nimblismBlue],
      arena: [{ card: INVOKE_YENDURAI_ID, state: { activeFaceIds: [YENDURAI_BACK_FACE_ID] } }],
      deck: 10,
      actionPoints: 1,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      weapon1: [catalogIds.anothos],
      hand: [catalogIds.sinkBelow],
      deck: 10,
    },
  });
  return matchFromEngine(engine, "fab-scenario-double-faced-card-preview");
}

function bootDynamicPropertyValues(): FabPracticeMatch {
  const dynamicDefinitions = [
    brutalAssaultBlue,
    dash,
    mutatedMassBlue,
    nimblismBlue,
    rockyardRodeoBlue,
    rok,
    spectralProcessionRed,
    spectralShield,
    tuffnut,
    toughAsARokBlue,
  ];
  const engine = createEngine({
    seed: "fab-scenario-dynamic-property-values",
    cardDefinitions: Object.fromEntries(
      dynamicDefinitions.map((card) => [card.canonicalId, realCardDefinition(card.canonicalId)]),
    ),
    player1: {
      heroCardId: tuffnut.canonicalId,
      life: 10,
      weapon1: [rok.canonicalId],
      hand: [
        rockyardRodeoBlue.canonicalId,
        mutatedMassBlue.canonicalId,
        spectralProcessionRed.canonicalId,
        toughAsARokBlue.canonicalId,
      ],
      pitch: [
        nimblismBlue.canonicalId,
        brutalAssaultBlue.canonicalId,
        rockyardRodeoBlue.canonicalId,
      ],
      arena: [spectralShield.canonicalId, spectralShield.canonicalId],
      deck: 10,
      actionPoints: 1,
    },
    player2: {
      heroCardId: dash.canonicalId,
      life: 20,
      deck: 10,
    },
  });
  return matchFromEngine(engine, "fab-scenario-dynamic-property-values");
}

export const BOARDS_SCENARIOS = {
  opening: {
    id: "opening",
    label: "Opening action phase",
    description: "Engine practice seating with equipped gear and populated zones, combat closed.",
    group: "opening",
    tags: ["engine", "rhinar", "bravo", "closed"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootOpening,
  },
  "dynamic-property-values": {
    id: "dynamic-property-values",
    label: "Dynamic card values · four causes",
    description:
      "Four real star-property cards in hand show live values from Rok (7), three distinct pitch costs (6/6), two Spectral Shields (2), and the lower-life condition (6).",
    group: "opening",
    tags: ["engine", "property-static", "power", "defense", "hand", "real-card"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootDynamicPropertyValues,
  },
  "both-players-zones": {
    id: "both-players-zones",
    label: "Both players · pitch, graveyard, banish",
    description:
      "Both players have populated pitch, graveyard, and banished zones; each banished zone includes a face-down card to verify private-information presentation.",
    group: "closed",
    tags: ["engine", "zones", "pitch", "graveyard", "banished", "face-down", "privacy"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootBothPlayersZones,
  },
  "active-effects-lab": {
    id: "active-effects-lab",
    label: "Active effects · both seats",
    description:
      "Engine-backed board with armed continuous, delayed-trigger, and prevention effect projections for compact and expanded UI review.",
    group: "opening",
    tags: ["engine", "effects", "continuous", "delayed-trigger", "replacement", "overflow"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootOpening,
    presentationTransform: withActiveEffectsLab,
  },
  "closed-sparse": {
    id: "closed-sparse",
    label: "Sparse board",
    description: "Minimal gear, empty arena, action phase. Interactive local engine.",
    group: "closed",
    tags: ["engine", "sparse", "closed"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootClosedSparse,
  },
  "weapon-and-double-arsenal": {
    id: "weapon-and-double-arsenal",
    label: "Off-hand weapon and double arsenal",
    description:
      "Victor has a full Guardian gear suite with Titan's Fist and Aurum Aegis; Azalea has full Ranger gear, and New Horizon enables two arsenal arrows.",
    group: "closed",
    tags: ["engine", "weapon", "off-hand", "arsenal", "new-horizon"],
    viewerId: "player-2",
    botMode: "off",
    boot: bootWeaponAndDoubleArsenal,
  },
  "closed-geared": {
    id: "closed-geared",
    label: "Geared seats",
    description: "Full-ish equipment, pitch, arsenal, GY — combat closed.",
    group: "closed",
    tags: ["engine", "equipment", "closed"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootClosedGeared,
  },
  "closed-arena": {
    id: "closed-arena",
    label: "Arena permanents",
    description: "Both seats have arena cards; combat closed.",
    group: "closed",
    tags: ["engine", "arena", "permanents", "closed"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootClosedArena,
  },
  "landscape-meld-preview": {
    id: "landscape-meld-preview",
    label: "Landscape split card preview",
    description:
      "Everbloom // Life (SEA258) in hand for validating its horizontal full-card preview and square board tile fallback.",
    group: "edge",
    tags: ["engine", "meld", "split", "landscape", "card-art"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootLandscapeMeldPreview,
  },
  "double-faced-card-preview": {
    id: "double-faced-card-preview",
    label: "Double-faced card preview",
    description:
      "Invoke Yendurai (UPR017) shows its Invocation front in hand and transformed Yendurai back in the arena for every card presentation.",
    group: "edge",
    tags: ["engine", "double-faced", "flip", "transform", "card-art"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootDoubleFacedCardPreview,
  },
} satisfies FabScenarioCollection;
