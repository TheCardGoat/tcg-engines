import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckPirateCaptainP3PromoI18n } from "./p3-016-daisy-duck-pirate-captain-promo.i18n";

export const daisyDuckPirateCaptainP3Promo: CharacterCard = {
  id: "aP3",
  canonicalId: "ci_k0g",
  slug: "lorcana-ci_k0g",
  printings: [
    {
      id: "set6-p3-016-promo",
      artId: "ci_k0g-promo",
      setCode: "set6",
      collectorNumber: "16",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set6-081"],
  cardType: "character",
  name: "Daisy Duck",
  version: "Pirate Captain",
  inkType: ["emerald"],
  set: "006",
  cardNumber: 16,
  rarity: "special",
  specialRarity: "promo",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7e220169e537453cbda6b634acf7af4d",
    tcgPlayer: "650213",
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
  i18n: daisyDuckPirateCaptainP3PromoI18n,
};
