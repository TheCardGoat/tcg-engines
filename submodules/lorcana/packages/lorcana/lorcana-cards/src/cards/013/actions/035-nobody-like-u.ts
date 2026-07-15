import type { ActionCard } from "@tcg/lorcana-types";
import { nobodyLikeUI18n } from "./035-nobody-like-u.i18n";

import { singTogether } from "../../../helpers/abilities/singTogether";

export const nobodyLikeU: ActionCard = {
  id: "pE4",
  canonicalId: "ci_pE4",
  slug: "lorcana-ci_pE4",
  printings: [
    {
      id: "set13-035",
      artId: "set13-035",
      setCode: "set13",
      collectorNumber: "35",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-035"],
  cardType: "action",
  name: "Nobody Like U",
  inkType: ["amber"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 35,
  rarity: "rare",
  cost: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_75d00cba7421498eb3495416f8046095",
  },
  text: [
    {
      title: "Sing Together 5",
      description:
        "(Any number of your or your teammates' characters with total cost 5 or more may exert to sing this song for free.)",
    },
    {
      title: "Play a character with cost 4 of less for free.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    singTogether(5),
    {
      type: "action",
      text: "Play a character with cost 4 of less for free.",
      effect: {
        type: "play-card",
        from: "hand",
        cardType: "character",
        cost: "free",
        filter: {
          maxCost: 4,
        },
      },
    },
  ],
  i18n: nobodyLikeUI18n,
};
