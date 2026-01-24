import type { CharacterCard } from "@tcg/lorcana-types";

export const mrSmeeCaptainOfTheJollyRoger: CharacterCard = {
  id: "1wp",
  cardType: "character",
  name: "Mr. Smee",
  version: "Captain of the Jolly Roger",
  fullName: "Mr. Smee - Captain of the Jolly Roger",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "006",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mr. Smee.)\nRAISE THE COLORS When you play this character, you may deal damage to chosen character equal to the number of your other Pirate characters in play.",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 176,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f79d27f85394475fadaea68266df26fd8324d52f",
  },
  abilities: [
    {
      id: "1wp-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
  ],
  classifications: ["Floodborn", "Villain", "Pirate", "Captain"],
};
