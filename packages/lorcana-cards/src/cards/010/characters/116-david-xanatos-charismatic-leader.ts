import type { CharacterCard } from "@tcg/lorcana-types";

export const davidXanatosCharismaticLeader: CharacterCard = {
  id: "1jd",
  cardType: "character",
  name: "David Xanatos",
  version: "Charismatic Leader",
  fullName: "David Xanatos - Charismatic Leader",
  inkType: ["ruby"],
  franchise: "Gargoyles",
  set: "010",
  text: "LEARN FROM EVERYTHING During your turn, whenever one of your characters is banished, draw a card.\nWHAT ARE YOU WAITING FOR? Whenever this character quests, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 116,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c792b4865fb6b929492c9c03e4c01fa833fe5d12",
  },
  abilities: [
    {
      id: "1jd-1",
      type: "triggered",
      name: "LEARN FROM EVERYTHING",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "LEARN FROM EVERYTHING During your turn, whenever one of your characters is banished, draw a card.",
    },
    {
      id: "1jd-2",
      type: "triggered",
      name: "WHAT ARE YOU WAITING FOR?",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "SELF",
        duration: "this-turn",
      },
      text: "WHAT ARE YOU WAITING FOR? Whenever this character quests, chosen character gains Rush this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
