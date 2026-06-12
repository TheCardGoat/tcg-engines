import type { CharacterCard } from "@tcg/lorcana-types";
import { kenaiBigBrotherI18n } from "./005-kenai-big-brother.i18n";

export const kenaiBigBrother: CharacterCard = {
  id: "6WD",
  canonicalId: "ci_6WD",
  reprints: ["set5-005"],
  cardType: "character",
  name: "Kenai",
  version: "Big Brother",
  inkType: ["amber"],
  franchise: "Brother Bear",
  set: "005",
  cardNumber: 5,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_85a886f78a71416aa253879cbe81d8dd",
    tcgPlayer: 560502,
  },
  text: [
    {
      title: "BROTHERS FOREVER",
      description:
        "While this character is exerted, your characters named Koda can't be challenged.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      condition: {
        type: "is-exerted",
      },
      effect: {
        restriction: "cant-be-challenged",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [{ type: "attribute", attribute: "name", comparison: "equals", value: "Koda" }],
        },
        type: "restriction",
      },
      id: "a82-1",
      name: "BROTHERS FOREVER",
      text: "BROTHERS FOREVER While this character is exerted, your characters named Koda can't be challenged.",
      type: "static",
    },
  ],
  i18n: kenaiBigBrotherI18n,
};
