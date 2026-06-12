import type { CharacterCard } from "@tcg/lorcana-types";
import { theDodoOutlandishStorytellerI18n } from "./126-the-dodo-outlandish-storyteller.i18n";

export const theDodoOutlandishStoryteller: CharacterCard = {
  id: "Bfj",
  canonicalId: "ci_Bfj",
  reprints: ["set8-126"],
  cardType: "character",
  name: "The Dodo",
  version: "Outlandish Storyteller",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "008",
  cardNumber: 126,
  rarity: "common",
  cost: 3,
  strength: 0,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_98f834b45bba4455b572aa08bcfe8715",
    tcgPlayer: 631432,
  },
  text: [
    {
      title: "EXTRAORDINARY SITUATION",
      description: "This character gets +1 {S} for each 1 damage on him.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        modifier: {
          type: "damage-on-self",
        },
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "dac-1",
      name: "EXTRAORDINARY SITUATION",
      text: "EXTRAORDINARY SITUATION This character gets +1 {S} for each 1 damage on him.",
      type: "static",
    },
  ],
  i18n: theDodoOutlandishStorytellerI18n,
};
