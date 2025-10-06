import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const johnSilverTerrorOfTheRealm: LorcanaCharacterCardDefinition = {
  id: "he7",
  name: "John Silver",
  title: "Terror of the Realm",
  characteristics: ["dreamborn", "alien", "villain", "pirate", "captain"],
  type: "character",
  flavour:
    "There are strange things on the edge of the map: sea witches, entangled glimmers, and so on. I ll stick with my ship, thank you very much.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 8,
  strength: 8,
  willpower: 8,
  lore: 3,
  illustrator: "Leonardo Giammichele",
  number: 148,
  set: "URR",
  rarity: "rare",
};
