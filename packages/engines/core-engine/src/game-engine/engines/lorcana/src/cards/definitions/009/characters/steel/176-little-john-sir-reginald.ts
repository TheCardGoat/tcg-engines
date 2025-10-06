import { targetCardGainsResist } from "@lorcanito/lorcana-engine/effects/effects";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/target";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const littleJohnSirReginald: LorcanaCharacterCardDefinition = {
  id: "kkx",
  name: "Little John",
  title: "Sir Reginald",
  characteristics: ["storyborn", "ally"],
  text: "WHAT A BEAUTIFUL BRAWL! When you play this character, choose one:\n- Chosen Hero character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)\n- Deal 2 damage to chosen Villain character.",
  type: "character",
  inkwell: false,
  colors: ["steel"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Cristian Romero",
  number: 176,
  set: "009",
  rarity: "uncommon",
  abilities: [
    whenYouPlayThisCharacter({
      effects: [
        {
          type: "modal",
          // TODO: Get rid of target
          target: chosenCharacter,
          modes: [
            {
              id: "1",
              text: "Chosen Hero character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)",
              effects: [
                targetCardGainsResist({
                  target: {
                    type: "card",
                    value: 1,
                    filters: [
                      { filter: "zone", value: "play" },
                      { filter: "characteristics", value: ["hero"] },
                    ],
                  },
                  amount: 2,
                  duration: "turn",
                }),
              ],
            },
            {
              id: "2",
              text: "Deal 2 damage to chosen Villain character.",
              effects: [
                {
                  type: "damage",
                  amount: 2,
                  target: {
                    type: "card",
                    value: 1,
                    filters: [
                      { filter: "zone", value: "play" },
                      { filter: "characteristics", value: ["villain"] },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
  lore: 1,
};
