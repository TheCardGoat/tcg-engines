import type { CharacterCard } from "@tcg/lorcana-types";

export const adorabeezleWinterpopIceRocketRacer: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "zbp-1",
      text: "KEEP DRIVING While this character has damage, she gets +1 {L}.",
      type: "static",
    },
  ],
  cardNumber: 116,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Racer"],
  cost: 3,
  externalIds: {
    ravensburger: "7f503ec5fca52d7edab45e335055d55e8ba18ad6",
  },
  franchise: "Wreck It Ralph",
  fullName: "Adorabeezle Winterpop - Ice Rocket Racer",
  id: "zbp",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Adorabeezle Winterpop",
  set: "006",
  strength: 1,
  text: "KEEP DRIVING While this character has damage, she gets +1 {L}.",
  version: "Ice Rocket Racer",
  willpower: 5,
};
