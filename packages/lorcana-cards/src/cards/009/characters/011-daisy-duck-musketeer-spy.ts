import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckMusketeerSpy: CharacterCard = {
  id: "19a",
  cardType: "character",
  name: "Daisy Duck",
  version: "Musketeer Spy",
  fullName: "Daisy Duck - Musketeer Spy",
  inkType: ["amber"],
  set: "009",
  text: "INFILTRATION When you play this character, each opponent chooses and discards a card.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 11,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a34164ff051a6a764bee43f9f9096b7deeec2e20",
  },
  abilities: [
    {
      id: "19a-1",
      type: "triggered",
      name: "INFILTRATION",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "discard",
        amount: 1,
        target: "EACH_OPPONENT",
        chosen: true,
      },
      text: "INFILTRATION When you play this character, each opponent chooses and discards a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
};
