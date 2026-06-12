import type { CharacterCard } from "@tcg/lorcana-types";
import { sneezyNoisyKnightI18n } from "./180-sneezy-noisy-knight.i18n";

export const sneezyNoisyKnight: CharacterCard = {
  id: "O74",
  canonicalId: "ci_O74",
  reprints: ["set5-180"],
  cardType: "character",
  name: "Sneezy",
  version: "Noisy Knight",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  cardNumber: 180,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ea122d22ac8a430389070f2f090c05e0",
    tcgPlayer: 559663,
  },
  text: [
    {
      title: "HEADWIND",
      description:
        "When you play this character, chosen Knight character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Knight",
            },
          ],
        },
        type: "gain-keyword",
        value: 2,
      },
      id: "83h-1",
      name: "HEADWIND",
      text: "HEADWIND When you play this character, chosen Knight character gains Challenger +2 this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: sneezyNoisyKnightI18n,
};
