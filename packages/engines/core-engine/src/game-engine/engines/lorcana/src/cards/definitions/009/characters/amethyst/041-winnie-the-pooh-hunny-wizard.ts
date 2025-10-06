import { winnieThePoohHunnyWizard as ogWinnieThePoohHunnyWizard } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/059-winnie-the-pooh-hunny-wizard";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const winnieThePoohHunnyWizard: LorcanitoCharacterCardDefinition = {
  ...ogWinnieThePoohHunnyWizard,
  id: "emh",
  reprints: [ogWinnieThePoohHunnyWizard.id],
  number: 41,
  set: "009",
};
