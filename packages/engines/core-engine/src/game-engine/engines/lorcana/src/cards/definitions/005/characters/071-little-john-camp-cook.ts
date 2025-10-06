import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const littleJohnCampCook: LorcanitoCharacterCardDefinition = {
  id: "olq",
  name: "Little John",
  title: "Camp Cook",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour:
    "You're in for a real treat, Rob. Tonight's house special is my famous outlaw grub. Made from the finest whatever we could find!",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  willpower: 4,
  strength: 0,
  lore: 1,
  illustrator: "John Loren",
  number: 71,
  set: "SSK",
  rarity: "uncommon",
};
