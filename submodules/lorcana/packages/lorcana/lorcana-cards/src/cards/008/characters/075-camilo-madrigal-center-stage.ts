import type { CharacterCard } from "@tcg/lorcana-types";
import { camiloMadrigalCenterStageI18n } from "./075-camilo-madrigal-center-stage.i18n";

export const camiloMadrigalCenterStage: CharacterCard = {
  id: "lBR",
  canonicalId: "ci_lBR",
  reprints: ["set8-075"],
  cardType: "character",
  name: "Camilo Madrigal",
  version: "Center Stage",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "008",
  cardNumber: 75,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0d9e3acb5cc6406c9d6965fa60d58ff6",
    tcgPlayer: 631345,
  },
  text: [
    {
      title: "ENCORE! ENCORE!",
      description: "When this character is banished in a challenge, return this card to your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    {
      id: "p4d-1",
      name: "ENCORE! ENCORE!",
      text: "ENCORE! ENCORE! When this character is banished in a challenge, return this card to your hand.",
      type: "triggered",
      sourceZones: ["play", "discard"],
      trigger: {
        event: "banish",
        on: "SELF",
        restrictions: [
          {
            type: "in-challenge",
          },
        ],
        timing: "when",
      },
      effect: {
        target: {
          ref: "self",
        },
        type: "return-to-hand",
      },
    },
  ],
  i18n: camiloMadrigalCenterStageI18n,
};
