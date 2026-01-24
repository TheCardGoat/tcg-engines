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
  missingTests: true,
  externalIds: {
    ravensburger: "d37fb5ea97b82b11f6873b113789f17f3f37cac0",
  },
  abilities: [
    {
      id: "1mo-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5 {I}",
    },
    {
      id: "1mo-2",
      type: "triggered",
      name: "HOT PURSUIT When you play this character and",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
      },
      text: "HOT PURSUIT When you play this character and whenever he quests, each opposing character gets -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Detective"],
};
