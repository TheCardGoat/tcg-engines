import type { CharacterCard } from "@tcg/lorcana-types";
import { julietaMadrigalExcellentCookI18n } from "./013-julieta-madrigal-excellent-cook.i18n";

export const julietaMadrigalExcellentCook: CharacterCard = {
  id: "8gG",
  canonicalId: "ci_YPQ",
  reprints: ["set4-013", "set9-018"],
  cardType: "character",
  name: "Julieta Madrigal",
  version: "Excellent Cook",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 13,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e0516a7bb03e48249017bd27b84a9d92",
    tcgPlayer: 649966,
  },
  text: [
    {
      title: "SIGNATURE RECIPE",
      description:
        "When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Madrigal"],
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "remove-damage",
              amount: { type: "up-to", value: 2 },
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "optional",
              chooser: "CONTROLLER",
              effect: {
                type: "draw",
                amount: 1,
                target: "CONTROLLER",
              },
            },
          },
        ],
      },
      id: "10k-1",
      name: "SIGNATURE RECIPE",
      text: "SIGNATURE RECIPE When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: julietaMadrigalExcellentCookI18n,
};
