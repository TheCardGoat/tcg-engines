import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { chosenCharacterGainsSupport } from "@lorcanito/lorcana-engine/effects/effects";

export const workTogether: LorcanitoActionCard = {
  id: "cxh",
  name: "Work Together",
  characteristics: ["action"],
  text: "Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Work Together",
      text: "Chosen character gains **Support** this turn.",
      effects: [chosenCharacterGainsSupport("turn")],
    },
  ],
  flavour:
    "Pacha: Put your whole back into it! \nKuzco: This is my whole back!",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Bill Robinson",
  number: 165,
  set: "TFC",
  rarity: "common",
};
