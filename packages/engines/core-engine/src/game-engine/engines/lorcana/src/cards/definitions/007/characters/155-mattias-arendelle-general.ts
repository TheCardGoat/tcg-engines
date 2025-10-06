import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mattiasArendelleGeneral: LorcanaCharacterCardDefinition = {
  id: "nam",
  name: "Mattias",
  title: "Arendelle General",
  characteristics: ["storyborn", "ally", "knight"],
  text: "PROUD TO SERVE Your Queen characters gain Ward.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "PROUD TO SERVE",
      text: "Your Queen characters gain Ward.",
      effects: [
        {
          type: "ability",
          ability: "ward",
          modifier: "add",
          duration: "static",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "characteristics", value: ["queen"] },
              { filter: "owner", value: "self" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 3,
  willpower: 2,
  illustrator: "Samantha Edrini",
  number: 155,
  set: "007",
  rarity: "common",
  lore: 1,
};
