import type { CharacterCard } from "@tcg/lorcana-types";
import { snowWhiteFairestInTheLandI18n } from "./033-snow-white-fairest-in-the-land.i18n";

export const snowWhiteFairestInTheLand: CharacterCard = {
  id: "3bd",
  canonicalId: "ci_3bd",
  reprints: ["set7-033"],
  cardType: "character",
  name: "Snow White",
  version: "Fairest in the Land",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "007",
  cardNumber: 33,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2f6b2d82972a4c47aca9ebf61a664045",
    tcgPlayer: 619425,
  },
  text: [
    {
      title: "HIDDEN AWAY",
      description: "This character can't be challenged.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        restriction: "cant-be-challenged",
        target: "SELF",
        type: "restriction",
      },
      id: "1wd-1",
      name: "HIDDEN AWAY",
      text: "HIDDEN AWAY This character can't be challenged.",
      type: "static",
    },
  ],
  i18n: snowWhiteFairestInTheLandI18n,
};
