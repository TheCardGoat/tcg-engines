import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import {
  chosenCharacterGainsResist,
  chosenCharacterGainsSupport,
} from "@lorcanito/lorcana-engine/effects/effects";

export const atlanteanCrystal: LorcanaItemCardDefinition = {
  id: "rb8",
  name: "Atlantean Crystal",
  characteristics: ["item"],
  text: "SHIELDING LIGHT {E}, 2 {I} – Chosen character gains Resist +2 and Support until the start of your next turn. (Damage dealt to them is reduced by 2. Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  type: "item",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Greez",
  number: 180,
  set: "008",
  rarity: "rare",
  abilities: [
    {
      type: "activated",
      name: "SHIELDING LIGHT",
      text: "{E}, 2 {I} – Chosen character gains Resist +2 and Support until the start of your next turn.",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      effects: [
        chosenCharacterGainsResist(2, "next_turn"),
        chosenCharacterGainsSupport("next_turn"),
      ],
    },
  ],
};
