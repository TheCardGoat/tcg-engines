import { createRecordCardCatalog, createRecordCardInstanceRegistry, type ZoneConfig } from "#core";
import { CANONICAL_PLAYER_ONE, CANONICAL_PLAYER_TWO } from "#core/testing";
import type { LorcanaCard } from "@tcg/lorcana-types";
import type { LorcanaG } from "../types";
import type { TestFixtureCardState, TestInitialState } from "./index";
import { lorcanaRuntimeZones } from "../zones";
import type { LorcanaZoneId } from "../zones";

type FixtureZoneName = "deck" | "hand" | "play" | "inkwell" | "discard";
type InternalFixtureZoneName = FixtureZoneName | "limbo";

const TEST_INITIAL_STATE_KEYS = new Set<keyof TestInitialState>([
  "deck",
  "hand",
  "play",
  "inkwell",
  "discard",
  "lore",
]);

export type CanonicalPlayerId = typeof CANONICAL_PLAYER_ONE | typeof CANONICAL_PLAYER_TWO;

export type FixtureSeedBundle = {
  zoneCardsByKey: Record<string, string[]>;
  cardDefinitionsByInstanceId: Record<string, LorcanaCard>;
  ownerByInstanceId: Record<string, CanonicalPlayerId>;
  fixtureStateByInstanceId: Record<
    string,
    Omit<TestFixtureCardState, "card" | "cardsUnder"> & { cardsUnder?: string[] }
  >;
  staticResources: {
    cards: ReturnType<typeof createRecordCardCatalog>;
    instances: ReturnType<typeof createRecordCardInstanceRegistry>;
    zoneDefinitions: Record<LorcanaZoneId, ZoneConfig>;
  };
};

type MaterializedFixtureEntry = {
  definition: LorcanaCard;
  state?: Omit<TestFixtureCardState, "card" | "cardsUnder"> & { cardsUnder?: unknown[] };
};

export function isTestInitialState(value: unknown): value is TestInitialState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const keys = Object.keys(value);
  if (keys.length === 0) {
    return false;
  }

  return keys.some((key) => TEST_INITIAL_STATE_KEYS.has(key as keyof TestInitialState));
}

export function normalizePlayerId(playerId: string): CanonicalPlayerId | undefined {
  if (playerId === CANONICAL_PLAYER_ONE || playerId === "p1") {
    return CANONICAL_PLAYER_ONE;
  }
  if (playerId === CANONICAL_PLAYER_TWO || playerId === "p2") {
    return CANONICAL_PLAYER_TWO;
  }
  return undefined;
}

export function detectWinnerByLore(
  lore: LorcanaG["lore"],
  loreToWin?: LorcanaG["loreToWin"],
): string | undefined {
  for (const [playerId, amount] of Object.entries(lore)) {
    const threshold = (loreToWin as Record<string, number> | undefined)?.[playerId] ?? 20;
    if ((amount ?? 0) >= threshold) {
      return playerId;
    }
  }
  return undefined;
}

export function createInitialCardMeta(
  zoneKey: string,
  definition?: LorcanaCard,
  overrides?: { isDrying?: boolean; publicFaceState?: "faceUp" | "faceDown" },
): Record<string, unknown> {
  const meta: Record<string, unknown> = {
    damage: 0,
    state: "ready",
  };

  if (zoneKey.startsWith("play:")) {
    meta.isDrying = overrides?.isDrying ?? false;
  }

  if (zoneKey.startsWith("inkwell:")) {
    meta.publicFaceState = overrides?.publicFaceState ?? "faceDown";
  }

  if (definition && isLikelyCharacterOrLocation(definition)) {
    meta.state = "ready";
  }

  return meta;
}

