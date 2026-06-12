import type { CharacterCard } from "@tcg/lorcana-types";
import { isisVanderchillIceQueenOfStCanardI18n } from "./038-isis-vanderchill-ice-queen-of-st-canard.i18n";

export const isisVanderchillIceQueenOfStCanard: CharacterCard = {
  id: "StU",
  canonicalId: "ci_StU",
  reprints: ["set11-038"],
  cardType: "character",
  name: "Isis Vanderchill",
  version: "Ice Queen of St. Canard",
  inkType: ["amethyst"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 38,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_48084ac3a18c452cadbabd4675f9672b",
    tcgPlayer: 673428,
  },
  text: [
    {
      title: "CHILL OUT",
      description: "When you play this character, exert chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Super", "Villain"],
  abilities: [
    {
      id: "rfw-1",
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
        type: "exert",
      },
      name: "CHILL OUT",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "CHILL OUT When you play this character, exert chosen opposing character.",
    },
  ],
  i18n: isisVanderchillIceQueenOfStCanardI18n,
};
