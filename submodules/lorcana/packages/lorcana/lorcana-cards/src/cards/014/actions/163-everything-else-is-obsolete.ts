import type { ActionCard } from "@tcg/lorcana-types";
import { everythingElseIsObsoleteI18n } from "./163-everything-else-is-obsolete.i18n";

export const everythingElseIsObsolete: ActionCard = {
  id: "UNK",
  canonicalId: "ci_UNK",
  slug: "lorcana-ci_UNK",
  printings: [
    {
      id: "set14-163",
      artId: "set14-163",
      setCode: "set14",
      collectorNumber: "163",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-163"],
  cardType: "action",
  name: "Everything Else Is Obsolete",
  inkType: ["sapphire"],
  franchise: "Aristocats",
  set: "014",
  cardNumber: 163,
  rarity: "common",
  cost: 3,
  inkable: true,
  text: "Look at the top 3 cards of your deck. Put one into your inkwell facedown and exerted, one on the top of your deck, and one on the bottom of your deck.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Look at the top 3 cards of your deck. Put one into your inkwell facedown and exerted, one on the top of your deck, and one on the bottom of your deck.",
      effect: {
        type: "scry",
        amount: 3,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "inkwell",
            min: 1,
            max: 1,
            facedown: true,
            exerted: true,
          },
          {
            zone: "deck-top",
            requiresLookedAtLeast: 2,
            min: 1,
            max: 1,
          },
          {
            zone: "deck-bottom",
            requiresLookedAtLeast: 3,
            min: 1,
            max: 1,
            ordering: "player-choice",
          },
        ],
      },
    },
  ],
  i18n: everythingElseIsObsoleteI18n,
};
