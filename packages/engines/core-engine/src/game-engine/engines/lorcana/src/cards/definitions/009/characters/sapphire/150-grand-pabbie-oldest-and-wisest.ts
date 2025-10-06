import { grandPabbieOldestAndWisest as grandPabbieOldestAndWisestAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/148-grand-pabbie-oldest-and-wisest";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const grandPabbieOldestAndWisest: LorcanitoCharacterCardDefinition = {
  ...grandPabbieOldestAndWisestAsOrig,
  id: "rj4",
  reprints: [grandPabbieOldestAndWisestAsOrig.id],
  number: 150,
  set: "009",
};
