import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const grandDukeAdvisorToTheKing: LorcanitoCharacterCardDefinition = {
  id: "uiz",
  name: "Grand Duke",
  title: "Advisor to the King",
  characteristics: ["storyborn", "ally"],
  text: "**YES, YOUR MAJESTY** Your Prince, Princess, King and Queen characters gain +1 {S}.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "Yes, Your Majesty",
      text: "Your Prince, Princess, King and Queen characters gain +1 {S}.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          modifier: "add",
          amount: 1,
          duration: "turn",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              {
                filter: "characteristics",
                value: ["prince", "princess", "king", "queen"],
                conjunction: "or",
              },
            ],
          },
        },
      ],
    },
  ],
  flavour: "He takes being opinionated to a higher level.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Javi Salas",
  number: 9,
  set: "ROF",
  rarity: "rare",
};
