import type { CharacterCard } from "@tcg/lorcana";

export const donaldDuckPerfectGentleman: CharacterCard = {
  id: "wjj",
  cardType: "character",
  name: "Donald Duck",
  version: "Perfect Gentleman",
  fullName: "Donald Duck - Perfect Gentleman",
  inkType: ["emerald"],
  set: "009",
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Donald Duck.)\nALLOW ME At the start of your turn, each player may draw a card.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 85,
  inkable: true,
  externalIds: {
    ravensburger: "754975b423fd73f951d33d2a0b695136a1c5e3b8",
  },
  abilities: [
    {
      id: "wjj-1",
      text: "Shift 3 {I}",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    },
    {
      id: "wjj-2",
      text: "ALLOW ME At the start of your turn, each player may draw a card.",
      name: "ALLOW ME",
      type: "triggered",
      trigger: {
        event: "start-turn",
        timing: "at",
        on: "YOU",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "EACH_PLAYER",
      },
    },
  ],
  classifications: ["Floodborn", "Ally"],
};
