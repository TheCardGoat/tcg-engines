import type { CharacterCard } from "@tcg/lorcana-types";
import { tadashiHamadaBaymaxInventorI18n } from "./153-tadashi-hamada-baymax-inventor.i18n";

export const tadashiHamadaBaymaxInventor: CharacterCard = {
  id: "AMb",
  canonicalId: "ci_AMb",
  reprints: ["set6-153"],
  cardType: "character",
  name: "Tadashi Hamada",
  version: "Baymax Inventor",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 153,
  rarity: "common",
  cost: 6,
  strength: 3,
  willpower: 3,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_3a009848a04944aba8e7402d221c897c",
    tcgPlayer: 588327,
  },
  text: [
    {
      title: "LET'S GET BACK TO WORK",
      description: "This character gets +1 {S} and +1 {W} for each item you have in play.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Inventor"],
  abilities: [
    {
      effect: {
        modifier: { type: "items-in-play", controller: "you" },
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "16i-1",
      name: "LET'S GET BACK TO WORK",
      text: "LET'S GET BACK TO WORK This character gets +1 {S} and +1 {W} for each item you have in play.",
      type: "static",
    },
    {
      effect: {
        modifier: { type: "items-in-play", controller: "you" },
        stat: "willpower",
        target: "SELF",
        type: "modify-stat",
      },
      id: "16i-2",
      name: "LET'S GET BACK TO WORK",
      text: "LET'S GET BACK TO WORK This character gets +1 {S} and +1 {W} for each item you have in play.",
      type: "static",
    },
  ],
  i18n: tadashiHamadaBaymaxInventorI18n,
};
