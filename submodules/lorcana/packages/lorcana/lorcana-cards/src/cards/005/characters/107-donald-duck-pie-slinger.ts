import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckPieSlingerI18n } from "./107-donald-duck-pie-slinger.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const donaldDuckPieSlinger: CharacterCard = {
  id: "ZiJ",
  canonicalId: "ci_gl4",
  slug: "lorcana-ci_gl4",
  printings: [
    {
      id: "set5-107",
      artId: "set5-107",
      setCode: "set5",
      collectorNumber: "107",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set5-107"],
  cardType: "character",
  name: "Donald Duck",
  version: "Pie Slinger",
  inkType: ["ruby"],
  set: "005",
  cardNumber: 107,
  rarity: "legendary",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_27e379eda1c04eabbf3be9fc19cda671",
    tcgPlayer: "668573",
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "HUMBLE PIE",
      description:
        "When you play this character, if you used Shift to play him, each opponent loses 2 lore.",
    },
    {
      title: "RAGING DUCK",
      description: "While an opponent has 10 or more lore, this character gets +6 {S}.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Knight"],
  abilities: [
    shift(4),
    {
      id: "14s-1",
      text: "HUMBLE PIE When you play this character, if you used Shift to play him, each opponent loses {d} lore.",
      name: "HUMBLE PIE",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        amount: 2,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      condition: {
        type: "used-shift",
      },
    },
    {
      id: "14s-2",
      text: "RAGING DUCK While an opponent has {d} or more lore, this character gets +{d} {S}.",
      name: "RAGING DUCK",
      type: "static",
      effect: {
        modifier: 6,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      condition: {
        comparison: "greater-or-equal",
        left: {
          controller: "opponent",
          type: "lore",
        },
        right: {
          type: "constant",
          value: 10,
        },
        type: "comparison",
      },
    },
  ],
  i18n: donaldDuckPieSlingerI18n,
};
