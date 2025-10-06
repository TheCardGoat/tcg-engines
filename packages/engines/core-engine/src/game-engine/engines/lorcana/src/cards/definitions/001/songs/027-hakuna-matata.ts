import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hakunaMatata: LorcanaActionCardDefinition = {
  id: "ege",
  name: "Hakuna Matata",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this\nsong for free.)_\nRemove up to 3 damage from each of your characters.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Hakuna Matata",
      text: "Remove up to 3 damage from each of your characters.",
      effects: [
        {
          type: "heal",
          amount: 3,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "What a wonderful phrase!",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  illustrator: "Juan Diego Leon",
  number: 27,
  set: "TFC",
  rarity: "common",
};
