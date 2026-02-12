import type { CharacterCard } from "@tcg/lorcana-types";

export const doloresMadrigalEasyListener: CharacterCard = {
  abilities: [
    {
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
      id: "n9k-1",
      name: "MAGICAL INFORMANT",
      text: "MAGICAL INFORMANT When you play this character, if an opponent has an exerted character in play, you may draw a card.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 51,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Madrigal"],
  cost: 4,
  externalIds: {
    ravensburger: "53da4f0c1b3221702b9e1d136cfd17647184e627",
  },
  franchise: "Encanto",
  fullName: "Dolores Madrigal - Easy Listener",
  id: "n9k",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  name: "Dolores Madrigal",
  set: "009",
  strength: 3,
  text: "MAGICAL INFORMANT When you play this character, if an opponent has an exerted character in play, you may draw a card.",
  version: "Easy Listener",
  willpower: 3,
};
