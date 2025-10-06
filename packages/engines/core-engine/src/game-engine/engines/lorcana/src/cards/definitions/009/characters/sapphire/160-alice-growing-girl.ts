import { aliceGrowingGirl as ogAliceGrowingGirl } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/137-alice-growing-girl";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aliceGrowingGirl: LorcanitoCharacterCardDefinition = {
  ...ogAliceGrowingGirl,
  id: "rtw", // New ID for this card
  reprints: [ogAliceGrowingGirl.id],
  number: 160,
  set: "009",
};
