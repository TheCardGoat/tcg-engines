import { kuzcoTemperamentalEmperor as ogKuzcoTemperamentalEmperor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/084-kuzco-temperamental-emperor";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kuzcoTemperamentalEmperor: LorcanaCharacterCardDefinition = {
  ...ogKuzcoTemperamentalEmperor,
  id: "l2r",
  reprints: [ogKuzcoTemperamentalEmperor.id],
  number: 69,
  set: "009",
};
