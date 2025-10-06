import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mufasaBetrayedLeader: LorcanitoCharacterCardDefinition = {
  id: "j4z",
  name: "Mufasa",
  title: "Betrayed Leader",
  characteristics: ["storyborn", "king", "mentor"],
  text: "**THE SUN WILL SET** When this character is banished, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the top of your deck.",
  type: "character",
  abilities: [
    whenThisCharacterBanished({
      name: "The Sun Will Set",
      text: "When this character is banished, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the top of your deck.",
      effects: [
        {
          type: "reveal-and-play",
          putInto: "deck",
          exerted: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Stefano Zanchi",
  number: 14,
  set: "ROF",
  rarity: "legendary",
};
