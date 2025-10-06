import { cinderellaGentleAndKind as ogCinderellaGentleAndKind } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/003-cinderella-gentle-and-kind";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cinderellaGentleAndKind: LorcanaCharacterCardDefinition = {
  ...ogCinderellaGentleAndKind,
  id: "xks",
  reprints: [ogCinderellaGentleAndKind.id],
  number: 19,
  set: "009",
};
