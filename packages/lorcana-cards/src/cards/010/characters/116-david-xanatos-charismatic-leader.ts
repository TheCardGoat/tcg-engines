import type { CharacterCard } from "@tcg/lorcana-types";

export const davidXanatosCharismaticLeader: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      id: "1jd-1",
      name: "LEARN FROM EVERYTHING",
      text: "LEARN FROM EVERYTHING During your turn, whenever one of your characters is banished, draw a card.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "SELF",
        duration: "this-turn",
      },
      id: "1jd-2",
      name: "WHAT ARE YOU WAITING FOR?",
      text: "WHAT ARE YOU WAITING FOR? Whenever this character quests, chosen character gains Rush this turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 116,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 6,
  externalIds: {
    ravensburger: "c792b4865fb6b929492c9c03e4c01fa833fe5d12",
  },
  franchise: "Gargoyles",
  fullName: "David Xanatos - Charismatic Leader",
  id: "1jd",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "David Xanatos",
  set: "010",
  strength: 5,
  text: "LEARN FROM EVERYTHING During your turn, whenever one of your characters is banished, draw a card.\nWHAT ARE YOU WAITING FOR? Whenever this character quests, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  version: "Charismatic Leader",
  willpower: 5,
};
