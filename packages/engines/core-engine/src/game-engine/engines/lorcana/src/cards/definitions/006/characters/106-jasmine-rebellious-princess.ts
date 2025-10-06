// TODO: Once the set is released, we organize the cards by set and type

import { eachOpponentLosesLore } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jasmineRebelliousPrincess: LorcanaCharacterCardDefinition = {
  id: "rf3",
  missingTestCase: true,
  name: "Jasmine",
  title: "Rebellious Princess",
  characteristics: ["storyborn", "hero", "princess"],
  text: "YOU'LL NEVER MISS IT Whenever this character quests, each opponent loses 1 lore.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "You'll Never Miss It",
      text: "Whenever this character quests, each opponent loses 1 lore.",
      effects: [eachOpponentLosesLore(1)],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Malia Ewart",
  number: 106,
  set: "006",
  rarity: "uncommon",
};
