import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyGalumphingGumshoe: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1mo-1",
      keyword: "Shift",
      text: "Shift 5 {I}",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
      },
      id: "1mo-2",
      name: "HOT PURSUIT When you play this character and",
      text: "HOT PURSUIT When you play this character and whenever he quests, each opposing character gets -1 {S} until the start of your next turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 24,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Detective"],
  cost: 8,
  externalIds: {
    ravensburger: "d37fb5ea97b82b11f6873b113789f17f3f37cac0",
  },
  fullName: "Goofy - Galumphing Gumshoe",
  id: "1mo",
  inkType: ["amber"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Goofy",
  set: "010",
  strength: 5,
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Goofy.)\nHOT PURSUIT When you play this character and whenever he quests, each opposing character gets -1 {S} until the start of your next turn.",
  version: "Galumphing Gumshoe",
  willpower: 7,
};
