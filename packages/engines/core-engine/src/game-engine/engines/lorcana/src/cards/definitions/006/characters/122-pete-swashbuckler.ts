// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const peteSwashbuckler: LorcanitoCharacterCardDefinition = {
  id: "j56",
  name: "Pete",
  title: "Freebooter",
  characteristics: ["dreamborn", "villain", "pirate"],
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 5,
  willpower: 2,
  lore: 1,
  illustrator: "Celeste Jimneck / Mariana Moreno",
  number: 122,
  set: "006",
  rarity: "rare",
};
