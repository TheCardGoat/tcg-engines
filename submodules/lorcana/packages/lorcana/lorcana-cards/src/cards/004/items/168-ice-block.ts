import type { ItemCard } from "@tcg/lorcana-types";
import { iceBlockI18n } from "./168-ice-block.i18n";

export const iceBlock: ItemCard = {
  id: "uYP",
  canonicalId: "ci_uYP",
  reprints: ["set4-168"],
  cardType: "item",
  name: "Ice Block",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  cardNumber: 168,
  rarity: "common",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_53adf0c7c527414ab222421a8b5e4ef3",
    tcgPlayer: 550615,
  },
  text: [
    {
      title: "CHILLY LABOR",
      description: "{E} — Chosen character gets -1 {S} this turn.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "this-turn",
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
      },
      id: "ssh-1",
      name: "CHILLY LABOR",
      text: "CHILLY LABOR {E} — Chosen character gets -1 {S} this turn.",
      type: "activated",
    },
  ],
  i18n: iceBlockI18n,
};
