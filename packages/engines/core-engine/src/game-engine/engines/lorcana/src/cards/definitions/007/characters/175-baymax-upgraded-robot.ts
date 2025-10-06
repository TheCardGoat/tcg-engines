import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const baymaxUpgradedRobot: LorcanaCharacterCardDefinition = {
  id: "kru",
  name: "Baymax",
  title: "Upgraded Robot",
  characteristics: ["storyborn", "hero", "robot"],
  text: "Support\nADVANCED SCANNER When you play this character, look at the top 4 cards of your deck. You may reveal a Floodborn character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  type: "character",
  abilities: [
    supportAbility,
    {
      type: "resolution",
      name: "ADVANCED SCANNER",
      text: "When you play this character, look at the top 4 cards of your deck. You may reveal a Floodborn character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      effects: [
        {
          type: "scry",
          amount: 4,
          mode: "bottom",
          shouldRevealTutored: true,
          target: self,
          limits: {
            bottom: 4,
            top: 0,
            hand: 1,
            inkwell: 0,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
            { filter: "type", value: "character" },
            { filter: "characteristics", value: ["floodborn"] },
          ],
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  strength: 3,
  willpower: 5,
  illustrator: "Dustin Panzino",
  number: 175,
  set: "007",
  rarity: "rare",
  lore: 1,
};
