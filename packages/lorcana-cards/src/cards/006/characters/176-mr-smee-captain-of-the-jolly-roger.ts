import type { CharacterCard } from "@tcg/lorcana-types";

export const mrSmeeCaptainOfTheJollyRoger: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1wp-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
  ],
  cardNumber: 176,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Pirate", "Captain"],
  cost: 6,
  externalIds: {
    ravensburger: "f79d27f85394475fadaea68266df26fd8324d52f",
  },
  franchise: "Peter Pan",
  fullName: "Mr. Smee - Captain of the Jolly Roger",
  id: "1wp",
  inkType: ["steel"],
  inkable: false,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Mr. Smee",
  set: "006",
  strength: 3,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mr. Smee.)\nRAISE THE COLORS When you play this character, you may deal damage to chosen character equal to the number of your other Pirate characters in play.",
  version: "Captain of the Jolly Roger",
  willpower: 6,
};
