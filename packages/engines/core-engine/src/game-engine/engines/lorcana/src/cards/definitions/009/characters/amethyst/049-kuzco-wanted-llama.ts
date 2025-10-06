import { kuzcoWantedLlama as ogKuzcoWantedLlama } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/045-kuzco-wanted-llama";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kuzcoWantedLlama: LorcanitoCharacterCardDefinition = {
  ...ogKuzcoWantedLlama,
  id: "q3b",
  reprints: [ogKuzcoWantedLlama.id],
  number: 49,
  set: "009",
};
