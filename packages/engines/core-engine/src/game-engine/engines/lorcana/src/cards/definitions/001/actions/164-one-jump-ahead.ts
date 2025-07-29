import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const oneJumpAhead: LorcanitoActionCard = {
  id: "gf6",
  name: "One Jump Ahead",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\nPut the top card of your deck into your inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "One Jump Ahead",
      text: "Put the top card of your deck into your inkwell facedown and exerted.",
      optional: false,
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: {
            type: "card",
            value: 1,
            filters: [{ filter: "top-deck", value: "self" }],
          },
        },
      ],
    },
  ],
  flavour:
    "Gotta eat to live, gotta steal to eat -\nTell you all about it when I got the time",
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Bill Robinson",
  number: 164,
  set: "TFC",
  rarity: "uncommon",
};
