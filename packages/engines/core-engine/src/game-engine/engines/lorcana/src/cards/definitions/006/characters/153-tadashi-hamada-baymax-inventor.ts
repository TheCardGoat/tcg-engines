// TODO: Once the set is released, we organize the cards by set and type

import { forEachItemYouHaveInPlay } from "~/game-engine/engines/lorcana/src/abilities/amounts";
import { propertyStaticAbilities } from "~/game-engine/engines/lorcana/src/abilities/propertyStaticAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tadashiHamadaBaymaxInventor: LorcanaCharacterCardDefinition = {
  id: "vot",
  name: "Tadashi Hamada",
  title: "Baymax Inventor",
  characteristics: ["storyborn", "mentor", "inventor"],
  text: "LET'S GET BACK TO WORK This character gets +1 {S} and +1 {W} for each item you have in play.",
  type: "character",
  abilities: [
    propertyStaticAbilities({
      name: "Let's Get Back To Work",
      text: "This character gets +1 {S} and +1 {W} for each item you have in play.",
      attribute: "strength",
      amount: forEachItemYouHaveInPlay,
    }),
    propertyStaticAbilities({
      name: "Let's Get Back To Work",
      text: "This character gets +1 {S} and +1 {W} for each item you have in play.",
      attribute: "willpower",
      amount: forEachItemYouHaveInPlay,
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 6,
  strength: 3,
  willpower: 3,
  lore: 3,
  illustrator: "Jeanne Ploumevez",
  number: 153,
  set: "006",
  rarity: "super_rare",
};
