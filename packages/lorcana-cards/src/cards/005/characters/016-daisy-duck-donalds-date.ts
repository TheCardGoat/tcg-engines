import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckDonaldsDate: CharacterCard = {
  id: "czn",
  cardType: "character",
  name: "Daisy Duck",
  version: "Donald's Date",
  fullName: "Daisy Duck - Donald's Date",
  inkType: ["amber"],
  set: "005",
  text: "BIG PRIZE Whenever this character quests, each opponent reveals the top card of their deck. If it's a character card, they may put it into their hand. Otherwise, they put it on the bottom of their deck.",
  cost: 1,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 16,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2ed178001e5757cae12c87f032cde03a7dc7948f",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};
