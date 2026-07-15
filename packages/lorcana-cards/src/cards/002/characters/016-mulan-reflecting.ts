import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanReflecting: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "1ox-1",
      keyword: "Shift",
      text: "Shift 2",
      type: "keyword",
    },
    {
      effect: {
        condition: {
          expression: "it's a song card",
          type: "if",
        },
        then: {
          cost: "free",
          from: "hand",
          type: "play-card",
        },
        type: "conditional",
      },
      id: "1ox-2",
      name: "HONOR TO THE ANCESTORS",
      text: "HONOR TO THE ANCESTORS Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 16,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "dba0b0c949ec8f04e71f20cf8f771c414b558411",
  },
  franchise: "Mulan",
  fullName: "Mulan - Reflecting",
  id: "1ox",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Mulan",
  set: "002",
  strength: 3,
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Mulan.)\nHONOR TO THE ANCESTORS Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.",
  version: "Reflecting",
  willpower: 3,
};
