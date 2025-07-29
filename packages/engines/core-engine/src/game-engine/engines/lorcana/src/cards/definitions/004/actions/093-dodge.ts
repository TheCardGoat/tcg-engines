import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";

export const dodge: LorcanitoActionCard = {
  id: "ysq",
  name: "Dodge!",
  characteristics: ["action"],
  text: "Chosen character gains **Ward** and **Evasive** until the start of your next turn. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "ability",
          ability: "ward",
          duration: "next_turn",
          modifier: "add",
          until: true,
          target: chosenCharacter,
        },
        {
          type: "ability",
          ability: "evasive",
          duration: "next_turn",
          modifier: "add",
          until: true,
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "Missed me, you doggone bully!",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Wouter Bruneel",
  number: 93,
  set: "URR",
  rarity: "common",
};
