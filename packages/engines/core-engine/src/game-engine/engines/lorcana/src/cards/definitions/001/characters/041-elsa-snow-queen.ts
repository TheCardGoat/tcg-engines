import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const elsaSnowQueen: LorcanitoCharacterCardDefinition = {
  id: "u2z",
  reprints: ["hcz"],
  name: "Elsa",
  title: "Snow Queen",
  characteristics: ["hero", "dreamborn", "queen", "sorcerer"],
  text: "**Freeze** {E} - Exert chosen opposing character.",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "Freeze",
      text: "Exert chosen opposing character.",
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "exert",
          exert: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "opponent" },
            ],
          },
        },
      ],
    } as ActivatedAbility,
  ],
  flavour:
    "Recreated by magical ink, Elsa found herself in an unfamiliar new world. Fortunately, ice works the same way everywhere.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Nicholas Kole",
  number: 41,
  set: "TFC",
  rarity: "uncommon",
};
