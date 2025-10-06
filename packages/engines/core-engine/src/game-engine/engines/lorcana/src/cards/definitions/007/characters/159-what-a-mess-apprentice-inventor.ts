import { itemsYouControl } from "@lorcanito/lorcana-engine/abilities/target";
import type { MetaAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const whatAMess: MetaAbility = {
  type: "static",
  ability: "meta",
  name: "WHAT A MESS",
  text: "During your turn, you may banish chosen item of yours to play this character for free.",
  alternativeCosts: [
    {
      type: "card",
      action: "banish",
      amount: 1,
      filters: itemsYouControl,
    },
  ],
};

export const belleApprenticeInventor: LorcanaCharacterCardDefinition = {
  id: "i9g",
  name: "Belle",
  title: "Apprentice Inventor",
  characteristics: ["storyborn", "hero", "princess", "inventor"],
  text: "WHAT A MESS During your turn, you may banish chosen item of yours to play this character for free.",
  type: "character",
  abilities: [whatAMess],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 3,
  willpower: 3,
  illustrator: "Jochem van Gool",
  number: 159,
  set: "007",
  rarity: "common",
  lore: 1,
};
