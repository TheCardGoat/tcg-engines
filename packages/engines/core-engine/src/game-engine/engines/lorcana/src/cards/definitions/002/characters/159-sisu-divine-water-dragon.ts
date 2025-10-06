import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sisuDivineWaterDragon: LorcanitoCharacterCardDefinition = {
  id: "b3o",
  name: "Sisu",
  title: "Divine Water Dragon",
  characteristics: ["hero", "storyborn", "dragon", "deity"],
  text: "**I TRUST YOU** Whenever this character quests, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "I Trust You",
      text: "Whenever this character quests, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
      effects: [
        {
          type: "scry",
          amount: 2,
          mode: "bottom",
          shouldRevealTutored: false,
          target: self,
          limits: {
            bottom: 2,
            inkwell: 0,
            hand: 1,
            top: 0,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
          ],
        },
      ],
    }),
  ],
  flavour: "No matter her shape, you can't mistake her heart.",
  colors: ["sapphire"],
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  illustrator: "Grace Tran",
  number: 159,
  set: "ROF",
  rarity: "legendary",
};
