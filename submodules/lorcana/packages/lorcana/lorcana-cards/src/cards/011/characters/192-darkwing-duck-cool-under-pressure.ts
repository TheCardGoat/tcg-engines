import type { CharacterCard } from "@tcg/lorcana-types";
import { darkwingDuckCoolUnderPressureI18n } from "./192-darkwing-duck-cool-under-pressure.i18n";

export const darkwingDuckCoolUnderPressure: CharacterCard = {
  id: "snt",
  canonicalId: "ci_EU8",
  reprints: ["set11-192"],
  cardType: "character",
  name: "Darkwing Duck",
  version: "Cool Under Pressure",
  inkType: ["steel"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 192,
  rarity: "legendary",
  cost: 7,
  strength: 6,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_789d5871174e4da293165a39bdfece14",
    tcgPlayer: 677170,
  },
  text: [
    {
      title: "Shift 5 {I}",
    },
    {
      title: "TAKE THAT!",
      description:
        "During your turn, whenever an item is banished, you may pay 1 {I} to deal 2 damage to chosen character.",
    },
    {
      title: "EVILDOERS BEWARE!",
      description: "This character can challenge ready Villain characters.",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero", "Detective"],
  abilities: [
    {
      id: "snt-1",
      cost: {
        ink: 5,
      },
      keyword: "Shift",
      text: "Shift 5 {I}",
      type: "keyword",
    },
    {
      id: "snt-2",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 1,
          },
          effect: {
            amount: 2,
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "deal-damage",
          },
        },
        type: "optional",
      },
      name: "TAKE THAT!",
      text: "TAKE THAT! During your turn, whenever an item is banished, you may pay 1 {I} to deal 2 damage to chosen character.",
      trigger: {
        event: "banish",
        on: "ANY_ITEM",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      id: "snt-3",
      effect: {
        ability: {
          classification: "Villain",
          type: "can-challenge-ready",
        },
        target: "SELF",
        type: "grant-ability",
      },
      name: "EVILDOERS BEWARE!",
      text: "EVILDOERS BEWARE! This character can challenge ready Villain characters.",
      type: "static",
    },
  ],
  i18n: darkwingDuckCoolUnderPressureI18n,
};
