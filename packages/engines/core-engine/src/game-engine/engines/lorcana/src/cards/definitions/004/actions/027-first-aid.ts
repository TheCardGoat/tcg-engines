import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { eachOfYourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";

export const firstAid: LorcanitoActionCard = {
  id: "r1q",
  missingTestCase: true,
  name: "First Aid",
  characteristics: ["action"],
  text: "Remove up to 1 damage from each of your characters.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Remove up to 1 damage from each of your characters.",
      effects: [
        {
          type: "heal",
          amount: 1,
          target: eachOfYourCharacters,
        },
      ],
    },
  ],
  flavour: "There, now - isn't that better?",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Gonzalo Kenny",
  number: 27,
  set: "URR",
  rarity: "common",
};
