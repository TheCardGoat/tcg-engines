// TODO: Once the set is released, we organize the cards by set and type

import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hiroHamadaRoboticsProdigy: LorcanaCharacterCardDefinition = {
  id: "b0j",
  name: "Hiro Hamada",
  title: "Robotics Prodigy",
  characteristics: ["hero", "storyborn", "inventor"],
  text: "**SWEET TECH**  {E}, 2 {I} − Search your deck for an item card or a Robot character card and reveal it to all players. Shuffle your deck and put that card on top of it.",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "SWEET TECH",
      text: " {E}, 2 {I} − Search your deck for an item card or a Robot character card and reveal it to all players. Shuffle your deck and put that card on top of it.",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      dependentEffects: true,
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "shuffle-deck",
          target: self,
        },
        {
          type: "move",
          to: "deck",
          bottom: false,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "deck" },
              { filter: "owner", value: "self" },
              {
                filter: "characteristics",
                value: ["robot", "item"],
                conjunction: "or",
              },
            ],
          },
        },
      ],
    },
  ],
  flavour: "A couple more tweaks and I've just about . . . got it!",
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 0,
  willpower: 3,
  lore: 1,
  illustrator: "Denny Minonne",
  number: 145,
  set: "006",
  rarity: "uncommon",
};
