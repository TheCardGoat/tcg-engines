import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckMusketeerSpy: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        target: "EACH_OPPONENT",
        type: "discard",
      },
      id: "19a-1",
      name: "INFILTRATION",
      text: "INFILTRATION When you play this character, each opponent chooses and discards a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 11,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Musketeer"],
  cost: 4,
  externalIds: {
    ravensburger: "a34164ff051a6a764bee43f9f9096b7deeec2e20",
  },
  fullName: "Daisy Duck - Musketeer Spy",
  id: "19a",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Daisy Duck",
  set: "009",
  strength: 2,
  text: "INFILTRATION When you play this character, each opponent chooses and discards a card.",
  version: "Musketeer Spy",
  willpower: 3,
};
