import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rajahRoyalProtector: LorcanitoCharacterCardDefinition = {
  id: "sf3",
  missingTestCase: true,
  name: "Rajah",
  title: "Royal Protector",
  characteristics: ["storyborn", "ally"],
  text: "**STEADY GAZE** While you have no cards in your hand, characters with cost 4 or less can't challenge this character.",
  type: "character",
  abilities: [
    {
      type: "static",
      name: "Steady Gaze",
      text: "While you have no cards in your hand, characters with cost 4 or less can't challenge this character.",
      conditions: [{ type: "hand", amount: 0, player: "self" }],
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
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 4 },
              },
            ],
          },
        },
      ],
    },
  ],
  flavour: "As regal as his namesake and just as powerful.",
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Sandara Tang",
  number: 192,
  set: "URR",
  rarity: "rare",
};
