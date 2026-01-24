import type { CharacterCard } from "@tcg/lorcana-types";

export const theHeadlessHorsemanCursedRider: CharacterCard = {
  id: "1xu",
  cardType: "character",
  name: "The Headless Horseman",
  version: "Cursed Rider",
  fullName: "The Headless Horseman - Cursed Rider",
  inkType: ["steel"],
  franchise: "Sleepy Hollow",
  set: "010",
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named The Headless Horseman.)\nWITCHING HOUR When you play this character, each player draws 3 cards, then discards 3 cards at random. Choose an opposing character and deal 2 damage to them for each action card discarded this way.",
  cost: 8,
  strength: 5,
  willpower: 7,
  lore: 2,
  cardNumber: 174,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fbb6977c78837de7431436c9a91dcd55431e7847",
  },
  abilities: [
    {
      id: "1xu-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5 {I}",
    },
    {
      id: "1xu-2",
      type: "triggered",
      name: "WITCHING HOUR",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 3,
            target: "EACH_PLAYER",
          },
          {
            type: "deal-damage",
            amount: 2,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["card"],
            },
          },
        ],
      },
      text: "WITCHING HOUR When you play this character, each player draws 3 cards, then discards 3 cards at random. Choose an opposing character and deal 2 damage to them for each action card discarded this way.",
    },
  ],
  classifications: ["Floodborn", "Villain"],
};
