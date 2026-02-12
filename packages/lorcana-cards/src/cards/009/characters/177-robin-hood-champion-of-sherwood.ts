import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodChampionOfSherwood: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "1oq-1",
      keyword: "Shift",
      text: "Shift 3 {I}",
      type: "keyword",
    },
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "1oq-2",
      name: "SKILLED COMBATANT",
      text: "SKILLED COMBATANT During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
      trigger: {
        event: "banish",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "1oq-3",
      name: "THE GOOD OF OTHERS",
      text: "THE GOOD OF OTHERS When this character is banished in a challenge, you may draw a card.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 177,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "dae8c3a792a698cb6ccee25e5671d6b03e79414c",
  },
  franchise: "Robin Hood",
  fullName: "Robin Hood - Champion of Sherwood",
  id: "1oq",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Robin Hood",
  set: "009",
  strength: 3,
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Robin Hood.)\nSKILLED COMBATANT During your turn, whenever this character banishes another character in a challenge, gain 2 lore.\nTHE GOOD OF OTHERS When this character is banished in a challenge, you may draw a card.",
  version: "Champion of Sherwood",
  willpower: 6,
};
