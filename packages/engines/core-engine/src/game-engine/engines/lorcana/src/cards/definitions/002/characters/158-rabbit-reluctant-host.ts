import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rabbitReluctantHost: LorcanaCharacterCardDefinition = {
  id: "a8d",

  name: "Rabbit",
  title: "Reluctant Host",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour:
    "Pooh: Isn't there anybody here at all? \nRabbit: Nobody! \nPooh: Somebody's there . . . because somebody must have said 'Nobody.'",
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  strength: 4,
  willpower: 6,
  lore: 2,
  illustrator: "Giulia Riva",
  number: 158,
  set: "ROF",
  rarity: "common",
};
