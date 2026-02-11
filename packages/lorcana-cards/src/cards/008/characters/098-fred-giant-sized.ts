import type { CharacterCard } from "@tcg/lorcana-types";

export const fredGiantsized: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1d3-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      effect: {
        type: "shuffle-into-deck",
        target: "CHOSEN_CHARACTER",
        intoDeck: "owner",
      },
      id: "1d3-2",
      name: "I LIKE WHERE THIS IS HEADING",
      text: "I LIKE WHERE THIS IS HEADING Whenever this character quests, reveal cards from the top of your deck until you reveal a Floodborn character card. Put that card into your hand and shuffle the rest into your deck.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 98,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 7,
  externalIds: {
    ravensburger: "b251af6ff8f7c4f65248576fe4c9c6d0cb47cdf1",
  },
  franchise: "Big Hero 6",
  fullName: "Fred - Giant-Sized",
  id: "1d3",
  inkType: ["emerald"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Fred",
  set: "008",
  strength: 5,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Fred.)\nI LIKE WHERE THIS IS HEADING Whenever this character quests, reveal cards from the top of your deck until you reveal a Floodborn character card. Put that card into your hand and shuffle the rest into your deck.",
  version: "Giant-Sized",
  willpower: 6,
};
