import { eachOfYourCharacters } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const amberChromiconItem: LorcanaItemCardDefinition = {
  id: "ny4",
  missingTestCase: true,
  name: "Amber Chromicon",
  characteristics: ["item"],
  text: "**AMBER LIGHT** {E} – Remove up to 1 damage from each of your characters.",
  type: "item",
  abilities: [
    {
      type: "activated",
      costs: [{ type: "exert" }],
      name: "AMBER LIGHT",
      text: "{E} – Remove up to 1 damage from each of your characters.",
      effects: [
        {
          type: "heal",
          amount: 1,
          target: eachOfYourCharacters,
        },
      ],
    },
  ],
  flavour: "Comfort the weak and weary.\n–Inscription",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Dustin Panzino",
  number: 32,
  set: "SSK",
  rarity: "uncommon",
};
