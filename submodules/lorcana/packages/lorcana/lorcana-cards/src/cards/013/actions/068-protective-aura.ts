import type { ActionCard } from "@tcg/lorcana-types";
import { protectiveAuraI18n } from "./068-protective-aura.i18n";

export const protectiveAura: ActionCard = {
  id: "rZl",
  canonicalId: "ci_rZl",
  slug: "lorcana-ci_rZl",
  printings: [
    {
      id: "set13-068",
      artId: "set13-068",
      setCode: "set13",
      collectorNumber: "68",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-068"],
  cardType: "action",
  name: "Protective Aura",
  inkType: ["amethyst"],
  franchise: "Robin Hood",
  set: "013",
  cardNumber: 68,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_91e3400d60684980b0cd74c9ba06e21f",
  },
  text: "Your Floodborn characters gain Evasive until the start of your next turn.",
  abilities: [
    {
      type: "action",
      text: "Your Floodborn characters gain Evasive until the start of your next turn.",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        duration: "until-start-of-next-turn",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Floodborn",
            },
          ],
        },
      },
    },
  ],
  i18n: protectiveAuraI18n,
};
