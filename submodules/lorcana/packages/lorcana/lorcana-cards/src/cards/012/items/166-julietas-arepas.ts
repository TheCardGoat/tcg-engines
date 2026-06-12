import type { ItemCard } from "@tcg/lorcana-types";
import { julietasArepasI18n } from "./166-julietas-arepas.i18n";

export const julietasArepas: ItemCard = {
  id: "gFH",
  canonicalId: "ci_gFH",
  reprints: ["set12-166"],
  cardType: "item",
  name: "Julieta's Arepas",
  inkType: ["sapphire"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 166,
  rarity: "common",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_800457a096c74a15b1ac1d9aece16efb",
  },
  text: [
    {
      title: "FLAVORFUL CURE",
      description:
        "At the start of your turn, if you have a Madrigal character in play, remove up to 2 damage from chosen character.",
    },
    {
      title: "THAT DID THE TRICK",
      description: "{E} — If you removed damage from a character this turn, gain 1 lore.",
    },
  ],
  abilities: [
    {
      id: "gFH-1",
      name: "FLAVORFUL CURE",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "has-character-with-classification",
        classification: "Madrigal",
        controller: "you",
      },
      effect: {
        type: "remove-damage",
        amount: {
          type: "up-to",
          value: 2,
        },
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "FLAVORFUL CURE At the start of your turn, if you have a Madrigal character in play, remove up to 2 damage from chosen character.",
    },
    {
      id: "gFH-2",
      name: "THAT DID THE TRICK",
      type: "activated",
      cost: {
        exert: true,
      },
      condition: {
        type: "turn-metric",
        metric: "damage-removed-by-player",
        playerScope: "you",
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "THAT DID THE TRICK {E} — If you removed damage from a character this turn, gain 1 lore.",
    },
  ],
  i18n: julietasArepasI18n,
};
