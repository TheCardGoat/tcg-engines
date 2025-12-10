import type { CharacterCard } from "@tcg/lorcana";

export const shenziHeadHyena: CharacterCard = {
  id: "19k",
  cardType: "character",
  name: "Shenzi",
  version: "Head Hyena",
  fullName: "Shenzi - Head Hyena",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  text: "STICK AROUND FOR DINNER This character gets +1 {S} for each other Hyena character you have in play.\nWHAT HAVE WE GOT HERE? Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 1,
  cardNumber: 91,
  inkable: true,
  externalIds: {
    ravensburger: "a43275cadb3c2ca378ed736dd05c7340b53c39e7",
  },
  abilities: [
    {
      id: "19k-1",
      text: "STICK AROUND FOR DINNER This character gets +1 {S} for each other Hyena character you have in play.",
      name: "STICK AROUND FOR DINNER",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: {
          type: "classification-character-count",
          classification: "Hyena",
          controller: "you",
        },
        target: "SELF",
      },
    },
    {
      id: "19k-2",
      text: "WHAT HAVE WE GOT HERE? Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.",
      name: "WHAT HAVE WE GOT HERE?",
      type: "triggered",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: {
          filters: [
            { type: "owner", owner: "you" },
            { type: "has-classification", classification: "Hyena" },
          ],
        },
        defender: {
          filters: [{ type: "damaged" }],
        },
      },
      effect: {
        type: "gain-lore",
        amount: 0,
      },
    },
  ],
  classifications: ["Storyborn", "Ally", "Hyena"],
};
