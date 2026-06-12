import type { CharacterCard } from "@tcg/lorcana-types";
import { genieMainAttractionI18n } from "./049-genie-main-attraction.i18n";

export const genieMainAttraction: CharacterCard = {
  id: "zYB",
  canonicalId: "ci_zYB",
  reprints: ["set5-049"],
  cardType: "character",
  name: "Genie",
  version: "Main Attraction",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "005",
  cardNumber: 49,
  rarity: "legendary",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_e0a935e3f8394d2b881f48d3c9c46b05",
    tcgPlayer: 561953,
  },
  text: [
    {
      title: "PHENOMENAL SHOWMAN",
      description:
        "While this character is exerted, opposing characters can't ready at the start of their turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "1ia-1",
      name: "PHENOMENAL SHOWMAN",
      text: "PHENOMENAL SHOWMAN While this character is exerted, opposing characters can't ready at the start of their turn.",
      type: "static",
      condition: {
        type: "is-exerted",
      },
      effect: {
        type: "restriction",
        restriction: "cant-ready-at-start-of-turn",
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "opponent",
          selector: "all",
          zones: ["play"],
        },
      },
    },
  ],
  i18n: genieMainAttractionI18n,
};
