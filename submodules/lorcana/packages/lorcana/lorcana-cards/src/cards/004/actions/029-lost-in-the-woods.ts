import type { ActionCard } from "@tcg/lorcana-types";
import { lostInTheWoodsI18n } from "./029-lost-in-the-woods.i18n";

export const lostInTheWoods: ActionCard = {
  id: "JHR",
  canonicalId: "ci_HNA",
  reprints: ["set4-029", "set9-028"],
  cardType: "action",
  name: "Lost in the Woods",
  inkType: ["amber"],
  franchise: "Frozen",
  set: "004",
  cardNumber: 29,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_fbdf8cd3fdd840c6b1a52b64d63e2fee",
    tcgPlayer: 649975,
  },
  text: "All opposing characters get -2 {S} until the start of your next turn.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        duration: "until-start-of-next-turn",
        target: "ALL_OPPOSING_CHARACTERS",
      },
    },
  ],
  i18n: lostInTheWoodsI18n,
};
