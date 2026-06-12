import type { CharacterCard } from "@tcg/lorcana-types";
import { maxLoyalSheepdogI18n } from "./014-max-loyal-sheepdog.i18n";

export const maxLoyalSheepdog: CharacterCard = {
  id: "6A5",
  canonicalId: "ci_6A5",
  reprints: ["set4-014"],
  cardType: "character",
  name: "Max",
  version: "Loyal Sheepdog",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 14,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9002164290424cb1911b9817cf1abf95",
    tcgPlayer: 550558,
  },
  text: [
    {
      title: "HERE BOY",
      description:
        "If you have a character named Prince Eric in play, you pay 1 {I} less to play this character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        controller: "you",
        name: "Prince Eric",
        type: "has-named-character",
      },
      effect: {
        amount: 1,
        cardType: "character",
        type: "cost-reduction",
      },
      id: "1d6-1",
      name: "HERE BOY",
      sourceZones: ["hand"],
      text: "HERE BOY If you have a character named Prince Eric in play, you pay 1 {I} less to play this character.",
      type: "static",
    },
  ],
  i18n: maxLoyalSheepdogI18n,
};
