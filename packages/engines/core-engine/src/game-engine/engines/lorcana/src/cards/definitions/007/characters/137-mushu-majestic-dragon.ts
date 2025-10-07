import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import {
  wheneverOneOfYourCharChallengesAnotherChar,
  wheneverOpposingCharIsBanishedInChallenge,
} from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mushuMajesticDragon: LorcanaCharacterCardDefinition = {
  id: "bn6",
  name: "Mushu",
  title: "Majestic Dragon",
  characteristics: ["storyborn", "ally", "dragon"],
  text: "INTIMIDATING AND AWE-INSPIRING Whenever one of your characters challenges, they gain Resist +2 during that challenge. (Damage dealt to them is reduced by 2.)\nGUARDIAN OF LOST SOULS During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.",
  type: "character",
  abilities: [
    wheneverOneOfYourCharChallengesAnotherChar({
      name: "INTIMIDATING AND AWE-INSPIRING",
      text: "Whenever one of your characters challenges, they gain Resist +2 during that challenge. (Damage dealt to them is reduced by 2.)",
      conditions: [
        {
          type: "during-turn",
          value: "self",
        },
      ],
      effects: [
        {
          type: "ability",
          ability: "custom",
          customAbility: resistAbility(2),
          modifier: "add",
          amount: 2,
          duration: "challenge",
          target: {
            type: "card",
            value: "all",
            filters: [
              {
                filter: "challenge",
                value: "attacker",
              },
            ],
          },
        },
      ],
    }),

    wheneverOpposingCharIsBanishedInChallenge({
      name: "GUARDIAN OF LOST SOULS",
      text: "During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.",
      conditions: [
        {
          type: "during-turn",
          value: "self",
        },
      ],
      effects: [
        {
          type: "lore",
          amount: 2,
          modifier: "add",
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    }),
  ],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["ruby", "steel"],
  cost: 5,
  strength: 4,
  willpower: 4,
  illustrator: "Tom Bancroft",
  number: 137,
  set: "007",
  rarity: "rare",
  lore: 1,
};
