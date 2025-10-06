// TODO: Once the set is released, we organize the cards by set and type

import { whileYouHaveACharacterNamedThisCharGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const chipRangerLeader: LorcanaCharacterCardDefinition = {
  id: "q8j",
  name: "Chip",
  title: "Ranger Leader",
  characteristics: ["hero", "storyborn"],
  text: "**THE VALUE OF FRIENDSHIP** While you have a character named Dale in play, this character gains **Support**. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
  type: "character",
  abilities: [
    whileYouHaveACharacterNamedThisCharGains({
      name: "THE VALUE OF FRIENDSHIP",
      text: "While you have a character named Dale in play, this character gains **Support**. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
      ability: supportAbility,
      characterName: "Dale",
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "French Carlomagno",
  number: 12,
  set: "006",
  rarity: "uncommon",
};
