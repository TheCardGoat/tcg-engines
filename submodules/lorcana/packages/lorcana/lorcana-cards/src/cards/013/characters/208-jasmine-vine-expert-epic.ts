import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineVineExpertEpicI18n } from "./208-jasmine-vine-expert-epic.i18n";

export const jasmineVineExpertEpic: CharacterCard = {
  id: "lmd",
  canonicalId: "ci_uWS",
  slug: "lorcana-ci_uWS",
  printings: [
    {
      id: "set13-208-epic",
      artId: "ci_uWS-epic",
      setCode: "set13",
      collectorNumber: "208",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set13-020"],
  cardType: "character",
  name: "Jasmine",
  version: "Vine Expert",
  inkType: ["amber"],
  franchise: "Aladdin",
  set: "013",
  cardNumber: 208,
  rarity: "epic",
  specialRarity: "epic",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_63fc4a03298a41bab40f9ce6546bf972",
    tcgPlayer: "704554",
  },
  text: [
    {
      title: "SHARED RESOURCES",
      description: "When you play this character, each player draws a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      type: "triggered",
      id: "uWS-1",
      name: "SHARED RESOURCES",
      text: "SHARED RESOURCES When you play this character, each player draws a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "EACH_PLAYER",
      },
    },
  ],
  i18n: jasmineVineExpertEpicI18n,
};
