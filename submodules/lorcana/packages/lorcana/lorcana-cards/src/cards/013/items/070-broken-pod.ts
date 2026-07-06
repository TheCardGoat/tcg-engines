import type { ItemCard } from "@tcg/lorcana-types";
import { brokenPodI18n } from "./070-broken-pod.i18n";

export const brokenPod: ItemCard = {
  id: "L8A",
  canonicalId: "ci_L8A",
  slug: "lorcana-ci_L8A",
  printings: [
    {
      id: "set13-070",
      artId: "set13-070",
      setCode: "set13",
      collectorNumber: "70",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-070"],
  cardType: "item",
  name: "Broken Pod",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "013",
  cardNumber: 70,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c438445c14b24148818de7ef8e0f0ac0",
  },
  text: [
    {
      title: "RENEWAL PROCESS",
      description:
        "{E}, 1 {I} — Put a card from chosen player's discard on the bottom of their deck.",
    },
  ],
  abilities: [
    {
      type: "activated",
      name: "RENEWAL PROCESS",
      text: "RENEWAL PROCESS {E}, 1 {I} — Put a card from chosen player's discard on the bottom of their deck.",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "put-on-bottom",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["discard"],
        },
      },
    },
  ],
  i18n: brokenPodI18n,
};
