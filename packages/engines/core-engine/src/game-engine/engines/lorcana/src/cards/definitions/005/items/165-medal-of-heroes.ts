import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { chosenCharacterGetLoreThisTurn } from "@lorcanito/lorcana-engine/effects/effects";

export const medalOfHeroes: LorcanaItemCardDefinition = {
  id: "xz9",
  missingTestCase: true,
  name: "Medal of Heroes",
  characteristics: ["item"],
  text: "**CONGRATULATIONS, SOLDIER**{E}, 2 {I}, Banish this item − Chosen character of yours gets +2 {L} this turn.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Congratulations, Soldier",
      text: "{E}, 2 {I}, Banish this item − Chosen character of yours gets +2 {L} this turn.",
      costs: [{ type: "ink", amount: 2 }, { type: "banish" }],
      effects: [chosenCharacterGetLoreThisTurn(2)],
    },
  ],
  flavour:
    "You have etched in the rock of virtue a legacy beyond compare.\n–General Hologram",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Toni Bruno",
  number: 165,
  set: "SSK",
  rarity: "common",
};
