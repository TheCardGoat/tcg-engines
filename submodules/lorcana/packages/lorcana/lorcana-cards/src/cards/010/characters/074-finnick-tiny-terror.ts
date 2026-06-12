import type { CharacterCard } from "@tcg/lorcana-types";
import { finnickTinyTerrorI18n } from "./074-finnick-tiny-terror.i18n";

export const finnickTinyTerror: CharacterCard = {
  id: "oXH",
  canonicalId: "ci_oXH",
  reprints: ["set10-074"],
  cardType: "character",
  name: "Finnick",
  version: "Tiny Terror",
  inkType: ["emerald"],
  franchise: "Zootropolis",
  set: "010",
  cardNumber: 74,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c9465de418104f1fab0483d5c168266b",
    tcgPlayer: 658876,
  },
  text: [
    {
      title: "YOU BETTER RUN",
      description:
        "When you play this character, you may pay 2 {I} to return chosen opposing character with 2 {S} or less to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 2,
          },
          effect: {
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
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
            type: "return-to-hand",
          },
        },
        type: "optional",
      },
      id: "1ee-1",
      name: "YOU BETTER RUN",
      text: "YOU BETTER RUN When you play this character, you may pay 2 {I} to return chosen opposing character with 2 {S} or less to their player's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: finnickTinyTerrorI18n,
};
