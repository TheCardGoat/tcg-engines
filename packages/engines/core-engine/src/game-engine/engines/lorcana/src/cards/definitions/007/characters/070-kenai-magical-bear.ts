import {
  returnThisCardToHand,
  youGainLore,
} from "~/game-engine/engines/lorcana/src/abilities/effect";
import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import { whenThisCharacterBanishedInAChallenge } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kenaiMagicalBear: LorcanaCharacterCardDefinition = {
  id: "upm",
  name: "Kenai",
  title: "Magical Bear",
  characteristics: ["storyborn", "hero"],
  text: "Challenger +2. WISDOM OF HIS STORY During your turn, when this character is banished in a challenge, return this card to your hand and gain 1 lore.",
  type: "character",
  abilities: [
    challengerAbility(2),
    whenThisCharacterBanishedInAChallenge({
      name: "Durable",
      optional: true,
      text: "During your turn, when this character is banished in a challenge, return this card to your hand and gain 1 lore.",
      conditions: [
        {
          type: "during-turn",
          value: "self",
        },
      ],
      effects: [returnThisCardToHand, youGainLore(1)],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 1,
  willpower: 4,
  illustrator: "Jeanne Plounevez",
  number: 70,
  set: "007",
  rarity: "rare",
  lore: 1,
};
