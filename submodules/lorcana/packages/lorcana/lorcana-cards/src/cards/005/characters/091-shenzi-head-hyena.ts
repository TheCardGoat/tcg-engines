import type { CharacterCard } from "@tcg/lorcana-types";
import { shenziHeadHyenaI18n } from "./091-shenzi-head-hyena.i18n";

export const shenziHeadHyena: CharacterCard = {
  id: "Ggo",
  canonicalId: "ci_Ggo",
  reprints: ["set5-091"],
  cardType: "character",
  name: "Shenzi",
  version: "Head Hyena",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 91,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a4bc1bcb3ca54062af8854d9ee7a920f",
    tcgPlayer: 561169,
  },
  text: [
    {
      title: "STICK AROUND FOR DINNER",
      description: "This character gets +1 {S} for each other Hyena character you have in play.",
    },
    {
      title: "WHAT HAVE WE GOT HERE?",
      description:
        "Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Hyena"],
  abilities: [
    {
      id: "19k-1",
      text: "STICK AROUND FOR DINNER This character gets +1 {S} for each other Hyena character you have in play.",
      name: "STICK AROUND FOR DINNER",
      effect: {
        modifier: {
          classification: "Hyena",
          controller: "you",
          excludeSelf: true,
          type: "classification-character-count",
        },
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      type: "static",
    },
    {
      id: "19k-2",
      text: "WHAT HAVE WE GOT HERE? Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.",
      name: "WHAT HAVE WE GOT HERE?",
      effect: {
        amount: 2,
        target: "CONTROLLER",
        type: "gain-lore",
      },
      trigger: {
        defender: {
          filters: [
            {
              type: "damaged",
            },
          ],
        },
        event: "challenge",
        on: {
          classification: "Hyena",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: shenziHeadHyenaI18n,
};
