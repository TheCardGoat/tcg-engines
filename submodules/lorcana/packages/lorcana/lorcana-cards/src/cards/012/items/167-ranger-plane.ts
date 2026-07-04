import type { ItemCard } from "@tcg/lorcana-types";
import { rangerPlaneI18n } from "./167-ranger-plane.i18n";

export const rangerPlane: ItemCard = {
  id: "WTA",
  canonicalId: "ci_WTA",
  slug: "lorcana-ci_WTA",
  printings: [
    {
      id: "set12-167",
      artId: "set12-167",
      setCode: "set12",
      collectorNumber: "167",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set12-167"],
  cardType: "item",
  name: "Ranger Plane",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 167,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_f9616f640bae49f5811aa5ecff83d6a8",
    tcgPlayer: "692190",
  },
  text: [
    {
      title: "AIR SUPPORT",
      description:
        "Your characters gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
    },
    {
      title: "BIG LIFT",
      description: "{E} — Chosen character with 10 {S} or more gets +3 {L} this turn.",
    },
  ],
  abilities: [
    {
      id: "WTA-1",
      name: "AIR SUPPORT",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "AIR SUPPORT Your characters gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
    },
    {
      id: "WTA-2",
      name: "BIG LIFT",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 3,
        duration: "this-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "strength-comparison",
              comparison: "greater-or-equal",
              value: 10,
            },
          ],
        },
      },
      text: "BIG LIFT {E} — Chosen character with 10 {S} or more gets +3 {L} this turn.",
    },
  ],
  i18n: rangerPlaneI18n,
};
