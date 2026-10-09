import { createRiftboundCatalogIndex } from "@tcg/riftbound-cards";
import {
  inspectRiftboundDeckRegistration,
  partitionRiftboundDeckEntries,
} from "@tcg/riftbound-decks";
import type {
  CardsMaps,
  DeckBuildInput,
  DeckCard,
  DeckFormatResult,
  GameAdapter,
} from "@tcg/shared/game-adapter";
import type { RiftboundCatalog } from "@tcg/riftbound-types";
import { riftboundDeckInterchangeAdapter } from "./deck-interchange";
import { hostedUndoProposalPolicy } from "@tcg/shared/game-adapter";
import {
  createRiftboundServerEngine,
  extractRiftboundCardsMaps,
  restoreRiftboundServerEngine,
  riftboundSnapshotFromClientAuthorityState,
  serializeRiftboundServerEngine,
} from "./engine";
import type { RiftboundClientCardDefinitionV1 } from "@tcg/riftbound-tabletop";

export { riftboundDeckInterchangeAdapter } from "./deck-interchange";

export function createRiftboundGameAdapter(catalog: RiftboundCatalog): GameAdapter {
  const index = createRiftboundCatalogIndex(catalog);
  const cardPublicId = (cardId: string) => index.getCard(cardId)?.canonicalId ?? cardId;
  const cardDefinitions = (cardsMaps: CardsMaps): Record<string, RiftboundClientCardDefinitionV1> =>
    Object.fromEntries(Object.values(cardsMaps.cardInstances).flatMap((publicId) => {
      const card = index.getCard(publicId);
      if (!card) throw new Error(`Unknown Riftbound card: ${publicId}`);
      return [[publicId, { name: card.name, cardType: card.cardType,
        domains: [...card.domains],
        imageUrl: card.printings.find((printing) => printing.id === publicId)?.imageUrl ??
          card.printings[0]?.imageUrl }]];
    }));

  return {
    slug: "riftbound",
    proposalPolicy: hostedUndoProposalPolicy,
    deckInterchange: riftboundDeckInterchangeAdapter,
    createServerEngine: async (input) => createRiftboundServerEngine(input, cardDefinitions(input.cardsMaps)),
    serializeEngine: serializeRiftboundServerEngine,
    restoreEngine: restoreRiftboundServerEngine,
    extractCardsMapsFromSnapshot: extractRiftboundCardsMaps,
    adoptClientAuthoritySnapshot: async (input) => {
      if (input.serializedState == null) {
        if (!input.cardsMaps) return null;
        const engine = createRiftboundServerEngine({
          gameSlug: "riftbound",
          seed: input.seed,
          player1Id: input.player1Id,
          player2Id: input.player2Id,
          cardsMaps: input.cardsMaps,
        }, cardDefinitions(input.cardsMaps));
        return serializeRiftboundServerEngine(engine, input.cardsMaps);
      }
      return riftboundSnapshotFromClientAuthorityState(
        input.serializedState,
        input.storedVersion,
        { player1Id: input.player1Id, player2Id: input.player2Id },
        input.cardsMaps,
      );
    },

    createGameId: () => `riftbound-game-${crypto.randomUUID()}`,

    generateUserName: (gameProfileId) => `player-${gameProfileId.slice(0, 6)}`,

    buildCardInstances(decks: ReadonlyArray<DeckBuildInput>): CardsMaps {
      const cardInstances: Record<string, string> = {};
      const owners: Record<string, string[]> = {};
      const instanceSections: Record<string, string> = {};
      let hasSections = false;
      for (const { owner, deck } of decks) {
        const instances: string[] = [];
        let ordinal = 0;
        for (const entry of deck) {
          for (let copy = 0; copy < entry.qty; copy += 1) {
            const instanceId = `${owner}-instance-${ordinal++}`;
            cardInstances[instanceId] = entry.cardId;
            instances.push(instanceId);
            if (entry.sectionId) {
              instanceSections[instanceId] = entry.sectionId;
              hasSections = true;
            }
          }
        }
        owners[owner] = instances;
      }
      return hasSections ? { cardInstances, owners, instanceSections } : { cardInstances, owners };
    },

    getCardById(publicId) {
      const card = index.getCard(publicId);
      return card
        ? {
            publicId,
            colors: card.domains,
            label: card.name,
            imageUrl:
              card.printings.find((printing) => printing.id === publicId)?.imageUrl ??
              card.printings[0]?.imageUrl,
          }
        : null;
    },

    getCanonicalCardId: (publicId) => index.getCard(publicId)?.canonicalId ?? null,

    validateDeckForFormat(
      formatId: string,
      deck: ReadonlyArray<DeckCard>,
      context,
    ): DeckFormatResult {
      if (formatId !== "standard") throw new Error(`Unknown Riftbound format: ${formatId}`);
      const entries = deck.map(({ cardId, quantity, sectionId }) => ({
        canonicalId: cardPublicId(cardId),
        printingId: cardId,
        quantity,
        sectionId,
      }));
      const boards = partitionRiftboundDeckEntries(
        {
          mainboard: entries.filter((entry) => entry.sectionId !== "side"),
          sideboard: entries.filter((entry) => entry.sectionId === "side"),
        },
        catalog,
      );
      const chosenChampionId = context?.declarations?.chosenChampionId;
      const issues = inspectRiftboundDeckRegistration(
        boards,
        typeof chosenChampionId === "string" ? chosenChampionId : null,
        catalog,
      );
      return {
        formatId,
        label: "Standard",
        valid: issues.length === 0,
        rules:
          issues.length === 0
            ? [
                {
                  kind: "riftbound-deck",
                  passed: true,
                  message: "Deck satisfies Riftbound structure",
                },
              ]
            : issues.map((issue) => ({
                kind: issue.code.toLowerCase(),
                passed: false,
                message: issue.message,
              })),
      };
    },
  };
}
