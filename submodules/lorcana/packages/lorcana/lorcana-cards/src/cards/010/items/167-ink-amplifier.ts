import type { ItemCard } from "@tcg/lorcana-types";
import { inkAmplifierI18n } from "./167-ink-amplifier.i18n";

export const inkAmplifier: ItemCard = {
  id: "rjo",
  canonicalId: "ci_rjo",
  reprints: ["set10-167"],
  cardType: "item",
  name: "Ink Amplifier",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "010",
  cardNumber: 167,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_999386b36e224d6b9c1693142b62a20c",
    tcgPlayer: 658883,
  },
  text: [
    {
      title: "ENERGY CAPTURE",
      description:
        "Whenever an opponent draws a card during their turn, if it's the second card they've drawn this turn, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          source: "top-of-deck",
          target: "CONTROLLER",
          type: "put-into-inkwell",
          exerted: true,
          facedown: true,
        },
        type: "optional",
      },
      id: "rjo-1",
      name: "ENERGY CAPTURE",
      text: "ENERGY CAPTURE Whenever an opponent draws a card during their turn, if it's the second card they've drawn this turn, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "draw",
        on: "OPPONENT",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "opponent",
          },
        ],
        condition: {
          type: "turn-metric",
          metric: "cards-drawn-by-player",
          playerScope: "opponent",
          comparison: {
            operator: "eq",
            value: 2,
          },
        },
      },
      type: "triggered",
    },
  ],
  i18n: inkAmplifierI18n,
};
