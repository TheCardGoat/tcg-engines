import type { CharacterCard } from "@tcg/lorcana-types";

export const trampEnterprisingDog: CharacterCard = {
  id: "dfs",
  cardType: "character",
  name: "Tramp",
  version: "Enterprising Dog",
  fullName: "Tramp - Enterprising Dog",
  inkType: ["emerald"],
  franchise: "Lady and the Tramp",
  set: "007",
  text: "HEY, PIDGE If you have a character named Lady in play, you pay 1 {I} less to play this character.\nNO TIME FOR WISECRACKS When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 110,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "306f19dbca99cea365477d3efb8420831ab5d23c",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};
