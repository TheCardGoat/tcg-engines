// TODO: Once the set is released, we organize the cards by set and type

import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { whenYouPlayMayDrawACard } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const genieWishFulfilled: LorcanaCharacterCardDefinition = {
  id: "xl7",
  missingTestCase: true,
  name: "Genie",
  title: "Wish Fulfilled",
  characteristics: ["dreamborn", "ally"],
  text: "Evasive (Only characters with Evasive can challenge this character.)\nWHAT COMES NEXT? When you play this character, draw a card.",
  type: "character",
  abilities: [
    evasiveAbility,
    {
      ...whenYouPlayMayDrawACard,
      name: "What Comes Next?",
      text: "When you play this character, you may draw a card.",
      optional: false,
    },
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  illustrator: "Veronica Di Lorenzo / Livio Cacciatore",
  number: 53,
  set: "006",
  rarity: "rare",
};
