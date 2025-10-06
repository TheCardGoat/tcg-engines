// TODO: Once the set is released, we organize the cards by set and type

import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kakamoraBoardingParty: LorcanaCharacterCardDefinition = {
  id: "mbl",
  name: "Kakamora",
  title: "Boarding Party",
  characteristics: ["storyborn", "pirate"],
  text: "**Rush** _(This character can challenge the turn they're played.)_",
  type: "character",
  abilities: [rushAbility],
  flavour: "Moana: Do you think they saw us? \nMaui: They saw us.",
  colors: ["ruby"],
  cost: 4,
  strength: 5,
  willpower: 2,
  lore: 1,
  illustrator: "Saulo Nate",
  number: 104,
  set: "006",
  rarity: "uncommon",
};
