import { self, targetCard } from "@lorcanito/lorcana-engine/abilities/targets";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tinkerBellInsistentFairy: LorcanaCharacterCardDefinition = {
  id: "pi7",
  name: "Tinker Bell",
  title: "Insistent Fairy",
  characteristics: ["storyborn", "ally", "fairy"],
  text: "Evasive (Only characters with Evasive can challenge this character.)\nPAY ATTENTION Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.",
  type: "character",
  abilities: [
    wheneverPlays({
      name: "PAY ATTENTION",
      text: "Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.",
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
          {
            filter: "attribute",
            value: "strength",
            comparison: { operator: "gte", value: 5 },
          },
        ],
      },
      optional: true,
      effects: [
        {
          type: "exert",
          exert: true,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "source", value: "trigger" },
              { filter: "status", value: "ready" },
            ],
          },
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              target: targetCard,
              filters: targetCard.filters,
              effects: [
                {
                  type: "lore",
                  modifier: "add",
                  amount: 2,
                  target: self,
                },
              ],
            },
          ],
        },
      ],
    }),
    evasiveAbility,
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 1,
  willpower: 1,
  illustrator: "Amber Kommanvongsa",
  number: 136,
  set: "008",
  rarity: "legendary",
  lore: 1,
};
