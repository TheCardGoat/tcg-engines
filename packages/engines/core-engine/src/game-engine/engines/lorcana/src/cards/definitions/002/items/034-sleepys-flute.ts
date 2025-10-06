import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sleepysFlute: LorcanaItemCardDefinition = {
  id: "fn4",
  name: "Sleepy's Flute",
  characteristics: ["item"],
  text: "**A SILLY SONG** {E} − If you played a song this turn, gain 1 lore.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "A Silly Song",
      text: "{E} − If you played a song this turn, gain 1 lore.",
      optional: false,
      costs: [{ type: "exert" }],
      conditions: [{ type: "played-songs" }],
      effects: [
        {
          type: "lore",
          amount: 1,
          modifier: "add",
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    },
  ],
  colors: ["amber"],
  cost: 2,
  illustrator: "Antonia Flechsig",
  number: 34,
  set: "ROF",
  rarity: "rare",
};
