import type {
  BanishEffect,
  LorcanitoActionCard,
} from "@lorcanito/lorcana-engine";

export const beKingUndisputed: LorcanaActionCardDefinition = {
  id: "o8o",
  name: "Be King Undisputed",
  characteristics: ["action", "song"],
  text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n\n\nEach opponent chooses and banishes one of their characters.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Be King Undisputed",
      text: "Each opponent chooses and banishes one of their characters.",
      responder: "opponent",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
            ],
          },
        } as BanishEffect,
      ],
    },
  ],
  flavour: "Respected, saluted",
  colors: ["ruby"],
  cost: 4,
  illustrator: "Emily Abeydeera",
  number: 129,
  set: "URR",
  rarity: "rare",
};
