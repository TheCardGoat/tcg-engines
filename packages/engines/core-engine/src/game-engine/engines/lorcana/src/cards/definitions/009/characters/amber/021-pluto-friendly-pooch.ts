import { plutoFriendlyPooch as ogPlutoFriendlyPooch } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const plutoFriendlyPooch: LorcanaCharacterCardDefinition = {
  ...ogPlutoFriendlyPooch,
  id: "gm9",
  reprints: [ogPlutoFriendlyPooch.id],
  number: 21,
  set: "009",
};
