import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const luckyRuntOfTheLitter: LorcanaCharacterCardDefinition = {
  id: "tf0",
  name: "Lucky",
  title: "Runt of the Litter",
  characteristics: ["storyborn", "puppy"],
  text: "FOLLOW MY VOICE Whenever this character quests, look at the top 2 cards of your deck. You may reveal any number of Puppy character cards and put them in your hand. Put the rest on the bottom of your deck in any order.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "FOLLOW MY VOICE",
      text: "Whenever this character quests, look at the top 2 cards of your deck. You may reveal any number of Puppy character cards and put them in your hand. Put the rest on the bottom of your deck in any order.",
      effects: [
        {
          type: "scry",
          amount: 2,
          mode: "bottom",
          shouldRevealTutored: true,
          target: self,
          limits: {
            bottom: 2,
            inkwell: 0,
            hand: 2,
            top: 0,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
            { filter: "characteristics", value: ["puppy"] },
          ],
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["sapphire"],
  cost: 3,
  strength: 1,
  willpower: 3,
  illustrator: "Carlos Luzzi",
  number: 160,
  set: "007",
  rarity: "rare",
  lore: 2,
};
