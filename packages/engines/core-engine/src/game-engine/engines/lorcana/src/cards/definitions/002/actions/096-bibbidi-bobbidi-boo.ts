import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const bibbidiBobbidiBoo: LorcanitoActionCard = {
  id: "waz",

  name: "Bibbidi Bobbidi Boo",
  characteristics: ["action", "song"],
  text: "_A character with cost 3 or more can {E} to sing this song for free.)_\n\nReturn chosen character of yours to your hand to play another character with the same cost or less for free.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      optional: false,
      name: "Bibbidi Bobbidi Boo",
      text: "Return chosen character of yours to your hand to play another character with the same cost or less for free.",
      resolveEffectsIndividually: true,
      dependentEffects: true,
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
            ],
          },
        },
        {
          type: "play",
          forFree: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
              { filter: "zone", value: "hand" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "It'll do magic, believe it or not",
  colors: ["emerald"],
  cost: 3,
  illustrator: "LadyShalirin",
  number: 96,
  set: "ROF",
  rarity: "rare",
};
