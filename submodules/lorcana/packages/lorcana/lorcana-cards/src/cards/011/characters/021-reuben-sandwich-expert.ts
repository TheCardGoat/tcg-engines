import type { CharacterCard } from "@tcg/lorcana-types";
import { reubenSandwichExpertI18n } from "./021-reuben-sandwich-expert.i18n";

export const reubenSandwichExpert: CharacterCard = {
  id: "YVY",
  canonicalId: "ci_YVY",
  reprints: ["set11-021"],
  cardType: "character",
  name: "Reuben",
  version: "Sandwich Expert",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 21,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_47d6da02d19a4b82a6d7aaf593ca151e",
    tcgPlayer: 673306,
  },
  text: [
    {
      title: "LUNCH SPECIAL",
      description:
        "{E} — Remove up to 2 damage from chosen character of yours. For each 1 damage removed this way, you pay 1 {I} less for the next character you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Alien"],
  abilities: [
    {
      id: "1uo-1",
      name: "LUNCH SPECIAL",
      type: "activated",
      cost: {
        exert: true,
      },
      text: "LUNCH SPECIAL {E} – Remove up to 2 damage from chosen character of yours. For each 1 damage removed this way, you pay 1 {I} less for the next character you play this turn.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-damage",
            amount: { type: "up-to", value: 2 },
            target: "YOUR_CHOSEN_CHARACTER",
          },
          {
            type: "cost-reduction",
            amount: {
              type: "for-each",
              counter: {
                type: "damage-removed",
              },
            },
            cardType: "character",
            duration: "next-play-this-turn",
          },
        ],
      },
    },
  ],
  i18n: reubenSandwichExpertI18n,
};
