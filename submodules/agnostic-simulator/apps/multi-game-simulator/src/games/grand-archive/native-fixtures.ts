import {
  spiritOfFire,
  spiritOfWind,
  raiSpellcrafter,
  raiArchmage,
  scryTheSkies,
  woodlandSquirrels,
  grayWolf,
  giantTortoise,
  favorableWinds,
  songOfNurturing,
  orbOfHubris,
  hiddenSecrets,
  creativeShock,
  markTheTarget,
  luxerasMap,
  eruptingRhapsody,
  sagesUrn,
  scryTheStars,
  arisannaHerbalistProdigy,
  arisannaMasterAlchemist,
  arisannaAstralZenith,
  raiManaWeaver,
  adventOfTheStormcaller,
  arcaneSight,
  chargeStatic,
  triboelectricFortification,
  trainingSword,
  spiritOfWater,
  hoarfrostHold,
  guoJiaChosenDisciple,
  idleFatestone,
  viridescentAetherstreak,
  salamandersBreath,
  teraSight,
  silvieWildsWhisperer,
  silvieWithThePack,
  silvieEarthsTune,
} from "@tcg/grand-archive-cards";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveServerEngine } from "@tcg/grand-archive-server-adapter";

import { grandArchivePracticeDecks } from "@tcg/grand-archive-server-adapter/practice";
import { createGrandArchivePracticeEngineFromSetup } from "./practice-setup";

type FixtureSetup = Parameters<typeof GrandArchiveTestEngine.startFixture>[0];

function serverFor(
  playerOne: Omit<FixtureSetup["playerOne"], "champion"> &
    Partial<Pick<FixtureSetup["playerOne"], "champion">>,
  phase: FixtureSetup["phase"] = "main",
  opponent?: Partial<FixtureSetup["playerTwo"]>,
) {
  const game = GrandArchiveTestEngine.startFixture({
    phase,
    playerOne: { id: "p1", name: "You", champion: spiritOfFire, ...playerOne },
    playerTwo: {
      id: "p2",
      name: "Opponent",
      champion: spiritOfWind,
      zones: {
        field: [giantTortoise, woodlandSquirrels],
        "main-deck": [woodlandSquirrels, grayWolf],
      },
      ...opponent,
    },
  });
  return new GrandArchiveServerEngine(
    game.program,
    new GrandArchiveMatchRuntime(game.program, game.state),
  );
}

