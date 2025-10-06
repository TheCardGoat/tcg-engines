// TODO: Once the set is released, we organize the cards by set and type

import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jimHawkinsHonorablePirate: LorcanaCharacterCardDefinition = {
  id: "hdv",
  missingTestCase: true,
  name: "Jim Hawkins",
  title: "Honorable Pirate",
  characteristics: ["hero", "dreamborn", "pirate", "captain"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n\n**HIRE A CREW** When you play this character, look at the top 4 cards of your deck. You may reveal any number of Pirate character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
  type: "character",
  abilities: [
    bodyguardAbility,
    {
      type: "resolution",
      name: "HIRE A CREW",
      text: "When you play this character, look at the top 4 cards of your deck. You may reveal any number of Pirate character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
      effects: [
        {
          type: "scry",
          amount: 4,
          mode: "bottom",
          shouldRevealTutored: true,
          limits: {
            bottom: 4,
            inkwell: 0,
            top: 0,
            hand: 4,
          },
          target: self,
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "character" },
            { filter: "zone", value: "deck" },
            { filter: "characteristics", value: ["pirate"] },
          ],
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 7,
  strength: 4,
  willpower: 7,
  lore: 2,
  illustrator: "Marcel Berg",
  number: 25,
  set: "006",
  rarity: "super_rare",
};
