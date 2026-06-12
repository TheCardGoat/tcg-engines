import type { CharacterCard } from "@tcg/lorcana-types";
import { pepaMadrigalCalmBeforeTheStormI18n } from "./056-pepa-madrigal-calm-before-the-storm.i18n";

export const pepaMadrigalCalmBeforeTheStorm: CharacterCard = {
  id: "LJg",
  canonicalId: "ci_LJg",
  reprints: ["set12-056"],
  cardType: "character",
  name: "Pepa Madrigal",
  version: "Calm Before the Storm",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 56,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_c86ece1b256b431cbc0591173b5fe042",
  },
  text: [
    {
      title: "STORMY WEATHER",
      description: "When you play this character, deal 1 damage to each of your other characters.",
    },
    {
      title: "SILVER LINING",
      description:
        "Once during your turn, whenever you remove 1 or more damage from one of your characters, draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Madrigal"],
  abilities: [
    {
      id: "LJg-1",
      name: "STORMY WEATHER",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: "YOUR_OTHER_CHARACTERS",
      },
      text: "STORMY WEATHER When you play this character, deal 1 damage to each of your other characters.",
    },
    {
      id: "LJg-2",
      name: "SILVER LINING",
      type: "triggered",
      trigger: {
        event: "remove-damage",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        sourceFilter: {
          sourceController: "you",
        },
        restrictions: [
          {
            type: "once-per-turn",
          },
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "SILVER LINING Once during your turn, whenever you remove 1 or more damage from one of your characters, draw a card.",
    },
  ],
  i18n: pepaMadrigalCalmBeforeTheStormI18n,
};
