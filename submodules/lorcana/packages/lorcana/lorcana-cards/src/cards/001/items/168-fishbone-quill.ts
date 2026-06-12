import type { ItemCard } from "@tcg/lorcana-types";
import { fishboneQuillI18n } from "./168-fishbone-quill.i18n";

export const fishboneQuill: ItemCard = {
  id: "UUs",
  canonicalId: "ci_UUs",
  reprints: ["set1-168"],
  cardType: "item",
  name: "Fishbone Quill",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "001",
  cardNumber: 168,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_33db0577186a4483aa85190fd0496d90",
    tcgPlayer: 508830,
  },
  text: [
    {
      title: "GO AHEAD AND SIGN",
      description: "{E} — Put any card from your hand into your inkwell facedown.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        exerted: false,
        facedown: true,
        source: "hand",
        target: "CONTROLLER",
        type: "put-into-inkwell",
      },
      id: "k4a-1",
      name: "GO AHEAD AND SIGN",
      text: "GO AHEAD AND SIGN {E} — Put any card from your hand into your inkwell facedown.",
      type: "activated",
    },
  ],
  i18n: fishboneQuillI18n,
};
