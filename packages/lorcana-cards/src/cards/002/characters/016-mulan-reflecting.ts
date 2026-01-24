import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanReflecting: CharacterCard = {
  id: "1ox",
  cardType: "character",
  name: "Mulan",
  version: "Reflecting",
  fullName: "Mulan - Reflecting",
  inkType: ["amber"],
  franchise: "Mulan",
  set: "002",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Mulan.)\nHONOR TO THE ANCESTORS Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 16,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dba0b0c949ec8f04e71f20cf8f771c414b558411",
  },
  abilities: [
    {
      id: "1ox-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
      text: "Shift 2",
    },
    {
      id: "1ox-2",
      type: "triggered",
      name: "HONOR TO THE ANCESTORS",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "it's a song card",
        },
        then: {
          type: "play-card",
          from: "hand",
          cost: "free",
        },
      },
      text: "HONOR TO THE ANCESTORS Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
};
