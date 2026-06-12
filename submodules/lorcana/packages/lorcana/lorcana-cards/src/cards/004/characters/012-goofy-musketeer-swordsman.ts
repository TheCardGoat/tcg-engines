import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyMusketeerSwordsmanI18n } from "./012-goofy-musketeer-swordsman.i18n";

export const goofyMusketeerSwordsman: CharacterCard = {
  id: "PI2",
  canonicalId: "ci_PI2",
  reprints: ["set4-012"],
  cardType: "character",
  name: "Goofy",
  version: "Musketeer Swordsman",
  inkType: ["amber"],
  set: "004",
  cardNumber: 12,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_497f584c0a1d45e3aea9795cff7150df",
    tcgPlayer: 548549,
  },
  text: [
    {
      title: "EN GAWRSH!",
      description:
        "Whenever you play a character with Bodyguard, ready this character. He can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "self",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "ready",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "SELF",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "1k3-1",
      name: "EN GAWRSH!",
      text: "EN GAWRSH! Whenever you play a character with Bodyguard, ready this character. He can't quest for the rest of this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
          filters: [
            {
              type: "has-keyword",
              keyword: "Bodyguard",
            },
          ],
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: goofyMusketeerSwordsmanI18n,
};
