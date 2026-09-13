import { grandArchivePregameAdapter } from "./preparation.ts";
import { getGrandArchiveCard, grandArchiveCards } from "@tcg/grand-archive-cards";
import {
  assertGrandArchiveDeckConstruction,
  createGrandArchiveMatchInitialState,
  createGrandArchiveMatchProgram,
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
  type GrandArchiveDeckEntry,
  type GrandArchiveStandardPlayerSetup,
} from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";
import { registerGameAdapter } from "@tcg/shared/game-adapter";
import type {
  CardsMaps,
  DeckBuildInput,
  DeckCard,
  DeckFormatResult,
  GameAdapter,
} from "@tcg/shared/game-adapter";
import type { EngineSnapshot, ServerEngineCreateInput } from "@tcg/shared/game-engine";
import { grandArchiveDeckInterchangeAdapter } from "./deck-interchange.ts";
import { GrandArchiveServerEngine } from "./server-engine.ts";
import { parseGrandArchiveReplayJournal, type GrandArchiveReplayJournalV1 } from "./replay.ts";

const program = createGrandArchiveMatchProgram(grandArchiveCards);
const GRAND_ARCHIVE_DECK_SECTIONS = [
  "main",
  "material",
  "side",
  "sideboard",
  "starting-champion",
] as const;
type GrandArchiveDeckSection = (typeof GRAND_ARCHIVE_DECK_SECTIONS)[number];

function isGrandArchiveDeckSection(value: string): value is GrandArchiveDeckSection {
  return GRAND_ARCHIVE_DECK_SECTIONS.some((section) => section === value);
}

function canonicalId(id: string): string {
  return getGrandArchiveCard(id)?.canonicalId ?? id;
}

function seedNumber(seed: string): number {
  let result = 0x811c9dc5;
  for (const character of seed) {
    result ^= character.codePointAt(0) ?? 0;
    result = Math.imul(result, 0x01000193);
  }
  return result | 0;
}

function entries(ids: readonly string[]): GrandArchiveDeckEntry[] {
  const counts = new Map<string, number>();
  ids.forEach((id) => counts.set(canonicalId(id), (counts.get(canonicalId(id)) ?? 0) + 1));
  return [...counts].map(([definitionId, count]) => ({ definitionId, count }));
}

function defaultFace(definitionId: string) {
  const card = program.cardsById[definitionId];
  if (!card) throw new Error(`Unknown Grand Archive card: ${definitionId}`);
  return card.layout.kind === "single-faced" ? card.layout.face : card.layout.defaultFace;
}

function isGrandArchiveMaterialCard(definitionId: string): boolean {
  const face = defaultFace(definitionId);
  return face.typeLine.types.includes("CHAMPION") || face.typeLine.supertypes.includes("REGALIA");
}

function standardSetup(cardsMaps: CardsMaps, owner: string): GrandArchiveStandardPlayerSetup {
  const owned = cardsMaps.owners[owner];
  if (!owned) throw new Error(`Grand Archive player ${owner} has no deck instances`);
  const publicIds = (section: GrandArchiveDeckSection) =>
    owned.flatMap((instanceId) =>
      (cardsMaps.instanceSections?.[instanceId] ?? "main") === section &&
      cardsMaps.cardInstances[instanceId]
        ? [cardsMaps.cardInstances[instanceId]!]
        : [],
    );
  const hasSections = Boolean(cardsMaps.instanceSections);
  const allIds = owned
    .map((instanceId) => cardsMaps.cardInstances[instanceId])
    .filter((id): id is string => Boolean(id));
  const material = hasSections
    ? publicIds("material")
    : allIds.filter((id) => isGrandArchiveMaterialCard(canonicalId(id)));
  const main = hasSections ? publicIds("main") : allIds.filter((id) => !material.includes(id));
  const sideboard = hasSections ? [...publicIds("sideboard"), ...publicIds("side")] : [];
  const declaredChampion = cardsMaps.deckDeclarationsByOwnerId?.[owner]?.startingChampionId;
  const championCandidates = material.map(canonicalId).filter((id) => {
    const face = defaultFace(id);
    return face.typeLine.types.includes("CHAMPION") && face.stats.level === 0;
  });
  if (typeof declaredChampion === "string" && !championCandidates.includes(declaredChampion)) {
    throw new Error(
      `Grand Archive player ${owner} declared a starting champion that is not a registered level-0 Champion`,
    );
  }
  const champion = typeof declaredChampion === "string" ? declaredChampion : championCandidates[0];
  if (!champion)
    throw new Error(`Grand Archive player ${owner} needs one level-0 starting champion`);
  return {
    id: owner,
    name: owner,
    mainDeck: entries(main),
    materialDeck: entries(material),
    startingChampionDefinitionId: champion,
    ...(sideboard.length ? { sideboard: entries(sideboard) } : {}),
  };
}

