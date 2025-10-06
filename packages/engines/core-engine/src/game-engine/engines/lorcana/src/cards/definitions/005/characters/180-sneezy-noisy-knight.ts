import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sneezyNoisyKnight: LorcanaCharacterCardDefinition = {
  id: "tkh",
  missingTestCase: true,
  name: "Sneezy",
  title: "Noisy Knight",
  characteristics: ["dreamborn", "ally", "knight", "seven dwarfs"],
  text: "**HEADWIND** When you play this character, chosen Knight character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Headwind",
      text: "When you play this character, chosen Knight character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_",
      effects: [
        {
          type: "ability",
          ability: "challenger",
          amount: 3,
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "characteristics", value: ["knight"] },
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 180,
  set: "SSK",
  rarity: "common",
};
