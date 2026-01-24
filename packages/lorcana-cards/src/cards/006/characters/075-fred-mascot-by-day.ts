import type { CharacterCard } from "@tcg/lorcana-types";

export const fredMascotByDay: CharacterCard = {
  id: "1h1",
  cardType: "character",
  name: "Fred",
  version: "Mascot by Day",
  fullName: "Fred - Mascot by Day",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  text: "HOW COOL IS THAT Whenever this character is challenged, gain 2 lore.",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 75,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "05562e0fc692cd80e28bb8a07a9507dde98c18a0",
  },
  abilities: [
    {
      id: "1h1-1",
      type: "triggered",
      name: "HOW COOL IS THAT",
      trigger: {
        event: "challenged",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      text: "HOW COOL IS THAT Whenever this character is challenged, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