async function createEngine(input: ServerEngineCreateInput): Promise<GrandArchiveServerEngine> {
  if (input.timeControl && input.timeControl.mode !== "none") {
    throw new Error("Grand Archive currently supports clockless matches only");
  }
  const randomSeed = seedNumber(input.seed);
  const firstPlayerId =
    input.firstTurnPlayerId ?? ((randomSeed >>> 0) % 2 === 0 ? input.player1Id : input.player2Id);
  const state = createGrandArchiveMatchInitialState(program, {
    mode: "standard",
    players: [
      standardSetup(input.cardsMaps, input.player1Id),
      standardSetup(input.cardsMaps, input.player2Id),
    ],
    firstPlayerId,
    randomSeed,
  });
  return new GrandArchiveServerEngine(program, new GrandArchiveMatchRuntime(program, state));
}

export const grandArchiveServerAdapter: GameAdapter = {
  slug: "grand-archive",
  pregame: grandArchivePregameAdapter,
  deckInterchange: grandArchiveDeckInterchangeAdapter,
  createGameId: () => `grand-archive-game-${crypto.randomUUID()}`,
  generateUserName: (id) => `player-${id.slice(0, 6)}`,
  buildCardInstances(decks: ReadonlyArray<DeckBuildInput>): CardsMaps {
    const cardInstances: Record<string, string> = {};
    const owners: Record<string, string[]> = {};
    const instanceSections: Record<string, string> = {};
    const deckDeclarationsByOwnerId: NonNullable<CardsMaps["deckDeclarationsByOwnerId"]> = {};
    let hasSections = false;
    for (const { owner, deck } of decks) {
      const owned: string[] = [];
      let ordinal = 0;
      for (const entry of deck) {
        for (let copy = 0; copy < entry.qty; copy += 1) {
          const instanceId = `${owner}-${canonicalId(entry.cardId)}-${ordinal++}`;
          cardInstances[instanceId] = entry.cardId;
          owned.push(instanceId);
          if (entry.sectionId && !isGrandArchiveDeckSection(entry.sectionId)) {
            throw new Error(`Unknown Grand Archive deck section: ${entry.sectionId}`);
          }
          if (entry.sectionId) {
            if (entry.sectionId === "starting-champion") {
              if (deckDeclarationsByOwnerId[owner])
                throw new Error("Only one starting Champion can be selected");
              deckDeclarationsByOwnerId[owner] = { startingChampionId: canonicalId(entry.cardId) };
            }
            instanceSections[instanceId] =
              entry.sectionId === "starting-champion" ? "material" : entry.sectionId;
            hasSections = true;
          }
        }
      }
      owners[owner] = owned;
    }
    return hasSections
      ? {
          cardInstances,
          owners,
          instanceSections,
          ...(Object.keys(deckDeclarationsByOwnerId).length ? { deckDeclarationsByOwnerId } : {}),
        }
      : { cardInstances, owners };
  },
  getCardById(publicId) {
    const card = getGrandArchiveCard(publicId);
    if (!card) return null;
    return {
      publicId,
      colors: card.elements,
      label: card.name,
      imageUrl: card.printings[0]?.imageUrl ?? null,
    };
  },
  getCanonicalCardId: (publicId) => getGrandArchiveCard(publicId)?.canonicalId ?? null,
  validateDeckForFormat(formatId: string, deck: ReadonlyArray<DeckCard>): DeckFormatResult {
    if (formatId !== "standard" && formatId !== "draft" && formatId !== "pantheon") {
      throw new Error(`Unknown Grand Archive format: ${formatId}`);
    }
    if (formatId === "pantheon") {
      return {
        formatId,
        label: "Pantheon",
        valid: false,
        rules: [
          {
            kind: "pantheon-setup",
            passed: false,
            message: "Pantheon deck validation requires boon and barrier setup slots.",
          },
        ],
      };
    }
    const unknownSection = deck.find(
      (entry) => entry.sectionId && !isGrandArchiveDeckSection(entry.sectionId),
    )?.sectionId;
    if (unknownSection) {
      return {
        formatId,
        label: formatId,
        valid: false,
        rules: [
          {
            kind: "deck-section",
            passed: false,
            message: `Unknown Grand Archive deck section: ${unknownSection}`,
          },
        ],
      };
    }
    const hasSections = deck.some((entry) => Boolean(entry.sectionId));
    const expanded = deck.flatMap((entry) =>
      Array.from({ length: entry.quantity }, () => ({
        id: canonicalId(entry.cardId),
        section: entry.sectionId,
      })),
    );
    const unknownCardIds = [
      ...new Set(expanded.flatMap(({ id }) => (program.cardsById[id] ? [] : [id]))),
    ];
    if (unknownCardIds.length > 0) {
      return {
        formatId,
        label: formatId,
        valid: false,
        rules: unknownCardIds.map((cardId) => ({
          kind: "known-card",
          passed: false,
          message: `Unknown Grand Archive card: ${cardId}`,
        })),
      };
    }
    const sectioned = expanded.map(({ id, section }) => ({
      id,
      section: section ?? (!hasSections && isGrandArchiveMaterialCard(id) ? "material" : "main"),
    }));
    const champion = sectioned.find(
      ({ id }) =>
        defaultFace(id).typeLine.types.includes("CHAMPION") && defaultFace(id).stats.level === 0,
    )?.id;
    if (!champion)
      return {
        formatId,
        label: formatId,
        valid: false,
        rules: [
          {
            kind: "starting-champion",
            passed: false,
            message: "A level-0 starting champion is required.",
          },
        ],
      };
    const setup = {
      id: "deck-validation",
      name: "deck-validation",
      mainDeck: entries(sectioned.filter(({ section }) => section === "main").map(({ id }) => id)),
      materialDeck: entries(
        sectioned.filter(({ section }) => section === "material").map(({ id }) => id),
      ),
      startingChampionDefinitionId: champion,
      sideboard: entries(
        sectioned
          .filter(({ section }) => section === "side" || section === "sideboard")
          .map(({ id }) => id),
      ),
    };
    try {
      assertGrandArchiveDeckConstruction(program, formatId, setup);
      return {
        formatId,
        label: formatId,
        valid: true,
        rules: [
          { kind: "grand-archive-deck", passed: true, message: `${formatId} deck is legal.` },
        ],
      };
    } catch (error) {
      return {
        formatId,
        label: formatId,
        valid: false,
        rules: [
          {
            kind: "grand-archive-deck",
            passed: false,
            message: error instanceof Error ? error.message : "Deck is illegal.",
          },
        ],
      };
    }
  },
  createServerEngine: createEngine,
  serializeEngine(engine, cardsMaps): EngineSnapshot {
    if (!(engine instanceof GrandArchiveServerEngine))
      throw new Error("Expected GrandArchiveServerEngine");
    return {
      gameSlug: "grand-archive",
      state: serializeGrandArchiveMatchSnapshot(engine.runtime.state),
      historyLength: engine.runtime.state.eventHistory.length,
      cardsMaps,
      metadata: {
        schemaVersion: 1,
        replayJournal: engine.replayJournal,
      } satisfies GrandArchiveAdapterMetadataV1,
    };
  },
  async restoreEngine(snapshot) {
    const state = restoreGrandArchiveMatchSnapshot(program, snapshot.state);
    const metadata = parseGrandArchiveAdapterMetadata(snapshot.metadata);
    const replayJournal = parseGrandArchiveReplayJournal(metadata.replayJournal, program);
    const journalStateVersion =
      replayJournal.commands.at(-1)?.resultingStateVersion ??
      replayJournal.initialSnapshot.stateVersion;
    if (journalStateVersion !== state.stateVersion) {
      throw new Error("Grand Archive replay journal does not describe the persisted snapshot");
    }
    return new GrandArchiveServerEngine(
      program,
      new GrandArchiveMatchRuntime(program, state),
      replayJournal,
    );
  },
  extractCardsMapsFromSnapshot(snapshot) {
    if (!snapshot.cardsMaps) throw new Error("Grand Archive snapshot is missing cardsMaps");
    return snapshot.cardsMaps;
  },
};

interface GrandArchiveAdapterMetadataV1 {
  readonly schemaVersion: 1;
  readonly replayJournal: GrandArchiveReplayJournalV1;
}

function parseGrandArchiveAdapterMetadata(value: unknown): GrandArchiveAdapterMetadataV1 {
  if (!value || typeof value !== "object") {
    throw new Error("Grand Archive adapter metadata is missing");
  }
  const candidate = value as Partial<GrandArchiveAdapterMetadataV1>;
  if (candidate.schemaVersion !== 1 || !candidate.replayJournal) {
    throw new Error("Grand Archive adapter metadata has an unsupported schema");
  }
  return candidate as GrandArchiveAdapterMetadataV1;
}

export function registerGrandArchiveServerAdapter(): void {
  registerGameAdapter(grandArchiveServerAdapter);
}
