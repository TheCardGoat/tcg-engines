import * as cards001Module from "@tcg/lorcana-cards/cards/001";
import * as cards002Module from "@tcg/lorcana-cards/cards/002";
import * as cards003Module from "@tcg/lorcana-cards/cards/003";
import * as cards004Module from "@tcg/lorcana-cards/cards/004";
import * as cards005Module from "@tcg/lorcana-cards/cards/005";
import * as cards006Module from "@tcg/lorcana-cards/cards/006";
import * as cards007Module from "@tcg/lorcana-cards/cards/007";
import * as cards008Module from "@tcg/lorcana-cards/cards/008";
import * as cards009Module from "@tcg/lorcana-cards/cards/009";
import * as cards010Module from "@tcg/lorcana-cards/cards/010";
import * as cards011Module from "@tcg/lorcana-cards/cards/011";
import type {
  TestCardInput,
  TestFixtureCardEntry,
  TestFixtureCardState,
  TestInitialState,
} from "@tcg/lorcana-engine/testing";
import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";

const TEST_INITIAL_STATE_KEYS = ["deck", "hand", "play", "inkwell", "discard"] as const;

type TestInitialStateZoneKey = (typeof TEST_INITIAL_STATE_KEYS)[number];

const { all001Cards } = cards001Module as typeof import("@tcg/lorcana-cards/cards/001");
const { all002Cards } = cards002Module as typeof import("@tcg/lorcana-cards/cards/002");
const { all003Cards } = cards003Module as typeof import("@tcg/lorcana-cards/cards/003");
const { all004Cards } = cards004Module as typeof import("@tcg/lorcana-cards/cards/004");
const { all005Cards } = cards005Module as typeof import("@tcg/lorcana-cards/cards/005");
const { all006Cards } = cards006Module as typeof import("@tcg/lorcana-cards/cards/006");
const { all007Cards } = cards007Module as typeof import("@tcg/lorcana-cards/cards/007");
const { all008Cards } = cards008Module as typeof import("@tcg/lorcana-cards/cards/008");
const { all009Cards } = cards009Module as typeof import("@tcg/lorcana-cards/cards/009");
const { all010Cards } = cards010Module as typeof import("@tcg/lorcana-cards/cards/010");
const { all011Cards } = cards011Module as typeof import("@tcg/lorcana-cards/cards/011");

type SerializedCardUnderEntry = string | { card: string; publicFaceState?: "faceUp" | "faceDown" };

type SerializedTestFixtureCardState = Omit<
  TestFixtureCardState,
  "card" | "cardsUnder" | "atLocation"
> & {
  atLocation?: string;
  card: string;
  cardsUnder?: SerializedCardUnderEntry[];
};

type SerializedTestFixtureCardEntry = string | SerializedTestFixtureCardState;

export interface SerializedTestInitialState {
  deck?: number | SerializedTestFixtureCardEntry[];
  hand?: number | SerializedTestFixtureCardEntry[];
  play?: number | SerializedTestFixtureCardEntry[];
  inkwell?: number | SerializedTestFixtureCardEntry[];
  discard?: number | SerializedTestFixtureCardEntry[];
  lore?: number;
}

export interface LorcanaBrowserInlineFixture {
  id?: string;
  name?: string;
  description?: string;
  playerOne: SerializedTestInitialState;
  playerTwo?: SerializedTestInitialState;
  seed?: string;
  skipPreGame?: boolean;
}

export interface LorcanaBrowserFixtureInput {
  id?: string;
  name?: string;
  description?: string;
  playerOne: TestInitialState;
  playerTwo?: TestInitialState;
  seed?: string;
  skipPreGame?: boolean;
}

const ALL_LORCANA_CARDS = [
  ...all001Cards,
  ...all002Cards,
  ...all003Cards,
  ...all004Cards,
  ...all005Cards,
  ...all006Cards,
  ...all007Cards,
  ...all008Cards,
  ...all009Cards,
  ...all010Cards,
  ...all011Cards,
];

const LORCANA_CARDS_BY_ID = new Map(ALL_LORCANA_CARDS.map((card) => [card.id, card]));

function isFixtureCardState(entry: TestFixtureCardEntry): entry is TestFixtureCardState {
  return typeof entry === "object" && entry !== null && "card" in entry;
}

function serializeCardInput(card: TestCardInput): string {
  return String(card.id);
}

