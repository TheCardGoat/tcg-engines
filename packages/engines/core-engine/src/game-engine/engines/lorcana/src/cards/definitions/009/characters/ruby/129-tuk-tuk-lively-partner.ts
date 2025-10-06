import { tukTukLivelyPartner as ogTukTukLivelyPartner } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/127-tuk-tuk-lively-partner";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tukTukLivelyPartner: LorcanaCharacterCardDefinition = {
  ...ogTukTukLivelyPartner,
  id: "lts", // New ID for this card
  reprints: [ogTukTukLivelyPartner.id],
  number: 129,
  set: "009",
};
