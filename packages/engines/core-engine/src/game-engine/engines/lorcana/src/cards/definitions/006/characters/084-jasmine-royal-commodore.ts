// TODO: Once the set is released, we organize the cards by set and type

import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jasmineRoyalCommodore: LorcanitoCharacterCardDefinition = {
  id: "pzt",
  name: "Jasmine",
  title: "Royal Commodore",
  characteristics: ["floodborn", "hero", "princess"],
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Jasmine.)\nRULER OF THE SEAS When you play this character, if you used Shift to play her, return all other exerted characters to their players’ hands.",
  type: "character",
  abilities: [
    shiftAbility(5, "Jasmine"),
    whenYouPlayThis({
      name: "Ruler of the Seas",
      text: "When you play this character, if you used Shift to play her, return all other exerted characters to their players’ hands.",
      conditions: [{ type: "resolution", value: "shift" }],
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: "all",
            excludeSelf: true,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "status", value: "exerted" },
              { filter: "type", value: "character" },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  illustrator: "Matthew Robert Davies",
  number: 84,
  set: "006",
  rarity: "legendary",
};
