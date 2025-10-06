import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { singerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arielSpectacularSinger: LorcanitoCharacterCardDefinition = {
  id: "n9e",
  name: "Ariel",
  title: "Spectacular Singer",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**Singer** 5 _(This character counts as cost 5 to sing songs.)_\n**MUSICAL DEBUT** When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  type: "character",
  abilities: [
    singerAbility(5),
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "MUSICAL DEBUT",
      text: "When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.",
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
            inkwell: 0,
            hand: 1,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
            { filter: "characteristics", value: ["song"] },
          ],
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 2,
  set: "TFC",
  rarity: "super_rare",
};
