import type { CharacterCard } from "@tcg/lorcana-types";
import { mauriceUnconventionalInventorI18n } from "./138-maurice-unconventional-inventor.i18n";

export const mauriceUnconventionalInventor: CharacterCard = {
  id: "1FE",
  canonicalId: "ci_1FE",
  reprints: ["set7-138"],
  cardType: "character",
  name: "Maurice",
  version: "Unconventional Inventor",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "007",
  cardNumber: 138,
  rarity: "rare",
  cost: 4,
  strength: 5,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a02f616f960243249461ac40a8beb36c",
    tcgPlayer: 619483,
  },
  text: [
    {
      title: "HOW ON EARTH DID THAT HAPPEN?",
      description:
        "When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice's Machine, you may also banish chosen character with 2 {S} or less.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Inventor"],
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "banish",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["item"],
              },
            },
          },
          {
            type: "conditional",
            condition: { type: "if-you-do" },
            then: {
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "is-named",
              name: "Maurice's Machine",
              target: "previous-target",
            },
            then: {
              type: "optional",
              chooser: "CONTROLLER",
              effect: {
                type: "banish",
                target: {
                  selector: "chosen",
                  count: 1,
                  owner: "any",
                  zones: ["play"],
                  cardTypes: ["character"],
                  filter: [
                    {
                      type: "strength-comparison",
                      comparison: "less-or-equal",
                      value: 2,
                    },
                  ],
                },
              },
            },
          },
        ],
      },
      id: "sgs-1",
      name: "HOW ON EARTH DID THAT HAPPEN?",
      text: "HOW ON EARTH DID THAT HAPPEN? When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice's Machine, you may also banish chosen character with 2 {S} or less.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: mauriceUnconventionalInventorI18n,
};
