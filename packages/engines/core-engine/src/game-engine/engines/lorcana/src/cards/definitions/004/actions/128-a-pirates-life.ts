import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";

export const aPiratesLife: LorcanitoActionCard = {
  id: "u5v",
  name: "A Pirate's Life",
  characteristics: ["action", "song"],
  text: "**Sing Together** 6 _(Any number of your of your teammates' characters with total cost 6 or more may {E} to sing this song for free.)_\n\n\nEach opponent loses 2 lore. You gain 2 lore.",
  type: "action",
  abilities: [
    singerTogetherAbility(6),
    {
      type: "resolution",
      effects: [
        {
          type: "lore",
          modifier: "subtract",
          amount: 2,
          target: opponent,
        },
        {
          type: "lore",
          modifier: "add",
          amount: 2,
          target: self,
        },
      ],
    },
  ],
  flavour: "Give me a career\nAs a buccaneer",
  inkwell: true,
  colors: ["ruby"],
  cost: 6,
  illustrator: "Valentina Graziuso",
  number: 128,
  set: "URR",
  rarity: "uncommon",
};
