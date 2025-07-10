import { wheneverYouPlayAFloodBorn } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const honeyLemonChemistryWhiz: LorcanitoCharacterCard = {
  id: "vk2",
  name: "Honey Lemon",
  title: "Chemistry Whiz",
  characteristics: ["storyborn", "hero", "inventor"],
  text: "PRETTY GREAT, HUH? Whenever you play a Floodborn character, if you used Shift to play them, you may remove up to 2 damage from chosen character.",
  type: "character",
  abilities: [
    wheneverYouPlayAFloodBorn({
      name: "PRETTY GREAT, HUH?",
      text: "Whenever you play a Floodborn character, if you used Shift to play them, you may remove up to 2 damage from chosen character.",
      optional: true,
      hasShifted: true,
      effects: [
        {
          type: "heal",
          amount: 2,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Brianna Garcia",
  number: 169,
  set: "007",
  rarity: "common",
  lore: 1,
};
