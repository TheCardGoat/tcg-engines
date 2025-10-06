import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kristoff: LorcanaCharacterCardDefinition = {
  id: "gpq",

  name: "Kristoff",
  title: "Official Ice Master",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour:
    'Kristoff: "You want to talk about a supply and demand problem? I sell ice for a living."<br /> Anna: "Ooh, that\'s a rough business to be in right now. I mean, that is really - ah, mm. That\'s unfortunate."',
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Ron Baird",
  number: 182,
  set: "TFC",
  rarity: "common",
};
