import type { CharacterCard } from "@tcg/lorcana-types";
import { clarabelleLightOnHerHoovesI18n } from "./084-clarabelle-light-on-her-hooves.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const clarabelleLightOnHerHooves: CharacterCard = {
  id: "RGJ",
  canonicalId: "ci_fF6",
  reprints: ["set5-084"],
  cardType: "character",
  name: "Clarabelle",
  version: "Light on Her Hooves",
  inkType: ["emerald"],
  set: "005",
  cardNumber: 84,
  rarity: "legendary",
  cost: 7,
  strength: 5,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_8dbe711cfb4541309eb32cf37fe48997",
    tcgPlayer: 561991,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "KEEP IN STEP",
      description:
        "At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [
    shift(5),
    {
      id: "RGJ-1",
      name: "KEEP IN STEP",
      text: "KEEP IN STEP At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.",
      type: "triggered",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "comparison",
        left: {
          type: "cards-in-hand",
          controller: "opponent",
        },
        comparison: "greater-than",
        right: {
          type: "cards-in-hand",
          controller: "you",
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          target: "CONTROLLER",
          amount: {
            type: "difference",
            left: {
              type: "cards-in-hand",
              controller: "you",
            },
            right: {
              type: "cards-in-hand",
              controller: "opponent",
            },
            invert: true,
          },
        },
      },
    },
  ],
  i18n: clarabelleLightOnHerHoovesI18n,
};
