import type { CharacterCard } from "@tcg/lorcana-types";
import { kingOfHeartsMonarchOfWonderlandI18n } from "./057-king-of-hearts-monarch-of-wonderland.i18n";

export const kingOfHeartsMonarchOfWonderland: CharacterCard = {
  id: "350",
  canonicalId: "ci_350",
  reprints: ["set5-057"],
  cardType: "character",
  name: "King of Hearts",
  version: "Monarch of Wonderland",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "005",
  cardNumber: 57,
  rarity: "uncommon",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_19a1d88c22204acf9412f49437e0eb00",
    tcgPlayer: 561490,
  },
  text: [
    {
      title: "PLEASING THE QUEEN",
      description: "{E} — Chosen exerted character can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "King"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "until-start-of-next-turn",
        restriction: "cant-ready",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "exerted",
            },
          ],
        },
        type: "restriction",
      },
      id: "3sp-1",
      name: "PLEASING THE QUEEN",
      text: "PLEASING THE QUEEN {E} — Chosen exerted character can't ready at the start of their next turn.",
      type: "activated",
    },
  ],
  i18n: kingOfHeartsMonarchOfWonderlandI18n,
};
