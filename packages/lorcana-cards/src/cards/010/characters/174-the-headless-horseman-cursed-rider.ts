import type { CharacterCard } from "@tcg/lorcana-types";

export const theHeadlessHorsemanCursedRider: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1xu-1",
      keyword: "Shift",
      text: "Shift 5 {I}",
      type: "keyword",
    },
    {
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
      id: "1xu-2",
      name: "WITCHING HOUR",
      text: "WITCHING HOUR When you play this character, each player draws 3 cards, then discards 3 cards at random. Choose an opposing character and deal 2 damage to them for each action card discarded this way.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 174,
  cardType: "character",
  classifications: ["Floodborn", "Villain"],
  cost: 8,
  externalIds: {
    ravensburger: "fbb6977c78837de7431436c9a91dcd55431e7847",
  },
  franchise: "Sleepy Hollow",
  fullName: "The Headless Horseman - Cursed Rider",
  id: "1xu",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "The Headless Horseman",
  set: "010",
  strength: 5,
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named The Headless Horseman.)\nWITCHING HOUR When you play this character, each player draws 3 cards, then discards 3 cards at random. Choose an opposing character and deal 2 damage to them for each action card discarded this way.",
  version: "Cursed Rider",
  willpower: 7,
};
