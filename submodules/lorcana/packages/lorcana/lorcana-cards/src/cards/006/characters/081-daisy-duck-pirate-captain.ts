import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckPirateCaptainI18n } from "./081-daisy-duck-pirate-captain.i18n";

export const daisyDuckPirateCaptain: CharacterCard = {
  id: "dpv",
  canonicalId: "ci_Ad0",
  reprints: ["set6-081"],
  cardType: "character",
  name: "Daisy Duck",
  version: "Pirate Captain",
  inkType: ["emerald"],
  set: "006",
  cardNumber: 81,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_21bfac43fba64c06ab62139f3befd6c1",
    tcgPlayer: 592040,
  },
  text: [
    {
      title: "DISTANT SHORES",
      description:
        "Whenever one of your Pirate characters quests while at a location, draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "zzu-1",
      name: "DISTANT SHORES",
      text: "DISTANT SHORES Whenever one of your Pirate characters quests while at a location, draw a card.",
      trigger: {
        event: "quest",
        on: {
          cardType: "character",
          classification: "Pirate",
          controller: "you",
        },
        timing: "whenever",
      },
      condition: {
        type: "target-query",
        query: {
          filters: [
            {
              type: "at-location",
            },
          ],
          reference: "trigger-subject",
          selector: "all",
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      type: "triggered",
    },
  ],
  i18n: daisyDuckPirateCaptainI18n,
};
