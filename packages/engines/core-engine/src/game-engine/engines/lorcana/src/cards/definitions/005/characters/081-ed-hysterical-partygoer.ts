import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const edHystericalPartygoer: LorcanitoCharacterCardDefinition = {
  id: "tsa",
  missingTestCase: true,
  name: "Ed",
  title: "Hysterical Partygoer",
  characteristics: ["storyborn", "ally", "hyena"],
  text: "**ROWDY GUEST** Damaged characters can’t challenge this character.",
  type: "character",
  abilities: [
    {
      type: "static",
      name: "Rowdy Guest",
      text: "Damaged characters can’t challenge this character.",
      ability: "effects",
      effects: [
        {
          type: "protection",
          from: "challenge",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              {
                filter: "status",
                value: "damage",
                comparison: { operator: "gte", value: 1 },
              },
            ],
          },
        },
      ],
    },
  ],
  flavour: "As far as he’s concerned, there’s no such thing as bad taste.",
  colors: ["emerald"],
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 3,
  illustrator: "Stefano Spagnuolo",
  number: 81,
  set: "SSK",
  rarity: "uncommon",
};