function serializeFixtureEntry(entry: TestFixtureCardEntry): SerializedTestFixtureCardEntry {
  if (!isFixtureCardState(entry)) {
    return serializeCardInput(entry);
  }

  return {
    atLocation: entry.atLocation ? serializeCardInput(entry.atLocation) : undefined,
    card: serializeCardInput(entry.card),
    cardsUnder: entry.cardsUnder?.map((underEntry) => {
      if ("card" in underEntry && !("id" in underEntry)) {
        const typed = underEntry as {
          card: TestCardInput;
          publicFaceState?: "faceUp" | "faceDown";
        };
        return typed.publicFaceState
          ? { card: serializeCardInput(typed.card), publicFaceState: typed.publicFaceState }
          : serializeCardInput(typed.card);
      }
      return serializeCardInput(underEntry as TestCardInput);
    }),
    damage: entry.damage,
    exerted: entry.exerted,
    isDrying: entry.isDrying,
    lore: entry.lore,
    publicFaceState: entry.publicFaceState,
  };
}

function serializeZone(
  zone: TestInitialState[TestInitialStateZoneKey],
): SerializedTestInitialState[TestInitialStateZoneKey] {
  if (typeof zone === "number" || zone === undefined) {
    return zone;
  }

  return zone.map(serializeFixtureEntry);
}

export function serializeTestInitialState(state: TestInitialState): SerializedTestInitialState {
  return {
    deck: serializeZone(state.deck),
    discard: serializeZone(state.discard),
    hand: serializeZone(state.hand),
    inkwell: serializeZone(state.inkwell),
    lore: state.lore,
    play: serializeZone(state.play),
  };
}

export function serializeInlineFixture(
  fixture: LorcanaBrowserFixtureInput | LorcanaSimulatorFixture,
): LorcanaBrowserInlineFixture {
  return {
    description: fixture.description,
    id: fixture.id,
    name: fixture.name,
    playerOne: serializeTestInitialState(fixture.playerOne),
    playerTwo: fixture.playerTwo ? serializeTestInitialState(fixture.playerTwo) : undefined,
    seed: fixture.seed,
    skipPreGame: fixture.skipPreGame,
  };
}

function resolveCardById(cardId: string): TestCardInput {
  const card = LORCANA_CARDS_BY_ID.get(cardId);
  if (!card) {
    throw new Error(`Unable to resolve Lorcana card "${cardId}" for browser fixture.`);
  }

  return card;
}

function deserializeFixtureEntry(entry: SerializedTestFixtureCardEntry): TestFixtureCardEntry {
  if (typeof entry === "string") {
    return resolveCardById(entry);
  }

  return {
    atLocation: entry.atLocation ? resolveCardById(entry.atLocation) : undefined,
    card: resolveCardById(entry.card),
    cardsUnder: entry.cardsUnder?.map((underEntry) => {
      if (typeof underEntry === "object" && underEntry !== null) {
        return {
          card: resolveCardById(underEntry.card),
          publicFaceState: underEntry.publicFaceState,
        };
      }
      return resolveCardById(underEntry);
    }),
    damage: entry.damage,
    exerted: entry.exerted,
    isDrying: entry.isDrying,
    lore: entry.lore,
    publicFaceState: entry.publicFaceState,
  };
}

function deserializeZone(
  zone: SerializedTestInitialState[TestInitialStateZoneKey],
): TestInitialState[TestInitialStateZoneKey] {
  if (typeof zone === "number" || zone === undefined) {
    return zone;
  }

  return zone.map(deserializeFixtureEntry);
}

export function deserializeTestInitialState(state: SerializedTestInitialState): TestInitialState {
  return {
    deck: deserializeZone(state.deck),
    discard: deserializeZone(state.discard),
    hand: deserializeZone(state.hand),
    inkwell: deserializeZone(state.inkwell),
    lore: state.lore,
    play: deserializeZone(state.play),
  };
}

export function deserializeInlineFixture(
  fixture: LorcanaBrowserInlineFixture,
): LorcanaSimulatorFixture {
  return {
    description: fixture.description ?? "Inline browser fixture",
    id: fixture.id ?? "browser-inline-fixture",
    name: fixture.name ?? "Inline Browser Fixture",
    playerOne: deserializeTestInitialState(fixture.playerOne),
    playerTwo: deserializeTestInitialState(fixture.playerTwo ?? {}),
    seed: fixture.seed,
    skipPreGame: fixture.skipPreGame,
  };
}

export function encodeInlineFixtureParam(fixture: LorcanaBrowserInlineFixture): string {
  return JSON.stringify(fixture);
}

export function decodeInlineFixtureParam(
  encodedFixture: string | null,
): LorcanaBrowserInlineFixture | undefined {
  if (!encodedFixture) {
    return undefined;
  }

  try {
    return JSON.parse(encodedFixture) as LorcanaBrowserInlineFixture;
  } catch {
    return undefined;
  }
}
