import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";

export const seldomAllTheySeem: LorcanaActionCardDefinition = {
  id: "esk",
  name: "Seldom All They Seem",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\nChosen character gets -3 {S} this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 3,
          modifier: "subtract",
          duration: "turn",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "I know you\nI walked with you once upon a dream",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Rachel Elese",
  number: 164,
  set: "URR",
  rarity: "common",
};
