import type { ActionCard } from "@tcg/lorcana-types";
import { cowerBeforeMeI18n } from "./198-cower-before-me.i18n";

export const cowerBeforeMe: ActionCard = {
  id: "jI0",
  canonicalId: "ci_jI0",
  slug: "lorcana-ci_jI0",
  printings: [
    {
      id: "set13-198",
      artId: "set13-198",
      setCode: "set13",
      collectorNumber: "198",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-198"],
  cardType: "action",
  name: "Cower Before Me!",
  inkType: ["steel"],
  franchise: "Sleeping Beauty",
  set: "013",
  cardNumber: 198,
  rarity: "common",
  cost: 2,
  inkable: false,
  text: "Up to 2 chosen opposing characters can't challenge during their next turn.",
  abilities: [
    {
      type: "action",
      text: "Up to 2 chosen opposing characters can't challenge during their next turn.",
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        duration: "their-next-turn",
        target: {
          selector: "chosen",
          count: { upTo: 2 },
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: cowerBeforeMeI18n,
};
