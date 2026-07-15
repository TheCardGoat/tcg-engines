import { allCardsById } from "../cards/catalog-data";

type CardPublicId = string;
type CardInstanceId = string;
type OwnerId = string;
type Deck = Array<{ cardId: CardPublicId; qty: number; cardName?: string }>;

const upperLimit = 1296;

// We'd like to create a short-id for cards, they must be random to prevent cheating.
// They MUST also be unique, so we're running a loop to ensure that collisions get a chance to generate unique ids.
export function fromDeckToCardInstances(input: Array<{ deck: Deck; owner: string }>): {
  cardInstances: Record<CardInstanceId, CardPublicId>;
  owners: Record<OwnerId, CardInstanceId[]>;
} {
  const cardInstances: Record<CardInstanceId, CardPublicId> = {};
  const owners: Record<OwnerId, CardInstanceId[]> = {};

  const instanceIds = new Set<CardInstanceId>();

  function generateInstanceId(depth: number = 0): CardInstanceId {
    if (depth >= upperLimit) {
      throw new Error(`Exceeded instance id limit of ${upperLimit}`);
    }

    const id = Math.floor(Math.random() * 36 ** 2)
      .toString(36)
      .padStart(2, "0")
      .toLowerCase()
      .trim();

    if (!instanceIds.has(id)) {
      instanceIds.add(id);
      return id;
    }

    return generateInstanceId(depth + 1);
  }

  input.forEach(({ deck, owner }) => {
    if (!owners[owner]) {
      owners[owner] = [];
    }

    deck.forEach(({ cardId, qty, cardName }) => {
      const card = allCardsById[cardId];
      if (!card) {
        throw new Error(`Card ${cardName ?? ""} PublicId ${cardId} not found`);
      }

      for (let i = 0; i < qty; i++) {
        const instanceId = generateInstanceId();

        cardInstances[instanceId] = cardId;
        owners[owner].push(instanceId);
      }
    });
  });

  return { cardInstances, owners };
}
