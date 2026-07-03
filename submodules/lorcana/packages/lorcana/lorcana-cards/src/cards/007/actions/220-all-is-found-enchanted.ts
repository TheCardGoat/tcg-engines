import type { ActionCard } from "@tcg/lorcana-types";
import { allIsFoundEnchantedI18n } from "./220-all-is-found-enchanted.i18n";

export const allIsFoundEnchanted: ActionCard = {
  id: "4F6",
  canonicalId: "ci_Qon",
  slug: "lorcana-ci_Qon",
  printings: [
    {
      id: "set7-220-enchanted",
      artId: "ci_Qon-enchanted",
      setCode: "set7",
      collectorNumber: "220",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set7-178"],
  cardType: "action",
  name: "All Is Found",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "007",
  cardNumber: 220,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_0fa2b60dcf3d46fbb5e61428e33d7d7d",
    tcgPlayer: "619748",
  },
  text: "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        exerted: true,
        facedown: true,
        source: "discard",
        target: {
          selector: "chosen",
          count: {
            upTo: 2,
          },
          owner: "you",
          zones: ["discard"],
        },
        type: "put-into-inkwell",
      },
      id: "138-1",
      text: "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
      type: "action",
    },
  ],
  i18n: allIsFoundEnchantedI18n,
};
