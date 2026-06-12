import type { ItemCard } from "@tcg/lorcana-types";
import { tinyTimsCrutchI18n } from "./167-tiny-tims-crutch.i18n";

export const tinyTimsCrutch: ItemCard = {
  id: "WxQ",
  canonicalId: "ci_WxQ",
  reprints: ["set11-167"],
  cardType: "item",
  name: "Tiny Tim's Crutch",
  inkType: ["sapphire"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 167,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f87c783d2fe2456687533d4b5f641131",
    tcgPlayer: 676231,
  },
  text: [
    {
      title: "AT YOUR SIDE",
      description:
        "{E} — Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
    },
  ],
  abilities: [
    {
      id: "r0b-1",
      name: "AT YOUR SIDE",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        keyword: "Support",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        duration: "this-turn",
      },
      text: "AT YOUR SIDE {E} — Chosen character gains Support this turn.",
    },
  ],
  i18n: tinyTimsCrutchI18n,
};
