import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

const chosenCharacter = {
  type: "card" as const,
  value: 1,
  filters: [
    { filter: "zone" as const, value: "play" as const },
    { filter: "type" as const, value: "character" as const },
  ],
};

export const holdStill: LorcanitoActionCard = {
  id: "y6k",

  name: "Hold Still",
  characteristics: ["action"],
  text: "Remove up to 4 damage from chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Remove up to 4 damage from chosen character.",
      effects: [
        {
          type: "heal",
          amount: 4,
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "This might sting a little.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Connie Kang / Jackie Droujko",
  number: 28,
  set: "ROF",
  rarity: "common",
};
