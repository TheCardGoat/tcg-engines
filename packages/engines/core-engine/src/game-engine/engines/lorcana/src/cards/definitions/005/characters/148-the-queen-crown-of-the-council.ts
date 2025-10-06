import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theQueenCrownOfTheCouncil: LorcanitoCharacterCardDefinition = {
  id: "lr0",
  name: "The Queen",
  title: "Crown of the Council",
  characteristics: ["queen", "sorcerer", "storyborn", "villain"],
  text: "**Ward** _(Opponents can’t choose this character except to challenge.)_<br/>**GATHERER OF THE WICKED** When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.",
  type: "character",
  abilities: [
    wardAbility,
    {
      type: "resolution",
      name: "GATHERER OF THE WICKED",
      text: "When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.",
      effects: [
        {
          type: "scry",
          amount: 3,
          shouldRevealTutored: true,
          target: self,
          mode: "bottom",
          limits: {
            bottom: 3,
            top: 0,
            inkwell: 0,
            hand: 3,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
            {
              filter: "attribute",
              value: "name",
              comparison: { operator: "eq", value: "The Queen" },
            },
          ],
        },
      ],
    },
  ],
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 2,
  illustrator: "Lava Hijzelaar / Ellie Horie",
  number: 148,
  set: "SSK",
  rarity: "rare",
};
