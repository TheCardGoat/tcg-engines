import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";

export const treasuresUntold: LorcanaActionCardDefinition = {
  id: "pzn",
  name: "Treasures Untold",
  characteristics: ["action", "song"],
  text: "_(A character with cost 6 or more can {E} to sing this song for free.)_\n\n\nReturn up to 2 item cards from your discard into your hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Return up to 2 item cards from your discard into your hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 2,
            upTo: true,
            filters: [
              { filter: "type", value: "item" },
              { filter: "zone", value: "discard" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "How many wonders can one cavern hold?",
  inkwell: true,
  colors: ["sapphire"],
  cost: 6,
  illustrator: "Matt Gaser",
  number: 165,
  set: "URR",
  rarity: "rare",
};
