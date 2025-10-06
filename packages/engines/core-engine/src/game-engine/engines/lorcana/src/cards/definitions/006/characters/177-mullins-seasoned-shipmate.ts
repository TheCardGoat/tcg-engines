// TODO: Once the set is released, we organize the cards by set and type

import { whileYouHaveACharacterNamedThisCharGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mullinsSeasonedShipmate: LorcanitoCharacterCardDefinition = {
  id: "k41",
  name: "Mullins",
  title: "Seasoned Shipmate",
  characteristics: ["storyborn", "ally", "pirate"],
  text: "FALL IN LINE While you have a character named Mr. Smee in play, this character gains Resist +1. (Damage dealt to them is reduced by 1.)",
  type: "character",
  abilities: [
    whileYouHaveACharacterNamedThisCharGains({
      name: "Fall in Line",
      text: "While you have a character named Mr. Smee in play, this character gains Resist +1. (Damage dealt to them is reduced by 1.)",
      characterName: "Mr. Smee",
      ability: resistAbility(1),
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 6,
  willpower: 4,
  lore: 1,
  illustrator: "Federico Maria Cugliari",
  number: 177,
  set: "006",
  rarity: "common",
};
