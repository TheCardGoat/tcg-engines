import type { ActionCard } from "@tcg/lorcana-types";
import { aDarkAgeNoMoreI18n } from "./162-a-dark-age-no-more.i18n";

export const aDarkAgeNoMore: ActionCard = {
  id: "DSF",
  canonicalId: "ci_DSF",
  slug: "lorcana-ci_DSF",
  printings: [
    {
      id: "set14-162",
      artId: "set14-162",
      setCode: "set14",
      collectorNumber: "162",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-162"],
  cardType: "action",
  name: "A Dark Age No More",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 162,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_c5aa84b2f0d743aeb84d5df0c62eca5a",
  },
  text: "Put the top card of your deck into your inkwell facedown and exerted. Get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
  abilities: [
    {
      type: "action",
      text: "Put the top card of your deck into your inkwell facedown and exerted. Get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "put-into-inkwell",
            source: "top-of-deck",
            target: "CONTROLLER",
            facedown: true,
            exerted: true,
          },
          {
            type: "gain-ink-drop",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: aDarkAgeNoMoreI18n,
};
