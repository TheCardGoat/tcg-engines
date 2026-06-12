import type { ItemCard } from "@tcg/lorcana-types";
import { darkwingsGasDeviceI18n } from "./169-darkwings-gas-device.i18n";

export const darkwingsGasDevice: ItemCard = {
  id: "15l",
  canonicalId: "ci_15l",
  reprints: ["set11-169"],
  cardType: "item",
  name: "Darkwing's Gas Device",
  inkType: ["sapphire"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 169,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_51455b45e452420caabc777bd7bd1ee5",
    tcgPlayer: 676233,
  },
  text: [
    {
      title: "BLINDING CLOUD",
      description:
        "{E}, 1 {I} — Chosen character gets -1 {S} this turn. If you have a character named Darkwing Duck in play, chosen character gets -2 {S} this turn instead.",
    },
  ],
  abilities: [
    {
      id: "1uv-1",
      name: "BLINDING CLOUD",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        condition: {
          type: "has-named-character",
          controller: "you",
          name: "Darkwing Duck",
        },
        then: {
          modifier: -2,
          stat: "strength",
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "modify-stat",
          duration: "this-turn",
        },
        else: {
          modifier: -1,
          stat: "strength",
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "modify-stat",
          duration: "this-turn",
        },
        type: "conditional",
      },
      text: "BLINDING CLOUD {E}, 1 {I} — Chosen character gets -1 {S} this turn. If you have a character named Darkwing Duck in play, chosen character gets -2 {S} this turn instead.",
    },
  ],
  i18n: darkwingsGasDeviceI18n,
};
