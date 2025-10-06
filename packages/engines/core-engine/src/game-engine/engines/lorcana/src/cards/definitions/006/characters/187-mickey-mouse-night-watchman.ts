// TODO: Once the set is released, we organize the cards by set and type

import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseNightWatchman: LorcanaCharacterCardDefinition = {
  id: "tup",
  missingTestCase: true,
  name: "Mickey Mouse",
  title: "Night Watch",
  characteristics: ["storyborn", "hero"],
  text: "SUPPORT Your Pluto characters get Resist +1. (Damage dealt to them is reduced by 1.)",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "Support",
      text: "Your Pluto characters get Resist +1. (Damage dealt to them is reduced by 1.)",
      gainedAbility: resistAbility(1),
      target: {
        type: "card",
        value: "all",
        filters: [
          {
            filter: "attribute",
            value: "name",
            comparison: { operator: "eq", value: "pluto" },
          },
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
        ],
      },
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Hedvig Heggman-Sund",
  number: 187,
  set: "006",
  rarity: "uncommon",
};
