import { chosenCharacterGainsResist } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mouseArmor: LorcanaItemCardDefinition = {
  id: "xso",

  name: "Mouse Armor",
  characteristics: ["item"],
  text: "**PROTECTION** {E} − Chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Protection",
      text: "{E} − Chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
      costs: [{ type: "exert" }],
      effects: [chosenCharacterGainsResist(1)],
    },
  ],
  flavour: "Built by the tiniest of hands for the bravest of hearts.",
  colors: ["steel"],
  cost: 2,
  illustrator: "Gaku Kumatori",
  number: 203,
  set: "ROF",
  rarity: "uncommon",
};
