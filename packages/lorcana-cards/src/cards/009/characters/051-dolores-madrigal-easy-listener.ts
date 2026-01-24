import type { CharacterCard } from "@tcg/lorcana-types";

export const doloresMadrigalEasyListener: CharacterCard = {
  id: "n9k",
  cardType: "character",
  name: "Dolores Madrigal",
  version: "Easy Listener",
  fullName: "Dolores Madrigal - Easy Listener",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "009",
  text: "MAGICAL INFORMANT When you play this character, if an opponent has an exerted character in play, you may draw a card.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 51,
  inkable: true,
  externalIds: {
    ravensburger: "53da4f0c1b3221702b9e1d136cfd17647184e627",
  },
  abilities: [
    {
      id: "n9k-1",
      type: "triggered",
      name: "MAGICAL INFORMANT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "an opponent has an exerted character in play",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "MAGICAL INFORMANT When you play this character, if an opponent has an exerted character in play, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};
