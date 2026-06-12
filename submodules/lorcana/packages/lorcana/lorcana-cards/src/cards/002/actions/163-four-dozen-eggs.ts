import type { ActionCard } from "@tcg/lorcana-types";
import { fourDozenEggsI18n } from "./163-four-dozen-eggs.i18n";

export const fourDozenEggs: ActionCard = {
  id: "Ydi",
  canonicalId: "ci_Y4g",
  reprints: ["set2-163", "set9-164"],
  cardType: "action",
  name: "Four Dozen Eggs",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 163,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_afa9023a2aeb4569bad0116e638821fa",
    tcgPlayer: 650098,
  },
  text: "Your characters gain Resist +2 until the start of your next turn.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
        duration: "until-start-of-next-turn",
        target: "YOUR_CHARACTERS",
      },
    },
  ],
  i18n: fourDozenEggsI18n,
};
