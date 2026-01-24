import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodChampionOfSherwood: CharacterCard = {
  id: "1oq",
  cardType: "character",
  name: "Robin Hood",
  version: "Champion of Sherwood",
  fullName: "Robin Hood - Champion of Sherwood",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "009",
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Robin Hood.)\nSKILLED COMBATANT During your turn, whenever this character banishes another character in a challenge, gain 2 lore.\nTHE GOOD OF OTHERS When this character is banished in a challenge, you may draw a card.",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 177,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dae8c3a792a698cb6ccee25e5671d6b03e79414c",
  },
  abilities: [
    {
      id: "1oq-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3 {I}",
    },
    {
      id: "1oq-2",
      type: "triggered",
      name: "SKILLED COMBATANT",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      text: "SKILLED COMBATANT During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
    },
    {
      id: "1oq-3",
      type: "triggered",
      name: "THE GOOD OF OTHERS",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "THE GOOD OF OTHERS When this character is banished in a challenge, you may draw a card.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
