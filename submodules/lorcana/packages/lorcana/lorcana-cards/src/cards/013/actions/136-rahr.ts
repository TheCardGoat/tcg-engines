import type { ActionCard } from "@tcg/lorcana-types";
import { rahrI18n } from "./136-rahr.i18n";

export const rahr: ActionCard = {
  id: "rm3",
  canonicalId: "ci_rm3",
  slug: "lorcana-ci_rm3",
  printings: [
    {
      id: "set13-136",
      artId: "set13-136",
      setCode: "set13",
      collectorNumber: "136",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-136"],
  cardType: "action",
  name: "RAHR!",
  inkType: ["ruby"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 136,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a7298b97da7e4414b0b9c6eaebeb0bcd",
  },
  text: "Chosen character gets +3 {S} this turn.",
  abilities: [
    {
      type: "action",
      text: "Chosen character gets +3 {S} this turn.",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        duration: "this-turn",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
  i18n: rahrI18n,
};
