// TODO: Once the set is released, we organize the cards by set and type

import { chosenCharacterOfYours } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kangaNurturingMother: LorcanaCharacterCardDefinition = {
  id: "blu",
  missingTestCase: true,
  name: "Kanga",
  title: "Nurturing Mother",
  characteristics: ["storyborn", "ally"],
  text: "SAFE AND SOUND Whenever this character quests, choose a character of yours and that character can't be challenged until the start of your next turn.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Safe and Sound",
      text: "Whenever this character quests, choose a character of yours and that character can't be challenged until the start of your next turn.",
      effects: [
        {
          type: "restriction",
          restriction: "be-challenged",
          target: chosenCharacterOfYours,
          duration: "next_turn",
          until: true,
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["amber"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Gianluca Barone",
  number: 21,
  set: "006",
  rarity: "rare",
};
