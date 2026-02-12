import type { CharacterCard } from "@tcg/lorcana-types";

export const fredMascotByDay: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "1h1-1",
      name: "HOW COOL IS THAT",
      text: "HOW COOL IS THAT Whenever this character is challenged, gain 2 lore.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 75,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 1,
  externalIds: {
    ravensburger: "05562e0fc692cd80e28bb8a07a9507dde98c18a0",
  },
  franchise: "Big Hero 6",
  fullName: "Fred - Mascot by Day",
  id: "1h1",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Fred",
  set: "006",
  strength: 1,
  text: "HOW COOL IS THAT Whenever this character is challenged, gain 2 lore.",
  version: "Mascot by Day",
  willpower: 1,
};
