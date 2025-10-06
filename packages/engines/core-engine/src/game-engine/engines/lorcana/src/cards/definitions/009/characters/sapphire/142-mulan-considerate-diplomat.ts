import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mulanConsiderateDiplomat: LorcanaCharacterCardDefinition = {
  id: "k64",
  // notImplemented: true,
  missingTestCase: false,
  name: "Mulan",
  title: "Considerate Diplomat",
  characteristics: ["storyborn", "hero", "princess"],
  text: "IMPERIAL INVITATION Whenever this character quests, look at the top 4 cards of your deck. You may reveal a Princess character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  type: "character",
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  strength: 3,
  willpower: 5,
  illustrator: "LadyShalirin",
  number: 142,
  set: "009",
  rarity: "super_rare",
  abilities: [
    wheneverThisCharacterQuests({
      name: "IMPERIAL INVITATION",
      text: "Whenever this character quests, look at the top 4 cards of your deck. You may reveal a Princess character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
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
            { filter: "type", value: "character" },
            { filter: "characteristics", value: ["princess"] },
          ],
        },
      ],
    }),
  ],
  lore: 2,
};