export function buildFixtureSeedBundle(
  playerOneState: TestInitialState,
  playerTwoState: TestInitialState,
): FixtureSeedBundle {
  const definitions: Record<string, LorcanaCard> = {};
  const records: Record<string, { instanceId: string; definitionId: string; ownerID: string }> = {};
  const zoneCardsByKey: Record<string, string[]> = {};
  const cardDefinitionsByInstanceId: Record<string, LorcanaCard> = {};
  const ownerByInstanceId: Record<string, CanonicalPlayerId> = {};
  const fixtureStateByInstanceId: FixtureSeedBundle["fixtureStateByInstanceId"] = {};

  let seq = 1;
  let placeholderSeq = 1;
  const nextInstanceId = () => `t${String(seq++).padStart(6, "0")}`;

  const registerCard = (
    playerId: CanonicalPlayerId,
    zoneKey: string,
    definition: LorcanaCard,
  ): string => {
    const instanceId = nextInstanceId();
    const definitionId = (definition as unknown as { id: string }).id;
    definitions[definitionId] = definition;
    records[instanceId] = {
      instanceId,
      definitionId,
      ownerID: playerId,
    };
    cardDefinitionsByInstanceId[instanceId] = definition;
    ownerByInstanceId[instanceId] = playerId;
    zoneCardsByKey[zoneKey] ??= [];
    zoneCardsByKey[zoneKey].push(instanceId);
    return instanceId;
  };

  const ingestPlayer = (playerId: CanonicalPlayerId, state: TestInitialState) => {
    const zones: Record<FixtureZoneName, number | unknown[] | undefined> = {
      deck: state.deck,
      hand: state.hand,
      play: state.play,
      inkwell: state.inkwell,
      discard: state.discard,
    };

    for (const [zoneName, zoneValue] of Object.entries(zones) as Array<
      [FixtureZoneName, number | unknown[] | undefined]
    >) {
      const zoneKey = `${zoneName}:${playerId}`;
      zoneCardsByKey[zoneKey] = [];
      const entries = materializeZoneDefinitions(
        zoneName,
        playerId,
        zoneValue,
        () => placeholderSeq++,
      );
      for (const entry of entries) {
        const instanceId = registerCard(playerId, zoneKey, entry.definition);
        if (entry.state) {
          const { cardsUnder: _cardsUnder, ...stateWithoutCardsUnder } = entry.state;
          fixtureStateByInstanceId[instanceId] = {
            ...stateWithoutCardsUnder,
          };
        }

        const cardsUnder = entry.state?.cardsUnder;
        if (!Array.isArray(cardsUnder) || cardsUnder.length === 0) {
          continue;
        }

        const limboKey = `limbo:${playerId}`;
        zoneCardsByKey[limboKey] ??= [];
        const underInstanceIds = cardsUnder.map((underEntry) => {
          const { definition: underDefinition, publicFaceState: underFaceState } =
            coerceFixtureCardUnderEntry(underEntry, zoneName, playerId);
          const underInstanceId = registerCard(playerId, limboKey, underDefinition);
          if (underFaceState) {
            fixtureStateByInstanceId[underInstanceId] = {
              ...fixtureStateByInstanceId[underInstanceId],
              publicFaceState: underFaceState,
            };
          }
          return underInstanceId;
        });
        fixtureStateByInstanceId[instanceId] = {
          ...fixtureStateByInstanceId[instanceId],
          cardsUnder: underInstanceIds,
        };
      }
    }
  };

  ingestPlayer(CANONICAL_PLAYER_ONE, playerOneState);
  ingestPlayer(CANONICAL_PLAYER_TWO, playerTwoState);

  return {
    zoneCardsByKey,
    cardDefinitionsByInstanceId,
    ownerByInstanceId,
    fixtureStateByInstanceId,
    staticResources: {
      cards: createRecordCardCatalog("lorcana:test-fixture", definitions),
      instances: createRecordCardInstanceRegistry("lorcana:test-fixture", records),
      zoneDefinitions: lorcanaRuntimeZones,
    },
  };
}

function isLikelyCharacterOrLocation(card: LorcanaCard): boolean {
  const cardType = (card as unknown as { cardType?: string }).cardType;
  return cardType === "character" || cardType === "location";
}

function materializeZoneDefinitions(
  zoneName: FixtureZoneName,
  playerId: CanonicalPlayerId,
  zoneValue: number | unknown[] | undefined,
  nextPlaceholderSeq: () => number,
): MaterializedFixtureEntry[] {
  if (typeof zoneValue === "number") {
    const count = Math.max(0, Math.floor(zoneValue));
    return Array.from({ length: count }, () => ({
      definition: createPlaceholderCard(zoneName, playerId, nextPlaceholderSeq()),
    }));
  }

  if (!Array.isArray(zoneValue)) {
    return [];
  }

  return zoneValue.map((entry, index) => {
    if (isFixtureCardState(entry)) {
      return {
        definition: coerceFixtureCardDefinition(
          entry.card,
          zoneName,
          playerId,
          index,
          nextPlaceholderSeq,
        ),
        state: {
          exerted: entry.exerted,
          damage: entry.damage,
          lore: entry.lore,
          cardsUnder: entry.cardsUnder,
          atLocation: entry.atLocation,
          isDrying: entry.isDrying,
          publicFaceState: entry.publicFaceState,
        },
      };
    }

    if (entry && typeof entry === "object" && "id" in entry) {
      return { definition: entry as LorcanaCard };
    }
    return {
      definition: createPlaceholderCard(zoneName, playerId, nextPlaceholderSeq(), index),
    };
  });
}

function isFixtureCardState(value: unknown): value is TestFixtureCardState {
  return Boolean(
    value && typeof value === "object" && "card" in (value as Record<string, unknown>),
  );
}

function coerceFixtureCardUnderEntry(
  entry: unknown,
  zoneName: InternalFixtureZoneName,
  playerId: CanonicalPlayerId,
): { definition: LorcanaCard; publicFaceState?: "faceUp" | "faceDown" } {
  if (
    entry &&
    typeof entry === "object" &&
    "card" in (entry as Record<string, unknown>) &&
    !("id" in (entry as Record<string, unknown>))
  ) {
    const typed = entry as { card: unknown; publicFaceState?: "faceUp" | "faceDown" };
    return {
      definition: coerceFixtureCardDefinition(typed.card, zoneName, playerId),
      publicFaceState: typed.publicFaceState,
    };
  }
  return { definition: coerceFixtureCardDefinition(entry, zoneName, playerId) };
}

function coerceFixtureCardDefinition(
  entry: unknown,
  zoneName: InternalFixtureZoneName,
  playerId: CanonicalPlayerId,
  index = 0,
  nextPlaceholderSeq: (() => number) | undefined = undefined,
): LorcanaCard {
  if (entry && typeof entry === "object" && "id" in entry) {
    return entry as LorcanaCard;
  }

  return createPlaceholderCard(
    zoneName === "limbo" ? "play" : zoneName,
    playerId,
    nextPlaceholderSeq ? nextPlaceholderSeq() : index + 1,
    index,
  );
}

function createPlaceholderCard(
  zoneName: FixtureZoneName,
  playerId: CanonicalPlayerId,
  seq: number,
  index = 0,
): LorcanaCard {
  return {
    id: `placeholder:${playerId}:${zoneName}:${seq}:${index}`,
    name: `Placeholder ${zoneName} ${seq}`,
    inkable: true,
    cardType: "item",
    cost: 0,
  } as unknown as LorcanaCard;
}
