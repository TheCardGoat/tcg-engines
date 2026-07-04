import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineVineExpertI18n } from "./020-jasmine-vine-expert.i18n";

export const jasmineVineExpert: CharacterCard = {
  id: "uWS",
  canonicalId: "ci_uWS",
  slug: "lorcana-ci_uWS",
  printings: [
    {
      id: "set13-020",
      artId: "set13-020",
      setCode: "set13",
      collectorNumber: "20",
      rarity: "common",
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
  cardNumber: 20,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_63fc4a03298a41bab40f9ce6546bf972",
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
  i18n: jasmineVineExpertI18n,
};
