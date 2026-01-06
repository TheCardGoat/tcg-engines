import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyGalumphingGumshoe: CharacterCard = {
  id: "1mo",
  cardType: "character",
  name: "Goofy",
  version: "Galumphing Gumshoe",
  fullName: "Goofy - Galumphing Gumshoe",
  inkType: ["amber"],
  set: "010",
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Goofy.)\nHOT PURSUIT When you play this character and whenever he quests, each opposing character gets -1 {S} until the start of your next turn.",
  cost: 8,
  strength: 5,
  willpower: 7,
  lore: 3,
  cardNumber: 24,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d37fb5ea97b82b11f6873b113789f17f3f37cac0",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Detective"],
};
