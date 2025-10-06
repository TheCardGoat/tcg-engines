import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";

export const medallionWeights: LorcanaItemCardDefinition = {
  id: "xo1",
  reprints: ["c57"],
  name: "Medallion Weights",
  characteristics: ["item"],
  text: "**DISCIPLINE AND STRENGTH** {E}, 2 {I} - Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Discipline And Strength",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      text: "{E}, 2 {I} - Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
        {
          type: "ability",
          ability: "custom",
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
          customAbility: wheneverChallengesAnotherChar({
            name: "Discipline And Strength",
            text: "Whenever they challenge another character this turn, you may draw a card.",
            optional: true,
            effects: [drawACard],
          }),
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  illustrator: "Defne Tōzūm",
  number: 132,
  set: "URR",
  rarity: "uncommon",
};
