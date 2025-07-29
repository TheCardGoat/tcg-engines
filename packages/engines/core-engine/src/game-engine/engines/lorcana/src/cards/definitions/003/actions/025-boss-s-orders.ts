import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { chosenCharacterGainsSupport } from "@lorcanito/lorcana-engine/effects/effects";

export const bosssOrders: LorcanaActionCardDefinition = {
  id: "tqk",
  name: "Boss's Orders",
  characteristics: ["action"],
  text: "Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Boss's Orders",
      text: "Chosen character gains **Support** this turn",
      effects: [chosenCharacterGainsSupport("turn")],
    },
  ],
  flavour:
    "Snoops! I know you can look harder! Find me that lore! \n−Madame Medusa",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Zuzana Sokolova / Livio Cacciatore",
  number: 25,
  set: "ITI",
  rarity: "common",
};
