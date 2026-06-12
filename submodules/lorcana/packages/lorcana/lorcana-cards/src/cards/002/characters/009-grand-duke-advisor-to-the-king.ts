import type { CharacterCard } from "@tcg/lorcana-types";
import { grandDukeAdvisorToTheKingI18n } from "./009-grand-duke-advisor-to-the-king.i18n";

export const grandDukeAdvisorToTheKing: CharacterCard = {
  id: "4Ol",
  canonicalId: "ci_4Ol",
  reprints: ["set2-009"],
  cardType: "character",
  name: "Grand Duke",
  version: "Advisor to the King",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "002",
  cardNumber: 9,
  rarity: "rare",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0b2c5d800fc14fdfacf098d74ec7ab74",
    tcgPlayer: 522735,
  },
  text: [
    {
      title: "YES, YOUR MAJESTY",
      description: "Your Prince, Princess, King, and Queen characters get +1 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "or",
              filters: [
                {
                  type: "has-classification",
                  classification: "Prince",
                },
                {
                  type: "has-classification",
                  classification: "Princess",
                },
                {
                  type: "has-classification",
                  classification: "King",
                },
                {
                  type: "has-classification",
                  classification: "Queen",
                },
              ],
            },
          ],
        },
        type: "modify-stat",
      },
      id: "126-1",
      name: "YES, YOUR MAJESTY",
      text: "YES, YOUR MAJESTY Your Prince, Princess, King, and Queen characters get +1 {S}.",
      type: "static",
    },
  ],
  i18n: grandDukeAdvisorToTheKingI18n,
};
