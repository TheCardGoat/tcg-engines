import type { ActionCard } from "@tcg/lorcana-types";
import { allIsFoundI18n } from "./178-all-is-found.i18n";

export const allIsFound: ActionCard = {
  id: "OTu",
  canonicalId: "ci_Qon",
  reprints: ["set7-178"],
  cardType: "action",
  name: "All Is Found",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "007",
  cardNumber: 178,
  rarity: "rare",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_0fa2b60dcf3d46fbb5e61428e33d7d7d",
    tcgPlayer: 619748,
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
  i18n: allIsFoundI18n,
};
