import { pilferAndPlunderAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const petePirateScoundrel: LorcanaCharacterCardDefinition = {
  id: "h8f",
  name: "Pete",
  title: "Pirate Scoundrel",
  characteristics: ["storyborn", "villain", "pirate"],
  text: "PILFER AND PLUNDER Whenever you play an action that isn’t a song, you may banish chosen item.",
  type: "character",
  abilities: [pilferAndPlunderAbility],
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  strength: 1,
  willpower: 2,
  illustrator: "Serena Malyon",
  number: 89,
  set: "007",
  rarity: "common",
  lore: 1,
};
