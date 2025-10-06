// TODO: Once the set is released, we organize the cards by set and type

import { whenPlayAndWheneverQuests } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const baymaxArmoredCompanion: LorcanaCharacterCardDefinition = {
  id: "hmt",
  name: "Baymax",
  title: "Armored Companion",
  characteristics: ["hero", "storyborn", "robot"],
  text: "**THE TREATMENT IS WORKING** When you play this character and whenever he quests, you may remove up to 2 damage from another chosen character of yours. Gain 1 lore for each 1 damage removed this way.",
  type: "character",
  abilities: whenPlayAndWheneverQuests({
    name: "The Treatment is Working",
    text: "When you play this character and whenever he quests, you may remove up to 2 damage from another chosen character of yours. Gain 1 lore for each 1 damage removed this way.",
    optional: true,
    effects: [
      {
        type: "heal",
        amount: 2,
        subEffect: youGainLore(1), //FIXME: Should be equal to healed damage
        target: {
          type: "card",
          value: 1,
          excludeSelf: true,
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
          ],
        },
      },
    ],
  }),
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 2,
  illustrator: "Brianna Garcia",
  number: 157,
  set: "006",
  rarity: "legendary",
};
