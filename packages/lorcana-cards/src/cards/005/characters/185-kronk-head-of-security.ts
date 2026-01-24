import type { CharacterCard } from "@tcg/lorcana-types";

export const kronkHeadOfSecurity: CharacterCard = {
  id: "156",
  cardType: "character",
  name: "Kronk",
  version: "Head of Security",
  fullName: "Kronk - Head of Security",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "005",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Kronk.)\nARE YOU ON THE LIST? During your turn, whenever this character banishes another character in a challenge, you may play a character with cost 5 or less for free.",
  cost: 7,
  strength: 6,
  willpower: 6,
  lore: 1,
  cardNumber: 185,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "94767179059f954952263718c06a54472353a854",
  },
  abilities: [
    {
      id: "156-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
    {
      id: "156-2",
      type: "triggered",
      name: "ARE YOU ON THE LIST?",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 5,
          },
        },
        chooser: "CONTROLLER",
      },
      text: "ARE YOU ON THE LIST? During your turn, whenever this character banishes another character in a challenge, you may play a character with cost 5 or less for free.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Captain"],
};
