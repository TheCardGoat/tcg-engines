import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const olafFriendlySnowman: LorcanaCharacterCardDefinition = {
  id: "cul",
  reprints: ["q9w"],
  name: "Olaf",
  title: "Friendly Snowman",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour: '"I\'m Olaf and I like warm hugs!"',
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Giulia Riva",
  number: 52,
  set: "TFC",
  rarity: "uncommon",
};
