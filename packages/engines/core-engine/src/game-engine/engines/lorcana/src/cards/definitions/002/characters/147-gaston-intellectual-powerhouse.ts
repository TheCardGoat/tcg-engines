import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gastonIntellectualPowerhouse: LorcanaCharacterCardDefinition = {
  id: "zsp",

  name: "Gaston",
  title: "Intellectual Powerhouse",
  characteristics: ["floodborn", "villain"],
  text: "**Shift** 4 _You may pay 4 {I} to play this on top of one of your characters named Gaston.)_<br>\n**DEVELOPED BRAIN** When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
  type: "character",
  abilities: [
    shiftAbility(4, "gaston"),
    {
      type: "resolution",
      name: "Developed Brain",
      text: "When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
      effects: [
        {
          type: "scry",
          amount: 3,
          mode: "bottom",
          shouldRevealTutored: false,
          target: self,
          limits: {
            bottom: 3,
            inkwell: 0,
            top: 0,
            hand: 1,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
          ],
        },
      ],
    },
  ],
  colors: ["sapphire"],
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 3,
  illustrator: "Matthew Robert Davies",
  number: 147,
  set: "ROF",
  rarity: "rare",
};
