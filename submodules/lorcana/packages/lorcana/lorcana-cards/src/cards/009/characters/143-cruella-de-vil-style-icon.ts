import type { CharacterCard } from "@tcg/lorcana-types";
import { cruellaDeVilStyleIconI18n } from "./143-cruella-de-vil-style-icon.i18n";

export const cruellaDeVilStyleIcon: CharacterCard = {
  id: "PDx",
  canonicalId: "ci_J5u",
  reprints: ["set9-143"],
  cardType: "character",
  name: "Cruella De Vil",
  version: "Style Icon",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "009",
  cardNumber: 143,
  rarity: "legendary",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_f5d62175b09243eda1bf9f34ea01d884",
    tcgPlayer: 651120,
  },
  text: [
    {
      title: "OUT OF SEASON",
      description:
        "Once during your turn, whenever a character with cost 2 or less is banished, put the top card of your deck into your inkwell facedown and exerted.",
    },
    {
      title: "INSULTING REMARK",
      description: "During your turn, each opposing character with cost 2 or less gets -1 {S}.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        exerted: true,
        facedown: true,
        source: "top-of-deck",
        target: "CONTROLLER",
        type: "put-into-inkwell",
      },
      id: "1r1-1",
      name: "OUT OF SEASON",
      text: "OUT OF SEASON Once during your turn, whenever a character with cost 2 or less is banished, put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        on: {
          cardType: "character",
          filters: [
            {
              type: "cost-comparison",
              comparison: "less-or-equal",
              value: 2,
            },
          ],
        },
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      condition: {
        type: "during-turn",
        whose: "your",
      },
      effect: {
        modifier: -1,
        stat: "strength",
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "cost-comparison",
              comparison: "less-or-equal",
              value: 2,
            },
          ],
        },
        type: "modify-stat",
      },
      id: "1r1-2",
      name: "INSULTING REMARK",
      text: "INSULTING REMARK During your turn, each opposing character with cost 2 or less gets -1 {S}.",
      type: "static",
    },
  ],
  i18n: cruellaDeVilStyleIconI18n,
};
