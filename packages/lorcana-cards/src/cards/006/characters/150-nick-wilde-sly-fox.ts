import type { CharacterCard } from "@tcg/lorcana-types";

export const nickWildeSlyFox: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 1,
      },
      id: "jsd-1",
      keyword: "Shift",
      text: "Shift 1",
      type: "keyword",
    },
    {
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
      id: "jsd-2",
      text: "CAN'T TOUCH ME While you have an item in play, this character can't be challenged.",
      type: "action",
    },
  ],
  cardNumber: 150,
  cardType: "character",
  classifications: ["Floodborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "4751ba64de3e64839f07b1768815e5a2c4b2186c",
  },
  franchise: "Zootropolis",
  fullName: "Nick Wilde - Sly Fox",
  id: "jsd",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Nick Wilde",
  set: "006",
  strength: 1,
  text: "Shift 1 (You may pay 1 {I} to play this on top of one of your characters named Nick Wilde.)\nCAN'T TOUCH ME While you have an item in play, this character can't be challenged.",
  version: "Sly Fox",
  willpower: 3,
};