/** All factories begin before activation. Cards, costs, decisions, and outcomes stay engine-owned. */
export const GRAND_ARCHIVE_NATIVE_FIXTURES = [
  {
    id: "native-crowded-board",
    name: "Crowded board inspection",
    group: "decision",
    tags: ["native", "crowded", "inspection", "materialization", "mobile"],
    summary:
      "Inspect both crowded fields, your eight-card hand, and the graveyards before materialization. Use Search the main deck for the separate twelve-card choice scenario.",
    createServer: () =>
      serverFor(
        {
          champion: spiritOfWind,
          zones: {
            field: [
              grayWolf,
              giantTortoise,
              woodlandSquirrels,
              grayWolf,
              giantTortoise,
              woodlandSquirrels,
              luxerasMap,
              trainingSword,
            ],
            hand: [
              woodlandSquirrels,
              grayWolf,
              giantTortoise,
              woodlandSquirrels,
              grayWolf,
              giantTortoise,
              woodlandSquirrels,
              grayWolf,
            ],
            graveyard: [
              grayWolf,
              favorableWinds,
              woodlandSquirrels,
              giantTortoise,
              scryTheSkies,
              hiddenSecrets,
              creativeShock,
              songOfNurturing,
            ],
            "main-deck": [
              woodlandSquirrels,
              grayWolf,
              giantTortoise,
              favorableWinds,
              scryTheSkies,
              songOfNurturing,
              hiddenSecrets,
              creativeShock,
              markTheTarget,
              eruptingRhapsody,
              scryTheStars,
              arcaneSight,
            ],
          },
        },
        "materialize",
        {
          zones: {
            field: [
              giantTortoise,
              woodlandSquirrels,
              grayWolf,
              giantTortoise,
              woodlandSquirrels,
              grayWolf,
              trainingSword,
            ],
            hand: [grayWolf, woodlandSquirrels, giantTortoise, favorableWinds],
            graveyard: [grayWolf, giantTortoise, favorableWinds, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, grayWolf, giantTortoise],
          },
        },
      ),
  },
  {
    id: "native-opening",
    name: "Opening and first materialization",
    group: "turn-flow",
    tags: ["native", "opening", "pregame", "materialization"],
    summary:
      "Start a real starter-deck match. Complete both players' pregame actions, pass opening effects, and make the first materialization choice.",
    createServer: () => {
      const starter = grandArchivePracticeDecks.find((deck) => deck.id === "lorraine-pnp-1-4");
      if (!starter) throw new Error("Opening fixture requires the Lorraine starter deck");
      return createGrandArchivePracticeEngineFromSetup({
        deck: starter.deck,
        randomSeed: 20260826,
      });
    },
  },
  {
    id: "native-recollection",
    name: "Memory payment and recollection",
    group: "turn-flow",
    tags: ["native", "recollection", "memory", "materialization", "counters"],
    summary:
      "Materialize Rai, Spellcrafter from the material deck to pay one memory and gain two enlighten counters, or skip. Then pass both players to recollect the remaining memory cards.",
    createServer: () =>
      serverFor(
        {
          zones: {
            "material-deck": [raiSpellcrafter],
            memory: [grayWolf, favorableWinds, woodlandSquirrels],
            "main-deck": [giantTortoise, grayWolf],
          },
        },
        "materialize",
      ),
  },
  {
    id: "native-glimpse",
    name: "Glimpse: top and bottom",
    group: "decision",
    tags: ["native", "glimpse", "ordering", "memory", "counters"],
    summary:
      "Activate Scry the Skies, pay one reserve, then pass both players. Order the revealed cards between top and bottom; the next card is drawn into memory.",
    createServer: () =>
      serverFor({
        champion: spiritOfFire,
        lineage: [raiSpellcrafter, raiArchmage],
        zones: {
          hand: [scryTheSkies, woodlandSquirrels],
          "main-deck": [grayWolf, favorableWinds, giantTortoise, woodlandSquirrels],
        },
      }),
  },
  {
    id: "native-distribution",
    name: "Harmonize and split damage",
    group: "decision",
    tags: ["native", "allocation", "harmonize", "damage"],
    summary:
      "Activate Song of Nurturing, pay two reserve and pass both players. Then activate Erupting Rhapsody, banish Fire cards from your graveyard, and split the damage.",
    createServer: () =>
      serverFor({
        zones: {
          hand: [
            songOfNurturing,
            eruptingRhapsody,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
          graveyard: [markTheTarget, markTheTarget, markTheTarget],
          "main-deck": [grayWolf],
        },
      }),
  },
  {
    id: "native-number",
    name: "Choose a draw count",
    group: "decision",
    tags: ["native", "number", "hand", "shuffle"],
    summary:
      "Activate Orb of Hubris and pass both players. Choose zero to three cards to draw, then select that many hand cards to shuffle into the deck.",
    createServer: () =>
      serverFor({
        zones: {
          field: [orbOfHubris],
          hand: [woodlandSquirrels],
          "main-deck": [grayWolf, favorableWinds, giantTortoise, woodlandSquirrels],
        },
      }),
  },
  {
    id: "native-modes",
    name: "Modes and stealth",
    group: "decision",
    tags: ["native", "modes", "target", "status"],
    summary:
      "Activate Hidden Secrets, choose its mode, and pay two reserve. Give an ally stealth or draw a card into memory.",
    createServer: () =>
      serverFor({
        zones: {
          hand: [hiddenSecrets, woodlandSquirrels, woodlandSquirrels],
          field: [grayWolf],
          "main-deck": [giantTortoise, favorableWinds],
        },
      }),
  },
  {
    id: "native-optional",
    name: "Discard and optional damage",
    group: "decision",
    tags: ["native", "optional", "discard", "damage"],
    summary:
      "Activate Creative Shock and pay three reserve. Draw two, discard Mark the Target, then accept or decline the optional two damage and choose a unit.",
    createServer: () =>
      serverFor({
        champion: spiritOfFire,
        lineage: [raiSpellcrafter],
        zones: {
          hand: [creativeShock, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [markTheTarget, grayWolf, giantTortoise],
        },
      }),
  },
  {
    id: "native-search",
    name: "Search the main deck",
    group: "decision",
    tags: ["native", "search", "private", "memory"],
    summary:
      "Activate Luxera's Map and pass both players. Choose one of twelve cards from the private deck search to move into memory, then the engine shuffles the deck.",
    createServer: () =>
      serverFor({
        zones: {
          field: [luxerasMap],
          "main-deck": [
            grayWolf,
            favorableWinds,
            giantTortoise,
            woodlandSquirrels,
            scryTheSkies,
            songOfNurturing,
            hiddenSecrets,
            creativeShock,
            markTheTarget,
            eruptingRhapsody,
            scryTheStars,
            arcaneSight,
          ],
        },
      }),
  },
  {
    id: "native-graveyard",
    name: "Choose graveyard cards",
    group: "decision",
    tags: ["native", "multiple", "graveyard", "banishment", "level"],
    summary:
      "Activate Erupting Rhapsody and pay two reserve. Choose any number of your Fire cards in the graveyard to banish and increase your champion's level this turn.",
    createServer: () =>
      serverFor({
        zones: {
          hand: [eruptingRhapsody, woodlandSquirrels, woodlandSquirrels],
          graveyard: [markTheTarget, markTheTarget, markTheTarget, grayWolf],
          "main-deck": [giantTortoise],
        },
      }),
  },
  {
    id: "native-trigger-order",
    name: "Order simultaneous triggers",
    group: "decision",
    tags: ["native", "ordering", "triggers", "counters"],
    summary:
      "Skip materialization. Choose the order of the two Sage's Urn recollection triggers, then pass both players to put an age counter on each Urn.",
    createServer: () =>
      serverFor(
        { zones: { field: [sagesUrn, sagesUrn], "main-deck": [woodlandSquirrels, grayWolf] } },
        "materialize",
      ),
  },
  {
    id: "native-starcall",
    name: "Glimpse and Starcall",
    group: "decision",
    tags: ["native", "starcall", "glimpse", "ordering", "activation"],
    summary:
      "Activate Scry the Stars and pay three reserve. Choose Starcall, activate a revealed Woodland Squirrels for zero, and order the remaining cards on the bottom.",
    createServer: () =>
      serverFor({
        champion: spiritOfWater,
        lineage: [arisannaHerbalistProdigy, arisannaMasterAlchemist, arisannaAstralZenith],
        zones: {
          hand: [scryTheStars, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, grayWolf, giantTortoise, favorableWinds],
        },
      }),
  },
  {
    id: "native-reveal-partition",
    name: "Reveal, choose, and reorder",
    group: "decision",
    tags: ["native", "reveal", "partition", "top", "bottom"],
    summary:
      "Activate Advent of the Stormcaller and pay twelve reserve. Order the three revealed cards between the top and bottom of the deck.",
    createServer: () =>
      serverFor({
        lineage: [raiSpellcrafter, raiArchmage, raiManaWeaver],
        zones: {
          hand: [adventOfTheStormcaller, ...Array.from({ length: 12 }, () => woodlandSquirrels)],
          "main-deck": [arcaneSight, grayWolf, giantTortoise, favorableWinds],
        },
      }),
  },
  {
    id: "native-counter-allocation",
    name: "Allocate static counters",
    group: "decision",
    tags: ["native", "counter", "allocation", "damage", "durability"],
    summary:
      "Activate Charge Static targeting Rai. Then activate Triboelectric Fortification, choose a damage target, remove up to three static counters, and choose Training Sword to gain durability.",
    createServer: () =>
      serverFor({
        lineage: [raiSpellcrafter, raiArchmage, raiManaWeaver],
        zones: {
          hand: [
            chargeStatic,
            triboelectricFortification,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
          field: [trainingSword],
          "main-deck": [grayWolf, giantTortoise],
        },
      }),
  },
  {
    id: "native-restricted-recollection",
    name: "Choose cards to recollect",
    group: "decision",
    tags: ["native", "recollection", "memory", "counters", "opponent"],
    summary:
      "Activate Hoarfrost Hold and banish the second Hold from hand to add a frost counter. Pass to the opponent's materialization, skip it, and choose two of their three memory cards to recollect.",
    createServer: () =>
      serverFor(
        {
          champion: spiritOfWater,
          lineage: [arisannaHerbalistProdigy],
          zones: {
            hand: [hoarfrostHold, hoarfrostHold, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [grayWolf, giantTortoise, woodlandSquirrels],
          },
        },
        "main",
        {
          zones: {
            memory: [grayWolf, giantTortoise, favorableWinds],
            "main-deck": [woodlandSquirrels, grayWolf, giantTortoise],
          },
        },
      ),
  },
  {
    id: "native-transform",
    name: "Reveal and transform",
    group: "decision",
    tags: ["native", "reveal", "transform", "double-faced"],
    summary:
      "Activate Idle Fatestone's ability and pay two reserve. Its native effect reveals the odd-cost Scry the Skies and transforms the Fatestone.",
    createServer: () =>
      serverFor({
        lineage: [guoJiaChosenDisciple],
        zones: {
          field: [idleFatestone],
          hand: [woodlandSquirrels, woodlandSquirrels],
          "main-deck": [scryTheSkies, giantTortoise],
        },
      }),
  },
  {
    id: "native-load",
    name: "Load an Aetherwing weapon",
    group: "decision",
    tags: ["native", "modes", "load", "attachment", "weapon"],
    summary:
      "Activate Viridescent Aetherstreak with the distant and load modes (zero distant targets). Pay three reserve, then choose Salamander's Breath as the host weapon.",
    createServer: () =>
      serverFor({
        champion: spiritOfWind,
        zones: {
          field: [salamandersBreath],
          hand: [viridescentAetherstreak, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [giantTortoise],
        },
      }),
  },
  {
    id: "native-preserve",
    name: "Preserve and return a card",
    group: "turn-flow",
    tags: ["native", "preserve", "materialization", "hand"],
    summary:
      "Activate Tera Sight. It draws a card and enters the material deck preserved. Pass both turns, then return the preserved card instead of materializing.",
    createServer: () =>
      serverFor({
        champion: spiritOfWind,
        lineage: [silvieWildsWhisperer, silvieWithThePack, silvieEarthsTune],
        zones: {
          hand: [teraSight],
          "main-deck": [grayWolf, giantTortoise, woodlandSquirrels, favorableWinds],
        },
      }),
  },
] as const;

export type GrandArchiveNativeFixtureId = (typeof GRAND_ARCHIVE_NATIVE_FIXTURES)[number]["id"];
export function findGrandArchiveNativeFixture(id: string) {
  return GRAND_ARCHIVE_NATIVE_FIXTURES.find((fixture) => fixture.id === id);
}
