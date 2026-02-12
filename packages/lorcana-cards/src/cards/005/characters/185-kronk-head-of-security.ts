import type { CharacterCard } from "@tcg/lorcana-types";

export const kronkHeadOfSecurity: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "156-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
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
      id: "156-2",
      name: "ARE YOU ON THE LIST?",
      text: "ARE YOU ON THE LIST? During your turn, whenever this character banishes another character in a challenge, you may play a character with cost 5 or less for free.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 185,
  cardType: "character",
  classifications: ["Floodborn", "Ally", "Captain"],
  cost: 7,
  externalIds: {
    ravensburger: "94767179059f954952263718c06a54472353a854",
  },
  franchise: "Emperors New Groove",
  fullName: "Kronk - Head of Security",
  id: "156",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Kronk",
  set: "005",
  strength: 6,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Kronk.)\nARE YOU ON THE LIST? During your turn, whenever this character banishes another character in a challenge, you may play a character with cost 5 or less for free.",
  version: "Head of Security",
  willpower: 6,
};
