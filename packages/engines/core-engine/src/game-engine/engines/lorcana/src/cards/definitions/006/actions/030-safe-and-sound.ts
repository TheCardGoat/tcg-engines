import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/target";
import { allCharacters } from "@lorcanito/lorcana-engine/abilities/targets";

export const safeAndSound: LorcanaActionCardDefinition = {
  id: "ypf",
  name: "Safe And Sound",
  characteristics: ["action"],
  text: "Chosen character of yours can't be challenged until the start of your next turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Safe And Sound",
      text: "Chosen character of yours can't be challenged until the start of your next turn.",
      effects: [
        {
          type: "ability",
          ability: "custom",
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: chosenCharacterOfYours,
          customAbility: {
            type: "static",
            ability: "effects",
            effects: [
              {
                type: "protection",
                from: "challenge",
                target: allCharacters,
              },
            ],
          },
        },
      ],
    },
  ],
  inkwell: false,
  colors: ["amber"],
  cost: 2,
  illustrator: "Simone Tentoni",
  number: 30,
  set: "006",
  rarity: "rare",
};
