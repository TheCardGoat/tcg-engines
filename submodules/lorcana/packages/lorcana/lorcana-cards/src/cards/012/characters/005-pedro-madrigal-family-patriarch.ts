import type { CharacterCard } from "@tcg/lorcana-types";
import { pedroMadrigalFamilyPatriarchI18n } from "./005-pedro-madrigal-family-patriarch.i18n";

export const pedroMadrigalFamilyPatriarch: CharacterCard = {
  id: "XlE",
  canonicalId: "ci_XlE",
  reprints: ["set12-005"],
  cardType: "character",
  name: "Pedro Madrigal",
  version: "Family Patriarch",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 5,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_91ca0b124f3a401faaf0926a24588af5",
  },
  text: [
    {
      title: "DIFFICULT JOURNEY",
      description: "This character enters play with 1 damage.",
    },
    {
      title: "DEVOTED FAMILY",
      description:
        "When you play this character, if you have another Madrigal character in play, you may remove up to 1 damage from him.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    {
      id: "XlE-1",
      name: "DIFFICULT JOURNEY",
      type: "static",
      text: "DIFFICULT JOURNEY This character enters play with 1 damage.",
      effect: {
        type: "enters-with-damage",
        amount: 1,
      },
    },
    {
      id: "XlE-2",
      name: "DEVOTED FAMILY",
      type: "triggered",
      text: "DEVOTED FAMILY When you play this character, if you have another Madrigal character in play, you may remove up to 1 damage from him.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "has-character-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 1,
        classification: "Madrigal",
        excludeSelf: true,
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "remove-damage",
          amount: {
            type: "up-to",
            value: 1,
          },
          target: "SELF",
        },
      },
    },
  ],
  i18n: pedroMadrigalFamilyPatriarchI18n,
};
