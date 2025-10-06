// TODO: Once the set is released, we organize the cards by set and type

import {
  dealDamageEffect,
  readyAndCantQuest,
} from "@lorcanito/lorcana-engine/effects/effects";
import { anotherChosenCharOfYours } from "~/game-engine/engines/lorcana/src/abilities/target";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const johnSilverDangerousFriend: LorcanaCharacterCardDefinition = {
  id: "o9c",
  missingTestCase: true,
  name: "John Silver",
  title: "Ferocious Friend",
  characteristics: ["storyborn", "villain", "alien", "pirate", "captain"],
  text: "YOU HAVE TO CHART YOUR OWN COURSE Whenever this character quests, you may deal 1 damage to one of your other characters. If you do, ready that character. They cannot quest this turn.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "You Have To Chart Your Own Course",
      text: "Whenever this character quests, you may deal 1 damage to one of your other characters. If you do, ready that character. They cannot quest this turn.",
      optional: true,
      effects: [
        dealDamageEffect(1, anotherChosenCharOfYours),
        ...readyAndCantQuest(anotherChosenCharOfYours),
      ],
    }),
  ],
  inkwell: false,
  colors: ["ruby"],
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  illustrator: "César Vergara",
  number: 109,
  set: "006",
  rarity: "uncommon",
};
