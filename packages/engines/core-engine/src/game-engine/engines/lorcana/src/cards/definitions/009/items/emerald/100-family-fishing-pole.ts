import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { chosenYourExertedCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import {
  enterPlaysExerted,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";

export const familyFishingPole: LorcanaItemCardDefinition = {
  id: "zd9",
  // notImplemented: true,
  missingTestCase: false,
  name: "Family Fishing Pole",
  characteristics: ["item"],
  text: "WATCH CLOSELY This item enters play exerted.\nTHE PERFECT CAST {E}, 1 {I}, Banish this item – Return chosen exerted character of yours to your hand to gain 2 lore.",
  type: "item",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Carlos Ruiz",
  number: 100,
  set: "009",
  rarity: "rare",
  abilities: [
    whenYouPlayThis({
      name: "WATCH CLOSELY",
      text: "This item enters play exerted.",
      effects: [enterPlaysExerted],
    }),
    {
      type: "activated",
      name: "THE PERFECT CAST",
      text: "{E}, 1 {I}, Banish this item – Return chosen exerted character of yours to your hand to gain 2 lore.",
      costs: [
        { type: "exert" },
        { type: "ink", amount: 1 },
        { type: "banish" },
      ],
      effects: [
        {
          type: "move",
          to: "hand",
          target: chosenYourExertedCharacter,
        },
        youGainLore(2),
      ],
    },
  ],
};
