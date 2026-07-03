import type { ActionCard } from "@tcg/lorcana-types";
import { ifIDidntHaveYouI18n } from "./032-if-i-didnt-have-you.i18n";

export const ifIDidntHaveYou: ActionCard = {
  id: "3Jh",
  canonicalId: "ci_3Jh",
  slug: "lorcana-ci_3Jh",
  printings: [
    {
      id: "set13-032",
      artId: "set13-032",
      setCode: "set13",
      collectorNumber: "32",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-032"],
  cardType: "action",
  name: "If I Didn't Have You",
  inkType: ["amber"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 32,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_93ddde65a0ac4c4aa83ef2418e5472ae",
  },
  text: "You and another chosen player each draw 2 cards.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "You and another chosen player each draw 2 cards.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
          {
            type: "draw",
            amount: 2,
            target: "CHOSEN_PLAYER",
          },
        ],
      },
    },
  ],
  i18n: ifIDidntHaveYouI18n,
};
