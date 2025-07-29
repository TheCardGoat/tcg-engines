import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import {
  allYourCharacters,
  eachOfYourCharacters,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";

export const onYourFeetNow: LorcanitoActionCard = {
  id: "wna",
  missingTestCase: true,
  name: "On Your Feet! Now!",
  characteristics: ["action"],
  text: "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
      effects: [
        ...readyAndCantQuest(allYourCharacters),
        {
          type: "damage",
          amount: 1,
          target: eachOfYourCharacters,
        },
      ],
    },
  ],
  flavour: "Catch them! Before they get away!",
  colors: ["ruby"],
  illustrator: "Lisanne Koeteeuw",
  number: 130,
  cost: 4,
  set: "ITI",
  rarity: "rare",
};
