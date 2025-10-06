import { chosenItemOfYoursInHand } from "@lorcanito/lorcana-engine/abilities/target";
import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tamatoaHappyAsAClam: LorcanaCharacterCardDefinition = {
  id: "at5",
  name: "Tamatoa",
  title: "Happy as a Clam",
  characteristics: ["storyborn", "villain"],
  type: "character",
  inkwell: true,
  colors: ["sapphire"],
  cost: 6,
  strength: 4,
  willpower: 5,
  illustrator: "Federico Maria Cugliari",
  number: 162,
  set: "007",
  rarity: "legendary",
  lore: 2,
  text: "COOLEST COLLECTION When you play this character, return up to 2 item cards from your discard to your hand.\nI'M BEAUTIFUL, BABY! Whenever this character quests, you may play an item for free.",
  abilities: [
    whenYouPlayThisCharacter({
      name: "Coolest Collection",
      text: "When you play this character, return up to 2 item cards from your discard to your hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 2,
            upTo: true,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: ["item"] },
              { filter: "zone", value: "discard" },
            ],
          },
        },
      ],
    }),
    wheneverThisCharacterQuests({
      name: "I'm Beautiful, Baby!",
      text: "Whenever this character quests, you may play an item for free.",
      optional: true,
      effects: [
        {
          type: "play",
          forFree: true,
          target: chosenItemOfYoursInHand,
        },
      ],
    }),
  ],
};
