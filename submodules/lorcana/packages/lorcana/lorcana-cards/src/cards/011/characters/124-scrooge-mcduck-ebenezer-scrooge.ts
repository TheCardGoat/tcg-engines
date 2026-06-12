import type { CharacterCard } from "@tcg/lorcana-types";
import { scroogeMcduckEbenezerScroogeI18n } from "./124-scrooge-mcduck-ebenezer-scrooge.i18n";

export const scroogeMcduckEbenezerScrooge: CharacterCard = {
  id: "3lL",
  canonicalId: "ci_3lL",
  reprints: ["set11-124"],
  cardType: "character",
  name: "Scrooge McDuck",
  version: "Ebenezer Scrooge",
  inkType: ["ruby"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 124,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_a06d887649d146a89f4c56939b02ad13",
    tcgPlayer: 676214,
  },
  text: [
    {
      title: "PAYMENT DUE",
      description:
        "Whenever this character quests, each opponent loses 1 lore. Draw a card for each 1 lore lost this way.",
    },
    {
      title: "FORECLOSURE",
      description: "At the end of your turn, if an opponent has 0 lore, you gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      id: "12w-1",
      effect: {
        steps: [
          {
            amount: 1,
            target: "EACH_OPPONENT",
            type: "lose-lore",
          },
          {
            type: "for-each",
            counter: {
              type: "lore-lost",
            },
            effect: {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
          },
        ],
        type: "sequence",
      },
      name: "PAYMENT DUE",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
      text: "PAYMENT DUE Whenever this character quests, each opponent loses 1 lore. Draw a card for each 1 lore lost this way.",
    },
    {
      id: "12w-2",
      name: "FORECLOSURE",
      condition: {
        type: "target-query",
        query: {
          selector: "opponent",
          filters: [
            {
              type: "lore",
              comparison: "eq",
              value: 0,
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
      text: "FORECLOSURE At the end of your turn, if an opponent has 0 lore, you gain 1 lore.",
    },
  ],
  i18n: scroogeMcduckEbenezerScroogeI18n,
};
