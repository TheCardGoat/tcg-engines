// TODO: Once the set is released, we organize the cards by set and type

import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whileYouHaveACharacterNamedThisCharGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const davidImpressiveSurfer: LorcanaCharacterCardDefinition = {
  id: "i5s",
  missingTestCase: true,
  name: "David",
  title: "Impressive Surfer",
  characteristics: ["storyborn", "ally"],
  text: "SHOWING OFF While you have a character named Nani in play, this character gets +2 {L}.",
  type: "character",
  abilities: [
    whileYouHaveACharacterNamedThisCharGets({
      name: "Showing Off",
      text: "While you have a character named Nani in play, this character gets +2 {L}.",
      characterName: "Nani",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 2,
          modifier: "add",
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Valentin Palombo",
  number: 8,
  set: "006",
  rarity: "uncommon",
};
