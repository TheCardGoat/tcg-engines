import type { CharacterCard } from "@tcg/lorcana-types";

export const nickWildeSlyFox: CharacterCard = {
  id: "jsd",
  cardType: "character",
  name: "Nick Wilde",
  version: "Sly Fox",
  fullName: "Nick Wilde - Sly Fox",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "006",
  text: "Shift 1 (You may pay 1 {I} to play this on top of one of your characters named Nick Wilde.)\nCAN'T TOUCH ME While you have an item in play, this character can't be challenged.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 150,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4751ba64de3e64839f07b1768815e5a2c4b2186c",
  },
  abilities: [
    {
      id: "jsd-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 1,
      },
      text: "Shift 1",
    },
    {
      id: "jsd-2",
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
      text: "CAN'T TOUCH ME While you have an item in play, this character can't be challenged.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
};
