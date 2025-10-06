import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { targetCardGainsResist } from "@lorcanito/lorcana-engine/effects/effects";

export const hamsterBall: LorcanaItemCardDefinition = {
  id: "oq5",
  name: "Hamster Ball",
  characteristics: ["item"],
  text: "ROLL WITH THE PUNCHES {E}, 1 {I} – Chosen character with no damage gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
  type: "item",
  inkwell: false,
  colors: ["steel"],
  cost: 3,
  illustrator: "Alex Accorsi",
  number: 204,
  set: "008",
  rarity: "common",
  abilities: [
    {
      type: "activated",
      name: "ROLL WITH THE PUNCHES",
      text: "{E}, 1 {I} – Chosen character with no damage gains Resist +2 until the start of your next turn.",
      costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
      effects: [
        targetCardGainsResist({
          amount: 2,
          duration: "next_turn",
          target: {
            ...chosenCharacter,
            filters: [
              ...chosenCharacter.filters,
              { filter: "status", value: "damaged", negate: true },
            ],
          },
        }),
      ],
    },
  ],
};
