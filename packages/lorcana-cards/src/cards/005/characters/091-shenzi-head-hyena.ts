import type { CharacterCard } from "@tcg/lorcana-types";

export const shenziHeadHyena: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: {
          type: "classification-character-count",
          classification: "Hyena",
          controller: "you",
        },
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "19k-1",
      name: "STICK AROUND FOR DINNER",
      text: "STICK AROUND FOR DINNER This character gets +1 {S} for each other Hyena character you have in play.",
      type: "static",
    },
    {
      effect: {
        amount: 0,
        type: "gain-lore",
      },
      id: "19k-2",
      name: "WHAT HAVE WE GOT HERE?",
      text: "WHAT HAVE WE GOT HERE? Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.",
      trigger: {
        challengeContext: {
          role: "attacker",
          filters: [{ type: "damaged" }],
        },
        event: "challenge",
        on: {
          controller: "you",
          classification: "Hyena",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 91,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Hyena"],
  cost: 5,
  externalIds: {
    ravensburger: "a43275cadb3c2ca378ed736dd05c7340b53c39e7",
  },
  franchise: "Lion King",
  fullName: "Shenzi - Head Hyena",
  id: "19k",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  name: "Shenzi",
  set: "005",
  strength: 3,
  text: "STICK AROUND FOR DINNER This character gets +1 {S} for each other Hyena character you have in play.\nWHAT HAVE WE GOT HERE? Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.",
  version: "Head Hyena",
  willpower: 6,
};
