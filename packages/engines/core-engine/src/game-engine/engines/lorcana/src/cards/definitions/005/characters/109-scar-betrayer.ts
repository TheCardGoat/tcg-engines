import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const scarBetrayer: LorcanaCharacterCardDefinition = {
  id: "yvg",
  name: "Scar",
  title: "Betrayer",
  characteristics: ["storyborn", "villain"],
  text: "**LONG LIVE THE KING** When you play this character, you may banish chosen character named Mufasa.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "**LONG LIVE THE KING**",
      text: "When you play this character, you may banish chosen character named Mufasa.",
      optional: true,
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              {
                filter: "attribute",
                value: "name",
                comparison: { operator: "eq", value: "Mufasa" },
              },
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "The second Rule of Villainy: Never settle for second place.",
  inkwell: true,
  colors: ["ruby"],
  cost: 5,
  strength: 6,
  willpower: 3,
  lore: 2,
  illustrator: "Dinulescu Alexandru",
  number: 109,
  set: "SSK",
  rarity: "uncommon",
};
