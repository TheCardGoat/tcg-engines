// TODO: Once the set is released, we organize the cards by set and type

import { youPayXLessToPlayNextItemThisTurn } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { chosenItemOfYours } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const yokaiEnigmaticInventor: LorcanaCharacterCardDefinition = {
  id: "tel",
  name: "Yokai",
  title: "Enigmatic Inventor",
  characteristics: ["storyborn", "villain", "inventor"],
  text: "TIME TO UPGRADE Whenever this character quests, you may return one of your items to your hand to pay 2 {I} less for the next item you play this turn.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Time To Upgrade",
      text: "Whenever this character quests, you may return one of your items to your hand to pay 2 {S} less for the next item you play this turn.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "hand",
          target: chosenItemOfYours,
        },
        youPayXLessToPlayNextItemThisTurn(2),
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Juan Diego Leon",
  number: 143,
  set: "006",
  rarity: "uncommon",
};
