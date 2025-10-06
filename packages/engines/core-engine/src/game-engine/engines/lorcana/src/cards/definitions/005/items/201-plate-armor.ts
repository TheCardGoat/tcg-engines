import { chosenCharacterGainsResist } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const plateArmor: LorcanaItemCardDefinition = {
  id: "pwi",
  missingTestCase: true,
  name: "Plate Armor",
  characteristics: ["item"],
  text: "**WELL CRAFTED** {E} – Chosen character gains **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Well Crafted",
      text: " {E} – Chosen character gains **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_",
      costs: [{ type: "exert" }],
      effects: [chosenCharacterGainsResist(2)],
    },
  ],
  colors: ["steel"],
  cost: 4,
  illustrator: "Gaku Kumatori",
  number: 201,
  set: "SSK",
  rarity: "rare",
};
